"use client";

import { useMemo } from "react";
import { useQuery, useConvexAuth } from "convex/react";
import { api } from "@/convex/_generated/api";
import { buildHeatmapGrid, lastNDays } from "@/lib/heatmap";
import type { HeatmapGrid } from "@/lib/heatmap";

interface UseHeatmapDataResult {
  grid: HeatmapGrid | null;
  startDate: string;
  endDate: string;
  isLoading: boolean;
}

/**
 * Fetches aggregated completion counts for the last `days` days and returns
 * a pre-built HeatmapGrid ready for rendering.
 */
export function useHeatmapData(days = 365): UseHeatmapDataResult {
  const { isLoading: authLoading, isAuthenticated } = useConvexAuth();
  const { startDate, endDate } = useMemo(() => lastNDays(days), [days]);

  const raw = useQuery(
    api.completions.getHeatmapStats,
    !authLoading && isAuthenticated ? { startDate, endDate } : "skip"
  );

  const isLoading = authLoading || (isAuthenticated && raw === undefined);

  const grid = useMemo(() => {
    if (!raw) return null;
    return buildHeatmapGrid(raw, startDate, endDate);
  }, [raw, startDate, endDate]);

  return { grid, startDate, endDate, isLoading };
}
