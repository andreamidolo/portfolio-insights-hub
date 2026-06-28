"""Modelli "AI" basati su clustering gerarchico (famiglia "ai").

HRP / HERC / NCO via ``rf.HCPortfolio`` (spec §2). Sono allocatori euristici:
non risolvono un programma convesso con vincoli lineari, quindi i cap di asset
class sono imposti a posteriori con ``enforce_caps`` (documentato).

Pregio chiave (HRP): NON richiede l'inversione della matrice di covarianza →
robusto a universi quasi-singolari (strumenti molto correlati).
"""

from __future__ import annotations

import pandas as pd

from .base import (
    OptModel,
    PortfolioConstraints,
    _rf,
    apply_regime,
    enforce_caps,
    normalize_weights,
)


class _RiskfolioHC(OptModel):
    """Base per i modelli ``rf.HCPortfolio.optimization``."""

    model: str = "HRP"
    rm: str = "MV"

    def fit_weights(
        self, returns, *, regime_mask=None, views=None,
        constraints: PortfolioConstraints | None = None,
    ) -> pd.Series:
        rf = _rf()
        r = apply_regime(returns, regime_mask)
        port = rf.HCPortfolio(returns=r)
        w = port.optimization(
            model=self.model, codependence="pearson", rm=self.rm, obj="MinRisk",
            rf=0, method_cov="ledoit",
        )
        s = normalize_weights(w[w.columns[0]], r.columns, constraints)
        # Gli allocatori gerarchici non impongono cap lineari: rete di sicurezza.
        return enforce_caps(s, constraints)


class HRP(_RiskfolioHC):
    """Hierarchical Risk Parity (López de Prado). Niente inversione di matrice."""

    name = "HRP"
    family = "ai"
    model = "HRP"


class HERC(_RiskfolioHC):
    """Hierarchical Equal Risk Contribution."""

    name = "HERC"
    family = "ai"
    model = "HERC"


class NCO(_RiskfolioHC):
    """Nested Clustered Optimization (Meucci/López de Prado) — fiore AI di AlgoEagle."""

    name = "NCO"
    family = "ai"
    model = "NCO"
