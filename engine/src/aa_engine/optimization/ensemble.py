"""Orchestratore multi-modello + selettore "4 migliori" (spec §4).

Meccanismo centrale di AlgoEagle: gira N modelli, valuta ciascuno OUT-OF-SAMPLE
col walk-forward della Fase 2.5, seleziona gli ``n_best`` e fa la **media semplice**
dei loro pesi.

⚠️ Anti-overfitting: la valutazione è out-of-sample (walk-forward), non sullo
stesso periodo su cui i pesi sono stimati. Per questo la Fase 2.5 viene PRIMA.
"""

from __future__ import annotations

from abc import ABC, abstractmethod
from dataclasses import dataclass

import numpy as np
import pandas as pd

from aa_engine.backtest import WalkForwardSplitter, walk_forward_backtest
from aa_engine.backtest.results import BacktestResult

from .base import OptModel, PortfolioConstraints, enforce_caps, equal_weights


# --------------------------------------------------------------------------- #
# Scorer pluggable: come si misura "il migliore" (decisione di chat di progetto)
# --------------------------------------------------------------------------- #
class Scorer(ABC):
    name: str = "scorer"

    @abstractmethod
    def score(self, result: BacktestResult) -> float:
        """Punteggio (più alto = meglio) da un risultato di backtest OOS."""
        raise NotImplementedError


class SharpeScorer(Scorer):
    name = "sharpe"

    def score(self, result: BacktestResult) -> float:
        return _finite(result.stats.sharpe if result.stats else float("nan"))


class CalmarScorer(Scorer):
    """Calmar = CAGR / MaxDD (default): premia il rendimento per unità di drawdown."""

    name = "calmar"

    def score(self, result: BacktestResult) -> float:
        return _finite(result.stats.calmar if result.stats else float("nan"))


def _finite(x: float) -> float:
    return float(x) if x is not None and np.isfinite(x) else float("-inf")


# --------------------------------------------------------------------------- #
# Risultato
# --------------------------------------------------------------------------- #
@dataclass
class EnsembleResult:
    weights_by_model: dict[str, pd.Series]
    scores: dict[str, float]
    selected: list[str]
    final_weights: pd.Series
    scorer: str
    n_best: int

    def scores_frame(self) -> pd.DataFrame:
        df = pd.DataFrame(
            {"score": pd.Series(self.scores)}
        ).sort_values("score", ascending=False)
        df["selected"] = df.index.isin(self.selected)
        return df


# --------------------------------------------------------------------------- #
# Ensemble
# --------------------------------------------------------------------------- #
class OptimizationEnsemble:
    """Esegue N modelli, ne sceglie ``n_best`` via walk-forward, media i pesi."""

    def __init__(self, models: list[OptModel], n_best: int = 4):
        if not models:
            raise ValueError("Serve almeno un modello.")
        self.models = models
        self.n_best = n_best

    def _default_splitter(self, n: int) -> WalkForwardSplitter:
        train = max(60, n // 2)
        test = max(21, n // 6)
        return WalkForwardSplitter(train_size=train, test_size=test)

    def run(
        self,
        returns: pd.DataFrame,
        *,
        regime_mask: pd.Series | None = None,
        views: dict | None = None,
        constraints: PortfolioConstraints | None = None,
        scorer: Scorer | None = None,
        splitter: WalkForwardSplitter | None = None,
    ) -> EnsembleResult:
        scorer = scorer or CalmarScorer()
        splitter = splitter or self._default_splitter(len(returns))

        weights_by_model: dict[str, pd.Series] = {}
        scores: dict[str, float] = {}

        for model in self.models:
            # 1. allocazione finale: fit sull'intera storia (regime-filtrata)
            try:
                w = model.fit_weights(
                    returns, regime_mask=regime_mask, views=views, constraints=constraints
                )
            except Exception:  # pragma: no cover - robustezza a solver instabili
                continue
            weights_by_model[model.name] = w

            # 2. valutazione OUT-OF-SAMPLE via walk-forward (no regime mask per-fold)
            def strategy(train, _m=model):
                return _m.fit_weights(train, views=views, constraints=constraints)

            try:
                result = walk_forward_backtest(returns, strategy, splitter)
                scores[model.name] = scorer.score(result)
            except Exception:  # pragma: no cover
                scores[model.name] = float("-inf")

        # 3. seleziona gli n_best per score
        ranked = sorted(scores, key=lambda k: scores[k], reverse=True)
        selected = ranked[: self.n_best]

        # 4. allocazione finale = media semplice dei pesi dei migliori
        if selected:
            final = sum(weights_by_model[name] for name in selected) / len(selected)
            final = enforce_caps(final, constraints)
        else:  # nessun modello valido: fallback baseline
            final = equal_weights(returns.columns)

        return EnsembleResult(
            weights_by_model=weights_by_model,
            scores=scores,
            selected=selected,
            final_weights=final,
            scorer=scorer.name,
            n_best=self.n_best,
        )
