"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sun, CloudSun, Moon, Sparkles, Check, Flame } from "lucide-react";
import { HabitStreakBadge } from "@/components/habits/habit-streak-badge";
import { useHabits } from "@/hooks/use-habits";
import { useCompletionsForDate } from "@/hooks/use-completions";
import { useOptimisticCompletion } from "@/hooks/use-optimistic-completion";
import { today } from "@/lib/date-utils";
import { formatDisplayTime, sortHabitsByTime } from "@/lib/time-utils";
import { playCompletionChime } from "@/lib/sound-effects";
import type { Habit, HabitCompletion } from "@/types";

type TimeBucket = "all" | "morning" | "afternoon" | "evening";

function getTimeBucket(timeStr: string): "morning" | "afternoon" | "evening" {
  const hour = parseInt(timeStr.split(":")[0], 10);
  if (isNaN(hour) || hour < 12) return "morning";
  if (hour < 17) return "afternoon";
  return "evening";
}

// ── Active (uncompleted) habit row ────────────────────────────────────────────

function ActiveHabitRow({ habit, date }: { habit: Habit; date: string }) {
  const { isCompleted, toggle } = useOptimisticCompletion(habit._id, date);
  const color = habit.color ?? "var(--accent)";

  const handleToggle = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isCompleted) {
      playCompletionChime();
    }
    await toggle();
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.15 } }}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      transition={{ duration: 0.2 }}
      onClick={handleToggle}
      className="group flex items-center justify-between gap-3.5 py-3 px-4 my-1.5 rounded-2xl transition-all duration-200 cursor-pointer border border-[var(--border-subtle)] bg-[var(--bg-elevated)] hover:border-[var(--accent)]/50 hover:shadow-xs"
    >
      <div className="flex items-center gap-3 min-w-0 flex-1">
        {/* Habit Color Indicator */}
        <div
          className="flex-shrink-0 relative flex items-center justify-center"
          style={{ width: 12, height: 12 }}
        >
          <div
            className="absolute inset-0 rounded-full blur-[3px] opacity-70"
            style={{ background: color }}
          />
          <div
            className="relative z-10 rounded-full"
            style={{ width: 8, height: 8, background: color }}
          />
        </div>

        {/* Title & Time */}
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold truncate group-hover:text-[var(--accent)] transition-colors" style={{ color: "var(--text-primary)" }}>
            {habit.title}
          </p>
          <p
            className="text-xs mt-0.5"
            style={{ color: "var(--text-tertiary)", fontFamily: "var(--font-mono)" }}
          >
            {formatDisplayTime(habit.startTime)}
          </p>
        </div>
      </div>

      {/* Streak Badge & Interactive Checkmark Box */}
      <div className="flex items-center gap-2.5 flex-shrink-0">
        <HabitStreakBadge habitId={habit._id} frequency={habit.frequency} />
        
        {/* Prominent Checkbox Button */}
        <button
          type="button"
          onClick={handleToggle}
          aria-label={`Mark ${habit.title} complete`}
          className="w-7 h-7 rounded-xl flex items-center justify-center transition-all duration-200 bg-[var(--bg-sunken)] border border-[var(--border-default)] group-hover:border-[var(--accent)] group-hover:bg-[var(--accent)]/15 group-hover:scale-105 cursor-pointer"
        >
          <Check size={14} className="opacity-0 group-hover:opacity-60 text-[var(--accent)] transition-opacity" />
        </button>
      </div>
    </motion.div>
  );
}

// ── Completed habit row ───────────────────────────────────────────────────────

function CompletedHabitRow({ habit, date }: { habit: Habit; date: string }) {
  const { toggle } = useOptimisticCompletion(habit._id, date);
  const color = habit.color ?? "var(--accent)";

  const handleToggle = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await toggle();
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.12 } }}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      transition={{ duration: 0.2 }}
      onClick={handleToggle}
      className="group flex items-center justify-between gap-3.5 py-2.5 px-4 my-1.5 rounded-2xl transition-all duration-200 cursor-pointer border border-[var(--border-subtle)] bg-[var(--bg-sunken)]/40 hover:bg-[var(--bg-hover)]"
    >
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <div
          className="flex-shrink-0 rounded-full"
          style={{ width: 8, height: 8, background: color, opacity: 0.4 }}
        />
        <p className="text-sm truncate line-through flex-1" style={{ color: "var(--text-tertiary)" }}>
          {habit.title}
        </p>
      </div>

      <div className="flex items-center gap-2.5 flex-shrink-0">
        <HabitStreakBadge habitId={habit._id} frequency={habit.frequency} />
        
        {/* Completed Checked Box */}
        <button
          type="button"
          onClick={handleToggle}
          aria-label={`Uncheck ${habit.title}`}
          className="w-7 h-7 rounded-xl flex items-center justify-center transition-all duration-200 shadow-xs cursor-pointer"
          style={{
            background: "var(--accent)",
            color: "#ffffff",
            border: "1px solid var(--accent)",
          }}
          title="Click to uncheck"
        >
          <Check size={14} className="stroke-[2.5]" />
        </button>
      </div>
    </motion.div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export function TodaysHabits() {
  const { habits, isLoading: habitsLoading } = useHabits();
  const dateStr = today();
  const { completions, completedHabitIds, isLoading: completionsLoading } = useCompletionsForDate(dateStr);
  const [timeFilter, setTimeFilter] = useState<TimeBucket>("all");

  const { activeHabits, completedHabits, counts } = useMemo(() => {
    if (!habits) return { activeHabits: [], completedHabits: [], counts: { all: 0, morning: 0, afternoon: 0, evening: 0 } };

    const activeAll = habits.filter((h) => !completedHabitIds.has(h._id));
    const morningCount = activeAll.filter((h) => getTimeBucket(h.startTime) === "morning").length;
    const afternoonCount = activeAll.filter((h) => getTimeBucket(h.startTime) === "afternoon").length;
    const eveningCount = activeAll.filter((h) => getTimeBucket(h.startTime) === "evening").length;

    const filteredActive = activeAll.filter((h) => {
      if (timeFilter === "all") return true;
      return getTimeBucket(h.startTime) === timeFilter;
    });

    const active = sortHabitsByTime(filteredActive);

    // Sort completed by completedAt descending
    const completionsMap = new Map<string, number>(
      (completions ?? []).map((c: HabitCompletion) => [c.habitId as string, c.completedAt])
    );
    const completed = habits
      .filter((h) => completedHabitIds.has(h._id))
      .sort((a, b) => {
        const aTime = completionsMap.get(a._id as string) ?? 0;
        const bTime = completionsMap.get(b._id as string) ?? 0;
        return bTime - aTime;
      });

    return {
      activeHabits: active,
      completedHabits: completed,
      counts: {
        all: activeAll.length,
        morning: morningCount,
        afternoon: afternoonCount,
        evening: eveningCount,
      },
    };
  }, [habits, completedHabitIds, completions, timeFilter]);

  if (!habitsLoading && !completionsLoading && (!habits || habits.length === 0)) return null;

  if (habitsLoading || completionsLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="animate-pulse h-12 rounded-xl"
            style={{ background: "var(--bg-sunken)" }}
          />
        ))}
      </div>
    );
  }

  const totalCount = habits?.length ?? 0;
  const remainingCount = counts.all;

  const timeBuckets: { id: TimeBucket; label: string; icon: typeof Sun; count: number }[] = [
    { id: "all", label: "All Day", icon: Sparkles, count: counts.all },
    { id: "morning", label: "Morning", icon: Sun, count: counts.morning },
    { id: "afternoon", label: "Afternoon", icon: CloudSun, count: counts.afternoon },
    { id: "evening", label: "Evening", icon: Moon, count: counts.evening },
  ];

  return (
    <div className="space-y-4" data-testid="todays-habits">
      {/* ── Time of Day Filter Pills ──────────────────────────────────────── */}
      <div className="flex items-center gap-1.5 p-1 rounded-2xl glass-panel overflow-x-auto no-scrollbar">
        {timeBuckets.map((bucket) => {
          const isSelected = timeFilter === bucket.id;
          const Icon = bucket.icon;

          return (
            <button
              key={bucket.id}
              type="button"
              onClick={() => setTimeFilter(bucket.id)}
              className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                isSelected
                  ? "text-[var(--text-primary)]"
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-sunken)]"
              }`}
            >
              {isSelected && (
                <motion.div
                  layoutId="todayTimeFilterPill"
                  className="absolute inset-0 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] shadow-sm"
                  transition={{ type: "spring", stiffness: 450, damping: 30 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-1.5">
                <Icon size={13} className={isSelected ? "text-[var(--accent)]" : "opacity-70"} />
                {bucket.label}
                {bucket.count > 0 && (
                  <span
                    className="text-[10px] px-1.5 py-0.2 rounded-full font-mono"
                    style={{
                      background: isSelected
                        ? "color-mix(in srgb, var(--accent) 15%, transparent)"
                        : "var(--bg-sunken)",
                      color: isSelected ? "var(--accent)" : "var(--text-tertiary)",
                    }}
                  >
                    {bucket.count}
                  </span>
                )}
              </span>
            </button>
          );
        })}
      </div>

      {/* ── Active (uncompleted) section ──────────────────────────────────── */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs uppercase tracking-wider font-semibold" style={{ color: "var(--text-tertiary)" }}>
            To Do
          </span>
          {remainingCount > 0 && (
            <span
              className="text-xs px-2.5 py-0.5 rounded-full font-semibold"
              style={{
                background: "color-mix(in srgb, var(--accent) 12%, transparent)",
                color: "var(--accent)",
                fontFamily: "var(--font-mono)",
              }}
            >
              {remainingCount} of {totalCount} remaining
            </span>
          )}
        </div>

        <AnimatePresence initial={false}>
          {activeHabits.length > 0 ? (
            activeHabits.map((habit) => (
              <ActiveHabitRow key={habit._id} habit={habit} date={dateStr} />
            ))
          ) : (
            <motion.div
              key="all-done"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-panel text-center py-6 px-4 rounded-2xl my-2 border border-[var(--border-subtle)]"
            >
              <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                {timeFilter === "all"
                  ? "You've completed everything today! 🎉"
                  : `No remaining ${timeFilter} habits 🎉`}
              </p>
              <p className="text-xs mt-1" style={{ color: "var(--text-tertiary)" }}>
                All habits are checked off. The 3D crystal is glowing in celebration.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Completed section ──────────────────────────────────────────────── */}
      {completedHabits.length > 0 && (
        <div className="pt-2">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs uppercase tracking-wider font-semibold" style={{ color: "var(--text-tertiary)" }}>
              Completed Today (Click to toggle)
            </span>
            <span
              className="text-xs px-2 py-0.5 rounded-full font-mono font-semibold"
              style={{
                background: "color-mix(in srgb, var(--accent) 15%, transparent)",
                color: "var(--accent)",
              }}
            >
              {completedHabits.length}
            </span>
          </div>
          <AnimatePresence initial={false}>
            {completedHabits.map((habit) => (
              <CompletedHabitRow key={habit._id} habit={habit} date={dateStr} />
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
