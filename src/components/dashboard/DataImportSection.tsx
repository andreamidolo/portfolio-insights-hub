// Stage in — Dati / Import (iteration 2). From placeholder to a working bench:
// upload market prices (the fuel) and a mandate (the object to analyze), then run
// the three analyses on the real mandate — risk radiography, signals, and an
// ATTUALE-vs-PROPOSTA re-optimization. Honest throughout: missing prices, weights
// off 100%, malformed CSV → clear messages, never invented numbers.

import { useEffect, useState } from "react";

import {
  ApiError,
  api,
  type Currency,
  type DataSource,
  type HoldingInput,
  type MandateResponse,
  type PortfolioAnalyzeResponse,
  type PortfolioReoptimizeResponse,
  type Profile,
  type UniverseResponse,
} from "@/lib/api";

import { fmtNum, fmtPct } from "./format";
import { FileDrop } from "./FileDrop";
import {
  Card,
  DirectionPill,
  ErrorBlock,
  LoadingBlock,
  MetricsTable,
  RegimeChips,
  SectionHeader,
  StatusBadge,
  WeightBar,
} from "./ui";

function errMsg(e: unknown): string {
  if (e instanceof ApiError) return e.message;
  if (e instanceof Error) return e.message;
  return "Errore inatteso";
}

export function DataImportSection({
  profile,
  currency,
  onSourceChange,
}: {
  profile: Profile;
  currency: Currency;
  onSourceChange?: (s: DataSource) => void;
}) {
  const [universe, setUniverse] = useState<UniverseResponse | null>(null);
  const [pricesBusy, setPricesBusy] = useState(false);
  const [pricesErr, setPricesErr] = useState<string | null>(null);

  const [mandate, setMandate] = useState<MandateResponse | null>(null);
  const [mandateBusy, setMandateBusy] = useState(false);
  const [mandateErr, setMandateErr] = useState<string | null>(null);

  // On mount, learn the current data source (user upload survives across sections).
  useEffect(() => {
    let cancelled = false;
    api
      .universe()
      .then((u) => {
        if (cancelled) return;
        if (u.source === "user") setUniverse(u);
        onSourceChange?.(u.source);
      })
      .catch(() => {
        /* engine offline — handled lazily on first upload */
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function onPrices(csv: string, filename: string) {
    setPricesBusy(true);
    setPricesErr(null);
    try {
      const u = await api.uploadPrices(csv, filename);
      setUniverse(u);
      onSourceChange?.(u.source);
    } catch (e) {
      setPricesErr(errMsg(e));
    } finally {
      setPricesBusy(false);
    }
  }

  async function onMandate(csv: string, filename: string) {
    setMandateBusy(true);
    setMandateErr(null);
    try {
      setMandate(await api.uploadMandate(csv, filename));
    } catch (e) {
      setMandateErr(errMsg(e));
    } finally {
      setMandateBusy(false);
    }
  }

  return (
    <section>
      <SectionHeader
        step="Ingresso"
        title="Dati / Import"
        subtitle="Due caricamenti distinti: i PREZZI storici (il carburante per i calcoli) e un MANDATO (strumenti + pesi, l'oggetto da analizzare). Per analizzare un mandato servono anche i prezzi dei suoi strumenti."
        status={universe?.source === "user" ? "live" : "soon"}
      />

      <div className="grid gap-4 lg:grid-cols-2">
        {/* prices upload */}
        <Card className="p-4">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-foreground">1 · Dati di mercato (prezzi)</h3>
            <DataSourceBadge source={universe?.source ?? "sample"} />
          </div>
          <FileDrop
            label="Carica un CSV di prezzi giornalieri"
            hint="Prima colonna = data, le altre = strumenti (prezzi)"
            busy={pricesBusy}
            onFile={onPrices}
          />
          {pricesErr && <InlineError message={pricesErr} />}
          {universe && universe.source === "user" && <UniverseView u={universe} />}
        </Card>

        {/* mandate upload */}
        <Card className="p-4">
          <h3 className="mb-3 text-sm font-semibold text-foreground">2 · Mandato (composizione)</h3>
          <FileDrop
            label="Carica un CSV di composizione"
            hint="Colonne: ticker (o isin) + peso"
            busy={mandateBusy}
            onFile={onMandate}
          />
          {mandateErr && <InlineError message={mandateErr} />}
          {mandate && <MandateView m={mandate} />}
        </Card>
      </div>

      {mandate && mandate.holdings.length > 0 && (
        <MandateAnalysis
          holdings={mandate.holdings.map((h) => ({ ticker: h.ticker, weight: h.weight }))}
          profile={profile}
          currency={currency}
        />
      )}

      <p className="mt-4 text-xs text-muted-foreground">
        Nota onesta: finché il regime è il proxy, i segnali sono in versione semplificata (utili per
        testare, non ancora la "ricetta" AlgoEagle). Lo store dei dati è in memoria e si azzera al
        riavvio del motore.
      </p>
    </section>
  );
}

function DataSourceBadge({ source }: { source: DataSource }) {
  const user = source === "user";
  return (
    <span
      className={
        "inline-flex items-center gap-1 rounded-sm px-1.5 py-0.5 text-[10px] font-semibold tracking-wide " +
        (user ? "bg-success/10 text-success" : "bg-muted text-muted-foreground")
      }
    >
      <span
        className={
          "inline-block h-1.5 w-1.5 rounded-full " +
          (user ? "bg-success" : "bg-muted-foreground/60")
        }
        aria-hidden
      />
      {user ? "DATI UTENTE" : "BACKBONE CAMPIONE"}
    </span>
  );
}

function InlineError({ message }: { message: string }) {
  return (
    <p className="mt-3 rounded-sm border border-destructive/40 bg-destructive/5 px-3 py-2 text-xs text-destructive">
      {message}
    </p>
  );
}

function UniverseView({ u }: { u: UniverseResponse }) {
  return (
    <div className="mt-4">
      <p className="text-xs text-muted-foreground">
        Caricati <span className="font-semibold text-foreground">{u.n_instruments}</span> strumenti
        · <span className="font-semibold text-foreground">{u.n_observations}</span> osservazioni ·{" "}
        {u.date_start} → {u.date_end}
        {u.filename ? ` · ${u.filename}` : ""}
      </p>
      {u.warnings.map((w) => (
        <p key={w} className="mt-1 text-xs text-amber-600 dark:text-amber-500">
          ⚠ {w}
        </p>
      ))}
      <div className="mt-3 max-h-56 overflow-y-auto rounded-sm border border-border">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="sticky top-0 border-b border-border bg-secondary/60 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              <th className="px-3 py-2">Strumento</th>
              <th className="px-3 py-2">Asset class</th>
              <th className="px-3 py-2 text-right">Oss.</th>
            </tr>
          </thead>
          <tbody>
            {u.instruments.map((it, i) => (
              <tr
                key={it.ticker}
                className={"border-t border-border " + (i % 2 === 1 ? "bg-background/40" : "")}
              >
                <td className="px-3 py-1.5 font-mono text-xs text-foreground">{it.ticker}</td>
                <td className="px-3 py-1.5 text-xs text-muted-foreground">
                  {it.asset_class}
                  {!it.known && (
                    <span className="ml-1 text-amber-600" title="Non in mappa campione">
                      ·
                    </span>
                  )}
                </td>
                <td className="px-3 py-1.5 text-right font-mono text-xs tabular-nums text-muted-foreground">
                  {it.n_observations}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function MandateView({ m }: { m: MandateResponse }) {
  const off = Math.abs(m.weight_sum - 1) > 0.02;
  return (
    <div className="mt-4">
      <p className="text-xs text-muted-foreground">
        Pesi totali:{" "}
        <span className={"font-semibold " + (off ? "text-amber-600" : "text-foreground")}>
          {fmtPct(m.weight_sum)}
        </span>
        {m.missing_prices.length > 0 && (
          <>
            {" "}
            · Senza prezzi:{" "}
            <span className="font-mono text-amber-600">{m.missing_prices.join(", ")}</span>
          </>
        )}
      </p>
      {m.warnings.map((w) => (
        <p key={w} className="mt-1 text-xs text-amber-600 dark:text-amber-500">
          ⚠ {w}
        </p>
      ))}
      <div className="mt-3 max-h-56 overflow-y-auto rounded-sm border border-border">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="sticky top-0 border-b border-border bg-secondary/60 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              <th className="px-3 py-2">Strumento</th>
              <th className="px-3 py-2">Asset class</th>
              <th className="px-3 py-2 text-right">Peso</th>
            </tr>
          </thead>
          <tbody>
            {m.holdings.map((h, i) => (
              <tr
                key={h.ticker}
                className={"border-t border-border " + (i % 2 === 1 ? "bg-background/40" : "")}
              >
                <td className="px-3 py-1.5 font-mono text-xs text-foreground">{h.ticker}</td>
                <td className="px-3 py-1.5 text-xs text-muted-foreground">{h.asset_class}</td>
                <td className="px-3 py-1.5 text-right font-mono text-xs tabular-nums text-foreground">
                  {fmtPct(h.weight)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// --- the three analyses on the loaded mandate -----------------------------

type Tab = "risk" | "signals" | "reopt";

function MandateAnalysis({
  holdings,
  profile,
  currency,
}: {
  holdings: HoldingInput[];
  profile: Profile;
  currency: Currency;
}) {
  const [tab, setTab] = useState<Tab>("risk");
  const [analysis, setAnalysis] = useState<PortfolioAnalyzeResponse | null>(null);
  const [reopt, setReopt] = useState<PortfolioReoptimizeResponse | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function runRisk() {
    setTab("risk");
    setBusy(true);
    setErr(null);
    try {
      setAnalysis(await api.analyzePortfolio(holdings));
    } catch (e) {
      setErr(errMsg(e));
    } finally {
      setBusy(false);
    }
  }

  async function runReopt() {
    setTab("reopt");
    setBusy(true);
    setErr(null);
    try {
      setReopt(await api.reoptimizePortfolio(holdings, profile, currency));
    } catch (e) {
      setErr(errMsg(e));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mt-6">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <span className="text-sm font-semibold text-foreground">Analisi del mandato</span>
        <button
          type="button"
          onClick={runRisk}
          className="rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          Radiografia rischio
        </button>
        <button
          type="button"
          onClick={() => {
            setTab("signals");
            if (!analysis) void runRisk();
          }}
          className="rounded-md border border-border bg-card px-3 py-1.5 text-sm font-medium text-foreground hover:bg-secondary"
        >
          Segnali
        </button>
        <button
          type="button"
          onClick={runReopt}
          className="rounded-md border border-border bg-card px-3 py-1.5 text-sm font-medium text-foreground hover:bg-secondary"
        >
          Ri-ottimizza ({profile} · {currency})
        </button>
      </div>

      {busy && <LoadingBlock label="Il motore sta analizzando il mandato…" />}
      {!busy && err && <ErrorBlock message={err} />}

      {!busy && !err && tab === "risk" && analysis && <RiskRadiography a={analysis} />}
      {!busy && !err && tab === "signals" && analysis && <MandateSignals a={analysis} />}
      {!busy && !err && tab === "reopt" && reopt && <ReoptCompare r={reopt} />}
      {!busy && !err && !analysis && !reopt && (
        <Card className="p-6 text-sm text-muted-foreground">
          Scegli un'analisi qui sopra per radiografare il mandato caricato.
        </Card>
      )}
    </div>
  );
}

function Coverage({ covered, missing }: { covered: number; missing: string[] }) {
  if (covered >= 0.9999 && missing.length === 0) return null;
  return (
    <p className="text-xs text-amber-600 dark:text-amber-500">
      Analizzato il {fmtPct(covered)} del mandato.
      {missing.length > 0 && (
        <>
          {" "}
          Esclusi (senza prezzi): <span className="font-mono">{missing.join(", ")}</span>.
        </>
      )}
    </p>
  );
}

function RiskRadiography({ a }: { a: PortfolioAnalyzeResponse }) {
  return (
    <div className="space-y-4">
      <Coverage covered={a.covered_weight} missing={a.missing_prices} />
      <RegimeChips regimes={a.regimes} />
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Mini label="Volatility (ann.)" value={fmtPct(a.summary.volatility)} />
        <Mini label="Sharpe" value={fmtNum(a.summary.sharpe)} />
        <Mini label="Max drawdown" value={fmtPct(a.summary.max_drawdown)} />
        <Mini label="CAGR" value={fmtPct(a.summary.cagr, true)} />
      </div>
      <MetricsTable metrics={a.metrics} />
      <div>
        <div className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          Contribuzioni di rischio (MV)
        </div>
        <Card className="p-4">
          <div className="space-y-2">
            {(() => {
              const total =
                a.contributions.reduce((s, c) => s + Math.abs(c.risk_contribution), 0) || 1;
              return a.contributions
                .slice()
                .sort((x, y) => y.risk_contribution - x.risk_contribution)
                .map((c) => (
                  <WeightBar
                    key={c.name}
                    label={c.name}
                    value={Math.abs(c.risk_contribution) / total}
                    sub={`(w ${fmtPct(c.weight)})`}
                    tone="muted"
                  />
                ));
            })()}
          </div>
        </Card>
      </div>
    </div>
  );
}

function MandateSignals({ a }: { a: PortfolioAnalyzeResponse }) {
  return (
    <div className="space-y-3">
      <Coverage covered={a.covered_weight} missing={a.missing_prices} />
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
            </tr>
          </thead>
          <tbody>
            {a.signals.map((s, i) => (
              <tr
                key={s.ticker}
                className={"border-t border-border " + (i % 2 === 1 ? "bg-background/40" : "")}
              >
                <td className="px-4 py-2 font-mono text-sm text-foreground">{s.ticker}</td>
                <td className="px-4 py-2 text-sm text-muted-foreground">{s.asset_class}</td>
                <td className="px-4 py-2 text-center">
                  <DirectionPill direction={s.trend.direction} probability={s.trend.probability} />
                </td>
                <td className="px-4 py-2 text-center">
                  <DirectionPill
                    direction={s.oscillator.direction}
                    probability={s.oscillator.probability}
                  />
                </td>
                <td className="px-4 py-2 text-center">
                  <DirectionPill
                    direction={s.alpha_crash.direction}
                    probability={s.alpha_crash.probability}
                  />
                </td>
                <td className="px-4 py-2 text-center">
                  <DirectionPill
                    direction={s.summary.direction}
                    probability={s.summary.probability}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
      <p className="text-xs text-muted-foreground">
        "Stato di salute" di ciò che è già in portafoglio. Versione semplificata (regime proxy).
      </p>
    </div>
  );
}

function ReoptCompare({ r }: { r: PortfolioReoptimizeResponse }) {
  const deltas: { k: string; label: string }[] = [
    { k: "std_dev", label: "StdDev" },
    { k: "cvar_95", label: "CVaR 95%" },
    { k: "max_drawdown", label: "Max DD" },
    { k: "sharpe", label: "Sharpe" },
  ];
  return (
    <div className="space-y-4">
      <Coverage covered={r.covered_weight} missing={r.missing_prices} />
      <p className="text-xs text-muted-foreground">
        Proposta dall'ensemble ({r.n_models_active} modelli, scelti{" "}
        <span className="font-mono">{r.selected_models.join(", ")}</span>, score {r.scorer}).
      </p>

      {/* risk deltas */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {deltas.map((d) => {
          const cur = r.risk_current[d.k];
          const prop = r.risk_proposed[d.k];
          const delta = r.risk_delta[d.k];
          const isRatio = d.k === "sharpe";
          // for risk measures, lower is better → green when delta < 0
          const good = isRatio ? delta > 0 : delta < 0;
          return (
            <Card key={d.k} className="p-3">
              <div className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                {d.label}
              </div>
              <div className="mt-1 flex items-baseline gap-1.5 font-mono text-sm tabular-nums">
                <span className="text-muted-foreground">{isRatio ? fmtNum(cur) : fmtPct(cur)}</span>
                <span className="text-muted-foreground">→</span>
                <span className="font-semibold text-foreground">
                  {isRatio ? fmtNum(prop) : fmtPct(prop)}
                </span>
              </div>
              <div
                className={
                  "mt-0.5 text-xs font-medium " + (good ? "text-success" : "text-destructive")
                }
              >
                {delta > 0 ? "+" : ""}
                {isRatio ? fmtNum(delta) : fmtPct(delta)}
              </div>
            </Card>
          );
        })}
      </div>

      {/* side-by-side weights */}
      <Card className="overflow-hidden">
        <div className="border-b border-border px-4 py-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          ATTUALE vs PROPOSTA
        </div>
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-border bg-secondary/60 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              <th className="px-4 py-2">Strumento</th>
              <th className="px-4 py-2 text-right">Attuale</th>
              <th className="px-4 py-2 text-right">Proposta</th>
              <th className="px-4 py-2 text-right">Δ</th>
            </tr>
          </thead>
          <tbody>
            {r.comparison.map((row, i) => (
              <tr
                key={row.ticker}
                className={"border-t border-border " + (i % 2 === 1 ? "bg-background/40" : "")}
              >
                <td className="px-4 py-1.5 font-mono text-sm text-foreground">{row.ticker}</td>
                <td className="px-4 py-1.5 text-right font-mono text-sm tabular-nums text-muted-foreground">
                  {fmtPct(row.current)}
                </td>
                <td className="px-4 py-1.5 text-right font-mono text-sm tabular-nums text-foreground">
                  {fmtPct(row.proposed)}
                </td>
                <td
                  className={
                    "px-4 py-1.5 text-right font-mono text-sm tabular-nums " +
                    (row.delta > 0
                      ? "text-success"
                      : row.delta < 0
                        ? "text-destructive"
                        : "text-muted-foreground")
                  }
                >
                  {row.delta > 0 ? "+" : ""}
                  {fmtPct(row.delta)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

function Mini({ label, value }: { label: string; value: string }) {
  return (
    <Card className="p-3">
      <div className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </div>
      <div className="mt-0.5 font-mono text-sm font-semibold tabular-nums text-foreground">
        {value}
      </div>
    </Card>
  );
}
