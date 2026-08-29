"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Clock, ChevronDown, ChevronUp } from "lucide-react";
import type { Doc } from "@/convex/_generated/dataModel";

type JournalEntry = Doc<"journalEntries">;

function formatMemoryDate(dateStr: string): string {
  return new Date(dateStr + "T00:00:00").toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

interface ThenMemoryCardProps {
  entry: JournalEntry;
  daysAgo: number;
}

export function ThenMemoryCard({ entry, daysAgo }: ThenMemoryCardProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="glass-card glow-card rounded-2xl p-5 relative overflow-hidden"
      style={{
        borderLeft: "3px solid var(--accent)",
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div
            className="w-6 h-6 rounded-lg flex items-center justify-center"
            style={{
              background: "color-mix(in srgb, var(--accent) 15%, transparent)",
              color: "var(--accent)",
            }}
          >
            <Clock size={13} />
          </div>
          <span
            className="text-xs uppercase tracking-wider font-semibold"
            style={{ color: "var(--accent)" }}
          >
            {daysAgo} Days Ago
          </span>
        </div>

        <span className="text-xs" style={{ color: "var(--text-tertiary)" }}>
          {formatMemoryDate(entry.date)}
        </span>
      </div>

      {/* Excerpt / Full Content */}
      <div className="relative">
        <p
          className={`leading-relaxed transition-all ${
            expanded ? "" : "line-clamp-2"
          }`}
          style={{
            fontFamily: "var(--font-display)",
            fontStyle: "italic",
            fontSize: "17px",
            color: "var(--text-primary)",
          }}
        >
          &ldquo;{entry.content}&rdquo;
        </p>

        {entry.content.length > 120 && (
          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            className="inline-flex items-center gap-1 mt-2 text-xs font-semibold hover:underline"
            style={{ color: "var(--accent)" }}
          >
            <span>{expanded ? "Show less" : "Read full reflection"}</span>
            {expanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
          </button>
        )}
      </div>
    </motion.div>
  );
}
