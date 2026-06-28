"""Esecuzione del backtest: applica una strategia ai fold di uno splitter.

Una **strategia** è un callable ``train_returns(DataFrame) -> pesi(Series)``
(vedi ``strategies.py``). Per ogni fold: si stimano i pesi sul train e si
applicano al test, ottenendo i rendimenti di portafoglio out-of-sample.
"""

from __future__ import annotations

from typing import Callable

import pandas as pd

from .performance import TRADING_DAYS, performance_summary
from .results import BacktestResult, FoldResult
from .splitters import CombinatorialPurgedCV, WalkForwardSplitter

Strategy = Callable[[pd.DataFrame], pd.Series]


def _portfolio_oos(test_returns: pd.DataFrame, weights: pd.Series) -> pd.Series:
    """Rendimenti di portafoglio out-of-sample dati i pesi del train."""
    w = weights.reindex(test_returns.columns).fillna(0.0)
    return test_returns.mul(w, axis=1).sum(axis=1)


def _run_folds(
    returns: pd.DataFrame,
    strategy: Strategy,
    splits,
    *,
    periods_per_year: int,
    rf: float,
    mar: float,
) -> list[FoldResult]:
    folds: list[FoldResult] = []
    for i, (train_idx, test_idx) in enumerate(splits):
        train = returns.iloc[train_idx]
        test = returns.iloc[test_idx]
        weights = strategy(train)
        oos = _portfolio_oos(test, weights)
        stats = performance_summary(
            oos, periods_per_year=periods_per_year, rf=rf, mar=mar
        )
        folds.append(
            FoldResult(
                fold=i,
                train_size=len(train_idx),
                test_size=len(test_idx),
                weights=weights,
                oos_returns=oos,
                stats=stats,
            )
        )
    return folds


def walk_forward_backtest(
    returns: pd.DataFrame,
    strategy: Strategy,
    splitter: WalkForwardSplitter,
    *,
    periods_per_year: int = TRADING_DAYS,
    rf: float = 0.0,
    mar: float = 0.0,
) -> BacktestResult:
    """Backtest walk-forward: le finestre di test (disgiunte) formano un path OOS.

    Ritorna un ``BacktestResult`` con la serie OOS concatenata e le sue statistiche
    di performance, oltre ai risultati per fold.
    """
    folds = _run_folds(
        returns, strategy, splitter.split(returns),
        periods_per_year=periods_per_year, rf=rf, mar=mar,
    )
    if not folds:
        raise ValueError(
            "Nessun fold generato: train_size+test_size eccede la storia disponibile."
        )
    oos = pd.concat([f.oos_returns for f in folds]).sort_index()
    oos = oos[~oos.index.duplicated(keep="first")]
    stats = performance_summary(oos, periods_per_year=periods_per_year, rf=rf, mar=mar)
    return BacktestResult(method="walk_forward", folds=folds, oos_returns=oos, stats=stats)


def cpcv_backtest(
    returns: pd.DataFrame,
    strategy: Strategy,
    cv: CombinatorialPurgedCV,
    *,
    periods_per_year: int = TRADING_DAYS,
    rf: float = 0.0,
    mar: float = 0.0,
) -> BacktestResult:
    """Backtest con Combinatorial Purged CV: distribuzione della performance.

    I fold si sovrappongono (test groups combinatori); il risultato espone la
    *distribuzione* delle metriche sui fold (``distribution`` / ``fold_stats_frame``),
    non un singolo path OOS.
    """
    folds = _run_folds(
        returns, strategy, cv.split(returns),
        periods_per_year=periods_per_year, rf=rf, mar=mar,
    )
    return BacktestResult(method="cpcv", folds=folds, oos_returns=None, stats=None)
