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
import type { WeeklyData } from "@/types";

interface WeeklyChartProps {
  data: WeeklyData[];
}

export function WeeklyChart({ data }: WeeklyChartProps) {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data} barCategoryGap="30%">
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(42,42,62,0.8)" vertical={false} />
        <XAxis
          dataKey="label"
          tick={{ fill: "#94a3b8", fontSize: 11 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: "#94a3b8", fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          allowDecimals={false}
          width={24}
        />
        <Tooltip
          contentStyle={{
            background: "#1a1a28",
            border: "1px solid #2a2a3e",
            borderRadius: 12,
            color: "#e2e8f0",
            fontSize: 12,
          }}
          cursor={{ fill: "rgba(99,102,241,0.08)" }}
        />
        <Bar
          dataKey="completed"
          name="Completed"
          fill="#6366f1"
          radius={[6, 6, 0, 0]}
          maxBarSize={40}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
