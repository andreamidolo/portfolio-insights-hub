"""SUMMARY — combinazione dei segnali + ponte verso Black-Litterman (spec §3).

Fonde i vari segnali (direzione + probabilità) in un giudizio unico per strumento,
con pesi che POSSONO essere modulati dal regime (passato come PARAMETRO — il
regime NON si calcola qui). Il SUMMARY diventa poi le *views* per
``BlackLitterman.fit_weights``: il ponte predisposto in Fase 3.
"""

from __future__ import annotations

import numpy as np
import pandas as pd

from aa_engine.data import Regime

from .base import DIRECTION, PROBABILITY, _frame

# Pesi base di ciascun segnale nel SUMMARY (modificabili).
BASE_WEIGHTS: dict[str, float] = {
    "trend": 1.0,
    "oscillator": 0.8,
    "ai_forecast": 1.0,
    "alpha_crash": 0.6,
}

# Modulazione per regime: "la potenza predittiva di ogni segnale cambia col regime"
# (AlgoEagle). In BEAR il trend-following è meno affidabile, la mean-reversion e la
# protezione contano di più. Fattori moltiplicativi sui pesi base.
REGIME_TILT: dict[str, dict[int, float]] = {
    "trend": {int(Regime.BULL): 1.25, int(Regime.BEAR): 0.75},
    "oscillator": {int(Regime.BULL): 0.85, int(Regime.BEAR): 1.20},
    "ai_forecast": {int(Regime.BULL): 1.0, int(Regime.BEAR): 1.0},
    "alpha_crash": {int(Regime.BULL): 0.70, int(Regime.BEAR): 1.40},
}


def _regime_for(ticker: str, regime) -> int | None:
    if regime is None:
        return None
    if isinstance(regime, pd.Series):
        val = regime.get(ticker)
        return None if val is None else int(val)
    return int(regime)                     # scalare (Regime o int) per tutti


def summary_signal(
    signals: dict[str, pd.DataFrame],
    *,
    regime: pd.Series | Regime | int | None = None,
    weights: dict[str, float] | None = None,
    deadband: float = 0.05,
) -> pd.DataFrame:
    """Combina i segnali in un SUMMARY per strumento.

    Parametri
    ---------
    signals : dict[name -> DataFrame[direction, probability]]
    regime : Series[ticker] | Regime | int | None
        Se presente, modula i pesi dei segnali (vedi ``REGIME_TILT``).
    weights : dict[name -> float] | None   pesi base (default ``BASE_WEIGHTS``)
    deadband : float                        |score| sotto cui la direzione è 0

    Combinazione: ``score_i = Σ_s w_s · dir_{s,i} · prob_{s,i} / Σ_s w_s`` ∈ [−1,1].
    Output: ``[direction, probability]`` con direction = segno(score) e
    probability = |score|.
    """
    base = {**BASE_WEIGHTS, **(weights or {})}
    tickers = sorted({t for df in signals.values() for t in df.index})

    num = pd.Series(0.0, index=tickers)
    den = pd.Series(0.0, index=tickers)
    for name, df in signals.items():
        d = df[DIRECTION].reindex(tickers).fillna(0.0)
        p = df[PROBABILITY].reindex(tickers).fillna(0.0)
        w = pd.Series(base.get(name, 1.0), index=tickers)
        if regime is not None and name in REGIME_TILT:
            tilt = REGIME_TILT[name]
            w = pd.Series(
                [base.get(name, 1.0) * tilt.get(_regime_for(t, regime), 1.0) for t in tickers],
                index=tickers,
            )
        num += w * d * p
        den += w
    score = (num / den.replace(0, np.nan)).fillna(0.0)

    direction = pd.Series(0, index=tickers)
    direction[score > deadband] = 1
    direction[score < -deadband] = -1
    return _frame(direction, score.abs(), tickers)


def summary_to_bl_views(
    summary: pd.DataFrame,
    *,
    daily_scale: float = 0.0008,
    min_probability: float = 0.10,
) -> dict[str, float]:
    """Traduce il SUMMARY in *views* assolute per ``BlackLitterman.fit_weights``.

    direzione = segno della view; probabilità = confidenza → magnitudine.
    View (rendimento atteso giornaliero) = ``direction · probability · daily_scale``.
    A piena confidenza ≈ 0.0008/g ≈ 20%/anno (view forte ma non assurda). Le
    posizioni con direzione 0 o confidenza < ``min_probability`` sono escluse.

    Ritorna ``{ticker: rendimento_atteso_giornaliero}``.
    """
    views: dict[str, float] = {}
    for ticker, row in summary.iterrows():
        d, p = int(row[DIRECTION]), float(row[PROBABILITY])
        if d == 0 or p < min_probability:
            continue
        views[ticker] = d * p * daily_scale
    return views
