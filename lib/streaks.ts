import { format, subDays } from "date-fns";
import type { StreakDay } from "@/components/StreakThread/StreakThread";

// Deterministic pseudo-random number from a seed integer.
function seededRandom(seed: number): number {
  const x = Math.sin(seed + 1) * 10000;
  return x - Math.floor(x);
}

// TODO: replace with real completion data
export function getMockWeekDays(): StreakDay[] {
  const today = new Date();
  const days: StreakDay[] = [];

  // Build 7 days ending today (index 0 = oldest, index 6 = today)
  for (let i = 6; i >= 0; i--) {
    const date = subDays(today, i);
    const iso = format(date, "yyyy-MM-dd");

    if (i === 0) {
      days.push({ date: iso, status: "today" });
      continue;
    }

    // Seed per position → stable across renders. ~4/6 days completed.
    const r = seededRandom(i * 7);
    const status: StreakDay["status"] = r < 0.667 ? "completed" : "missed";
    days.push({ date: iso, status, color: "var(--accent)" });
  }

  return days;
}

// TODO: replace with real completion data
export function getMockMonthDays(): StreakDay[] {
  const today = new Date();
  const days: StreakDay[] = [];

  // Build 30 days ending today (index 0 = oldest, index 29 = today)
  for (let i = 29; i >= 0; i--) {
    const date = subDays(today, i);
    const iso = format(date, "yyyy-MM-dd");

    if (i === 0) {
      days.push({ date: iso, status: "today" });
      continue;
    }

    // Threshold 0.62 → ~62% completed, ~38% missed across the seed space.
    // Seeds are i*17 (prime multiplier avoids the clustering that i*30 produced).
    const r = seededRandom(i * 17);
    const status: StreakDay["status"] = r < 0.62 ? "completed" : "missed";
    days.push({ date: iso, status, color: "var(--accent)" });
  }

  // Log distribution in dev so it's easy to verify the mix visually.
  if (process.env.NODE_ENV !== "production") {
    const completed = days.filter((d) => d.status === "completed").length;
    const missed    = days.filter((d) => d.status === "missed").length;
    const todayDay  = days.filter((d) => d.status === "today").length;
    console.log(
      `[getMockMonthDays] ${completed} completed / ${missed} missed / ${todayDay} today` +
      ` (${Math.round(completed / days.length * 100)}% / ${Math.round(missed / days.length * 100)}% / ${Math.round(todayDay / days.length * 100)}%)`
    );
  }

  return days;
}
