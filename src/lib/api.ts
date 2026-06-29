// Typed data service for the AA engine API (engine/docs/05_api_contract.md).
//
// SINGLE point of contact with the backend: every section of the dashboard goes
// through here. Base URL is configurable via VITE_API_BASE_URL (default the local
// FastAPI dev server). Types mirror the contract exactly — decimals are fractions
// (0.0753 = 7.53%), dates are ISO "YYYY-MM-DD".
//
// Golden rule: this layer returns REAL data from the engine, or it throws. It
// never fabricates numbers. Sections render a declared placeholder or an error
// state when the engine is unreachable — never a fake value dressed up as real.

export const API_BASE_URL: string =
  (import.meta.env.VITE_API_BASE_URL as string | undefined)?.replace(/\/$/, "") ??
  "https://aa-engine-api.onrender.com/api/v1";

// ---- Shared contract enums ----------------------------------------------

export type Profile = "low" | "moderate" | "medium" | "high";
export type Currency = "EUR" | "USD" | "CHF";
export type Regime = "bull" | "bear";
export type RiskFamily = "return_based" | "tail" | "drawdown_based";

// ---- /health -------------------------------------------------------------

export interface HealthResponse {
  status: "ok";
  version: string;
  lite?: boolean;
  n_models_active?: number;
  n_models_full?: number;
}

// ---- /regimes ------------------------------------------------------------

export interface RegimesResponse {
  as_of: string;
  source: "proxy" | "options";
  regimes: { asset_class: string; regime: Regime }[];
}

// ---- /risk/panel ---------------------------------------------------------

export interface RiskMetric {
  family: RiskFamily;
  code: string;
  name: string;
  value: number;
  ret_over_risk: number | null;
  approx?: boolean; // documented approximation (RLVaR/RLDaR bridge, tail-GMD)
}

export interface RiskPanelResponse {
  profile: Profile;
  currency: Currency;
  as_of: string;
  alpha: number;
  regime_conditional: boolean;
  summary: {
    cumulative_return: number;
    cagr: number;
    sharpe: number;
    max_drawdown: number; // positive fraction
    volatility: number;
  };
  metrics: RiskMetric[];
}

export interface RiskPanelOptions {
  alpha?: number;
  mar?: number;
  regimeConditional?: boolean;
}

// ---- /risk/contributions -------------------------------------------------

export interface ContributionsResponse {
  profile: Profile;
  currency: Currency;
  measure: string;
  contributions: { name: string; weight: number; risk_contribution: number }[];
}

// ---- shared signal shapes ------------------------------------------------

export interface SignalCell {
  direction: -1 | 0 | 1;
  probability: number;
}

export interface SignalRow {
  ticker: string;
  asset_class: string;
  trend: SignalCell;
  oscillator: SignalCell;
  alpha_crash: SignalCell;
  summary: SignalCell;
}

// ---- /allocation/run -----------------------------------------------------

export interface BenchmarkBlock {
  id: string;
  label: string;
  placeholder: boolean;
  weights: Record<string, number>;
  asset_class_weights: Record<string, number>;
  risk: Record<string, number>;
}

export interface AllocationResponse {
  profile: Profile;
  currency: Currency;
  as_of: string;
  lite?: boolean; // hosting-lite mode: reduced ensemble (fewer models, fast)
  n_models_active: number;
  regimes: Record<string, Regime>;
  signals: SignalRow[];
  selected: string[];
  discarded: string[];
  selected_models: string[];
  final_weights: Record<string, number>;
  asset_class_weights: Record<string, number>;
  risk: Record<string, number>;
  excluded_models: Record<string, string>;
  benchmark: BenchmarkBlock | null;
}

// ---- /profiles (configurable risk profiles) ------------------------------

export interface ProfileBand {
  min: number;
  max: number;
}

export interface ModelGrid {
  target: Record<string, number>;
  bands: Record<string, ProfileBand>;
}

export interface ProfileItem {
  id: Profile;
  label: string;
  benchmark: string;
}

export interface ProfilesConfigResponse {
  placeholder: boolean;
  source: string;
  asset_classes: string[];
  currencies: Currency[];
  default_currency: Currency;
  profiles: ProfileItem[];
  // models[profile][currency] = {target, bands}; benchmarks[bm_id][currency] = {target, bands}
  models: Record<string, Record<string, ModelGrid>>;
  benchmarks: Record<string, Record<string, unknown>>;
  index_map: Record<string, Record<string, string>>;
}

// ---- /signals ------------------------------------------------------------

export interface SignalsResponse {
  as_of: string;
  svm_enabled: boolean;
  svm_note: string;
  regimes: Record<string, Regime>;
  selected: string[];
  discarded: string[];
  signals: SignalRow[];
}

// ---- /optimization/models ------------------------------------------------

export type ModelFamily =
  | "classics"
  | "bayesian"
  | "ai"
  | "online"
  | "robust"
  | "baseline"
  | "base";

export interface OptModelRow {
  name: string;
  family: ModelFamily;
  score: number | null;
  selected: boolean;
  weights: Record<string, number>;
}

export interface OptimizationModelsResponse {
  profile: Profile;
  currency: Currency;
  as_of: string;
  lite?: boolean; // hosting-lite mode: reduced ensemble (fewer models, fast)
  scorer: string;
  n_best: number;
  n_models_active: number;
  selected_models: string[];
  universe: string[];
  selected: string[];
  discarded: string[];
  models: OptModelRow[];
  excluded_models: Record<string, string>;
  final_weights: Record<string, number>;
  asset_class_weights: Record<string, number>;
  baseline_equal_weight: Record<string, number>;
  baseline_score: number | null;
}

// ---- data upload + portfolio analysis (iteration 2) ----------------------

export type DataSource = "user" | "sample";

export interface InstrumentInfo {
  ticker: string;
  asset_class: string;
  n_observations: number;
  known: boolean;
}

export interface UniverseResponse {
  source: DataSource;
  filename: string | null;
  n_instruments: number;
  n_observations: number;
  date_start: string;
  date_end: string;
  instruments: InstrumentInfo[];
  warnings: string[];
}

export interface MandateHolding {
  ticker: string;
  isin: string;
  weight: number;
  asset_class: string;
}

export interface MandateResponse {
  holdings: MandateHolding[];
  weight_sum: number;
  missing_prices: string[];
  warnings: string[];
}

export interface HoldingInput {
  ticker: string;
  weight: number;
  isin?: string;
}

export interface PortfolioAnalyzeResponse {
  source: DataSource;
  as_of: string;
  n_holdings: number;
  covered_weight: number;
  missing_prices: string[];
  summary: RiskPanelResponse["summary"];
  metrics: RiskMetric[];
  contributions: { name: string; weight: number; risk_contribution: number }[];
  regimes: Record<string, Regime>;
  signals: SignalRow[];
}

export interface ReoptimizeRow {
  ticker: string;
  asset_class: string;
  current: number;
  proposed: number;
  delta: number;
}

export interface PortfolioReoptimizeResponse {
  source: DataSource;
  profile: Profile;
  currency: Currency;
  as_of: string;
  covered_weight: number;
  missing_prices: string[];
  n_models_active: number;
  selected_models: string[];
  scorer: string;
  regimes: Record<string, Regime>;
  comparison: ReoptimizeRow[];
  risk_current: Record<string, number>;
  risk_proposed: Record<string, number>;
  risk_delta: Record<string, number>;
}

// ---- transport -----------------------------------------------------------

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status?: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

interface RequestOptions {
  timeoutMs?: number;
  retries?: number; // additional attempts beyond the first
  retryDelayMs?: number;
}

const LIGHT_TIMEOUT_MS = 15_000;
const HEAVY_TIMEOUT_MS = 90_000;
const HEAVY_OPTS: RequestOptions = {
  timeoutMs: HEAVY_TIMEOUT_MS,
  retries: 1,
  retryDelayMs: 2_000,
};

async function request<T>(path: string, init?: RequestInit, opts: RequestOptions = {}): Promise<T> {
  const timeoutMs = opts.timeoutMs ?? LIGHT_TIMEOUT_MS;
  const maxRetries = opts.retries ?? 0;
  const retryDelayMs = opts.retryDelayMs ?? 2_000;

  let lastError: ApiError | undefined;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    let res: Response;
    try {
      res = await fetch(`${API_BASE_URL}${path}`, {
        headers: { "content-type": "application/json" },
        signal: controller.signal,
        ...init,
      });
    } catch (cause) {
      clearTimeout(timer);
      const aborted = (cause as { name?: string })?.name === "AbortError";
      lastError = new ApiError(
        aborted
          ? `Il motore è in avvio (cold start ~30–90s sul piano Free di Render). Riprova tra qualche secondo.`
          : `Impossibile raggiungere il motore (${API_BASE_URL}). Verifica la connessione e riprova.`,
      );
      if (attempt < maxRetries) {
        await new Promise((r) => setTimeout(r, retryDelayMs));
        continue;
      }
      throw lastError;
    }
    clearTimeout(timer);

    if (!res.ok) {
      let detail = "";
      try {
        const body = (await res.json()) as { error?: { message?: string } };
        detail = body?.error?.message ? ` — ${body.error.message}` : "";
      } catch {
        /* response had no JSON body */
      }
      const err = new ApiError(`API ${path} returned ${res.status}${detail}`, res.status);
      // Retry only on transient upstream errors (typical Render cold-start 502/503/504).
      if (attempt < maxRetries && [502, 503, 504].includes(res.status)) {
        lastError = err;
        await new Promise((r) => setTimeout(r, retryDelayMs));
        continue;
      }
      throw err;
    }
    return (await res.json()) as T;
  }
  throw lastError ?? new ApiError(`API ${path} failed`);
}

// ---- endpoint fetchers ---------------------------------------------------

export const api = {
  baseUrl: API_BASE_URL,

  health: () => request<HealthResponse>("/health"),

  profiles: () => request<ProfilesConfigResponse>("/profiles"),

  regimes: (asOf?: string) => request<RegimesResponse>(`/regimes${asOf ? `?as_of=${asOf}` : ""}`),

  riskPanel: (profile: Profile, currency: Currency, opts: RiskPanelOptions = {}) =>
    request<RiskPanelResponse>(
      "/risk/panel",
      {
        method: "POST",
        body: JSON.stringify({
          profile,
          currency,
          alpha: opts.alpha ?? 0.05,
          mar: opts.mar ?? 0,
          regime_conditional: opts.regimeConditional ?? true,
        }),
      },
      HEAVY_OPTS,
    ),

  contributions: (profile: Profile, currency: Currency, measure = "MV") =>
    request<ContributionsResponse>(
      `/risk/contributions?profile=${profile}&currency=${currency}&measure=${measure}`,
      undefined,
      HEAVY_OPTS,
    ),

  runAllocation: (profile: Profile, currency: Currency, asOf?: string | null) =>
    request<AllocationResponse>(
      "/allocation/run",
      {
        method: "POST",
        body: JSON.stringify({ profile, currency, as_of: asOf ?? null }),
      },
      HEAVY_OPTS,
    ),

  signals: (asOf?: string) => request<SignalsResponse>(`/signals${asOf ? `?as_of=${asOf}` : ""}`),

  optimizationModels: (profile: Profile, currency: Currency, asOf?: string | null) =>
    request<OptimizationModelsResponse>(
      `/optimization/models?profile=${profile}&currency=${currency}${asOf ? `&as_of=${asOf}` : ""}`,
      undefined,
      HEAVY_OPTS,
    ),

  uploadPrices: (csv: string, filename?: string) =>
    request<UniverseResponse>("/data/upload", {
      method: "POST",
      body: JSON.stringify({ csv, filename: filename ?? null }),
    }),

  universe: () => request<UniverseResponse>("/data/universe"),

  uploadMandate: (csv: string, filename?: string) =>
    request<MandateResponse>("/portfolio/upload", {
      method: "POST",
      body: JSON.stringify({ csv, filename: filename ?? null }),
    }),

  analyzePortfolio: (holdings: HoldingInput[], opts: { alpha?: number; mar?: number } = {}) =>
    request<PortfolioAnalyzeResponse>(
      "/portfolio/analyze",
      {
        method: "POST",
        body: JSON.stringify({ holdings, alpha: opts.alpha ?? 0.05, mar: opts.mar ?? 0 }),
      },
      HEAVY_OPTS,
    ),

  reoptimizePortfolio: (holdings: HoldingInput[], profile: Profile, currency: Currency) =>
    request<PortfolioReoptimizeResponse>(
      "/portfolio/reoptimize",
      {
        method: "POST",
        body: JSON.stringify({ holdings, profile, currency }),
      },
      HEAVY_OPTS,
    ),
};
