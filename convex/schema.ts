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
    imageUrl: v.optional(v.string()),
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
});
