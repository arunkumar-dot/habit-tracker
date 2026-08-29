"use client";

import { useMemo } from "react";
import { Heatmap } from "@/components/Heatmap";
import { today } from "@/lib/date-utils";

export function JourneyHeatmapSection() {
  const year = new Date().getFullYear();
  const range = useMemo(
    () => ({ startDate: `${year}-01-01`, endDate: `${year}-12-31` }),
    [year]
  );

  return (
    <section style={{ marginBottom: 40 }}>
      {/* Section label */}
      <p
        style={{
          margin: "0 0 14px",
          fontFamily: "var(--font-display)",
          fontStyle: "italic",
          fontSize: 18,
          color: "var(--text)",
        }}
      >
        Days you showed up.
      </p>

      {/* Heatmap — has its own overflow-x-auto & theme-reactive legend */}
      <Heatmap
        startDate={range.startDate}
        endDate={range.endDate}
        cellSize={11}
      />
    </section>
  );
}
