"use client";

import { X } from "lucide-react";
import type { Nudge } from "@/lib/nudges";

interface NudgeBannerProps {
  nudges: Nudge[];
  onDismiss: (id: string) => void;
}

/**
 * Displays up to 2 contextual nudge cards above the habit list.
 * Each card can be dismissed for the current session.
 */
export function NudgeBanner({ nudges, onDismiss }: NudgeBannerProps) {
  if (nudges.length === 0) return null;

  return (
    <div className="flex flex-col gap-2 mb-5">
      {nudges.map((nudge) => (
        <div
          key={nudge.id}
          className="flex items-start justify-between gap-3 rounded-xl px-4 py-3"
          style={{
            background: "var(--bg-surface)",
            borderLeft: "3px solid var(--accent-primary)",
            border: "1px solid var(--border)",
            borderLeftWidth: "3px",
          }}
        >
          <p className="text-sm leading-snug" style={{ color: "var(--text-primary)" }}>
            {nudge.message}
          </p>
          <button
            onClick={() => onDismiss(nudge.id)}
            className="flex-shrink-0 mt-0.5 rounded hover:opacity-70 transition-opacity"
            style={{ color: "var(--text-secondary)" }}
            aria-label="Dismiss"
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
}
