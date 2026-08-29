"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Wrench,
  Sparkles,
  X,
  RotateCcw,
  Volume2,
} from "lucide-react";
import {
  useTheme,
  THEME_PALETTES,
} from "@/components/providers/theme-provider";
import { MilestoneUnlockModal } from "@/components/milestones/milestone-unlock-modal";
import {
  SOUND_THEMES,
  getSoundTheme,
  setSoundTheme,
  playCompletionSound,
  type SoundTheme,
} from "@/lib/sound-effects";
import type { HolographicMilestoneData } from "./holographic-milestone-card";

const DEV_MILESTONES: HolographicMilestoneData[] = [
  {
    daysRequired: 3,
    name: "Getting Started",
    tier: "bronze",
    description: "3 consecutive days of showing up. The seed has sprouted.",
    iconName: "Sprout",
    habitTitle: "Morning Run 5K",
    achievedAt: Date.now(),
  },
  {
    daysRequired: 7,
    name: "First Week",
    tier: "bronze",
    description: "A full week of unbroken momentum. You are proving consistency.",
    iconName: "Flame",
    habitTitle: "Deep Work Block",
    achievedAt: Date.now(),
  },
  {
    daysRequired: 21,
    name: "Habit Lock",
    tier: "silver",
    description: "21 consecutive days. The neurological loop is officially wired.",
    iconName: "Medal",
    habitTitle: "Mindful Meditation",
    achievedAt: Date.now(),
  },
  {
    daysRequired: 30,
    name: "Strong Habit",
    tier: "gold",
    description: "One full month of showing up. This is no longer effort, it is identity.",
    iconName: "Trophy",
    habitTitle: "Evening Reading",
    achievedAt: Date.now(),
  },
  {
    daysRequired: 66,
    name: "Habit Mastery",
    tier: "platinum",
    description: "66 days of research-backed automaticity. True identity mastery.",
    iconName: "Gem",
    habitTitle: "Hydration 3L",
    achievedAt: Date.now(),
  },
];

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
  const [activeSoundTheme, setActiveSoundThemeState] = useState<SoundTheme>(() => getSoundTheme());
  const [previewHoloMilestone, setPreviewHoloMilestone] = useState<HolographicMilestoneData | null>(null);

  const handleSelectSound = (themeId: SoundTheme) => {
    setSoundTheme(themeId);
    setActiveSoundThemeState(themeId);
    playCompletionSound(themeId);
  };

  const {
    palette,
    setPalette,
    backgroundStyle,
    setBackgroundStyle,
  } = useTheme();

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
    <>
      <div className="fixed bottom-20 sm:bottom-6 right-6 z-50 flex flex-col items-end">
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 12 }}
              transition={{ duration: 0.2 }}
              className="mb-3 w-84 max-h-[85vh] overflow-y-auto rounded-3xl glass-card glow-card border border-[var(--border-default)] shadow-2xl p-5 flex flex-col gap-4 text-xs no-scrollbar"
              style={{ background: "var(--bg-elevated)" }}
            >
              {/* Header */}
              <div className="flex items-center justify-between pb-2 border-b border-[var(--border-subtle)]">
                <div className="flex items-center gap-1.5 font-bold text-[var(--text-primary)]">
                  <Wrench size={14} className="text-[var(--accent)]" />
                  <span>3D & Effects Live Tester</span>
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

              {/* 1. Streak Morphing Presets */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-semibold text-[var(--text-secondary)]">
                    Crystal Streak ({testStreak} Days)
                  </span>
                  <span className="text-[10px] font-mono text-[var(--accent)] font-bold">
                    {testStreak >= 30
                      ? "80-Face Poly"
                      : testStreak >= 7
                      ? "20-Face Icosa"
                      : testStreak >= 3
                      ? "12-Face Dodeca"
                      : "8-Face Octa"}
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
                    Ignites full glow & 60 sparks
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

              {/* 3. Progress Glow Slider */}
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

              {/* 4. 3D Holographic Milestone Cards Tester */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-semibold text-[var(--text-secondary)]">
                    3D Holo Badge Cards
                  </span>
                  <span className="text-[10px] text-[var(--text-tertiary)]">
                    Click to test tilt
                  </span>
                </div>
                <div className="grid grid-cols-5 gap-1">
                  {DEV_MILESTONES.map((m) => (
                    <button
                      key={m.daysRequired}
                      type="button"
                      onClick={() => setPreviewHoloMilestone(m)}
                      className="py-1 px-1 rounded-xl text-[10px] font-bold bg-[var(--bg-sunken)] hover:bg-[var(--bg-elevated)] border border-[var(--border-subtle)] hover:border-[var(--accent)] transition-all cursor-pointer text-center"
                    >
                      {m.daysRequired}d
                    </button>
                  ))}
                </div>
              </div>

              {/* 5. Background Style Switcher */}
              <div>
                <span className="font-semibold text-[var(--text-secondary)] block mb-1.5">
                  3D Background Physics Style
                </span>
                <div className="grid grid-cols-3 gap-1">
                  {[
                    { id: "stardust", name: "✨ Stardust" },
                    { id: "magnetic_grid", name: "🧲 Magnetic" },
                    { id: "constellation", name: "🌌 Celestial" },
                    { id: "aurora_glow", name: "🌊 Aurora" },
                    { id: "warp", name: "🚀 Warp 3D" },
                    { id: "minimal", name: "⬛ Minimal" },
                  ].map((bg) => (
                    <button
                      key={bg.id}
                      type="button"
                      onClick={() => setBackgroundStyle(bg.id as any)}
                      className="py-1 px-1.5 rounded-xl text-[10px] font-semibold transition-all cursor-pointer truncate text-center"
                      style={{
                        background: backgroundStyle === bg.id ? "var(--accent)" : "var(--bg-sunken)",
                        color: backgroundStyle === bg.id ? "#ffffff" : "var(--text-secondary)",
                        border: backgroundStyle === bg.id ? "1px solid var(--accent)" : "1px solid var(--border-subtle)",
                      }}
                    >
                      {bg.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* 6. Sound FX Themes Switcher */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-1.5 font-semibold text-[var(--text-secondary)]">
                    <Volume2 size={13} className="text-[var(--accent)]" />
                    <span>Habit Completion Sound</span>
                  </div>
                  <span className="text-[10px] text-[var(--text-tertiary)]">Tap to test</span>
                </div>
                <div className="grid grid-cols-1 gap-1">
                  {SOUND_THEMES.map((theme) => {
                    const isActive = activeSoundTheme === theme.id;
                    return (
                      <button
                        key={theme.id}
                        type="button"
                        onClick={() => handleSelectSound(theme.id)}
                        className="px-2.5 py-1.5 rounded-xl text-left flex items-center justify-between transition-all cursor-pointer shadow-2xs"
                        style={{
                          background: isActive
                            ? "color-mix(in srgb, var(--accent) 15%, var(--bg-elevated))"
                            : "var(--bg-sunken)",
                          border: isActive
                            ? "1.5px solid var(--accent)"
                            : "1px solid var(--border-subtle)",
                        }}
                      >
                        <div className="flex items-center gap-2 truncate">
                          <span className="text-sm">{theme.emoji}</span>
                          <div className="truncate">
                            <span className="font-bold text-[11px] block text-[var(--text-primary)]">
                              {theme.name}
                            </span>
                            <span className="text-[9px] text-[var(--text-tertiary)] block truncate">
                              {theme.description}
                            </span>
                          </div>
                        </div>
                        {isActive && (
                          <span className="text-[10px] font-bold text-[var(--accent)]">Active</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 7. Quick Theme Palette Switcher */}
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

      {/* 3D Holo Card Modal */}
      <MilestoneUnlockModal
        isOpen={!!previewHoloMilestone}
        milestone={previewHoloMilestone}
        onClose={() => setPreviewHoloMilestone(null)}
      />
    </>
  );
}
