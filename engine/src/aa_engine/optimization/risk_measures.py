"""Gruppo A — modelli per misura di rischio (espansione Stadio 2).

Ogni misura di rischio del risk engine diventa un obiettivo di ottimizzazione:
minimizzare quella misura (``obj='MinRisk'``) oppure massimizzarne il ratio
rendimento/rischio (``obj='Sharpe'``). Tutti via ``rf.Portfolio`` con ``rm``
diverso — una classe per modello (spec §STEP 1).
"""

from __future__ import annotations

from .classic import _RiskfolioClassic


# --- Min-risk per misura (oltre a MinVolatility/MinCVaR/MinCDaR già presenti) -- #
class MinMAD(_RiskfolioClassic):
    """Minima Mean Absolute Deviation."""

    name = "MinMAD"
    family = "classics"
    rm = "MAD"


class MinSemiDev(_RiskfolioClassic):
    """Minima Semi-Deviation (downside)."""

    name = "MinSemiDev"
    family = "classics"
    rm = "MSV"


class MinFLPM(_RiskfolioClassic):
    """Minimo First Lower Partial Moment (Omega-oriented)."""

    name = "MinFLPM"
    family = "classics"
    rm = "FLPM"


class MinSLPM(_RiskfolioClassic):
    """Minimo Second Lower Partial Moment (Sortino-oriented)."""

    name = "MinSLPM"
    family = "classics"
    rm = "SLPM"


class MinEVaR(_RiskfolioClassic):
    """Minimo Entropic VaR."""

    name = "MinEVaR"
    family = "classics"
    rm = "EVaR"


class MinWR(_RiskfolioClassic):
    """Minima Worst Realization (minimax)."""

    name = "MinWR"
    family = "classics"
    rm = "WR"


class MinGMD(_RiskfolioClassic):
    """Minima Gini Mean Difference."""

    name = "MinGMD"
    family = "classics"
    rm = "GMD"


# --- Drawdown-based -------------------------------------------------------- #
class MinMDD(_RiskfolioClassic):
    """Minimo Max Drawdown (la variante "Markowitz 2019")."""

    name = "MinMDD"
    family = "classics"
    rm = "MDD"


class MinADD(_RiskfolioClassic):
    """Minimo Average Drawdown."""

    name = "MinADD"
    family = "classics"
    rm = "ADD"


class MinEDaR(_RiskfolioClassic):
    """Minimo Entropic Drawdown at Risk."""

    name = "MinEDaR"
    family = "classics"
    rm = "EDaR"


class MinUlcer(_RiskfolioClassic):
    """Minimo Ulcer Index."""

    name = "MinUlcer"
    family = "classics"
    rm = "UCI"


# --- Max-ratio (rendimento / rischio) per misura --------------------------- #
class MaxSortino(_RiskfolioClassic):
    """Massimo Sortino (ratio rendimento / downside deviation)."""

    name = "MaxSortino"
    family = "classics"
    rm = "SLPM"
    obj = "Sharpe"


class MaxRatioCVaR(_RiskfolioClassic):
    """Massimo ratio rendimento / CVaR."""

    name = "MaxRatioCVaR"
    family = "classics"
    rm = "CVaR"
    obj = "Sharpe"


class Kelly(_RiskfolioClassic):
    """Criterio di Kelly (crescita log-ottimale, approssimazione quadratica)."""

    name = "Kelly"
    family = "classics"
    rm = "MV"
    obj = "Sharpe"
    kelly = "approx"
