"""Risk engine — calcolo delle metriche di rischio (Stadio 4, Linee 2 e 4).

Implementazione del contratto definito in ``docs/02_risk_engine_spec.md``.

Principi (non negoziabili, cfr. spec §0):
    1. **Regime-dependent**: ogni funzione accetta ``regime_mask`` (serie
       booleana). Quando presente, i rendimenti sono filtrati PRIMA del calcolo.
    2. **Riskfolio-Lib first**: se Riskfolio-Lib è installato lo usiamo per
       cross-check; in questo ambiente non lo è, quindi ogni metrica è
       implementata a mano con formula esplicita (vedi sotto).
    3. **No black box**: ogni metrica ha una docstring/commento con la formula.
    4. **Annualizzazione esplicita**: il fattore è un parametro
       (``periods_per_year``) e la *convenzione* per ogni metrica è codificata in
       ``_ANN_EXPONENT`` (0 = nessuna, 0.5 = ×√P come le dispersioni, 1 = ×P come
       i rendimenti medi).

Convenzione di segno: le misure di rischio sono restituite come **valori
positivi** (una perdita/dispersione maggiore = numero più grande), coerente con
la tabella "Analysis of Coherence" di AlgoEagle. Fa eccezione SKEW (segno
informativo) per cui si restituisce il valore con segno.
"""

from __future__ import annotations

import numpy as np
import pandas as pd
from scipy import stats
from scipy.optimize import minimize_scalar
from scipy.special import logsumexp

from .definitions import ALL_MEASURES, BY_CODE, RiskMeasure

# Riskfolio-Lib è una dipendenza opzionale: import "morbido" così il package si
# importa anche dove non è installato (es. CI leggera). Quando presente, può
# essere usato per validazione incrociata.
try:  # pragma: no cover
    import riskfolio as rf  # noqa: F401

    _HAS_RISKFOLIO = True
except Exception:  # pragma: no cover
    _HAS_RISKFOLIO = False


# --------------------------------------------------------------------------- #
# Convenzioni di annualizzazione (esponente del fattore periods_per_year)
#   0   -> non annualizzata (drawdown, momenti adimensionali)
#   0.5 -> scala come una dispersione  (× √P)         es. StdDev, VaR, CVaR
#   1   -> scala come un rendimento medio (× P)
# Vedi note AlgoEagle: ×252 per i return, ×√252 per le dispersioni; i drawdown
# (path-dependent) e i momenti standardizzati restano grezzi.
# --------------------------------------------------------------------------- #
_ANN_EXPONENT: dict[str, float] = {
    # return-based (dispersioni one-/two-sided)
    "MV": 0.5, "MAD": 0.5, "MSV": 0.5, "FLPM": 0.5, "SLPM": 0.5,
    "GMD": 0.5, "TG": 0.5,
    "KT": 0.0, "SKEW": 0.0,                      # momenti standardizzati
    # tail (quantili di perdita: scalano come dispersioni)
    "VaR": 0.5, "CVaR": 0.5, "EVaR": 0.5, "RLVaR": 0.5, "WR": 0.5,
    # drawdown-based (path-dependent: non annualizzate)
    "UCI": 0.0, "ADD": 0.0, "DaR": 0.0, "CDaR": 0.0, "EDaR": 0.0,
    "RLDaR": 0.0, "MDD": 0.0,
}


# --------------------------------------------------------------------------- #
# Helper
# --------------------------------------------------------------------------- #
def _portfolio_returns(returns: pd.DataFrame, weights: pd.Series) -> pd.Series:
    """Rendimenti di portafoglio dati i rendimenti dei singoli strumenti e i pesi.

    Allinea per ticker, gestisce pesi mancanti come 0. ``r_p = Σ_i w_i r_i``.
    """
    w = weights.reindex(returns.columns).fillna(0.0)
    if not np.isclose(w.sum(), 1.0, atol=1e-6):
        # non blocchiamo: il chiamante può volere pesi che non sommano a 1
        pass
    return returns.mul(w, axis=1).sum(axis=1)


def _apply_regime_mask(
    returns: pd.DataFrame, regime_mask: pd.Series | None
) -> pd.DataFrame:
    """Filtra i rendimenti tenendo solo i giorni del regime corrente."""
    if regime_mask is None:
        return returns
    mask = regime_mask.reindex(returns.index).fillna(False).astype(bool)
    return returns.loc[mask]


def _drawdown_series(r_p: pd.Series) -> np.ndarray:
    """Serie dei drawdown (positivi) su equity composta: ``dd_t = (peak_t - nav_t)/peak_t``.

    nav è l'equity composta ``∏(1+r)``; il drawdown è ≥ 0 (0 = nuovo massimo).
    """
    nav = (1.0 + r_p.to_numpy()).cumprod()
    peak = np.maximum.accumulate(nav)
    return (peak - nav) / peak


def _gmd(x: np.ndarray) -> float:
    """Gini Mean Difference: media di |x_i - x_j| su tutte le coppie.

    Formula O(n log n) su dati ordinati crescenti:
        GMD = (2 / n²) · Σ_{i=1..n} (2i - n - 1) · x_(i)
    """
    x = np.sort(np.asarray(x, dtype=float))
    n = x.size
    if n < 2:
        return 0.0
    i = np.arange(1, n + 1)
    return float((2.0 / (n * n)) * np.sum((2 * i - n - 1) * x))


def _evar(losses: np.ndarray, alpha: float) -> float:
    """Entropic Value at Risk delle perdite (positivo).

    Rappresentazione duale (Ahmadi-Javid 2012):
        EVaR_α(L) = inf_{z>0} z · ( ln E[e^{L/z}] − ln α )
    Minimizzazione 1-D stabile via log-sum-exp:
        ln E[e^{L/z}] = logsumexp(L/z) − ln N
    """
    x = np.asarray(losses, dtype=float)
    n = x.size
    if n == 0:
        return float("nan")
    log_alpha = np.log(alpha)

    def obj(log_z: float) -> float:
        z = np.exp(log_z)
        return z * (logsumexp(x / z) - np.log(n) - log_alpha)

    scale = float(np.std(x) + np.abs(np.mean(x)) + 1e-9)
    lo, hi = np.log(scale) - 12.0, np.log(scale) + 12.0
    res = minimize_scalar(obj, bounds=(lo, hi), method="bounded")
    return float(res.fun)


def _relativistic_bridge(entropic: float, worst: float, kappa: float) -> float:
    """RLVaR/RLDaR — APPROSSIMAZIONE: bridge lineare, non power-cone.

    La misura relativistica (Cajas 2023) richiede coni di potenza
    (cvxpy / Riskfolio-Lib) e degenera all'EVaR per κ→0⁺ e alla Worst
    Realization per κ→1⁻, restando monotòna in mezzo. In assenza del solver
    usiamo il bridge lineare ``EVaR + κ·(WR − EVaR)`` che preserva
    ``EVaR ≤ RLVaR ≤ WR`` e la monotonìa in κ.

    TODO[risk]: sostituire con il calcolo esatto via Riskfolio-Lib quando
    disponibile (``rm='RLVaR'`` / ``rm='RLDaR'``).
    """
    kappa = float(np.clip(kappa, 0.0, 1.0))
    return float(entropic + kappa * (worst - entropic))


# --------------------------------------------------------------------------- #
# Cuore: valore (giornaliero, non annualizzato) di una singola metrica
# --------------------------------------------------------------------------- #
def _measure_value(
    r_p: pd.Series, code: str, alpha: float, mar: float, kappa: float
) -> float:
    """Valore grezzo (per-periodo) della metrica ``code`` sui rendimenti ``r_p``.

    Formule (cfr. spec §2.2 e §2.3). Tutte restituiscono un float positivo
    (eccetto SKEW, con segno).
    """
    x = r_p.to_numpy(dtype=float)
    n = x.size
    mu = float(x.mean()) if n else float("nan")

    # ---- Return-based ----------------------------------------------------- #
    if code == "MV":                       # Standard Deviation campionaria
        return float(r_p.std(ddof=1))
    if code == "MAD":                      # Mean Absolute Deviation
        return float(np.mean(np.abs(x - mu)))
    if code == "MSV":                      # Semi Standard Deviation (downside)
        dn = np.minimum(x - mu, 0.0)
        return float(np.sqrt(np.mean(dn**2)))
    if code == "FLPM":                     # First Lower Partial Moment (Omega)
        return float(np.mean(np.maximum(mar - x, 0.0)))
    if code == "SLPM":                     # Second Lower Partial Moment (Sortino)
        return float(np.sqrt(np.mean(np.maximum(mar - x, 0.0) ** 2)))
    if code == "GMD":                      # Gini Mean Difference
        return _gmd(x)
    if code == "TG":                       # Tail Gini of Losses (dispersione di coda)
        # APPROSSIMAZIONE: tail-GMD (GMD sulle k perdite peggiori della coda α),
        # non la Tail-Gini esatta di Riskfolio. Non inseguire il match coi target.
        k = max(2, int(np.ceil(alpha * n)))
        worst = np.sort(x)[:k]             # k rendimenti più negativi
        return _gmd(-worst)                # perdite positive
    if code == "KT":                       # Kurtosis (Pearson, normale = 3)
        return float(stats.kurtosis(x, fisher=False, bias=False))
    if code == "SKEW":                     # Skewness (con segno)
        return float(stats.skew(x, bias=False))

    # ---- Tail ------------------------------------------------------------- #
    if code == "VaR":                      # VaR storico: -quantile(α)
        return float(-np.quantile(x, alpha))
    if code == "CVaR":                     # Expected Shortfall medio nella coda α
        q = np.quantile(x, alpha)
        tail = x[x <= q]
        return float(-tail.mean()) if tail.size else float(-q)
    if code == "EVaR":                     # Entropic VaR delle perdite
        return _evar(-x, alpha)
    if code == "WR":                       # Worst Realization (perdita massima)
        return float(-x.min())
    if code == "RLVaR":                    # Relativistic VaR (bridge, vedi nota)
        return _relativistic_bridge(_evar(-x, alpha), float(-x.min()), kappa)

    # ---- Drawdown-based --------------------------------------------------- #
    dd = _drawdown_series(r_p)             # drawdown positivi su equity composta
    if code == "MDD":                      # Max Drawdown
        return float(dd.max())
    if code == "ADD":                      # Average Drawdown
        return float(dd.mean())
    if code == "UCI":                      # Ulcer Index = RMS dei drawdown
        return float(np.sqrt(np.mean(dd**2)))
    if code == "DaR":                      # Drawdown at Risk: quantile (1-α) dei dd
        return float(np.quantile(dd, 1.0 - alpha))
    if code == "CDaR":                     # Conditional DaR: media dei dd oltre DaR
        thr = np.quantile(dd, 1.0 - alpha)
        tail = dd[dd >= thr]
        return float(tail.mean()) if tail.size else float(thr)
    if code == "EDaR":                     # Entropic Drawdown at Risk
        return _evar(dd, alpha)
    if code == "RLDaR":                    # Relativistic DaR (bridge)
        return _relativistic_bridge(_evar(dd, alpha), float(dd.max()), kappa)

    raise KeyError(f"Metrica sconosciuta: {code!r}. Codici noti: {sorted(BY_CODE)}")


# --------------------------------------------------------------------------- #
# Metriche aggregate (Stadio 4 — Linea 2: Aggregate Risk)
# --------------------------------------------------------------------------- #
def compute_measure(
    returns: pd.DataFrame,
    weights: pd.Series,
    measure: str,
    *,
    alpha: float = 0.05,
    mar: float = 0.0,
    kappa: float = 0.3,
    regime_mask: pd.Series | None = None,
    periods_per_year: int = 252,
    annualize: bool = True,
) -> float:
    """Calcola UNA misura di rischio aggregata per il portafoglio.

    Parametri
    ---------
    returns : pd.DataFrame          rendimenti giornalieri (date × ticker)
    weights : pd.Series             pesi (index = ticker)
    measure : str                   codice metrica (vedi ``definitions.BY_CODE``)
    alpha : float                   livello per VaR/CVaR/EVaR/DaR… (default 5%)
    mar : float                     Minimum Acceptable Return per FLPM/SLPM
    kappa : float                   deformazione per RLVaR/RLDaR (default 0.3)
    regime_mask : pd.Series | None  maschera booleana del regime corrente
    periods_per_year : int          fattore di annualizzazione (252 = giornaliero)
    annualize : bool                se False ritorna il valore per-periodo grezzo

    Ritorna
    -------
    float : valore della metrica (annualizzato secondo ``_ANN_EXPONENT``).
    """
    if measure not in BY_CODE:
        raise KeyError(f"Metrica '{measure}' non in tassonomia: {sorted(BY_CODE)}")
    r = _apply_regime_mask(returns, regime_mask)
    r_p = _portfolio_returns(r, weights)
    value = _measure_value(r_p, measure, alpha=alpha, mar=mar, kappa=kappa)
    if annualize:
        value *= periods_per_year ** _ANN_EXPONENT[measure]
    return float(value)


def risk_panel(
    returns: pd.DataFrame,
    weights: pd.Series,
    *,
    alpha: float = 0.05,
    mar: float = 0.0,
    kappa: float = 0.3,
    regime_mask: pd.Series | None = None,
    periods_per_year: int = 252,
    measures: tuple[RiskMeasure, ...] = ALL_MEASURES,
) -> pd.DataFrame:
    """Pannello completo Return / Risk per tutte le metriche.

    Replica la tabella "Analysis of Coherence": per ogni metrica il valore e il
    ratio ``(Return − MAR) / Risk`` (Return = rendimento medio annualizzato).

    Ritorna
    -------
    pd.DataFrame con colonne
        ``[family, measure, name, value, ret_minus_mar_over_risk]``
    ordinato per famiglia (return_based → tail → drawdown_based).
    """
    r = _apply_regime_mask(returns, regime_mask)
    r_p = _portfolio_returns(r, weights)
    ann_return = float(r_p.mean()) * periods_per_year

    rows = []
    for m in measures:
        value = compute_measure(
            returns, weights, m.code,
            alpha=alpha, mar=mar, kappa=kappa, regime_mask=regime_mask,
            periods_per_year=periods_per_year,
        )
        # Il ratio ha senso per le misure di rischio (>0). Per i momenti
        # standardizzati (SKEW/KT) il rapporto non è interpretabile: NaN.
        if m.code in ("SKEW", "KT") or value == 0 or not np.isfinite(value):
            ratio = float("nan")
        else:
            ratio = (ann_return - mar) / value
        rows.append(
            {
                "family": m.family.value,
                "measure": m.code,
                "name": m.name,
                "value": value,
                "ret_minus_mar_over_risk": ratio,
            }
        )

    order = {"return_based": 0, "tail": 1, "drawdown_based": 2}
    panel = pd.DataFrame(rows)
    panel = panel.sort_values(
        by="family", key=lambda s: s.map(order), kind="stable"
    ).reset_index(drop=True)
    return panel


# --------------------------------------------------------------------------- #
# Metriche individuali (Stadio 4 — Linea 4: Individual Security Risk)
# --------------------------------------------------------------------------- #
def marginal_risk(
    returns: pd.DataFrame,
    weights: pd.Series,
    measure: str = "MV",
    *,
    alpha: float = 0.05,
    mar: float = 0.0,
    kappa: float = 0.3,
    regime_mask: pd.Series | None = None,
    periods_per_year: int = 252,
    h: float = 1e-6,
) -> pd.Series:
    """Rischio marginale: derivata della metrica rispetto al peso di ogni strumento.

    - **MV** (StdDev): forma chiusa ``MR = Σw / sqrt(wᵀ Σ w)`` (Σ = covarianza),
      annualizzata ×√P.
    - **Altre metriche**: differenziazione numerica in avanti
      ``MR_i ≈ [f(w + h·e_i) − f(w)] / h``.

    Ritorna ``pd.Series`` indicizzata per ticker (stesso ordine di ``weights``).
    """
    r = _apply_regime_mask(returns, regime_mask)
    tickers = list(weights.index)
    w = weights.reindex(returns.columns).fillna(0.0)

    if measure == "MV":
        cov = r[returns.columns].cov()             # covarianza campionaria (ddof=1)
        sigma_p = float(np.sqrt(w.values @ cov.values @ w.values))
        if sigma_p == 0:
            mr = pd.Series(0.0, index=returns.columns)
        else:
            mr = pd.Series((cov.values @ w.values) / sigma_p, index=returns.columns)
        mr = mr * (periods_per_year ** 0.5)
        return mr.reindex(tickers)

    # Differenziazione numerica per le misure senza forma chiusa.
    base = compute_measure(
        returns, weights, measure, alpha=alpha, mar=mar, kappa=kappa,
        regime_mask=regime_mask, periods_per_year=periods_per_year,
    )
    out = {}
    for t in tickers:
        w_bumped = weights.copy()
        w_bumped[t] = w_bumped.get(t, 0.0) + h
        bumped = compute_measure(
            returns, w_bumped, measure, alpha=alpha, mar=mar, kappa=kappa,
            regime_mask=regime_mask, periods_per_year=periods_per_year,
        )
        out[t] = (bumped - base) / h
    return pd.Series(out).reindex(tickers)


def risk_contribution(
    returns: pd.DataFrame,
    weights: pd.Series,
    measure: str = "MV",
    *,
    alpha: float = 0.05,
    mar: float = 0.0,
    kappa: float = 0.3,
    regime_mask: pd.Series | None = None,
    periods_per_year: int = 252,
) -> pd.Series:
    """Contributo al rischio: ``RC_i = w_i · MR_i``.

    Per misure omogenee di grado 1 (es. StdDev) vale la proprietà di Euler
    ``Σ_i RC_i = metrica_totale`` (testata).

    Ritorna ``pd.Series`` indicizzata per ticker.
    """
    mr = marginal_risk(
        returns, weights, measure, alpha=alpha, mar=mar, kappa=kappa,
        regime_mask=regime_mask, periods_per_year=periods_per_year,
    )
    w = weights.reindex(mr.index).fillna(0.0)
    return w * mr


def leave_one_out(
    returns: pd.DataFrame,
    weights: pd.Series,
    measure: str = "CVaR",
    *,
    alpha: float = 0.05,
    mar: float = 0.0,
    kappa: float = 0.3,
    reinvest: bool = False,
    regime_mask: pd.Series | None = None,
    periods_per_year: int = 252,
) -> pd.Series:
    """Impatto dell'esclusione di ciascuno strumento sulla metrica di portafoglio.

    Per ogni ticker: si azzera il suo peso (se ``reinvest=True`` si redistribuisce
    pro-rata sugli altri) e si ricalcola la metrica. L'output è il **delta**
    rispetto al portafoglio pieno (``metrica_esclusa − metrica_piena``): negativo
    = lo strumento *aggiungeva* rischio.

    Ritorna ``pd.Series`` indicizzata per ticker. Compatibile con ``regime_mask``
    per il calcolo Bull/Bear.
    """
    full = compute_measure(
        returns, weights, measure, alpha=alpha, mar=mar, kappa=kappa,
        regime_mask=regime_mask, periods_per_year=periods_per_year,
    )
    out = {}
    for t in weights.index:
        w = weights.copy()
        removed = w[t]
        w[t] = 0.0
        if reinvest and removed != 0:
            others = w.index != t
            denom = w[others].sum()
            if denom != 0:
                w[others] = w[others] * (1.0 + removed / denom)
        excl = compute_measure(
            returns, w, measure, alpha=alpha, mar=mar, kappa=kappa,
            regime_mask=regime_mask, periods_per_year=periods_per_year,
        )
        out[t] = excl - full
    return pd.Series(out).reindex(weights.index)


def worst_realizations(
    returns: pd.DataFrame,
    weights: pd.Series,
    n: int = 15,
    *,
    regime_mask: pd.Series | None = None,
) -> pd.DataFrame:
    """Le ``n`` peggiori giornate del portafoglio, scomposte per strumento.

    Per ciascuna delle n giornate peggiori riporta il rendimento totale di
    portafoglio (``Tot``) e il contributo di ogni strumento ``w_i · r_{i,t}``.

    Ritorna ``pd.DataFrame`` con ``index = date`` e colonne ``[Tot, *ticker]``,
    ordinato dalla giornata peggiore alla meno peggiore.
    """
    r = _apply_regime_mask(returns, regime_mask)
    w = weights.reindex(r.columns).fillna(0.0)
    contrib = r.mul(w, axis=1)                 # contributo per strumento per giorno
    total = contrib.sum(axis=1)
    worst_idx = total.nsmallest(n).index
    out = contrib.loc[worst_idx].copy()
    out.insert(0, "Tot", total.loc[worst_idx])
    return out
