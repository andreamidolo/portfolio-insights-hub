"""Demo end-to-end dei Signals (Stadio 1) — spec §6.

    python -m aa_engine.signals.demo

Produce la tabella stile AlgoEagle (Trend | Oscillator | A.I. | Alpha Crash |
SUMMARY, con probabilità), traduce il SUMMARY in views Black-Litterman, fa girare
``BlackLitterman.fit_weights`` e mostra il pannello di rischio. Poi i 4 check di
sanità (la validazione che conta per la chat di progetto).

Nota: l'SVM walk-forward è lento (decine di secondi): è il prezzo dell'onestà
anti-overfitting.
"""

from __future__ import annotations

import contextlib
import io
import warnings

import numpy as np
import pandas as pd
from rich.console import Console
from rich.table import Table

from aa_engine.data import Regime
from aa_engine.optimization import BlackLitterman, PortfolioConstraints
from aa_engine.optimization.sample import ASSET_CLASS_MAP, sample_returns
from aa_engine.backtest.performance import performance_summary
from aa_engine.signals import (
    AIForecast,
    AlphaCrashSignal,
    OscillatorSignal,
    TrendSignal,
    summary_signal,
    summary_to_bl_views,
)

warnings.filterwarnings("ignore")
console = Console()


@contextlib.contextmanager
def _quiet():
    """Sopprime i print interni di Riskfolio (cov non-PD, fold infeasible)."""
    buf = io.StringIO()
    with contextlib.redirect_stdout(buf), contextlib.redirect_stderr(buf):
        yield


def _cell(row) -> str:
    d = int(row["direction"])
    arrow = "▲" if d > 0 else ("▼" if d < 0 else "•")
    return f"{arrow} {row['probability']:.2f}"


def main() -> None:
    rets = sample_returns(periods=1100)
    prices = 100 * (1 + rets).cumprod()
    tickers = list(rets.columns)

    trend = TrendSignal().compute(rets, prices)
    osc = OscillatorSignal().compute(rets, prices)
    crash = AlphaCrashSignal().compute(rets, prices)

    console.rule("[bold]Stadio 1 — Signals (validazione SVM, ~30-60s)")
    ai = AIForecast()
    val = ai.validate(rets, prices, step=42)        # walk-forward OOS (onesto)
    ai_out = ai.compute(rets, prices)

    signals = {"trend": trend, "oscillator": osc, "alpha_crash": crash}
    if ai.enabled:                                  # SVM nel SUMMARY solo se vince
        signals["ai_forecast"] = ai_out

    summary = summary_signal(signals)

    # --- tabella stile AlgoEagle ------------------------------------------- #
    t = Table(title="Segnali per strumento (direzione ▲/▼ + probabilità)")
    t.add_column("ticker")
    for col in ["Trend", "Oscillator", "A.I.", "AlphaCrash", "SUMMARY"]:
        t.add_column(col, justify="center")
    for tk in tickers:
        t.add_row(
            tk, _cell(trend.loc[tk]), _cell(osc.loc[tk]), _cell(ai_out.loc[tk]),
            _cell(crash.loc[tk]), _cell(summary.loc[tk]),
        )
    console.print(t)

    views = summary_to_bl_views(summary)
    console.print("Views Black-Litterman: " + ", ".join(f"{k}={v:+.4f}" for k, v in views.items()) + "\n")

    _sanity_checks(rets, prices, val, summary)


def _sanity_checks(rets, prices, val, summary) -> None:
    console.rule("[bold]4 check di sanità")

    # [1] l'SVM batte il baseline OOS?
    console.print(
        f"[1] SVM vs baseline (OOS): SVM {val.svm_hit:.3f} | momentum {val.baseline_momentum_hit:.3f} | "
        f"always-up {val.baseline_always_up_hit:.3f} (n={val.n}) → "
        f"{'[green]batte[/green]' if val.beats_baseline else '[red]NON batte → escluso dal SUMMARY[/red]'}"
    )

    # [2] il SUMMARY (views) migliora l'allocazione vs motore senza segnali (views vuote)?
    n = len(rets)
    split = int(n * 0.7)
    in_s, out_s = rets.iloc[:split], rets.iloc[split:]
    cons = PortfolioConstraints(w_max=0.40, asset_class_map=ASSET_CLASS_MAP)
    sig_in = {
        "trend": TrendSignal().compute(in_s, prices.iloc[:split]),
        "oscillator": OscillatorSignal().compute(in_s, prices.iloc[:split]),
        "alpha_crash": AlphaCrashSignal().compute(in_s, prices.iloc[:split]),
    }
    views_in = summary_to_bl_views(summary_signal(sig_in))
    with _quiet():
        w_sig = BlackLitterman().fit_weights(in_s, views=views_in, constraints=cons)
        w_base = BlackLitterman().fit_weights(in_s, views={}, constraints=cons)
    s_sig = performance_summary(out_s.mul(w_sig.reindex(out_s.columns).fillna(0), axis=1).sum(axis=1))
    s_base = performance_summary(out_s.mul(w_base.reindex(out_s.columns).fillna(0), axis=1).sum(axis=1))
    better = (s_sig.sharpe >= s_base.sharpe - 1e-9) or (s_sig.calmar >= s_base.calmar - 1e-9)
    console.print(
        f"[2] SUMMARY vs no-signal (OOS): Sharpe {s_sig.sharpe:.2f} vs {s_base.sharpe:.2f}, "
        f"Calmar {s_sig.calmar:.2f} vs {s_base.calmar:.2f} → {_pf(better)}"
    )

    # [3] probabilità calibrate? (gap |confidenza media − accuratezza| dell'SVM)
    console.print(
        f"[3] Calibrazione SVM: gap |confidenza−accuratezza| = {val.calibration_gap:.3f} "
        f"({'[green]ok[/green]' if val.calibration_gap < 0.1 else '[yellow]sovra/sotto-confidente[/yellow]'})"
    )

    # [4] il regime modula il SUMMARY?
    sigs = {
        "trend": TrendSignal().compute(rets, prices),
        "oscillator": OscillatorSignal().compute(rets, prices),
        "alpha_crash": AlphaCrashSignal().compute(rets, prices),
    }
    reg_bull = pd.Series(int(Regime.BULL), index=summary.index)
    reg_bear = pd.Series(int(Regime.BEAR), index=summary.index)
    s_bull = summary_signal(sigs, regime=reg_bull)
    s_bear = summary_signal(sigs, regime=reg_bear)
    changed = not np.allclose(s_bull["probability"], s_bear["probability"])
    console.print(f"[4] Regime modula il SUMMARY (BULL≠BEAR): {_pf(changed)}")


def _pf(ok: bool) -> str:
    return "[green]PASS[/green]" if ok else "[red]FAIL[/red]"


if __name__ == "__main__":
    main()
