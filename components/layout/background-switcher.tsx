"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Waves,
  Grid,
  Flame,
  Rocket,
  Layers,
  Check,
  ChevronDown,
} from "lucide-react";
import {
  useTheme,
  BACKGROUND_STYLES,
  type BackgroundStyle,
} from "@/components/providers/theme-provider";

const STYLE_ICONS: Record<BackgroundStyle, typeof Sparkles> = {
  stardust: Flame,
  magnetic_grid: Grid,
  constellation: Sparkles,
  aurora_glow: Waves,
  warp: Rocket,
  minimal: Layers,
};

export function BackgroundSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { backgroundStyle, setBackgroundStyle } = useTheme();

  const currentStyle =
    BACKGROUND_STYLES.find((s) => s.id === backgroundStyle) ?? BACKGROUND_STYLES[0];
  const CurrentIcon = STYLE_ICONS[currentStyle.id] ?? Sparkles;

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl glass-panel text-xs font-semibold transition-all hover:bg-[var(--bg-hover)]"
        style={{ color: "var(--text-secondary)" }}
        title="Switch 3D / Motion Background Scene"
      >
        <CurrentIcon size={14} className="text-[var(--accent)]" />
        <span className="hidden md:inline font-medium" style={{ color: "var(--text-primary)" }}>
          {currentStyle.name.split(" ")[0]}
        </span>
        <ChevronDown
          size={12}
          className={`opacity-60 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -6 }}
            transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="absolute right-0 mt-2 w-72 p-2 rounded-2xl glass-card border border-[var(--border-subtle)] shadow-2xl z-50 overflow-hidden"
            style={{
              background: "color-mix(in srgb, var(--bg-elevated) 96%, transparent)",
              backdropFilter: "blur(28px)",
              WebkitBackdropFilter: "blur(28px)",
            }}
          >
            <div className="px-2 py-1.5 mb-1 flex items-center justify-between border-b border-[var(--border-subtle)]">
              <span className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: "var(--text-tertiary)" }}>
                3D Visual Backgrounds
              </span>
            </div>

            <div className="space-y-1">
              {BACKGROUND_STYLES.map((style) => {
                const isSelected = backgroundStyle === style.id;
                const Icon = STYLE_ICONS[style.id] ?? Sparkles;

                return (
                  <button
                    key={style.id}
                    type="button"
                    onClick={() => {
                      setBackgroundStyle(style.id);
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-start justify-between p-2.5 rounded-xl text-left transition-all ${
                      isSelected
                        ? "bg-[var(--bg-hover)] translate-x-0.5"
                        : "hover:bg-[var(--bg-sunken)]"
                    }`}
                  >
                    <div className="flex items-start gap-2.5 min-w-0">
                      <div
                        className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                        style={{
                          background: isSelected
                            ? "color-mix(in srgb, var(--accent) 20%, transparent)"
                            : "var(--bg-sunken)",
                          color: isSelected ? "var(--accent)" : "var(--text-secondary)",
                        }}
                      >
                        <Icon size={14} />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span
                            className="text-xs font-semibold block truncate"
                            style={{ color: "var(--text-primary)" }}
                          >
                            {style.name}
                          </span>
                        </div>
                        <span
                          className="text-[10px] block line-clamp-1 mt-0.5"
                          style={{ color: "var(--text-tertiary)" }}
                        >
                          {style.description}
                        </span>
                      </div>
                    </div>

                    {isSelected && (
                      <Check size={14} className="text-[var(--accent)] flex-shrink-0 mt-1" />
                    )}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
