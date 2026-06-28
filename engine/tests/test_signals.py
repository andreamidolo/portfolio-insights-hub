"""Test della security selection, dei vincoli e dell'enforcement cap/floor.

Non richiedono Riskfolio (logica pura): regole di selezione, RegimeProvider
statico, ``PortfolioConstraints`` ed ``enforce_caps``.
"""

from __future__ import annotations

import pandas as pd
import pytest

from aa_engine.data import Regime
from aa_engine.optimization.base import PortfolioConstraints, enforce_caps
from aa_engine.signals import StaticRegimeProvider, select_securities

ACMAP = {"EQ1": "Equity", "EQ2": "Equity", "BOND": "Fixed Income", "GOLD": "Gold", "HY": "HY"}
UNIVERSE = list(ACMAP)
# rischio per strumento: equity e HY "alti", bond/gold "bassi"
RISK = pd.Series({"EQ1": 0.18, "EQ2": 0.22, "BOND": 0.05, "GOLD": 0.10, "HY": 0.14})


# --------------------------------------------------------------------------- #
# Security selection (Stadio 1, parte deterministica)
# --------------------------------------------------------------------------- #
def test_bull_keeps_everything():
    prov = StaticRegimeProvider({}, default=Regime.BULL)
    assert select_securities(UNIVERSE, ACMAP, prov, RISK) == UNIVERSE


def test_bear_drops_high_risk():
    prov = StaticRegimeProvider({}, default=Regime.BEAR)
    selected = select_securities(UNIVERSE, ACMAP, prov, RISK)
    # soglia = mediana (0.14): si scartano gli strumenti sopra (EQ1, EQ2)
    assert "BOND" in selected and "GOLD" in selected
    assert "EQ1" not in selected and "EQ2" not in selected


def test_regime_changes_selection():
    bull = StaticRegimeProvider({}, default=Regime.BULL)
    bear = StaticRegimeProvider({}, default=Regime.BEAR)
    sel_bull = select_securities(UNIVERSE, ACMAP, bull, RISK)
    sel_bear = select_securities(UNIVERSE, ACMAP, bear, RISK)
    assert set(sel_bear) < set(sel_bull)            # BEAR è un sottoinsieme stretto


def test_mixed_regime_per_asset_class():
    """Equity in BEAR (scarta i suoi rischiosi), il resto BULL (tiene)."""
    prov = StaticRegimeProvider({"Equity": Regime.BEAR}, default=Regime.BULL)
    selected = select_securities(UNIVERSE, ACMAP, prov, RISK)
    assert "EQ1" not in selected and "EQ2" not in selected   # equity rischiosa in BEAR
    assert {"BOND", "GOLD", "HY"} <= set(selected)           # altre classi BULL


# --------------------------------------------------------------------------- #
# StaticRegimeProvider
# --------------------------------------------------------------------------- #
def test_static_regime_provider():
    prov = StaticRegimeProvider({"Equity": Regime.BEAR}, default=Regime.BULL)
    assert prov.get_regime("Equity") == Regime.BEAR
    assert prov.get_regime("Gold") == Regime.BULL


# --------------------------------------------------------------------------- #
# PortfolioConstraints
# --------------------------------------------------------------------------- #
def test_profile_equity_ranges():
    assert PortfolioConstraints.for_profile("moderate").max_equity == 0.30
    assert PortfolioConstraints.for_profile("moderate").min_equity is None
    bal = PortfolioConstraints.for_profile("balanced")
    assert (bal.min_equity, bal.max_equity) == (0.30, 0.60)
    agg = PortfolioConstraints.for_profile("aggressive")
    assert agg.min_equity == 0.60 and agg.max_equity is None
    with pytest.raises(ValueError):
        PortfolioConstraints.for_profile("wild")


# --------------------------------------------------------------------------- #
# enforce_caps (per-asset cap + class cap + class floor)
# --------------------------------------------------------------------------- #
def test_enforce_caps_per_asset():
    w = pd.Series({"EQ1": 0.7, "EQ2": 0.1, "BOND": 0.1, "GOLD": 0.05, "HY": 0.05})
    cons = PortfolioConstraints(w_max=0.40, asset_class_map=ACMAP)
    out = enforce_caps(w, cons)
    assert out.sum() == pytest.approx(1.0)
    assert out.max() <= 0.40 + 1e-9


def test_enforce_caps_class_cap_and_floor():
    # equity parte all'80% → cap 0.30 deve ridurla; floor su Fixed Income alza i bond
    w = pd.Series({"EQ1": 0.5, "EQ2": 0.3, "BOND": 0.1, "GOLD": 0.05, "HY": 0.05})
    cons = PortfolioConstraints(
        w_max=0.60, max_equity=0.30, asset_class_map=ACMAP,
        asset_class_floors={"Fixed Income": 0.25},
    )
    out = enforce_caps(w, cons)
    assert out.sum() == pytest.approx(1.0)
    assert out["EQ1"] + out["EQ2"] <= 0.30 + 1e-6     # cap equity
    assert out["BOND"] >= 0.25 - 1e-6                  # floor fixed income


def test_enforce_caps_equity_floor_raises_equity():
    w = pd.Series({"EQ1": 0.05, "EQ2": 0.05, "BOND": 0.5, "GOLD": 0.2, "HY": 0.2})
    cons = PortfolioConstraints(min_equity=0.60, asset_class_map=ACMAP)
    out = enforce_caps(w, cons)
    assert out.sum() == pytest.approx(1.0)
    assert out["EQ1"] + out["EQ2"] >= 0.60 - 1e-6      # floor equity (profilo aggressive)
