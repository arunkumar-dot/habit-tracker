import { describe, it, expect, vi, afterEach } from "vitest";
import { render } from "@testing-library/react";
import { StreakThread } from "./StreakThread";
import type { StreakDay } from "./StreakThread";

// ─────────────────────────────────────────────
// Fixed fixtures — not tied to today's date
// ─────────────────────────────────────────────

const WEEK_DAYS: StreakDay[] = [
  { date: "2026-04-10", status: "completed", color: "var(--accent)" },
  { date: "2026-04-11", status: "completed", color: "var(--accent)" },
  { date: "2026-04-12", status: "missed" },
  { date: "2026-04-13", status: "completed", color: "var(--accent)" },
  { date: "2026-04-14", status: "missed" },
  { date: "2026-04-15", status: "completed", color: "var(--accent)" },
  { date: "2026-04-16", status: "today" },
];

function makeMonthDays(): StreakDay[] {
  const base = new Date("2026-04-16");
  const days: StreakDay[] = [];
  for (let i = 29; i >= 1; i--) {
    const d = new Date(base);
    d.setDate(d.getDate() - i);
    days.push({
      date: d.toISOString().slice(0, 10),
      status: i % 3 === 0 ? "missed" : "completed",
      color: "var(--accent)",
    });
  }
  days.push({ date: "2026-04-16", status: "today" });
  return days;
}

const MONTH_DAYS = makeMonthDays();

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────

/** All <circle> elements that are direct children of <g> nodes (excludes defs). */
function nodeCircles(container: HTMLElement): Element[] {
  return Array.from(container.querySelectorAll("g > circle"));
}

// ─────────────────────────────────────────────
// Tests
// ─────────────────────────────────────────────

describe("StreakThread", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  // 1. Week variant — 7 node circles
  it("renders exactly 7 node circles for the week variant", () => {
    const { container } = render(<StreakThread days={WEEK_DAYS} variant="week" />);
    expect(nodeCircles(container)).toHaveLength(7);
  });

  // 2. Month variant — 30 node circles
  it("renders exactly 30 node circles for the month variant", () => {
    const { container } = render(<StreakThread days={MONTH_DAYS} variant="month" />);
    expect(nodeCircles(container)).toHaveLength(30);
  });

  // 3. Exactly one "today" serif label
  it("renders exactly one 'today' label when one day has status today", () => {
    const { getAllByText } = render(<StreakThread days={WEEK_DAYS} variant="week" />);
    expect(getAllByText("today")).toHaveLength(1);
  });

  // 4. Node radii match status
  it("renders missed nodes with r=1.5, completed with r=4, today with r=5", () => {
    const { container } = render(<StreakThread days={WEEK_DAYS} variant="week" />);
    const circles = nodeCircles(container);

    // WEEK_DAYS order: completed, completed, missed, completed, missed, completed, today
    expect(circles[0]).toHaveAttribute("r", "4");    // completed
    expect(circles[1]).toHaveAttribute("r", "4");    // completed
    expect(circles[2]).toHaveAttribute("r", "1.5");  // missed
    expect(circles[3]).toHaveAttribute("r", "4");    // completed
    expect(circles[4]).toHaveAttribute("r", "1.5");  // missed
    expect(circles[5]).toHaveAttribute("r", "4");    // completed
    expect(circles[6]).toHaveAttribute("r", "5");    // today
  });

  // 5. aria-label — from props and default
  it("uses the ariaLabel prop when provided", () => {
    const { getByRole } = render(
      <StreakThread days={WEEK_DAYS} variant="week" ariaLabel="Custom label" />
    );
    expect(getByRole("img")).toHaveAttribute("aria-label", "Custom label");
  });

  it("falls back to the default aria-label for the week variant", () => {
    const { getByRole } = render(<StreakThread days={WEEK_DAYS} variant="week" />);
    expect(getByRole("img")).toHaveAttribute(
      "aria-label",
      "Habit completion over the last 7 days"
    );
  });

  it("falls back to the default aria-label for the month variant", () => {
    const { getByRole } = render(<StreakThread days={MONTH_DAYS} variant="month" />);
    expect(getByRole("img")).toHaveAttribute(
      "aria-label",
      "Habit completion over the last 30 days"
    );
  });

  // 6. Each node group has a <title> as first child with date + status
  it("renders a <title> as the first child of each node group", () => {
    const { container } = render(<StreakThread days={WEEK_DAYS} variant="week" />);
    const groups = Array.from(container.querySelectorAll("g"));
    for (const g of groups) {
      expect(g.firstElementChild?.tagName.toLowerCase()).toBe("title");
    }
  });

  it("formats the title text correctly for completed and today nodes", () => {
    const { container } = render(<StreakThread days={WEEK_DAYS} variant="week" />);
    const titles = Array.from(container.querySelectorAll("g > title"));
    expect(titles[0].textContent).toBe("Friday, Apr 10 — completed");
    expect(titles[6].textContent).toBe("Thursday, Apr 16 — today");
  });

  // 7. Wrong length → console.warn + still renders passed nodes
  it("logs a warning and renders 5 circles when 5 days are passed with variant='week'", () => {
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

    const shortDays: StreakDay[] = WEEK_DAYS.slice(0, 5);
    const { container } = render(<StreakThread days={shortDays} variant="week" />);

    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining("[StreakThread]")
    );
    expect(nodeCircles(container)).toHaveLength(5);
  });

  // 8. Custom color on a completed day is used as fill
  it("applies a custom color as the fill for completed nodes", () => {
    const days: StreakDay[] = WEEK_DAYS.map((d, i) =>
      i === 0 ? { ...d, status: "completed" as const, color: "#c0ffee" } : d
    );
    const { container } = render(<StreakThread days={days} variant="week" />);
    const circles = nodeCircles(container);
    expect(circles[0]).toHaveAttribute("fill", "#c0ffee");
  });
});
