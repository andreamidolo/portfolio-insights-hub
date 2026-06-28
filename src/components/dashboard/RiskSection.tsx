// Stage 4 — Rischio. The risk panel wired to the real engine: /risk/panel (the 21
// metrics on 3 families), /regimes (market regime per asset class), and
// /risk/contributions (who carries the risk). Replaces the old Lovable mocks.

import {
  api,
  type ContributionsResponse,
  type Currency,
  type Profile,
  type RegimesResponse,
  type RiskPanelResponse,
} from "@/lib/api";
import { useAsync } from "@/lib/use-async";

import { HBars } from "./charts";
import { fmtNum, fmtPct, statusOf } from "./format";
import { AsyncView, Card, Eyebrow, MetricsTable, RegimeChips, SectionHeader, StatCard } from "./ui";

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
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard
          label="Cumulative return"
          value={fmtPct(data.summary.cumulative_return, true)}
          tone={data.summary.cumulative_return >= 0 ? "pos" : "neg"}
        />
        <StatCard label="Sharpe" value={fmtNum(data.summary.sharpe)} tone="brand" />
        <StatCard
          label="Max drawdown"
          value={fmtPct(-Math.abs(data.summary.max_drawdown))}
          tone="neg"
        />
        <StatCard label="Volatility (ann.)" value={fmtPct(data.summary.volatility)} />
      </div>

      <div className="flex items-center justify-between text-[11px] text-muted-foreground">
        <span className="font-semibold uppercase tracking-wider">
          Metriche di rischio · {data.metrics.length} su 3 famiglie
        </span>
        <span>
          α={data.alpha} · {data.regime_conditional ? "regime-conditional" : "full history"}
        </span>
      </div>
      <MetricsTable metrics={data.metrics} />
      <p className="text-xs text-muted-foreground">
        "≈" segnala una metrica da un'approssimazione documentata. Fonte: motore
        <span className="font-mono"> aa_engine.risk</span> sul backbone campione.
      </p>
    </div>
  );
}

function ContributionsBody({ data }: { data: ContributionsResponse }) {
  const total = data.contributions.reduce((s, c) => s + Math.abs(c.risk_contribution), 0) || 1;
  const rows = data.contributions
    .slice()
    .sort((a, b) => b.risk_contribution - a.risk_contribution)
    .map((c) => ({ name: c.name, value: Math.abs(c.risk_contribution) / total }));
  return (
    <Card className="p-4">
      <Eyebrow className="mb-2">Chi porta il rischio (quota del totale)</Eyebrow>
      <HBars data={rows} />
    </Card>
  );
}
