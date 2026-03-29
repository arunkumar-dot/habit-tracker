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
    { value: "all", label: "All" },
    { value: "daily", label: "Daily" },
    { value: "weekly", label: "Weekly" },
  ];

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      {/* Search */}
      <div className="relative flex-1">
        <Search
          size={14}
          className="absolute left-3 top-1/2 -translate-y-1/2"
          style={{ color: "var(--text-disabled)" }}
        />
        <input
          type="text"
          placeholder="Search habits..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-9 pr-3 py-2 rounded-xl text-sm outline-none transition-colors focus:ring-1 focus:ring-[color:var(--border-focus)]"
          style={{
            background: "var(--bg-input)",
            border: "1px solid var(--border)",
            color: "var(--text-primary)",
          }}
        />
      </div>

      {/* Frequency filter */}
      <div
        className="flex rounded-xl p-1 gap-1"
        style={{ background: "var(--bg-elevated)" }}
      >
        {filters.map((f) => (
          <button
            key={f.value}
            onClick={() => onFrequencyChange(f.value)}
            className={cn(
              "px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
            )}
            style={
              frequencyFilter === f.value
                ? {
                    background: "var(--accent-primary)",
                    color: "white",
                  }
                : {
                    color: "var(--text-secondary)",
                  }
            }
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Progress summary */}
      <div
        className="hidden sm:flex items-center gap-1.5 text-sm px-3 py-2 rounded-xl"
        style={{
          background: "var(--bg-elevated)",
          color: "var(--text-secondary)",
        }}
      >
        <span
          className="font-semibold"
          style={{ color: "var(--accent-success)" }}
        >
          {completedCount}
        </span>
        <span>/</span>
        <span>{totalCount}</span>
        <span className="text-xs">done</span>
      </div>
    </div>
  );
}
