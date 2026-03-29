"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDateLabel } from "@/lib/date-utils";
import { today, addDays } from "@/lib/date-utils";

interface TimelineHeaderProps {
  date: string;
  onDateChange: (date: string) => void;
}

export function TimelineHeader({ date, onDateChange }: TimelineHeaderProps) {
  const isToday = date === today();

  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>
          Daily Timeline
        </h1>
        <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
          Your habits for {formatDateLabel(date).toLowerCase()}
        </p>
      </div>

      <div className="flex items-center gap-2">
        {/* Prev day */}
        <Button
          variant="secondary"
          size="icon"
          onClick={() => onDateChange(addDays(date, -1))}
          aria-label="Previous day"
        >
          <ChevronLeft size={16} />
        </Button>

        {/* Date display */}
        <button
          onClick={() => onDateChange(today())}
          className="px-3 py-1.5 rounded-xl text-sm font-medium transition-colors"
          style={
            isToday
              ? { background: "var(--accent-primary)", color: "white" }
              : {
                  background: "var(--bg-elevated)",
                  color: "var(--text-primary)",
                  border: "1px solid var(--border)",
                }
          }
        >
          {formatDateLabel(date)}
        </button>

        {/* Next day (disabled for future) */}
        <Button
          variant="secondary"
          size="icon"
          onClick={() => onDateChange(addDays(date, 1))}
          disabled={date >= today()}
          aria-label="Next day"
        >
          <ChevronRight size={16} />
        </Button>
      </div>
    </div>
  );
}
