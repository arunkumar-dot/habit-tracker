"use client";

import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { HabitId, CreateHabitInput, UpdateHabitInput } from "@/types";

/**
 * Returns all habit CRUD mutation functions.
 */
export function useHabitMutations() {
  const createHabitMutation = useMutation(api.habits.createHabit);
  const updateHabitMutation = useMutation(api.habits.updateHabit);
  const deleteHabitMutation = useMutation(api.habits.deleteHabit);
  const archiveHabitMutation = useMutation(api.habits.archiveHabit);

  async function createHabit(input: CreateHabitInput): Promise<HabitId> {
    return await createHabitMutation({
      title: input.title,
      description: input.description || undefined,
      frequency: input.frequency,
      startTime: input.startTime,
      endTime: input.endTime || undefined,
      color: input.color || undefined,
      weeklyGoal: input.weeklyGoal || undefined,
    });
  }

  async function updateHabit(input: UpdateHabitInput): Promise<void> {
    const { habitId, ...rest } = input;
    await updateHabitMutation({
      habitId,
      title: rest.title,
      description: rest.description,
      frequency: rest.frequency,
      startTime: rest.startTime,
      endTime: rest.endTime,
      color: rest.color,
      weeklyGoal: rest.weeklyGoal,
    });
  }

  async function deleteHabit(habitId: HabitId): Promise<void> {
    await deleteHabitMutation({ habitId });
  }

  async function archiveHabit(habitId: HabitId): Promise<void> {
    await archiveHabitMutation({ habitId });
  }

  return { createHabit, updateHabit, deleteHabit, archiveHabit };
}
