"""Strategie di esempio: ``train_returns -> pesi``.

Una "strategia" è un callable che, dati i rendimenti di train (date × ticker),
restituisce una ``pd.Series`` di pesi indicizzata per ticker. È l'aggancio con lo
Stadio 2 (optimization): quando l'ottimizzatore sarà pronto, le sue funzioni
avranno questa stessa firma e potranno essere passate ai runner di backtest.

Qui forniamo due baseline deterministiche e senza ottimizzatore, utili per test
e demo.
"""

from __future__ import annotations

import pandas as pd


def equal_weight(train_returns: pd.DataFrame) -> pd.Series:
    """Pesi uguali su tutti gli strumenti (1/N)."""
    cols = train_returns.columns
    return pd.Series(1.0 / len(cols), index=cols)


def inverse_volatility(train_returns: pd.DataFrame) -> pd.Series:
    """Pesi inversamente proporzionali alla volatilità (risk parity ingenuo).

    ``w_i ∝ 1/σ_i``, normalizzati a somma 1. Strumenti a vol nulla → peso 0.
    """
    vol = train_returns.std(ddof=1)
    inv = (1.0 / vol.where(vol > 0)).fillna(0.0)
    total = inv.sum()
    if total == 0:
        return equal_weight(train_returns)
    return inv / total
