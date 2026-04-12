import type { Doc, Id } from "@/convex/_generated/dataModel";

// ============================================
// Re-exported Convex document types
// ============================================

export type User = Doc<"users">;
export type Habit = Doc<"habits">;
export type HabitCompletion = Doc<"habitCompletions">;

export type UserId = Id<"users">;
export type HabitId = Id<"habits">;
export type HabitCompletionId = Id<"habitCompletions">;

// ============================================
// Form / input types
// ============================================

export type HabitFrequency = "daily" | "weekly";

export interface CreateHabitInput {
  title: string;
  description?: string;
  frequency: HabitFrequency;
  startTime: string;
  endTime?: string;
  color?: string;
  weeklyGoal?: number;
}

export interface UpdateHabitInput extends Partial<CreateHabitInput> {
  habitId: HabitId;
}

// ============================================
// Timeline types
// ============================================

export interface TimelineHabitItem {
  type: "habit";
  habit: Habit;
  isCompleted: boolean;
  isCurrent: boolean;
  isUpcoming: boolean;
  isPast: boolean;
}

export interface TimelineGapItem {
  type: "gap";
  id: string;
  gapMinutes: number;
  label: string;
}

export type TimelineEntry = TimelineHabitItem | TimelineGapItem;

// ============================================
// Analytics types
// ============================================

export interface WeeklyData {
  date: string;
  label: string;
  completed: number;
  total: number;
  rate: number;
}

export interface MonthlyData {
  week: string;
  completed: number;
  total: number;
  rate: number;
}
