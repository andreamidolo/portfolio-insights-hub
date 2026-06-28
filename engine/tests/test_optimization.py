"""Test della Fase 3 — modelli di ottimizzazione + ensemble (richiede Riskfolio)."""

from __future__ import annotations

import numpy as np
import pandas as pd
import pytest

pytest.importorskip("riskfolio")

from aa_engine.optimization import (  # noqa: E402
    BlackLitterman,
    EqualWeight,
    HERC,
    HRP,
    MaxSharpe,
    MinCDaR,
    MinCVaR,
    MinVolatility,
    NCO,
    OptimizationEnsemble,
    PortfolioConstraints,
    RiskParity,
    SharpeScorer,
)

ALL_MODELS = [
    MinVolatility, MaxSharpe, RiskParity, MinCVaR, MinCDaR,
    BlackLitterman, HRP, HERC, NCO, EqualWeight,
]
OPTIMIZING = [m for m in ALL_MODELS if m is not EqualWeight]
ACMAP = {"EQ1": "Equity", "EQ2": "Equity", "BOND": "Fixed Income", "GOLD": "Gold", "HY": "HY"}


@pytest.fixture(scope="module")
def returns() -> pd.DataFrame:
    rng = np.random.default_rng(4)
    dates = pd.bdate_range("2021-01-01", periods=500)
    tickers = list(ACMAP)
    mkt = rng.standard_t(5, 500) * 0.009
    betas = np.array([1.1, 1.0, -0.2, 0.1, 0.6])
    idio = rng.normal(0, 0.006, (500, 5))
    drift = np.array([0.0005, 0.0005, 0.0001, 0.0002, 0.0003])
    return pd.DataFrame(mkt[:, None] * betas[None, :] + idio + drift, index=dates, columns=tickers)


@pytest.mark.parametrize("Model", ALL_MODELS, ids=[m.__name__ for m in ALL_MODELS])
def test_model_valid_weights(Model, returns):
    cons = PortfolioConstraints(w_max=0.40, asset_class_map=ACMAP)
    w = Model().fit_weights(returns, constraints=cons)
    assert list(w.index) == list(returns.columns)
    assert w.sum() == pytest.approx(1.0, abs=1e-6)
    assert (w >= -1e-9).all()                       # long-only
    assert w.max() <= 0.40 + 2e-3                   # cap per-asset (tol solver)


@pytest.mark.parametrize("Model", OPTIMIZING, ids=[m.__name__ for m in OPTIMIZING])
def test_equity_range_respected(Model, returns):
    """Profilo balanced: l'equity resta nell'intervallo [min, max] del profilo."""
    cons = PortfolioConstraints.for_profile("balanced", ACMAP)  # equity in [0.30, 0.60]
    w = Model().fit_weights(returns, constraints=cons)
    equity = w["EQ1"] + w["EQ2"]
    assert 0.30 - 3e-3 <= equity <= 0.60 + 3e-3


def test_hrp_handles_near_singular_cov(returns):
    """HRP non inverte la covarianza: robusto a strumenti quasi collineari."""
    R = returns.copy()
    R["EQ2"] = R["EQ1"] * 0.999 + np.random.default_rng(0).normal(0, 1e-7, len(R))
    w = HRP().fit_weights(R)
    assert w.sum() == pytest.approx(1.0, abs=1e-6)
    assert (w >= -1e-9).all()


def test_blacklitterman_view_tilts_weights(returns):
    """Una view rialzista su GOLD aumenta il suo peso."""
    cons = PortfolioConstraints(w_max=0.50, asset_class_map=ACMAP)
    w_base = BlackLitterman().fit_weights(returns, constraints=cons)
    w_view = BlackLitterman().fit_weights(returns, views={"GOLD": 0.003}, constraints=cons)
    assert w_view["GOLD"] > w_base["GOLD"] + 1e-3


# --------------------------------------------------------------------------- #
# Ensemble (set ridotto per velocità)
# --------------------------------------------------------------------------- #
def test_ensemble_selects_and_averages(returns):
    models = [MinVolatility(), RiskParity(), MinCVaR(), EqualWeight()]
    ens = OptimizationEnsemble(models, n_best=2)
    cons = PortfolioConstraints(w_max=0.40, asset_class_map=ACMAP)
    res = ens.run(returns, constraints=cons, scorer=SharpeScorer())

    assert len(res.weights_by_model) == len(models)
    assert len(res.selected) == 2
    assert res.scorer == "sharpe"
    assert res.final_weights.sum() == pytest.approx(1.0, abs=1e-6)
    assert (res.final_weights >= -1e-9).all()
    # i selezionati sono i 2 con score più alto
    top2 = sorted(res.scores, key=lambda k: res.scores[k], reverse=True)[:2]
    assert set(res.selected) == set(top2)
    # la final è la media dei pesi dei selezionati
    expected = sum(res.weights_by_model[n] for n in res.selected) / 2
    assert np.allclose(res.final_weights.values, expected.reindex(res.final_weights.index).values, atol=1e-9)
