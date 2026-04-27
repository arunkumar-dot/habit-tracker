import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  /**
   * Users synced from Clerk authentication.
   * Created/updated via upsertUser mutation on first dashboard load.
   */
  users: defineTable({
    clerkId: v.string(), // Clerk user ID (JWT subject / tokenIdentifier)
    name: v.string(),
    email: v.string(),
    imageUrl: v.optional(v.string()),        // Clerk-synced profile image URL
    // App-specific profile fields (all optional for zero-downtime migration)
    age: v.optional(v.number()),
    sex: v.optional(v.union(v.literal("male"), v.literal("female"), v.literal("other"))),
    location: v.optional(v.string()),
    bio: v.optional(v.string()),
    profileImageStorageId: v.optional(v.id("_storage")), // Custom uploaded image
    updatedAt: v.optional(v.number()),       // Unix timestamp ms of last profile edit
    createdAt: v.number(), // Unix timestamp ms
  }).index("by_clerk_id", ["clerkId"]),

  /**
   * Habits created by users.
   * isArchived = soft delete; preserves completion history for streak tracking.
   */
  habits: defineTable({
    userId: v.id("users"), // FK → users._id (Convex internal ID)
    title: v.string(),
    description: v.optional(v.string()),
    frequency: v.union(v.literal("daily"), v.literal("weekly")),
    startTime: v.string(), // "HH:MM" 24-hour format e.g. "07:30"
    endTime: v.optional(v.string()), // "HH:MM" 24-hour format
    color: v.optional(v.string()), // Hex color e.g. "#6366f1"
    isArchived: v.boolean(), // Soft delete flag
    weeklyGoal: v.optional(v.number()), // Target completions per week e.g. 4
    createdAt: v.number(), // Unix timestamp ms
    updatedAt: v.number(), // Unix timestamp ms
  })
    .index("by_user", ["userId"])
    .index("by_user_archived", ["userId", "isArchived"])
    .index("by_user_start_time", ["userId", "startTime"]),

  /**
   * Records a habit being completed on a specific date.
   * Completions are hard-deleted when "unchecked" (no boolean field).
   * This ensures at most one completion per (habitId, date) pair.
   */
  habitCompletions: defineTable({
    habitId: v.id("habits"), // FK → habits._id
    userId: v.id("users"), // Denormalized for efficient per-user queries
    date: v.string(), // "YYYY-MM-DD" in user's local timezone
    completedAt: v.number(), // Unix timestamp ms of when marked complete
  })
    // Primary: check if a habit is completed on a specific date
    .index("by_habit_date", ["habitId", "date"])
    // Get all completions for a user on a specific date (dashboard view)
    .index("by_user_date", ["userId", "date"])
    // Get all completions for a habit (streak calculation, calendar)
    .index("by_habit", ["habitId"])
    // Get all completions for a user (analytics)
    .index("by_user", ["userId"]),

  /**
   * Milestone achievements earned by a user for a specific habit.
   * keyed by daysRequired (from MILESTONES config in lib/milestone-config.ts).
   * Awards are permanent — never deleted even if streak breaks.
   */
  userMilestones: defineTable({
    userId: v.id("users"),
    habitId: v.id("habits"),
    daysRequired: v.number(), // e.g. 3, 7, 14, 21, 30, 45, 66
    achievedAt: v.number(),   // Unix timestamp ms
  })
    .index("by_user_habit", ["userId", "habitId"])
    .index("by_user", ["userId"]),

  /**
   * Completed Pomodoro sessions.
   * Recorded when a focus or break timer reaches zero.
   */
  /**
   * Daily check-in records — one per user per day.
   * completed=true: user confirmed habits done; completed=false: user skipped.
   * Absence means check-in has not been shown/answered yet today.
   */
  dailyCheckIns: defineTable({
    userId: v.id("users"),
    date: v.string(),       // "YYYY-MM-DD" in user's local timezone
    completed: v.boolean(), // true = "Yes I completed", false = "Not today"
    createdAt: v.number(),  // Unix timestamp ms
  })
    .index("by_user_date", ["userId", "date"])
    .index("by_user", ["userId"]),

  pomodoroSessions: defineTable({
    userId: v.id("users"),
    habitId: v.optional(v.id("habits")), // linked habit, if any
    mode: v.union(
      v.literal("focus"),
      v.literal("shortBreak"),
      v.literal("longBreak")
    ),
    durationSecs: v.number(), // planned duration in seconds
    date: v.string(), // "YYYY-MM-DD" in user's local timezone
    completedAt: v.number(), // Unix timestamp ms
  })
    .index("by_user", ["userId"])
    .index("by_user_date", ["userId", "date"]),

  /**
   * FCM push tokens for web push notifications.
   * One token per device/browser — multiple tokens per user allowed.
   * Timezone stored so the server-side cron can match habit startTime to local time.
   */
  pushTokens: defineTable({
    userId: v.id("users"),
    token: v.string(),       // FCM registration token
    timezone: v.string(),    // IANA timezone e.g. "America/New_York"
    createdAt: v.number(),   // Unix timestamp ms
  })
    .index("by_user", ["userId"])
    .index("by_token", ["token"]),

  /**
   * Journal entries — one per user per day.
   * Created from the Dashboard quick-reflection prompt or the Journal page.
   * Writing from either surface upserts the same row (enforced in mutation).
   */
  journalEntries: defineTable({
    userId: v.id("users"),
    date: v.string(),    // "YYYY-MM-DD" in user's local timezone (NOT DateTime)
    content: v.string(), // Plain text, max 5000 chars
    source: v.union(v.literal("journal"), v.literal("dashboard")),
    createdAt: v.number(),  // Unix timestamp ms
    updatedAt: v.number(),  // Unix timestamp ms (managed manually)
  })
    // Primary lookup: one entry per (user, date) — use .unique() to enforce
    .index("by_user_date", ["userId", "date"]),
});
