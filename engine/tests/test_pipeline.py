"""Test della Fase 4 — pipeline end-to-end + report + bottone API.

Per restare veloci, si inietta un ensemble RIDOTTO (il flusso è identico, cambia
solo il numero di modelli). Richiede Riskfolio (modelli di ottimizzazione).
"""

from __future__ import annotations

import pandas as pd
import pytest

pytest.importorskip("riskfolio")

from aa_engine.optimization import (  # noqa: E402
    BlackLitterman,
    EqualWeight,
    MaxSharpe,
    MinVolatility,
    OptimizationEnsemble,
)
from aa_engine.optimization.sample import ASSET_CLASS_MAP, sample_returns  # noqa: E402
from aa_engine.pipeline.report import render_html, render_markdown  # noqa: E402
from aa_engine.pipeline.run import (  # noqa: E402
    compute_optimization_models,
    compute_signals,
    run_allocation,
)
from aa_engine.risk import compute_measure  # noqa: E402


def _small():
    return OptimizationEnsemble([MinVolatility(), MaxSharpe(), BlackLitterman(), EqualWeight()], n_best=2)


@pytest.fixture(scope="module")
def result():
    return run_allocation("moderate", "EUR", ensemble=_small())


# --------------------------------------------------------------------------- #
# Flusso unico
# --------------------------------------------------------------------------- #
def test_allocation_result_complete(result):
    assert result.profile == "moderate" and result.currency == "EUR"
    assert result.n_models_active > 0
    assert set(result.regimes) and all(v in ("bull", "bear") for v in result.regimes.values())
    # ogni strumento dell'universo ha una riga segnali
    universe = list(sample_returns().columns)
    assert {s["ticker"] for s in result.signals} == set(universe)
    # selezionati + scartati = universo
    assert set(result.selected) | set(result.discarded) == set(universe)


def test_weights_consistent(result):
    assert sum(result.final_weights.values()) == pytest.approx(1.0, abs=1e-3)
    assert sum(result.asset_class_weights.values()) == pytest.approx(1.0, abs=1e-3)
    # peso per asset class = somma pesi strumenti della classe
    by_class: dict[str, float] = {}
    for t, w in result.final_weights.items():
        by_class[ASSET_CLASS_MAP[t]] = by_class.get(ASSET_CLASS_MAP[t], 0.0) + w
    for ac, v in result.asset_class_weights.items():
        assert by_class.get(ac, 0.0) == pytest.approx(v, abs=1e-2)


def test_risk_panel_present(result):
    for k in ["std_dev", "var_95", "cvar_95", "max_drawdown", "calmar", "sharpe"]:
        assert k in result.risk


def test_invalid_profile_raises():
    with pytest.raises(ValueError):
        run_allocation("wild", ensemble=_small())


# --------------------------------------------------------------------------- #
# Profili: rischio crescente
# --------------------------------------------------------------------------- #
def test_profile_risk_ordering():
    vols = {}
    for prof in ["low", "moderate", "high"]:
        r = run_allocation(prof, "EUR", ensemble=_small())
        ret = sample_returns()[r.selected]
        w = pd.Series(r.final_weights).reindex(ret.columns).fillna(0.0)
        vols[prof] = compute_measure(ret, w, "MV")
    assert vols["low"] <= vols["moderate"] + 1e-6 <= vols["high"] + 2e-6


# --------------------------------------------------------------------------- #
# Report
# --------------------------------------------------------------------------- #
def test_report_renders(result):
    md = render_markdown(result)
    for section in ["# Report di Allocazione", "## Executive summary", "## Segnali per strumento",
                    "## Allocazione finale", "## Pannello di rischio", "## Dietro le quinte"]:
        assert section in md
    html = render_html(result)
    assert "<table>" in html and "<h1>" in html


# --------------------------------------------------------------------------- #
# Il bottone API == CLI (stesso flusso, niente logica duplicata)
# --------------------------------------------------------------------------- #
def test_cli_equals_api(monkeypatch):
    pytest.importorskip("fastapi")
    from fastapi.testclient import TestClient

    import aa_engine.pipeline.run as run_mod
    from aa_engine.api.main import app

    monkeypatch.setattr(run_mod, "default_ensemble", lambda n_best=4: _small())

    cli = run_allocation("moderate", "EUR")          # usa il default (ora patchato)
    api = TestClient(app).post(
        "/api/v1/allocation/run", json={"profile": "moderate", "currency": "EUR"}
    ).json()
    assert api["final_weights"] == cli.final_weights
    assert api["selected_models"] == cli.selected_models
    assert api["regimes"] == cli.regimes


# --------------------------------------------------------------------------- #
# Finestre di lettura: GET /signals e GET /optimization/models
# --------------------------------------------------------------------------- #
def test_signals_window():
    s = compute_signals()
    # SVM dichiaratamente disattivato (onestà: non batte il baseline)
    assert s["svm_enabled"] is False and s["svm_note"]
    universe = list(sample_returns().columns)
    assert {row["ticker"] for row in s["signals"]} == set(universe)
    assert all(v in ("bull", "bear") for v in s["regimes"].values())
    # ogni riga ha le 4 colonne segnale con direzione/probabilità
    row = s["signals"][0]
    for col in ("trend", "oscillator", "alpha_crash", "summary"):
        assert set(row[col]) == {"direction", "probability"}
        assert row[col]["direction"] in (-1, 0, 1)
    assert set(s["selected"]) | set(s["discarded"]) == set(universe)


def test_optimization_models_window():
    r = compute_optimization_models("moderate", "EUR", ensemble=_small())
    assert r["scorer"] and r["n_models_active"] == len(r["models"])
    # i modelli "selected" coincidono con selected_models
    sel = [m["name"] for m in r["models"] if m["selected"]]
    assert set(sel) == set(r["selected_models"])
    # ogni modello ha pesi che sommano ~1 (i ≈0 sono omessi)
    for m in r["models"]:
        assert sum(m["weights"].values()) == pytest.approx(1.0, abs=1e-2)
    # allocazione finale coerente con run_allocation (stesso ensemble/flusso)
    assert sum(r["final_weights"].values()) == pytest.approx(1.0, abs=1e-3)
    # baseline 1/N presente sugli strumenti selezionati
    assert set(r["baseline_equal_weight"]) == set(r["selected"])


def test_signals_endpoint():
    pytest.importorskip("fastapi")
    from fastapi.testclient import TestClient

    from aa_engine.api.main import app

    r = TestClient(app).get("/api/v1/signals")
    assert r.status_code == 200
    body = r.json()
    assert body["svm_enabled"] is False
    assert len(body["signals"]) == len(list(sample_returns().columns))


def test_lite_mode_reduces_models(monkeypatch):
    # AA_ENGINE_LITE riduce l'ensemble (hosting con poca CPU) — il flusso resta lo stesso.
    import aa_engine.optimization as opt

    monkeypatch.setenv("AA_ENGINE_LITE", "1")
    assert opt.lite_enabled() is True
    assert len(opt.active_models()) == len(opt.LITE_MODELS) < len(opt.DEFAULT_MODELS)

    res = run_allocation("moderate", "EUR")  # usa il default (ora ridotto)
    assert res.lite is True
    assert res.n_models_active == len(opt.LITE_MODELS)
    assert sum(res.final_weights.values()) == pytest.approx(1.0, abs=1e-3)


def test_optimization_models_endpoint(monkeypatch):
    pytest.importorskip("fastapi")
    from fastapi.testclient import TestClient

    import aa_engine.pipeline.run as run_mod
    from aa_engine.api.main import app

    monkeypatch.setattr(run_mod, "default_ensemble", lambda n_best=4: _small())
    r = TestClient(app).get("/api/v1/optimization/models", params={"profile": "moderate"})
    assert r.status_code == 200
    body = r.json()
    assert body["profile"] == "moderate"
    assert body["models"] and "baseline_equal_weight" in body
