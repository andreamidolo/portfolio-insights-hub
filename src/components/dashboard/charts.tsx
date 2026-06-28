// On-brand data-viz (recharts) for the dashboard — lfg-zest palette, parsimonious
// colour, neutral grids/axes, no rainbows (design spec §4). Rendered only inside
// client-side success states, so SSR never measures an empty container.

import {
  Bar,
  BarChart,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { CHART_SEQUENCE, LFG, NEGATIVE, POSITIVE, chartColor } from "@/lib/lfg-theme";

const axisStyle = { fontSize: 11, fill: LFG.slate } as const;
const pctTick = (v: number) => `${Math.round(v * 100)}%`;

function TooltipBox({
  active,
  payload,
  label,
  pct = true,
}: {
  active?: boolean;
  payload?: { name: string; value: number; color?: string }[];
  label?: string;
  pct?: boolean;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-sm border border-border bg-card px-2.5 py-1.5 text-xs shadow-sm">
      {label && <div className="mb-0.5 font-medium text-foreground">{label}</div>}
      {payload.map((p) => (
        <div key={p.name} className="flex items-center gap-2 text-muted-foreground">
          {p.color && (
            <span className="inline-block h-2 w-2 rounded-sm" style={{ background: p.color }} />
          )}
          {p.name}:{" "}
          <span className="font-mono text-foreground">
            {pct ? `${(p.value * 100).toFixed(2)}%` : p.value.toFixed(2)}
          </span>
        </div>
      ))}
    </div>
  );
}

// Donut of weights by category (asset class / instrument).
export function AllocationDonut({
  data,
  height = 220,
}: {
  data: { name: string; value: number }[];
  height?: number;
}) {
  const rows = data.filter((d) => d.value > 0.0005);
  return (
    <div style={{ width: "100%", height }}>
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={rows}
            dataKey="value"
            nameKey="name"
            innerRadius="55%"
            outerRadius="82%"
            paddingAngle={1.5}
            stroke={LFG.paper}
            strokeWidth={1.5}
          >
            {rows.map((_, i) => (
              <Cell key={i} fill={chartColor(i)} />
            ))}
          </Pie>
          <Tooltip content={<TooltipBox />} />
          <Legend
            verticalAlign="middle"
            align="right"
            layout="vertical"
            iconType="square"
            wrapperStyle={{ fontSize: 11, color: LFG.ink }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

// Horizontal bars for a single series (e.g. risk contributions).
export function HBars({
  data,
  height = 220,
  color = LFG.burgundy,
}: {
  data: { name: string; value: number }[];
  height?: number;
  color?: string;
}) {
  return (
    <div style={{ width: "100%", height }}>
      <ResponsiveContainer>
        <BarChart data={data} layout="vertical" margin={{ left: 8, right: 16, top: 4, bottom: 4 }}>
          <XAxis type="number" tickFormatter={pctTick} tick={axisStyle} stroke={LFG.line} />
          <YAxis type="category" dataKey="name" width={92} tick={axisStyle} stroke={LFG.line} />
          <Tooltip cursor={{ fill: LFG.cream }} content={<TooltipBox />} />
          <Bar dataKey="value" fill={color} radius={[0, 2, 2, 0]} barSize={14} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

// Grouped horizontal bars: ATTUALE vs PROPOSTA per instrument.
export function CurrentVsProposed({
  data,
  height = 260,
}: {
  data: { name: string; current: number; proposed: number }[];
  height?: number;
}) {
  return (
    <div style={{ width: "100%", height }}>
      <ResponsiveContainer>
        <BarChart data={data} layout="vertical" margin={{ left: 8, right: 16, top: 4, bottom: 4 }}>
          <XAxis type="number" tickFormatter={pctTick} tick={axisStyle} stroke={LFG.line} />
          <YAxis type="category" dataKey="name" width={92} tick={axisStyle} stroke={LFG.line} />
          <Tooltip cursor={{ fill: LFG.cream }} content={<TooltipBox />} />
          <Legend iconType="square" wrapperStyle={{ fontSize: 11, color: LFG.ink }} />
          <Bar
            dataKey="current"
            name="Attuale"
            fill={LFG.taupe}
            radius={[0, 2, 2, 0]}
            barSize={9}
          />
          <Bar
            dataKey="proposed"
            name="Proposta"
            fill={LFG.burgundy}
            radius={[0, 2, 2, 0]}
            barSize={9}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

// Diverging bars for deltas (proposed − current): teal = up, burgundy = down.
export function DeltaBars({
  data,
  height = 220,
}: {
  data: { name: string; value: number }[];
  height?: number;
}) {
  return (
    <div style={{ width: "100%", height }}>
      <ResponsiveContainer>
        <BarChart data={data} layout="vertical" margin={{ left: 8, right: 16, top: 4, bottom: 4 }}>
          <XAxis type="number" tickFormatter={pctTick} tick={axisStyle} stroke={LFG.line} />
          <YAxis type="category" dataKey="name" width={92} tick={axisStyle} stroke={LFG.line} />
          <Tooltip cursor={{ fill: LFG.cream }} content={<TooltipBox />} />
          <Bar dataKey="value" radius={[0, 2, 2, 0]} barSize={12}>
            {data.map((d, i) => (
              <Cell key={i} fill={d.value >= 0 ? POSITIVE : NEGATIVE} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
