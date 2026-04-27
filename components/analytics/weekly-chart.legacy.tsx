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
import { useTheme } from "@/components/providers/theme-provider";
import type { WeeklyData } from "@/types";

interface WeeklyChartProps {
  data: WeeklyData[];
}

export function WeeklyChart({ data }: WeeklyChartProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // Use design tokens resolved to hex for Recharts (SVG attributes, not CSS)
  const accent      = isDark ? "#E86F3C" : "#C2410C";
  const gridColor   = isDark ? "#2E2825" : "#E8E3DA";
  const axisColor   = isDark ? "#8A8680" : "#8A8680";
  const tooltipBg   = isDark ? "#231E1B" : "#FFFFFF";
  const tooltipBorder = isDark ? "#2E2825" : "#E8E3DA";
  const tooltipText = isDark ? "#F5F1EA" : "#1C1B18";

  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data} barCategoryGap="30%">
        <CartesianGrid
          strokeDasharray="3 3"
          stroke={gridColor}
          vertical={false}
        />
        <XAxis
          dataKey="label"
          tick={{ fill: axisColor, fontSize: 11 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: axisColor, fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          allowDecimals={false}
          width={24}
        />
        <Tooltip
          contentStyle={{
            background: tooltipBg,
            border: `1px solid ${tooltipBorder}`,
            borderRadius: 10,
            color: tooltipText,
            fontSize: 12,
          }}
          cursor={{ fill: `${accent}10` }}
        />
        <Bar
          dataKey="completed"
          name="Completed"
          fill={accent}
          radius={[6, 6, 0, 0]}
          maxBarSize={40}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
