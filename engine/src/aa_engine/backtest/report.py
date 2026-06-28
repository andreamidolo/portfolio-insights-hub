"""Report minimale di un backtest (testo + tabella rich)."""

from __future__ import annotations

import numpy as np

from .results import BacktestResult

_PCT_FIELDS = {"total_return", "cagr", "volatility", "max_drawdown", "hit_ratio"}


def _fmt(field: str, value: float) -> str:
    if value is None or (isinstance(value, float) and np.isnan(value)):
        return "—"
    if field in _PCT_FIELDS:
        return f"{value * 100:.2f}%"
    return f"{value:.2f}"


def format_report(result: BacktestResult) -> str:
    """Riassunto testuale (no dipendenze) di un ``BacktestResult``."""
    lines = [f"Backtest [{result.method}] — {result.n_folds} fold"]
    if result.stats is not None:
        lines.append("Out-of-sample (path concatenato):")
        for field, value in result.stats.as_dict().items():
            lines.append(f"  {field:<14} {_fmt(field, value)}")
    if result.method == "cpcv" and result.folds:
        dist = result.distribution()
        lines.append("Distribuzione sui fold (mean ± std):")
        for metric, row in dist.iterrows():
            lines.append(
                f"  {metric:<14} {_fmt(metric, row['mean'])} ± {_fmt(metric, row['std'])}"
            )
    return "\n".join(lines)


def render(result: BacktestResult, console=None) -> None:
    """Stampa il report con una tabella ``rich`` (fallback: testo)."""
    try:
        from rich.console import Console
        from rich.table import Table
    except Exception:  # pragma: no cover
        print(format_report(result))
        return

    console = console or Console()
    console.rule(f"[bold]Backtest — {result.method} ({result.n_folds} fold)")

    if result.stats is not None:
        table = Table(title="Out-of-sample (path concatenato)")
        table.add_column("Metrica")
        table.add_column("Valore", justify="right")
        for field, value in result.stats.as_dict().items():
            table.add_row(field, _fmt(field, value))
        console.print(table)

    if result.method == "cpcv" and result.folds:
        dist = result.distribution()
        table = Table(title="Distribuzione sui fold")
        table.add_column("Metrica")
        table.add_column("Mean", justify="right")
        table.add_column("Median", justify="right")
        table.add_column("Std", justify="right")
        for metric, row in dist.iterrows():
            table.add_row(
                metric,
                _fmt(metric, row["mean"]),
                _fmt(metric, row["median"]),
                _fmt(metric, row["std"]),
            )
        console.print(table)
