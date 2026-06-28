// Stage 4 — Rischio. The risk panel wired to the real engine: /risk/panel (the 21
// metrics on 3 families), /regimes (market regime per asset class), and
// /risk/contributions (who carries the risk). Replaces the old Lovable mocks.

import {
  api,
  type ContributionsResponse,
  type Currency,
  type Profile,
  type RegimesResponse,
  type RiskFamily,
  type RiskMetric,
  type RiskPanelResponse,
} from "@/lib/api";
import { useAsync } from "@/lib/use-async";

import { fmtNum, fmtPct, statusOf } from "./format";
import { AsyncView, Card, RegimeChips, SectionHeader, WeightBar } from "./ui";

const FAMILY_TITLE: Record<RiskFamily, string> = {
  return_based: "Return-based",
  tail: "Tail risk",
  drawdown_based: "Drawdown-based",
};

const DIMENSIONLESS = new Set(["SKEW", "KT"]);

export function RiskSection({ profile, currency }: { profile: Profile; currency: Currency }) {
  const panel = useAsync<RiskPanelResponse>(
    () => api.riskPanel(profile, currency),
    [profile, currency],
  );
  const regimes = useAsync<RegimesResponse>(() => api.regimes(), []);
  const contrib = useAsync<ContributionsResponse>(
    () => api.contributions(profile, currency, "MV"),
    [profile, currency],
  );

  return (
    <section>
      <SectionHeader
        step="Stadio 4"
        title="Rischio"
        subtitle="Pannello completo dal motore: le metriche su 3 famiglie (return-based, tail, drawdown), il regime per asset class e le contribuzioni di rischio per strumento."
        status={statusOf(panel.state)}
      />

      <div className="space-y-4">
        <AsyncView state={regimes.state} onRetry={regimes.run} loadingLabel="Loading regimes…">
          {(data) => (
            <RegimeChips
              regimes={Object.fromEntries(data.regimes.map((r) => [r.asset_class, r.regime]))}
            />
          )}
        </AsyncView>

        <AsyncView state={panel.state} onRetry={panel.run} loadingLabel="Computing risk panel…">
          {(data) => <RiskPanelBody data={data} />}
        </AsyncView>

        <div>
          <div className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Contribuzioni di rischio (MV)
          </div>
          <AsyncView
            state={contrib.state}
            onRetry={contrib.run}
            loadingLabel="Computing contributions…"
          >
            {(data) => <ContributionsBody data={data} />}
          </AsyncView>
        </div>
      </div>
    </section>
  );
}

function RiskPanelBody({ data }: { data: RiskPanelResponse }) {
  const families: RiskFamily[] = ["return_based", "tail", "drawdown_based"];
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat label="Cumulative return" value={fmtPct(data.summary.cumulative_return, true)} />
        <Stat label="Sharpe" value={fmtNum(data.summary.sharpe)} />
        <Stat
          label="Max drawdown"
          value={fmtPct(-Math.abs(data.summary.max_drawdown))}
          tone="neg"
        />
        <Stat label="Volatility (ann.)" value={fmtPct(data.summary.volatility)} />
      </div>

      <Card className="overflow-hidden">
        <div className="flex items-center justify-between border-b border-border px-4 py-2 text-[11px] text-muted-foreground">
          <span className="font-semibold uppercase tracking-wider">
            Metriche di rischio · {data.metrics.length} su 3 famiglie
          </span>
          <span>
            α={data.alpha} · {data.regime_conditional ? "regime-conditional" : "full history"}
          </span>
        </div>
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-border bg-secondary/60 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              <th className="w-[55%] px-4 py-2">Metrica</th>
              <th className="px-4 py-2 text-right">Valore</th>
              <th className="px-4 py-2 text-right">Return / Risk</th>
            </tr>
          </thead>
          <tbody>
            {families.map((fam) => (
              <FamilyRows
                key={fam}
                title={FAMILY_TITLE[fam]}
                rows={data.metrics.filter((m) => m.family === fam)}
              />
            ))}
          </tbody>
        </table>
      </Card>
      <p className="text-xs text-muted-foreground">
        "≈" segnala una metrica da un'approssimazione documentata. Fonte: motore
        <span className="font-mono"> aa_engine.risk</span> sul backbone campione.
      </p>
    </div>
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

function ContributionsBody({ data }: { data: ContributionsResponse }) {
  const total = data.contributions.reduce((s, c) => s + Math.abs(c.risk_contribution), 0) || 1;
  return (
    <Card className="p-4">
      <div className="space-y-2">
        {data.contributions
          .slice()
          .sort((a, b) => b.risk_contribution - a.risk_contribution)
          .map((c) => (
            <WeightBar
              key={c.name}
              label={c.name}
              value={Math.abs(c.risk_contribution) / total}
              sub={`(w ${fmtPct(c.weight)})`}
              tone="muted"
            />
          ))}
      </div>
    </Card>
  );
}

function Stat({
  label,
  value,
  tone = "neutral",
}: {
  label: string;
  value: string;
  tone?: "neutral" | "neg";
}) {
  return (
    <Card className="p-4">
      <div className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </div>
      <div
        className={
          "mt-1.5 font-mono text-xl font-semibold tabular-nums " +
          (tone === "neg" ? "text-destructive" : "text-foreground")
        }
      >
        {value}
      </div>
    </Card>
  );
}
