"use client";

import { motion } from "framer-motion";
import { Sparkles, Trophy } from "lucide-react";

interface JourneyOneNumberProps {
  totalCompletions: number;
  isLoading: boolean;
}

export function JourneyOneNumber({ totalCompletions, isLoading }: JourneyOneNumberProps) {
  return (
    <motion.section
      initial={{ opacity: 0, scale: 0.96 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45 }}
      className="glass-card glow-card rounded-3xl p-8 sm:p-10 mb-10 text-center relative overflow-hidden"
    >
      <div className="flex items-center justify-center gap-1.5 mb-3">
        <Trophy size={16} className="text-[var(--accent)]" />
        <p
          className="text-xs uppercase tracking-widest font-semibold"
          style={{ color: "var(--accent)" }}
        >
          All-Time Milestones
        </p>
      </div>

      <p
        className="text-sm font-medium mb-4"
        style={{ color: "var(--text-secondary)" }}
      >
        Total times you chose to show up
      </p>

      {isLoading ? (
        <div
          className="animate-pulse rounded-2xl h-24 w-48 mx-auto my-3"
          style={{ background: "var(--bg-sunken)" }}
        />
      ) : (
        <motion.p
          key={totalCompletions}
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 350, damping: 25 }}
          className="my-2 font-normal select-none"
          style={{
            fontFamily: "var(--font-display)",
            fontStyle: "italic",
            fontSize: "clamp(64px, 16vw, 96px)",
            lineHeight: 1,
            color: "var(--text-primary)",
            textShadow: "0 4px 20px color-mix(in srgb, var(--accent) 20%, transparent)",
          }}
          aria-label={`${totalCompletions} total habit completions`}
        >
          {totalCompletions.toLocaleString()}
        </motion.p>
      )}

      <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-semibold mt-2 glass-panel" style={{ color: "var(--text-secondary)" }}>
        <Sparkles size={13} className="text-[var(--accent)]" />
        <span>{totalCompletions === 1 ? "Habit completed" : "Habits completed"}</span>
      </div>
    </motion.section>
  );
}
