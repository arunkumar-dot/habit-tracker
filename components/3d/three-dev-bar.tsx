"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Wrench, Sparkles, X, RotateCcw, Flame } from "lucide-react";
import { useTheme, THEME_PALETTES, ThemePalette } from "@/components/providers/theme-provider";

interface ThreeDevBarProps {
  realStreak: number;
  realIsCompleted: boolean;
  realCompletionRatio: number;
  onOverrideChange: (overrides: {
    streak: number;
    isCompletedToday: boolean;
    completionRatio: number;
    isOverridden: boolean;
  }) => void;
}

export function ThreeDevBar({
  realStreak,
  realIsCompleted,
  realCompletionRatio,
  onOverrideChange,
}: ThreeDevBarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isOverridden, setIsOverridden] = useState(false);
  const [testStreak, setTestStreak] = useState(realStreak);
  const [testCompleted, setTestCompleted] = useState(realIsCompleted);
  const [testRatio, setTestRatio] = useState(realCompletionRatio);
  const { palette, setPalette } = useTheme();

  const handleStreakChange = (val: number) => {
    setIsOverridden(true);
    setTestStreak(val);
    onOverrideChange({
      streak: val,
      isCompletedToday: testCompleted,
      completionRatio: testRatio,
      isOverridden: true,
    });
  };

  const handleToggleCompleted = () => {
    const next = !testCompleted;
    setIsOverridden(true);
    setTestCompleted(next);
    const nextRatio = next ? 1 : 0.4;
    setTestRatio(nextRatio);
    onOverrideChange({
      streak: testStreak,
      isCompletedToday: next,
      completionRatio: nextRatio,
      isOverridden: true,
    });
  };

  const handleRatioChange = (val: number) => {
    setIsOverridden(true);
    setTestRatio(val);
    const isComp = val >= 1;
    setTestCompleted(isComp);
    onOverrideChange({
      streak: testStreak,
      isCompletedToday: isComp,
      completionRatio: val,
      isOverridden: true,
    });
  };

  const handleReset = () => {
    setIsOverridden(false);
    setTestStreak(realStreak);
    setTestCompleted(realIsCompleted);
    setTestRatio(realCompletionRatio);
    onOverrideChange({
      streak: realStreak,
      isCompletedToday: realIsCompleted,
      completionRatio: realCompletionRatio,
      isOverridden: false,
    });
  };

  return (
    <div className="fixed bottom-20 sm:bottom-6 right-6 z-50 flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 12 }}
            transition={{ duration: 0.2 }}
            className="mb-3 w-80 rounded-3xl glass-card glow-card border border-[var(--border-default)] shadow-2xl p-5 flex flex-col gap-4 text-xs"
            style={{ background: "var(--bg-elevated)" }}
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-2 border-b border-[var(--border-subtle)]">
              <div className="flex items-center gap-1.5 font-bold text-[var(--text-primary)]">
                <Wrench size={14} className="text-[var(--accent)]" />
                <span>3D Crystal Live Tester</span>
              </div>
              <div className="flex items-center gap-2">
                {isOverridden && (
                  <button
                    type="button"
                    onClick={handleReset}
                    className="p-1 rounded-md hover:bg-[var(--bg-sunken)] text-[var(--text-tertiary)] hover:text-[var(--text-primary)] cursor-pointer"
                    title="Reset to real live state"
                  >
                    <RotateCcw size={13} />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="p-1 rounded-md hover:bg-[var(--bg-sunken)] text-[var(--text-tertiary)] hover:text-[var(--text-primary)] cursor-pointer"
                >
                  <X size={14} />
                </button>
              </div>
            </div>

            {/* 1. Streak Tier Preset Buttons */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-semibold text-[var(--text-secondary)]">
                  Streak Level ({testStreak} Days)
                </span>
                <span className="text-[10px] font-mono text-[var(--accent)] font-bold">
                  {testStreak >= 30
                    ? "Mastery 80-Face"
                    : testStreak >= 7
                    ? "Momentum 20-Face"
                    : testStreak >= 3
                    ? "Sprout 12-Face"
                    : "Initiate 8-Face"}
                </span>
              </div>
              <div className="grid grid-cols-4 gap-1 mb-2">
                {[
                  { d: 1, l: "Day 1" },
                  { d: 3, l: "Day 3" },
                  { d: 7, l: "Day 7" },
                  { d: 30, l: "Day 30" },
                ].map((tier) => (
                  <button
                    key={tier.d}
                    type="button"
                    onClick={() => handleStreakChange(tier.d)}
                    className="py-1 px-1.5 rounded-lg font-semibold text-[11px] transition-all cursor-pointer text-center"
                    style={{
                      background: testStreak === tier.d ? "var(--accent)" : "var(--bg-sunken)",
                      color: testStreak === tier.d ? "#ffffff" : "var(--text-secondary)",
                      border: testStreak === tier.d ? "1px solid var(--accent)" : "1px solid var(--border-subtle)",
                    }}
                  >
                    {tier.l}
                  </button>
                ))}
              </div>
              <input
                type="range"
                min="0"
                max="66"
                value={testStreak}
                onChange={(e) => handleStreakChange(parseInt(e.target.value, 10))}
                className="w-full accent-[var(--accent)] h-1.5 bg-[var(--bg-sunken)] rounded-lg cursor-pointer"
              />
            </div>

            {/* 2. 100% Completed Today Toggle */}
            <div className="flex items-center justify-between p-2.5 rounded-2xl bg-[var(--bg-base)] border border-[var(--border-subtle)]">
              <div>
                <span className="font-semibold block text-[var(--text-primary)]">
                  All Habits Done Today
                </span>
                <span className="text-[10px] text-[var(--text-tertiary)]">
                  Ignites energy ring & 56 particles
                </span>
              </div>
              <button
                type="button"
                onClick={handleToggleCompleted}
                className="px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1 text-[11px]"
                style={{
                  background: testCompleted ? "var(--success)" : "var(--bg-sunken)",
                  color: testCompleted ? "#ffffff" : "var(--text-secondary)",
                  border: testCompleted ? "1px solid var(--success)" : "1px solid var(--border-subtle)",
                }}
              >
                <Sparkles size={12} />
                <span>{testCompleted ? "ON (Glowing)" : "OFF"}</span>
              </button>
            </div>

            {/* 3. Completion Progress Slider */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="font-semibold text-[var(--text-secondary)]">
                  Progress Glow ({Math.round(testRatio * 100)}%)
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={testRatio}
                onChange={(e) => handleRatioChange(parseFloat(e.target.value))}
                className="w-full accent-[var(--accent)] h-1.5 bg-[var(--bg-sunken)] rounded-lg cursor-pointer"
              />
            </div>

            {/* 4. Quick Theme Palette */}
            <div>
              <span className="font-semibold text-[var(--text-secondary)] block mb-1.5">
                Theme Palette
              </span>
              <div className="grid grid-cols-3 gap-1">
                {THEME_PALETTES.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setPalette(p.id)}
                    className="flex items-center gap-1.5 p-1.5 rounded-xl transition-all cursor-pointer"
                    style={{
                      background: palette === p.id ? "var(--bg-hover)" : "var(--bg-sunken)",
                      border: palette === p.id ? "1.5px solid var(--accent)" : "1px solid transparent",
                    }}
                  >
                    <span
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ background: p.accentDark }}
                    />
                    <span className="truncate text-[10px] text-[var(--text-primary)]">
                      {p.name.split(" ")[0]}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Pill Trigger */}
      <motion.button
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3.5 py-2 rounded-full font-semibold shadow-xl border cursor-pointer transition-all"
        style={{
          background: "var(--bg-elevated)",
          color: "var(--text-primary)",
          borderColor: isOverridden ? "var(--accent)" : "var(--border-default)",
        }}
      >
        <Wrench size={14} className="text-[var(--accent)]" />
        <span className="text-xs">3D Test Bar</span>
        {isOverridden && (
          <span className="w-2 h-2 rounded-full bg-[var(--accent)] animate-pulse" />
        )}
      </motion.button>
    </div>
  );
}
