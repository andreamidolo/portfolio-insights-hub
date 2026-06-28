// Typed client for the AA engine API (engine/docs/05_api_contract.md).
// Talks to the FastAPI backend; an adapter maps responses onto the existing
// RiskPanelData UI shape so the components don't change. The page falls back to
// the local mock (risk-data.ts) when the API is unreachable.

import type {
  Currency,
  MetricSection,
  RegimeIndicator,
  RiskPanelData,
  RiskProfile,
} from "@/lib/risk-data";

const BASE_URL: string =
  (import.meta.env.VITE_API_BASE_URL as string | undefined)?.replace(/\/$/, "") ??
  "http://localhost:8000/api/v1";

// ---- Contract types (decimals are fractions, e.g. 0.0753 = 7.53%) --------

type ApiProfile = "moderate" | "balanced" | "aggressive";
type ApiCurrency = "EUR" | "USD";
type ApiRegime = "bull" | "bear";
type ApiFamily = "return_based" | "tail" | "drawdown_based";

interface RegimesResponse {
  as_of: string;
  source: "proxy" | "options";
  regimes: { asset_class: string; regime: ApiRegime }[];
}

interface RiskPanelResponse {
  profile: ApiProfile;
  currency: ApiCurrency;
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
  metrics: {
    family: ApiFamily;
    code: string;
    name: string;
    value: number;
    ret_over_risk: number | null;
  }[];
}

export interface RiskPanelOptions {
  alpha?: number;
  mar?: number;
  regimeConditional?: boolean;
}

// ---- Fetchers ------------------------------------------------------------

const FAMILY_TITLE: Record<ApiFamily, MetricSection["title"]> = {
  return_based: "Return-based",
  tail: "Tail risk",
  drawdown_based: "Drawdown-based",
};

const DIMENSIONLESS = new Set(["SKEW", "KT"]);

async function getJSON<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "content-type": "application/json" },
    ...init,
  });
  if (!res.ok) {
    throw new Error(`API ${path} -> ${res.status}`);
  }
  return (await res.json()) as T;
}

export function fetchRegimes(): Promise<RegimesResponse> {
  return getJSON<RegimesResponse>("/regimes");
}

export function fetchRiskPanel(
  profile: RiskProfile,
  currency: Currency,
  opts: RiskPanelOptions = {},
): Promise<RiskPanelResponse> {
  return getJSON<RiskPanelResponse>("/risk/panel", {
    method: "POST",
    body: JSON.stringify({
      profile: profile.toLowerCase() as ApiProfile,
      currency,
      alpha: opts.alpha ?? 0.05,
      mar: opts.mar ?? 0,
      regime_conditional: opts.regimeConditional ?? true,
    }),
  });
}

// ---- Adapter: API responses -> existing RiskPanelData UI shape -----------

const pct = (n: number) => `${(n * 100).toFixed(2)}%`;
const num = (n: number) => n.toFixed(2);

function toSections(metrics: RiskPanelResponse["metrics"]): MetricSection[] {
  const order: ApiFamily[] = ["return_based", "tail", "drawdown_based"];
  return order.map((fam) => ({
    title: FAMILY_TITLE[fam],
    rows: metrics
      .filter((m) => m.family === fam)
      .map((m) => ({
        name: m.name,
        value: DIMENSIONLESS.has(m.code) ? num(m.value) : pct(m.value),
        returnRisk: m.ret_over_risk == null ? "—" : num(m.ret_over_risk),
      })),
  }));
}

function toRegimes(regimes: RegimesResponse): RegimeIndicator[] {
  const allowed = new Set(["Equity", "Fixed Income", "Dollar", "Commodities", "Gold"]);
  return regimes.regimes
    .filter((r) => allowed.has(r.asset_class))
    .map((r) => ({
      assetClass: r.asset_class as RegimeIndicator["assetClass"],
      status: r.regime === "bull" ? "Bull" : "Bear",
      since: regimes.as_of, // il contratto v1 non espone una data di inizio regime
    }));
}

export function adaptRiskPanel(
  panel: RiskPanelResponse,
  regimes: RegimesResponse,
  profile: RiskProfile,
  currency: Currency,
): RiskPanelData {
  return {
    portfolioName: `Global Multi-Asset — ${profile} Sleeve`,
    asOf: panel.as_of,
    profile,
    currency,
    summary: {
      cumulativeReturn: panel.summary.cumulative_return,
      sharpeRatio: panel.summary.sharpe,
      maxDrawdown: -Math.abs(panel.summary.max_drawdown), // la UI usa il segno negativo
      volatility: panel.summary.volatility,
    },
    sections: toSections(panel.metrics),
    regimes: toRegimes(regimes),
  };
}

// Carica il pannello live (panel + regimes) e lo adatta alla forma UI.
export async function loadLiveRiskPanel(
  profile: RiskProfile,
  currency: Currency,
  opts: RiskPanelOptions = {},
): Promise<RiskPanelData> {
  const [panel, regimes] = await Promise.all([
    fetchRiskPanel(profile, currency, opts),
    fetchRegimes(),
  ]);
  return adaptRiskPanel(panel, regimes, profile, currency);
}
