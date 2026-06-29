// Diagnostica rapida del motore: pinga gli endpoint principali e mostra
// latenza + stato. Utile quando i badge restano "OFFLINE" per capire se è un
// cold start di Render (timeout > 30s) o un endpoint davvero rotto.

import { useEffect, useState } from "react";

import { API_BASE_URL } from "@/lib/api";

type Kind = "light" | "heavy";

interface Check {
  label: string;
  path: string;
  method: "GET" | "POST";
  body?: unknown;
  kind: Kind;
}

interface Result {
  label: string;
  path: string;
  kind: Kind;
  ok: boolean;
  status: number | null;
  ms: number;
  note: string;
  lite?: boolean;
  nModels?: number;
}

const CHECKS: Check[] = [
  { label: "Health", path: "/health", method: "GET", kind: "light" },
  { label: "Profiles", path: "/profiles", method: "GET", kind: "light" },
  { label: "Regimes", path: "/regimes", method: "GET", kind: "light" },
  { label: "Signals", path: "/signals", method: "GET", kind: "light" },
  {
    label: "Risk panel",
    path: "/risk/panel",
    method: "POST",
    kind: "heavy",
    body: { profile: "balanced", currency: "EUR", alpha: 0.05, mar: 0, regime_conditional: true },
  },
  {
    label: "Allocation run",
    path: "/allocation/run",
    method: "POST",
    kind: "heavy",
    body: { profile: "balanced", currency: "EUR", as_of: null },
  },
  {
    label: "Optimization models",
    path: "/optimization/models?profile=balanced&currency=EUR",
    method: "GET",
    kind: "heavy",
  },
];

async function ping(check: Check): Promise<Result> {
  const timeoutMs = check.kind === "light" ? 15_000 : 90_000;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  const t0 = performance.now();
  try {
    const res = await fetch(`${API_BASE_URL}${check.path}`, {
      method: check.method,
      headers: { "content-type": "application/json" },
      body: check.body ? JSON.stringify(check.body) : undefined,
      signal: controller.signal,
    });
    const ms = Math.round(performance.now() - t0);
    let lite: boolean | undefined;
    let nModels: number | undefined;
    if (res.ok) {
      try {
        const data = (await res.clone().json()) as {
          lite?: boolean;
          n_models_active?: number;
          n_models_full?: number;
          models?: unknown[];
          selected?: unknown[];
        };
        if (typeof data?.lite === "boolean") lite = data.lite;
        if (typeof data?.n_models_active === "number") nModels = data.n_models_active;
        else if (Array.isArray(data?.models)) nModels = data.models.length;
        else if (Array.isArray(data?.selected)) nModels = data.selected.length;
      } catch {
        /* non-JSON response, ignore */
      }
    }
    return {
      label: check.label,
      path: check.path,
      kind: check.kind,
      ok: res.ok,
      status: res.status,
      ms,
      note: res.ok ? "OK" : `HTTP ${res.status}`,
      lite,
      nModels,
    };
  } catch (err) {
    const ms = Math.round(performance.now() - t0);
    const aborted = (err as { name?: string })?.name === "AbortError";
    return {
      label: check.label,
      path: check.path,
      kind: check.kind,
      ok: false,
      status: null,
      ms,
      note: aborted ? `timeout >${Math.round(timeoutMs / 1000)}s` : "network error",
    };
  } finally {
    clearTimeout(timer);
  }
}

export function ApiHealthPanel() {
  const [running, setRunning] = useState(false);
  const [results, setResults] = useState<Result[]>([]);
  const [startedAt, setStartedAt] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    ping(CHECKS[0]).then((r) => {
      if (!cancelled) setResults([r]);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  async function runTests() {
    setRunning(true);
    setResults([]);
    setStartedAt(new Date().toLocaleTimeString());
    // Esegui in parallelo: aggiorna man mano che ogni check risponde.
    await Promise.all(
      CHECKS.map((c) =>
        ping(c).then((r) => setResults((prev) => [...prev, r])),
      ),
    );
    setRunning(false);
  }

  const sorted = [...results].sort(
    (a, b) => CHECKS.findIndex((c) => c.path === a.path) - CHECKS.findIndex((c) => c.path === b.path),
  );
  const okCount = results.filter((r) => r.ok).length;
  // Modalità motore: l'API restituisce `lite: true` sulle risposte pesanti quando
  // gira con AA_ENGINE_LITE=1 (ensemble ridotto ~6 modelli vs 41 completi).
  const liteFlags = results.filter((r) => typeof r.lite === "boolean");
  const engineMode: "lite" | "full" | "unknown" = liteFlags.length === 0
    ? "unknown"
    : liteFlags.some((r) => r.lite) ? "lite" : "full";
  const modelsCount =
    results.find((r) => r.path === "/health")?.nModels ??
    results.find((r) => r.path.startsWith("/optimization/models"))?.nModels;

  return (
    <div className="rounded-md border border-border bg-card p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div>
            <div className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
              Diagnostica motore
            </div>
            <div className="mt-0.5 text-sm text-foreground">
              Verifica latenza e stato degli endpoint
            </div>
          </div>
          {engineMode !== "unknown" ? (
            <span
              className={
                "ml-2 rounded-sm px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide " +
                (engineMode === "lite"
                  ? "bg-secondary text-foreground border border-border"
                  : "bg-success/15 text-success")

              }
              title={
                engineMode === "lite"
                  ? "AA_ENGINE_LITE=1 — ensemble ridotto (~6 modelli) per hosting Free"
                  : "Motore completo — 41 modelli"
              }
            >
              {engineMode === "lite" ? "LITE" : "FULL"}
              {typeof modelsCount === "number" && <> · {modelsCount} mod.</>}
            </span>
          ) : (
            results.some((r) => r.path === "/health" && r.ok) && (
              <span
                className="ml-2 rounded-sm border border-destructive/30 bg-destructive/10 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-destructive"
                title="Il /health raggiunto non espone ancora lite/n_models_active: il backend non è redeployato con la modalità light o la variabile non è attiva."
              >
                MODO NON DICHIARATO
              </span>
            )
          )}
        </div>

        <button
          type="button"
          onClick={runTests}
          disabled={running}
          className={
            "rounded-md border border-border px-3.5 py-1.5 text-sm font-medium transition-colors " +
            (running
              ? "cursor-wait bg-muted text-muted-foreground"
              : "bg-primary text-primary-foreground hover:opacity-90")
          }
        >
          {running ? "Test in corso…" : "Test API"}
        </button>
      </div>

      {(results.length > 0 || running) && (
        <div className="mt-4">
          <div className="mb-2 flex items-center justify-between text-[11px] text-muted-foreground">
            <span>
              {startedAt && <>avviato {startedAt} · </>}
              {results.length}/{CHECKS.length} risposti
              {results.length > 0 && <> · {okCount} OK</>}
            </span>
            <span className="font-mono">{API_BASE_URL}</span>
          </div>
          <ul className="divide-y divide-border overflow-hidden rounded-md border border-border">
            {CHECKS.map((c) => {
              const r = sorted.find((x) => x.path === c.path);
              const pending = !r;
              const cls = pending
                ? "text-muted-foreground"
                : r.ok
                  ? "text-success"
                  : "text-destructive";
              const dot = pending
                ? "bg-muted-foreground/40 animate-pulse"
                : r.ok
                  ? "bg-success"
                  : "bg-destructive";
              return (
                <li
                  key={c.path}
                  className="flex items-center justify-between gap-3 bg-background px-3 py-2 text-sm"
                >
                  <span className="flex min-w-0 items-center gap-2">
                    <span className={"inline-block h-1.5 w-1.5 rounded-full " + dot} aria-hidden />
                    <span className="font-medium text-foreground">{c.label}</span>
                    <span className="truncate font-mono text-[11px] text-muted-foreground">
                      {c.method} {c.path}
                    </span>
                    <span className="rounded-sm bg-secondary px-1 py-0.5 text-[10px] uppercase tracking-wide text-muted-foreground">
                      {c.kind === "heavy" ? "pesante" : "leggero"}
                    </span>
                  </span>
                  <span className={"shrink-0 font-mono text-xs " + cls}>
                    {pending ? "…" : `${r.note} · ${r.ms} ms`}
                  </span>
                </li>
              );
            })}
          </ul>
          <p className="mt-2 text-[11px] leading-relaxed text-muted-foreground">
            Su Render Free il primo colpo può richiedere 30–90s (cold start). Se
            <span className="font-medium"> Health</span> risponde ma gli endpoint pesanti vanno in
            timeout, il motore è online ma sotto carico: riprova dopo qualche secondo.
          </p>
        </div>
      )}
    </div>
  );
}
