"""Alpha Crash — versione BASE (Stadio 1, Strato 4) — spec §5.

La meno prioritaria delle cinque colonne. Concettualmente una strategia long/short
che rende nei crash. Qui una **versione base documentata**: time-series momentum
(12-1) con un tilt stagionale semplice e sizing inverso alla volatilità. Il momentum
di serie storica fornisce protezione nei crash perché va SHORT nei ribassi prolungati.

NON è la versione completa di AlgoEagle (futures, stagionalità fine, inverse-vol
portfolio): è l'impalcatura, da raffinare in seguito.
"""

from __future__ import annotations

import numpy as np
import pandas as pd

from .base import Signal, _frame, _slice, _squash

# Mesi "favorevoli" (stagionalità tipo "sell in May"): inverno forte, estate debole.
_FAVORABLE_MONTHS = {11, 12, 1, 2, 3, 4}


class AlphaCrashSignal(Signal):
    """Time-series momentum (12-1) × tilt stagionale, sizing inverso alla vol.

    - direzione: segno del momentum a 12 mesi escludendo l'ultimo (long se positivo,
      short se negativo → protezione nei ribassi prolungati);
    - probabilità: forza del momentum (tanh), amplificata/smorzata dalla stagione
      e ridotta dalla volatilità recente (inverse-vol sizing).
    """

    name = "alpha_crash"

    def __init__(self, lookback: int = 252, skip: int = 21):
        self.lookback = lookback
        self.skip = skip

    def compute(self, returns, prices, *, as_of=None) -> pd.DataFrame:
        px = _slice(prices, as_of)
        if len(px) <= self.lookback:
            return _frame(pd.Series(0, index=px.columns), pd.Series(0.0, index=px.columns), px.columns)

        # momentum 12-1: rendimento da t-lookback a t-skip
        mom = px.iloc[-1 - self.skip] / px.iloc[-self.lookback] - 1.0
        direction = pd.Series(np.sign(mom).fillna(0).astype(int), index=px.columns)

        vol = px.pct_change().rolling(21).std().iloc[-1]        # vol recente
        inv_vol = (vol.median() / vol.replace(0, np.nan)).clip(upper=1.5).fillna(0.0)
        season = 1.2 if (as_of or px.index[-1]).month in _FAVORABLE_MONTHS else 0.8
        prob = (_squash(mom, scale=0.15) * inv_vol * season).clip(0.0, 1.0)
        return _frame(direction, prob, px.columns)
