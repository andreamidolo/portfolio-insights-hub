"""Test dei profili di rischio dai DATI reali (Portfolio_Models_Benchmarks).

4 profili (low/moderate/medium/high) × 3 valute, bande min-max per asset class
e benchmark — tutto da ``config/risk_profiles.json``. Verifica: forma della
config, validazione di feasibility, data-driven (cambiando una banda cambia
l'allocazione), bande per-valuta, ordinamento per rischio, benchmark, endpoint.
"""

from __future__ import annotations

import json

import pandas as pd
import pytest

pytest.importorskip("riskfolio")

from aa_engine.optimization import (  # noqa: E402
    EqualWeight,
    MaxSharpe,
    MinCVaR,
    MinVolatility,
    OptimizationEnsemble,
    RiskParity,
)
from aa_engine.optimization.sample import ASSET_CLASS_MAP, sample_returns  # noqa: E402
from aa_engine.profiles import (  # noqa: E402
    Band,
    ProfileConfigError,
    _validate_grid,
    benchmark_weights,
    constraints_for,
    load_profiles,
)
from aa_engine.risk import compute_measure  # noqa: E402

ACMAP = {t: ASSET_CLASS_MAP.get(t, "Other") for t in sample_returns().columns}


def _small():
    return OptimizationEnsemble(
        [MinVolatility(), MaxSharpe(), RiskParity(), MinCVaR(), EqualWeight()], n_best=3
    )


def _equity_weight(weights: dict[str, float]) -> float:
    return sum(w for t, w in weights.items() if ACMAP[t] == "Equity")


# --------------------------------------------------------------------------- #
# Config reale
# --------------------------------------------------------------------------- #
def test_real_config_shape():
    cfg = load_profiles()
    assert cfg.profile_ids == ["low", "moderate", "medium", "high"]
    assert cfg.placeholder is False  # dati reali, non più placeholder
    assert set(cfg.currencies) == {"EUR", "USD", "CHF"}
    # bande presenti per ogni (profilo, valuta)
    for pid in cfg.profile_ids:
        for cur in cfg.currencies:
            assert set(cfg.bands_for(pid, cur)) == set(cfg.asset_classes)


# --------------------------------------------------------------------------- #
# Validazione di feasibility
# --------------------------------------------------------------------------- #
def test_grid_min_gt_max_raises():
    bands = {g: Band(0.0, 0.2) for g in ["fixed_income", "alternatives", "commodities", "cash"]}
    bands["equity"] = Band(0.6, 0.5)
    with pytest.raises(ProfileConfigError, match="min"):
        _validate_grid("x", "EUR", bands)


def test_grid_sum_of_minimums_over_100_raises():
    bands = {
        "equity": Band(0.9, 1.0), "fixed_income": Band(0.9, 1.0),
        "alternatives": Band(0.0, 0.0), "commodities": Band(0.0, 0.0), "cash": Band(0.0, 0.0),
    }
    with pytest.raises(ProfileConfigError, match="minimi"):
        _validate_grid("y", "EUR", bands)


def test_bad_config_raises(tmp_path):
    p = tmp_path / "broken.json"
    p.write_text(json.dumps({"profiles": [{"id": "x"}]}))  # manca 'models'
    with pytest.raises(ProfileConfigError):
        load_profiles(p)


# --------------------------------------------------------------------------- #
# DATA-DRIVEN: cambiando una banda (floor equity) cambia l'allocazione
# --------------------------------------------------------------------------- #
def _alloc_with_equity_floor(tmp_path, floor: float) -> dict[str, float]:
    free = {"min": 0.0, "max": 1.0}
    cfg = {
        "_placeholder": False,
        "currencies": ["EUR"],
        "default_currency": "EUR",
        "asset_classes": ["equity", "fixed_income", "alternatives", "commodities", "cash"],
        "profiles": [{"id": "medium", "label": "Medium", "benchmark": "bm"}],
        "models": {
            "medium": {
                "EUR": {
                    "target": {"equity": floor, "fixed_income": 1 - floor},
                    "bands": {
                        "equity": {"min": floor, "max": 1.0},
                        "fixed_income": free, "alternatives": free,
                        "commodities": free, "cash": free,
                    },
                }
            }
        },
        "benchmarks": {"bm": {"label": "BM", "EUR": {"target": {"equity": 0.5, "fixed_income": 0.5}}}},
    }
    path = tmp_path / f"cfg_{int(floor * 100)}.json"
    path.write_text(json.dumps(cfg))
    config = load_profiles(path)
    cons = constraints_for("medium", "EUR", ACMAP, config=config)
    res = _small().run(sample_returns(), constraints=cons)
    return {t: float(w) for t, w in res.final_weights.items()}


def test_changing_band_changes_allocation(tmp_path):
    low = _alloc_with_equity_floor(tmp_path, 0.0)
    high = _alloc_with_equity_floor(tmp_path, 0.50)
    assert _equity_weight(high) >= 0.50 - 1e-2          # il floor morde
    assert _equity_weight(high) > _equity_weight(low) + 0.10


# --------------------------------------------------------------------------- #
# Bande PER-VALUTA: cambiando valuta cambiano i vincoli
# --------------------------------------------------------------------------- #
def test_bands_depend_on_currency():
    eur = constraints_for("high", "EUR", ACMAP).class_caps()
    chf = constraints_for("high", "CHF", ACMAP).class_caps()
    # nel dataset reale EUR e CHF hanno cap equity diversi
    assert eur["equity"] != chf["equity"]


# --------------------------------------------------------------------------- #
# 4 profili ordinati per rischio
# --------------------------------------------------------------------------- #
def test_four_profiles_risk_ordering():
    from aa_engine.pipeline.run import run_allocation

    order = ["low", "moderate", "medium", "high"]
    vols = {}
    for p in order:
        r = run_allocation(p, "EUR", ensemble=_small())
        ret = sample_returns()[r.selected]
        w = pd.Series(r.final_weights).reindex(ret.columns).fillna(0.0)
        vols[p] = compute_measure(ret, w, "MV")
    assert all(vols[a] <= vols[b] + 2e-6 for a, b in zip(order, order[1:]))


# --------------------------------------------------------------------------- #
# Benchmark + endpoint
# --------------------------------------------------------------------------- #
def test_benchmark_weights_sum_to_one():
    bw = benchmark_weights("medium", "EUR", ACMAP)
    assert sum(bw.values()) == pytest.approx(1.0, abs=1e-3)


def test_run_includes_real_benchmark():
    from aa_engine.pipeline.run import run_allocation

    r = run_allocation("medium", "EUR", ensemble=_small())
    assert r.benchmark and "risk" in r.benchmark
    assert r.benchmark["placeholder"] is False


def test_profiles_endpoint():
    pytest.importorskip("fastapi")
    from fastapi.testclient import TestClient

    from aa_engine.api.main import app

    body = TestClient(app).get("/api/v1/profiles").json()
    assert body["placeholder"] is False
    assert [p["id"] for p in body["profiles"]] == ["low", "moderate", "medium", "high"]
    assert set(body["currencies"]) == {"EUR", "USD", "CHF"}
    # models per (profilo, valuta) con bande
    assert set(body["models"]["low"]) == {"EUR", "USD", "CHF"}
    assert set(body["models"]["low"]["EUR"]["bands"]) == set(body["asset_classes"])
