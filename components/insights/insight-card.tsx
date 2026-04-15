"use client";

import { X } from "lucide-react";
import type { InsightResult } from "@/lib/insights";

interface InsightCardProps {
  insight: InsightResult;
  onDismiss: (id: string) => void;
}

const borderColors: Record<InsightResult["type"], string> = {
  pattern: "var(--accent)",
  recommendation: "var(--warning)",
};

export function InsightCard({ insight, onDismiss }: InsightCardProps) {
  const accentColor = borderColors[insight.type];

  return (
    <div
      className="flex items-start gap-3 rounded-xl px-4 py-3"
      style={{
        background: "var(--bg-elevated)",
        border: "1px solid var(--border-subtle)",
        borderLeft: `3px solid ${accentColor}`,
      }}
    >
      <span className="text-lg leading-none mt-0.5 flex-shrink-0">
        {insight.icon}
      </span>
      <p className="flex-1 text-sm leading-relaxed" style={{ color: "var(--text-primary)" }}>
        {insight.message}
      </p>
      <button
        onClick={() => onDismiss(insight.id)}
        className="flex-shrink-0 rounded-lg p-1 transition-colors hover:opacity-70"
        style={{ color: "var(--text-disabled)" }}
        aria-label="Dismiss"
      >
        <X size={14} />
      </button>
    </div>
  );
}
