import { addDays, today } from "@/lib/date-utils";
import type { Habit, HabitCompletion } from "@/types";

export const QUEST_XP = 10;
export const DAILY_CLEAR_BONUS_XP = 25;
export const STREAK_BONUS_XP = 5;

export interface RpgProgress {
  totalXP: number;
  level: number;
  rankTitle: string;
  currentStreak: number;
  xpIntoLevel: number;
  xpForNextLevel: number;
  progressPercent: number;
}

export function getQuestCodename(title: string): string {
  const lower = title.toLowerCase();
  if (/(read|book|study|learn|course|research)/.test(lower)) return "Research Archives";
  if (/(meditat|pray|breath|focus|mind)/.test(lower)) return "Focus Training";
  if (/(run|walk|workout|gym|exercise|yoga|sport)/.test(lower)) return "Physical Conditioning";
  if (/(journal|write|log|reflect)/.test(lower)) return "Captain's Log";
  if (/(water|hydrate|drink)/.test(lower)) return "Life Support";
  if (/(wake|sleep|bed|morning)/.test(lower)) return "Launch Protocol";
  if (/(food|breakfast|lunch|dinner|meal|almond|eat)/.test(lower)) return "Fuel Calibration";
  return title;
}

export function getRankTitle(level: number, currentStreak: number): string {
  if (currentStreak >= 30) return "Titan";
  if (currentStreak >= 14) return "Nebula Explorer";
  if (currentStreak >= 7) return "Orbital Pathfinder";
  if (level >= 10) return "Star Commander";
  if (level >= 5) return "Void Navigator";
  return "Starkeeper";
}

export function deriveCurrentStreakFromDates(
  completedDates: string[],
  referenceDate = today()
): number {
  const uniqueDates = new Set(completedDates);
  let cursor = referenceDate;
  let streak = 0;

  while (uniqueDates.has(cursor)) {
    streak++;
    cursor = addDays(cursor, -1);
  }

  return streak;
}

export function deriveRpgProgress({
  habits,
  completions,
  referenceDate = today(),
}: {
  habits: Habit[] | undefined;
  completions: HabitCompletion[] | undefined;
  referenceDate?: string;
}): RpgProgress {
  const habitCount = habits?.length ?? 0;
  const uniqueHabitDays = new Set(
    (completions ?? []).map((completion) => `${completion.habitId as string}-${completion.date}`)
  );
  const completionsByDate = new Map<string, Set<string>>();

  for (const completion of completions ?? []) {
    const set = completionsByDate.get(completion.date) ?? new Set<string>();
    set.add(completion.habitId as string);
    completionsByDate.set(completion.date, set);
  }

  const dailyClearCount =
    habitCount > 0
      ? Array.from(completionsByDate.values()).filter((set) => set.size >= habitCount).length
      : 0;
  const currentStreak = deriveCurrentStreakFromDates(
    Array.from(completionsByDate.keys()),
    referenceDate
  );
  const streakBonusDays = Math.max(currentStreak - 3, 0);
  const totalXP =
    uniqueHabitDays.size * QUEST_XP +
    dailyClearCount * DAILY_CLEAR_BONUS_XP +
    streakBonusDays * STREAK_BONUS_XP;

  const level = Math.max(1, Math.floor(Math.sqrt(totalXP / 100)));
  const currentLevelFloor = level <= 1 ? 0 : level * level * 100;
  const nextLevelXP = (level + 1) * (level + 1) * 100;
  const xpIntoLevel = Math.max(totalXP - currentLevelFloor, 0);
  const xpForNextLevel = Math.max(nextLevelXP - currentLevelFloor, 1);

  return {
    totalXP,
    level,
    rankTitle: getRankTitle(level, currentStreak),
    currentStreak,
    xpIntoLevel,
    xpForNextLevel,
    progressPercent: Math.min((xpIntoLevel / xpForNextLevel) * 100, 100),
  };
}

export function buildWeeklyMissionDays({
  completions,
  referenceDate = today(),
}: {
  completions: HabitCompletion[] | undefined;
  referenceDate?: string;
}) {
  const completedDates = new Set((completions ?? []).map((completion) => completion.date));

  return Array.from({ length: 7 }, (_, index) => {
    const date = addDays(referenceDate, index - 6);
    return {
      date,
      status:
        date === referenceDate
          ? ("today" as const)
          : completedDates.has(date)
            ? ("completed" as const)
            : ("missed" as const),
      color: completedDates.has(date) ? "var(--plasma-green)" : undefined,
    };
  });
}
