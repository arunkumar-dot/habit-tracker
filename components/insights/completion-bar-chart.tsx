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
import { useTheme, THEME_PALETTES } from "@/components/providers/theme-provider";
import type { DayStats } from "@/lib/insights";

interface CompletionBarChartProps {
  data: DayStats[];
}

export function CompletionBarChart({ data }: CompletionBarChartProps) {
  const { theme, palette } = useTheme();
  const isDark = theme === "dark";
  const activePaletteInfo = THEME_PALETTES.find((p) => p.id === palette) ?? THEME_PALETTES[0];
  const accent = isDark ? activePaletteInfo.accentDark : activePaletteInfo.accentLight;

  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data} barCategoryGap="30%">
        <CartesianGrid
          strokeDasharray="3 3"
          stroke={isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)"}
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
            background: isDark ? activePaletteInfo.bgDark : "#FFFFFF",
            border: `1px solid ${isDark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.1)"}`,
            borderRadius: 12,
            color: isDark ? "#F5F1EA" : "#1C1B18",
            fontSize: 12,
          }}
          cursor={{ fill: `${accent}15` }}
        />
        <Bar
          dataKey="rate"
          name="Completion"
          fill={accent}
          radius={[6, 6, 0, 0]}
          maxBarSize={40}
          animationDuration={600}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
