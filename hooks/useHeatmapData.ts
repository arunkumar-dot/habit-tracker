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
 * Fetches aggregated completion counts for the given date range and returns
 * a pre-built HeatmapGrid ready for rendering.
 *
 * Pass `days` to use a rolling window ending today, or pass `startDate`/`endDate`
 * directly for a fixed range (e.g. the full calendar year including future dates).
 */
export function useHeatmapData(
  days?: number,
  explicitRange?: { startDate: string; endDate: string }
): UseHeatmapDataResult {
  const { isLoading: authLoading, isAuthenticated } = useConvexAuth();
  const { startDate, endDate } = useMemo(
    () => explicitRange ?? lastNDays(days ?? 365),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [explicitRange?.startDate, explicitRange?.endDate, days]
  );

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
