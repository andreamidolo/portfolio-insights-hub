"""Stato dei dati caricati dall'utente + parsing/validazione dei CSV.

"Prima la macchina, poi la benzina": gli endpoint di upload portano i *dati veri*
dell'utente nel motore senza cambiare la forma delle risposte. Lo store è
**in memoria** (singolo processo, si azzera al riavvio): sufficiente per uno
strumento interno; domani un vero ``PriceProvider`` lo sostituisce.

Due caricamenti distinti (vedi docs/13):
    - prezzi storici  → il "carburante" per i calcoli;
    - mandato (pesi)  → l'oggetto da analizzare.
Il parsing è tollerante (separatori, colonne in ordine vario) ma ONESTO: i
problemi diventano *warning* espliciti, mai numeri inventati.
"""

from __future__ import annotations

import io
from dataclasses import dataclass, field

import numpy as np
import pandas as pd

from aa_engine.optimization.sample import ASSET_CLASS_MAP

MIN_OBS = 60  # sotto questa soglia la serie è "corta": warning (non blocca)


# --------------------------------------------------------------------------- #
# Eccezione di validazione (→ HTTP 400 con messaggio leggibile)
# --------------------------------------------------------------------------- #
class UploadError(ValueError):
    """CSV non interpretabile: messaggio pensato per l'utente finale."""


# --------------------------------------------------------------------------- #
# Stato in memoria
# --------------------------------------------------------------------------- #
@dataclass
class MarketData:
    returns: pd.DataFrame                 # date × ticker (rendimenti giornalieri)
    source: str                           # "user" | "sample"
    filename: str | None = None


@dataclass
class _Store:
    market: MarketData | None = None

    def set_market(self, returns: pd.DataFrame, filename: str | None) -> None:
        self.market = MarketData(returns=returns, source="user", filename=filename)

    def clear(self) -> None:
        self.market = None

    def has_user_data(self) -> bool:
        return self.market is not None

    def active_returns(self) -> tuple[pd.DataFrame, str]:
        """Rendimenti attivi: **priorità** dati utente → base Bloomberg → backbone campione.

        La base Bloomberg (``data/market/``) è il default di produzione; ricade sul
        backbone sintetico se assente (CI/clone) o disattivata (``AA_DISABLE_MARKET_BASE``).
        """
        if self.market is not None:
            return self.market.returns, "user"

        from aa_engine.data import market_data

        base = market_data.load_base_returns()
        if base is not None:
            returns, _acmap, _src = base
            return returns, "bloomberg"

        from aa_engine.optimization.sample import sample_returns

        return sample_returns(), "sample"


STORE = _Store()


def acmap_for(tickers, default: str = "Unknown") -> dict[str, str]:
    """Asset class per ticker: mappa Bloomberg (manifest) ∪ backbone campione.

    Risolve i ticker dell'universo Bloomberg via ``config/market_universe.csv`` e
    quelli del backbone sintetico via ``ASSET_CLASS_MAP``; fallback ``default``.
    """
    from aa_engine.data import market_data

    bbg = market_data.asset_class_map()
    return {t: (bbg.get(t) or ASSET_CLASS_MAP.get(t, default)) for t in tickers}


# --------------------------------------------------------------------------- #
# Parsing CSV — prezzi di mercato
# --------------------------------------------------------------------------- #
def _read_csv(text: str) -> pd.DataFrame:
    if not text or not text.strip():
        raise UploadError("Il file è vuoto.")
    try:
        # sep=None + engine='python' → autodetect di ',' / ';' / tab
        df = pd.read_csv(io.StringIO(text), sep=None, engine="python")
    except Exception as exc:  # pragma: no cover - messaggio generico
        raise UploadError(f"CSV non leggibile: {exc}") from exc
    if df.shape[1] < 2:
        raise UploadError("Servono almeno due colonne (data + uno strumento).")
    return df


def parse_prices(text: str) -> tuple[pd.DataFrame, dict]:
    """CSV prezzi (prima colonna = data, le altre = strumenti) → (returns, summary).

    Ritorna i rendimenti giornalieri e un riepilogo con warning. Non solleva su
    serie corte o buchi: li segnala.
    """
    df = _read_csv(text)
    date_col = df.columns[0]
    try:
        idx = pd.to_datetime(df[date_col], errors="raise")
    except Exception as exc:
        raise UploadError(
            f"La prima colonna ('{date_col}') deve contenere le date (YYYY-MM-DD)."
        ) from exc

    prices = df.drop(columns=[date_col])
    prices = prices.apply(pd.to_numeric, errors="coerce")
    prices.index = pd.DatetimeIndex(idx)
    prices = prices[~prices.index.duplicated(keep="last")].sort_index()

    warnings: list[str] = []
    non_numeric = [c for c in prices.columns if prices[c].notna().sum() == 0]
    if non_numeric:
        prices = prices.drop(columns=non_numeric)
        warnings.append(f"Colonne ignorate (non numeriche): {', '.join(map(str, non_numeric))}.")
    if prices.shape[1] == 0:
        raise UploadError("Nessuna colonna di prezzi numerici valida.")

    # rendimenti: pct_change, forward-fill dei buchi interni (segnalati)
    gappy = [c for c in prices.columns if prices[c].isna().any()]
    if gappy:
        warnings.append(
            f"Buchi nelle serie riempiti per forward-fill: {', '.join(map(str, gappy))}."
        )
    filled = prices.ffill()
    returns = filled.pct_change().replace([np.inf, -np.inf], np.nan).dropna(how="all")
    returns = returns.dropna(axis=1, how="all")

    short = [c for c in returns.columns if returns[c].notna().sum() < MIN_OBS]
    if short:
        warnings.append(
            f"Serie corte (< {MIN_OBS} osservazioni), risultati meno affidabili: "
            f"{', '.join(map(str, short))}."
        )
    if returns.shape[0] < 2:
        raise UploadError("Servono almeno due date per calcolare i rendimenti.")

    returns = returns.fillna(0.0)
    summary = _market_summary(returns, warnings)
    return returns, summary


def _market_summary(returns: pd.DataFrame, warnings: list[str]) -> dict:
    acmap = acmap_for(returns.columns)
    instruments = [
        {
            "ticker": str(t),
            "asset_class": acmap[t],
            "n_observations": int(returns[t].astype(bool).count()),
            "known": acmap[t] != "Unknown",
        }
        for t in returns.columns
    ]
    return {
        "n_instruments": int(returns.shape[1]),
        "n_observations": int(returns.shape[0]),
        "date_start": returns.index[0].date().isoformat(),
        "date_end": returns.index[-1].date().isoformat(),
        "instruments": instruments,
        "warnings": warnings,
    }


def universe_summary() -> dict:
    """Vista dell'universo attivo (utente o campione)."""
    returns, source = STORE.active_returns()
    out = _market_summary(returns, [])
    out["source"] = source
    out["filename"] = STORE.market.filename if STORE.market else None
    return out


# --------------------------------------------------------------------------- #
# Parsing CSV — composizione mandato
# --------------------------------------------------------------------------- #
@dataclass
class Mandate:
    holdings: list[dict] = field(default_factory=list)  # {ticker, isin, weight, asset_class}
    warnings: list[str] = field(default_factory=list)
    weight_sum: float = 0.0
    missing_prices: list[str] = field(default_factory=list)


def _find_col(cols: list[str], *candidates: str) -> str | None:
    low = {str(c).strip().lower(): c for c in cols}
    for cand in candidates:
        if cand in low:
            return low[cand]
    return None


def parse_mandate(text: str) -> Mandate:
    """CSV mandato (ticker/isin + peso) → mandato strutturato + warning.

    Valida la somma dei pesi (~1.0) e segnala gli strumenti privi di prezzi
    nell'universo attivo. Non normalizza in silenzio: avvisa.
    """
    df = _read_csv(text)
    cols = list(df.columns)
    w_col = _find_col(cols, "peso", "weight", "pesi", "w")
    t_col = _find_col(cols, "ticker", "symbol", "strumento")
    i_col = _find_col(cols, "isin")
    if w_col is None:
        raise UploadError("Manca la colonna dei pesi ('peso' o 'weight').")
    if t_col is None and i_col is None:
        raise UploadError("Manca la colonna identificativa ('ticker' o 'isin').")
    id_col = t_col or i_col

    weights = pd.to_numeric(df[w_col], errors="coerce")
    if weights.isna().all():
        raise UploadError("La colonna dei pesi non contiene numeri validi.")

    # pesi espressi in % (somma ~100) → riportati a frazione, con nota
    warnings: list[str] = []
    raw_sum = float(weights.sum(skipna=True))
    if 90.0 <= raw_sum <= 110.0:
        weights = weights / 100.0
        warnings.append("Pesi interpretati come percentuali (somma ~100) e riportati a frazione.")

    active_returns, _ = STORE.active_returns()
    available = set(map(str, active_returns.columns))

    holdings: list[dict] = []
    missing: list[str] = []
    for _, row in df.iterrows():
        ident = str(row[id_col]).strip()
        if not ident or ident.lower() == "nan":
            continue
        w = weights.loc[row.name]
        w = float(w) if pd.notna(w) else 0.0
        isin = str(row[i_col]).strip() if i_col else ""
        ac = ASSET_CLASS_MAP.get(ident, "Unknown")
        holdings.append({"ticker": ident, "isin": isin, "weight": round(w, 6), "asset_class": ac})
        if ident not in available:
            missing.append(ident)

    if not holdings:
        raise UploadError("Nessuna riga valida nel mandato.")

    wsum = round(float(sum(h["weight"] for h in holdings)), 6)
    if abs(wsum - 1.0) > 0.02:
        warnings.append(
            f"I pesi sommano a {wsum * 100:.1f}% (atteso ~100%): verifica la composizione."
        )
    if missing:
        warnings.append(
            "Mancano i prezzi storici per: "
            + ", ".join(missing)
            + ". Carica i prezzi di questi strumenti per analizzarli."
        )
    return Mandate(
        holdings=holdings, warnings=warnings, weight_sum=wsum, missing_prices=missing
    )
