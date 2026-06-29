// Sezione "Modelli & Benchmark": mostra, per il profilo+valuta scelti, il
// portafoglio modello e il benchmark (target + bande) presi dal motore via
// GET /api/v1/profiles. Nessun numero inventato: stato di caricamento e di
// errore espliciti (coerente con la golden rule in src/lib/api.ts).

import { useMemo, useState } from "react";

import {
  api,
  type Currency,
  type ModelGrid,
  type Profile,
  type ProfileBand,
  type ProfilesConfigResponse,
} from "@/lib/api";
import { useAsync } from "@/lib/use-async";

import { DeltaBars, HBars } from "./charts";
import {
  AsyncView,
  Card,
  Eyebrow,
  SectionHeader,
} from "./ui";

const AC_LABEL_IT: Record<string, string> = {
  equity: "Azionario",
  fixed_income: "Obbligazionario",
  alternatives: "Alternativi",
  commodities: "Materie Prime",
  cash: "Liquidità",
};

const PROFILES: Profile[] = ["low", "moderate", "medium", "high"];
const CURRENCIES: Currency[] = ["USD", "EUR", "CHF"];

const fmtPct1 = (v: number) =>
  `${(v * 100).toLocaleString("it-IT", { minimumFractionDigits: 1, maximumFractionDigits: 1 })}%`;

function labelOf(ac: string): string {
  return AC_LABEL_IT[ac] ?? ac;
}

interface BenchmarkGrid {
  target: Record<string, number>;
  bands: Record<string, ProfileBand>;
}

function pickBenchmark(
  data: ProfilesConfigResponse,
  bmId: string,
  currency: Currency,
): { grid: BenchmarkGrid | null; label: string } {
  const bm = data.benchmarks?.[bmId] as Record<string, unknown> | undefined;
  if (!bm) return { grid: null, label: bmId };
  const label = typeof bm.label === "string" ? bm.label : bmId;
  const entry = bm[currency] as BenchmarkGrid | undefined;
  return { grid: entry ?? null, label };
}

export function ModelsBenchmarkSection({
  profile,
  currency,
}: {
  profile: Profile;
  currency: Currency;
}) {
  // Selettori locali (default richiesti: medium / USD) — pre-impostati a quelli
  // globali se l'utente è già su un profilo/valuta sensati.
  const [localProfile, setLocalProfile] = useState<Profile>(profile ?? "medium");
  const [localCurrency, setLocalCurrency] = useState<Currency>(currency ?? "USD");

  const { state, run } = useAsync<ProfilesConfigResponse>(() => api.profiles(), []);

  const status =
    state.status === "success"
      ? "live"
      : state.status === "error"
        ? "error"
        : "loading";

  return (
    <section>
      <SectionHeader
        step="Configurazione"
        title="Modelli & Benchmark"
        subtitle="Per ogni profilo di rischio e valuta: portafoglio modello, benchmark, confronto e indici di riferimento. Tutti i numeri arrivano dal motore (GET /profiles)."
        status={status}
      />

      <Card className="mb-4 p-4">
        <div className="flex flex-wrap items-end gap-5">
          <Segmented
            label="Profilo di rischio"
            value={localProfile}
            options={PROFILES}
            onChange={setLocalProfile}
            render={(p) => p.charAt(0).toUpperCase() + p.slice(1)}
          />
          <Segmented
            label="Valuta"
            value={localCurrency}
            options={CURRENCIES}
            onChange={setLocalCurrency}
          />
        </div>
      </Card>

      <AsyncView
        state={state}
        onRetry={run}
        loadingLabel="Carico configurazione profili dal motore…"
      >
        {(data) => (
          <Content data={data} profile={localProfile} currency={localCurrency} />
        )}
      </AsyncView>
    </section>
  );
}

function Content({
  data,
  profile,
  currency,
}: {
  data: ProfilesConfigResponse;
  profile: Profile;
  currency: Currency;
}) {
  const profileMeta = data.profiles.find((p) => p.id === profile);
  const model: ModelGrid | undefined = data.models?.[profile]?.[currency];
  const benchmark = profileMeta
    ? pickBenchmark(data, profileMeta.benchmark, currency)
    : { grid: null, label: "—" };

  const indexMap = data.index_map?.[currency] ?? {};
  const acs = data.asset_classes ?? [];

  const rows = useMemo(
    () =>
      acs.map((ac) => {
        const t = model?.target?.[ac] ?? 0;
        const b = model?.bands?.[ac] ?? { min: 0, max: 0 };
        const bt = benchmark.grid?.target?.[ac] ?? 0;
        return {
          ac,
          label: labelOf(ac),
          target: t,
          min: b.min,
          max: b.max,
          bmTarget: bt,
          delta: t - bt,
        };
      }),
    [acs, model, benchmark.grid],
  );

  if (!model) {
    return (
      <Card className="border-destructive/40 p-6">
        <div className="text-sm font-semibold text-destructive">
          Configurazione mancante
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          Il motore non ha restituito un modello per il profilo{" "}
          <span className="font-mono">{profile}</span> in valuta{" "}
          <span className="font-mono">{currency}</span>.
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-5">
      {/* Modello + Benchmark affiancati */}
      <div className="grid gap-4 lg:grid-cols-2">
        <AllocationCard
          title="Portafoglio Modello"
          subtitle={profileMeta?.label ?? profile}
          rows={rows.map((r) => ({ name: r.label, value: r.target }))}
        />
        <AllocationCard
          title="Benchmark"
          subtitle={benchmark.label}
          rows={
            benchmark.grid
              ? rows.map((r) => ({ name: r.label, value: r.bmTarget }))
              : []
          }
          empty="Benchmark non disponibile per questa combinazione."
        />
      </div>

      {/* Tabella dettaglio modello con bande */}
      <Card className="overflow-hidden">
        <div className="border-b border-border px-4 py-2">
          <Eyebrow>Modello — target e bande</Eyebrow>
        </div>
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-border bg-secondary/60 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              <th className="px-4 py-2">Asset class</th>
              <th className="px-4 py-2 text-right">Target %</th>
              <th className="px-4 py-2 text-right">Min %</th>
              <th className="px-4 py-2 text-right">Max %</th>
              <th className="px-4 py-2 text-right">Benchmark %</th>
              <th className="px-4 py-2 text-right">Δ vs Benchmark</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr
                key={r.ac}
                className={"border-t border-border " + (i % 2 === 1 ? "bg-background/40" : "")}
              >
                <td className="px-4 py-1.5 text-sm text-foreground">{r.label}</td>
                <td className="px-4 py-1.5 text-right font-mono text-sm tabular-nums text-foreground">
                  {fmtPct1(r.target)}
                </td>
                <td className="px-4 py-1.5 text-right font-mono text-sm tabular-nums text-muted-foreground">
                  {fmtPct1(r.min)}
                </td>
                <td className="px-4 py-1.5 text-right font-mono text-sm tabular-nums text-muted-foreground">
                  {fmtPct1(r.max)}
                </td>
                <td className="px-4 py-1.5 text-right font-mono text-sm tabular-nums text-muted-foreground">
                  {benchmark.grid ? fmtPct1(r.bmTarget) : "—"}
                </td>
                <td
                  className={
                    "px-4 py-1.5 text-right font-mono text-sm tabular-nums " +
                    (!benchmark.grid
                      ? "text-muted-foreground"
                      : r.delta > 0
                        ? "text-success"
                        : r.delta < 0
                          ? "text-destructive"
                          : "text-foreground")
                  }
                >
                  {benchmark.grid
                    ? `${r.delta >= 0 ? "+" : ""}${fmtPct1(r.delta)}`
                    : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      {/* Grafico divergente Modello vs Benchmark */}
      {benchmark.grid && (
        <Card className="p-4">
          <Eyebrow className="mb-3">Confronto Modello vs Benchmark (sovra/sottopeso)</Eyebrow>
          <DeltaBars data={rows.map((r) => ({ name: r.label, value: r.delta }))} />
        </Card>
      )}

      {/* Indici di riferimento */}
      <Card className="overflow-hidden">
        <div className="border-b border-border px-4 py-2">
          <Eyebrow>Indici di riferimento — {currency}</Eyebrow>
        </div>
        <table className="w-full border-collapse text-sm">
          <tbody>
            {acs.map((ac, i) => (
              <tr
                key={ac}
                className={"border-t border-border " + (i % 2 === 1 ? "bg-background/40" : "")}
              >
                <td className="px-4 py-1.5 text-sm text-foreground">{labelOf(ac)}</td>
                <td className="px-4 py-1.5 text-sm text-muted-foreground">
                  {indexMap[ac] ?? "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

function AllocationCard({
  title,
  subtitle,
  rows,
  empty,
}: {
  title: string;
  subtitle?: string;
  rows: { name: string; value: number }[];
  empty?: string;
}) {
  return (
    <Card className="p-4">
      <div className="mb-3 flex items-baseline justify-between gap-2">
        <Eyebrow>{title}</Eyebrow>
        {subtitle && (
          <span className="text-xs text-muted-foreground">{subtitle}</span>
        )}
      </div>
      {rows.length === 0 ? (
        <p className="py-8 text-center text-sm text-muted-foreground">
          {empty ?? "Nessun dato disponibile."}
        </p>
      ) : (
        <HBars data={rows} />
      )}
    </Card>
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
