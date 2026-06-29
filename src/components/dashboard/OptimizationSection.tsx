// Stage 2 — Ottimizzazione. The most inspectable section: GET /optimization/models.
// Shows the final allocation and the active models with their proposed weights and
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

import { AllocationDonut } from "./charts";
import { fmtNum, fmtPct, statusOf } from "./format";
import { AsyncView, Card, Eyebrow, LiteNote, SectionHeader, WeightBar } from "./ui";

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
        subtitle="Apri il cofano: il motore dichiara quanti modelli sono attivi, li valuta out-of-sample (walk-forward) e media i migliori. Qui vedi ogni modello, il suo score e i pesi che propone."
        status={statusOf(state)}
      />
      <AsyncView
        state={state}
        onRetry={run}
        loadingLabel="Esecuzione modelli attivi (walk-forward): attendo il conteggio reale dal motore…"
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
      {data.lite && <LiteNote nModels={data.n_models_active} />}
      {/* final allocation + how it is built */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="p-4">
          <Eyebrow className="mb-3">Allocazione finale (media dei {data.n_best} scelti)</Eyebrow>
          <AllocationDonut
            data={Object.entries(data.asset_class_weights).map(([name, value]) => ({
              name,
              value,
            }))}
          />
          <div className="mt-4 border-t border-border pt-3">
            <Eyebrow className="mb-2">Per strumento</Eyebrow>
            <div className="space-y-2">
              {Object.entries(data.final_weights)
                .sort((a, b) => b[1] - a[1])
                .map(([t, w]) => (
                  <WeightBar key={t} label={t} value={w} />
                ))}
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <Eyebrow className="mb-3">I {data.n_best} modelli scelti</Eyebrow>
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

      {/* active models table */}
      <ModelsTable models={data.models} tickers={tickers} />
    </div>
  );
}

type SortKey = "name" | "family" | "score";

function ModelsTable({ models, tickers }: { models: OptModelRow[]; tickers: string[] }) {
  const [onlySelected, setOnlySelected] = useState(false);
  const [sort, setSort] = useState<{ key: SortKey; dir: 1 | -1 }>({ key: "score", dir: -1 });

  function toggle(key: SortKey) {
    setSort((s) =>
      s.key === key ? { key, dir: (s.dir * -1) as 1 | -1 } : { key, dir: key === "score" ? -1 : 1 },
    );
  }

  const rows = useMemo(() => {
    const base = onlySelected ? models.filter((m) => m.selected) : models.slice();
    base.sort((a, b) => {
      if (sort.key === "score") return ((a.score ?? -Infinity) - (b.score ?? -Infinity)) * sort.dir;
      return String(a[sort.key]).localeCompare(String(b[sort.key])) * sort.dir;
    });
    return base;
  }, [models, onlySelected, sort]);

  const arrow = (key: SortKey) => (sort.key === key ? (sort.dir === 1 ? " ↑" : " ↓") : "");

  return (
    <Card className="overflow-hidden">
      <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
        <Eyebrow>{models.length} modelli — pesi proposti & score</Eyebrow>
        <label className="flex items-center gap-2 text-xs text-muted-foreground">
          <input
            type="checkbox"
            checked={onlySelected}
            onChange={(e) => setOnlySelected(e.target.checked)}
            className="h-3.5 w-3.5 accent-[var(--primary)]"
          />
          solo i {Math.min(4, models.filter((m) => m.selected).length)} scelti
        </label>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-border bg-secondary/60 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              <SortTh label={`Modello${arrow("name")}`} onClick={() => toggle("name")} />
              <SortTh label={`Famiglia${arrow("family")}`} onClick={() => toggle("family")} />
              <SortTh
                label={`Score${arrow("score")}`}
                onClick={() => toggle("score")}
                align="right"
              />
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
                  (m.selected
                    ? "bg-primary/5 ring-1 ring-inset ring-primary/15"
                    : i % 2 === 1
                      ? "bg-secondary/30"
                      : "")
                }
              >
                <td className="px-3 py-1.5 text-sm font-medium text-foreground">
                  {m.selected && <span className="mr-1 text-primary">★</span>}
                  {m.name}
                </td>
                <td className="px-3 py-1.5 text-xs text-muted-foreground">
                  {FAMILY_LABEL[m.family]}
                </td>
                <td
                  className={
                    "px-3 py-1.5 text-right font-mono text-sm tabular-nums " +
                    (m.selected ? "font-semibold text-primary" : "text-foreground")
                  }
                >
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

function SortTh({
  label,
  onClick,
  align = "left",
}: {
  label: string;
  onClick: () => void;
  align?: "left" | "right";
}) {
  return (
    <th className={"px-3 py-2 " + (align === "right" ? "text-right" : "text-left")}>
      <button
        type="button"
        onClick={onClick}
        className="uppercase tracking-wide hover:text-primary"
      >
        {label}
      </button>
    </th>
  );
}
