"""Loader dei dati di mercato reali (Bloomberg) come **base del motore**.

Legge le matrici prodotte da ``aa_engine.data.bloomberg_import`` sotto
``engine/data/market/`` (gitignored — dati licenziati) e le espone al motore:

    - ``load_returns()``  rendimenti giornalieri (convenzione motore: ffill →
      pct_change → fillna(0), come ``api/store.parse_prices``);
    - ``asset_class_map()`` ticker → etichetta asset class riconosciuta da
      ``profiles.GROUP_OF_ASSET_CLASS`` (così i vincoli di profilo si applicano).

Se i file non esistono (es. CI, clone fresco senza il Data Pack), le funzioni
ritornano ``None``: il chiamante ricade sul backbone campione. La base Bloomberg
si rigenera con ``python -m aa_engine.data.bloomberg_import <file.xlsx>``.
"""

from __future__ import annotations

from functools import lru_cache
from pathlib import Path

import pandas as pd

# asset_class del manifest → etichetta compresa da profiles.GROUP_OF_ASSET_CLASS
_ENGINE_LABEL: dict[str, str] = {
    "Equity_DM": "Equity",
    "Equity_EM": "Equity",
    "Fixed_Income_IG": "Fixed Income",
    "Fixed_Income_HY": "HY",
    "Commodity": "Commodities",
    "Alternative": "Alternatives",
}


def market_dir() -> Path:
    return Path(__file__).resolve().parents[3] / "data" / "market"


def _manifest_path() -> Path:
    # manifest metadati versionato in config/ (i prezzi restano in data/market/)
    return Path(__file__).resolve().parents[2] / "config" / "market_universe.csv"


def prices_path() -> Path:
    return market_dir() / "prices.csv"


def available() -> bool:
    return prices_path().exists()


@lru_cache(maxsize=1)
def load_universe() -> pd.DataFrame | None:
    p = _manifest_path()
    if not p.exists():
        p = market_dir() / "universe.csv"
    if not p.exists():
        return None
    return pd.read_csv(p)


def load_prices() -> pd.DataFrame | None:
    if not available():
        return None
    return pd.read_csv(prices_path(), index_col=0, parse_dates=True).sort_index()


def load_returns(min_obs: int = 252, common_window: bool = False) -> pd.DataFrame | None:
    """Rendimenti giornalieri (convenzione motore). Scarta serie < ``min_obs`` obs reali.

    ffill dei buchi interni, pct_change, poi le celle pre-inizio (strumenti con
    storia più corta) restano 0 — stessa convenzione di ``api/store.parse_prices``.

    ``common_window=True`` restringe invece alla finestra in cui **tutti** gli
    strumenti tenuti hanno dati (dropna): covarianza pulita per l'ottimizzazione
    (niente colonne a varianza zero → evita l'esclusione di HRP), ma storia più
    corta. Consigliato per l'ottimizzazione/backtest multi-asset.
    """
    px = load_prices()
    if px is None:
        return None
    keep = [c for c in px.columns if px[c].notna().sum() >= min_obs]
    px = px[keep].ffill()
    if common_window:
        px = px.dropna()
        return px.pct_change().dropna(how="any")
    rets = px.pct_change().replace([float("inf"), float("-inf")], pd.NA).dropna(how="all")
    return rets.fillna(0.0)


def asset_class_map(tickers=None) -> dict[str, str]:
    """ticker → etichetta asset class (Equity / Fixed Income / HY / Commodities / Alternatives)."""
    u = load_universe()
    if u is None:
        return {}
    m = {
        str(row["symbol"]): _ENGINE_LABEL.get(str(row["asset_class"]), "Alternatives")
        for _, row in u.iterrows()
        if str(row.get("role")) == "investibile"
    }
    if tickers is not None:
        m = {t: m[t] for t in tickers if t in m}
    return m


def load_base_returns(
    min_obs: int = 2520, common_window: bool = True
) -> tuple[pd.DataFrame, dict[str, str], str] | None:
    """Base del motore: (returns, acmap, source) se i dati Bloomberg ci sono, else None.

    Default: strumenti con ≥10y di storia (``min_obs=2520``) sulla loro **finestra
    comune** — universo ampio (~31 strumenti) con covarianza pulita (~2015→oggi).
    Evita le colonne a varianza zero da start scaglionati (che escluderebbero HRP).
    """
    rets = load_returns(min_obs=min_obs, common_window=common_window)
    if rets is None or rets.empty:
        return None
    acmap = asset_class_map(rets.columns)
    return rets, acmap, "bloomberg:data/market/prices.csv"
