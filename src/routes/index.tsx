import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  getRiskPanelData,
  type Currency,
  type RegimeIndicator,
  type RiskPanelData,
  type RiskProfile,
  type SummaryStats,
} from "@/lib/risk-data";
import { loadLiveRiskPanel } from "@/lib/risk-api";

type DataSource = "live" | "mock";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Risk Panel — Allocation Engine" },
      {
        name: "description",
        content: "Internal risk dashboard for the quantitative asset allocation engine.",
      },
    ],
  }),
  component: RiskPanelPage,
});

const PROFILES: RiskProfile[] = ["Moderate", "Balanced", "Aggressive"];
const CURRENCIES: Currency[] = ["EUR", "USD"];

function RiskPanelPage() {
  const [profile, setProfile] = useState<RiskProfile>("Balanced");
  const [currency, setCurrency] = useState<Currency>("EUR");

  // SSR + first paint use the mock so the page always renders; the client then
  // tries the live API and upgrades the data in place (falling back on error).
  const [data, setData] = useState<RiskPanelData>(() => getRiskPanelData(profile, currency));
  const [source, setSource] = useState<DataSource>("mock");

  useEffect(() => {
    let cancelled = false;
    setData(getRiskPanelData(profile, currency)); // immediate, while the API loads
    loadLiveRiskPanel(profile, currency)
      .then((live) => {
        if (!cancelled) {
          setData(live);
          setSource("live");
        }
      })
      .catch(() => {
        if (!cancelled) setSource("mock");
      });
    return () => {
      cancelled = true;
    };
  }, [profile, currency]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <TopBar />
      <Header
        portfolioName={data.portfolioName}
        asOf={data.asOf}
        profile={profile}
        currency={currency}
        source={source}
        onProfile={setProfile}
        onCurrency={setCurrency}
      />

      <main className="mx-auto max-w-[1400px] px-6 pb-16">
        <SummaryCards summary={data.summary} currency={currency} />
        <RegimeStrip regimes={data.regimes} />

        <section className="mt-6">
          <SectionTitle
            title="Risk metrics"
            subtitle="Computed on daily returns over the trailing 36 months."
          />
          <div className="overflow-hidden rounded-md border border-border bg-card">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-border bg-secondary/60 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  <th className="w-[55%] px-4 py-2.5">Metric</th>
                  <th className="px-4 py-2.5 text-right">Value</th>
                  <th className="px-4 py-2.5 text-right">Return / Risk</th>
                </tr>
              </thead>
              <tbody>
                {data.sections.map((section) => (
                  <RiskSection key={section.title} title={section.title} rows={section.rows} />
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <p className="mt-6 text-xs text-muted-foreground">
          {source === "live"
            ? "Source: internal allocation engine (live API). Figures computed by aa_engine.risk on sample data."
            : "Source: internal allocation engine. Live API unavailable — showing mock data for interface preview."}
        </p>
      </main>
    </div>
  );
}

function TopBar() {
  return (
    <div className="border-b border-border bg-primary text-primary-foreground">
      <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-2.5">
        <div className="flex items-center gap-3">
          <div className="h-5 w-5 rounded-sm bg-accent" aria-hidden />
          <span className="text-sm font-semibold tracking-wide">ALLOCATION ENGINE</span>
          <span className="text-xs text-primary-foreground/60">v2.4.1</span>
        </div>
        <nav className="flex items-center gap-6 text-sm">
          <span className="font-medium text-primary-foreground">Risk Panel</span>
          <span className="text-primary-foreground/50">Portfolio Optimization</span>
          <span className="text-primary-foreground/50">Backtesting</span>
        </nav>
        <div className="text-xs text-primary-foreground/70">
          desk: <span className="font-mono">multi-asset</span>
        </div>
      </div>
    </div>
  );
}

interface HeaderProps {
  portfolioName: string;
  asOf: string;
  profile: RiskProfile;
  currency: Currency;
  source: DataSource;
  onProfile: (p: RiskProfile) => void;
  onCurrency: (c: Currency) => void;
}

function Header({
  portfolioName,
  asOf,
  profile,
  currency,
  source,
  onProfile,
  onCurrency,
}: HeaderProps) {
  return (
    <div className="border-b border-border bg-card">
      <div className="mx-auto flex max-w-[1400px] flex-wrap items-end justify-between gap-6 px-6 py-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Portfolio
            <SourceBadge source={source} />
          </div>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-foreground">
            {portfolioName}
          </h1>
          <div className="mt-1 text-xs text-muted-foreground">
            As of {formatDate(asOf)} · Base currency <span className="font-mono">{currency}</span>
          </div>
        </div>

        <div className="flex items-end gap-6">
          <SegmentedControl<RiskProfile>
            label="Risk profile"
            value={profile}
            options={PROFILES}
            onChange={onProfile}
          />
          <SegmentedControl<Currency>
            label="Currency"
            value={currency}
            options={CURRENCIES}
            onChange={onCurrency}
          />
        </div>
      </div>
    </div>
  );
}

function SourceBadge({ source }: { source: DataSource }) {
  const live = source === "live";
  return (
    <span
      title={live ? "Live data from the aa_engine API" : "Live API unavailable — mock data"}
      className={
        "inline-flex items-center gap-1 rounded-sm px-1.5 py-0.5 text-[10px] font-semibold tracking-wide " +
        (live ? "bg-success/10 text-success" : "bg-muted text-muted-foreground")
      }
    >
      <span
        className={
          "inline-block h-1.5 w-1.5 rounded-full " +
          (live ? "bg-success" : "bg-muted-foreground/60")
        }
        aria-hidden
      />
      {live ? "LIVE" : "MOCK"}
    </span>
  );
}

interface SegmentedControlProps<T extends string> {
  label: string;
  value: T;
  options: readonly T[];
  onChange: (v: T) => void;
}

function SegmentedControl<T extends string>({
  label,
  value,
  options,
  onChange,
}: SegmentedControlProps<T>) {
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
          const active = opt === value;
          return (
            <button
              key={opt}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => onChange(opt)}
              className={
                "px-3.5 py-1.5 text-sm transition-colors border-r border-border last:border-r-0 " +
                (active
                  ? "bg-primary text-primary-foreground font-medium"
                  : "bg-card text-foreground hover:bg-secondary")
              }
            >
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function SummaryCards({ summary, currency }: { summary: SummaryStats; currency: Currency }) {
  const items = [
    {
      label: "Cumulative Return",
      value: formatPct(summary.cumulativeReturn),
      sub: `Since inception · ${currency}`,
      tone: summary.cumulativeReturn >= 0 ? "pos" : "neg",
    },
    {
      label: "Sharpe Ratio",
      value: summary.sharpeRatio.toFixed(2),
      sub: "Risk-free: 3M T-bill",
      tone: "neutral" as const,
    },
    {
      label: "Max Drawdown",
      value: formatPct(summary.maxDrawdown),
      sub: "Peak-to-trough, 36M",
      tone: "neg" as const,
    },
    {
      label: "Volatility (ann.)",
      value: formatPct(summary.volatility),
      sub: "Daily returns, annualized",
      tone: "neutral" as const,
    },
  ];

  return (
    <section className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((it) => (
        <div key={it.label} className="rounded-md border border-border bg-card p-4">
          <div className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
            {it.label}
          </div>
          <div
            className={
              "mt-1.5 font-mono text-2xl font-semibold tabular-nums " +
              (it.tone === "pos"
                ? "text-success"
                : it.tone === "neg"
                  ? "text-destructive"
                  : "text-foreground")
            }
          >
            {it.value}
          </div>
          <div className="mt-1 text-xs text-muted-foreground">{it.sub}</div>
        </div>
      ))}
    </section>
  );
}

function RegimeStrip({ regimes }: { regimes: RegimeIndicator[] }) {
  return (
    <section className="mt-4 rounded-md border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border px-4 py-2">
        <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          Market Regime
        </div>
        <div className="text-[11px] text-muted-foreground">
          Updated daily · trend-following overlay
        </div>
      </div>
      <div className="grid grid-cols-2 divide-y divide-border sm:grid-cols-3 sm:divide-y-0 lg:grid-cols-5 lg:divide-x">
        {regimes.map((r) => (
          <RegimeCell key={r.assetClass} regime={r} />
        ))}
      </div>
    </section>
  );
}

function RegimeCell({ regime }: { regime: RegimeIndicator }) {
  const bull = regime.status === "Bull";
  return (
    <div className="flex items-center justify-between gap-3 px-4 py-3">
      <div>
        <div className="text-sm font-medium text-foreground">{regime.assetClass}</div>
        <div className="text-[11px] text-muted-foreground">since {formatDate(regime.since)}</div>
      </div>
      <div
        className={
          "flex items-center gap-1.5 rounded-sm px-2 py-1 text-xs font-semibold " +
          (bull ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive")
        }
      >
        <span
          className={
            "inline-block h-1.5 w-1.5 rounded-full " + (bull ? "bg-success" : "bg-destructive")
          }
          aria-hidden
        />
        {regime.status}
      </div>
    </div>
  );
}

function SectionTitle({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-2 flex items-baseline justify-between">
      <h2 className="text-sm font-semibold uppercase tracking-wider text-foreground">{title}</h2>
      {subtitle && <span className="text-xs text-muted-foreground">{subtitle}</span>}
    </div>
  );
}

function RiskSection({
  title,
  rows,
}: {
  title: string;
  rows: { name: string; value: string; returnRisk: string }[];
}) {
  return (
    <>
      <tr className="bg-secondary/30">
        <td
          colSpan={3}
          className="px-4 py-2 text-[11px] font-semibold uppercase tracking-wider text-primary"
        >
          {title}
        </td>
      </tr>
      {rows.map((row, i) => (
        <tr
          key={row.name}
          className={
            "border-t border-border hover:bg-secondary/40 " +
            (i % 2 === 1 ? "bg-background/40" : "")
          }
        >
          <td className="px-4 py-2 text-sm text-foreground">{row.name}</td>
          <td className="px-4 py-2 text-right font-mono text-sm tabular-nums text-foreground">
            {row.value}
          </td>
          <td className="px-4 py-2 text-right font-mono text-sm tabular-nums text-muted-foreground">
            {row.returnRisk}
          </td>
        </tr>
      ))}
    </>
  );
}

// ---- formatters ---------------------------------------------------

function formatPct(n: number) {
  const sign = n > 0 ? "+" : "";
  return `${sign}${(n * 100).toFixed(2)}%`;
}

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}
