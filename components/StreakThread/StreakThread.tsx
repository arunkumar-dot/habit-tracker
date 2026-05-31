"use client";

import { useMemo } from "react";
import { parseISO, format, getDay } from "date-fns";

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

export type DayStatus = "completed" | "missed" | "today" | "future";

export interface StreakDay {
  date: string;      // ISO date
  status: DayStatus;
  color?: string;    // optional habit color; falls back to var(--text-primary)
}

export interface StreakThreadProps {
  days: StreakDay[];
  variant: "week" | "month";
  tone?: "default" | "space";
  className?: string;
  ariaLabel?: string;
}

// ─────────────────────────────────────────────
// Variant config
// ─────────────────────────────────────────────

const VARIANT_CONFIG = {
  week: {
    height:       48,
    viewBox:      "0 0 700 48",
    expectedDays: 7,
    xStart:       16,
    xEnd:         684,
  },
  month: {
    height:       72,
    viewBox:      "0 0 1200 72",
    expectedDays: 30,
    xStart:       16,
    xEnd:         1184,
  },
} as const satisfies Record<
  "week" | "month",
  { height: number; viewBox: string; expectedDays: number; xStart: number; xEnd: number }
>;

// ─────────────────────────────────────────────
// Layout constants
// ─────────────────────────────────────────────

const NODE_Y = 20;

// Week labels: day letters sit at y=34, "today" at y=46
const WEEK_DAY_LABEL_Y  = 34;
const WEEK_TODAY_Y      = 46;

// Month labels: day numbers at y=36, "today" at y=48 (labeled) or y=34 (unlabeled)
const MONTH_DAY_LABEL_Y        = 36;
const MONTH_TODAY_AT_LABELED_Y = 48; // 2px below the 10px day-number text (36 + 10 + 2)
const MONTH_TODAY_ALONE_Y      = 34; // right below the ring when no day-number label present

const DAY_LETTERS = ["S", "M", "T", "W", "T", "F", "S"] as const;

// Month variant: render a day-number label only for these positions (0-based)
// Corresponds to "day 1, 5, 10, 15, 20, 25, 30" counted from left.
const MONTH_LABELED_INDICES = new Set([0, 4, 9, 14, 19, 24, 29]);

// ─────────────────────────────────────────────
// Seeded RNG — deterministic from a date string
// ─────────────────────────────────────────────

function hashString(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

function seededFloat(seed: number): number {
  const x = Math.sin(seed + 1) * 10000;
  return x - Math.floor(x);
}

// ─────────────────────────────────────────────
// Shared helpers
// ─────────────────────────────────────────────

/** Build a cubic-Bezier path through evenly-spaced x positions with ±1.5px y deviations. */
function buildThreadPath(xs: number[], deviations: number[]): string {
  const pts = xs.map((x, i) => ({ x, y: NODE_Y + deviations[i] }));
  const tension = xs.length > 1 ? (xs[1] - xs[0]) / 3 : 0;

  let d = `M ${pts[0].x.toFixed(2)},${pts[0].y.toFixed(2)}`;
  for (let i = 1; i < pts.length; i++) {
    const p0 = pts[i - 1];
    const p1 = pts[i];
    d +=
      ` C ${(p0.x + tension).toFixed(2)},${p0.y.toFixed(2)}` +
      ` ${(p1.x - tension).toFixed(2)},${p1.y.toFixed(2)}` +
      ` ${p1.x.toFixed(2)},${p1.y.toFixed(2)}`;
  }
  return d;
}

/** Render the status-appropriate circle for a single node. */
function NodeCircle({
  day,
  cx,
  cy,
  tone = "default",
}: {
  day: StreakDay;
  cx: number;
  cy: number;
  tone?: "default" | "space";
}): React.ReactElement {
  switch (day.status) {
    case "completed":
      return tone === "space" ? (
        <circle
          cx={cx}
          cy={cy}
          r={4}
          fill={day.color ?? "var(--plasma-green)"}
          style={{ filter: "drop-shadow(0 0 4px rgba(16, 185, 129, 0.45))" }}
        />
      ) : (
        <circle cx={cx} cy={cy} r={4} fill={day.color ?? "var(--text-primary)"} />
      );
    case "missed":
      // --border-strong doesn't exist in this token set; #C8C2B8 is a warm
      // mid-gray that reads clearly as a speck on the cream background.
      return <circle cx={cx} cy={cy} r={1.5} fill="var(--border-strong, #C8C2B8)" />;
    case "today":
      return tone === "space" ? (
        <circle
          className="rpg-shield-pulse"
          cx={cx}
          cy={cy}
          r={5}
          fill="var(--accent-soft)"
          stroke="var(--accent)"
          strokeWidth={1.5}
          style={{ transformBox: "fill-box", transformOrigin: "center" }}
        />
      ) : (
        <circle cx={cx} cy={cy} r={5} fill="none" stroke="var(--accent)" strokeWidth={1.5} />
      );
    case "future":
      return <circle cx={cx} cy={cy} r={1} fill="var(--border-subtle)" />;
  }
}

// ─────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────

export function StreakThread({
  days,
  variant,
  tone = "default",
  className,
  ariaLabel,
}: StreakThreadProps) {
  const config = VARIANT_CONFIG[variant];

  if (process.env.NODE_ENV !== "production" && days.length !== config.expectedDays) {
    console.warn(
      `[StreakThread] expected ${config.expectedDays} days for ${variant} variant, got ${days.length}`
    );
  }

  const count = days.length;
  const step  = count > 1 ? (config.xEnd - config.xStart) / (count - 1) : 0;
  const xs    = days.map((_, i) => config.xStart + i * step);

  const completedCount = days.filter((d) => d.status === "completed").length;
  const totalCount     = days.length;
  const descText =
    variant === "week"
      ? `${completedCount} of ${totalCount} days completed this week`
      : `${completedCount} of ${totalCount} days completed this month`;

  const { pathD, deviations } = useMemo(() => {
    const seed = hashString(days[0]?.date ?? "");
    const devs = days.map((_, i) => (seededFloat(seed + i) * 2 - 1) * 0.75);
    return { pathD: buildThreadPath(xs, devs), deviations: devs };
    // xs is recalculated from days each render; days is the true dep.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [days]);

  const defaultLabel =
    variant === "week"
      ? "Habit completion over the last 7 days"
      : "Habit completion over the last 30 days";

  return (
    <div className={className} style={{ width: "100%" }}>
      <svg
        viewBox={config.viewBox}
        preserveAspectRatio="xMidYMid meet"
        width="100%"
        height={config.height}
        role="img"
        focusable="false"
        aria-label={ariaLabel ?? defaultLabel}
      >
        {/* Screen-reader description — not visually rendered */}
        <desc>{descText}</desc>

        {/* Thread line — rendered first so nodes appear on top */}
        <path
          d={pathD}
          fill="none"
          stroke={tone === "space" ? "var(--nebula-purple)" : "var(--text-tertiary)"}
          strokeWidth={tone === "space" ? 1.75 : 1.5}
          strokeLinecap="round"
          opacity={tone === "space" ? 0.45 : 1}
        />

        {days.map((day, i) => {
          const x          = xs[i];
          const cy         = NODE_Y + deviations[i];
          const titleText  = `${format(parseISO(day.date), "EEEE, MMM d")} — ${day.status}`;

          if (variant === "week") {
            const dow = getDay(parseISO(day.date));
            return (
              <g key={day.date}>
                <title>{titleText}</title>
                <NodeCircle day={day} cx={x} cy={cy} tone={tone} />
                <text
                  x={x}
                  y={WEEK_DAY_LABEL_Y}
                  textAnchor="middle"
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 10,
                    fill: "var(--text-tertiary)",
                    textTransform: "uppercase",
                  }}
                >
                  {DAY_LETTERS[dow]}
                </text>
                {day.status === "today" && (
                  <text
                    x={x}
                    y={WEEK_TODAY_Y}
                    textAnchor="middle"
                    style={{
                      fontFamily: "var(--font-display)",
                      fontStyle: "italic",
                      fontSize: 11,
                      fill: "var(--accent)",
                    }}
                  >
                    today
                  </text>
                )}
              </g>
            );
          }

          // ── month variant ──
          const isLabeled   = MONTH_LABELED_INDICES.has(i);
          const todayLabelY = isLabeled ? MONTH_TODAY_AT_LABELED_Y : MONTH_TODAY_ALONE_Y;

          return (
            <g key={day.date}>
              <title>{titleText}</title>
              <NodeCircle day={day} cx={x} cy={cy} tone={tone} />
              {isLabeled && (
                <text
                  x={x}
                  y={MONTH_DAY_LABEL_Y}
                  textAnchor="middle"
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 10,
                    fill: "var(--text-tertiary)",
                  }}
                >
                  {format(parseISO(day.date), "d")}
                </text>
              )}
              {day.status === "today" && (
                <text
                  x={x}
                  y={todayLabelY}
                  textAnchor="middle"
                  style={{
                    fontFamily: "var(--font-display)",
                    fontStyle: "italic",
                    fontSize: 11,
                    fill: "var(--accent)",
                  }}
                >
                  today
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
