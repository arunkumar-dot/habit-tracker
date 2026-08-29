"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sun, Moon, Palette, Check, Sparkles } from "lucide-react";
import { useTheme, THEME_PALETTES, type ThemePalette } from "@/components/providers/theme-provider";

export function ThemeToggle() {
  const { palette, setPalette, theme, toggleTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const isDark = theme === "dark";

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  return (
    <div className="relative" ref={menuRef}>
      <div className="flex items-center gap-1">
        {/* Quick Dark/Light toggle */}
        <button
          type="button"
          onClick={toggleTheme}
          className="flex items-center justify-center w-8 h-8 rounded-xl transition-all duration-200 hover:bg-[var(--bg-hover)]"
          style={{ color: "var(--text-secondary)" }}
          aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
          title={isDark ? "Switch to light mode" : "Switch to dark mode"}
        >
          {isDark ? <Sun size={17} /> : <Moon size={17} />}
        </button>

        {/* Theme Palette Menu Button */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center justify-center w-8 h-8 rounded-xl transition-all duration-200 hover:bg-[var(--bg-hover)]"
          style={{
            color: isOpen ? "var(--accent)" : "var(--text-secondary)",
            background: isOpen ? "color-mix(in srgb, var(--accent) 12%, transparent)" : "transparent",
          }}
          aria-label="Choose Theme Palette"
          title="Choose Theme Palette"
        >
          <Palette size={17} />
        </button>
      </div>

      {/* Glassmorphic Palette Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 6 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="absolute right-0 top-10 w-72 p-3.5 glass-card rounded-2xl shadow-2xl z-50 overflow-hidden"
            style={{
              border: "1px solid var(--border-subtle)",
              background: "color-mix(in srgb, var(--bg-elevated) 94%, transparent)",
              backdropFilter: "blur(24px)",
              WebkitBackdropFilter: "blur(24px)",
            }}
          >
            <div className="flex items-center justify-between px-1 mb-2.5 pb-2 border-b border-[var(--border-subtle)]">
              <div className="flex items-center gap-1.5">
                <Sparkles size={13} className="text-[var(--accent)]" />
                <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--text-primary)" }}>
                  Theme Palettes
                </span>
              </div>
              <span className="text-[11px]" style={{ color: "var(--text-tertiary)" }}>
                6 Curated Themes
              </span>
            </div>

            <div className="space-y-1.5">
              {THEME_PALETTES.map((item) => {
                const isSelected = palette === item.id;
                const accentColor = isDark ? item.accentDark : item.accentLight;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setPalette(item.id);
                    }}
                    className={`w-full flex items-center justify-between p-2 rounded-xl transition-all text-left ${
                      isSelected
                        ? "bg-[var(--bg-hover)] font-medium"
                        : "hover:bg-[var(--bg-sunken)] opacity-85 hover:opacity-100"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      {/* Color Swatch Dot */}
                      <div
                        className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm"
                        style={{
                          background: `linear-gradient(135deg, ${accentColor}, ${item.bgDark})`,
                          border: isSelected ? "2px solid var(--text-primary)" : "1px solid rgba(255,255,255,0.2)",
                        }}
                      />
                      <div>
                        <span className="text-xs font-semibold block" style={{ color: "var(--text-primary)" }}>
                          {item.name}
                        </span>
                        <span className="text-[10px] block truncate max-w-[170px]" style={{ color: "var(--text-tertiary)" }}>
                          {item.description}
                        </span>
                      </div>
                    </div>

                    {isSelected && (
                      <div
                        className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ background: "var(--accent)", color: "#ffffff" }}
                      >
                        <Check size={10} strokeWidth={3} />
                      </div>
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
