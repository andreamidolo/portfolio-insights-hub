"""Analisi di un mandato reale caricato dall'utente (docs/13 §2).

Espone capacità che il motore GIÀ ha (risk engine + ensemble) su *pesi forniti
dall'utente*: nessuna logica nuova, solo un involucro sopra ``aa_engine.risk`` e
``aa_engine.optimization`` con i rendimenti attivi (dati utente o backbone).

Tre usi:
    - ``analyze``      → radiografia del rischio del mandato COSÌ COM'È;
    - segnali          → riusa la tabella segnali sugli strumenti del mandato;
    - ``reoptimize``   → ATTUALE vs PROPOSTA (ensemble) + delta di rischio.

Onestà: strumenti del mandato senza prezzi storici sono ESCLUSI e dichiarati,
mai inventati; la copertura (frazione di peso analizzata) è sempre riportata.
"""

from __future__ import annotations

import pandas as pd

from aa_engine.data import Regime
from aa_engine.optimization import default_ensemble, lite_enabled
from aa_engine.profiles import constraints_for, load_profiles
from aa_engine.pipeline.run import (
    _proxy_regimes,
    _quiet,
    _risk_summary,
    build_signals_table,
    compute_signal_outputs,
)
from aa_engine.risk import BY_CODE, risk_contribution, risk_panel
from aa_engine.signals import summary_to_bl_views

from .store import STORE, UploadError, acmap_for


def _regime_labels(
    returns: pd.DataFrame, acmap: dict[str, str]
) -> tuple[dict[str, Regime], dict[str, str]]:
    regimes = _proxy_regimes(returns, acmap)
    labels = {ac: ("bull" if r == Regime.BULL else "bear") for ac, r in regimes.items()}
    return regimes, labels


def _split_available(holdings: list[dict]) -> tuple[pd.DataFrame, list[dict], list[str], str]:
    """Separa gli strumenti con prezzi (analizzabili) da quelli senza (dichiarati)."""
    returns_all, source = STORE.active_returns()
    available_cols = set(map(str, returns_all.columns))
    present = [h for h in holdings if str(h["ticker"]) in available_cols]
    missing = [str(h["ticker"]) for h in holdings if str(h["ticker"]) not in available_cols]
    if not present:
        raise UploadError(
            "Nessuno strumento del mandato ha prezzi storici nell'universo attivo. "
            "Carica prima i prezzi (Dati/Import)."
        )
    tickers = [str(h["ticker"]) for h in present]
    return returns_all[tickers], present, missing, source


def _normalized_weights(present: list[dict]) -> tuple[pd.Series, float]:
    """Pesi degli strumenti analizzabili, rinormalizzati a somma 1 (con copertura)."""
    raw = pd.Series({str(h["ticker"]): float(h["weight"]) for h in present})
    covered = float(raw.sum())
    if covered <= 0:
        w = pd.Series(1.0 / len(raw), index=raw.index)
    else:
        w = raw / covered
    return w, round(covered, 6)


def _panel_metrics(returns: pd.DataFrame, weights: pd.Series, alpha: float, mar: float) -> list[dict]:
    panel = risk_panel(returns, weights, alpha=alpha, mar=mar, regime_mask=None)
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
    return metrics


def _summary_block(risk: dict[str, float]) -> dict:
    """Adatta l'output di ``_risk_summary`` allo schema 'summary' del risk panel."""
    return {
        "cumulative_return": risk.get("cagr", 0.0),  # CAGR come proxy del summary
        "cagr": risk["cagr"],
        "sharpe": risk["sharpe"],
        "max_drawdown": risk["max_drawdown"],
        "volatility": risk["std_dev"],
    }


def analyze(holdings: list[dict], *, alpha: float = 0.05, mar: float = 0.0) -> dict:
    """Radiografia del rischio del mandato così com'è + segnali + regimi."""
    returns, present, missing, source = _split_available(holdings)
    acmap = acmap_for(returns.columns)
    weights, covered = _normalized_weights(present)

    risk = _risk_summary(returns, weights)
    regimes_obj, regime_labels = _regime_labels(returns, acmap)
    sig_outputs, summary = compute_signal_outputs(returns, acmap, regimes_obj)
    rc = risk_contribution(returns, weights, "MV")
    contributions = [
        {
            "name": t,
            "weight": round(float(weights[t]), 4),
            "risk_contribution": round(float(rc.get(t, 0.0)), 6),
        }
        for t in returns.columns
    ]

    return {
        "source": source,
        "as_of": returns.index[-1].date().isoformat(),
        "n_holdings": len(present),
        "covered_weight": covered,
        "missing_prices": missing,
        "summary": _summary_block(risk),
        "metrics": _panel_metrics(returns, weights, alpha, mar),
        "contributions": contributions,
        "regimes": regime_labels,
        "signals": build_signals_table(sig_outputs, summary, acmap),
    }


def reoptimize(
    holdings: list[dict],
    profile: str = "balanced",
    currency: str = "EUR",
    *,
    ensemble=None,
) -> dict:
    """ATTUALE vs PROPOSTA: l'ensemble sull'universo del mandato + delta di rischio."""
    if profile not in load_profiles().profile_ids:
        raise UploadError(f"Profilo sconosciuto: {profile!r}")
    returns, present, missing, source = _split_available(holdings)
    acmap = acmap_for(returns.columns)
    current_w, covered = _normalized_weights(present)

    # PROPOSTA: stesso ensemble del flusso principale, con le views dai segnali
    regimes_obj, regime_labels = _regime_labels(returns, acmap)
    _, summary = compute_signal_outputs(returns, acmap, regimes_obj)
    views = summary_to_bl_views(summary)
    ens = ensemble or default_ensemble(n_best=4)
    constraints = constraints_for(profile, acmap)
    with _quiet():
        result = ens.run(returns, views=views, constraints=constraints)
    proposed_w = result.final_weights.reindex(returns.columns).fillna(0.0)

    rows = [
        {
            "ticker": t,
            "asset_class": acmap[t],
            "current": round(float(current_w.get(t, 0.0)), 4),
            "proposed": round(float(proposed_w.get(t, 0.0)), 4),
            "delta": round(float(proposed_w.get(t, 0.0) - current_w.get(t, 0.0)), 4),
        }
        for t in returns.columns
    ]
    rows.sort(key=lambda r: abs(r["delta"]), reverse=True)

    risk_current = _risk_summary(returns, current_w)
    risk_proposed = _risk_summary(returns, proposed_w)
    risk_delta = {
        k: round(risk_proposed[k] - risk_current[k], 6)
        for k in ("std_dev", "var_95", "cvar_95", "max_drawdown", "calmar", "sharpe")
    }

    return {
        "source": source,
        "profile": profile,
        "currency": currency,
        "lite": lite_enabled() and ensemble is None,
        "as_of": returns.index[-1].date().isoformat(),
        "covered_weight": covered,
        "missing_prices": missing,
        "n_models_active": result.n_active,
        "selected_models": list(result.selected),
        "scorer": result.scorer,
        "regimes": regime_labels,
        "comparison": rows,
        "risk_current": risk_current,
        "risk_proposed": risk_proposed,
        "risk_delta": risk_delta,
    }
