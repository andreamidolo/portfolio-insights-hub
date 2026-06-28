"""Risk engine — backtesting dei modelli VaR.

Replica la slide "Backtesting" di AlgoEagle: per ogni modello VaR si contano le
violazioni (breaches) e si validano con test statistici, poi si sceglie il
modello migliore con uno score.

Test implementati:
    - Kupiec POF (Proportion of Failures)        -> coverage incondizionata, χ²(1)
    - Christoffersen Independence                 -> indipendenza (no clustering), χ²(1)
    - Christoffersen Conditional Coverage         -> joint (POF + independence), χ²(2)

Riferimento: docs/02_risk_engine_spec.md  (sezione "VaR backtesting").
"""

from __future__ import annotations

from dataclasses import dataclass

import numpy as np
import pandas as pd
from scipy import stats


@dataclass
class VaRBacktestResult:
    model: str
    n_obs: int
    n_breaches: int
    failure_rate: float
    kupiec_stat: float
    kupiec_pvalue: float
    independence_stat: float
    independence_pvalue: float
    conditional_stat: float
    conditional_pvalue: float
    # "traffic light" di Basilea (green/yellow/red) sulla base del numero di breach
    traffic_light: str


def _safe_log(x: float) -> float:
    """ln con clamp per evitare ln(0) = -inf nelle likelihood ratio."""
    return float(np.log(max(x, 1e-300)))


def kupiec_pof(n_obs: int, n_breaches: int, alpha: float) -> tuple[float, float]:
    """Kupiec Proportion-of-Failures test.

    H0: la frequenza osservata di violazioni == alpha.

        LR_POF = -2 ln[ (1-α)^(N-x) α^x / ((1-π̂)^(N-x) π̂^x) ],   π̂ = x/N

    Distribuzione asintotica χ²(1). Ritorna ``(statistica LR, p-value)``.
    """
    if n_obs == 0:
        return 0.0, 1.0
    x, n = n_breaches, n_obs
    pi_hat = x / n
    # log-verosimiglianza sotto H0 (frequenza = alpha)
    ll_null = (n - x) * _safe_log(1 - alpha) + x * _safe_log(alpha)
    # log-verosimiglianza sotto H1 (frequenza = π̂); se π̂ in {0,1} i termini 0·ln0 -> 0
    if pi_hat in (0.0, 1.0):
        ll_alt = (n - x) * _safe_log(1 - pi_hat) if pi_hat == 0.0 else x * _safe_log(pi_hat)
    else:
        ll_alt = (n - x) * _safe_log(1 - pi_hat) + x * _safe_log(pi_hat)
    lr = -2.0 * (ll_null - ll_alt)
    lr = max(lr, 0.0)
    return float(lr), float(stats.chi2.sf(lr, 1))


def christoffersen_independence(breaches: pd.Series) -> tuple[float, float]:
    """Test di indipendenza delle violazioni (no clustering), χ²(1).

    Costruisce la matrice di transizione degli stati 0/1:
        n_ij = # transizioni da stato i a stato j
    e confronta la verosimiglianza con probabilità di violazione condizionate
    (π01, π11) contro quella con probabilità comune π.
    Ritorna ``(statistica LR, p-value)``.
    """
    b = np.asarray(breaches, dtype=int)
    if b.size < 2:
        return 0.0, 1.0
    prev, cur = b[:-1], b[1:]
    n00 = int(np.sum((prev == 0) & (cur == 0)))
    n01 = int(np.sum((prev == 0) & (cur == 1)))
    n10 = int(np.sum((prev == 1) & (cur == 0)))
    n11 = int(np.sum((prev == 1) & (cur == 1)))

    pi01 = n01 / (n00 + n01) if (n00 + n01) > 0 else 0.0
    pi11 = n11 / (n10 + n11) if (n10 + n11) > 0 else 0.0
    pi = (n01 + n11) / (n00 + n01 + n10 + n11)

    # log-verosimiglianza vincolata (π01 = π11 = π) vs non vincolata
    ll_restricted = (n00 + n10) * _safe_log(1 - pi) + (n01 + n11) * _safe_log(pi)
    ll_unrestricted = (
        n00 * _safe_log(1 - pi01) + n01 * _safe_log(pi01)
        + n10 * _safe_log(1 - pi11) + n11 * _safe_log(pi11)
    )
    lr = -2.0 * (ll_restricted - ll_unrestricted)
    lr = max(lr, 0.0)
    return float(lr), float(stats.chi2.sf(lr, 1))


def christoffersen_cc(
    n_obs: int, breaches: pd.Series, alpha: float
) -> tuple[float, float]:
    """Conditional Coverage = Kupiec + Independence (χ²(2)).

        LR_cc = LR_pof + LR_ind
    Ritorna ``(statistica LR_cc, p-value)``.
    """
    n_breaches = int(np.sum(np.asarray(breaches, dtype=int)))
    lr_pof, _ = kupiec_pof(n_obs, n_breaches, alpha)
    lr_ind, _ = christoffersen_independence(breaches)
    lr_cc = lr_pof + lr_ind
    return float(lr_cc), float(stats.chi2.sf(lr_cc, 2))


def _traffic_light(n_obs: int, n_breaches: int, alpha: float) -> str:
    """Semaforo di Basilea sul numero cumulato di violazioni.

    Zone definite sulla CDF binomiale del numero di breach (N, α):
        green  : P(X ≤ x) ≤ 95.00 %
        yellow : 95.00 % < P(X ≤ x) ≤ 99.99 %
        red    : P(X ≤ x) > 99.99 %
    """
    if n_obs == 0:
        return "green"
    cdf = float(stats.binom.cdf(n_breaches, n_obs, alpha))
    if cdf <= 0.95:
        return "green"
    if cdf <= 0.9999:
        return "yellow"
    return "red"


def backtest_var_model(
    portfolio_returns: pd.Series,
    var_forecasts: pd.Series,
    alpha: float = 0.05,
    model_name: str = "model",
) -> VaRBacktestResult:
    """Esegue il backtest completo per UN modello VaR.

    Parametri
    ---------
    portfolio_returns : pd.Series   rendimenti realizzati del portafoglio
    var_forecasts : pd.Series       VaR previsto per ciascuna data (valori negativi)
    alpha : float                   livello (default 5%)

    Una "violazione" si ha quando il rendimento realizzato è peggiore (più
    negativo) del VaR previsto: ``r_realized < VaR_forecast``.

    Ritorna un ``VaRBacktestResult`` con conteggi, statistiche e semaforo.
    """
    df = pd.concat(
        {"r": portfolio_returns, "var": var_forecasts}, axis=1
    ).dropna()
    n_obs = int(len(df))
    breaches = (df["r"] < df["var"]).astype(int)
    n_breaches = int(breaches.sum())
    failure_rate = (n_breaches / n_obs) if n_obs else float("nan")

    kupiec_stat, kupiec_p = kupiec_pof(n_obs, n_breaches, alpha)
    ind_stat, ind_p = christoffersen_independence(breaches)
    cc_stat, cc_p = christoffersen_cc(n_obs, breaches, alpha)
    light = _traffic_light(n_obs, n_breaches, alpha)

    return VaRBacktestResult(
        model=model_name,
        n_obs=n_obs,
        n_breaches=n_breaches,
        failure_rate=failure_rate,
        kupiec_stat=kupiec_stat,
        kupiec_pvalue=kupiec_p,
        independence_stat=ind_stat,
        independence_pvalue=ind_p,
        conditional_stat=cc_stat,
        conditional_pvalue=cc_p,
        traffic_light=light,
    )


def select_best_var_model(
    results: list[VaRBacktestResult], alpha: float = 0.05
) -> str:
    """Sceglie il modello VaR 'migliore' tramite uno score.

    Criteri (vedi spec): preferire ``failure_rate ≈ alpha``, p-value alti su
    independence e conditional coverage, traffic light green. Score:

        score = -|failure_rate - α|·w_cov
                + p_independence + p_conditional
                + bonus_traffic_light

    Ritorna il nome del modello con score massimo.
    """
    if not results:
        raise ValueError("Nessun risultato di backtest fornito.")
    light_bonus = {"green": 0.5, "yellow": 0.0, "red": -0.5}

    def score(r: VaRBacktestResult) -> float:
        cov_pen = abs((r.failure_rate if np.isfinite(r.failure_rate) else 1.0) - alpha)
        return (
            -10.0 * cov_pen
            + r.independence_pvalue
            + r.conditional_pvalue
            + light_bonus.get(r.traffic_light, 0.0)
        )

    return max(results, key=score).model
