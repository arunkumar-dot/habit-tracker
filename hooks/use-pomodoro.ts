"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useMutation, useConvexAuth } from "convex/react";
import { api } from "@/convex/_generated/api";
import { today } from "@/lib/date-utils";
import { useToast } from "@/components/ui/toast";
import type { Id } from "@/convex/_generated/dataModel";

// ============================================
// Types
// ============================================

export type PomodoroMode = "focus" | "shortBreak" | "longBreak";

export const DURATIONS: Record<PomodoroMode, number> = {
  focus: 25 * 60,
  shortBreak: 5 * 60,
  longBreak: 15 * 60,
};

export const MODE_LABELS: Record<PomodoroMode, string> = {
  focus: "Focus",
  shortBreak: "Short Break",
  longBreak: "Long Break",
};

// ============================================
// localStorage keys
// ============================================

const LS = {
  mode: "pomodoro_mode",
  endTs: "pomodoro_end_ts",
  remainingSecs: "pomodoro_remaining_secs",
  sessionCount: "pomodoro_session_count",
  linkedHabitId: "pomodoro_linked_habit_id",
  customDurations: "pomodoro_custom_durations",
} as const;

// ============================================
// Hook
// ============================================

export function usePomodoro() {
  const { showToast } = useToast();
  const { isAuthenticated } = useConvexAuth();
  const saveSession = useMutation(api.pomodoro.saveSession);

  // ── State (SSR-safe: neutral defaults, synced from localStorage in useEffect) ──
  const [mode, setMode] = useState<PomodoroMode>("focus");
  const [remainingSecs, setRemainingSecs] = useState<number>(DURATIONS.focus);
  const [isRunning, setIsRunning] = useState(false);
  const [sessionCount, setSessionCount] = useState(0);
  const [linkedHabitId, setLinkedHabitId] = useState<Id<"habits"> | null>(null);
  const [hydrated, setHydrated] = useState(false);

  const [customDurations, setCustomDurations] = useState<Record<PomodoroMode, number>>(DURATIONS);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const endTsRef = useRef<number | null>(null);
  // Track current mode/remaining/durations in refs so interval callbacks stay current
  const modeRef = useRef<PomodoroMode>("focus");
  const sessionCountRef = useRef(0);
  const durationsRef = useRef<Record<PomodoroMode, number>>(DURATIONS);

  // ── Sync refs ──
  modeRef.current = mode;
  sessionCountRef.current = sessionCount;
  durationsRef.current = customDurations;

  // ── Persist helpers ──
  const persistPaused = useCallback((secs: number, m: PomodoroMode) => {
    localStorage.removeItem(LS.endTs);
    localStorage.setItem(LS.remainingSecs, String(secs));
    localStorage.setItem(LS.mode, m);
  }, []);

  const persistRunning = useCallback((endTs: number, m: PomodoroMode) => {
    localStorage.setItem(LS.endTs, String(endTs));
    localStorage.removeItem(LS.remainingSecs);
    localStorage.setItem(LS.mode, m);
  }, []);

  // ── Session completion handler ──
  const handleSessionComplete = useCallback(
    (completedMode: PomodoroMode, duration: number) => {
      // Convex save
      if (isAuthenticated) {
        saveSession({
          mode: completedMode,
          durationSecs: duration,
          date: today(),
          completedAt: Date.now(),
        }).catch(() => {});
      }

      // Notification
      const messages: Record<PomodoroMode, string> = {
        focus: "Focus session complete! Time for a break.",
        shortBreak: "Break over! Ready to focus?",
        longBreak: "Long break done! Let's get back to it.",
      };
      const msg = messages[completedMode];
      if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "granted") {
        new Notification("HabitFlow — Pomodoro", { body: msg, icon: "/favicon.ico" });
      }
      showToast(msg, "success");

      // Auto-switch mode
      let nextMode: PomodoroMode;
      if (completedMode === "focus") {
        const newCount = sessionCountRef.current + 1;
        setSessionCount(newCount);
        sessionCountRef.current = newCount;
        localStorage.setItem(LS.sessionCount, String(newCount));
        nextMode = newCount % 4 === 0 ? "longBreak" : "shortBreak";
      } else {
        nextMode = "focus";
      }

      const nextDuration = durationsRef.current[nextMode];
      setMode(nextMode);
      setRemainingSecs(nextDuration);
      setIsRunning(false);
      endTsRef.current = null;
      persistPaused(nextDuration, nextMode);
    },
    [isAuthenticated, saveSession, showToast, persistPaused]
  );

  // ── Interval tick ──
  const startInterval = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      if (!endTsRef.current) return;
      const remaining = Math.max(0, (endTsRef.current - Date.now()) / 1000);
      setRemainingSecs(Math.ceil(remaining));

      if (remaining <= 0) {
        clearInterval(intervalRef.current!);
        intervalRef.current = null;
        endTsRef.current = null;
        setIsRunning(false);
        handleSessionComplete(modeRef.current, durationsRef.current[modeRef.current]);
      }
    }, 500);
  }, [handleSessionComplete]);

  // ── Hydrate from localStorage on mount ──
  useEffect(() => {
    const storedMode = (localStorage.getItem(LS.mode) as PomodoroMode) ?? "focus";
    const storedSessionCount = parseInt(localStorage.getItem(LS.sessionCount) ?? "0", 10);
    const storedHabitId = localStorage.getItem(LS.linkedHabitId) as Id<"habits"> | null;
    const endTs = localStorage.getItem(LS.endTs);
    const pausedSecs = localStorage.getItem(LS.remainingSecs);

    // Load custom durations before anything that reads durationsRef
    const rawDurations = localStorage.getItem(LS.customDurations);
    if (rawDurations) {
      try {
        const parsed = JSON.parse(rawDurations) as Record<PomodoroMode, number>;
        setCustomDurations(parsed);
        durationsRef.current = parsed;
      } catch {}
    }

    setMode(storedMode);
    setSessionCount(storedSessionCount);
    sessionCountRef.current = storedSessionCount;
    if (storedHabitId) setLinkedHabitId(storedHabitId);

    if (endTs) {
      const ts = parseInt(endTs, 10);
      const remaining = (ts - Date.now()) / 1000;
      if (remaining > 0) {
        // Resume running timer
        endTsRef.current = ts;
        setRemainingSecs(Math.ceil(remaining));
        setIsRunning(true);
        startInterval();
      } else {
        // Timer expired while page was closed — treat as completed
        localStorage.removeItem(LS.endTs);
        handleSessionComplete(storedMode, durationsRef.current[storedMode]);
      }
    } else if (pausedSecs) {
      setRemainingSecs(parseInt(pausedSecs, 10));
    } else {
      setRemainingSecs(durationsRef.current[storedMode]);
    }

    setHydrated(true);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Controls ──
  const start = useCallback(() => {
    if (isRunning) return;
    setRemainingSecs((prev) => {
      const endTs = Date.now() + prev * 1000;
      endTsRef.current = endTs;
      persistRunning(endTs, modeRef.current);
      return prev;
    });
    setIsRunning(true);
    startInterval();
  }, [isRunning, persistRunning, startInterval]);

  const pause = useCallback(() => {
    if (!isRunning) return;
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = null;
    setIsRunning(false);
    setRemainingSecs((prev) => {
      endTsRef.current = null;
      persistPaused(prev, modeRef.current);
      return prev;
    });
  }, [isRunning, persistPaused]);

  const reset = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = null;
    endTsRef.current = null;
    setIsRunning(false);
    const duration = durationsRef.current[modeRef.current];
    setRemainingSecs(duration);
    persistPaused(duration, modeRef.current);
  }, [persistPaused]);

  const switchMode = useCallback(
    (newMode: PomodoroMode) => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      intervalRef.current = null;
      endTsRef.current = null;
      setIsRunning(false);
      setMode(newMode);
      const duration = durationsRef.current[newMode];
      setRemainingSecs(duration);
      persistPaused(duration, newMode);
    },
    [persistPaused]
  );

  const setCustomDuration = useCallback(
    (m: PomodoroMode, minutes: number) => {
      const secs = Math.max(1, minutes) * 60;
      setCustomDurations((prev) => {
        const next = { ...prev, [m]: secs };
        localStorage.setItem(LS.customDurations, JSON.stringify(next));
        // If this is the active mode and timer is idle, reset remaining to new duration
        if (m === modeRef.current && !endTsRef.current) {
          setRemainingSecs(secs);
          persistPaused(secs, modeRef.current);
        }
        return next;
      });
    },
    [persistPaused]
  );

  const updateLinkedHabitId = useCallback((id: Id<"habits"> | null) => {
    setLinkedHabitId(id);
    if (id) {
      localStorage.setItem(LS.linkedHabitId, id);
    } else {
      localStorage.removeItem(LS.linkedHabitId);
    }
  }, []);

  return {
    mode,
    remainingSecs,
    isRunning,
    sessionCount,
    linkedHabitId,
    hydrated,
    durations: customDurations,
    start,
    pause,
    reset,
    switchMode,
    setCustomDuration,
    setLinkedHabitId: updateLinkedHabitId,
  };
}
