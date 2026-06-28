"""Fase 4 — il flusso unico end-to-end ("il bottone").

``run_allocation`` è l'UNICO punto di verità: regime → segnali → selezione →
ottimizzazione → rischio. CLI e API sono due involucri sottili attorno ad esso
(nessuna logica duplicata). È pura "colla" sui moduli esistenti; nessuna nuova
logica di sostanza. Backbone campione, niente dati live, SVM disattivato.

Spec: docs/11_phase4_integration_spec.md.
"""

from __future__ import annotations

import contextlib
import io
from dataclasses import dataclass, field

import pandas as pd

from aa_engine.backtest.performance import performance_summary
from aa_engine.data import Regime
from aa_engine.optimization import OptimizationEnsemble, default_ensemble
from aa_engine.optimization.base import PortfolioConstraints
from aa_engine.optimization.sample import ASSET_CLASS_MAP, sample_returns
from aa_engine.risk import compute_measure
from aa_engine.signals import (
    AlphaCrashSignal,
    OscillatorSignal,
    StaticRegimeProvider,
    TrendSignal,
    select_securities,
    summary_signal,
    summary_to_bl_views,
)

# Segnali tecnici usati nel SUMMARY (SVM escluso: disattivato finché non vince).
_SIGNALS = {"trend": TrendSignal, "oscillator": OscillatorSignal, "alpha_crash": AlphaCrashSignal}


@dataclass
class AllocationResult:
    """Tutto ciò che serve a report e API — l'output del flusso unico."""

    profile: str
    currency: str
    as_of: str
    n_models_active: int
    regimes: dict[str, str]                       # asset class → "bull"/"bear"
    signals: list[dict]                           # per ticker: dir/prob dei segnali + SUMMARY
    selected: list[str]
    discarded: list[str]
    selected_models: list[str]                    # i 4 scelti dall'ensemble
    final_weights: dict[str, float]
    asset_class_weights: dict[str, float]
    risk: dict[str, float]                        # StdDev, VaR, CVaR, MaxDD, Calmar…
    excluded_models: dict[str, str] = field(default_factory=dict)

    def to_payload(self) -> dict:
        """Dict JSON-serializzabile (per l'API e il salvataggio)."""
        return {
            "profile": self.profile, "currency": self.currency, "as_of": self.as_of,
            "n_models_active": self.n_models_active,
            "regimes": self.regimes, "signals": self.signals,
            "selected": self.selected, "discarded": self.discarded,
            "selected_models": self.selected_models,
            "final_weights": self.final_weights,
            "asset_class_weights": self.asset_class_weights,
            "risk": self.risk, "excluded_models": self.excluded_models,
        }


@contextlib.contextmanager
def _quiet():
    buf = io.StringIO()
    with contextlib.redirect_stdout(buf), contextlib.redirect_stderr(buf):
        yield


def _proxy_regimes(returns: pd.DataFrame, acmap: dict[str, str], window: int = 100) -> dict[str, Regime]:
    """Regime corrente per asset class (proxy: prezzo aggregato vs media mobile).

    È la stessa idea del ``ProxyRegimeProvider`` (trend-following), applicata
    all'indice equal-weight degli strumenti di ciascuna classe.
    """
    out: dict[str, Regime] = {}
    classes = sorted(set(acmap.get(t, "Other") for t in returns.columns))
    for ac in classes:
        members = [t for t in returns.columns if acmap.get(t) == ac]
        idx = (1.0 + returns[members].mean(axis=1)).cumprod()
        ma = idx.rolling(window, min_periods=window // 2).mean()
        out[ac] = Regime.BULL if float(idx.iloc[-1]) >= float(ma.iloc[-1]) else Regime.BEAR
    return out


def _risk_by_security(returns: pd.DataFrame) -> pd.Series:
    one = pd.Series([1.0], index=["x"])
    return pd.Series(
        {t: compute_measure(returns[[t]].rename(columns={t: "x"}), one, "MV") for t in returns.columns}
    )


def _risk_summary(returns: pd.DataFrame, weights: pd.Series) -> dict[str, float]:
    r_p = returns.mul(weights.reindex(returns.columns).fillna(0.0), axis=1).sum(axis=1)
    perf = performance_summary(r_p)
    return {
        "std_dev": round(compute_measure(returns, weights, "MV"), 6),
        "var_95": round(compute_measure(returns, weights, "VaR"), 6),
        "cvar_95": round(compute_measure(returns, weights, "CVaR"), 6),
        "max_drawdown": round(compute_measure(returns, weights, "MDD"), 6),
        "calmar": round(perf.calmar, 4),
        "sharpe": round(perf.sharpe, 4),
        "cagr": round(perf.cagr, 6),
    }


def run_allocation(
    profile: str = "balanced",
    currency: str = "EUR",
    as_of: str | None = None,
    *,
    universe: list[str] | None = None,
    ensemble: OptimizationEnsemble | None = None,
) -> AllocationResult:
    """Esegue l'intera pipeline end-to-end e ritorna un ``AllocationResult``.

    Questo è IL flusso: CLI e API lo chiamano entrambi. ``ensemble`` può essere
    iniettato (test/tuning); default = i ~38 modelli.
    """
    if profile not in ("moderate", "balanced", "aggressive"):
        raise ValueError(f"Profilo sconosciuto: {profile!r}")

    returns_all = sample_returns()
    if as_of is not None:
        returns_all = returns_all.loc[: pd.Timestamp(as_of)]
    as_of_str = returns_all.index[-1].date().isoformat()
    universe = universe or list(returns_all.columns)
    returns_all = returns_all[universe]
    prices = 100.0 * (1.0 + returns_all).cumprod()
    acmap = {t: ASSET_CLASS_MAP.get(t, "Other") for t in universe}

    # 1. REGIME (proxy) per asset class
    regimes = _proxy_regimes(returns_all, acmap)
    regime_provider = StaticRegimeProvider(regimes, default=Regime.BULL)

    # 2. SEGNALI tecnici → SUMMARY (modulato dal regime) → views BL
    risk_by_sec = _risk_by_security(returns_all)
    sig_outputs = {name: cls().compute(returns_all, prices) for name, cls in _SIGNALS.items()}
    regime_per_ticker = pd.Series({t: int(regimes[acmap[t]]) for t in universe})
    summary = summary_signal(sig_outputs, regime=regime_per_ticker)
    views = summary_to_bl_views(summary)

    # 3. SELECTION (filtra l'universo per regime)
    selected = select_securities(universe, acmap, regime_provider, risk_by_sec)
    discarded = [t for t in universe if t not in selected]

    # 4. OTTIMIZZAZIONE: ~38 modelli → 4 migliori → media, con le views BL
    ens = ensemble or default_ensemble(n_best=4)
    constraints = PortfolioConstraints.for_profile(profile, acmap)
    sel_views = {t: v for t, v in views.items() if t in selected}
    with _quiet():
        result = ens.run(returns_all[selected], views=sel_views, constraints=constraints)
    final = result.final_weights

    # 5. RISCHIO sull'allocazione finale
    risk = _risk_summary(returns_all[selected], final)

    # --- impacchetta il risultato ----------------------------------------- #
    ac_weights: dict[str, float] = {}
    for t, w in final.items():
        ac_weights[acmap[t]] = round(ac_weights.get(acmap[t], 0.0) + float(w), 4)

    signals_table = [
        {
            "ticker": t,
            "asset_class": acmap[t],
            **{name: {"direction": int(out.loc[t, "direction"]),
                      "probability": round(float(out.loc[t, "probability"]), 3)}
               for name, out in sig_outputs.items()},
            "summary": {"direction": int(summary.loc[t, "direction"]),
                        "probability": round(float(summary.loc[t, "probability"]), 3)},
        }
        for t in universe
    ]

    return AllocationResult(
        profile=profile, currency=currency, as_of=as_of_str,
        n_models_active=result.n_active,
        regimes={ac: ("bull" if r == Regime.BULL else "bear") for ac, r in regimes.items()},
        signals=signals_table,
        selected=selected, discarded=discarded,
        selected_models=list(result.selected),
        final_weights={t: round(float(w), 4) for t, w in final.items()},
        asset_class_weights=ac_weights,
        risk=risk,
        excluded_models=result.excluded,
    )


# --------------------------------------------------------------------------- #
# CLI — il "bottone" da riga di comando
# --------------------------------------------------------------------------- #
def _main() -> None:
    import argparse
    from pathlib import Path

    from rich.console import Console

    from .report import render_markdown

    parser = argparse.ArgumentParser(description="AA engine — pipeline di allocazione (Fase 4).")
    parser.add_argument("--profile", default="balanced", choices=["moderate", "balanced", "aggressive"])
    parser.add_argument("--currency", default="EUR", choices=["EUR", "USD"])
    parser.add_argument("--as-of", default=None)
    parser.add_argument("--out", default=None, help="percorso del report markdown (default: report_<profile>.md)")
    args = parser.parse_args()

    console = Console()
    console.rule(f"[bold]Pipeline allocazione — {args.profile}/{args.currency} (~1 min)")
    res = run_allocation(args.profile, args.currency, args.as_of)

    console.print(f"Modelli attivi: {res.n_models_active} | 4 scelti: {res.selected_models}")
    console.print(f"Regimi: {res.regimes}")
    console.print(f"Selezionati: {res.selected}  |  scartati: {res.discarded}")
    console.print("Allocazione finale: " + ", ".join(f"{k}={v:.3f}" for k, v in res.final_weights.items()))
    console.print(
        f"Rischio → StdDev {res.risk['std_dev']:.3f}  CVaR {res.risk['cvar_95']:.3f}  "
        f"MaxDD {res.risk['max_drawdown']:.3f}  Calmar {res.risk['calmar']:.2f}"
    )

    out = Path(args.out or f"report_{args.profile}.md")
    out.write_text(render_markdown(res))
    console.print(f"\n[green]Report salvato in {out}[/green]")


if __name__ == "__main__":
    _main()
