"""Test dell'API FastAPI: forma dei payload (contratto) e coerenza dei numeri.

Verifica che gli endpoint di docs/05_api_contract.md restituiscano esattamente
gli schemi attesi e che i numeri (calcolati dal risk engine sul backbone
campione) siano coerenti.
"""

from __future__ import annotations

import pytest
from fastapi.testclient import TestClient

from aa_engine.api.main import app
from aa_engine.risk.definitions import ALL_MEASURES

client = TestClient(app)
BASE = "/api/v1"


def test_health():
    r = client.get(f"{BASE}/health")
    assert r.status_code == 200
    body = r.json()
    assert body["status"] == "ok"
    assert isinstance(body["version"], str) and body["version"]


def test_regimes_shape():
    r = client.get(f"{BASE}/regimes")
    assert r.status_code == 200
    body = r.json()
    assert body["source"] in ("proxy", "options")
    assert len(body["regimes"]) == 5
    for item in body["regimes"]:
        assert set(item) == {"asset_class", "regime"}
        assert item["regime"] in ("bull", "bear")


def test_portfolio_weights_sum_to_one():
    r = client.get(f"{BASE}/portfolio", params={"profile": "balanced", "currency": "EUR"})
    assert r.status_code == 200
    body = r.json()
    assert body["profile"] == "balanced"
    total = sum(h["weight"] for h in body["holdings"])
    assert total == pytest.approx(1.0, abs=1e-3)
    assert sum(body["asset_class_weights"].values()) == pytest.approx(1.0, abs=1e-3)
    assert sum(body["currency_exposure"].values()) == pytest.approx(1.0, abs=1e-3)


def test_risk_panel_contract():
    r = client.post(
        f"{BASE}/risk/panel",
        json={"profile": "balanced", "currency": "EUR", "alpha": 0.05, "regime_conditional": True},
    )
    assert r.status_code == 200
    body = r.json()
    assert body["regime_conditional"] is True
    assert set(body["summary"]) == {
        "cumulative_return", "cagr", "sharpe", "max_drawdown", "volatility"
    }
    assert len(body["metrics"]) == len(ALL_MEASURES)
    families = {m["family"] for m in body["metrics"]}
    assert families == {"return_based", "tail", "drawdown_based"}
    by_code = {m["code"]: m["value"] for m in body["metrics"]}
    # coerenza di coda e drawdown
    assert by_code["CVaR"] >= by_code["VaR"]
    assert by_code["EVaR"] >= by_code["CVaR"]
    assert by_code["MDD"] >= by_code["ADD"]
    assert by_code["MV"] > 0


def test_regime_conditional_changes_panel():
    payload = {"profile": "balanced", "currency": "EUR"}
    full = client.post(f"{BASE}/risk/panel", json={**payload, "regime_conditional": False}).json()
    cond = client.post(f"{BASE}/risk/panel", json={**payload, "regime_conditional": True}).json()
    mv_full = next(m["value"] for m in full["metrics"] if m["code"] == "MV")
    mv_cond = next(m["value"] for m in cond["metrics"] if m["code"] == "MV")
    assert mv_full != mv_cond


def test_contributions_sum_to_total_mv():
    panel = client.post(
        f"{BASE}/risk/panel",
        json={"profile": "aggressive", "regime_conditional": False},
    ).json()
    mv_total = next(m["value"] for m in panel["metrics"] if m["code"] == "MV")
    contrib = client.get(
        f"{BASE}/risk/contributions",
        params={"profile": "aggressive", "measure": "MV"},
    ).json()
    s = sum(c["risk_contribution"] for c in contrib["contributions"])
    # somma dei contributi ≈ rischio totale (proprietà di Euler), entrambi full-history
    assert s == pytest.approx(mv_total, rel=1e-2)


def test_invalid_measure_returns_error_contract():
    r = client.get(f"{BASE}/risk/contributions", params={"measure": "NOPE"})
    assert r.status_code == 400
    assert set(r.json()["error"]) == {"code", "message"}


def test_invalid_profile_rejected():
    r = client.get(f"{BASE}/portfolio", params={"profile": "wild"})
    assert r.status_code == 422  # validazione FastAPI sul Literal
