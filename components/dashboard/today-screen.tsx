"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronRight, Sparkles, Flame, CheckCircle2 } from "lucide-react";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useBestStreak } from "@/hooks/use-best-streak";
import { TodaysHabits } from "@/components/dashboard/todays-habits";
import { ThreeStreakCrystal } from "@/components/3d/three-streak-crystal";

function timeGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

function displayName(user: { firstName?: string | null; name?: string | null }): string {
  return user.firstName ?? user.name?.split(" ")[0] ?? "there";
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col gap-6 max-w-xl mx-auto w-full"
    >
      {/* ── 1. Hero Identity & 3D Crystal Card ──────────────────────────────── */}
      <motion.section
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.45, delay: 0.05 }}
        className="glass-card glow-card rounded-3xl p-6 sm:p-7 relative overflow-hidden"
      >
        {/* Subtle background gradient */}
        <div
          className="absolute -top-24 -right-24 w-60 h-60 rounded-full pointer-events-none opacity-20 blur-3xl"
          style={{ background: "var(--accent)" }}
        />

        <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6 relative z-10">
          <div className="flex-1 text-center sm:text-left">
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

            {/* Streak indicator badge */}
            <div className="mt-5 flex items-center justify-center sm:justify-start gap-3">
              {streakLoading ? (
                <div
                  className="animate-pulse rounded-full"
                  style={{ width: 90, height: 28, background: "var(--bg-sunken)" }}
                />
              ) : bestStreak > 0 ? (
                <div className="flex items-center gap-2">
                  <div
                    className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold"
                    style={{
                      background: "color-mix(in srgb, var(--accent) 15%, transparent)",
                      color: "var(--accent)",
                      border: "1px solid color-mix(in srgb, var(--accent) 25%, transparent)",
                    }}
                  >
                    <Flame size={14} className="fill-[var(--accent)]" />
                    <span>{bestStreak} Day Streak</span>
                  </div>
                  <span className="text-xs" style={{ color: "var(--text-tertiary)" }}>
                    Best active streak
                  </span>
                </div>
              ) : (
                <span className="text-xs font-medium" style={{ color: "var(--text-tertiary)" }}>
                  Start your first streak today!
                </span>
              )}
            </div>
          </div>

          {/* Interactive 3D Streak Crystal */}
          <div className="flex-shrink-0 flex items-center justify-center">
            <ThreeStreakCrystal streak={bestStreak ?? 0} size={150} />
          </div>
        </div>
      </motion.section>

      {/* ── 2. Today's habits ──────────────────────────────────────────────── */}
      <motion.section
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.15 }}
        className="glass-card rounded-3xl p-5 sm:p-6"
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
    </motion.div>
  );
}
