"""Test iterazione 2 — upload prezzi/mandato + analisi mandato (docs/13).

Copre parsing/validazione (CSV, pesi in %, prezzi mancanti, file malformati),
la radiografia del rischio, la ri-ottimizzazione ATTUALE-vs-PROPOSTA e i casi
limite onesti. L'ensemble è ridotto per restare veloci (richiede Riskfolio).
"""

from __future__ import annotations

import numpy as np
import pandas as pd
import pytest

pytest.importorskip("riskfolio")

from aa_engine.api import portfolio, store  # noqa: E402
from aa_engine.optimization import (  # noqa: E402
    EqualWeight,
    MaxSharpe,
    MinVolatility,
    OptimizationEnsemble,
)


def _prices_csv(tickers=("AAA", "BBB", "CCC", "DDD"), n=300, seed=7) -> str:
    rng = np.random.default_rng(seed)
    dates = pd.bdate_range(end="2026-06-26", periods=n)
    px = 100 * np.cumprod(1 + rng.normal(0.0003, 0.01, size=(n, len(tickers))), axis=0)
    df = pd.DataFrame(px, index=dates, columns=list(tickers))
    return df.reset_index().rename(columns={"index": "date"}).to_csv(index=False)


def _small():
    return OptimizationEnsemble([MinVolatility(), MaxSharpe(), EqualWeight()], n_best=2)


@pytest.fixture(autouse=True)
def _clean_store():
    store.STORE.clear()
    yield
    store.STORE.clear()


# --------------------------------------------------------------------------- #
# Parsing prezzi
# --------------------------------------------------------------------------- #
def test_parse_prices_ok():
    returns, summary = store.parse_prices(_prices_csv())
    assert summary["n_instruments"] == 4
    assert summary["n_observations"] == 299  # n-1 dopo pct_change
    assert summary["date_end"] == "2026-06-26"
    assert summary["warnings"] == []
    assert list(returns.columns) == ["AAA", "BBB", "CCC", "DDD"]


def test_parse_prices_short_series_warns():
    _, summary = store.parse_prices(_prices_csv(n=30))
    assert any("corte" in w for w in summary["warnings"])


def test_parse_prices_malformed_raises():
    with pytest.raises(store.UploadError):
        store.parse_prices("not,a\nreal price file")
    with pytest.raises(store.UploadError):
        store.parse_prices("")


# --------------------------------------------------------------------------- #
# Parsing mandato
# --------------------------------------------------------------------------- #
def test_parse_mandate_percent_and_missing():
    store.STORE.set_market(store.parse_prices(_prices_csv())[0], "t.csv")
    m = store.parse_mandate("ticker,peso\nAAA,40\nBBB,30\nCCC,20\nZZZ,10\n")
    assert m.weight_sum == pytest.approx(1.0, abs=1e-6)  # 100% → frazione
    assert m.missing_prices == ["ZZZ"]
    assert any("percentuali" in w for w in m.warnings)
    assert any("Mancano i prezzi" in w for w in m.warnings)


def test_parse_mandate_weights_not_100_warns():
    store.STORE.set_market(store.parse_prices(_prices_csv())[0], "t.csv")
    m = store.parse_mandate("ticker,weight\nAAA,0.2\nBBB,0.2\n")
    assert any("sommano" in w for w in m.warnings)


def test_parse_mandate_missing_weight_col_raises():
    with pytest.raises(store.UploadError):
        store.parse_mandate("ticker,isin\nAAA,X\n")


# --------------------------------------------------------------------------- #
# Analisi mandato
# --------------------------------------------------------------------------- #
def _load_and_holdings():
    store.STORE.set_market(store.parse_prices(_prices_csv())[0], "t.csv")
    return [
        {"ticker": "AAA", "weight": 0.4},
        {"ticker": "BBB", "weight": 0.3},
        {"ticker": "CCC", "weight": 0.2},
        {"ticker": "ZZZ", "weight": 0.1},  # senza prezzi
    ]


def test_analyze_runs_on_real_mandate():
    res = portfolio.analyze(_load_and_holdings())
    assert res["source"] == "user"
    assert res["covered_weight"] == pytest.approx(0.9, abs=1e-6)  # ZZZ escluso
    assert res["missing_prices"] == ["ZZZ"]
    assert len(res["metrics"]) == 21
    assert {s["ticker"] for s in res["signals"]} == {"AAA", "BBB", "CCC"}
    # contribuzioni: una per strumento analizzato
    assert {c["name"] for c in res["contributions"]} == {"AAA", "BBB", "CCC"}


def test_analyze_no_prices_raises():
    store.STORE.clear()  # nessun upload, mandato con ticker fuori dal campione
    with pytest.raises(store.UploadError):
        portfolio.analyze([{"ticker": "NOPE", "weight": 1.0}])


def test_reoptimize_current_vs_proposed():
    holdings = _load_and_holdings()
    res = portfolio.reoptimize(holdings, "balanced", "EUR", ensemble=_small())
    assert res["selected_models"]
    # ATTUALE e PROPOSTA sommano ~1 sugli strumenti analizzati
    assert sum(r["current"] for r in res["comparison"]) == pytest.approx(1.0, abs=1e-2)
    assert sum(r["proposed"] for r in res["comparison"]) == pytest.approx(1.0, abs=1e-2)
    # delta = proposed - current
    for r in res["comparison"]:
        assert r["delta"] == pytest.approx(r["proposed"] - r["current"], abs=1e-3)
    assert set(res["risk_delta"]) >= {"std_dev", "cvar_95", "max_drawdown"}


# --------------------------------------------------------------------------- #
# Endpoint (TestClient)
# --------------------------------------------------------------------------- #
def test_upload_endpoints(monkeypatch):
    pytest.importorskip("fastapi")
    from fastapi.testclient import TestClient

    import aa_engine.api.portfolio as port_mod
    from aa_engine.api.main import app

    monkeypatch.setattr(port_mod, "default_ensemble", lambda n_best=4: _small())
    client = TestClient(app)

    up = client.post("/api/v1/data/upload", json={"filename": "p.csv", "csv": _prices_csv()})
    assert up.status_code == 200 and up.json()["source"] == "user"

    uni = client.get("/api/v1/data/universe")
    assert uni.status_code == 200 and uni.json()["n_instruments"] == 4

    pf = client.post(
        "/api/v1/portfolio/upload",
        json={"csv": "ticker,peso\nAAA,40\nBBB,30\nCCC,30\n"},
    )
    assert pf.status_code == 200 and pf.json()["weight_sum"] == pytest.approx(1.0, abs=1e-6)

    holdings = [{"ticker": "AAA", "weight": 0.4}, {"ticker": "BBB", "weight": 0.6}]
    an = client.post("/api/v1/portfolio/analyze", json={"holdings": holdings})
    assert an.status_code == 200 and len(an.json()["metrics"]) == 21

    ro = client.post(
        "/api/v1/portfolio/reoptimize",
        json={"holdings": holdings, "profile": "balanced", "currency": "EUR"},
    )
    assert ro.status_code == 200 and ro.json()["comparison"]


def test_upload_bad_csv_returns_400():
    pytest.importorskip("fastapi")
    from fastapi.testclient import TestClient

    from aa_engine.api.main import app

    r = TestClient(app).post("/api/v1/data/upload", json={"csv": "garbage"})
    assert r.status_code == 400
    assert r.json()["error"]["code"] == "invalid_upload"
