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
from aa_engine.pipeline.run import run_allocation  # noqa: E402
from aa_engine.risk import compute_measure  # noqa: E402


def _small():
    return OptimizationEnsemble([MinVolatility(), MaxSharpe(), BlackLitterman(), EqualWeight()], n_best=2)


@pytest.fixture(scope="module")
def result():
    return run_allocation("balanced", "EUR", ensemble=_small())


# --------------------------------------------------------------------------- #
# Flusso unico
# --------------------------------------------------------------------------- #
def test_allocation_result_complete(result):
    assert result.profile == "balanced" and result.currency == "EUR"
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
    for prof in ["moderate", "balanced", "aggressive"]:
        r = run_allocation(prof, "EUR", ensemble=_small())
        ret = sample_returns()[r.selected]
        w = pd.Series(r.final_weights).reindex(ret.columns).fillna(0.0)
        vols[prof] = compute_measure(ret, w, "MV")
    assert vols["moderate"] <= vols["balanced"] + 1e-6 <= vols["aggressive"] + 2e-6


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

    cli = run_allocation("balanced", "EUR")          # usa il default (ora patchato)
    api = TestClient(app).post(
        "/api/v1/allocation/run", json={"profile": "balanced", "currency": "EUR"}
    ).json()
    assert api["final_weights"] == cli.final_weights
    assert api["selected_models"] == cli.selected_models
    assert api["regimes"] == cli.regimes
