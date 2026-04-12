"use client";

import { useMutation, useQuery, useConvexAuth } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useToast } from "@/components/ui/toast";
import { useConfetti } from "@/components/ui/confetti";
import { MILESTONES } from "@/lib/milestone-config";
import type { HabitCompletion, HabitId } from "@/types";
import type { Id } from "@/convex/_generated/dataModel";

// Module-level variable: set right before the mutation fires so the
// optimistic update callback (which must be pure / not access refs or Date.now)
// can read a stable timestamp without violating React Compiler purity rules.
let pendingToggleTimestamp = 0;

/**
 * Provides optimistic completion toggle for a habit on a given date.
 * The UI updates instantly without waiting for the server round-trip.
 * Shows achievement toasts + confetti burst when new milestones are unlocked.
 * Skips the query until Clerk has authenticated the user.
 */
export function useOptimisticCompletion(habitId: HabitId, date: string) {
  const { isLoading: authLoading, isAuthenticated } = useConvexAuth();
  const { showToast } = useToast();
  const { triggerConfetti } = useConfetti();

  const raw = useQuery(
    api.completions.getCompletionsForDate,
    !authLoading && isAuthenticated ? { date } : "skip"
  );
  const completions = raw as HabitCompletion[] | undefined;

  const toggleMutation = useMutation(
    api.completions.toggleCompletion
  ).withOptimisticUpdate((localStore, args) => {
    const current = localStore.getQuery(
      api.completions.getCompletionsForDate,
      { date: args.date }
    ) as HabitCompletion[] | undefined;
    if (current === undefined) return;

    const isCurrentlyCompleted = current.some(
      (c: HabitCompletion) => c.habitId === args.habitId
    );

    if (isCurrentlyCompleted) {
      localStore.setQuery(
        api.completions.getCompletionsForDate,
        { date: args.date },
        current.filter((c: HabitCompletion) => c.habitId !== args.habitId)
      );
    } else {
      const now = pendingToggleTimestamp;
      localStore.setQuery(
        api.completions.getCompletionsForDate,
        { date: args.date },
        [
          ...current,
          {
            _id: `optimistic-${args.habitId}-${args.date}` as Id<"habitCompletions">,
            _creationTime: now,
            habitId: args.habitId,
            userId: "optimistic" as Id<"users">,
            date: args.date,
            completedAt: now,
          },
        ]
      );
    }
  });

  const isCompleted =
    completions?.some((c: HabitCompletion) => c.habitId === habitId) ?? false;

  async function toggle() {
    pendingToggleTimestamp = Date.now(); // set before mutation fires, outside render
    const result = await toggleMutation({ habitId, date });
    if (result?.action === "completed" && result.newMilestones.length > 0) {
      // Fire confetti burst for milestone unlock
      triggerConfetti();
      for (const days of result.newMilestones) {
        const config = MILESTONES.find((m) => m.daysRequired === days);
        if (config) {
          showToast(
            `🎉 Milestone unlocked: ${config.icon} ${config.name} — ${config.description}`,
            "success"
          );
        }
      }
    }
  }

  return { isCompleted, toggle };
}
