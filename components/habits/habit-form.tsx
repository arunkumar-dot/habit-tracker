"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { habitSchema, habitFormDefaults, HABIT_COLORS, type HabitFormValues } from "@/lib/validations";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import type { Habit } from "@/types";

interface HabitFormProps {
  onSubmit: (values: HabitFormValues) => Promise<void>;
  onCancel: () => void;
  defaultValues?: Partial<HabitFormValues>;
  isEdit?: boolean;
}

const frequencyOptions = [
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
];

export function HabitForm({
  onSubmit,
  onCancel,
  defaultValues,
  isEdit = false,
}: HabitFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<HabitFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(habitSchema) as any,
    defaultValues: { ...habitFormDefaults, ...defaultValues },
  });

  const selectedColor = watch("color");

  async function handleFormSubmit(values: HabitFormValues) {
    await onSubmit(values);
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      {/* Title */}
      <Input
        label="Habit Title"
        placeholder="e.g., Morning Run, Read 30 min..."
        error={errors.title?.message}
        {...register("title")}
      />

      {/* Description */}
      <Textarea
        label="Description (optional)"
        placeholder="What will you do? Any notes..."
        error={errors.description?.message}
        {...register("description")}
      />

      {/* Frequency */}
      <Select
        label="Frequency"
        options={frequencyOptions}
        error={errors.frequency?.message}
        {...register("frequency")}
      />

      {/* Time row */}
      <div className="grid grid-cols-2 gap-3">
        <Input
          label="Start Time"
          type="time"
          error={errors.startTime?.message}
          {...register("startTime")}
        />
        <Input
          label="End Time (optional)"
          type="time"
          error={errors.endTime?.message}
          {...register("endTime")}
        />
      </div>

      {/* Weekly Goal */}
      <Input
        label="Weekly Goal (optional)"
        type="number"
        min={1}
        max={7}
        placeholder="e.g. 4 times per week"
        error={errors.weeklyGoal?.message}
        {...register("weeklyGoal")}
      />

      {/* Color picker */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
          Color
        </label>
        <div className="flex gap-2 flex-wrap">
          {HABIT_COLORS.map((c) => (
            <button
              key={c.value}
              type="button"
              onClick={() => setValue("color", c.value)}
              title={c.label}
              className="w-7 h-7 rounded-full transition-transform hover:scale-110 flex-shrink-0"
              style={{
                background: c.value,
                outline:
                  selectedColor === c.value
                    ? `3px solid white`
                    : "3px solid transparent",
                outlineOffset: "2px",
              }}
            />
          ))}
        </div>
      </div>

      {/* Actions */}
      <div
        className="flex gap-3 pt-2"
        style={{ borderTop: "1px solid var(--border)" }}
      >
        <Button
          type="button"
          variant="secondary"
          className="flex-1"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          className="flex-1"
          isLoading={isSubmitting}
        >
          {isEdit ? "Save Changes" : "Create Habit"}
        </Button>
      </div>
    </form>
  );
}

/** Convert a Habit document into HabitFormValues for editing. */
export function habitToFormValues(habit: Habit): Partial<HabitFormValues> {
  return {
    title: habit.title,
    description: habit.description ?? "",
    frequency: habit.frequency,
    startTime: habit.startTime,
    endTime: habit.endTime ?? "",
    color: habit.color ?? "#C2410C",
    weeklyGoal: habit.weeklyGoal,
  };
}
