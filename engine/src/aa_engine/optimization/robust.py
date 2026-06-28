"""Gruppo C — modelli Robust (Set 4) — spec §STEP 3.

Affrontano l'errore di stima (il tallone d'Achille di Markowitz): resampling,
blend con 1/N, regolarizzazione, uncertainty set sulla media. Dove l'esatto è
oneroso, varianti ragionevoli e DOCUMENTATE (come da spec).
"""

from __future__ import annotations

import numpy as np
import pandas as pd

from .base import (
    OptModel,
    PortfolioConstraints,
    apply_regime,
    enforce_caps,
    equal_weights,
    make_portfolio,
    weights_from_rf,
)


class MichaudResampling(OptModel):
    """Resampled Efficiency (Michaud): bootstrap dei rendimenti, max-Sharpe su ogni
    campione, media dei pesi. Copre robustezza + incertezza dei parametri.
    """

    name = "MichaudResampling"
    family = "robust"

    def __init__(self, n_boot: int = 10, seed: int = 12345):
        self.n_boot = n_boot
        self.seed = seed

    def fit_weights(
        self, returns, *, regime_mask=None, views=None,
        constraints: PortfolioConstraints | None = None,
    ) -> pd.Series:
        r = apply_regime(returns, regime_mask)
        rng = np.random.default_rng(self.seed)
        acc = pd.Series(0.0, index=r.columns)
        used = 0
        for _ in range(self.n_boot):
            idx = rng.integers(0, len(r), len(r))
            rb = r.iloc[idx].reset_index(drop=True)
            try:
                port = make_portfolio(rb, constraints)
                w = port.optimization(model="Classic", rm="MV", obj="Sharpe", rf=0, l=0, hist=True)
                acc += weights_from_rf(w, r.columns, constraints)
                used += 1
            except Exception:  # pragma: no cover - bootstrap degenere
                continue
        if used == 0:
            return equal_weights(r.columns)
        return enforce_caps(acc / used, constraints)


class TalmudBlend(OptModel):
    """"Markowitz meets the Talmud" (DeMiguel et al.): blend 50/50 fra 1/N e
    min-variance — la diversificazione ingenua stabilizza l'ottimo."""

    name = "TalmudBlend"
    family = "robust"

    def __init__(self, alpha: float = 0.5):
        self.alpha = alpha          # quota su 1/N

    def fit_weights(
        self, returns, *, regime_mask=None, views=None,
        constraints: PortfolioConstraints | None = None,
    ) -> pd.Series:
        r = apply_regime(returns, regime_mask)
        port = make_portfolio(r, constraints)
        w = port.optimization(model="Classic", rm="MV", obj="MinRisk", rf=0, l=0, hist=True)
        mv = weights_from_rf(w, r.columns, constraints)
        ew = equal_weights(r.columns)
        return enforce_caps(self.alpha * ew + (1 - self.alpha) * mv, constraints)


class Goldilocks(OptModel):
    """"Markowitz meets Goldilocks": min-variance REGOLARIZZATA — covarianza
    ulteriormente ristretta verso la diagonale (riduce l'effetto leva su coppie
    quasi collineari). "Né troppo, né troppo poco"."""

    name = "Goldilocks"
    family = "robust"

    def __init__(self, ridge: float = 0.2):
        self.ridge = ridge

    def fit_weights(
        self, returns, *, regime_mask=None, views=None,
        constraints: PortfolioConstraints | None = None,
    ) -> pd.Series:
        r = apply_regime(returns, regime_mask)
        port = make_portfolio(r, constraints)
        cov = port.cov.to_numpy()
        reg = (1 - self.ridge) * cov + self.ridge * np.diag(np.diag(cov))
        port.cov = pd.DataFrame(reg, index=list(r.columns), columns=list(r.columns))
        w = port.optimization(model="Classic", rm="MV", obj="MinRisk", rf=0, l=0, hist=True)
        return weights_from_rf(w, r.columns, constraints)


class RobustEllipsoidal(OptModel):
    """Robust mean-variance con uncertainty set ellissoidale sulla media: si
    penalizza la media col suo errore standard (caso peggiore), poi max-Sharpe.
        μ_robust = μ − κ · √(diag(Σ)/T)
    """

    name = "RobustEllipsoidal"
    family = "robust"

    def __init__(self, kappa: float = 1.0):
        self.kappa = kappa

    def fit_weights(
        self, returns, *, regime_mask=None, views=None,
        constraints: PortfolioConstraints | None = None,
    ) -> pd.Series:
        r = apply_regime(returns, regime_mask)
        port = make_portfolio(r, constraints)
        mu = port.mu.to_numpy().flatten()
        se = np.sqrt(np.diag(port.cov.to_numpy()) / len(r))
        mu_robust = mu - self.kappa * se
        port.mu = pd.DataFrame(mu_robust.reshape(1, -1), columns=list(r.columns))
        w = port.optimization(model="Classic", rm="MV", obj="Sharpe", rf=0, l=0, hist=True)
        return weights_from_rf(w, r.columns, constraints)
