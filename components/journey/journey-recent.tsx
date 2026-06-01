"use client";

import { useMemo } from "react";
import { useQuery, useConvexAuth, usePaginatedQuery } from "convex/react";
import { Trophy, BookOpen } from "lucide-react";
import { api } from "@/convex/_generated/api";
import { useHabits } from "@/hooks/use-habits";
import { MILESTONES } from "@/lib/milestone-config";
import type { Habit } from "@/types";
import type { Doc } from "@/convex/_generated/dataModel";

// ── Helpers ───────────────────────────────────────────────────────────────────

function personalName(habitTitle: string, daysRequired: number): string {
  const t = habitTitle.toLowerCase().trim();
  if (daysRequired === 66) return `66 days of ${t}`;
  return `${daysRequired} days of ${t}`;
}

function formatShortDate(ts: number): string {
  return new Date(ts).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatEntryDate(dateStr: string): string {
  return new Date(dateStr + "T00:00:00").toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

// ── Growth item types ─────────────────────────────────────────────────────────

type GrowthItem =
  | { type: "milestone"; id: string; label: string; dateLabel: string; ts: number }
  | { type: "journal"; id: string; excerpt: string; dateLabel: string; ts: number };

// ── Main section ──────────────────────────────────────────────────────────────

export function JourneyRecent() {
  const { isAuthenticated } = useConvexAuth();
  const { habits } = useHabits();

  const allMilestones = useQuery(
    api.milestones.getUserMilestones,
    isAuthenticated ? {} : "skip"
  );

  const { results: journalEntries } = usePaginatedQuery(
    api.journal.listEntries,
    isAuthenticated ? {} : "skip",
    { initialNumItems: 5 }
  );

  const habitMap = useMemo(() => {
    const m = new Map<string, Habit>();
    (habits ?? []).forEach((h) => m.set(h._id as string, h));
    return m;
  }, [habits]);

  const items = useMemo<GrowthItem[]>(() => {
    const result: GrowthItem[] = [];

    // Earned milestones
    (allMilestones ?? []).forEach((award) => {
      const habit = habitMap.get(award.habitId as string);
      if (!habit) return;
      const cfg = MILESTONES.find((m) => m.daysRequired === award.daysRequired);
      if (!cfg) return;
      result.push({
        type: "milestone",
        id: `${award.habitId as string}-${award.daysRequired}`,
        label: personalName(habit.title, award.daysRequired),
        dateLabel: formatShortDate(award.achievedAt),
        ts: award.achievedAt,
      });
    });

    // Recent journal entries (up to 3)
    journalEntries.slice(0, 3).forEach((entry) => {
      const excerpt = entry.content.trim().slice(0, 80) + (entry.content.length > 80 ? "…" : "");
      result.push({
        type: "journal",
        id: entry._id as string,
        excerpt,
        dateLabel: formatEntryDate(entry.date),
        ts: entry.updatedAt,
      });
    });

    // Sort by most recent first, take top 5
    return result.sort((a, b) => b.ts - a.ts).slice(0, 5);
  }, [allMilestones, journalEntries, habitMap]);

  if (items.length === 0) return null;

  return (
    <section style={{ marginBottom: 40 }}>
      <p
        style={{
          margin: "0 0 16px",
          fontFamily: "var(--font-display)",
          fontStyle: "italic",
          fontSize: 18,
          color: "var(--text)",
        }}
      >
        Recent growth
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
        {items.map((item, idx) => (
          <div
            key={item.id}
            style={{
              display: "flex",
              gap: 14,
              paddingTop: 12,
              paddingBottom: 12,
              borderBottom: idx < items.length - 1 ? "1px solid var(--border)" : "none",
              minHeight: 44,
              alignItems: "flex-start",
            }}
          >
            {/* Icon */}
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                background: item.type === "milestone" ? "var(--accent-soft)" : "var(--surface-alt)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                marginTop: 2,
              }}
            >
              {item.type === "milestone" ? (
                <Trophy size={14} style={{ color: "var(--accent)" }} aria-hidden />
              ) : (
                <BookOpen size={14} style={{ color: "var(--text-subtle)" }} aria-hidden />
              )}
            </div>

            {/* Text */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <p
                style={{
                  margin: 0,
                  fontFamily:
                    item.type === "milestone" ? "var(--font-display)" : "var(--font-sans)",
                  fontStyle: item.type === "milestone" ? "italic" : "normal",
                  fontSize: 14,
                  lineHeight: 1.45,
                  color: "var(--text)",
                  wordBreak: "break-word",
                }}
              >
                {item.type === "milestone" ? item.label : `"${item.excerpt}"`}
              </p>
              <p
                style={{
                  margin: "3px 0 0",
                  fontFamily: "var(--font-sans)",
                  fontSize: 12,
                  color: "var(--text-subtle)",
                }}
              >
                {item.dateLabel}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
