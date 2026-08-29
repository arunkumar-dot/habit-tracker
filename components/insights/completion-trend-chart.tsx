"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useTheme, THEME_PALETTES } from "@/components/providers/theme-provider";

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

export function CompletionTrendChart({ data }: CompletionTrendChartProps) {
  const { theme, palette } = useTheme();
  const isDark = theme === "dark";
  const activePaletteInfo = THEME_PALETTES.find((p) => p.id === palette) ?? THEME_PALETTES[0];
  const accent = isDark ? activePaletteInfo.accentDark : activePaletteInfo.accentLight;

  const chartData = buildTrendData(data);
  const tickInterval = data.length > 14 ? Math.ceil(data.length / 7) - 1 : 0;

  return (
    <ResponsiveContainer width="100%" height={200}>
      <LineChart data={chartData}>
        <CartesianGrid
          strokeDasharray="3 3"
          stroke={isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)"}
          vertical={false}
        />
        <XAxis
          dataKey="label"
          interval={tickInterval}
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
        />
        <Line
          type="monotone"
          dataKey="rate"
          name="Completion"
          stroke={accent}
          strokeWidth={2.5}
          dot={false}
          activeDot={{
            r: 5,
            fill: accent,
            stroke: isDark ? "#121626" : "#FFFFFF",
            strokeWidth: 2,
          }}
          animationDuration={600}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
