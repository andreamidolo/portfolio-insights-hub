"""Metriche di performance — riusano il risk engine (Stadio 4).

Roadmap §Fase 2.5: "Metriche di performance (CAGR, Sharpe, Sortino, Max DD,
Calmar) — riusare il risk engine". Volatilità, max drawdown e downside deviation
sono calcolati da ``aa_engine.risk.compute_measure`` (stessa convenzione di
annualizzazione), così backtest e risk panel parlano la stessa lingua.
"""

from __future__ import annotations

from dataclasses import asdict, dataclass

import pandas as pd

from aa_engine.risk import compute_measure

TRADING_DAYS = 252


@dataclass(frozen=True)
class PerformanceStats:
    """Sintesi di performance di una serie di rendimenti (out-of-sample)."""

    n_obs: int
    total_return: float       # rendimento composto cumulato (frazione)
    cagr: float               # compound annual growth rate (frazione)
    volatility: float         # dev. std annualizzata (×√P) — da risk engine (MV)
    sharpe: float             # (CAGR-equivalente ann. − rf) / volatilità
    sortino: float            # (ann. − MAR) / downside deviation (SLPM)
    max_drawdown: float       # MDD (frazione, positivo) — da risk engine
    calmar: float             # CAGR / MDD
    hit_ratio: float          # quota di giorni con rendimento > 0

    def as_dict(self) -> dict:
        return asdict(self)

    def to_series(self) -> pd.Series:
        return pd.Series(asdict(self))


def _as_frame(returns: pd.Series) -> tuple[pd.DataFrame, pd.Series]:
    """Avvolge una serie in (DataFrame 1-colonna, pesi=[1]) per il risk engine."""
    df = returns.to_frame("p")
    w = pd.Series([1.0], index=["p"])
    return df, w


def performance_summary(
    returns: pd.Series,
    *,
    periods_per_year: int = TRADING_DAYS,
    rf: float = 0.0,
    mar: float = 0.0,
) -> PerformanceStats:
    """Calcola le statistiche di performance di una serie di rendimenti.

    Parametri
    ---------
    returns : pd.Series        rendimenti per-periodo (es. giornalieri)
    periods_per_year : int     fattore di annualizzazione
    rf : float                 risk-free annuo per lo Sharpe (frazione)
    mar : float                Minimum Acceptable Return annuo per il Sortino

    Volatilità, max drawdown e downside deviation provengono dal risk engine.
    """
    r = returns.dropna()
    n = int(len(r))
    if n == 0:
        nan = float("nan")
        return PerformanceStats(0, nan, nan, nan, nan, nan, nan, nan, nan)

    df, w = _as_frame(r)
    total_return = float((1.0 + r).prod() - 1.0)
    cagr = float((1.0 + total_return) ** (periods_per_year / n) - 1.0) if total_return > -1 else float("nan")
    ann_return = float(r.mean()) * periods_per_year

    volatility = compute_measure(df, w, "MV", periods_per_year=periods_per_year)
    max_dd = compute_measure(df, w, "MDD", periods_per_year=periods_per_year)
    downside = compute_measure(df, w, "SLPM", mar=mar / periods_per_year, periods_per_year=periods_per_year)

    sharpe = (ann_return - rf) / volatility if volatility > 0 else float("nan")
    sortino = (ann_return - mar) / downside if downside > 0 else float("nan")
    calmar = cagr / max_dd if max_dd > 0 else float("nan")
    hit_ratio = float((r > 0).mean())

    return PerformanceStats(
        n_obs=n,
        total_return=total_return,
        cagr=cagr,
        volatility=float(volatility),
        sharpe=float(sharpe),
        sortino=float(sortino),
        max_drawdown=float(max_dd),
        calmar=float(calmar),
        hit_ratio=hit_ratio,
    )
