"""Risk engine — stress testing (Stadio 4, Linea 5).

AlgoEagle usa un approccio bayesiano/posterior (stile entropy-pooling di
Meucci): si impone uno shock su uno strumento o un fattore e si ricalcola la
distribuzione *a posteriori* di tutti gli altri strumenti.

Questo è più avanzato delle altre linee: lo lasciamo come stub con la firma
giusta e un riferimento, da affrontare DOPO che il resto del risk engine gira.

Riferimento: docs/02_risk_engine_spec.md (sezione "Stress testing").
Possibile libreria di supporto: implementazioni open di Entropy Pooling.
"""

from __future__ import annotations

import pandas as pd


def stress_security(
    returns: pd.DataFrame,
    weights: pd.Series,
    target: str,
    *,
    mean_shock: float | None = None,
    vol_shock: float | None = None,
    skew_shock: float | None = None,
) -> pd.DataFrame:
    """Impatto di uno shock sui momenti di uno strumento sugli altri.

    Replica "Stress of specific securities". Output: DataFrame per strumento con
    [Mean, Volatility, Skewness, Kurtosis] a posteriori.

    TODO[risk-avanzato]: implementare con entropy pooling / posterior bayesiana.
    """
    raise NotImplementedError


def stress_factor(
    returns: pd.DataFrame,
    weights: pd.Series,
    factor_returns: pd.Series,
    shock: float,
) -> pd.DataFrame:
    """Impatto dello shock di un fattore (es. -10% su un indice macro) sul portafoglio.

    Replica "Stress testing of a Risk Factor". Output: DataFrame per strumento con
    [VaR, CVaR, Mean, Volatility] a posteriori.

    TODO[risk-avanzato]: implementare.
    """
    raise NotImplementedError
