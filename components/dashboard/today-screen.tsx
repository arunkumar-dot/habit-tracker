"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ChevronRight, Sparkles, Flame, CheckCircle2, Trophy, Target, Check } from "lucide-react";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useBestStreak } from "@/hooks/use-best-streak";
import { useCompletionsForDate, useCompletionsForDateRange } from "@/hooks/use-completions";
import { useHabits } from "@/hooks/use-habits";
import { TodaysHabits } from "@/components/dashboard/todays-habits";
import { ThreeStreakCrystal } from "@/components/3d/three-streak-crystal";
import { ThreeDevBar } from "@/components/3d/three-dev-bar";
import { today } from "@/lib/date-utils";

function timeGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

function displayName(user: { firstName?: string | null; name?: string | null }): string {
  return user.firstName ?? user.name?.split(" ")[0] ?? "there";
}

interface StreakMilestone {
  current: number;
  target: number;
  label: string;
  badge: string;
  progressPercent: number;
}

function getNextMilestone(streak: number): StreakMilestone {
  if (streak < 3) {
    return {
      current: streak,
      target: 3,
      label: "Sprout 🌱",
      badge: "3-Day Habit Initiation",
      progressPercent: Math.min(Math.round((streak / 3) * 100), 100),
    };
  }
  if (streak < 7) {
    return {
      current: streak,
      target: 7,
      label: "Momentum ⚡",
      badge: "7-Day Active Rhythm",
      progressPercent: Math.min(Math.round((streak / 7) * 100), 100),
    };
  }
  if (streak < 21) {
    return {
      current: streak,
      target: 21,
      label: "Habit Lock 🔒",
      badge: "21-Day Neural Formation",
      progressPercent: Math.min(Math.round((streak / 21) * 100), 100),
    };
  }
  if (streak < 66) {
    return {
      current: streak,
      target: 66,
      label: "Mastery 👑",
      badge: "66-Day Identity Transformation",
      progressPercent: Math.min(Math.round((streak / 66) * 100), 100),
    };
  }
  return {
    current: streak,
    target: 100,
    label: "Titan 🏆",
    badge: "100-Day Mastery",
    progressPercent: 100,
  };
}

function IdentitySection({ statement }: { statement: string | undefined }) {
  if (!statement || statement.trim() === "") {
    return (
      <Link href="/habits" className="block group">
        <p
          className="text-xl leading-snug transition-colors group-hover:text-[var(--accent)]"
          style={{
            fontFamily: "var(--font-display)",
            fontStyle: "italic",
            color: "var(--text-tertiary)",
          }}
        >
          Who do you want to become?
        </p>
      </Link>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-1.5 mb-1.5">
        <Sparkles size={13} className="text-[var(--accent)]" />
        <p
          className="text-xs uppercase tracking-widest font-semibold"
          style={{ color: "var(--accent)" }}
        >
          Identity in Progress
        </p>
      </div>
      <p
        className="text-2xl sm:text-3xl leading-snug font-normal"
        style={{
          fontFamily: "var(--font-display)",
          fontStyle: "italic",
          color: "var(--text-primary)",
        }}
      >
        &ldquo;{statement}&rdquo;
      </p>
    </div>
  );
}

function ReflectionCTA() {
  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
    >
      <Link
        href="/journal"
        className="glass-card flex items-center justify-between w-full p-4 rounded-2xl"
        style={{
          color: "var(--text-secondary)",
          textDecoration: "none",
        }}
        aria-label="Write today's reflection"
      >
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{
              background: "color-mix(in srgb, var(--accent) 14%, transparent)",
              color: "var(--accent)",
            }}
          >
            <Sparkles size={18} />
          </div>
          <div>
            <span className="text-sm font-semibold block" style={{ color: "var(--text-primary)" }}>
              Write today&apos;s reflection
            </span>
            <span className="text-xs" style={{ color: "var(--text-tertiary)" }}>
              Capture insights and reinforce your habits
            </span>
          </div>
        </div>
        <ChevronRight
          size={18}
          aria-hidden="true"
          style={{ color: "var(--text-tertiary)", flexShrink: 0 }}
        />
      </Link>
    </motion.div>
  );
}

export function TodayScreen() {
  const { user, isLoading: userLoading } = useCurrentUser();
  const { bestStreak, isLoading: streakLoading } = useBestStreak();

  // Compute 7 days of the current week (Monday to Sunday)
  const todayStr = today();
  const weekDays = useMemo(() => {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const diffToMonday = (dayOfWeek + 6) % 7;
    const monday = new Date(now);
    monday.setDate(now.getDate() - diffToMonday);

    const days = [];
    const dayNames = ["M", "T", "W", "T", "F", "S", "S"];
    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      const dateStr = d.toISOString().split("T")[0];
      const isToday = dateStr === todayStr;
      const isPast = d < now && !isToday;
      days.push({
        dateStr,
        label: dayNames[i],
        isToday,
        isPast,
      });
    }
    return days;
  }, [todayStr]);

  const startDate = weekDays[0].dateStr;
  const endDate = weekDays[6].dateStr;
  const { completions } = useCompletionsForDateRange(startDate, endDate);

  const completedDatesSet = useMemo(() => {
    const set = new Set<string>();
    (completions ?? []).forEach((c) => {
      if (c.date) set.add(c.date);
    });
    return set;
  }, [completions]);

  const { habits } = useHabits();
  const { completedHabitIds } = useCompletionsForDate(todayStr);

  const totalHabitsCount = habits?.length ?? 0;
  const completedCount = habits?.filter((h) => completedHabitIds.has(h._id)).length ?? 0;
  const realIsCompletedToday = totalHabitsCount > 0 && completedCount === totalHabitsCount;
  const realCompletionRatio = totalHabitsCount > 0 ? completedCount / totalHabitsCount : 0;
  const realStreak = bestStreak ?? 0;

  const [devOverrides, setDevOverrides] = useState<{
    streak: number;
    isCompletedToday: boolean;
    completionRatio: number;
    isOverridden: boolean;
  }>({
    streak: 0,
    isCompletedToday: false,
    completionRatio: 0,
    isOverridden: false,
  });

  const activeStreak = devOverrides.isOverridden ? devOverrides.streak : realStreak;
  const activeIsCompleted = devOverrides.isOverridden
    ? devOverrides.isCompletedToday
    : realIsCompletedToday;
  const activeRatio = devOverrides.isOverridden
    ? devOverrides.completionRatio
    : realCompletionRatio;

  const milestone = getNextMilestone(activeStreak);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col gap-6 max-w-xl mx-auto w-full"
    >
      {/* ── 1. Hero Identity & Redesigned Streak Crystal Card ───────────────── */}
      <motion.section
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.45, delay: 0.05 }}
        className="glass-card glow-card rounded-3xl p-6 sm:p-7 relative overflow-hidden border border-[var(--border-default)] shadow-xl"
      >
        {/* Ambient radial glow background */}
        <div
          className="absolute -top-24 -right-24 w-64 h-64 rounded-full pointer-events-none opacity-20 blur-3xl"
          style={{ background: "var(--accent)" }}
        />

        <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6 relative z-10">
          <div className="flex-1 text-center sm:text-left w-full">
            {/* Greeting */}
            <p
              className="text-xs uppercase tracking-wider font-semibold mb-2"
              style={{ color: "var(--text-tertiary)" }}
            >
              {userLoading
                ? "Loading..."
                : `${timeGreeting()}, ${user ? displayName(user) : ""}`}
            </p>

            {/* Identity statement */}
            {userLoading ? (
              <div>
                <div
                  className="animate-pulse rounded mb-2"
                  style={{ width: 140, height: 14, background: "var(--bg-sunken)" }}
                />
                <div
                  className="animate-pulse rounded"
                  style={{ width: "90%", height: 36, background: "var(--bg-sunken)" }}
                />
              </div>
            ) : (
              <IdentitySection statement={user?.identityStatement} />
            )}

            {/* ── Redesigned Streak Counter & Milestone Trackers ─────────────── */}
            <div className="mt-5 pt-4 border-t border-[var(--border-subtle)] flex flex-col gap-3">
              {streakLoading ? (
                <div
                  className="animate-pulse rounded-2xl h-14"
                  style={{ background: "var(--bg-sunken)" }}
                />
              ) : (
                <>
                  {/* Streak & Next Milestone Header */}
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <div
                        className="flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold shadow-xs"
                        style={{
                          background: "color-mix(in srgb, var(--accent) 16%, var(--bg-elevated))",
                          color: "var(--accent)",
                          border: "1px solid color-mix(in srgb, var(--accent) 30%, transparent)",
                        }}
                      >
                        <Flame size={14} className="fill-[var(--accent)] text-[var(--accent)]" />
                        <span>{bestStreak} Day Streak</span>
                      </div>
                      <span className="text-xs" style={{ color: "var(--text-tertiary)" }}>
                        Active streak
                      </span>
                    </div>

                    <Link
                      href="/milestones"
                      className="flex items-center gap-1.5 text-xs font-medium hover:text-[var(--accent)] transition-colors group cursor-pointer"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      <Target size={13} className="text-[var(--accent)] group-hover:scale-110 transition-transform" />
                      <span>Next: <strong>{milestone.label}</strong> →</span>
                    </Link>
                  </div>

                  {/* Milestone Progress Bar (Click to view Milestones) */}
                  <Link href="/milestones" className="block space-y-1 group cursor-pointer">
                    <div className="w-full h-2 rounded-full bg-[var(--bg-sunken)] overflow-hidden border border-[var(--border-subtle)] group-hover:border-[var(--accent)]/50 transition-colors">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${milestone.progressPercent}%` }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="h-full rounded-full shadow-xs"
                        style={{
                          background: "linear-gradient(90deg, var(--accent) 0%, color-mix(in srgb, var(--accent) 70%, #ffffff) 100%)",
                        }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-[11px]" style={{ color: "var(--text-tertiary)" }}>
                      <span>{milestone.current} / {milestone.target} days to unlock</span>
                      <span className="group-hover:text-[var(--accent)] font-semibold transition-colors">{milestone.progressPercent}%</span>
                    </div>
                  </Link>

                  {/* 7-Day Consistency Week Dots */}
                  <div className="pt-1 flex items-center justify-between sm:justify-start gap-2 sm:gap-3">
                    <span className="text-[11px] font-medium" style={{ color: "var(--text-tertiary)" }}>
                      This week:
                    </span>
                    <div className="flex items-center gap-1.5">
                      {weekDays.map((day, idx) => {
                        const isDone = completedDatesSet.has(day.dateStr);
                        return (
                          <div
                            key={idx}
                            title={`${day.dateStr}${isDone ? " (Completed)" : ""}`}
                            className="flex flex-col items-center gap-0.5"
                          >
                            <div
                              className="w-5 h-5 rounded-lg flex items-center justify-center text-[9px] font-bold transition-all"
                              style={{
                                background: isDone
                                  ? "var(--accent)"
                                  : day.isToday
                                  ? "color-mix(in srgb, var(--accent) 15%, transparent)"
                                  : "var(--bg-sunken)",
                                color: isDone
                                  ? "#ffffff"
                                  : day.isToday
                                  ? "var(--accent)"
                                  : "var(--text-tertiary)",
                                border: day.isToday
                                  ? "1.5px solid var(--accent)"
                                  : "1px solid var(--border-subtle)",
                              }}
                            >
                              {isDone ? <Check size={10} className="stroke-[3]" /> : day.label}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Interactive 3D Streak Solid Widget */}
          <div className="flex-shrink-0 flex items-center justify-center self-center sm:self-start mt-2 sm:mt-0">
            <ThreeStreakCrystal
              streak={activeStreak}
              size={150}
              isCompletedToday={activeIsCompleted}
              completionRatio={activeRatio}
            />
          </div>
        </div>
      </motion.section>

      {/* ── 2. Today's habits ──────────────────────────────────────────────── */}
      <motion.section
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.15 }}
        className="glass-card rounded-3xl p-5 sm:p-6 border border-[var(--border-default)] shadow-sm"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={18} className="text-[var(--accent)]" />
            <h2 className="text-base font-semibold" style={{ color: "var(--text-primary)" }}>
              Today&apos;s Habits
            </h2>
          </div>
          <Link
            href="/habits"
            className="text-xs font-medium transition-colors hover:text-[var(--accent)]"
            style={{ color: "var(--text-secondary)" }}
          >
            Manage habits →
          </Link>
        </div>

        <TodaysHabits />
      </motion.section>

      {/* ── 3. Reflection CTA ─────────────────────────────────────────────── */}
      <motion.section
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.2 }}
      >
        <ReflectionCTA />
      </motion.section>

      {/* ── 4. Floating 3D Crystal Dev Testing Bar ────────────────────────── */}
      <ThreeDevBar
        realStreak={realStreak}
        realIsCompleted={realIsCompletedToday}
        realCompletionRatio={realCompletionRatio}
        onOverrideChange={setDevOverrides}
      />
    </motion.div>
  );
}
