// BRAND "wealth" brand constants for data-viz (recharts can't read CSS vars).
// Mirrors the semantic tokens in styles.css. Palette is parsimonious — burgundy
// primary, sand/gold + teal/navy support — no rainbows (design spec §4.1).

export const BRAND = {
  burgundy: "#83021A",
  burgundy700: "#6E0A18",
  maroon: "#590112",
  redAccent: "#9E2A36",
  rose: "#CFA8AD",
  sand: "#D5C29A",
  sand200: "#E9DDC9",
  taupe: "#9A8463",
  cream: "#F9F4EE",
  ink: "#231F20",
  slate: "#848788",
  line: "#E5E2DE",
  paper: "#FFFFFF",
  navy: "#002060",
  teal: "#004A58",
} as const;

// Ordered categorical palette for charts (burgundy first, then warm/cool support).
export const CHART_SEQUENCE = [
  BRAND.burgundy,
  BRAND.sand,
  BRAND.teal,
  BRAND.navy,
  BRAND.taupe,
  BRAND.rose,
  BRAND.redAccent,
] as const;

// On-brand directional colours (no green): teal = up/bull, burgundy = down/bear.
export const POSITIVE = BRAND.teal;
export const NEGATIVE = BRAND.burgundy;

export function chartColor(i: number): string {
  return CHART_SEQUENCE[i % CHART_SEQUENCE.length];
}
