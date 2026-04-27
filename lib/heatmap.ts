import { today, addDays } from "./date-utils";

// ── Types ────────────────────────────────────────────────────────────────────

export interface HeatmapCell {
  /** ISO date string, or null for out-of-range padding cells */
  date: string | null;
  count: number;
  /** 0 = empty, 1–4 = increasing intensity */
  level: 0 | 1 | 2 | 3 | 4;
}

export interface HeatmapGrid {
  /** weeks[colIndex] = array of 7 cells (Sun → Sat) */
  weeks: HeatmapCell[][];
  /** Ordered list of { label, weekIndex } for month labels along the top */
  monthLabels: { label: string; weekIndex: number }[];
}

// ── Helpers ──────────────────────────────────────────────────────────────────

/** Shift an ISO date string by `days` days using local calendar arithmetic. */
const shiftDate = addDays;

function getLevel(count: number): 0 | 1 | 2 | 3 | 4 {
  if (count === 0) return 0;
  if (count === 1) return 1;
  if (count <= 3) return 2;
  if (count <= 5) return 3;
  return 4;
}

function getDayOfWeek(isoDate: string): number {
  // Returns 0=Sun … 6=Sat
  return new Date(isoDate + "T00:00:00").getDay();
}

function getMonthAbbr(isoDate: string): string {
  return new Date(isoDate + "T00:00:00").toLocaleDateString("en-US", {
    month: "short",
  });
}

// ── Main builder ─────────────────────────────────────────────────────────────

/**
 * Builds a Sun–Sat week grid for the given date range.
 *
 * - Pads the first column back to the nearest Sunday before startDate.
 * - Pads the last column forward to the nearest Saturday after endDate.
 * - Days outside [startDate, endDate] are represented as null-date padding cells.
 */
export function buildHeatmapGrid(
  data: { date: string; count: number }[],
  startDate: string,
  endDate: string
): HeatmapGrid {
  const countMap = new Map(data.map((d) => [d.date, d.count]));

  // Snap grid start to the Sunday on or before startDate
  const startDow = getDayOfWeek(startDate);
  const gridStart = shiftDate(startDate, -startDow);

  // Snap grid end to the Saturday on or after endDate
  const endDow = getDayOfWeek(endDate);
  const gridEnd = shiftDate(endDate, 6 - endDow);

  const weeks: HeatmapCell[][] = [];
  const monthLabels: { label: string; weekIndex: number }[] = [];
  let seenMonths = new Set<string>();

  let cursor = gridStart;
  while (cursor <= gridEnd) {
    const week: HeatmapCell[] = [];
    const weekIndex = weeks.length;

    for (let dow = 0; dow < 7; dow++) {
      const isInRange = cursor >= startDate && cursor <= endDate;
      const count = isInRange ? (countMap.get(cursor) ?? 0) : 0;
      week.push({
        date: isInRange ? cursor : null,
        count,
        level: isInRange ? getLevel(count) : 0,
      });

      // Emit a month label on the first day (Sun) of a week that starts a new month
      if (dow === 0 && isInRange) {
        const monthKey = cursor.slice(0, 7); // "YYYY-MM"
        if (!seenMonths.has(monthKey)) {
          seenMonths.add(monthKey);
          monthLabels.push({ label: getMonthAbbr(cursor), weekIndex });
        }
      }

      cursor = shiftDate(cursor, 1);
    }

    weeks.push(week);
  }

  return { weeks, monthLabels };
}

// ── Colour helper (CSS-variable aware) ───────────────────────────────────────

const LEVEL_STYLES: Record<number, React.CSSProperties> = {
  0: { background: "var(--bg-sunken)" },
  1: { background: "rgba(194, 65, 12, 0.20)" },
  2: { background: "rgba(194, 65, 12, 0.45)" },
  3: { background: "rgba(194, 65, 12, 0.70)" },
  4: { background: "var(--accent)" },
};

export function cellStyle(level: 0 | 1 | 2 | 3 | 4): React.CSSProperties {
  return LEVEL_STYLES[level];
}

// ── Date range helpers ────────────────────────────────────────────────────────

export function lastNDays(n: number): { startDate: string; endDate: string } {
  const endDate = today();
  const startDate = shiftDate(endDate, -(n - 1));
  return { startDate, endDate };
}
