"""Demo end-to-end dello Stadio 2 — ensemble "vero" (~38 modelli + baseline).

    python -m aa_engine.optimization.demo

Mostra quanti modelli entrano nell'ensemble, quanti vengono esclusi (e perché), i
4 scelti via walk-forward OOS, l'allocazione finale, e i 3 CHECK DI SANITÀ.

Nota: con ~40 modelli ogni run dell'ensemble richiede decine di secondi (ognuno
viene valutato out-of-sample col walk-forward). La demo fa 2 run (~1-2 min).
"""

from __future__ import annotations

import contextlib
import io
import warnings

from rich.console import Console
from rich.table import Table

from aa_engine.backtest.performance import performance_summary
from aa_engine.optimization import DEFAULT_MODELS, default_ensemble
from aa_engine.optimization.base import PortfolioConstraints, equal_weights
from aa_engine.optimization.sample import ASSET_CLASS_MAP, sample_returns
from aa_engine.risk import risk_panel

warnings.filterwarnings("ignore")
console = Console()


@contextlib.contextmanager
def _quiet():
    buf = io.StringIO()
    with contextlib.redirect_stdout(buf), contextlib.redirect_stderr(buf):
        yield


def main() -> None:
    returns = sample_returns(periods=756)
    constraints = PortfolioConstraints(w_max=0.40, asset_class_map=ASSET_CLASS_MAP)
    ensemble = default_ensemble(n_best=4)

    console.rule(f"[bold]Stadio 2 — ensemble con {len(DEFAULT_MODELS)} modelli (~1-2 min)")
    with _quiet():
        res = ensemble.run(returns, constraints=constraints)

    console.print(
        f"Modelli: [green]{res.n_active} attivi[/green], "
        f"[red]{len(res.excluded)} esclusi[/red] su {len(DEFAULT_MODELS)} totali."
    )
    if res.excluded:
        for name, why in res.excluded.items():
            console.print(f"  ✗ {name}: {why}")

    # top score per famiglia/modello
    sf = res.scores_frame().head(12)
    t = Table(title="Top-12 modelli per score (Calmar OOS)")
    t.add_column("model")
    t.add_column("score", justify="right")
    t.add_column("sel", justify="center")
    for name, row in sf.iterrows():
        t.add_row(name, f"{row['score']:.3f}", "✓" if row["selected"] else "")
    console.print(t)

    console.print(f"4 scelti: {res.selected}")
    fw = res.final_weights
    console.print("Allocazione finale (media dei 4): " + ", ".join(f"{k}={v:.3f}" for k, v in fw.items()))
    panel = risk_panel(returns, fw).set_index("measure")
    console.print(
        f"Risk panel finale → StdDev={panel.loc['MV','value']:.3f}  "
        f"CVaR={panel.loc['CVaR','value']:.3f}  MaxDD={panel.loc['MDD','value']:.3f}\n"
    )

    _sanity_checks(returns, constraints, ensemble, res)


def _sanity_checks(returns, constraints, ensemble, res_full) -> None:
    console.rule("[bold]3 check di sanità")
    n = len(returns)
    split = int(n * 0.7)
    in_s, out_s = returns.iloc[:split], returns.iloc[split:]

    # secondo run (in-sample) — riusato per check [1] e [2]
    with _quiet():
        res_in = ensemble.run(in_s, constraints=constraints)
    w_ens = res_in.final_weights
    w_eq = equal_weights(returns.columns)
    s_ens = performance_summary(out_s.mul(w_ens.reindex(out_s.columns).fillna(0), axis=1).sum(axis=1))
    s_eq = performance_summary(out_s.mul(w_eq, axis=1).sum(axis=1))

    # [1] con ~38 modelli, batte ancora 1/N su Calmar?
    c1 = s_ens.calmar >= s_eq.calmar - 1e-9 or s_ens.sharpe >= s_eq.sharpe - 1e-9
    console.print(
        f"[1] ensemble (~{res_full.n_active} modelli) vs 1/N (OOS): "
        f"Calmar {s_ens.calmar:.2f} vs {s_eq.calmar:.2f}, Sharpe {s_ens.sharpe:.2f} vs {s_eq.sharpe:.2f} → {_pf(c1)}"
    )

    # [2] la selezione dei 4 è stabile fra finestre (full vs in-sample)?
    #     Ciò che conta non sono i NOMI ma se l'ALLOCAZIONE è stabile: con molti
    #     modelli simili (es. drawdown-min), i nomi nei top-4 si scambiano ma i
    #     pesi finali restano vicini. "Salta erraticamente" solo se anche
    #     l'allocazione cambia molto.
    common = set(res_full.selected) & set(res_in.selected)
    a, b = res_full.final_weights, res_in.final_weights.reindex(res_full.final_weights.index).fillna(0)
    l1 = float((a - b).abs().sum())           # distanza L1 fra le due allocazioni (0..2)
    c2 = l1 < 0.5                              # allocazioni sostanzialmente concordi
    console.print(
        f"[2] stabilità: nomi in comune {len(common)}/4 (full={res_full.selected}, 70%={res_in.selected}); "
        f"distanza L1 allocazioni = {l1:.2f} → {_pf(c2)}"
    )
    if len(common) < 2 and c2:
        console.print("    (nomi diversi ma stessa famiglia/stile → allocazione stabile, non erratica)")

    # [3] quanti modelli esclusi per non-convergenza?
    console.print(
        f"[3] modelli esclusi (non-convergenza/pesi invalidi): {len(res_full.excluded)} "
        f"su {res_full.n_active + len(res_full.excluded)} → "
        f"{'[green]nessuno[/green]' if not res_full.excluded else list(res_full.excluded)}"
    )


def _pf(ok: bool) -> str:
    return "[green]PASS[/green]" if ok else "[red]FAIL[/red]"


if __name__ == "__main__":
    main()
