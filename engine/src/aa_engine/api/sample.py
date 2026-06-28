"""Backbone dati CAMPIONE (deterministico) per l'API.

"Prima la macchina, poi la benzina": l'API deve restituire numeri *veri*,
calcolati dal risk engine, ma i dati di input qui sono **sintetici e
deterministici** (seed fisso) finché non si collegano Bloomberg/Morningstar.
Sostituendo questo modulo con un vero ``PriceProvider`` gli endpoint non cambiano.

Modello generativo: un fattore di mercato a code grasse (t di Student) +
componente idiosincratica per strumento, con beta e parametri per asset class.
Produce drawdown, asimmetria e curtosi realistici → metriche di coda sensate.
"""

from __future__ import annotations

from dataclasses import dataclass
from functools import lru_cache

import numpy as np
import pandas as pd

from aa_engine.data import Regime
from aa_engine.risk import BY_CODE, compute_measure, risk_contribution, risk_panel
from aa_engine.risk.measures import _portfolio_returns

# Ancoraggio deterministico (niente "oggi" runtime: test riproducibili).
END_DATE = pd.Timestamp("2026-06-26")
N_DAYS = 756  # ~36 mesi di giorni lavorativi (cfr. UI "trailing 36 months")
SEED = 20260626
REGIME_WINDOW = 150  # giorni per la media mobile del proxy di regime


@dataclass(frozen=True)
class Instrument:
    name: str
    isin: str
    asset_class: str
    currency: str
    beta: float           # esposizione al fattore di mercato
    mu_ann: float         # rendimento atteso annualizzato
    vol_ann: float        # volatilità idiosincratica annualizzata


# Universo campione (ISIN illustrativi; alcuni ripresi dal contratto API).
INSTRUMENTS: tuple[Instrument, ...] = (
    Instrument("iShares MSCI World ETF",   "US4642863926", "Equity",       "USD", 1.00, 0.085, 0.060),
    Instrument("iShares MSCI EM ETF",      "US4642872349", "Equity",       "USD", 1.15, 0.075, 0.090),
    Instrument("USD Treasury 7-10y ETF",   "IE00B3VWN518", "Fixed Income", "USD", -0.20, 0.022, 0.045),
    Instrument("Euro Govt Bond 7-10y ETF", "IE00B1FZS798", "Fixed Income", "EUR", -0.15, 0.018, 0.040),
    Instrument("USD High Yield Corp ETF",  "IE00B66F4759", "HY",           "USD", 0.55, 0.050, 0.070),
    Instrument("Diversified Commodity ETF", "IE00BD6FTQ80", "Commodities",  "USD", 0.45, 0.030, 0.150),
    Instrument("Gold Bullion ETC",         "DE000A0S9GB0", "Gold",         "USD", -0.10, 0.040, 0.140),
    Instrument("EUR Money Market Fund",    "LU0996182563", "Money Market", "EUR", 0.00, 0.020, 0.004),
    Instrument("Liquid Alternatives UCITS", "LU1670631925", "Alternative",  "EUR", 0.20, 0.030, 0.060),
)

# Pesi target per asset class, per profilo (sommano a 1).
PROFILE_ASSET_WEIGHTS: dict[str, dict[str, float]] = {
    "conservative": {
        "Equity": 0.15, "Fixed Income": 0.50, "HY": 0.05, "Commodities": 0.03,
        "Gold": 0.05, "Money Market": 0.20, "Alternative": 0.02,
    },
    "moderate": {
        "Equity": 0.30, "Fixed Income": 0.40, "HY": 0.05, "Commodities": 0.05,
        "Gold": 0.05, "Money Market": 0.13, "Alternative": 0.02,
    },
    "balanced": {
        "Equity": 0.55, "Fixed Income": 0.20, "HY": 0.10, "Commodities": 0.08,
        "Gold": 0.05, "Money Market": 0.00, "Alternative": 0.02,
    },
    "aggressive": {
        "Equity": 0.75, "Fixed Income": 0.05, "HY": 0.08, "Commodities": 0.07,
        "Gold": 0.03, "Money Market": 0.00, "Alternative": 0.02,
    },
}

# Asset class mostrate nello "strip" regime della UI (sottoinsieme + Dollar).
REGIME_ASSET_CLASSES: tuple[str, ...] = (
    "Equity", "Fixed Income", "Dollar", "Commodities", "Gold",
)

TRADING_DAYS = 252


# --------------------------------------------------------------------------- #
# Generazione dati (cache: deterministica, calcolata una volta)
# --------------------------------------------------------------------------- #
@lru_cache(maxsize=1)
def _market_factor() -> pd.Series:
    """Fattore di mercato comune, code grasse (t di Student, ~12% vol annua)."""
    rng = np.random.default_rng(SEED)
    dates = pd.bdate_range(end=END_DATE, periods=N_DAYS)
    daily_vol = 0.12 / np.sqrt(TRADING_DAYS)
    raw = rng.standard_t(df=5, size=N_DAYS)
    factor = raw / np.sqrt(5 / 3) * daily_vol  # normalizza la varianza della t
    return pd.Series(factor, index=dates, name="market")


@lru_cache(maxsize=1)
def instrument_returns() -> pd.DataFrame:
    """Rendimenti giornalieri per strumento (date × ISIN/name).

    ``r_{i,t} = μ_i/252 + β_i · market_t + ε_{i,t}``, con ε idiosincratico.
    """
    market = _market_factor()
    dates = market.index
    rng = np.random.default_rng(SEED + 1)
    cols = {}
    for inst in INSTRUMENTS:
        idio = rng.normal(0.0, inst.vol_ann / np.sqrt(TRADING_DAYS), size=len(dates))
        drift = inst.mu_ann / TRADING_DAYS
        cols[inst.name] = drift + inst.beta * market.to_numpy() + idio
    return pd.DataFrame(cols, index=dates)


@lru_cache(maxsize=1)
def _asset_class_prices() -> pd.DataFrame:
    """Indici di prezzo per asset class (equal-weight dei membri) per il regime.

    "Dollar" non ha strumenti diretti: lo approssimiamo come l'inverso di un
    paniere non-USD (proxy di forza del dollaro) — trasparente e provvisorio.
    """
    rets = instrument_returns()
    by_class: dict[str, pd.Series] = {}
    classes = {inst.asset_class for inst in INSTRUMENTS}
    for ac in classes:
        members = [i.name for i in INSTRUMENTS if i.asset_class == ac]
        by_class[ac] = rets[members].mean(axis=1)
    # Proxy "Dollar": opposto del rendimento medio degli strumenti non-USD.
    non_usd = [i.name for i in INSTRUMENTS if i.currency != "USD"]
    by_class["Dollar"] = -rets[non_usd].mean(axis=1)
    class_rets = pd.DataFrame(by_class)
    return (1.0 + class_rets).cumprod() * 100.0


def _regime_series(asset_class: str) -> pd.Series:
    """Serie di regime (proxy MA-cross) per una asset class: BULL se prezzo ≥ MA."""
    prices = _asset_class_prices()[asset_class]
    ma = prices.rolling(REGIME_WINDOW, min_periods=REGIME_WINDOW // 2).mean()
    reg = np.where(prices >= ma, int(Regime.BULL), int(Regime.BEAR))
    return pd.Series(reg, index=prices.index, name=f"regime_{asset_class}")


def _market_regime_mask() -> tuple[pd.Series, Regime]:
    """Maschera del regime corrente di *mercato* (Equity) per il filtro del pannello.

    Ritorna ``(mask booleana sui giorni nel regime corrente, regime corrente)``.
    """
    series = _regime_series("Equity")
    current = Regime(int(series.iloc[-1]))
    mask = series == int(current)
    return mask, current


# --------------------------------------------------------------------------- #
# Pesi & portafoglio
# --------------------------------------------------------------------------- #
def _instrument_weights(profile: str) -> pd.Series:
    """Distribuisce i pesi di asset class equamente sugli strumenti della classe."""
    if profile not in PROFILE_ASSET_WEIGHTS:
        raise KeyError(profile)
    ac_w = PROFILE_ASSET_WEIGHTS[profile]
    weights = {}
    for ac, w in ac_w.items():
        members = [i for i in INSTRUMENTS if i.asset_class == ac]
        if not members or w == 0:
            continue
        for inst in members:
            weights[inst.name] = weights.get(inst.name, 0.0) + w / len(members)
    s = pd.Series(weights)
    return s.reindex([i.name for i in INSTRUMENTS]).fillna(0.0)


def as_of() -> str:
    return END_DATE.date().isoformat()


# --------------------------------------------------------------------------- #
# Funzioni servite agli endpoint
# --------------------------------------------------------------------------- #
def get_regimes() -> list[dict]:
    """Regime corrente per ciascuna asset class della UI (sorgente: proxy)."""
    out = []
    for ac in REGIME_ASSET_CLASSES:
        cur = Regime(int(_regime_series(ac).iloc[-1]))
        out.append({"asset_class": ac, "regime": "bull" if cur == Regime.BULL else "bear"})
    return out


def get_portfolio(profile: str, currency: str) -> dict:
    """Holdings, pesi per asset class ed esposizione valutaria per profilo."""
    w = _instrument_weights(profile)
    holdings = [
        {
            "name": inst.name, "isin": inst.isin, "asset_class": inst.asset_class,
            "weight": round(float(w[inst.name]), 4), "currency": inst.currency,
        }
        for inst in INSTRUMENTS if w[inst.name] > 0
    ]
    ac_weights: dict[str, float] = {}
    cur_exposure: dict[str, float] = {}
    for inst in INSTRUMENTS:
        wi = float(w[inst.name])
        if wi <= 0:
            continue
        ac_weights[inst.asset_class] = round(ac_weights.get(inst.asset_class, 0.0) + wi, 4)
        cur_exposure[inst.currency] = round(cur_exposure.get(inst.currency, 0.0) + wi, 4)
    return {
        "profile": profile, "currency": currency, "as_of": as_of(),
        "holdings": holdings,
        "asset_class_weights": ac_weights,
        "currency_exposure": cur_exposure,
    }


def _summary(returns: pd.DataFrame, weights: pd.Series) -> dict:
    """Statistiche di sintesi sull'intera storia (path-dependent: non filtrate)."""
    r_p = _portfolio_returns(returns, weights)
    n = len(r_p)
    cumulative = float((1.0 + r_p).prod() - 1.0)
    cagr = float((1.0 + cumulative) ** (TRADING_DAYS / n) - 1.0) if n else float("nan")
    vol = compute_measure(returns, weights, "MV")
    sharpe = float(r_p.mean() / r_p.std(ddof=1) * np.sqrt(TRADING_DAYS)) if r_p.std(ddof=1) else 0.0
    mdd = compute_measure(returns, weights, "MDD")
    return {
        "cumulative_return": round(cumulative, 6),
        "cagr": round(cagr, 6),
        "sharpe": round(sharpe, 4),
        "max_drawdown": round(float(mdd), 6),
        "volatility": round(float(vol), 6),
    }


def get_risk_panel(
    profile: str, currency: str, alpha: float, mar: float, regime_conditional: bool
) -> dict:
    """Pannello di rischio completo (Linea 2) + sintesi, opzionalmente regime-conditional."""
    returns = instrument_returns()
    weights = _instrument_weights(profile)
    mask = None
    if regime_conditional:
        mask, _ = _market_regime_mask()

    panel = risk_panel(returns, weights, alpha=alpha, mar=mar, regime_mask=mask)
    metrics = []
    for _, row in panel.iterrows():
        ratio = row["ret_minus_mar_over_risk"]
        metrics.append(
            {
                "family": row["family"], "code": row["measure"], "name": row["name"],
                "value": round(float(row["value"]), 6),
                "ret_over_risk": None if pd.isna(ratio) else round(float(ratio), 4),
                "approx": BY_CODE[row["measure"]].approximate,
            }
        )
    return {
        "profile": profile, "currency": currency, "as_of": as_of(),
        "alpha": alpha, "regime_conditional": regime_conditional,
        "summary": _summary(returns, weights),
        "metrics": metrics,
    }


def get_contributions(profile: str, currency: str, measure: str) -> dict:
    """Contributo al rischio per strumento (Linea 4), per la vista drill-down."""
    returns = instrument_returns()
    weights = _instrument_weights(profile)
    rc = risk_contribution(returns, weights, measure)
    contributions = [
        {
            "name": inst.name,
            "weight": round(float(weights[inst.name]), 4),
            "risk_contribution": round(float(rc.get(inst.name, 0.0)), 6),
        }
        for inst in INSTRUMENTS if weights[inst.name] > 0
    ]
    return {
        "profile": profile, "currency": currency, "measure": measure,
        "contributions": contributions,
    }
