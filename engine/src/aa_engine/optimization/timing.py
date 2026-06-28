"""Gruppo A — modelli "timing"/euristici diretti (espansione Stadio 2).

Allocazioni in forma chiusa (niente solver): pesi proporzionali a una
caratteristica per strumento. Long-only, somma 1, cap via ``enforce_caps``.
"""

from __future__ import annotations

import pandas as pd

from .base import OptModel, PortfolioConstraints, apply_regime, enforce_caps, equal_weights


class _DirectModel(OptModel):
    """Base per modelli con pesi in forma chiusa da una caratteristica ``score``."""

    family = "classics"

    def _score(self, returns: pd.DataFrame) -> pd.Series:  # pragma: no cover - override
        raise NotImplementedError

    def fit_weights(
        self, returns, *, regime_mask=None, views=None,
        constraints: PortfolioConstraints | None = None,
    ) -> pd.Series:
        r = apply_regime(returns, regime_mask)
        s = self._score(r).clip(lower=0.0)
        if s.sum() <= 0:
            w = equal_weights(r.columns)
        else:
            w = s / s.sum()
        return enforce_caps(w, constraints).reindex(r.columns).fillna(0.0)


class VolatilityTiming(_DirectModel):
    """Pesi inversamente proporzionali alla volatilità (``w ∝ 1/σ``)."""

    name = "VolatilityTiming"

    def _score(self, returns):
        vol = returns.std(ddof=1)
        return 1.0 / vol.where(vol > 0)


class RewardToRiskTiming(_DirectModel):
    """Pesi proporzionali al reward-to-risk (``w ∝ max(μ/σ, 0)``)."""

    name = "RewardToRiskTiming"

    def _score(self, returns):
        mu, vol = returns.mean(), returns.std(ddof=1)
        return (mu / vol.where(vol > 0)).clip(lower=0.0)


class ParametricPolicy(_DirectModel):
    """Parametric Portfolio Policy (Brandt-Santa Clara-Valkanov), versione base.

    Parte dall'equal-weight e la inclina in base al momentum standardizzato
    cross-sezionale: ``w_i ∝ 1/N + θ · z(momentum_i)`` (poi clip ≥0 e normalizza).
    """

    name = "ParametricPolicy"

    def __init__(self, theta: float = 0.5, lookback: int = 126):
        self.theta = theta
        self.lookback = lookback

    def _score(self, returns):
        n = returns.shape[1]
        mom = (1.0 + returns.tail(self.lookback)).prod() - 1.0
        z = (mom - mom.mean()) / (mom.std(ddof=0) + 1e-12)
        return (1.0 / n) + self.theta * z / n
