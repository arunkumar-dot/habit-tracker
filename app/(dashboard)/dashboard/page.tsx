"use client";

import { useUser, RedirectToSignIn } from "@clerk/nextjs";
import { DashboardContentSkeleton } from "@/components/ui/skeleton";
import { UpNextCard } from "@/components/dashboard/up-next-card";
import { TodaysHabits } from "@/components/dashboard/todays-habits";
import { WeeklyHeatmap } from "@/components/dashboard/weekly-heatmap";

export default function DashboardPage() {
  const { isLoaded, isSignedIn } = useUser();

  if (!isLoaded) return <DashboardContentSkeleton />;
  if (!isSignedIn) return <RedirectToSignIn />;

  return (
    <>
      <UpNextCard />
      <TodaysHabits />
      <WeeklyHeatmap />
    </>
  );
}
