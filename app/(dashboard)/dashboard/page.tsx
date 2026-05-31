"use client";

import { CharacterBanner } from "@/components/rpg/character-banner";
import { UpNextCard } from "@/components/dashboard/up-next-card";
import { TodaysHabits } from "@/components/dashboard/todays-habits";
import { StreakThreadCard } from "@/components/dashboard/streak-thread-card";
import { AchievementSpotlight } from "@/components/dashboard/achievement-spotlight";
import { WeeklyHeatmap } from "@/components/dashboard/weekly-heatmap";
import { useHabits } from "@/hooks/use-habits";
import { useCompletionsForDateRange } from "@/hooks/use-completions";
import { today } from "@/lib/date-utils";

export default function DashboardPage() {
  const dateStr = today();
  const year = new Date().getFullYear();
  const yearStart = `${year}-01-01`;
  const { habits, isLoading: habitsLoading } = useHabits();
  const { completions, isLoading: completionsLoading } = useCompletionsForDateRange(
    yearStart,
    dateStr
  );

  return (
    <>
      <CharacterBanner
        habits={habits}
        completions={completions}
        isLoading={habitsLoading || completionsLoading}
      />
      <UpNextCard />
      <TodaysHabits />
      <AchievementSpotlight />
      <StreakThreadCard completions={completions} isLoading={completionsLoading} />
      <WeeklyHeatmap />
    </>
  );
}
