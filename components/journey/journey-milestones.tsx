"use client";

import { Check } from "lucide-react";
import { useMilestones } from "@/hooks/use-milestones";
import { MILESTONES } from "@/lib/milestone-config";
import type { Habit } from "@/types";

// ── Personal milestone name ────────────────────────────────────────────────────

function personalName(habitTitle: string, daysRequired: number): string {
  const t = habitTitle.toLowerCase().trim();
  if (daysRequired === 66) return `66 days of ${t}. This is who you are now.`;
  return `${daysRequired} days of ${t}`;
}

function formatDate(ts: number): string {
  return new Date(ts).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

// ── Per-habit milestone block ─────────────────────────────────────────────────

interface HabitMilestonesBlockProps {
  habit: Habit;
}

function HabitMilestonesBlock({ habit }: HabitMilestonesBlockProps) {
  const { milestones, isLoading } = useMilestones(habit._id, habit.frequency);

  if (isLoading) {
    return (
      <div style={{ marginBottom: 28 }}>
        <div
          className="animate-pulse rounded"
          style={{ height: 14, width: "40%", background: "var(--surface-alt)", marginBottom: 12 }}
        />
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="animate-pulse rounded"
            style={{ height: 44, background: "var(--surface-alt)", marginBottom: 8 }}
          />
        ))}
      </div>
    );
  }

  const unlocked = milestones.filter((m) => m.isUnlocked);
  const nextLocked = milestones.find((m) => !m.isUnlocked);

  // Nothing unlocked, nothing close — don't render
  if (unlocked.length === 0 && !nextLocked) return null;

  return (
    <div style={{ marginBottom: 32 }}>
      {/* Habit label */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginBottom: 12,
        }}
      >
        {habit.color && (
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: habit.color,
              flexShrink: 0,
              display: "inline-block",
            }}
          />
        )}
        <span
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: 13,
            fontWeight: 600,
            color: "var(--text)",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
          }}
        >
          {habit.title}
        </span>
      </div>

      {/* Unlocked milestones */}
      {unlocked.map((m) => (
        <div
          key={m.daysRequired}
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: 12,
            padding: "10px 14px",
            marginBottom: 6,
            borderRadius: 10,
            background: "var(--accent-soft)",
          }}
        >
          <div
            style={{
              width: 22,
              height: 22,
              borderRadius: "50%",
              background: "var(--accent)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              marginTop: 1,
            }}
          >
            <Check size={12} color="#fff" strokeWidth={2.5} aria-hidden />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p
              style={{
                margin: 0,
                fontFamily: "var(--font-display)",
                fontStyle: "italic",
                fontSize: 15,
                lineHeight: 1.4,
                color: "var(--text)",
              }}
            >
              {personalName(habit.title, m.daysRequired)}
            </p>
            {m.achievedAt && (
              <p
                style={{
                  margin: "3px 0 0",
                  fontFamily: "var(--font-sans)",
                  fontSize: 12,
                  color: "var(--text-subtle)",
                }}
              >
                {formatDate(m.achievedAt)}
              </p>
            )}
          </div>
        </div>
      ))}

      {/* Next locked milestone — progress teaser */}
      {nextLocked && (
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: 12,
            padding: "10px 14px",
            borderRadius: 10,
            border: "1px dashed var(--border)",
            opacity: 0.7,
          }}
        >
          <div
            style={{
              width: 22,
              height: 22,
              borderRadius: "50%",
              border: "1.5px solid var(--border)",
              flexShrink: 0,
              marginTop: 1,
            }}
          />
          <div style={{ flex: 1, minWidth: 0 }}>
            <p
              style={{
                margin: 0,
                fontFamily: "var(--font-display)",
                fontStyle: "italic",
                fontSize: 15,
                lineHeight: 1.4,
                color: "var(--text-muted)",
              }}
            >
              {personalName(habit.title, nextLocked.daysRequired)}
            </p>
            <p
              style={{
                margin: "3px 0 0",
                fontFamily: "var(--font-sans)",
                fontSize: 12,
                color: "var(--text-subtle)",
              }}
            >
              {nextLocked.progress} / {nextLocked.daysRequired} days
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Main milestones section ───────────────────────────────────────────────────

interface JourneyMilestonesProps {
  habits: Habit[] | undefined;
  isLoading: boolean;
}

export function JourneyMilestones({ habits, isLoading }: JourneyMilestonesProps) {
  if (isLoading) {
    return (
      <section style={{ marginBottom: 40 }}>
        <p
          style={{
            margin: "0 0 14px",
            fontFamily: "var(--font-display)",
            fontStyle: "italic",
            fontSize: 18,
            color: "var(--text)",
          }}
        >
          Milestones
        </p>
        {[0, 1].map((i) => (
          <div
            key={i}
            className="animate-pulse rounded-md"
            style={{ height: 88, background: "var(--surface-alt)", marginBottom: 10 }}
          />
        ))}
      </section>
    );
  }

  if (!habits || habits.length === 0) return null;

  return (
    <section style={{ marginBottom: 40 }}>
      <p
        style={{
          margin: "0 0 20px",
          fontFamily: "var(--font-display)",
          fontStyle: "italic",
          fontSize: 18,
          color: "var(--text)",
        }}
      >
        Milestones
      </p>

      {habits.map((habit) => (
        <HabitMilestonesBlock key={habit._id} habit={habit} />
      ))}
    </section>
  );
}
