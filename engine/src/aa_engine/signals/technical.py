"""Segnali tecnici deterministici (Stadio 1, Strato 1) — spec §2.

Pochi indicatori robusti (non 40): un trend-follower e un oscillatore. Nessun ML,
nessun lookahead (tutto calcolato su prezzi fino ad ``as_of``).
"""

from __future__ import annotations

import numpy as np
import pandas as pd

from .base import Signal, _frame, _slice, _squash


class TrendSignal(Signal):
    """Forza/direzione del trend: incrocio MA breve/lunga + slope normalizzato.

    - direzione: +1 se MA_breve > MA_lunga (uptrend), −1 se sotto, 0 se ~uguali;
    - probabilità: forza = distanza relativa fra le MA, mappata su [0,1] (tanh).
    """

    name = "trend"

    def __init__(self, short: int = 50, long: int = 200, deadband: float = 0.005):
        self.short = short
        self.long = long
        self.deadband = deadband        # zona morta attorno a 0 → direzione 0

    def compute(self, returns, prices, *, as_of=None) -> pd.DataFrame:
        px = _slice(prices, as_of)
        ma_s = px.rolling(self.short, min_periods=self.short // 2).mean().iloc[-1]
        ma_l = px.rolling(self.long, min_periods=self.long // 2).mean().iloc[-1]
        rel = (ma_s - ma_l) / ma_l.replace(0, np.nan)      # distanza relativa fra MA
        direction = pd.Series(0, index=px.columns)
        direction[rel > self.deadband] = 1
        direction[rel < -self.deadband] = -1
        prob = _squash(rel.fillna(0.0), scale=0.05)        # 5% di gap → forza ~0.76
        return _frame(direction, prob, px.columns)


class OscillatorSignal(Signal):
    """Overbought/oversold via RSI (Wilder). Logica di mean-reversion.

    - RSI < oversold  → direzione +1 (rimbalzo atteso);
    - RSI > overbought → direzione −1 (correzione attesa);
    - altrimenti 0.
    - probabilità: quanto l'RSI è estremo oltre la soglia, mappato su [0,1].
    """

    name = "oscillator"

    def __init__(self, window: int = 14, oversold: float = 30.0, overbought: float = 70.0):
        self.window = window
        self.oversold = oversold
        self.overbought = overbought

    def _rsi(self, px: pd.DataFrame) -> pd.Series:
        delta = px.diff()
        gain = delta.clip(lower=0.0)
        loss = -delta.clip(upper=0.0)
        # media esponenziale di Wilder
        avg_gain = gain.ewm(alpha=1 / self.window, min_periods=self.window).mean().iloc[-1]
        avg_loss = loss.ewm(alpha=1 / self.window, min_periods=self.window).mean().iloc[-1]
        rs = avg_gain / avg_loss.replace(0, np.nan)
        return 100 - 100 / (1 + rs)

    def compute(self, returns, prices, *, as_of=None) -> pd.DataFrame:
        px = _slice(prices, as_of)
        rsi = self._rsi(px)
        direction = pd.Series(0, index=px.columns)
        direction[rsi < self.oversold] = 1
        direction[rsi > self.overbought] = -1
        # forza = distanza dalla soglia, normalizzata sull'ampiezza estrema (0..30)
        extremity = pd.Series(0.0, index=px.columns)
        extremity[rsi < self.oversold] = (self.oversold - rsi[rsi < self.oversold]) / self.oversold
        extremity[rsi > self.overbought] = (
            (rsi[rsi > self.overbought] - self.overbought) / (100 - self.overbought)
        )
        return _frame(direction, extremity, px.columns)
