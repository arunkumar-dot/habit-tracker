"use client";

import { useTheme } from "@/components/providers/theme-provider";

/**
 * Stable theme cycle button. It avoids icon package imports so stale dev chunks
 * cannot keep referencing removed lucide icon modules.
 */
export function ThemeCycleButton() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="flex items-center justify-center w-8 h-8 rounded-lg transition-colors"
      style={{ color: "var(--text-secondary)" }}
      aria-label={`Current theme: ${theme}. Toggle theme`}
      title={`Current theme: ${theme}. Toggle theme`}
      type="button"
    >
      <svg
        aria-hidden="true"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <rect x="4" y="4" width="6" height="6" rx="1.6" fill="var(--nebula-purple)" />
        <rect x="14" y="4" width="6" height="6" rx="1.6" fill="var(--nebula-cyan)" />
        <rect x="4" y="14" width="6" height="6" rx="1.6" fill="var(--stellar-gold)" />
        <rect x="14" y="14" width="6" height="6" rx="1.6" fill="var(--ember-orange)" />
      </svg>
    </button>
  );
}
