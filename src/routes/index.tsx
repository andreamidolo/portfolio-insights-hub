import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { API_BASE_URL, type Currency, type DataSource, type Profile } from "@/lib/api";

import { ApiHealthPanel } from "@/components/dashboard/ApiHealthPanel";
import { DataImportSection } from "@/components/dashboard/DataImportSection";
import { BacktestSection } from "@/components/dashboard/PlaceholderSections";
import { OptimizationSection } from "@/components/dashboard/OptimizationSection";
import { RiskSection } from "@/components/dashboard/RiskSection";
import { RunReportSection } from "@/components/dashboard/RunReportSection";
import { SignalsSection } from "@/components/dashboard/SignalsSection";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Allocation Engine — Dashboard" },
      {
        name: "description",
        content:
          "Internal quantitative asset-allocation dashboard: inspect the engine stage by stage.",
      },
    ],
  }),
  component: DashboardPage,
});

// The six sections mirror the engine flow: input → 4 stages → output.
type SectionId = "data" | "signals" | "optimization" | "backtest" | "risk" | "run";

interface NavItem {
  id: SectionId;
  label: string;
  step: string;
  live: boolean; // wired to a real endpoint in this iteration?
}

const NAV: NavItem[] = [
  { id: "data", label: "Dati / Import", step: "Ingresso", live: false },
  { id: "signals", label: "Segnali", step: "Stadio 1", live: true },
  { id: "optimization", label: "Ottimizzazione", step: "Stadio 2", live: true },
  { id: "backtest", label: "Backtest", step: "Stadio 3", live: false },
  { id: "risk", label: "Rischio", step: "Stadio 4", live: true },
  { id: "run", label: "Esegui / Report", step: "Output", live: true },
];

const PROFILES: Profile[] = ["conservative", "moderate", "balanced", "aggressive"];
const CURRENCIES: Currency[] = ["EUR", "USD", "CHF"];

function DashboardPage() {
  const [section, setSection] = useState<SectionId>("run");
  const [profile, setProfile] = useState<Profile>("balanced");
  const [currency, setCurrency] = useState<Currency>("EUR");
  // Data source persists across the dashboard: "user" once prices are uploaded.
  const [dataSource, setDataSource] = useState<DataSource>("sample");

  return (
    <div className="min-h-screen bg-background text-foreground">
      <TopBar dataSource={dataSource} />
      <ControlBar
        profile={profile}
        currency={currency}
        onProfile={setProfile}
        onCurrency={setCurrency}
      />

      <MobileTabs active={section} onSelect={setSection} />

      <div className="mx-auto flex max-w-[1500px] gap-6 px-6 py-6">
        <Sidebar active={section} onSelect={setSection} />
        <main className="min-w-0 flex-1 space-y-6">
          <ApiHealthPanel />
          {section === "data" && (
            <DataImportSection
              profile={profile}
              currency={currency}
              onSourceChange={setDataSource}
            />
          )}
          {section === "signals" && <SignalsSection />}
          {section === "optimization" && (
            <OptimizationSection profile={profile} currency={currency} />
          )}
          {section === "backtest" && <BacktestSection />}
          {section === "risk" && <RiskSection profile={profile} currency={currency} />}
          {section === "run" && <RunReportSection profile={profile} currency={currency} />}
        </main>
      </div>
    </div>
  );
}

function TopBar({ dataSource }: { dataSource: DataSource }) {
  const user = dataSource === "user";
  return (
    <div className="border-b border-border bg-primary text-primary-foreground">
      <div className="mx-auto flex max-w-[1500px] items-center justify-between px-6 py-2.5">
        <div className="flex items-center gap-3">
          <div className="h-5 w-5 rounded-sm bg-accent" aria-hidden />
          <span className="text-sm font-semibold tracking-wide">ALLOCATION ENGINE</span>
          <span className="text-xs text-primary-foreground/60">dashboard</span>
        </div>
        <div className="flex items-center gap-4">
          <span
            className="rounded-sm bg-primary-foreground/10 px-2 py-0.5 text-[10px] font-semibold tracking-wide"
            title="Sorgente dati attiva in tutta la dashboard"
          >
            {user ? "DATI UTENTE" : "BACKBONE CAMPIONE"}
          </span>
          <span className="hidden text-xs text-primary-foreground/70 sm:block">
            API: <span className="font-mono">{API_BASE_URL}</span>
          </span>
        </div>
      </div>
    </div>
  );
}

function ControlBar({
  profile,
  currency,
  onProfile,
  onCurrency,
}: {
  profile: Profile;
  currency: Currency;
  onProfile: (p: Profile) => void;
  onCurrency: (c: Currency) => void;
}) {
  return (
    <div className="border-b border-border bg-card">
      <div className="mx-auto flex max-w-[1500px] flex-wrap items-end justify-between gap-6 px-6 py-4">
        <div>
          <div className="ds-eyebrow text-muted-foreground">Sala macchine</div>
          <h1 className="mt-0.5 text-2xl font-light tracking-tight text-foreground">
            Ispeziona il motore, stadio per stadio
          </h1>
        </div>
        <div className="flex items-end gap-6">
          <Segmented<Profile>
            label="Profilo"
            value={profile}
            options={PROFILES}
            onChange={onProfile}
            render={(p) => p.charAt(0).toUpperCase() + p.slice(1)}
          />
          <Segmented<Currency>
            label="Valuta"
            value={currency}
            options={CURRENCIES}
            onChange={onCurrency}
          />
        </div>
      </div>
    </div>
  );
}

function Sidebar({ active, onSelect }: { active: SectionId; onSelect: (id: SectionId) => void }) {
  return (
    <nav className="hidden w-56 shrink-0 md:block">
      <ul className="space-y-1">
        {NAV.map((item) => {
          const on = item.id === active;
          return (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => onSelect(item.id)}
                className={
                  "flex w-full items-center justify-between rounded-md border px-3 py-2.5 text-left transition-colors " +
                  (on
                    ? "border-border bg-card font-medium text-foreground shadow-sm"
                    : "border-transparent text-muted-foreground hover:bg-card/60 hover:text-foreground")
                }
              >
                <span>
                  <span className="block text-[10px] uppercase tracking-wider text-muted-foreground">
                    {item.step}
                  </span>
                  <span className="text-sm">{item.label}</span>
                </span>
                <span
                  className={
                    "ml-2 inline-block h-1.5 w-1.5 rounded-full " +
                    (item.live ? "bg-success" : "bg-accent")
                  }
                  title={item.live ? "Collegata al motore" : "In arrivo"}
                  aria-hidden
                />
              </button>
            </li>
          );
        })}
      </ul>
      <div className="mt-4 px-3 text-[11px] leading-relaxed text-muted-foreground">
        <span className="inline-flex items-center gap-1">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-success" /> dati reali
        </span>
        <br />
        <span className="inline-flex items-center gap-1">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent" /> in arrivo
        </span>
      </div>
    </nav>
  );
}

function MobileTabs({
  active,
  onSelect,
}: {
  active: SectionId;
  onSelect: (id: SectionId) => void;
}) {
  return (
    <div className="border-b border-border bg-card md:hidden">
      <div className="flex gap-1 overflow-x-auto px-4 py-2">
        {NAV.map((item) => {
          const on = item.id === active;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelect(item.id)}
              className={
                "flex shrink-0 items-center gap-1.5 rounded-md px-3 py-1.5 text-sm transition-colors " +
                (on
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-secondary")
              }
            >
              {item.label}
              <span
                className={
                  "inline-block h-1.5 w-1.5 rounded-full " +
                  (item.live ? "bg-success" : "bg-accent")
                }
                aria-hidden
              />
            </button>
          );
        })}
      </div>
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
