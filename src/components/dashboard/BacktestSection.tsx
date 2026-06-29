// Sezione "Backtest" (Stadio 3): walk-forward out-of-sample contro baseline 1/N.
// Sorgente: POST /api/v1/backtest/run (strategie sincrone) e POST
// /api/v1/backtest/ensemble + GET /api/v1/backtest/jobs/{id} per la modalità
// "Ensemble (41 modelli)" che gira come job asincrono con polling.
// Niente numeri inventati: stati di loading/errore espliciti (golden rule in
// src/lib/api.ts).

import { useEffect, useMemo, useRef, useState } from "react";
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
  type BacktestJobResponse,
  type BacktestResponse,
  type BacktestStats,
  type BacktestStrategy,
  type Currency,
  type Profile,
} from "@/lib/api";
import { BRAND, chartColor } from "@/lib/brand-theme";
import { useAsync } from "@/lib/use-async";

import { AsyncView, Card, Eyebrow, SectionHeader } from "./ui";

type StrategyId = BacktestStrategy | "ensemble";

const STRATEGIES: { id: StrategyId; label: string }[] = [
  { id: "inverse_volatility", label: "Inverse Volatility" },
  { id: "equal_weight", label: "Equal Weight (1/N)" },
  { id: "ensemble", label: "Ensemble (41 modelli)" },
];

const PROFILES: Profile[] = ["low", "moderate", "medium", "high"];
const CURRENCIES: Currency[] = ["USD", "EUR", "CHF"];

const PROFILE_LABEL: Record<Profile, string> = {
  low: "Low",
  moderate: "Moderate",
  medium: "Medium",
  high: "High",
};

const POLL_INTERVAL_MS = 2500;

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

// ---- Ensemble job state machine -----------------------------------------

type EnsembleState =
  | { status: "idle" }
  | { status: "starting" }
  | {
      status: "running";
      jobId: string;
      progressDone: number;
      progressTotal: number;
    }
  | { status: "done"; data: BacktestResponse }
  | { status: "error"; error: string };

export function BacktestSection() {
  const [strategy, setStrategy] = useState<StrategyId>("inverse_volatility");
  const [trainSize, setTrainSize] = useState<number>(252);
  const [testSize, setTestSize] = useState<number>(63);
  const [profile, setProfile] = useState<Profile>("medium");
  const [currency, setCurrency] = useState<Currency>("USD");

  // Sync strategies (existing flow, untouched).
  const syncStrategy: BacktestStrategy =
    strategy === "ensemble" ? "inverse_volatility" : strategy;
  const { state: syncState, run: runSync } = useAsync<BacktestResponse>(
    () => api.runBacktest(syncStrategy, trainSize, testSize),
    [],
    { manual: true },
  );

  // Ensemble job (async with polling).
  const [ensemble, setEnsemble] = useState<EnsembleState>({ status: "idle" });
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const runIdRef = useRef(0);

  const stopPolling = () => {
    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
  };

  useEffect(() => stopPolling, []);

  // When the ensemble defaults (train/test) make more sense, suggest 252/126 when
  // switching to ensemble for the first time on idle.
  useEffect(() => {
    if (strategy === "ensemble") {
      setTestSize((prev) => (prev === 63 ? 126 : prev));
    }
  }, [strategy]);

  const runEnsemble = () => {
    stopPolling();
    const myRunId = ++runIdRef.current;
    setEnsemble({ status: "starting" });
    api
      .startEnsembleBacktest(profile, currency, trainSize, testSize)
      .then((start) => {
        if (myRunId !== runIdRef.current) return;
        setEnsemble({
          status: "running",
          jobId: start.job_id,
          progressDone: 0,
          progressTotal: 0,
        });
        const tick = () => {
          if (myRunId !== runIdRef.current) return;
          api
            .getBacktestJob(start.job_id)
            .then((job: BacktestJobResponse) => {
              if (myRunId !== runIdRef.current) return;
              if (job.status === "done" && job.result) {
                stopPolling();
                setEnsemble({ status: "done", data: job.result });
              } else if (job.status === "error") {
                stopPolling();
                setEnsemble({
                  status: "error",
                  error: job.error ?? "Errore sconosciuto durante il backtest ensemble.",
                });
              } else {
                setEnsemble({
                  status: "running",
                  jobId: start.job_id,
                  progressDone: job.progress_done,
                  progressTotal: job.progress_total,
                });
              }
            })
            .catch((err: unknown) => {
              if (myRunId !== runIdRef.current) return;
              stopPolling();
              const msg = err instanceof Error ? err.message : "Errore di rete sul polling job.";
              setEnsemble({ status: "error", error: msg });
            });
        };
        // First poll subito, poi a intervallo regolare.
        tick();
        pollRef.current = setInterval(tick, POLL_INTERVAL_MS);
      })
      .catch((err: unknown) => {
        if (myRunId !== runIdRef.current) return;
        const msg = err instanceof Error ? err.message : "Impossibile avviare il backtest ensemble.";
        setEnsemble({ status: "error", error: msg });
      });
  };

  const handleRun = () => {
    if (strategy === "ensemble") runEnsemble();
    else runSync();
  };

  const isEnsemble = strategy === "ensemble";
  const ensembleBusy = ensemble.status === "starting" || ensemble.status === "running";
  const syncBusy = syncState.status === "loading";
  const runDisabled = isEnsemble ? ensembleBusy : syncBusy;

  const status: "live" | "error" | "loading" | "soon" = isEnsemble
    ? ensemble.status === "done"
      ? "live"
      : ensemble.status === "error"
        ? "error"
        : ensembleBusy
          ? "loading"
          : "soon"
    : syncState.status === "success"
      ? "live"
      : syncState.status === "error"
        ? "error"
        : syncState.status === "loading"
          ? "loading"
          : "soon";

  return (
    <section>
      <SectionHeader
        step="Stadio 3"
        title="Backtest"
        subtitle="Walk-forward OUT-OF-SAMPLE: la strategia viene addestrata su una finestra e valutata sulla finestra successiva mai vista. Confronto contro baseline 1/N. Tutti i numeri arrivano dal motore."
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
          {isEnsemble && (
            <>
              <Segmented
                label="Profilo"
                value={profile}
                options={PROFILES}
                onChange={setProfile}
                render={(p) => PROFILE_LABEL[p]}
              />
              <Segmented
                label="Valuta"
                value={currency}
                options={CURRENCIES}
                onChange={setCurrency}
              />
            </>
          )}
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
            onClick={handleRun}
            disabled={runDisabled}
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-60"
          >
            {runDisabled ? "Esecuzione in corso…" : "Esegui backtest"}
          </button>
        </div>
        {isEnsemble && (
          <p className="mt-3 text-xs text-muted-foreground">
            L'ensemble viene eseguito sull'intero universo (senza la security selection
            per regime); è la validazione out-of-sample dei modelli di ottimizzazione.
          </p>
        )}
      </Card>

      {isEnsemble ? (
        <EnsembleView state={ensemble} onRetry={runEnsemble} />
      ) : syncState.status === "idle" ? (
        <Card className="p-6 text-sm text-muted-foreground">
          Imposta i parametri e premi <span className="font-semibold">Esegui backtest</span>{" "}
          per lanciare il walk-forward out-of-sample sul motore.
        </Card>
      ) : (
        <AsyncView
          state={syncState}
          onRetry={runSync}
          loadingLabel="Esecuzione walk-forward in corso sul motore…"
        >
          {(data) => <Content data={data} strategyLabel={labelFor(syncStrategy)} />}
        </AsyncView>
      )}
    </section>
  );
}

function labelFor(id: StrategyId): string {
  return STRATEGIES.find((s) => s.id === id)?.label ?? id;
}

function EnsembleView({
  state,
  onRetry,
}: {
  state: EnsembleState;
  onRetry: () => void;
}) {
  if (state.status === "idle") {
    return (
      <Card className="p-6 text-sm text-muted-foreground">
        Imposta i parametri e premi <span className="font-semibold">Esegui backtest</span>{" "}
        per avviare il job ensemble sul motore.
      </Card>
    );
  }
  if (state.status === "starting") {
    return (
      <Card className="p-6">
        <ProgressBar done={0} total={0} />
        <p className="mt-3 text-sm text-muted-foreground">
          Avvio del job ensemble sul motore…
        </p>
      </Card>
    );
  }
  if (state.status === "running") {
    return (
      <Card className="p-6">
        <ProgressBar done={state.progressDone} total={state.progressTotal} />
        <div className="mt-3 flex flex-wrap items-baseline justify-between gap-2 text-sm">
          <p className="text-muted-foreground">
            Backtest ensemble in corso… (può richiedere alcuni minuti)
          </p>
          <p className="font-mono text-xs tabular-nums text-muted-foreground">
            fold {state.progressDone}/{state.progressTotal || "?"}
          </p>
        </div>
      </Card>
    );
  }
  if (state.status === "error") {
    return (
      <Card className="p-6">
        <p className="text-sm text-destructive">{state.error}</p>
        <button
          type="button"
          onClick={onRetry}
          className="mt-3 rounded-md border border-border bg-card px-3 py-1.5 text-sm font-medium text-foreground hover:bg-secondary"
        >
          Riprova
        </button>
      </Card>
    );
  }
  // done
  return <Content data={state.data} strategyLabel="Ensemble (41 modelli)" />;
}

function ProgressBar({ done, total }: { done: number; total: number }) {
  const pct = total > 0 ? Math.min(100, Math.max(0, (done / total) * 100)) : 0;
  const indeterminate = total <= 0;
  return (
    <div
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={total > 0 ? total : undefined}
      aria-valuenow={total > 0 ? done : undefined}
      className="h-2 w-full overflow-hidden rounded-full bg-secondary"
    >
      <div
        className={
          "h-full bg-primary transition-all " +
          (indeterminate ? "w-1/3 animate-pulse" : "")
        }
        style={indeterminate ? undefined : { width: `${pct}%` }}
      />
    </div>
  );
}

function Content({ data, strategyLabel }: { data: BacktestResponse; strategyLabel: string }) {
  const stratColor = chartColor(0);
  const baseColor = BRAND.slate;

  const equity = useMemo(() => data.equity_curve ?? [], [data.equity_curve]);
  const hasBaseline = equity.some((p) => p.baseline != null);

  return (
    <div className="space-y-5">
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
                  name={strategyLabel}
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
