"""Test del backtesting VaR e delle metriche individuali (Linea 4).

Coprono ciò che il contratto in ``test_risk_engine.py`` non tocca: i test di
Kupiec/Christoffersen, il traffic light di Basilea, la selezione del modello e
le funzioni di rischio individuale (leave-one-out, worst realizations).
"""

from __future__ import annotations

import numpy as np
import pandas as pd
import pytest
from scipy.stats import norm

from aa_engine.risk import (
    backtest_var_model,
    leave_one_out,
    risk_contribution,
    select_best_var_model,
    worst_realizations,
)
from aa_engine.risk.backtesting import (
    christoffersen_independence,
    kupiec_pof,
)


@pytest.fixture
def sample_returns() -> pd.DataFrame:
    rng = np.random.default_rng(7)
    dates = pd.bdate_range("2021-01-01", periods=750)
    tickers = ["A", "B", "C", "D"]
    rets = rng.normal(0.0004, 0.012, size=(len(dates), len(tickers)))
    return pd.DataFrame(rets, index=dates, columns=tickers)


@pytest.fixture
def sample_weights() -> pd.Series:
    return pd.Series([0.4, 0.3, 0.2, 0.1], index=["A", "B", "C", "D"])


# --------------------------------------------------------------------------- #
# VaR backtesting
# --------------------------------------------------------------------------- #
def test_kupiec_perfect_calibration_high_pvalue():
    """Frequenza osservata == alpha => statistica ~0, p-value alto."""
    stat, p = kupiec_pof(n_obs=1000, n_breaches=50, alpha=0.05)
    assert stat < 1e-6
    assert p > 0.99


def test_kupiec_overbreach_rejects():
    """Troppe violazioni => p-value basso (si rifiuta H0)."""
    stat, p = kupiec_pof(n_obs=1000, n_breaches=150, alpha=0.05)
    assert stat > 10
    assert p < 0.01


def test_independence_clustered_rejects():
    """Violazioni tutte consecutive (clustering) => indipendenza rifiutata."""
    b = pd.Series([0] * 90 + [1] * 10)
    stat, p = christoffersen_independence(b)
    assert stat > 0
    assert p < 0.05


def test_backtest_well_calibrated_is_green():
    """Un VaR parametrico ben calibrato deve dare failure_rate ≈ alpha e green."""
    rng = np.random.default_rng(123)
    n, sigma, alpha = 2000, 0.01, 0.05
    r = pd.Series(rng.normal(0.0, sigma, n))
    var_forecast = pd.Series(norm.ppf(alpha) * sigma, index=r.index)  # costante, negativo
    res = backtest_var_model(r, var_forecast, alpha=alpha, model_name="parametric")
    assert res.n_obs == n
    assert 0.03 <= res.failure_rate <= 0.07
    assert res.traffic_light in ("green", "yellow")
    assert res.kupiec_pvalue > 0.01
    assert 0.0 <= res.conditional_pvalue <= 1.0


def test_select_best_prefers_calibrated_model():
    """Tra un modello ben calibrato e uno che sotto-stima il rischio, vince il primo."""
    rng = np.random.default_rng(321)
    n, sigma, alpha = 1500, 0.01, 0.05
    r = pd.Series(rng.normal(0.0, sigma, n))
    good = pd.Series(norm.ppf(alpha) * sigma, index=r.index)
    bad = pd.Series(norm.ppf(alpha) * sigma * 0.4, index=r.index)  # VaR troppo vicino a 0
    res_good = backtest_var_model(r, good, alpha=alpha, model_name="good")
    res_bad = backtest_var_model(r, bad, alpha=alpha, model_name="bad")
    assert select_best_var_model([res_good, res_bad], alpha=alpha) == "good"


# --------------------------------------------------------------------------- #
# Individual security risk (Linea 4)
# --------------------------------------------------------------------------- #
def test_worst_realizations_shape(sample_returns, sample_weights):
    wr = worst_realizations(sample_returns, sample_weights, n=10)
    assert len(wr) == 10
    assert list(wr.columns) == ["Tot"] + list(sample_returns.columns)
    # la riga "Tot" deve essere la somma dei contributi per strumento
    recomputed = wr[list(sample_returns.columns)].sum(axis=1)
    assert np.allclose(recomputed.to_numpy(), wr["Tot"].to_numpy())
    # ordinate dalla peggiore in su (Tot crescente)
    assert wr["Tot"].is_monotonic_increasing


def test_leave_one_out_reinvest_preserves_budget(sample_returns, sample_weights):
    loo = leave_one_out(sample_returns, sample_weights, "MV", reinvest=True)
    assert list(loo.index) == list(sample_weights.index)
    assert loo.notna().all()


def test_risk_contribution_signs_match_weights(sample_returns, sample_weights):
    """Per StdDev i contributi sono positivi quando i pesi lo sono."""
    rc = risk_contribution(sample_returns, sample_weights, "MV")
    assert (rc > 0).all()
