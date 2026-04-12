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
 * Parses "HH:MM" time string into minutes since midnight.
 */
export function parseTimeToMinutes(time: string): number {
  const [hours, minutes] = time.split(":").map(Number);
  return (hours ?? 0) * 60 + (minutes ?? 0);
}

/**
 * Converts minutes since midnight to "HH:MM" string.
 */
export function minutesToTime(minutes: number): string {
  const h = Math.floor(minutes / 60)
    .toString()
    .padStart(2, "0");
  const m = (minutes % 60).toString().padStart(2, "0");
  return `${h}:${m}`;
}

/**
 * Formats "HH:MM" (24-hour) to human-readable "h:MM AM/PM".
 * e.g. "14:30" → "2:30 PM", "06:05" → "6:05 AM"
 */
export function formatDisplayTime(time: string): string {
  const [hoursStr, minutesStr] = time.split(":");
  const hours = parseInt(hoursStr ?? "0", 10);
  const minutes = minutesStr ?? "00";
  const ampm = hours >= 12 ? "PM" : "AM";
  const displayHours = hours % 12 || 12;
  return `${displayHours}:${minutes} ${ampm}`;
}

/**
 * Formats a time range "HH:MM – HH:MM" to "h:MM – h:MM AM/PM".
 * e.g. "06:20", "06:35" → "6:20–6:35 AM"
 */
export function formatTimeRange(startTime: string, endTime: string): string {
  const startMins = parseTimeToMinutes(startTime);
  const endMins = parseTimeToMinutes(endTime);

  const [startH, startM] = startTime.split(":").map(Number);
  const [endH, endM] = endTime.split(":").map(Number);
  const startAmpm = (startH ?? 0) >= 12 ? "PM" : "AM";
  const endAmpm = (endH ?? 0) >= 12 ? "PM" : "AM";

  const startDisplay = `${(startH ?? 0) % 12 || 12}:${String(startM ?? 0).padStart(2, "0")}`;
  const endDisplay = `${(endH ?? 0) % 12 || 12}:${String(endM ?? 0).padStart(2, "0")}`;

  if (startAmpm === endAmpm) {
    return `${startDisplay}–${endDisplay} ${endAmpm}`;
  }
  return `${startDisplay} ${startAmpm}–${endDisplay} ${endAmpm}`;
}

/**
 * Returns the duration in minutes between two "HH:MM" times.
 */
export function getDurationMinutes(startTime: string, endTime: string): number {
  return parseTimeToMinutes(endTime) - parseTimeToMinutes(startTime);
}

/**
 * Formats duration minutes into human-readable string.
 * e.g. 90 → "1h 30m", 45 → "45m"
 */
export function formatDuration(minutes: number): string {
  if (minutes <= 0) return "0m";
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
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
 * Returns current minutes since midnight (for timeline positioning).
 */
export function getCurrentMinutes(): number {
  const now = new Date();
  return now.getHours() * 60 + now.getMinutes();
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
