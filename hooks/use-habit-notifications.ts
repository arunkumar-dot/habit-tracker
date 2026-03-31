"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import type { Habit } from "@/types";

const LS_KEY = "habitNotificationsEnabled";

/**
 * Schedules browser notifications for each habit at its startTime.
 * - One timer per habit, keyed by habit._id — no duplicates on re-render.
 * - If startTime already passed today, schedules for the next day.
 * - After firing, immediately reschedules for +24h (daily recurrence).
 * - All timers cleared on unmount or when habits/enabled changes.
 */
export function useHabitNotifications(habits: Habit[]) {
  // Start with neutral defaults (matching SSR) and sync real values after mount.
  const [permission, setPermission] = useState<NotificationPermission>("default");
  const [enabled, setEnabled] = useState<boolean>(false);

  // Sync browser state after mount — runs client-side only, avoids hydration mismatch.
  useEffect(() => {
    if ("Notification" in window) {
      setPermission(Notification.permission);
    }
    setEnabled(localStorage.getItem(LS_KEY) === "true");
  }, []);
  const timersRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  const clearAllTimers = useCallback(() => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current.clear();
  }, []);

  const scheduleNotification = useCallback(
    (habit: Habit) => {
      const [h, m] = habit.startTime.split(":").map(Number);
      const now = Date.now();
      const habitTime = new Date();
      habitTime.setHours(h, m, 0, 0);

      let delay = habitTime.getTime() - now;
      if (delay <= 0) {
        // Already passed today — schedule for same time tomorrow
        delay += 24 * 60 * 60 * 1000;
      }

      const fire = () => {
        new Notification("Habit Reminder", {
          body: `Time for your habit: ${habit.title}`,
          icon: "/favicon.ico",
        });
        // Reschedule for the next day
        const nextTimer = setTimeout(fire, 24 * 60 * 60 * 1000);
        timersRef.current.set(habit._id, nextTimer);
      };

      const timer = setTimeout(fire, delay);
      timersRef.current.set(habit._id, timer);
    },
    []
  );

  // Schedule/reschedule whenever habits list or enabled state changes
  useEffect(() => {
    clearAllTimers();

    if (!enabled || permission !== "granted" || habits.length === 0) return;

    habits.forEach(scheduleNotification);

    return clearAllTimers;
  }, [habits, enabled, permission, clearAllTimers, scheduleNotification]);

  const requestPermission = useCallback(async (): Promise<NotificationPermission> => {
    if (!("Notification" in window)) return "denied";
    const result = await Notification.requestPermission();
    setPermission(result);
    return result;
  }, []);

  const toggleEnabled = useCallback(async () => {
    if (enabled) {
      setEnabled(false);
      localStorage.setItem(LS_KEY, "false");
      return "toggled-off" as const;
    }

    // Enabling — may need to request permission first
    let perm = permission;
    if (perm !== "granted") {
      perm = await requestPermission();
    }

    if (perm === "granted") {
      setEnabled(true);
      localStorage.setItem(LS_KEY, "true");
      return "enabled" as const;
    }

    return "denied" as const;
  }, [enabled, permission, requestPermission]);

  return { permission, enabled, toggleEnabled };
}
