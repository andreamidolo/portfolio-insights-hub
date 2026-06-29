// Sezione "Backtest" (Stadio 3): walk-forward out-of-sample contro baseline 1/N.
// Sorgente: POST /api/v1/backtest/run. Niente numeri inventati: stati di
// loading/errore espliciti (golden rule in src/lib/api.ts). Run manuale
// tramite pulsante "Esegui backtest".

import { useMemo, useState } from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import {
  api,
  type BacktestResponse,
  type BacktestStats,
  type BacktestStrategy,
} from "@/lib/api";
import { BRAND, chartColor } from "@/lib/brand-theme";
import { useAsync } from "@/lib/use-async";

import { AsyncView, Card, Eyebrow, SectionHeader } from "./ui";

const STRATEGIES: { id: BacktestStrategy; label: string }[] = [
  { id: "inverse_volatility", label: "Inverse Volatility" },
  { id: "equal_weight", label: "Equal Weight (1/N)" },
];

const fmtPct2 = (v: number | null) =>
  v == null
    ? "—"
    : `${(v * 100).toLocaleString("it-IT", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}%`;

const fmtNum2 = (v: number | null) =>
  v == null
    ? "—"
    : v.toLocaleString("it-IT", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

type MetricKind = "pct" | "num";
interface MetricRow {
  label: string;
  key: keyof BacktestStats;
  kind: MetricKind;
  // higher value = better (used to highlight winner). null = no winner shown.
  higherBetter: boolean | null;
}

const METRICS: MetricRow[] = [
  { label: "CAGR", key: "cagr", kind: "pct", higherBetter: true },
  { label: "Volatilità", key: "volatility", kind: "pct", higherBetter: false },
  { label: "Sharpe", key: "sharpe", kind: "num", higherBetter: true },
  { label: "Sortino", key: "sortino", kind: "num", higherBetter: true },
  { label: "Max Drawdown", key: "max_drawdown", kind: "pct", higherBetter: false },
  { label: "Calmar", key: "calmar", kind: "num", higherBetter: true },
  { label: "Hit Ratio", key: "hit_ratio", kind: "pct", higherBetter: true },
];

export function BacktestSection() {
  const [strategy, setStrategy] = useState<BacktestStrategy>("inverse_volatility");
  const [trainSize, setTrainSize] = useState<number>(252);
  const [testSize, setTestSize] = useState<number>(63);

  const { state, run } = useAsync<BacktestResponse>(
    () => api.runBacktest(strategy, trainSize, testSize),
    [],
    { manual: true },
  );

  const status =
    state.status === "success"
      ? "live"
      : state.status === "error"
        ? "error"
        : state.status === "loading"
          ? "loading"
          : "soon";

  return (
    <section>
      <SectionHeader
        step="Stadio 3"
        title="Backtest"
        subtitle="Walk-forward OUT-OF-SAMPLE: la strategia viene addestrata su una finestra e valutata sulla finestra successiva mai vista. Confronto contro baseline 1/N. Tutti i numeri arrivano da POST /backtest/run."
        status={status}
      />

      <Card className="mb-4 p-4">
        <div className="flex flex-wrap items-end gap-5">
          <Segmented
            label="Strategia"
            value={strategy}
            options={STRATEGIES.map((s) => s.id)}
            onChange={setStrategy}
            render={(id) => STRATEGIES.find((s) => s.id === id)?.label ?? id}
          />
          <NumberField
            label="Train (giorni)"
            value={trainSize}
            min={20}
            onChange={setTrainSize}
          />
          <NumberField
            label="Test (giorni)"
            value={testSize}
            min={1}
            onChange={setTestSize}
          />
          <button
            type="button"
            onClick={run}
            disabled={state.status === "loading"}
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-60"
          >
            {state.status === "loading" ? "Esecuzione in corso…" : "Esegui backtest"}
          </button>
        </div>
      </Card>

      {state.status === "idle" ? (
        <Card className="p-6 text-sm text-muted-foreground">
          Imposta i parametri e premi <span className="font-semibold">Esegui backtest</span>{" "}
          per lanciare il walk-forward out-of-sample sul motore.
        </Card>
      ) : (
        <AsyncView
          state={state}
          onRetry={run}
          loadingLabel="Esecuzione walk-forward in corso sul motore…"
        >
          {(data) => <Content data={data} />}
        </AsyncView>
      )}
    </section>
  );
}

function Content({ data }: { data: BacktestResponse }) {
  const stratColor = chartColor(0);
  const baseColor = BRAND.slate;

  const equity = useMemo(() => data.equity_curve ?? [], [data.equity_curve]);
  const hasBaseline = equity.some((p) => p.baseline != null);

  return (
    <div className="space-y-5">
      {/* Header info OOS */}
      <Card className="p-4">
        <div className="flex flex-wrap items-baseline gap-x-8 gap-y-2 text-sm">
          <InfoItem label="Periodo OOS" value={`${data.date_start} → ${data.date_end}`} />
          <InfoItem label="Folds" value={String(data.n_folds)} />
          <InfoItem label="Train (gg)" value={String(data.train_size)} />
          <InfoItem label="Test (gg)" value={String(data.test_size)} />
          <InfoItem label="Metodo" value={data.method} />
          <InfoItem label="Sorgente" value={data.source} />
        </div>
      </Card>

      {/* Equity curve */}
      <Card className="p-4">
        <div className="mb-3 flex items-baseline justify-between">
          <Eyebrow>Equity curve — base 100</Eyebrow>
          <span className="text-xs text-muted-foreground">
            {data.stats.n_obs} osservazioni out-of-sample
          </span>
        </div>
        {equity.length === 0 ? (
          <p className="py-10 text-center text-sm text-muted-foreground">
            Nessuna curva restituita dal motore.
          </p>
        ) : (
          <div style={{ width: "100%", height: 340 }}>
            <ResponsiveContainer>
              <LineChart data={equity} margin={{ top: 8, right: 16, bottom: 0, left: 0 }}>
                <CartesianGrid stroke={BRAND.line} strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 11, fill: BRAND.slate }}
                  minTickGap={48}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: BRAND.slate }}
                  domain={["auto", "auto"]}
                  width={48}
                />
                <Tooltip
                  contentStyle={{ fontSize: 12 }}
                  formatter={(v: number | string) =>
                    typeof v === "number" ? v.toFixed(2) : v
                  }
                />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Line
                  type="monotone"
                  dataKey="strategy"
                  name={`Strategia (${data.strategy})`}
                  stroke={stratColor}
                  dot={false}
                  strokeWidth={2}
                  isAnimationActive={false}
                />
                {hasBaseline && (
                  <Line
                    type="monotone"
                    dataKey="baseline"
                    name="Benchmark 1/N"
                    stroke={baseColor}
                    dot={false}
                    strokeDasharray="4 4"
                    strokeWidth={1.5}
                    isAnimationActive={false}
                  />
                )}
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </Card>

      {/* Metric table */}
      <Card className="overflow-hidden">
        <div className="border-b border-border px-4 py-2">
          <Eyebrow>Metriche walk-forward</Eyebrow>
        </div>
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-border bg-secondary/60 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              <th className="px-4 py-2">Metrica</th>
              <th className="px-4 py-2 text-right">Strategia</th>
              <th className="px-4 py-2 text-right">Benchmark 1/N</th>
            </tr>
          </thead>
          <tbody>
            {METRICS.map((m, i) => {
              const s = data.stats[m.key];
              const b = data.baseline_stats[m.key];
              const sNum = typeof s === "number" ? s : null;
              const bNum = typeof b === "number" ? b : null;
              let winner: "s" | "b" | null = null;
              if (m.higherBetter !== null && sNum != null && bNum != null && sNum !== bNum) {
                const sWin = m.higherBetter ? sNum > bNum : sNum < bNum;
                winner = sWin ? "s" : "b";
              }
              const fmt = m.kind === "pct" ? fmtPct2 : fmtNum2;
              return (
                <tr
                  key={m.key as string}
                  className={"border-t border-border " + (i % 2 === 1 ? "bg-background/40" : "")}
                >
                  <td className="px-4 py-1.5 text-sm text-foreground">{m.label}</td>
                  <td
                    className={
                      "px-4 py-1.5 text-right font-mono text-sm tabular-nums " +
                      (winner === "s" ? "font-semibold text-foreground" : "text-muted-foreground")
                    }
                  >
                    {fmt(sNum)}
                  </td>
                  <td
                    className={
                      "px-4 py-1.5 text-right font-mono text-sm tabular-nums " +
                      (winner === "b" ? "font-semibold text-foreground" : "text-muted-foreground")
                    }
                  >
                    {fmt(bNum)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className="border-t border-border px-4 py-2 text-[11px] text-muted-foreground">
          Valore in <span className="font-semibold text-foreground">grassetto</span> = migliore
          tra le due colonne (Sharpe/Sortino/Calmar/CAGR/Hit Ratio: più alto è meglio; Volatilità
          e Max Drawdown: più basso è meglio).
        </div>
      </Card>
    </div>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </div>
      <div className="font-mono text-sm tabular-nums text-foreground">{value}</div>
    </div>
  );
}

function NumberField({
  label,
  value,
  onChange,
  min,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min?: number;
}) {
  return (
    <div>
      <div className="mb-1 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </div>
      <input
        type="number"
        value={value}
        min={min}
        onChange={(e) => {
          const n = Number(e.target.value);
          if (Number.isFinite(n) && n > 0) onChange(Math.floor(n));
        }}
        className="w-28 rounded-md border border-border bg-card px-3 py-1.5 font-mono text-sm tabular-nums text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
      />
    </div>
  );
}

function Segmented<T extends string>({
  label,
  value,
  options,
  onChange,
  render,
}: {
  label: string;
  value: T;
  options: readonly T[];
  onChange: (v: T) => void;
  render?: (v: T) => string;
}) {
  return (
    <div>
      <div className="mb-1 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </div>
      <div
        role="radiogroup"
        aria-label={label}
        className="inline-flex overflow-hidden rounded-md border border-border bg-card"
      >
        {options.map((opt) => {
          const on = opt === value;
          return (
            <button
              key={opt}
              type="button"
              role="radio"
              aria-checked={on}
              onClick={() => onChange(opt)}
              className={
                "border-r border-border px-3.5 py-1.5 text-sm transition-colors last:border-r-0 " +
                (on
                  ? "bg-primary font-medium text-primary-foreground"
                  : "bg-card text-foreground hover:bg-secondary")
              }
            >
              {render ? render(opt) : opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}
