// Declared placeholders — Dati/Import (input) and Backtest (Stage 3). The
// structure is ready; the endpoints arrive in a later iteration. No fake data:
// these sections say plainly "in arrivo" instead of inventing numbers.

import { PlaceholderNotice, SectionHeader } from "./ui";

export function DataImportSection() {
  return (
    <section>
      <SectionHeader
        step="Ingresso"
        title="Dati / Import"
        subtitle="Caricamento dell'universo (prezzi giornalieri, indici di volatilità) e vista delle serie storiche. La porta d'ingresso per i dati veri (Bloomberg/Morningstar)."
        status="soon"
      />
      <PlaceholderNotice
        endpoint="POST /api/v1/data/upload · GET /api/v1/data/universe"
        bullets={[
          "Upload CSV (drag & drop o file picker) di prezzi e indici di volatilità.",
          "Tabella dell'universo: ticker, asset class, n. osservazioni, range date.",
          "Anteprima grafica di una serie storica selezionata.",
          "Stato: dati di prova (backbone campione) vs dati caricati dall'utente.",
        ]}
      />
    </section>
  );
}

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
