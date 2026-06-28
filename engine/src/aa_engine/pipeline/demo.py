"""Demo Fase 4 — il flusso completo + i 4 check di sanità.

    python -m aa_engine.pipeline.demo

Genera il report per il profilo *balanced* (ensemble completo) e verifica i 4
check. I check 3-4 usano un ensemble ridotto per non moltiplicare i run lenti.
"""

from __future__ import annotations

import warnings
from pathlib import Path

from rich.console import Console

from aa_engine.optimization import (
    BlackLitterman,
    EqualWeight,
    MaxSharpe,
    MinVolatility,
    OptimizationEnsemble,
    RiskParity,
)
from aa_engine.risk import compute_measure
from aa_engine.optimization.sample import sample_returns

from .report import render_html, render_markdown
from .run import run_allocation

warnings.filterwarnings("ignore")
console = Console()


def _small_ensemble() -> OptimizationEnsemble:
    return OptimizationEnsemble(
        [MinVolatility(), MaxSharpe(), RiskParity(), BlackLitterman(), EqualWeight()], n_best=3
    )


def main() -> None:
    console.rule("[bold]Fase 4 — il bottone: pipeline end-to-end (~1-2 min)")
    res = run_allocation("balanced", "EUR")          # CLI path, ensemble completo

    Path("report_balanced.md").write_text(render_markdown(res))
    Path("report_balanced.html").write_text(render_html(res))
    console.print(render_markdown(res))
    console.print("[green]Report salvati: report_balanced.md / .html[/green]\n")

    _sanity_checks(res)


def _sanity_checks(res_full) -> None:
    console.rule("[bold]4 check di sanità")

    # [1] il flusso gira end-to-end senza intervento manuale
    c1 = res_full.n_models_active > 0 and len(res_full.final_weights) > 0
    console.print(f"[1] flusso end-to-end completo ({res_full.n_models_active} modelli) → {_pf(c1)}")

    # [2] numeri coerenti fra le sezioni
    wsum = sum(res_full.final_weights.values())
    acsum = sum(res_full.asset_class_weights.values())
    # peso per asset class == somma pesi strumenti della classe
    by_class: dict[str, float] = {}
    from aa_engine.optimization.sample import ASSET_CLASS_MAP
    for t, w in res_full.final_weights.items():
        by_class[ASSET_CLASS_MAP[t]] = by_class.get(ASSET_CLASS_MAP[t], 0.0) + w
    coherent = all(abs(by_class.get(ac, 0) - v) < 1e-2 for ac, v in res_full.asset_class_weights.items())
    c2 = abs(wsum - 1) < 1e-3 and abs(acsum - 1) < 1e-3 and coherent
    console.print(
        f"[2] coerenza numeri: Σpesi={wsum:.3f}, Σasset-class={acsum:.3f}, "
        f"classi=strumenti {coherent} → {_pf(c2)}"
    )

    # [3] cambiando profilo (4 linee), rischio crescente (ensemble ridotto)
    vols = {}
    order = ["conservative", "moderate", "balanced", "aggressive"]
    for prof in order:
        r = run_allocation(prof, "EUR", ensemble=_small_ensemble())
        ret = sample_returns()[r.selected]
        import pandas as pd
        w = pd.Series(r.final_weights).reindex(ret.columns).fillna(0.0)
        vols[prof] = compute_measure(ret, w, "MV")
    c3 = all(vols[a] <= vols[b] + 2e-6 for a, b in zip(order, order[1:]))
    console.print(
        "[3] rischio per profilo: StdDev "
        + " ≤ ".join(f"{vols[p]:.3f}" for p in order)
        + f" → {_pf(c3)}"
    )

    # [4] CLI e API producono lo STESSO risultato (stesso flusso)
    from fastapi.testclient import TestClient
    from aa_engine.api.main import app
    api = TestClient(app).post("/api/v1/allocation/run", json={"profile": "balanced", "currency": "EUR"}).json()
    c4 = api["final_weights"] == res_full.final_weights and api["selected_models"] == res_full.selected_models
    console.print(f"[4] CLI == API (stesso run_allocation): {_pf(c4)}")


def _pf(ok: bool) -> str:
    return "[green]PASS[/green]" if ok else "[red]FAIL[/red]"


if __name__ == "__main__":
    main()
