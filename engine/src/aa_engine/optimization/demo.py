"""Demo end-to-end della Fase 3 (spec §6).

    python -m aa_engine.optimization.demo

Pipeline:
    universe → select_securities (regime via proxy)
            → OptimizationEnsemble.run (9 modelli + baseline → 4 migliori → media)
            → risk_panel sull'allocazione finale
            → backtest walk-forward dell'allocazione

Stampa pesi per modello, i 4 scelti, i pesi finali, il pannello di rischio, e i
3 CHECK DI SANITÀ (la validazione che conta per la chat di progetto).
"""

from __future__ import annotations

import contextlib
import io
import warnings

import pandas as pd
from rich.console import Console
from rich.table import Table

from aa_engine.backtest.performance import performance_summary
from aa_engine.data import Regime
from aa_engine.optimization import default_ensemble
from aa_engine.optimization.base import PortfolioConstraints, equal_weights
from aa_engine.optimization.sample import ASSET_CLASS_MAP, sample_returns
from aa_engine.risk import compute_measure, risk_panel
from aa_engine.signals import StaticRegimeProvider, select_securities

warnings.filterwarnings("ignore")
console = Console()


@contextlib.contextmanager
def _quiet():
    """Sopprime i print interni di Riskfolio (cov non-PD, fold infeasible)."""
    buf = io.StringIO()
    with contextlib.redirect_stdout(buf), contextlib.redirect_stderr(buf):
        yield


def _run_ensemble(ensemble, returns, **kw):
    with _quiet():
        return ensemble.run(returns, **kw)


def _risk_by_security(returns: pd.DataFrame) -> pd.Series:
    """Rischio (StdDev annualizzata) per strumento, dal risk engine."""
    one = pd.Series([1.0], index=["x"])
    return pd.Series(
        {t: compute_measure(returns[[t]].rename(columns={t: "x"}), one, "MV") for t in returns.columns}
    )


def main() -> None:
    returns = sample_returns()
    universe = list(returns.columns)
    risk = _risk_by_security(returns)

    # --- selezione strumenti (regime via proxy) ---------------------------- #
    regimes = StaticRegimeProvider(
        {"Equity": Regime.BULL, "Commodities": Regime.BEAR}, default=Regime.BULL
    )
    selected = select_securities(universe, ASSET_CLASS_MAP, regimes, risk)
    console.rule("[bold]Fase 3 — pipeline ottimizzazione")
    console.print(f"Universo: {universe}")
    console.print(f"Selezionati (regime): {selected}\n")

    R = returns[selected]
    constraints = PortfolioConstraints.for_profile("balanced", ASSET_CLASS_MAP)
    ensemble = default_ensemble(n_best=4)
    result = _run_ensemble(ensemble, R, constraints=constraints)

    # --- pesi per modello + score ------------------------------------------ #
    t = Table(title="Modelli: pesi e score (Calmar OOS)")
    t.add_column("model")
    for s in selected:
        t.add_column(s, justify="right")
    t.add_column("score", justify="right")
    t.add_column("sel", justify="center")
    for name, w in result.weights_by_model.items():
        row = [name] + [f"{w.get(s, 0):.2f}" for s in selected]
        row += [f"{result.scores.get(name, float('nan')):.2f}", "✓" if name in result.selected else ""]
        t.add_row(*row)
    console.print(t)
    console.print(f"4 scelti: {result.selected}")

    fw = result.final_weights
    console.print("Pesi finali (media dei 4): " + ", ".join(f"{k}={v:.3f}" for k, v in fw.items()) + "\n")

    # --- risk panel dell'allocazione finale -------------------------------- #
    panel = risk_panel(R, fw)
    summary = {m: float(panel.set_index("measure").loc[m, "value"]) for m in ["MV", "CVaR", "MDD"]}
    console.print(
        f"Risk panel allocazione finale → StdDev={summary['MV']:.3f}  "
        f"CVaR={summary['CVaR']:.3f}  MaxDD={summary['MDD']:.3f}\n"
    )

    _sanity_checks(returns, selected, risk)


def _sanity_checks(returns: pd.DataFrame, selected: list[str], risk: pd.Series) -> None:
    console.rule("[bold]3 check di sanità")
    R = returns[selected]
    n = len(R)
    split = int(n * 0.7)
    in_s, out_s = R.iloc[:split], R.iloc[split:]

    # 1) l'ensemble batte (o pareggia) 1/N out-of-sample?
    #    Test del valore aggiunto dell'OTTIMIZZAZIONE: vincoli solo di
    #    diversificazione (cap per-asset), senza floor di profilo che forzerebbero
    #    l'equity — così la gestione del rischio può davvero difendersi nel crash.
    ens = default_ensemble(n_best=4)
    constraints = PortfolioConstraints(w_max=0.40, asset_class_map=ASSET_CLASS_MAP)
    w_ens = _run_ensemble(ens, in_s, constraints=constraints).final_weights
    w_eq = equal_weights(selected)
    oos_ens = out_s.mul(w_ens.reindex(selected).fillna(0), axis=1).sum(axis=1)
    oos_eq = out_s.mul(w_eq, axis=1).sum(axis=1)
    s_ens = performance_summary(oos_ens)
    s_eq = performance_summary(oos_eq)
    c1 = s_ens.sharpe >= s_eq.sharpe - 1e-9 or s_ens.calmar >= s_eq.calmar - 1e-9
    console.print(
        f"[1] ensemble vs 1/N (OOS): Sharpe {s_ens.sharpe:.2f} vs {s_eq.sharpe:.2f}, "
        f"Calmar {s_ens.calmar:.2f} vs {s_eq.calmar:.2f}  → {_pf(c1)}"
    )

    # 2) i profili sono ordinati per rischio (StdDev crescente)?
    vols = {}
    for prof in ["moderate", "balanced", "aggressive"]:
        cons = PortfolioConstraints.for_profile(prof, ASSET_CLASS_MAP)
        w = _run_ensemble(ens, R, constraints=cons).final_weights
        vols[prof] = compute_measure(R, w, "MV")
    c2 = vols["moderate"] <= vols["balanced"] + 1e-6 <= vols["aggressive"] + 2e-6
    console.print(
        f"[2] StdDev moderate→balanced→aggressive: "
        f"{vols['moderate']:.3f} ≤ {vols['balanced']:.3f} ≤ {vols['aggressive']:.3f}  → {_pf(c2)}"
    )

    # 3) cambiando regime cambia la selezione?
    universe = list(returns.columns)
    bull = StaticRegimeProvider({}, default=Regime.BULL)
    bear = StaticRegimeProvider({}, default=Regime.BEAR)
    sel_bull = select_securities(universe, ASSET_CLASS_MAP, bull, risk)
    sel_bear = select_securities(universe, ASSET_CLASS_MAP, bear, risk)
    c3 = set(sel_bear) < set(sel_bull)
    console.print(
        f"[3] regime BULL→{len(sel_bull)} strumenti, BEAR→{len(sel_bear)} "
        f"(scartati: {sorted(set(sel_bull) - set(sel_bear))})  → {_pf(c3)}"
    )


def _pf(ok: bool) -> str:
    return "[green]PASS[/green]" if ok else "[red]FAIL[/red]"


if __name__ == "__main__":
    main()
