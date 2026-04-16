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
      fill="#C2410C"
      stroke="var(--bg-elevated, #FFFFFF)"
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
          stroke="var(--border-subtle, #E8E3DA)"
          vertical={false}
        />
        <XAxis
          dataKey="label"
          tick={{ fill: "#8A8680", fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          interval={tickInterval}
        />
        <YAxis
          domain={[0, 100]}
          tickFormatter={(v: number) => `${v}%`}
          tick={{ fill: "#8A8680", fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          width={36}
        />
        <Tooltip
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          formatter={(value: any) => [`${value}%`, "Completion"]}
          contentStyle={{
            background: "var(--bg-elevated, #FFFFFF)",
            border: "1px solid var(--border-subtle, #E8E3DA)",
            borderRadius: 12,
            color: "var(--text-primary, #1C1B18)",
            fontSize: 12,
          }}
        />
        <Line
          type="monotone"
          dataKey="rate"
          stroke="#C2410C"
          strokeWidth={2}
          dot={false}
          activeDot={<NoActiveDot />}
          animationDuration={600}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
