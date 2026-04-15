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
          className="w-full pl-9 pr-3 py-3 rounded-md text-sm outline-none transition-colors border border-transparent focus:border-[var(--accent)]"
          style={{
            background: "var(--bg-sunken)",
            color: "var(--text-primary)",
          }}
        />
      </div>

      {/* Frequency filter — segmented control */}
      <div className="flex items-end gap-0">
        {filters.map((f) => (
          <button
            key={f.value}
            onClick={() => onFrequencyChange(f.value)}
            className={cn("seg-btn")}
            data-active={frequencyFilter === f.value}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Progress summary — no pill background per spec */}
      <div
        className="hidden sm:flex items-center gap-1 type-meta-label"
        style={{ color: "var(--text-tertiary)" }}
      >
        <span>{completedCount}</span>
        <span>/</span>
        <span>{totalCount}</span>
        <span>done</span>
      </div>
    </div>
  );
}
