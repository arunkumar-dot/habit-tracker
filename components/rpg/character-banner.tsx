"use client";

import { motion } from "framer-motion";
import { Rocket, Shield, Sparkles } from "lucide-react";
import { StarfieldBg } from "@/components/rpg/starfield-bg";
import { XPBar } from "@/components/rpg/xp-bar";
import { AnimatedCard } from "@/components/rpg/animated-card";
import { motionStaggers } from "@/components/animations";
import { deriveRpgProgress } from "@/lib/rpg-dashboard";
import type { Habit, HabitCompletion } from "@/types";

interface CharacterBannerProps {
  habits: Habit[] | undefined;
  completions: HabitCompletion[] | undefined;
  isLoading?: boolean;
}

export function CharacterBanner({
  habits,
  completions,
  isLoading = false,
}: CharacterBannerProps) {
  const progress = deriveRpgProgress({ habits, completions });

  if (isLoading) {
    return (
      <AnimatedCard className="mb-5 overflow-hidden p-5" data-testid="character-banner">
        <div className="h-24 animate-pulse rounded-md bg-[var(--bg-sunken)]" />
      </AnimatedCard>
    );
  }

  return (
    <AnimatedCard
      className="relative mb-5 overflow-hidden border-[rgba(139,92,246,0.35)] p-0 shadow-[var(--glow-purple)]"
      data-testid="character-banner"
    >
      <StarfieldBg density="medium" />
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-80"
        style={{
          background:
            "radial-gradient(circle at 16% 18%, rgba(245,158,11,0.20), transparent 24%), linear-gradient(135deg, rgba(139,92,246,0.34), rgba(59,130,246,0.14) 46%, rgba(6,182,212,0.12))",
        }}
      />
      <motion.div
        className="relative z-10 grid gap-5 p-5 md:grid-cols-[120px_1fr_auto] md:items-center md:p-6"
        initial="initial"
        animate="animate"
        variants={{
          initial: {},
          animate: { transition: motionStaggers.tight },
        }}
      >
        <div className="flex items-center gap-4 md:block">
          <div className="relative grid h-24 w-24 shrink-0 place-items-center rounded-full border border-[rgba(245,158,11,0.35)] bg-[rgba(2,6,23,0.42)] shadow-[var(--glow-gold)]">
            <div
              aria-hidden="true"
              className="absolute inset-2 rounded-full"
              style={{ background: "var(--grad-xp)", opacity: 0.28 }}
            />
            <Rocket className="relative z-10 text-[var(--stellar-gold)]" size={38} strokeWidth={1.8} />
            <span className="absolute -right-1 -top-1 grid h-9 w-9 place-items-center rounded-full border border-[var(--stellar-gold)] bg-[var(--bg-elevated)] font-[var(--font-rpg)] text-sm font-bold text-[var(--stellar-gold)]">
              {progress.level}
            </span>
          </div>
          <div className="min-w-0 md:mt-3 md:text-center">
            <p className="type-stat-label text-[var(--stellar-gold)]">Character</p>
            <p className="truncate font-[var(--font-rpg)] text-lg font-bold text-[var(--text-primary)]">
              Starkeeper
            </p>
          </div>
        </div>

        <div className="min-w-0">
          <p className="type-stat-label mb-2 text-[var(--nebula-cyan)]">Mission Bridge</p>
          <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h1 className="font-[var(--font-rpg)] text-3xl font-bold leading-tight text-[var(--text-primary)] md:text-4xl">
                {progress.rankTitle}
              </h1>
              <p className="mt-1 text-sm text-[var(--text-secondary)]">
                Character progression hub online.
              </p>
            </div>
            <div className="rounded-lg border border-[var(--border-subtle)] bg-[rgba(2,6,23,0.24)] px-3 py-2">
              <p className="type-stat-label text-[var(--text-secondary)]">Level</p>
              <p className="font-[var(--font-rpg)] text-3xl font-bold leading-none text-[var(--stellar-gold)]">
                {progress.level}
              </p>
            </div>
          </div>
          <div className="mb-2 flex items-center justify-between gap-3">
            <p className="type-stat-label text-[var(--text-secondary)]">XP trajectory</p>
            <p className="font-[var(--font-mono)] text-xs text-[var(--text-secondary)]">
              {progress.xpIntoLevel}/{progress.xpForNextLevel} XP
            </p>
          </div>
          <XPBar value={progress.xpIntoLevel} max={progress.xpForNextLevel} />
          <p className="mt-2 text-xs text-[var(--text-tertiary)]">
            {progress.totalXP} total XP derived from completed missions.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 md:w-36 md:grid-cols-1">
          <div className="rounded-lg border border-[var(--border-subtle)] bg-[rgba(2,6,23,0.22)] px-4 py-3">
            <div className="mb-1 flex items-center gap-2 text-[var(--stellar-gold)]">
              <Shield size={16} aria-hidden="true" />
              <p className="type-stat-label text-current">Streak</p>
            </div>
            <p className="font-[var(--font-rpg)] text-2xl font-bold leading-none text-[var(--text-primary)]">
              {progress.currentStreak}d
            </p>
          </div>
          <div className="rounded-lg border border-[var(--border-subtle)] bg-[rgba(2,6,23,0.22)] px-4 py-3">
            <div className="mb-1 flex items-center gap-2 text-[var(--nebula-cyan)]">
              <Sparkles size={16} aria-hidden="true" />
              <p className="type-stat-label text-current">XP</p>
            </div>
            <p className="font-[var(--font-rpg)] text-2xl font-bold leading-none text-[var(--text-primary)]">
              {progress.totalXP}
            </p>
          </div>
        </div>
      </motion.div>
    </AnimatedCard>
  );
}
