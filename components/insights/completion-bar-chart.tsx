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
          stroke="var(--border-subtle, #E8E3DA)"
          vertical={false}
        />
        <XAxis
          dataKey="day"
          tick={{ fill: "#8A8680", fontSize: 11 }}
          axisLine={false}
          tickLine={false}
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
          cursor={{ fill: "rgba(194,65,12,0.06)" }}
        />
        <Bar
          dataKey="rate"
          name="Completion"
          fill="#C2410C"
          radius={[6, 6, 0, 0]}
          maxBarSize={40}
          animationDuration={600}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
