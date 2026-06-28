"""Modelli classici e risk-based (famiglia "classics") + baseline 1/N.

Tutti su Riskfolio-Lib (``rf.Portfolio``) tranne ``EqualWeight``. Vedi spec §2.
"""

from __future__ import annotations

import pandas as pd

from .base import (
    OptModel,
    PortfolioConstraints,
    apply_regime,
    equal_weights,
    make_portfolio,
    weights_from_rf,
)


class EqualWeight(OptModel):
    """Baseline 1/N — pesi uguali. Nessuna ottimizzazione (sanity benchmark)."""

    name = "EqualWeight"
    family = "baseline"

    def fit_weights(self, returns, *, regime_mask=None, views=None, constraints=None):
        r = apply_regime(returns, regime_mask)
        return equal_weights(r.columns)


class _RiskfolioClassic(OptModel):
    """Base per i modelli ``rf.Portfolio.optimization`` (model='Classic').

    Sottoclassi: basta impostare ``rm`` (misura di rischio), ``obj`` (obiettivo) e
    opzionalmente ``kelly``. Aggiungere un modello = una classe in più.
    """

    rm: str = "MV"
    obj: str = "MinRisk"  # 'MinRisk' | 'Sharpe' | 'MaxRet' | 'Utility'
    kelly: str | None = None  # None | 'approx' | 'exact' (criterio di Kelly)

    def fit_weights(
        self, returns, *, regime_mask=None, views=None,
        constraints: PortfolioConstraints | None = None,
    ) -> pd.Series:
        r = apply_regime(returns, regime_mask)
        port = make_portfolio(r, constraints)
        w = port.optimization(
            model="Classic", rm=self.rm, obj=self.obj, kelly=self.kelly, rf=0, l=0, hist=True
        )
        return weights_from_rf(w, r.columns, constraints)


class MinVolatility(_RiskfolioClassic):
    """Mean-Variance a minima varianza (rm=MV, obj=MinRisk)."""

    name = "MinVolatility"
    family = "classics"
    rm = "MV"
    obj = "MinRisk"


class MaxSharpe(_RiskfolioClassic):
    """Mean-Variance a massimo Sharpe (rm=MV, obj=Sharpe)."""

    name = "MaxSharpe"
    family = "classics"
    rm = "MV"
    obj = "Sharpe"


class MinCVaR(_RiskfolioClassic):
    """Ottimizzazione a minimo CVaR (rm=CVaR, obj=MinRisk)."""

    name = "MinCVaR"
    family = "classics"
    rm = "CVaR"
    obj = "MinRisk"


class MinCDaR(_RiskfolioClassic):
    """Ottimizzazione a minimo CDaR (rm=CDaR, obj=MinRisk)."""

    name = "MinCDaR"
    family = "classics"
    rm = "CDaR"
    obj = "MinRisk"


class RiskParity(OptModel):
    """Risk Parity: contributi al rischio uguali (``rf.Portfolio.rp_optimization``)."""

    name = "RiskParity"
    family = "classics"
    rm = "MV"

    def fit_weights(
        self, returns, *, regime_mask=None, views=None,
        constraints: PortfolioConstraints | None = None,
    ) -> pd.Series:
        r = apply_regime(returns, regime_mask)
        port = make_portfolio(r, constraints)
        w = port.rp_optimization(model="Classic", rm=self.rm, rf=0, b=None, hist=True)
        return weights_from_rf(w, r.columns, constraints)
