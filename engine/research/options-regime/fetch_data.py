"""Scarica i dati GRATUITI per la ricerca sul regime da volatilità.

    python fetch_data.py

Sorgenti (nessuna API key):
    - VIX  : CBOE (storico completo dal 1990)
    - MOVE : Yahoo Finance (^MOVE, vol implicita Treasury)
    - SPY/TLT/GLD/DBC : Yahoo (benchmark per Equity/FixedIncome/Gold/Commodities)

I dati vanno in ``data_local/`` e NON sono versionati (vedi data_local/.gitignore).
È puro caricamento dati per i notebook: NON tocca aa_engine.
"""

from __future__ import annotations

import io
import subprocess
from pathlib import Path

import pandas as pd

HERE = Path(__file__).resolve().parent
DATA = HERE / "data_local"
DATA.mkdir(exist_ok=True)

_UA = "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36"
CBOE_VIX = "https://cdn.cboe.com/api/global/us_indices/daily_prices/VIX_History.csv"
# period1/period2 (epoch) + interval=1d → granularità GIORNALIERA su tutto lo
# storico (range=max degraderebbe a mensile sugli orizzonti lunghi).
YF = (
    "https://query1.finance.yahoo.com/v8/finance/chart/{sym}"
    "?period1=946684800&period2=4102444800&interval=1d"
)

# benchmark per asset class (il proxy del motore userà questi)
BENCHMARKS = {"Equity": "SPY", "Fixed Income": "TLT", "Gold": "GLD", "Commodities": "DBC"}


def _curl(url: str) -> bytes:
    out = subprocess.run(
        ["curl", "-s", "--max-time", "40", "-A", _UA, url],
        capture_output=True, check=True,
    )
    return out.stdout


def fetch_vix() -> pd.Series:
    raw = _curl(CBOE_VIX)
    df = pd.read_csv(io.BytesIO(raw))
    df["DATE"] = pd.to_datetime(df["DATE"])
    s = df.set_index("DATE")["CLOSE"].rename("VIX").sort_index()
    s.to_csv(DATA / "vix.csv")
    return s


def fetch_yahoo(symbol: str) -> pd.Series:
    import json

    raw = _curl(YF.format(sym=symbol.replace("^", "%5E")))
    res = json.loads(raw)["chart"]["result"][0]
    ts = pd.to_datetime(res["timestamp"], unit="s").normalize()
    close = res["indicators"]["quote"][0]["close"]
    return pd.Series(close, index=ts, name=symbol).dropna()


def main() -> None:
    vix = fetch_vix()
    print(f"VIX  : {len(vix)} righe  {vix.index.min().date()} → {vix.index.max().date()}")

    move = fetch_yahoo("^MOVE")
    move.rename("MOVE").to_csv(DATA / "move.csv")
    print(f"MOVE : {len(move)} righe  {move.index.min().date()} → {move.index.max().date()}")

    prices = {}
    for ac, sym in BENCHMARKS.items():
        prices[sym] = fetch_yahoo(sym)
        print(f"{sym:4} : {len(prices[sym])} righe ({ac})")
    px = pd.DataFrame(prices).sort_index()
    px.to_csv(DATA / "prices.csv")
    print(f"prices: {px.shape} → data_local/prices.csv")


if __name__ == "__main__":
    main()
