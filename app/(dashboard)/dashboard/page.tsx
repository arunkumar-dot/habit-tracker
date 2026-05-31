"use client";

import { UpNextCard } from "@/components/dashboard/up-next-card";
import { TodaysHabits } from "@/components/dashboard/todays-habits";
import { WeeklyHeatmap } from "@/components/dashboard/weekly-heatmap";

export default function DashboardPage() {
  return (
    <>
      <UpNextCard />
      <TodaysHabits />
      <WeeklyHeatmap />
    </>
  );
}
