"""Demo del risk engine — eseguibile end-to-end.

    python -m aa_engine.risk.demo

Oggi STAMPA SOLO la struttura attesa (i calcoli sono NotImplementedError):
serve come "esecuzione viva" che Claude Code fa passare implementando measures.py.
Quando i moduli saranno implementati, questo script produrrà il pannello di
rischio su un portafoglio campione e lo confronterà con i valori target dei
report AlgoEagle (vedi data/sample/algoeagle_risk_targets.csv).
"""

from __future__ import annotations

from pathlib import Path

import pandas as pd
from rich.console import Console
from rich.table import Table

from aa_engine.data import PriceData
from aa_engine.risk import ALL_MEASURES, risk_panel

console = Console()

SAMPLE = Path(__file__).resolve().parents[3] / "data" / "sample"


def _load_sample() -> tuple[pd.DataFrame, pd.Series]:
    """Carica prezzi campione + pesi campione. Se i file non ci sono, genera dati finti."""
    prices_path = SAMPLE / "sample_prices.csv"
    weights_path = SAMPLE / "sample_weights.csv"
    if prices_path.exists() and weights_path.exists():
        prices = pd.read_csv(prices_path, index_col=0, parse_dates=True)
        weights = pd.read_csv(weights_path, index_col=0).iloc[:, 0]
    else:  # fallback sintetico
        import numpy as np

        rng = np.random.default_rng(42)
        dates = pd.bdate_range("2020-01-01", periods=750)
        tickers = ["EQ_US", "EQ_EU", "BOND_US", "GOLD", "OIL"]
        rets = rng.normal(0.0003, 0.01, size=(len(dates), len(tickers)))
        prices = pd.DataFrame(100 * (1 + rets).cumprod(axis=0), index=dates, columns=tickers)
        weights = pd.Series([0.35, 0.25, 0.30, 0.05, 0.05], index=tickers)
    return prices, weights


def main() -> None:
    prices, weights = _load_sample()
    data = PriceData.from_prices(prices)

    console.rule("[bold]AA Engine — Risk Panel (demo)")
    console.print(f"Universo: {data.tickers}")
    console.print(f"Pesi: {weights.to_dict()}")
    console.print(f"Giorni di storia: {len(data.returns)}\n")

    try:
        panel = risk_panel(data.returns, weights)
        table = Table(title="Risk Panel")
        for col in panel.columns:
            table.add_column(str(col))
        for _, row in panel.iterrows():
            table.add_row(*[f"{v:.4f}" if isinstance(v, float) else str(v) for v in row])
        console.print(table)
    except NotImplementedError:
        console.print("[yellow]risk_panel non ancora implementato.[/yellow]")
        console.print("Metriche attese nel pannello finale:")
        t = Table(title="Tassonomia metriche (da implementare)")
        t.add_column("Famiglia")
        t.add_column("Codice")
        t.add_column("Nome")
        for m in ALL_MEASURES:
            t.add_row(m.family.value, m.code, m.name)
        console.print(t)


if __name__ == "__main__":
    main()
