import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

/**
 * Fire habit push notifications every minute.
 *
 * The action checks all registered FCM tokens, converts each token's stored
 * timezone to a local "HH:MM" string, and queries for habits whose startTime
 * matches that local time. Matching habits trigger a FCM push notification.
 *
 * This runs every minute so every habit startTime (e.g. "07:30") is caught
 * within a ±30-second window of the cron tick.
 */
crons.interval(
  "send-habit-reminders",
  { minutes: 1 },
  internal.notifications.sendHabitReminders,
  {}
);

/**
 * Purge reminderLog entries older than 7 days.
 * Runs at 3 AM UTC (low-traffic window) so the table doesn't grow unbounded.
 */
crons.daily(
  "cleanup-reminder-logs",
  { hourUTC: 3, minuteUTC: 0 },
  internal.reminderLog.cleanupOldReminderLogs,
  {}
);

export default crons;
