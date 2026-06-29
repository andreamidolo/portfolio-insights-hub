// Stage out — Esegui / Report. The button that finally runs the real engine:
// POST /api/v1/allocation/run with profile + currency + (optional) as_of date.
// Renders the end-to-end report: executive summary, regimes, signals, allocation,
// risk panel and the 4 chosen models. This is where EUR/USD and the profiles
// finally DO something real.

import { useState } from "react";

import { api, type AllocationResponse, type Currency, type Profile } from "@/lib/api";
import { useAsync } from "@/lib/use-async";

import { AllocationDonut } from "./charts";
import { fmtNum, fmtPct } from "./format";
import {
  Card,
  ErrorBlock,
  Eyebrow,
  LiteNote,
  LoadingBlock,
  RegimeChips,
  SectionHeader,
  WeightBar,
} from "./ui";

export function RunReportSection({ profile, currency }: { profile: Profile; currency: Currency }) {
  const [asOf, setAsOf] = useState<string>("");
  const { state, run } = useAsync<AllocationResponse>(
    () => api.runAllocation(profile, currency, asOf || null),
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
        step="Output"
        title="Esegui / Report"
        subtitle="Premi Esegui per far girare il motore end-to-end (regime → segnali → selezione → ottimizzazione → rischio) con il profilo e la valuta scelti. Profilo, valuta e data cambiano davvero il risultato."
        status={status}
      />

      <Card className="mb-4 p-4">
        <div className="flex flex-wrap items-end gap-5">
          <Field label="Profilo">
            <span className="font-mono text-sm capitalize text-foreground">{profile}</span>
          </Field>
          <Field label="Valuta">
            <span className="font-mono text-sm text-foreground">{currency}</span>
          </Field>
          <Field label="Data (as of)">
            <input
              type="date"
              value={asOf}
              onChange={(e) => setAsOf(e.target.value)}
              className="rounded-md border border-border bg-card px-2.5 py-1.5 text-sm text-foreground"
            />
          </Field>
          <button
            type="button"
            onClick={run}
            disabled={state.status === "loading"}
            className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-60"
          >
            {state.status === "loading" ? "Esecuzione…" : "Esegui"}
          </button>
          <span className="text-xs text-muted-foreground">
            Profilo e valuta si cambiano dall'header. Il numero di modelli attivi viene dichiarato
            dal motore nella risposta.
          </span>
        </div>
      </Card>

      {state.status === "idle" && (
        <Card className="p-8 text-center text-sm text-muted-foreground">
          Nessuna esecuzione ancora. Premi <span className="font-semibold">Esegui</span> per
          generare il report dal motore reale.
        </Card>
      )}
      {state.status === "loading" && (
        <LoadingBlock label="Esecuzione pipeline: attendo il numero di modelli attivi dal motore…" />
      )}
      {state.status === "error" && <ErrorBlock message={state.error} onRetry={run} />}
      {state.status === "success" && <Report data={state.data} />}
    </section>
  );
}

function Report({ data }: { data: AllocationResponse }) {
  return (
    <div className="space-y-5">
      {data.lite && <LiteNote nModels={data.n_models_active} />}
      {/* executive summary */}
      <Card className="p-4">
        <div className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          Executive summary
        </div>
        <p className="text-sm text-foreground">
          Profilo <span className="font-semibold capitalize">{data.profile}</span> · {data.currency}{" "}
          · as of {data.as_of}. {data.n_models_active} modelli attivi, {data.selected_models.length}{" "}
          scelti: {data.selected_models.join(", ")}.
        </p>
        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          <Metric label="StdDev" value={fmtPct(data.risk.std_dev)} />
          <Metric label="VaR 95%" value={fmtPct(data.risk.var_95)} />
          <Metric label="CVaR 95%" value={fmtPct(data.risk.cvar_95)} />
          <Metric label="Max DD" value={fmtPct(data.risk.max_drawdown)} />
          <Metric label="Calmar" value={fmtNum(data.risk.calmar)} />
          <Metric label="Sharpe" value={fmtNum(data.risk.sharpe)} />
        </div>
      </Card>

      <RegimeChips regimes={data.regimes} />

      {/* allocation */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="p-4">
          <Eyebrow className="mb-3">Allocazione per asset class</Eyebrow>
          <AllocationDonut
            data={Object.entries(data.asset_class_weights).map(([name, value]) => ({
              name,
              value,
            }))}
          />
          <div className="mt-3 border-t border-border pt-3 text-xs text-muted-foreground">
            Selezionati: {data.selected.join(", ") || "—"}
            {data.discarded.length > 0 && <> · Scartati: {data.discarded.join(", ")}</>}
          </div>
        </Card>
        <Card className="p-4">
          <Eyebrow className="mb-3">Allocazione per strumento</Eyebrow>
          <div className="space-y-2">
            {Object.entries(data.final_weights)
              .sort((a, b) => b[1] - a[1])
              .map(([t, w]) => (
                <WeightBar key={t} label={t} value={w} />
              ))}
          </div>
        </Card>
      </div>

      {data.benchmark && <BenchmarkCompare risk={data.risk} bm={data.benchmark} />}

      {/* signals recap */}
      <Card className="overflow-hidden">
        <div className="border-b border-border px-4 py-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          Segnali (SUMMARY per strumento)
        </div>
        <table className="w-full border-collapse text-sm">
          <tbody>
            {data.signals.map((s, i) => (
              <tr
                key={s.ticker}
                className={"border-t border-border " + (i % 2 === 1 ? "bg-background/40" : "")}
              >
                <td className="px-4 py-1.5 font-mono text-sm text-foreground">{s.ticker}</td>
                <td className="px-4 py-1.5 text-sm text-muted-foreground">{s.asset_class}</td>
                <td className="px-4 py-1.5 text-right font-mono text-xs tabular-nums">
                  {s.summary.direction > 0 ? "▲" : s.summary.direction < 0 ? "▼" : "–"}{" "}
                  {(s.summary.probability * 100).toFixed(0)}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

function BenchmarkCompare({
  risk,
  bm,
}: {
  risk: Record<string, number>;
  bm: NonNullable<AllocationResponse["benchmark"]>;
}) {
  const rows: { k: string; label: string; ratio?: boolean }[] = [
    { k: "std_dev", label: "Volatilità (StdDev)" },
    { k: "cvar_95", label: "CVaR 95%" },
    { k: "max_drawdown", label: "Max Drawdown" },
    { k: "calmar", label: "Calmar", ratio: true },
    { k: "sharpe", label: "Sharpe", ratio: true },
  ];
  return (
    <Card className="overflow-hidden">
      <div className="flex items-center justify-between border-b border-border px-4 py-2">
        <Eyebrow>Confronto col benchmark — {bm.label}</Eyebrow>
        {bm.placeholder && (
          <span className="text-[10px] text-accent">placeholder — valori da sostituire (LFG)</span>
        )}
      </div>
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b border-border bg-secondary/60 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            <th className="px-4 py-2">Metrica</th>
            <th className="px-4 py-2 text-right">Allocazione</th>
            <th className="px-4 py-2 text-right">Benchmark</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => {
            const a = risk[r.k];
            const b = bm.risk[r.k];
            const fmt = (x: number) => (r.ratio ? fmtNum(x) : fmtPct(x));
            return (
              <tr
                key={r.k}
                className={"border-t border-border " + (i % 2 === 1 ? "bg-secondary/30" : "")}
              >
                <td className="px-4 py-1.5 text-sm text-foreground">{r.label}</td>
                <td className="px-4 py-1.5 text-right font-mono text-sm tabular-nums text-foreground">
                  {fmt(a)}
                </td>
                <td className="px-4 py-1.5 text-right font-mono text-sm tabular-nums text-muted-foreground">
                  {b == null ? "—" : fmt(b)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </Card>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-1 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </div>
      {children}
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-sm bg-secondary/40 px-3 py-2">
      <div className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </div>
      <div className="mt-0.5 font-mono text-sm font-semibold tabular-nums text-foreground">
        {value}
      </div>
    </div>
  );
}
