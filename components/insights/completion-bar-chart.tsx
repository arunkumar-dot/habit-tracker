"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { DayStats } from "@/lib/insights";

interface CompletionBarChartProps {
  data: DayStats[];
}

export function CompletionBarChart({ data }: CompletionBarChartProps) {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data} barCategoryGap="30%">
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="rgba(99,102,241,0.1)"
          vertical={false}
        />
        <XAxis
          dataKey="day"
          tick={{ fill: "#94a3b8", fontSize: 11 }}
          axisLine={false}
          tickLine={false}
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
          cursor={{ fill: "rgba(99,102,241,0.08)" }}
        />
        <Bar
          dataKey="rate"
          name="Completion"
          fill="#6366f1"
          radius={[6, 6, 0, 0]}
          maxBarSize={40}
          animationDuration={600}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
