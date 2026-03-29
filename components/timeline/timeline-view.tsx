"use client";

import { useRef, useEffect } from "react";
import { Clock, ListChecks } from "lucide-react";
import { TimelineItem } from "./timeline-item";
import { TimelineGap } from "./timeline-gap";
import { TimelineNowIndicator } from "./timeline-now-indicator";
import { TimelineItemSkeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { useTimeline } from "@/hooks/use-timeline";
import { parseTimeToMinutes } from "@/lib/date-utils";

interface TimelineViewProps {
  date: string;
}

export function TimelineView({ date }: TimelineViewProps) {
  const { entries, currentHabitId, upcomingHabitId, nowMinutes, isLoading } =
    useTimeline(date);
  const currentRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to current/upcoming habit on mount
  useEffect(() => {
    if (currentRef.current) {
      currentRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [isLoading]);

  if (isLoading) {
    return (
      <div className="space-y-1 mt-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <TimelineItemSkeleton key={i} />
        ))}
      </div>
    );
  }

  const habitEntries = entries.filter((e) => e.type === "habit");

  if (habitEntries.length === 0) {
    return (
      <EmptyState
        icon={<ListChecks size={28} />}
        title="No habits scheduled"
        description="Add habits with start times to see them here in your daily timeline."
      />
    );
  }

  // Determine where to insert the NOW indicator
  // Find first habit that starts after current time
  const habitEntriesSorted = habitEntries as Array<{ type: "habit"; habit: { startTime: string; _id: string } }>;
  let nowInsertAfterIdx = -1;
  for (let i = 0; i < habitEntriesSorted.length; i++) {
    const entry = habitEntriesSorted[i]!;
    if (parseTimeToMinutes(entry.habit.startTime) <= nowMinutes) {
      nowInsertAfterIdx = i;
    }
  }

  // Build final render list with NOW indicator inserted
  const renderEntries: Array<{
    key: string;
    type: "habit" | "gap" | "now";
    data: (typeof entries)[number] | null;
    insertNowAfter?: boolean;
  }> = [];

  let habitIdx = 0;
  for (let i = 0; i < entries.length; i++) {
    const entry = entries[i]!;
    if (entry.type === "habit") {
      renderEntries.push({ key: entry.habit._id, type: "habit", data: entry });
      // Insert NOW after this habit if appropriate
      if (habitIdx === nowInsertAfterIdx) {
        renderEntries.push({ key: "now-indicator", type: "now", data: null });
      }
      habitIdx++;
    } else {
      // gap
      renderEntries.push({ key: entry.id, type: "gap", data: entry });
    }
  }

  // If NOW is before all habits (nowInsertAfterIdx === -1)
  if (nowInsertAfterIdx === -1 && habitEntries.length > 0) {
    renderEntries.unshift({ key: "now-indicator", type: "now", data: null });
  }

  const totalHabits = habitEntries.length;

  return (
    <div className="relative">
      {renderEntries.map((item, idx) => {
        if (item.type === "now") {
          return (
            <div key={item.key} ref={currentRef}>
              <TimelineNowIndicator nowMinutes={nowMinutes} />
            </div>
          );
        }

        if (item.type === "gap" && item.data?.type === "gap") {
          return (
            <TimelineGap
              key={item.key}
              label={item.data.label}
              gapMinutes={item.data.gapMinutes}
            />
          );
        }

        if (item.type === "habit" && item.data?.type === "habit") {
          const { habit, isCompleted, isCurrent, isUpcoming, isPast } = item.data;
          // Count which habit index this is to determine if it's last
          const isLast = idx === renderEntries.length - 1 ||
            renderEntries.slice(idx + 1).every((e) => e.type !== "habit");

          return (
            <div
              key={item.key}
              ref={isCurrent ? currentRef : undefined}
            >
              <TimelineItem
                habit={habit}
                date={date}
                isCurrent={isCurrent}
                isUpcoming={isUpcoming}
                isPast={isPast}
                isLast={isLast}
              />
            </div>
          );
        }

        return null;
      })}
    </div>
  );
}
