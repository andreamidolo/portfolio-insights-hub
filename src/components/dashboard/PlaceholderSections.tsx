// Declared placeholder — Backtest (Stage 3). The structure is ready; the endpoint
// arrives in a later iteration. No fake data: it says plainly "in arrivo" instead
// of inventing numbers. (Dati/Import is now functional — see DataImportSection.)

import { PlaceholderNotice, SectionHeader } from "./ui";

export function BacktestSection() {
  return (
    <section>
      <SectionHeader
        step="Stadio 3"
        title="Backtest"
        subtitle="Curva di performance walk-forward dell'ensemble vs 1/N, con metriche storiche ed evidenza dei periodi out-of-sample."
        status="soon"
      />
      <PlaceholderNotice
        endpoint="GET /api/v1/backtest"
        bullets={[
          "Equity line walk-forward: ensemble vs baseline 1/N.",
          "Metriche storiche: CAGR, Sharpe, Sortino, Max Drawdown, Calmar.",
          "Evidenza dei periodi out-of-sample (anti-overfitting).",
        ]}
      />
    </section>
  );
}
