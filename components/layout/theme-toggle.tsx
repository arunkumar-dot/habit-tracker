"use client";

import { useTheme } from "@/components/providers/theme-provider";

/**
 * Theme button that cycles through light, dark, space, and space-light modes.
 * Placed in the topbar alongside the notification toggle.
 */
export function ThemeToggle() {
  const { toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="flex items-center justify-center w-8 h-8 rounded-lg transition-colors"
      style={{ color: "var(--text-secondary)" }}
      aria-label="Toggle theme"
      title="Toggle theme"
    >
      <span
        aria-hidden="true"
        className="block h-4 w-4 rounded-full"
        style={{
          background:
            "conic-gradient(from 45deg, var(--accent), var(--nebula-cyan), var(--stellar-gold), var(--accent))",
          boxShadow: "0 0 0 1px var(--border-default)",
        }}
      />
    </button>
  );
}
