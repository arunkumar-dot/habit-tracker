/**
 * Returns today's date as "YYYY-MM-DD" in the user's local timezone.
 * Uses en-CA locale which reliably outputs YYYY-MM-DD format.
 */
export function today(): string {
  return new Date().toLocaleDateString("en-CA");
}

/**
 * Converts a Date object to "YYYY-MM-DD" string in local timezone.
 */
export function toDateString(date: Date): string {
  return date.toLocaleDateString("en-CA");
}

/**
 * Adds `n` days to a date string and returns the new date string.
 */
export function addDays(dateStr: string, n: number): string {
  const date = new Date(dateStr + "T00:00:00");
  date.setDate(date.getDate() + n);
  return toDateString(date);
}

/**
 * Formats a date string "YYYY-MM-DD" to a display label.
 * e.g. "Today", "Yesterday", or "Mon, Mar 27"
 */
export function formatDateLabel(dateStr: string): string {
  const todayStr = today();
  const yesterdayStr = addDays(todayStr, -1);

  if (dateStr === todayStr) return "Today";
  if (dateStr === yesterdayStr) return "Yesterday";

  const date = new Date(dateStr + "T00:00:00");
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

/**
 * Returns the ISO week number for a given date string "YYYY-MM-DD".
 */
export function getISOWeek(dateStr: string): number {
  const date = new Date(dateStr + "T00:00:00");
  const d = new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
  );
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(
    ((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7
  );
}

/**
 * Returns the ISO year for a given date (week year may differ from calendar year).
 */
export function getISOWeekYear(dateStr: string): number {
  const date = new Date(dateStr + "T00:00:00");
  const d = new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
  );
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  return d.getUTCFullYear();
}

/**
 * Returns a unique week identifier string like "2025-W12".
 */
export function getWeekId(dateStr: string): string {
  return `${getISOWeekYear(dateStr)}-W${String(getISOWeek(dateStr)).padStart(2, "0")}`;
}

/**
 * Returns the Monday of the ISO week containing the given date string.
 * e.g. "2026-04-02" (Thursday) → "2026-03-30" (Monday)
 */
export function getWeekStart(dateStr: string): string {
  const date = new Date(dateStr + "T00:00:00");
  const day = date.getDay(); // 0=Sun, 1=Mon, ..., 6=Sat
  const diff = day === 0 ? -6 : 1 - day; // Shift back to Monday
  date.setDate(date.getDate() + diff);
  return toDateString(date);
}
