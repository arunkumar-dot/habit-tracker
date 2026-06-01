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

      {/* Heatmap — has its own overflow-x-auto */}
      <Heatmap
        startDate={range.startDate}
        endDate={range.endDate}
        cellSize={11}
      />

      {/* Legend */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          marginTop: 10,
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: 11,
            color: "var(--text-subtle)",
          }}
        >
          Less
        </span>
        {["#F3EFE8", "#E5C9A8", "#C8956A", "#A0622A", "#7C2D12"].map((color) => (
          <div
            key={color}
            style={{ width: 11, height: 11, borderRadius: 2, background: color }}
          />
        ))}
        <span
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: 11,
            color: "var(--text-subtle)",
          }}
        >
          More
        </span>
      </div>
    </section>
  );
}
