"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  DotProps,
} from "recharts";

interface TrendRow {
  date: string;
  completed: number;
  total: number;
}

interface CompletionTrendChartProps {
  data: TrendRow[];
}

function buildTrendData(rows: TrendRow[]) {
  return rows.map((r) => {
    const d = new Date(r.date + "T00:00:00");
    const label = d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
    const rate = r.total > 0 ? Math.round((r.completed / r.total) * 100) : 0;
    return { label, rate };
  });
}

// Only show a dot when the user hovers (active dot)
function NoActiveDot(props: DotProps & { value?: number }) {
  if (props.value === undefined) return null;
  return (
    <circle
      cx={props.cx}
      cy={props.cy}
      r={4}
      fill="#6366f1"
      stroke="var(--bg-elevated, #1a1a28)"
      strokeWidth={2}
    />
  );
}

export function CompletionTrendChart({ data }: CompletionTrendChartProps) {
  const chartData = buildTrendData(data);

  // Thin out X-axis labels when there are many data points
  const tickInterval = data.length > 14 ? Math.ceil(data.length / 7) - 1 : 0;

  return (
    <ResponsiveContainer width="100%" height={200}>
      <LineChart data={chartData}>
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="rgba(99,102,241,0.1)"
          vertical={false}
        />
        <XAxis
          dataKey="label"
          tick={{ fill: "#94a3b8", fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          interval={tickInterval}
        />
        <YAxis
          domain={[0, 100]}
          tickFormatter={(v: number) => `${v}%`}
          tick={{ fill: "#94a3b8", fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          width={36}
        />
        <Tooltip
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          formatter={(value: any) => [`${value}%`, "Completion"]}
          contentStyle={{
            background: "var(--bg-elevated, #1a1a28)",
            border: "1px solid var(--border, #2a2a3e)",
            borderRadius: 12,
            color: "var(--text-primary, #e2e8f0)",
            fontSize: 12,
          }}
        />
        <Line
          type="monotone"
          dataKey="rate"
          stroke="#6366f1"
          strokeWidth={2}
          dot={false}
          activeDot={<NoActiveDot />}
          animationDuration={600}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
