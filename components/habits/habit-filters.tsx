"use client";

import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

type FrequencyFilter = "all" | "daily" | "weekly";

interface HabitFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  frequencyFilter: FrequencyFilter;
  onFrequencyChange: (value: FrequencyFilter) => void;
  totalCount: number;
  completedCount: number;
}

export function HabitFilters({
  search,
  onSearchChange,
  frequencyFilter,
  onFrequencyChange,
  totalCount,
  completedCount,
}: HabitFiltersProps) {
  const filters: Array<{ value: FrequencyFilter; label: string }> = [
    { value: "all",    label: "All" },
    { value: "daily",  label: "Daily" },
    { value: "weekly", label: "Weekly" },
  ];

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      {/* Search */}
      <div className="relative flex-1">
        <Search
          size={14}
          className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
          style={{ color: "var(--asteroid)" }}
        />
        <input
          type="text"
          placeholder="Search quests..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-9 pr-3 py-2.5 rounded-lg text-sm outline-none transition-colors"
          style={{
            background: "var(--space-surface)",
            border: "1px solid var(--void-border)",
            color: "var(--comet-white)",
          }}
        />
      </div>

      {/* Frequency filter — space-styled pills */}
      <div className="flex items-center gap-1.5">
        {filters.map((f) => {
          const active = frequencyFilter === f.value;
          return (
            <button
              key={f.value}
              onClick={() => onFrequencyChange(f.value)}
              className={cn(
                "px-3 py-2 rounded-lg text-xs font-semibold transition-colors",
                active
                  ? "text-white"
                  : "hover:text-[var(--comet-white)]"
              )}
              style={
                active
                  ? {
                      background: "var(--nebula-purple)",
                      color: "white",
                    }
                  : {
                      background: "var(--space-surface)",
                      border: "1px solid var(--void-border)",
                      color: "var(--stardust)",
                    }
              }
            >
              {f.label}
            </button>
          );
        })}
      </div>

      {/* Progress count */}
      <div
        className="hidden sm:flex items-center gap-1 type-meta-label"
        style={{ color: "var(--asteroid)" }}
      >
        <span style={{ color: "var(--stellar-gold)" }}>{completedCount}</span>
        <span>/</span>
        <span>{totalCount}</span>
        <span>done</span>
      </div>
    </div>
  );
}
