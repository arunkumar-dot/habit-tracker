"use client";

import { useQuery, useConvexAuth } from "convex/react";
import { api } from "@/convex/_generated/api";
import { today } from "@/lib/date-utils";
import { usePomodoro, MODE_LABELS } from "@/hooks/use-pomodoro";
import { PageHeader } from "@/components/layout/page-header";
import { ModeSelector } from "@/components/pomodoro/mode-selector";
import { PomodoroTimer } from "@/components/pomodoro/pomodoro-timer";
import { TimerControls } from "@/components/pomodoro/timer-controls";
import { SessionCounter } from "@/components/pomodoro/session-counter";
import { HabitSelector } from "@/components/pomodoro/habit-selector";
import { DurationSettings } from "@/components/pomodoro/duration-settings";

import { motion } from "framer-motion";
import { AmbientSoundPlayer } from "@/components/pomodoro/ambient-sound-player";

export default function PomodoroPage() {
  const {
    mode,
    remainingSecs,
    isRunning,
    sessionCount,
    linkedHabitId,
    hydrated,
    durations,
    start,
    pause,
    reset,
    switchMode,
    setCustomDuration,
    setLinkedHabitId,
  } = usePomodoro();

  const { isAuthenticated } = useConvexAuth();
  const sessions = useQuery(
    api.pomodoro.listSessionsForDate,
    isAuthenticated ? { date: today() } : "skip"
  );

  const focusSessions = sessions?.filter((s) => s.mode === "focus") ?? [];
  const totalFocusMin = Math.round(
    focusSessions.reduce((acc, s) => acc + s.durationSecs, 0) / 60
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col gap-6 max-w-xl mx-auto w-full"
    >
      <PageHeader
        title="Pomodoro Focus"
        description="Stay immersed with 3D focus and ambient soundscapes."
      />

      {/* Mode selector */}
      <ModeSelector mode={mode} onSwitch={switchMode} disabled={isRunning} />

      {/* Timer — hidden until hydrated to prevent flash */}
      <div
        className="glass-card glow-card flex flex-col gap-6 items-center py-8 px-4 rounded-3xl relative overflow-hidden"
        style={{
          opacity: hydrated ? 1 : 0,
          transition: "opacity 0.3s ease",
        }}
      >
        <PomodoroTimer
          mode={mode}
          remainingSecs={remainingSecs}
          isRunning={isRunning}
        />

        <TimerControls
          isRunning={isRunning}
          onStart={start}
          onPause={pause}
          onReset={reset}
        />

        <SessionCounter sessionCount={sessionCount} />
      </div>

      {/* Ambient Sound Player */}
      <AmbientSoundPlayer />

      {/* Habit link */}
      <div className="glass-card px-4 py-3 rounded-2xl">
        <HabitSelector linkedHabitId={linkedHabitId} onSelect={setLinkedHabitId} />
      </div>

      {/* Duration settings */}
      <DurationSettings
        durations={durations}
        onSetDuration={setCustomDuration}
        disabled={isRunning}
      />

      {/* Daily stats */}
      {sessions !== undefined && (
        <div className="glass-card flex items-center justify-around px-4 py-4 rounded-2xl">
          <Stat label="Sessions today" value={String(focusSessions.length)} />
          <div className="w-px h-8" style={{ background: "var(--border-subtle)" }} />
          <Stat label="Focus time" value={`${totalFocusMin} min`} />
          <div className="w-px h-8" style={{ background: "var(--border-subtle)" }} />
          <Stat
            label="Current mode"
            value={MODE_LABELS[mode]}
          />
        </div>
      )}
    </motion.div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col items-center gap-0.5">
      <span className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>
        {value}
      </span>
      <span className="text-xs" style={{ color: "var(--text-disabled)" }}>
        {label}
      </span>
    </div>
  );
}
