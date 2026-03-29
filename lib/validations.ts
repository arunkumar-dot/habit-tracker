import { z } from "zod";

/** Time string must be in HH:MM format (24-hour). */
const timeRegex = /^\d{2}:\d{2}$/;

export const habitSchema = z
  .object({
    title: z
      .string()
      .min(1, "Title is required")
      .max(100, "Title must be 100 characters or less"),
    description: z
      .string()
      .max(500, "Description must be 500 characters or less")
      .optional()
      .or(z.literal("")),
    frequency: z.enum(["daily", "weekly"] as const, {
      error: "Please select a frequency",
    }),
    startTime: z
      .string()
      .regex(timeRegex, "Start time must be in HH:MM format"),
    endTime: z
      .string()
      .regex(timeRegex, "End time must be in HH:MM format")
      .optional()
      .or(z.literal("")),
    color: z
      .string()
      .regex(/^#[0-9A-Fa-f]{6}$/, "Must be a valid hex color")
      .optional()
      .or(z.literal("")),
  })
  .refine(
    (data) => {
      if (!data.endTime || data.endTime === "") return true;
      return data.endTime > data.startTime;
    },
    {
      message: "End time must be after start time",
      path: ["endTime"],
    }
  );

export type HabitFormValues = z.infer<typeof habitSchema>;

/** Default values for the habit form. */
export const habitFormDefaults: HabitFormValues = {
  title: "",
  description: "",
  frequency: "daily",
  startTime: "07:00",
  endTime: "",
  color: "#6366f1",
};

/** Predefined habit colors for the color picker. */
export const HABIT_COLORS = [
  { label: "Indigo", value: "#6366f1" },
  { label: "Purple", value: "#a855f7" },
  { label: "Blue", value: "#3b82f6" },
  { label: "Cyan", value: "#06b6d4" },
  { label: "Teal", value: "#14b8a6" },
  { label: "Green", value: "#10b981" },
  { label: "Amber", value: "#f59e0b" },
  { label: "Orange", value: "#f97316" },
  { label: "Pink", value: "#ec4899" },
  { label: "Red", value: "#ef4444" },
] as const;
