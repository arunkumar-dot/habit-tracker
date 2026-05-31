"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useBestStreak } from "@/hooks/use-best-streak";
import { TodaysHabits } from "@/components/dashboard/todays-habits";
import { StreakRibbon } from "@/components/ui/streak-ribbon";

// ── Greeting helper ────────────────────────────────────────────────────────────

function timeGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

function displayName(user: { firstName?: string | null; name?: string | null }): string {
  return user.firstName ?? user.name?.split(" ")[0] ?? "there";
}

// ── Identity section ───────────────────────────────────────────────────────────

function IdentitySection({ statement }: { statement: string | undefined }) {
  if (!statement || statement.trim() === "") {
    return (
      <Link href="/habits" style={{ display: "block" }}>
        <p
          className="text-xl leading-snug"
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
      <p
        className="text-xs uppercase tracking-widest mb-1"
        style={{ color: "var(--text-tertiary)" }}
      >
        You are becoming
      </p>
      <p
        className="text-2xl leading-snug"
        style={{
          fontFamily: "var(--font-display)",
          fontStyle: "italic",
          color: "var(--text-primary)",
        }}
      >
        {statement}
      </p>
    </div>
  );
}

// ── Streak focal point ─────────────────────────────────────────────────────────

function StreakFocal({ streak, isLoading }: { streak: number; isLoading: boolean }) {
  if (isLoading) {
    return (
      <div
        className="flex items-center gap-3"
        aria-hidden="true"
      >
        <div
          className="animate-pulse rounded-md"
          style={{ width: 72, height: 28, background: "var(--bg-sunken)" }}
        />
        <div
          className="animate-pulse rounded-md"
          style={{ width: 56, height: 18, background: "var(--bg-sunken)" }}
        />
      </div>
    );
  }

  if (streak < 1) {
    return (
      <p className="text-sm" style={{ color: "var(--text-tertiary)" }}>
        Start your streak today
      </p>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <StreakRibbon
        count={streak}
        title={`${streak}-day streak — your best active streak`}
      />
      <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
        Day {streak} — keep going
      </p>
    </div>
  );
}

// ── Reflection CTA ─────────────────────────────────────────────────────────────

function ReflectionCTA() {
  return (
    <Link
      href="/journal"
      className="flex items-center justify-between w-full"
      style={{
        minHeight: 52,
        padding: "14px 16px",
        borderRadius: 12,
        border: "1px solid var(--border-subtle)",
        background: "var(--bg-elevated)",
        color: "var(--text-secondary)",
        textDecoration: "none",
      }}
      aria-label="Write today's reflection"
    >
      <span className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
        Write today's reflection
      </span>
      <ChevronRight
        size={16}
        aria-hidden="true"
        style={{ color: "var(--text-tertiary)", flexShrink: 0 }}
      />
    </Link>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────

export function TodayScreen() {
  const { user, isLoading: userLoading } = useCurrentUser();
  const { bestStreak, isLoading: streakLoading } = useBestStreak();

  return (
    <div
      className="flex flex-col"
      style={{
        gap: 28,
        maxWidth: 440,
        width: "100%",
        margin: "0 auto",
      }}
    >
      {/* ── 1. Greeting + Identity ─────────────────────────────────────────── */}
      <section>
        {/* Greeting */}
        <p
          className="text-base font-medium mb-5"
          style={{ color: "var(--text-secondary)" }}
        >
          {userLoading
            ? " "
            : `${timeGreeting()}, ${user ? displayName(user) : ""}`}
        </p>

        {/* Identity statement */}
        {userLoading ? (
          <div>
            <div
              className="animate-pulse rounded mb-2"
              style={{ width: 120, height: 12, background: "var(--bg-sunken)" }}
            />
            <div
              className="animate-pulse rounded"
              style={{ width: "90%", height: 32, background: "var(--bg-sunken)" }}
            />
          </div>
        ) : (
          <IdentitySection statement={user?.identityStatement} />
        )}
      </section>

      {/* ── Divider ────────────────────────────────────────────────────────── */}
      <div
        style={{ height: 1, background: "var(--border-subtle)", width: "100%" }}
        role="separator"
        aria-hidden="true"
      />

      {/* ── 2. Streak focal point ──────────────────────────────────────────── */}
      <section>
        <StreakFocal streak={bestStreak} isLoading={streakLoading} />
      </section>

      {/* ── 3. Today's habits ──────────────────────────────────────────────── */}
      <section>
        <h2
          className="text-sm font-semibold mb-3"
          style={{ color: "var(--text-primary)" }}
        >
          Today&apos;s habits
        </h2>
        <TodaysHabits />
      </section>

      {/* ── 4. Reflection CTA ─────────────────────────────────────────────── */}
      <section>
        <ReflectionCTA />
      </section>
    </div>
  );
}
