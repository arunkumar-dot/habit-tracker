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
import type { WeeklyData } from "@/types";

interface WeeklyChartProps {
  data: WeeklyData[];
}

export function WeeklyChart({ data }: WeeklyChartProps) {
  const { theme, palette } = useTheme();
  const isDark = theme === "dark";

  const activePaletteInfo = THEME_PALETTES.find((p) => p.id === palette) ?? THEME_PALETTES[0];
  const accent = isDark ? activePaletteInfo.accentDark : activePaletteInfo.accentLight;
  const gridColor   = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)";
  const axisColor   = isDark ? "#8A8680" : "#8A8680";
  const tooltipBg   = isDark ? activePaletteInfo.bgDark : "#FFFFFF";
  const tooltipBorder = isDark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.1)";
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
