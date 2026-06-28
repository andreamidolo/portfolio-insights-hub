// Mock data service for the Risk Panel.
// Swap the functions below with real API calls later; the types stay the same.

export type RiskProfile = "Moderate" | "Balanced" | "Aggressive";
export type Currency = "EUR" | "USD";
export type RegimeStatus = "Bull" | "Bear";

export interface SummaryStats {
  cumulativeReturn: number; // as decimal, e.g. 0.1842 => 18.42%
  sharpeRatio: number;
  maxDrawdown: number; // negative decimal
  volatility: number; // annualized decimal
}

export interface MetricRow {
  name: string;
  value: string; // pre-formatted for display
  returnRisk: string; // pre-formatted ratio (or "—")
}

export interface MetricSection {
  title: "Return-based" | "Tail risk" | "Drawdown-based";
  rows: MetricRow[];
}

export interface RegimeIndicator {
  assetClass: "Equity" | "Fixed Income" | "Dollar" | "Commodities" | "Gold";
  status: RegimeStatus;
  since: string; // ISO date
}

export interface RiskPanelData {
  portfolioName: string;
  asOf: string; // ISO date
  profile: RiskProfile;
  currency: Currency;
  summary: SummaryStats;
  sections: MetricSection[];
  regimes: RegimeIndicator[];
}

// ---- Mock generator ------------------------------------------------

const PROFILE_TILT: Record<RiskProfile, number> = {
  Moderate: 0.85,
  Balanced: 1,
  Aggressive: 1.25,
};

export function getRiskPanelData(
  profile: RiskProfile,
  currency: Currency,
): RiskPanelData {
  const t = PROFILE_TILT[profile];

  const summary: SummaryStats = {
    cumulativeReturn: 0.1842 * t,
    sharpeRatio: 1.18 * (profile === "Aggressive" ? 0.92 : 1),
    maxDrawdown: -0.0921 * t,
    volatility: 0.0742 * t,
  };

  const pct = (n: number) => `${(n * 100).toFixed(2)}%`;
  const num = (n: number) => n.toFixed(2);

  const annRet = 0.0921 * t;
  const vol = summary.volatility;
  const downside = 0.0512 * t;
  const var95 = -0.0184 * t;
  const cvar95 = -0.0271 * t;
  const skew = -0.42;
  const kurt = 4.18;
  const maxDD = summary.maxDrawdown;
  const avgDD = -0.0312 * t;
  const ulcer = 0.0218 * t;
  const recovery = 142; // days

  const sections: MetricSection[] = [
    {
      title: "Return-based",
      rows: [
        { name: "Annualized Return", value: pct(annRet), returnRisk: num(annRet / vol) },
        { name: "Cumulative Return", value: pct(summary.cumulativeReturn), returnRisk: "—" },
        { name: "Volatility (ann.)", value: pct(vol), returnRisk: "1.00" },
        { name: "Sharpe Ratio", value: num(summary.sharpeRatio), returnRisk: num(summary.sharpeRatio) },
        { name: "Sortino Ratio", value: num(annRet / downside), returnRisk: num(annRet / downside) },
        { name: "Information Ratio", value: num(0.62 * t), returnRisk: num(0.62 * t) },
      ],
    },
    {
      title: "Tail risk",
      rows: [
        { name: "Downside Deviation", value: pct(downside), returnRisk: num(annRet / downside) },
        { name: "VaR (95%, 1d)", value: pct(var95), returnRisk: num(annRet / Math.abs(var95)) },
        { name: "CVaR (95%, 1d)", value: pct(cvar95), returnRisk: num(annRet / Math.abs(cvar95)) },
        { name: "Skewness", value: num(skew), returnRisk: "—" },
        { name: "Excess Kurtosis", value: num(kurt - 3), returnRisk: "—" },
      ],
    },
    {
      title: "Drawdown-based",
      rows: [
        { name: "Max Drawdown", value: pct(maxDD), returnRisk: num(annRet / Math.abs(maxDD)) },
        { name: "Average Drawdown", value: pct(avgDD), returnRisk: num(annRet / Math.abs(avgDD)) },
        { name: "Ulcer Index", value: num(ulcer * 100), returnRisk: num(annRet / ulcer) },
        { name: "Calmar Ratio", value: num(annRet / Math.abs(maxDD)), returnRisk: num(annRet / Math.abs(maxDD)) },
        { name: "Recovery Time", value: `${recovery}d`, returnRisk: "—" },
      ],
    },
  ];

  const regimes: RegimeIndicator[] = [
    { assetClass: "Equity",       status: "Bull", since: "2024-11-04" },
    { assetClass: "Fixed Income", status: "Bear", since: "2025-02-18" },
    { assetClass: "Dollar",       status: "Bull", since: "2025-09-12" },
    { assetClass: "Commodities",  status: "Bear", since: "2026-01-21" },
    { assetClass: "Gold",         status: "Bull", since: "2024-08-30" },
  ];

  return {
    portfolioName: "Global Multi-Asset — Strategic Sleeve",
    asOf: "2026-06-26",
    profile,
    currency,
    summary,
    sections,
    regimes,
  };
}
