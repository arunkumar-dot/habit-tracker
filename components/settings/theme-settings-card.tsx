"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Sun,
  Moon,
  Laptop,
  Palette,
  Check,
  Sparkles,
  Volume2,
  VolumeX,
  Waves,
  Grid,
  Flame,
  Rocket,
  Layers,
} from "lucide-react";
import {
  useTheme,
  THEME_PALETTES,
  BACKGROUND_STYLES,
  type ThemeMode,
  type BackgroundStyle,
} from "@/components/providers/theme-provider";
import {
  isSoundEnabled,
  setSoundEnabled,
  getSoundTheme,
  setSoundTheme,
  playCompletionSound,
  SOUND_THEMES,
  type SoundTheme,
} from "@/lib/sound-effects";

const STYLE_ICONS: Record<BackgroundStyle, typeof Sparkles> = {
  stardust: Flame,
  magnetic_grid: Grid,
  constellation: Sparkles,
  aurora_glow: Waves,
  warp: Rocket,
  minimal: Layers,
};

export function ThemeSettingsCard() {
  const { palette, setPalette, mode, setMode, theme, backgroundStyle, setBackgroundStyle } = useTheme();
  const [soundActive, setSoundActive] = useState(true);
  const [activeSoundTheme, setActiveSoundTheme] = useState<SoundTheme>("crystal");
  const isDark = theme === "dark";

  useEffect(() => {
    setSoundActive(isSoundEnabled());
    setActiveSoundTheme(getSoundTheme());
  }, []);

  const handleToggleSound = () => {
    const next = !soundActive;
    setSoundActive(next);
    setSoundEnabled(next);
    if (next) {
      playCompletionSound();
    }
  };

  const handleSelectTheme = (themeId: SoundTheme) => {
    setSoundTheme(themeId);
    setActiveSoundTheme(themeId);
    playCompletionSound(themeId);
  };

  return (
    <div className="glass-card rounded-3xl p-6 sm:p-7 space-y-7">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Palette size={18} className="text-[var(--accent)]" />
          <h2 className="text-base font-semibold" style={{ color: "var(--text-primary)" }}>
            Visuals, Themes & Sound
          </h2>
        </div>
        <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
          Customize your 3D motion backgrounds, color palette, and habit completion audio rings.
        </p>
      </div>

      {/* 3D Visual Background Selector */}
      <div>
        <label className="text-xs font-semibold uppercase tracking-wider block mb-2.5" style={{ color: "var(--text-tertiary)" }}>
          3D Motion Background Scene
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {BACKGROUND_STYLES.map((style) => {
            const isSelected = backgroundStyle === style.id;
            const Icon = STYLE_ICONS[style.id] ?? Sparkles;

            return (
              <motion.button
                key={style.id}
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setBackgroundStyle(style.id)}
                className={`p-3.5 rounded-2xl text-left transition-all border flex flex-col justify-between relative overflow-hidden cursor-pointer ${
                  isSelected
                    ? "glass-panel border-[var(--accent)] shadow-md"
                    : "glass-panel border-[var(--border-subtle)] hover:border-[var(--border-default)]"
                }`}
              >
                <div className="flex items-center justify-between w-full mb-2">
                  <div
                    className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{
                      background: isSelected
                        ? "color-mix(in srgb, var(--accent) 20%, transparent)"
                        : "var(--bg-sunken)",
                      color: isSelected ? "var(--accent)" : "var(--text-secondary)",
                    }}
                  >
                    <Icon size={16} />
                  </div>
                  <span
                    className="text-[10px] px-2 py-0.5 rounded-md font-mono"
                    style={{
                      background: isSelected
                        ? "color-mix(in srgb, var(--accent) 15%, transparent)"
                        : "var(--bg-sunken)",
                      color: isSelected ? "var(--accent)" : "var(--text-tertiary)",
                    }}
                  >
                    {style.badge}
                  </span>
                </div>

                <div>
                  <span className="text-xs font-semibold block" style={{ color: "var(--text-primary)" }}>
                    {style.name}
                  </span>
                  <span className="text-[11px] block mt-0.5 line-clamp-1" style={{ color: "var(--text-tertiary)" }}>
                    {style.description}
                  </span>
                </div>

                {isSelected && (
                  <div
                    className="absolute top-2.5 right-2.5 w-4 h-4 rounded-full flex items-center justify-center text-white"
                    style={{ background: "var(--accent)" }}
                  >
                    <Check size={10} strokeWidth={3} />
                  </div>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Mode Selector (Light / Dark / System) */}
      <div>
        <label className="text-xs font-semibold uppercase tracking-wider block mb-2.5" style={{ color: "var(--text-tertiary)" }}>
          Display Mode
        </label>
        <div className="grid grid-cols-3 gap-2.5 p-1 rounded-2xl glass-panel">
          {[
            { id: "light" as ThemeMode, label: "Light", icon: Sun },
            { id: "dark" as ThemeMode, label: "Dark", icon: Moon },
            { id: "system" as ThemeMode, label: "System", icon: Laptop },
          ].map((item) => {
            const isSelected = mode === item.id;
            const Icon = item.icon;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setMode(item.id)}
                className={`relative flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  isSelected
                    ? "text-[var(--text-primary)] shadow-sm"
                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-sunken)]"
                }`}
              >
                {isSelected && (
                  <motion.div
                    layoutId="themeModeSelectedPill"
                    className="absolute inset-0 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)]"
                    transition={{ type: "spring", stiffness: 450, damping: 30 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-1.5">
                  <Icon size={14} />
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Palette Grid */}
      <div>
        <label className="text-xs font-semibold uppercase tracking-wider block mb-2.5" style={{ color: "var(--text-tertiary)" }}>
          Curated Color Palettes
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {THEME_PALETTES.map((item) => {
            const isSelected = palette === item.id;
            const accentColor = isDark ? item.accentDark : item.accentLight;

            return (
              <motion.button
                key={item.id}
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setPalette(item.id)}
                className={`p-3.5 rounded-2xl text-left transition-all border flex items-start justify-between relative overflow-hidden cursor-pointer ${
                  isSelected
                    ? "glass-panel border-[var(--accent)] shadow-md"
                    : "glass-panel border-[var(--border-subtle)] hover:border-[var(--border-default)]"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 shadow-inner mt-0.5"
                    style={{
                      background: `linear-gradient(135deg, ${accentColor}, ${item.bgDark})`,
                      border: isSelected ? "2px solid var(--text-primary)" : "1px solid rgba(255,255,255,0.2)",
                    }}
                  >
                    <Sparkles size={14} className="text-white opacity-80" />
                  </div>

                  <div>
                    <span className="text-sm font-semibold block" style={{ color: "var(--text-primary)" }}>
                      {item.name}
                    </span>
                    <span className="text-xs block mt-0.5 line-clamp-1" style={{ color: "var(--text-tertiary)" }}>
                      {item.description}
                    </span>
                  </div>
                </div>

                {isSelected && (
                  <div
                    className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 text-white"
                    style={{ background: "var(--accent)" }}
                  >
                    <Check size={12} strokeWidth={3} />
                  </div>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* ── Audio Chimes & Sound Themes ───────────────────────────────── */}
      <div className="pt-4 border-t border-[var(--border-subtle)] space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{
                background: soundActive
                  ? "color-mix(in srgb, var(--accent) 15%, transparent)"
                  : "var(--bg-sunken)",
                color: soundActive ? "var(--accent)" : "var(--text-tertiary)",
              }}
            >
              {soundActive ? <Volume2 size={18} /> : <VolumeX size={18} />}
            </div>
            <div>
              <span className="text-sm font-semibold block" style={{ color: "var(--text-primary)" }}>
                Habit Completion Sound Effects
              </span>
              <span className="text-xs" style={{ color: "var(--text-tertiary)" }}>
                Plays an acoustic reward ring when checking off habits
              </span>
            </div>
          </div>

          <button
            type="button"
            role="switch"
            aria-checked={soundActive}
            onClick={handleToggleSound}
            className={`w-11 h-6 rounded-full transition-colors relative flex items-center p-0.5 cursor-pointer ${
              soundActive ? "bg-[var(--accent)]" : "bg-[var(--border-default)]"
            }`}
          >
            <motion.div
              layout
              className="w-5 h-5 rounded-full bg-white shadow-sm"
              style={{
                marginLeft: soundActive ? "auto" : "0",
              }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          </button>
        </div>

        {/* Sound Theme / Ring Picker (Visible when sounds are enabled) */}
        {soundActive && (
          <div className="pt-2 pl-0 sm:pl-12 space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wider block" style={{ color: "var(--text-tertiary)" }}>
              Choose Completion Ring
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {SOUND_THEMES.map((themeItem) => {
                const isSelected = activeSoundTheme === themeItem.id;
                return (
                  <button
                    key={themeItem.id}
                    type="button"
                    onClick={() => handleSelectTheme(themeItem.id)}
                    className="p-3 rounded-2xl text-left transition-all cursor-pointer flex items-center justify-between shadow-xs"
                    style={{
                      background: isSelected
                        ? "color-mix(in srgb, var(--accent) 12%, var(--bg-elevated))"
                        : "var(--bg-sunken)",
                      border: isSelected ? "1.5px solid var(--accent)" : "1px solid var(--border-subtle)",
                    }}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <span className="text-lg">{themeItem.emoji}</span>
                      <div className="truncate">
                        <span className="font-semibold text-xs block text-[var(--text-primary)]">
                          {themeItem.name}
                        </span>
                        <span className="text-[10px] text-[var(--text-tertiary)] block truncate">
                          {themeItem.description}
                        </span>
                      </div>
                    </div>
                    {isSelected && (
                      <div className="w-4 h-4 rounded-full bg-[var(--accent)] flex items-center justify-center text-white flex-shrink-0 ml-2">
                        <Check size={10} strokeWidth={3} />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
