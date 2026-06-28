// Shared presentational primitives for the dashboard sections.
//
// Honesty-first: a section is either LIVE (real data from the engine), an error
// state (engine unreachable / endpoint failed), or a declared "in arrivo"
// placeholder. There is no fourth "looks-real-but-fake" state by construction.

import type { ReactNode } from "react";

import type { RiskFamily, RiskMetric } from "@/lib/api";
import type { AsyncState } from "@/lib/use-async";

import { fmtNum, fmtPct, type SectionStatus } from "./format";

// ---- status badge --------------------------------------------------------

export function StatusBadge({ status }: { status: SectionStatus }) {
  const map: Record<SectionStatus, { label: string; cls: string; dot: string }> = {
    live: { label: "LIVE", cls: "bg-success/10 text-success", dot: "bg-success" },
    loading: {
      label: "LOADING",
      cls: "bg-muted text-muted-foreground",
      dot: "bg-muted-foreground/60 animate-pulse",
    },
    error: {
      label: "OFFLINE",
      cls: "bg-destructive/10 text-destructive",
      dot: "bg-destructive",
    },
    soon: { label: "IN ARRIVO", cls: "bg-accent/15 text-accent", dot: "bg-accent" },
  };
  const it = map[status];
  return (
    <span
      className={
        "inline-flex items-center gap-1 rounded-sm px-1.5 py-0.5 text-[10px] font-semibold tracking-wide " +
        it.cls
      }
    >
      <span className={"inline-block h-1.5 w-1.5 rounded-full " + it.dot} aria-hidden />
      {it.label}
    </span>
  );
}

// ---- section frame -------------------------------------------------------

export function SectionHeader({
  step,
  title,
  subtitle,
  status,
  actions,
}: {
  step: string;
  title: string;
  subtitle?: string;
  status: SectionStatus;
  actions?: ReactNode;
}) {
  return (
    <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
      <div>
        <div className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
          {step}
          <StatusBadge status={status} />
        </div>
        <h2 className="mt-1 text-xl font-semibold tracking-tight text-foreground">{title}</h2>
        {subtitle && <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={"rounded-md border border-border bg-card " + className}>{children}</div>;
}

// Editorial "eyebrow" label — uppercase, wide tracking (the brand signature).
export function Eyebrow({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={"ds-eyebrow text-muted-foreground " + className}>{children}</div>;
}

// Big-numeral statistic card for key metrics (design system StatCard).
export function StatCard({
  label,
  value,
  sub,
  tone = "neutral",
}: {
  label: string;
  value: string;
  sub?: string;
  tone?: "neutral" | "pos" | "neg" | "brand";
}) {
  const color =
    tone === "pos"
      ? "text-success"
      : tone === "neg"
        ? "text-destructive"
        : tone === "brand"
          ? "text-primary"
          : "text-foreground";
  return (
    <Card className="p-4">
      <Eyebrow>{label}</Eyebrow>
      <div className={"ds-numeral mt-1.5 text-3xl " + color}>{value}</div>
      {sub && <div className="mt-1 text-xs text-muted-foreground">{sub}</div>}
    </Card>
  );
}

// ---- async state wrappers ------------------------------------------------

export function LoadingBlock({ label = "Loading from engine…" }: { label?: string }) {
  return (
    <Card className="flex items-center gap-3 p-6 text-sm text-muted-foreground">
      <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-muted-foreground/60" />
      {label}
    </Card>
  );
}

export function ErrorBlock({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <Card className="border-destructive/40 p-6">
      <div className="text-sm font-semibold text-destructive">Engine endpoint unavailable</div>
      <p className="mt-1 font-mono text-xs break-words text-muted-foreground">{message}</p>
      <p className="mt-3 text-xs text-muted-foreground">
        No data is shown rather than fake numbers. Start the engine (
        <code className="font-mono">uvicorn aa_engine.api.main:app --port 8000</code>) and retry.
      </p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-3 inline-flex items-center rounded-md border border-border bg-card px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
        >
          Retry
        </button>
      )}
    </Card>
  );
}

// Renders children only on success; otherwise the loading/error/idle states.
export function AsyncView<T>({
  state,
  onRetry,
  loadingLabel,
  idle,
  children,
}: {
  state: AsyncState<T>;
  onRetry?: () => void;
  loadingLabel?: string;
  idle?: ReactNode;
  children: (data: T) => ReactNode;
}) {
  if (state.status === "loading") return <LoadingBlock label={loadingLabel} />;
  if (state.status === "error") return <ErrorBlock message={state.error} onRetry={onRetry} />;
  if (state.status === "success") return <>{children(state.data)}</>;
  return <>{idle ?? <LoadingBlock label={loadingLabel} />}</>;
}

// ---- declared placeholder (no fake data) ---------------------------------

export function PlaceholderNotice({ endpoint, bullets }: { endpoint: string; bullets: string[] }) {
  return (
    <Card className="border-dashed p-6">
      <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
        <StatusBadge status="soon" />
        Sezione in arrivo
      </div>
      <p className="mt-2 text-sm text-muted-foreground">
        Questa sezione attende l'endpoint{" "}
        <code className="rounded-sm bg-secondary px-1.5 py-0.5 font-mono text-xs">{endpoint}</code>,
        previsto in un'iterazione successiva. Nessun dato finto viene mostrato qui.
      </p>
      <ul className="mt-3 space-y-1.5 text-sm text-muted-foreground">
        {bullets.map((b) => (
          <li key={b} className="flex gap-2">
            <span className="text-accent" aria-hidden>
              →
            </span>
            {b}
          </li>
        ))}
      </ul>
    </Card>
  );
}

// ---- small data viz ------------------------------------------------------

// Horizontal weight bar (0..1) with label + value.
export function WeightBar({
  label,
  value,
  sub,
  tone = "primary",
}: {
  label: string;
  value: number;
  sub?: string;
  tone?: "primary" | "accent" | "muted";
}) {
  const pct = Math.max(0, Math.min(1, value)) * 100;
  const fill =
    tone === "accent" ? "bg-accent" : tone === "muted" ? "bg-muted-foreground/40" : "bg-primary";
  return (
    <div className="flex items-center gap-3">
      <div className="w-40 shrink-0 truncate text-sm text-foreground" title={label}>
        {label}
        {sub && <span className="ml-1 text-xs text-muted-foreground">{sub}</span>}
      </div>
      <div className="h-2 flex-1 overflow-hidden rounded-sm bg-secondary">
        <div className={"h-full " + fill} style={{ width: `${pct}%` }} />
      </div>
      <div className="w-16 shrink-0 text-right font-mono text-sm tabular-nums text-foreground">
        {fmtPct(value)}
      </div>
    </div>
  );
}

// Risk-panel metrics grouped into the 3 families (shared by Risk + mandate analysis).
const RISK_FAMILY_TITLE: Record<RiskFamily, string> = {
  return_based: "Return-based",
  tail: "Tail risk",
  drawdown_based: "Drawdown-based",
};
const DIMENSIONLESS = new Set(["SKEW", "KT"]);

export function MetricsTable({ metrics }: { metrics: RiskMetric[] }) {
  const families: RiskFamily[] = ["return_based", "tail", "drawdown_based"];
  return (
    <Card className="overflow-hidden">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b border-border bg-secondary/60 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            <th className="w-[55%] px-4 py-2">Metrica</th>
            <th className="px-4 py-2 text-right">Valore</th>
            <th className="px-4 py-2 text-right">Return / Risk</th>
          </tr>
        </thead>
        <tbody>
          {families.map((fam) => {
            const rows = metrics.filter((m) => m.family === fam);
            if (rows.length === 0) return null;
            return <FamilyRows key={fam} title={RISK_FAMILY_TITLE[fam]} rows={rows} />;
          })}
        </tbody>
      </table>
    </Card>
  );
}

function FamilyRows({ title, rows }: { title: string; rows: RiskMetric[] }) {
  return (
    <>
      <tr className="bg-secondary/30">
        <td
          colSpan={3}
          className="px-4 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-primary"
        >
          {title}
        </td>
      </tr>
      {rows.map((m, i) => (
        <tr
          key={m.code}
          className={"border-t border-border " + (i % 2 === 1 ? "bg-background/40" : "")}
        >
          <td className="px-4 py-1.5 text-sm text-foreground">
            {m.name}
            {m.approx && (
              <span className="ml-1 text-muted-foreground" title="Valore approssimato">
                ≈
              </span>
            )}
          </td>
          <td className="px-4 py-1.5 text-right font-mono text-sm tabular-nums text-foreground">
            {DIMENSIONLESS.has(m.code) ? fmtNum(m.value) : fmtPct(m.value)}
          </td>
          <td className="px-4 py-1.5 text-right font-mono text-sm tabular-nums text-muted-foreground">
            {fmtNum(m.ret_over_risk)}
          </td>
        </tr>
      ))}
    </>
  );
}

// Regime chips per asset class (shared by Signals + Risk + Report).
export function RegimeChips({ regimes }: { regimes: Record<string, "bull" | "bear"> }) {
  const entries = Object.entries(regimes);
  return (
    <Card className="p-3">
      <div className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
        Regime di mercato (proxy)
      </div>
      <div className="flex flex-wrap gap-2">
        {entries.map(([ac, reg]) => {
          const bull = reg === "bull";
          return (
            <span
              key={ac}
              className={
                "inline-flex items-center gap-1.5 rounded-sm px-2 py-1 text-xs font-medium " +
                (bull ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive")
              }
            >
              <span
                className={
                  "inline-block h-1.5 w-1.5 rounded-full " +
                  (bull ? "bg-success" : "bg-destructive")
                }
                aria-hidden
              />
              {ac}
              <span className="font-semibold">{bull ? "Bull" : "Bear"}</span>
            </span>
          );
        })}
      </div>
    </Card>
  );
}

export function DirectionPill({
  direction,
  probability,
}: {
  direction: number;
  probability: number;
}) {
  const map =
    direction > 0
      ? { txt: "▲", cls: "bg-success/10 text-success" }
      : direction < 0
        ? { txt: "▼", cls: "bg-destructive/10 text-destructive" }
        : { txt: "–", cls: "bg-muted text-muted-foreground" };
  return (
    <span
      className={
        "inline-flex items-center gap-1 rounded-sm px-1.5 py-0.5 font-mono text-xs tabular-nums " +
        map.cls
      }
    >
      {map.txt}
      <span className="text-[11px]">{(probability * 100).toFixed(0)}%</span>
    </span>
  );
}
