// Non-component helpers shared by the dashboard (kept out of ui.tsx so the
// component module exports only components — Fast Refresh friendly).

import type { AsyncState } from "@/lib/use-async";

export type SectionStatus = "live" | "loading" | "error" | "soon";

export function statusOf(state: AsyncState<unknown>): SectionStatus {
  switch (state.status) {
    case "success":
      return "live";
    case "error":
      return "error";
    default:
      return "loading";
  }
}

export function fmtPct(n: number, signed = false): string {
  const sign = signed && n > 0 ? "+" : "";
  return `${sign}${(n * 100).toFixed(2)}%`;
}

export function fmtNum(n: number | null | undefined, digits = 2): string {
  if (n == null || !Number.isFinite(n)) return "—";
  return n.toFixed(digits);
}
