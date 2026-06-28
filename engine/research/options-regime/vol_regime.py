"""Utility di RICERCA per il regime da volatilità (binario opzioni).

NON è production code e NON fa parte di aa_engine: vive nella cartella di ricerca
e viene importato dai notebook. Usa aa_engine SOLO in lettura (il
``ProxyRegimeProvider`` è il giudice).

Contiene: caricamento dati locali, costruttori di segnali (soglia, momentum,
term-structure), il regime del proxy del motore, e la valutazione hit-ratio
(direzione del mese successivo) — tutto SENZA lookahead (percentili/medie solo su
dati passati).
"""

from __future__ import annotations

from pathlib import Path

import numpy as np
import pandas as pd

from aa_engine.data import ProxyRegimeProvider, Regime, StaticFileProvider

HERE = Path(__file__).resolve().parent
DATA = HERE / "data_local"

BENCHMARKS = {"Equity": "SPY", "Fixed Income": "TLT", "Gold": "GLD", "Commodities": "DBC"}
# indice di vol "naturale" per asset class (VIX→equity, MOVE→fixed income)
VOL_FOR_CLASS = {"Equity": "VIX", "Fixed Income": "MOVE"}

BULL, BEAR = int(Regime.BULL), int(Regime.BEAR)


# --------------------------------------------------------------------------- #
# Dati
# --------------------------------------------------------------------------- #
def load_vol() -> pd.DataFrame:
    """VIX e MOVE allineati (date × {VIX, MOVE})."""
    vix = pd.read_csv(DATA / "vix.csv", index_col=0, parse_dates=True)["VIX"]
    move = pd.read_csv(DATA / "move.csv", index_col=0, parse_dates=True)["MOVE"]
    return pd.concat({"VIX": vix, "MOVE": move}, axis=1).sort_index()


def load_prices() -> pd.DataFrame:
    """Prezzi dei benchmark (date × {SPY, TLT, GLD, DBC})."""
    return pd.read_csv(DATA / "prices.csv", index_col=0, parse_dates=True).sort_index()


# --------------------------------------------------------------------------- #
# Segnali candidati (regime ∈ {+1 BULL, −1 BEAR}); nessun lookahead
# --------------------------------------------------------------------------- #
def signal_threshold(vol: pd.Series, q: float = 0.80, lookback: int = 756) -> pd.Series:
    """Ipotesi 1 — livello con soglia: BEAR se la vol supera il suo percentile q
    (rolling, solo dati passati), altrimenti BULL."""
    thr = vol.rolling(lookback, min_periods=252).quantile(q)
    reg = np.where(vol > thr, BEAR, BULL)
    return pd.Series(reg, index=vol.index, name=f"thr_q{int(q * 100)}").where(thr.notna())


def signal_vol_momentum(vol: pd.Series, window: int = 21, q: float = 0.80,
                        lookback: int = 756) -> pd.Series:
    """Ipotesi 2 — momentum della vol: BEAR se la variazione su ``window`` giorni
    è nel q-percentile alto delle variazioni passate (vol in rapido aumento)."""
    chg = vol / vol.shift(window) - 1.0
    thr = chg.rolling(lookback, min_periods=252).quantile(q)
    reg = np.where(chg > thr, BEAR, BULL)
    return pd.Series(reg, index=vol.index, name=f"mom{window}_q{int(q * 100)}").where(thr.notna())


def signal_term_structure(vol: pd.Series, short: int = 21, long: int = 126) -> pd.Series:
    """Ipotesi 3 — scomposizione short/long: BEAR se la componente breve (MA corta)
    è sopra la componente lunga (MA lunga) → stress in costruzione."""
    ma_s = vol.rolling(short).mean()
    ma_l = vol.rolling(long, min_periods=long // 2).mean()
    reg = np.where(ma_s > ma_l, BEAR, BULL)
    return pd.Series(reg, index=vol.index, name=f"ts{short}_{long}").where(ma_l.notna())


# --------------------------------------------------------------------------- #
# Il GIUDICE: il ProxyRegimeProvider del motore (200d MA cross)
# --------------------------------------------------------------------------- #
def proxy_regime(asset_class: str, start, end, window: int = 200) -> pd.Series:
    """Serie di regime del ProxyRegimeProvider del motore per una asset class."""
    provider = StaticFileProvider(DATA / "prices.csv")
    proxy = ProxyRegimeProvider(BENCHMARKS, provider, window=window)
    s = proxy.get_regime_series(asset_class, start=start, end=end)
    return s.astype(int)


# --------------------------------------------------------------------------- #
# Valutazione: hit ratio sulla direzione del mese successivo (slide 14)
# --------------------------------------------------------------------------- #
def _forward_sign(price: pd.Series, horizon: int = 21) -> pd.Series:
    fwd = price.shift(-horizon) / price - 1.0
    return np.sign(fwd)


def hit_ratio(regime: pd.Series, price: pd.Series, *, horizon: int = 21,
              monthly: bool = True) -> dict:
    """Hit ratio del regime: predice la direzione del rendimento a ``horizon``?

    Allinea regime e prezzi, calcola il segno del rendimento forward, conta le
    previsioni corrette (BULL↔su, BEAR↔giù). Se ``monthly`` campiona ogni 21 giorni
    (osservazioni quasi indipendenti, come la slide AlgoEagle).
    """
    df = pd.concat({"reg": regime, "px": price}, axis=1).dropna()
    fsign = _forward_sign(df["px"], horizon)
    df = df.assign(fsign=fsign).dropna()
    df = df[df["fsign"] != 0]
    if monthly:
        df = df.iloc[::horizon]
    correct = (df["reg"] == df["fsign"]).mean()
    base_rate = (df["fsign"] > 0).mean()          # quota di mesi "su" (base BULL)
    bull_share = (df["reg"] > 0).mean()           # quanto spesso il segnale dice BULL
    return {
        "hit_ratio": float(correct),
        "n": int(len(df)),
        "base_rate_up": float(base_rate),
        "bull_share": float(bull_share),
    }


def compare_table(signal: pd.Series, asset_class: str, *, horizon: int = 21) -> pd.DataFrame:
    """Confronto segnale-candidato vs proxy vs base-rate per una asset class."""
    prices = load_prices()
    price = prices[BENCHMARKS[asset_class]].dropna()
    start, end = price.index.min(), price.index.max()
    proxy = proxy_regime(asset_class, start, end)

    sig = signal.reindex(price.index).ffill()
    prx = proxy.reindex(price.index).ffill()

    rows = {
        "signal": hit_ratio(sig, price, horizon=horizon),
        "proxy": hit_ratio(prx, price, horizon=horizon),
    }
    out = pd.DataFrame(rows).T
    out.index.name = f"{asset_class} (h={horizon}d)"
    return out


def hit_ratio_by_year(regime: pd.Series, price: pd.Series, *, horizon: int = 21) -> pd.Series:
    """Hit ratio per anno solare (test di stabilità)."""
    df = pd.concat({"reg": regime, "px": price}, axis=1).dropna()
    df = df.assign(fsign=_forward_sign(df["px"], horizon)).dropna()
    df = df[df["fsign"] != 0].iloc[::horizon]
    df["correct"] = (df["reg"] == df["fsign"]).astype(float)
    return df.groupby(df.index.year)["correct"].mean()
