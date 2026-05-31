"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Doc } from "@/convex/_generated/dataModel";

type JournalEntry = Doc<"journalEntries">;

const CARD_STYLE = `
.then-clamp {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}
`;

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
    <>
      <style>{CARD_STYLE}</style>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        style={{
          background: "var(--bg-sunken)",
          borderRadius: 12,
          borderLeft: "3px solid var(--accent)",
          padding: "16px 16px 16px 18px",
          width: "100%",
          boxSizing: "border-box",
        }}
      >
        {/* Label */}
        <p
          style={{
            margin: 0,
            fontFamily: "var(--font-sans)",
            fontSize: 11,
            fontWeight: 500,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            color: "var(--text-subtle)",
            marginBottom: 10,
          }}
        >
          You wrote this {daysAgo} days ago
        </p>

        {/* Entry excerpt / full text */}
        <AnimatePresence initial={false}>
          {expanded ? (
            <motion.p
              key="full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              style={{
                margin: 0,
                fontFamily: "var(--font-display)",
                fontStyle: "italic",
                fontSize: 16,
                lineHeight: 1.65,
                color: "var(--text)",
                wordBreak: "break-word",
                whiteSpace: "pre-wrap",
              }}
            >
              &ldquo;{entry.content}&rdquo;
            </motion.p>
          ) : (
            <motion.p
              key="clamped"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="then-clamp"
              style={{
                margin: 0,
                fontFamily: "var(--font-display)",
                fontStyle: "italic",
                fontSize: 16,
                lineHeight: 1.65,
                color: "var(--text)",
              }}
            >
              &ldquo;{entry.content}&rdquo;
            </motion.p>
          )}
        </AnimatePresence>

        {/* Footer: date + CTA */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
            marginTop: 12,
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: 13,
              color: "var(--text-subtle)",
              flexShrink: 0,
            }}
          >
            {formatMemoryDate(entry.date)}
          </span>

          <button
            onClick={() => setExpanded((v) => !v)}
            style={{
              background: "none",
              border: "none",
              padding: 0,
              fontFamily: "var(--font-sans)",
              fontSize: 13,
              fontWeight: 500,
              color: "var(--accent)",
              cursor: "pointer",
              flexShrink: 0,
              minHeight: 44,
              display: "inline-flex",
              alignItems: "center",
            }}
          >
            {expanded ? "Close" : "Read full entry →"}
          </button>
        </div>
      </motion.div>
    </>
  );
}
