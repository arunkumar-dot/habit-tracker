"use client";

import { Dialog } from "@/components/ui/dialog";
import { HabitForm, habitToFormValues } from "./habit-form";
import { useHabitMutations } from "@/hooks/use-habit-mutations";
import { useToast } from "@/components/ui/toast";
import type { Habit, HabitId } from "@/types";
import type { HabitFormValues } from "@/lib/validations";

interface CreateHabitDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateHabitDialog({ isOpen, onClose }: CreateHabitDialogProps) {
  const { createHabit } = useHabitMutations();
  const { showToast } = useToast();

  async function handleSubmit(values: HabitFormValues) {
    try {
      await createHabit({
        title: values.title,
        description: values.description || undefined,
        frequency: values.frequency,
        startTime: values.startTime,
        endTime: values.endTime || undefined,
        color: values.color || undefined,
        weeklyGoal: values.weeklyGoal || undefined,
      });
      showToast("Habit created!", "success");
      onClose();
    } catch (err) {
      showToast("Failed to create habit. Please try again.", "error");
    }
  }

  return (
    <Dialog isOpen={isOpen} onClose={onClose} title="New Habit" description="Build a new routine and track your progress.">
      <HabitForm onSubmit={handleSubmit} onCancel={onClose} />
    </Dialog>
  );
}

interface EditHabitDialogProps {
  habit: Habit | null;
  onClose: () => void;
}

export function EditHabitDialog({ habit, onClose }: EditHabitDialogProps) {
  const { updateHabit } = useHabitMutations();
  const { showToast } = useToast();

  async function handleSubmit(values: HabitFormValues) {
    if (!habit) return;
    try {
      await updateHabit({
        habitId: habit._id,
        title: values.title,
        description: values.description || undefined,
        frequency: values.frequency,
        startTime: values.startTime,
        endTime: values.endTime || undefined,
        color: values.color || undefined,
        weeklyGoal: values.weeklyGoal || undefined,
      });
      showToast("Habit updated!", "success");
      onClose();
    } catch (err) {
      showToast("Failed to update habit. Please try again.", "error");
    }
  }

  return (
    <Dialog
      isOpen={habit !== null}
      onClose={onClose}
      title="Edit Habit"
      description="Update your habit details."
    >
      {habit && (
        <HabitForm
          onSubmit={handleSubmit}
          onCancel={onClose}
          defaultValues={habitToFormValues(habit)}
          isEdit
        />
      )}
    </Dialog>
  );
}
