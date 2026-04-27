"use client";

import { useState, useCallback } from "react";
import { useHeatmapData } from "@/hooks/useHeatmapData";
import { cellStyle } from "@/lib/heatmap";

// ── Constants ─────────────────────────────────────────────────────────────────

const CELL_SIZE = 12;
const CELL_GAP = 3;
const CELL_STEP = CELL_SIZE + CELL_GAP;
const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;
// Only render labels for Mon, Wed, Fri rows to keep it tidy
const LABELED_ROWS = new Set([1, 3, 5]);

// ── Tooltip ───────────────────────────────────────────────────────────────────

interface TooltipState {
  date: string;
  count: number;
  x: number;
  y: number;
}

function formatTooltip(date: string, count: number): string {
  const d = new Date(date + "T00:00:00");
  const label = d.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  return count === 0
    ? `${label} — no completions`
    : `${label} — ${count} habit${count === 1 ? "" : "s"} completed`;
}

// ── Skeleton ──────────────────────────────────────────────────────────────────

function HeatmapSkeleton() {
  return (
    <div className="animate-pulse" style={{ height: 108 }}>
      <div
        className="h-full w-full rounded-md"
        style={{ background: "var(--bg-sunken)" }}
      />
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

interface HeatmapProps {
  /** Called when the user clicks a cell — passes the ISO date string */
  onSelectDate?: (date: string) => void;
  /** Currently selected date (ISO) — highlights the matching cell */
  selectedDate?: string;
  /** Number of days to show. Defaults to 365. */
  days?: number;
}

export function Heatmap({ onSelectDate, selectedDate, days = 365 }: HeatmapProps) {
  const { grid, isLoading } = useHeatmapData(days);
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);

  const handleMouseEnter = useCallback(
    (e: React.MouseEvent<HTMLDivElement>, date: string, count: number) => {
      const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
      const parentRect = (
        e.currentTarget.closest("[data-heatmap-grid]") as HTMLDivElement
      )?.getBoundingClientRect();
      setTooltip({
        date,
        count,
        x: rect.left - (parentRect?.left ?? 0) + CELL_SIZE / 2,
        y: rect.top - (parentRect?.top ?? 0) - 8,
      });
    },
    []
  );

  const handleMouseLeave = useCallback(() => setTooltip(null), []);

  if (isLoading) return <HeatmapSkeleton />;
  if (!grid) return null;

  const DAY_LABEL_WIDTH = 28;
  const totalWidth = DAY_LABEL_WIDTH + grid.weeks.length * CELL_STEP;
  // 7 rows × CELL_STEP minus trailing gap
  const gridHeight = 7 * CELL_STEP - CELL_GAP;

  return (
    <div>
      {/* Scrollable wrapper */}
      <div className="overflow-x-auto pb-1">
        {/* Outer container: relative so tooltip can be absolute inside */}
        <div
          data-heatmap-grid
          className="relative inline-block"
          style={{ minWidth: totalWidth }}
        >
          {/* ── Month labels row ───────────────────────────────────────── */}
          <div
            className="flex mb-1"
            style={{ paddingLeft: DAY_LABEL_WIDTH, height: 16 }}
          >
            {grid.monthLabels.map(({ label, weekIndex }, i) => {
              const nextIndex =
                i + 1 < grid.monthLabels.length
                  ? grid.monthLabels[i + 1].weekIndex
                  : grid.weeks.length;
              const spanWeeks = nextIndex - weekIndex;
              return (
                <div
                  key={`${label}-${weekIndex}`}
                  style={{
                    width: spanWeeks * CELL_STEP,
                    flexShrink: 0,
                    fontFamily: "var(--font-mono)",
                    fontSize: 10,
                    color: "var(--text-tertiary)",
                    lineHeight: "16px",
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                  }}
                >
                  {label}
                </div>
              );
            })}
          </div>

          {/* ── Grid body: day labels + cell columns ──────────────────── */}
          <div className="flex gap-0">
            {/* Day labels column */}
            <div
              className="flex flex-col flex-shrink-0"
              style={{
                width: DAY_LABEL_WIDTH,
                gap: CELL_GAP,
              }}
            >
              {DAY_LABELS.map((label, row) => (
                <div
                  key={label}
                  style={{
                    height: CELL_SIZE,
                    fontSize: 9,
                    lineHeight: `${CELL_SIZE}px`,
                    color: LABELED_ROWS.has(row)
                      ? "var(--text-tertiary)"
                      : "transparent",
                    fontFamily: "var(--font-mono)",
                    userSelect: "none",
                  }}
                >
                  {label}
                </div>
              ))}
            </div>

            {/* Week columns */}
            <div className="flex" style={{ gap: CELL_GAP }}>
              {grid.weeks.map((week, wi) => (
                <div
                  key={wi}
                  className="flex flex-col"
                  style={{ gap: CELL_GAP }}
                >
                  {week.map((cell, di) => {
                    const isSelected = cell.date !== null && cell.date === selectedDate;
                    return (
                      <div
                        key={di}
                        style={{
                          width: CELL_SIZE,
                          height: CELL_SIZE,
                          borderRadius: 3,
                          cursor: cell.date ? "pointer" : "default",
                          outline: isSelected
                            ? "2px solid var(--accent)"
                            : "none",
                          outlineOffset: 1,
                          transition: "opacity 100ms",
                          ...cellStyle(cell.date ? cell.level : 0),
                        }}
                        onMouseEnter={
                          cell.date
                            ? (e) => handleMouseEnter(e, cell.date!, cell.count)
                            : undefined
                        }
                        onMouseLeave={cell.date ? handleMouseLeave : undefined}
                        onClick={
                          cell.date && onSelectDate
                            ? () => onSelectDate(cell.date!)
                            : undefined
                        }
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          {/* ── Floating tooltip ──────────────────────────────────────── */}
          {tooltip && (
            <div
              style={{
                position: "absolute",
                left: tooltip.x,
                top: tooltip.y,
                transform: "translate(-50%, -100%)",
                pointerEvents: "none",
                zIndex: 50,
                background: "var(--bg-elevated)",
                border: "1px solid var(--border-default)",
                borderRadius: "var(--radius-sm)",
                padding: "4px 8px",
                fontSize: 11,
                fontFamily: "var(--font-sans)",
                color: "var(--text-primary)",
                whiteSpace: "nowrap",
                boxShadow: "var(--shadow-md)",
              }}
            >
              {formatTooltip(tooltip.date, tooltip.count)}
            </div>
          )}
        </div>
      </div>

      {/* ── Legend ─────────────────────────────────────────────────────── */}
      <div
        className="flex items-center gap-1.5 mt-2"
        style={{ paddingLeft: 28 }}
      >
        <span
          style={{
            fontSize: 10,
            color: "var(--text-tertiary)",
            fontFamily: "var(--font-mono)",
          }}
        >
          Less
        </span>
        {([0, 1, 2, 3, 4] as const).map((level) => (
          <div
            key={level}
            style={{
              width: CELL_SIZE,
              height: CELL_SIZE,
              borderRadius: 3,
              ...cellStyle(level),
            }}
          />
        ))}
        <span
          style={{
            fontSize: 10,
            color: "var(--text-tertiary)",
            fontFamily: "var(--font-mono)",
          }}
        >
          More
        </span>
      </div>
    </div>
  );
}
