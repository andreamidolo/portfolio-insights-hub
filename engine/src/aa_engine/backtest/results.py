"""Contenitori dei risultati di backtest e report minimale."""

from __future__ import annotations

from dataclasses import dataclass, field

import numpy as np
import pandas as pd

from .performance import PerformanceStats


@dataclass(frozen=True)
class FoldResult:
    """Esito di un singolo fold (finestra di test out-of-sample)."""

    fold: int
    train_size: int
    test_size: int
    weights: pd.Series          # pesi prodotti dalla strategia sul train
    oos_returns: pd.Series      # rendimenti di portafoglio out-of-sample
    stats: PerformanceStats


@dataclass(frozen=True)
class BacktestResult:
    """Risultato complessivo di un backtest.

    - ``oos_returns``/``stats`` valorizzati per il walk-forward (path OOS unico,
      finestre disgiunte).
    - Per la CPCV i fold si sovrappongono: ``oos_returns`` è ``None`` e si guarda
      alla *distribuzione* dei fold (``fold_stats_frame`` / ``distribution``).
    """

    method: str
    folds: list[FoldResult] = field(default_factory=list)
    oos_returns: pd.Series | None = None
    stats: PerformanceStats | None = None

    @property
    def n_folds(self) -> int:
        return len(self.folds)

    def fold_stats_frame(self) -> pd.DataFrame:
        """Statistiche per fold come DataFrame (una riga per fold)."""
        rows = [{"fold": f.fold, **f.stats.as_dict()} for f in self.folds]
        return pd.DataFrame(rows)

    def distribution(self) -> pd.DataFrame:
        """Media/mediana/dev. std delle metriche sui fold (utile per la CPCV)."""
        frame = self.fold_stats_frame().drop(columns=["fold", "n_obs"], errors="ignore")
        return pd.DataFrame(
            {
                "mean": frame.mean(),
                "median": frame.median(),
                "std": frame.std(ddof=1),
            }
        )

    def summary(self) -> dict:
        """Riassunto serializzabile (per logging/JSON)."""
        out: dict = {"method": self.method, "n_folds": self.n_folds}
        if self.stats is not None:
            out["oos"] = self.stats.as_dict()
        if self.method == "cpcv" and self.folds:
            sharpe = self.fold_stats_frame()["sharpe"]
            out["sharpe_mean"] = float(np.nanmean(sharpe))
            out["sharpe_std"] = float(np.nanstd(sharpe, ddof=1))
        return out
