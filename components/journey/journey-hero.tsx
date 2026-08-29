"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { Sparkles, Calendar, Zap } from "lucide-react";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useBestStreak } from "@/hooks/use-best-streak";
import { ThreeStreakCrystal } from "@/components/3d/three-streak-crystal";

interface HeroStatsProps {
  totalCompletions: number;
  daysActive: number;
  firstDate: string | null;
  isLoading: boolean;
}

function formatJourneyStart(firstDate: string | null, createdAt?: number): string {
  const raw = firstDate ?? (createdAt ? new Date(createdAt).toLocaleDateString("en-CA") : null);
  if (!raw) return "—";
  return new Date(raw + "T00:00:00").toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function JourneyHero({ totalCompletions, daysActive, firstDate, isLoading }: HeroStatsProps) {
  const { user, isLoading: userLoading } = useCurrentUser();
  const { bestStreak, isLoading: streakLoading } = useBestStreak();

  const startLabel = useMemo(
    () => formatJourneyStart(firstDate, user?.createdAt),
    [firstDate, user?.createdAt]
  );

  return (
    <motion.section
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="glass-card glow-card rounded-3xl p-6 sm:p-7 mb-8 relative overflow-hidden"
    >
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex-1 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-1.5 mb-2">
            <Sparkles size={14} className="text-[var(--accent)]" />
            <span className="text-xs uppercase tracking-widest font-semibold" style={{ color: "var(--accent)" }}>
              Growth Journey
            </span>
          </div>

          {/* Identity statement */}
          {userLoading ? (
            <div className="animate-pulse rounded-xl h-10 w-3/4 bg-[var(--bg-sunken)] mb-4" />
          ) : user?.identityStatement ? (
            <p
              className="text-2xl sm:text-3xl leading-snug font-normal mb-5"
              style={{
                fontFamily: "var(--font-display)",
                fontStyle: "italic",
                color: "var(--text-primary)",
              }}
            >
              &ldquo;{user.identityStatement}&rdquo;
            </p>
          ) : (
            <p
              className="text-xl leading-snug font-normal mb-5"
              style={{
                fontFamily: "var(--font-display)",
                fontStyle: "italic",
                color: "var(--text-secondary)",
              }}
            >
              Your personal transformation archive
            </p>
          )}

          {/* Stat grid */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="glass-panel p-3 rounded-xl flex items-center gap-2.5">
              <Calendar size={16} className="text-[var(--accent)] flex-shrink-0" />
              <div>
                <span className="text-[11px] block" style={{ color: "var(--text-tertiary)" }}>
                  Journey Started
                </span>
                <span className="text-xs font-semibold truncate block" style={{ color: "var(--text-primary)" }}>
                  {startLabel}
                </span>
              </div>
            </div>

            <div className="glass-panel p-3 rounded-xl flex items-center gap-2.5">
              <Zap size={16} className="text-[var(--warning)] flex-shrink-0" />
              <div>
                <span className="text-[11px] block" style={{ color: "var(--text-tertiary)" }}>
                  Best Streak
                </span>
                <span className="text-xs font-semibold block" style={{ color: "var(--text-primary)" }}>
                  {streakLoading ? "..." : `${bestStreak} Days`}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 3D Visualizer */}
        <div className="flex-shrink-0 flex items-center justify-center">
          <ThreeStreakCrystal streak={bestStreak ?? 0} size={140} />
        </div>
      </div>
    </motion.section>
  );
}
