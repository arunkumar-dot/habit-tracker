"use client";

import { useRef, useState } from "react";
import { ResponsiveDialog } from "@/components/ui/responsive-dialog";
import { Button } from "@/components/ui/button";
import { HabitForm, habitToFormValues } from "./habit-form";
import { useHabitMutations } from "@/hooks/use-habit-mutations";
import { useToast } from "@/components/ui/toast";
import type { Habit } from "@/types";
import type { HabitFormValues } from "@/lib/validations";

// ─── Create ───────────────────────────────────────────────────────────────────

interface CreateHabitDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateHabitDialog({ isOpen, onClose }: CreateHabitDialogProps) {
  const { createHabit } = useHabitMutations();
  const { showToast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    <ResponsiveDialog
      isOpen={isOpen}
      onClose={onClose}
      title="New Quest"
      description="Define a new mission and track your progress."
      footer={
        <div className="flex gap-3">
          <Button
            type="button"
            variant="secondary"
            className="flex-1"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="primary"
            className="flex-1"
            onClick={() => formRef.current?.requestSubmit()}
            isLoading={isSubmitting}
            disabled={isSubmitting}
          >
            Create Quest
          </Button>
        </div>
      }
    >
      <HabitForm
        ref={formRef}
        onSubmit={handleSubmit}
        onCancel={onClose}
        hideActions
        onSubmittingChange={setIsSubmitting}
      />
    </ResponsiveDialog>
  );
}

// ─── Edit ─────────────────────────────────────────────────────────────────────

interface EditHabitDialogProps {
  habit: Habit | null;
  onClose: () => void;
}

export function EditHabitDialog({ habit, onClose }: EditHabitDialogProps) {
  const { updateHabit } = useHabitMutations();
  const { showToast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    <ResponsiveDialog
      isOpen={habit !== null}
      onClose={onClose}
      title="Edit Quest"
      description="Update your quest details."
      footer={
        <div className="flex gap-3">
          <Button
            type="button"
            variant="secondary"
            className="flex-1"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="primary"
            className="flex-1"
            onClick={() => formRef.current?.requestSubmit()}
            isLoading={isSubmitting}
            disabled={isSubmitting}
          >
            Save Changes
          </Button>
        </div>
      }
    >
      {habit && (
        <HabitForm
          ref={formRef}
          onSubmit={handleSubmit}
          onCancel={onClose}
          defaultValues={habitToFormValues(habit)}
          isEdit
          hideActions
          onSubmittingChange={setIsSubmitting}
        />
      )}
    </ResponsiveDialog>
  );
}
