// Stage 2 — Ottimizzazione. The most inspectable section: GET /optimization/models.
// Shows the final allocation, all ~41 models with their proposed weights and
// walk-forward score, the 4 chosen ones highlighted, and the 1/N baseline.

import { useMemo, useState } from "react";

import {
  api,
  type Currency,
  type ModelFamily,
  type OptimizationModelsResponse,
  type OptModelRow,
  type Profile,
} from "@/lib/api";
import { useAsync } from "@/lib/use-async";

import { fmtNum, fmtPct, statusOf } from "./format";
import { AsyncView, Card, SectionHeader, WeightBar } from "./ui";

const FAMILY_LABEL: Record<ModelFamily, string> = {
  classics: "Classics",
  bayesian: "Bayesian",
  ai: "AI / clustering",
  online: "Online PO",
  robust: "Robust",
  baseline: "Baseline 1/N",
  base: "Other",
};

export function OptimizationSection({
  profile,
  currency,
}: {
  profile: Profile;
  currency: Currency;
}) {
  const { state, run } = useAsync<OptimizationModelsResponse>(
    () => api.optimizationModels(profile, currency),
    [profile, currency],
  );
  return (
    <section>
      <SectionHeader
        step="Stadio 2"
        title="Ottimizzazione"
        subtitle="Apri il cofano: i 41 modelli girano in parallelo, vengono valutati out-of-sample (walk-forward) e i 4 migliori sono mediati. Qui vedi ogni modello, il suo score e i pesi che propone."
        status={statusOf(state)}
      />
      <AsyncView
        state={state}
        onRetry={run}
        loadingLabel="Running 41 models (walk-forward)… this takes a moment."
      >
        {(data) => <OptimizationBody data={data} />}
      </AsyncView>
    </section>
  );
}

function OptimizationBody({ data }: { data: OptimizationModelsResponse }) {
  const tickers = data.selected;
  return (
    <div className="space-y-6">
      {/* final allocation + how it is built */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="p-4">
          <div className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Allocazione finale (media dei {data.n_best} scelti)
          </div>
          <div className="space-y-2">
            {Object.entries(data.final_weights)
              .sort((a, b) => b[1] - a[1])
              .map(([t, w]) => (
                <WeightBar key={t} label={t} value={w} />
              ))}
          </div>
          <div className="mt-4 border-t border-border pt-3">
            <div className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Per asset class
            </div>
            <div className="space-y-2">
              {Object.entries(data.asset_class_weights)
                .sort((a, b) => b[1] - a[1])
                .map(([ac, w]) => (
                  <WeightBar key={ac} label={ac} value={w} tone="accent" />
                ))}
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            I {data.n_best} modelli scelti
          </div>
          <p className="mb-3 text-xs text-muted-foreground">
            Selezione per score <span className="font-mono">{data.scorer}</span> walk-forward
            (out-of-sample). Su {data.n_models_active} modelli attivi
            {Object.keys(data.excluded_models).length > 0
              ? `, ${Object.keys(data.excluded_models).length} esclusi.`
              : ", 0 esclusi."}
          </p>
          <ol className="space-y-1.5">
            {data.selected_models.map((name, i) => {
              const m = data.models.find((x) => x.name === name);
              return (
                <li
                  key={name}
                  className="flex items-center justify-between rounded-sm bg-secondary/50 px-3 py-1.5 text-sm"
                >
                  <span className="flex items-center gap-2">
                    <span className="font-mono text-xs text-muted-foreground">#{i + 1}</span>
                    <span className="font-medium text-foreground">{name}</span>
                    {m && (
                      <span className="text-[11px] text-muted-foreground">
                        {FAMILY_LABEL[m.family]}
                      </span>
                    )}
                  </span>
                  <span className="font-mono text-sm tabular-nums text-foreground">
                    {fmtNum(m?.score ?? null)}
                  </span>
                </li>
              );
            })}
          </ol>
          <div className="mt-4 flex items-center justify-between rounded-sm border border-dashed border-border px-3 py-1.5 text-sm">
            <span className="text-muted-foreground">Baseline 1/N — score {data.scorer}</span>
            <span className="font-mono tabular-nums text-foreground">
              {fmtNum(data.baseline_score)}
            </span>
          </div>
        </Card>
      </div>

      {/* the 41 models table */}
      <ModelsTable models={data.models} tickers={tickers} />
    </div>
  );
}

function ModelsTable({ models, tickers }: { models: OptModelRow[]; tickers: string[] }) {
  const [onlySelected, setOnlySelected] = useState(false);
  const rows = useMemo(
    () => (onlySelected ? models.filter((m) => m.selected) : models),
    [models, onlySelected],
  );
  return (
    <Card className="overflow-hidden">
      <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
        <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          {models.length} modelli — pesi proposti & score
        </div>
        <label className="flex items-center gap-2 text-xs text-muted-foreground">
          <input
            type="checkbox"
            checked={onlySelected}
            onChange={(e) => setOnlySelected(e.target.checked)}
            className="h-3.5 w-3.5 accent-[var(--primary)]"
          />
          solo i 4 scelti
        </label>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-border bg-secondary/60 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              <th className="px-3 py-2">Modello</th>
              <th className="px-3 py-2">Famiglia</th>
              <th className="px-3 py-2 text-right">Score</th>
              {tickers.map((t) => (
                <th key={t} className="px-3 py-2 text-right font-mono">
                  {t}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((m, i) => (
              <tr
                key={m.name}
                className={
                  "border-t border-border " +
                  (m.selected ? "bg-success/5" : i % 2 === 1 ? "bg-background/40" : "")
                }
              >
                <td className="px-3 py-1.5 text-sm font-medium text-foreground">
                  {m.selected && <span className="mr-1 text-success">★</span>}
                  {m.name}
                </td>
                <td className="px-3 py-1.5 text-xs text-muted-foreground">
                  {FAMILY_LABEL[m.family]}
                </td>
                <td className="px-3 py-1.5 text-right font-mono text-sm tabular-nums text-foreground">
                  {fmtNum(m.score)}
                </td>
                {tickers.map((t) => {
                  const w = m.weights[t] ?? 0;
                  return (
                    <td
                      key={t}
                      className={
                        "px-3 py-1.5 text-right font-mono text-xs tabular-nums " +
                        (w > 0 ? "text-foreground" : "text-muted-foreground/40")
                      }
                    >
                      {w > 0 ? fmtPct(w) : "·"}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
