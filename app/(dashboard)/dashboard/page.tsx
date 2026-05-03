"use client";

import { useMemo } from "react";
import { useUser, RedirectToSignIn } from "@clerk/nextjs";
import { DashboardContentSkeleton } from "@/components/ui/skeleton";
import { DailyCheckInModal } from "@/components/retention/daily-check-in-modal";
import { UpNextCard } from "@/components/dashboard/up-next-card";
import { TodaysHabits } from "@/components/dashboard/todays-habits";
import { WeeklyHeatmap } from "@/components/dashboard/weekly-heatmap";
import { useHabits } from "@/hooks/use-habits";
import { useCompletionsForDate } from "@/hooks/use-completions";
import { today } from "@/lib/date-utils";

export default function DashboardPage() {
  const { isLoaded, isSignedIn } = useUser();

  // Minimal data needed by DailyCheckInModal — new components fetch their own
  const { habits } = useHabits();
  const { completedHabitIds } = useCompletionsForDate(today());

  const allDone = useMemo(
    () =>
      (habits?.length ?? 0) > 0 &&
      habits?.every((h) => completedHabitIds.has(h._id)) === true,
    [habits, completedHabitIds]
  );

  if (!isLoaded) return <DashboardContentSkeleton />;
  if (!isSignedIn) return <RedirectToSignIn />;

  return (
    <>
      <DailyCheckInModal allHabitsDone={allDone} />
      <UpNextCard />
      <TodaysHabits />
      <WeeklyHeatmap />
    </>
  );
}
