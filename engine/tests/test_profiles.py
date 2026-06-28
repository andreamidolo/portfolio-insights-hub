"""Test dei profili di rischio CONFIGURABILI (spec docs/14).

Punto chiave (check #1): i profili sono DATI — cambiare una banda nella config
cambia l'allocazione, senza toccare il codice. Più: validazione di feasibility,
4 profili ordinati per rischio, benchmark, 3 valute.
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
        [MinVolatility(), MaxSharpe(), MinCVaR(), EqualWeight()], n_best=2
    )


def _equity_weight(weights: dict[str, float]) -> float:
    return sum(w for t, w in weights.items() if ACMAP[t] == "Equity")


# --------------------------------------------------------------------------- #
# Config: forma e default
# --------------------------------------------------------------------------- #
def test_default_config_has_four_profiles():
    cfg = load_profiles()
    assert cfg.profile_ids == ["conservative", "moderate", "balanced", "aggressive"]
    assert cfg.placeholder is True  # valori d'esempio, marcati
    assert set(cfg.currencies) == {"EUR", "USD", "CHF"}


# --------------------------------------------------------------------------- #
# Validazione di feasibility (check #2)
# --------------------------------------------------------------------------- #
def test_grid_min_gt_max_raises():
    with pytest.raises(ProfileConfigError, match="min"):
        _validate_grid("x", {g: Band(0.0, 0.2) for g in
                             ["fixed_income", "commodities", "cash", "alternatives"]}
                       | {"equity": Band(0.6, 0.5)})


def test_grid_sum_of_minimums_over_100_raises():
    bands = {
        "equity": Band(0.9, 1.0), "fixed_income": Band(0.9, 1.0),
        "commodities": Band(0.0, 0.0), "cash": Band(0.0, 0.0), "alternatives": Band(0.0, 0.0),
    }
    with pytest.raises(ProfileConfigError, match="minimi"):
        _validate_grid("y", bands)


def test_bad_config_file_raises(tmp_path):
    p = tmp_path / "broken.json"
    p.write_text(json.dumps({"profiles": [{"id": "x", "label": "X", "bands": {
        "equity": {"min": 0.7, "max": 1.0}, "fixed_income": {"min": 0.7, "max": 1.0},
        "commodities": {"min": 0, "max": 0}, "cash": {"min": 0, "max": 0},
        "alternatives": {"min": 0, "max": 0}}, "benchmark": "b"}]}))
    with pytest.raises(ProfileConfigError):
        load_profiles(p)


# --------------------------------------------------------------------------- #
# DATA-DRIVEN (check #1): cambiando una banda, l'allocazione cambia
# --------------------------------------------------------------------------- #
def _alloc_with_equity_floor(tmp_path, floor: float) -> dict[str, float]:
    cfg = {
        "_placeholder": True,
        "currencies": ["EUR"],
        "profiles": [{
            "id": "balanced", "label": "Balanced",
            "bands": {
                "equity": {"min": floor, "max": 1.0},
                "fixed_income": {"min": 0.0, "max": 1.0},
                "commodities": {"min": 0.0, "max": 1.0},
                "cash": {"min": 0.0, "max": 1.0},
                "alternatives": {"min": 0.0, "max": 1.0},
            },
            "benchmark": "bm",
        }],
        "benchmarks": {"bm": {"label": "BM", "composition": {"equity": 0.5, "fixed_income": 0.5}}},
    }
    path = tmp_path / f"cfg_{int(floor * 100)}.json"
    path.write_text(json.dumps(cfg))
    config = load_profiles(path)
    returns = sample_returns()
    cons = constraints_for("balanced", ACMAP, config=config)
    res = _small().run(returns, constraints=cons)
    return {t: float(w) for t, w in res.final_weights.items()}


def test_changing_band_changes_allocation(tmp_path):
    # La banda è un DATO: alzando il FLOOR equity nella config, l'allocazione
    # azionaria sale di conseguenza — senza toccare il codice (check #1).
    low = _alloc_with_equity_floor(tmp_path, 0.0)
    high = _alloc_with_equity_floor(tmp_path, 0.50)
    eq_low, eq_high = _equity_weight(low), _equity_weight(high)
    assert eq_high >= 0.50 - 1e-2          # il floor morde
    assert eq_high > eq_low + 0.10         # l'allocazione è cambiata davvero


# --------------------------------------------------------------------------- #
# 4 profili ordinati per rischio (check #3)
# --------------------------------------------------------------------------- #
def test_four_profiles_risk_ordering():
    from aa_engine.pipeline.run import run_allocation

    order = ["conservative", "moderate", "balanced", "aggressive"]
    vols = {}
    for p in order:
        r = run_allocation(p, "EUR", ensemble=_small())
        ret = sample_returns()[r.selected]
        w = pd.Series(r.final_weights).reindex(ret.columns).fillna(0.0)
        vols[p] = compute_measure(ret, w, "MV")
    assert all(vols[a] <= vols[b] + 2e-6 for a, b in zip(order, order[1:]))


# --------------------------------------------------------------------------- #
# Benchmark (check #4) + valute (check #5)
# --------------------------------------------------------------------------- #
def test_benchmark_weights_sum_to_one():
    bw = benchmark_weights("balanced", ACMAP)
    assert sum(bw.values()) == pytest.approx(1.0, abs=1e-3)


def test_run_includes_benchmark_block():
    from aa_engine.pipeline.run import run_allocation

    r = run_allocation("balanced", "EUR", ensemble=_small())
    assert r.benchmark and "risk" in r.benchmark
    assert r.benchmark["placeholder"] is True


def test_three_currencies_supported():
    from aa_engine.pipeline.run import run_allocation

    for cur in ("EUR", "USD", "CHF"):
        assert run_allocation("balanced", cur, ensemble=_small()).currency == cur


def test_profiles_endpoint():
    pytest.importorskip("fastapi")
    from fastapi.testclient import TestClient

    from aa_engine.api.main import app

    r = TestClient(app).get("/api/v1/profiles")
    assert r.status_code == 200
    body = r.json()
    assert body["placeholder"] is True
    assert [p["id"] for p in body["profiles"]] == [
        "conservative", "moderate", "balanced", "aggressive"
    ]
    assert set(body["currencies"]) == {"EUR", "USD", "CHF"}
    # ogni profilo ha le bande per le 5 asset class
    for p in body["profiles"]:
        assert set(p["bands"]) == set(body["asset_classes"])
