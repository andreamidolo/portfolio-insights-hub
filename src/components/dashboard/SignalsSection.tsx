// Stage 1 — Segnali. AlgoEagle-style table from GET /api/v1/signals.
// Trend | Oscillator | Alpha Crash | SUMMARY (direction + probability), plus the
// proxy regime per asset class and the honest "SVM disabled" notice.

import { api, type SignalRow, type SignalsResponse } from "@/lib/api";
import { useAsync } from "@/lib/use-async";

import { statusOf } from "./format";
import { AsyncView, Card, DirectionPill, RegimeChips, SectionHeader } from "./ui";

export function SignalsSection() {
  const { state, run } = useAsync<SignalsResponse>(() => api.signals(), []);
  return (
    <section>
      <SectionHeader
        step="Stadio 1"
        title="Segnali"
        subtitle="Scanner tecnico per strumento — Trend, Oscillatori e Alpha Crash combinati nel SUMMARY, modulati dal regime. Le views BL nascono da qui."
        status={statusOf(state)}
      />
      <AsyncView state={state} onRetry={run} loadingLabel="Computing signals…">
        {(data) => <SignalsBody data={data} />}
      </AsyncView>
    </section>
  );
}

function SignalsBody({ data }: { data: SignalsResponse }) {
  return (
    <div className="space-y-4">
      <RegimeChips regimes={data.regimes} />

      {!data.svm_enabled && (
        <Card className="border-accent/30 bg-accent/5 p-3 text-sm text-foreground">
          <span className="font-semibold">A.I. (SVM) disattivato.</span>{" "}
          <span className="text-muted-foreground">{data.svm_note}</span>
        </Card>
      )}

      <Card className="overflow-hidden">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-border bg-secondary/60 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              <th className="px-4 py-2.5">Strumento</th>
              <th className="px-4 py-2.5">Asset class</th>
              <th className="px-4 py-2.5 text-center">Trend</th>
              <th className="px-4 py-2.5 text-center">Oscillator</th>
              <th className="px-4 py-2.5 text-center">Alpha Crash</th>
              <th className="px-4 py-2.5 text-center">SUMMARY</th>
              <th className="px-4 py-2.5 text-center">Sel.</th>
            </tr>
          </thead>
          <tbody>
            {data.signals.map((row, i) => (
              <SignalRowView
                key={row.ticker}
                row={row}
                selected={data.selected.includes(row.ticker)}
                stripe={i % 2 === 1}
              />
            ))}
          </tbody>
        </table>
      </Card>
      <p className="text-xs text-muted-foreground">
        Direzione ▲ rialzista · ▼ ribassista · – neutro; la percentuale è la probabilità del
        segnale. SUMMARY = combinazione pesata modulata dal regime.
      </p>
    </div>
  );
}

function SignalRowView({
  row,
  selected,
  stripe,
}: {
  row: SignalRow;
  selected: boolean;
  stripe: boolean;
}) {
  return (
    <tr className={"border-t border-border " + (stripe ? "bg-background/40" : "")}>
      <td className="px-4 py-2 font-mono text-sm font-medium text-foreground">{row.ticker}</td>
      <td className="px-4 py-2 text-sm text-muted-foreground">{row.asset_class}</td>
      <td className="px-4 py-2 text-center">
        <DirectionPill direction={row.trend.direction} probability={row.trend.probability} />
      </td>
      <td className="px-4 py-2 text-center">
        <DirectionPill
          direction={row.oscillator.direction}
          probability={row.oscillator.probability}
        />
      </td>
      <td className="px-4 py-2 text-center">
        <DirectionPill
          direction={row.alpha_crash.direction}
          probability={row.alpha_crash.probability}
        />
      </td>
      <td className="px-4 py-2 text-center">
        <DirectionPill direction={row.summary.direction} probability={row.summary.probability} />
      </td>
      <td className="px-4 py-2 text-center text-xs">
        {selected ? (
          <span className="text-success" title="Selezionato per l'ottimizzazione">
            ✓
          </span>
        ) : (
          <span className="text-muted-foreground/50" title="Scartato in selezione">
            ·
          </span>
        )}
      </td>
    </tr>
  );
}
