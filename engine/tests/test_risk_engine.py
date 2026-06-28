"""Test del risk engine.

Questi test DEFINISCONO IL CONTRATTO soddisfatto da measures.py. Gli xfail
originari (funzioni NotImplementedError) sono stati rimossi man mano che il
contratto è stato implementato: ora devono passare tutti.

Strategia di validazione "ground truth":
    data/sample/algoeagle_risk_targets.csv contiene alcuni valori di rischio
    estratti dai report AlgoEagle (slide "Analysis of Coherence"). Una volta
    implementato il motore, useremo lo STESSO portafoglio per verificare di
    ottenere numeri vicini (tolleranza da definire insieme, perché input e
    finestra non sono identici).
"""

from __future__ import annotations

import numpy as np
import pandas as pd
import pytest

from aa_engine.data import PriceData, Regime
from aa_engine.risk import (
    ALL_MEASURES,
    BY_CODE,
    compute_measure,
    marginal_risk,
    risk_contribution,
    risk_panel,
)


@pytest.fixture
def sample_returns() -> pd.DataFrame:
    rng = np.random.default_rng(0)
    dates = pd.bdate_range("2021-01-01", periods=500)
    tickers = ["A", "B", "C", "D"]
    rets = rng.normal(0.0004, 0.012, size=(len(dates), len(tickers)))
    return pd.DataFrame(rets, index=dates, columns=tickers)


@pytest.fixture
def sample_weights() -> pd.Series:
    return pd.Series([0.4, 0.3, 0.2, 0.1], index=["A", "B", "C", "D"])


# --------------------------------------------------------------------------- #
# Test che NON dipendono dall'implementazione (devono passare già ora)
# --------------------------------------------------------------------------- #
def test_taxonomy_complete():
    """La tassonomia deve coprire le 3 famiglie e includere le metriche chiave."""
    codes = set(BY_CODE)
    for required in ["MV", "CVaR", "EVaR", "CDaR", "MDD", "WR", "MAD"]:
        assert required in codes, f"Manca la metrica {required}"
    assert len(ALL_MEASURES) >= 18


def test_regime_enum():
    assert int(Regime.BULL) == 1
    assert int(Regime.BEAR) == -1


def test_pricedata_returns_shape():
    prices = pd.DataFrame(
        {"X": [100, 101, 102], "Y": [50, 49, 51]},
        index=pd.bdate_range("2022-01-03", periods=3),
    )
    pdata = PriceData.from_prices(prices)
    assert list(pdata.tickers) == ["X", "Y"]
    assert len(pdata.returns) == 2


# --------------------------------------------------------------------------- #
# Test del contratto (implementato — devono passare)
# --------------------------------------------------------------------------- #
def test_stddev_positive(sample_returns, sample_weights):
    mv = compute_measure(sample_returns, sample_weights, "MV")
    assert mv > 0


def test_cvar_geq_var(sample_returns, sample_weights):
    """CVaR deve essere almeno severo quanto il VaR (più negativo o uguale)."""
    var = compute_measure(sample_returns, sample_weights, "VaR", alpha=0.05)
    cvar = compute_measure(sample_returns, sample_weights, "CVaR", alpha=0.05)
    assert abs(cvar) >= abs(var)


def test_risk_panel_columns(sample_returns, sample_weights):
    panel = risk_panel(sample_returns, sample_weights)
    for col in ["family", "measure", "value"]:
        assert col in panel.columns
    assert len(panel) == len(ALL_MEASURES)


def test_risk_contribution_sums_to_total(sample_returns, sample_weights):
    """La somma dei contributi al rischio (StdDev) ≈ rischio totale (proprietà di Euler)."""
    total = compute_measure(sample_returns, sample_weights, "MV")
    rc = risk_contribution(sample_returns, sample_weights, "MV")
    assert np.isclose(rc.sum(), total, rtol=1e-3)


def test_marginal_risk_index(sample_returns, sample_weights):
    mr = marginal_risk(sample_returns, sample_weights, "MV")
    assert list(mr.index) == list(sample_weights.index)


def test_regime_mask_changes_result(sample_returns, sample_weights):
    """Filtrare per regime deve cambiare il valore della metrica."""
    mask = pd.Series(sample_returns.index.day % 2 == 0, index=sample_returns.index)
    full = compute_measure(sample_returns, sample_weights, "MV")
    masked = compute_measure(sample_returns, sample_weights, "MV", regime_mask=mask)
    assert not np.isclose(full, masked)
