"use client";

import { motion } from "framer-motion";
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
    <div className="flex flex-col sm:flex-row items-center gap-3">
      {/* Search */}
      <div className="relative flex-1 w-full">
        <Search
          size={16}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
          style={{ color: "var(--text-tertiary)" }}
        />
        <input
          type="text"
          placeholder="Search habits..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-2xl text-sm outline-none transition-all glass-card focus:border-[var(--accent)]"
          style={{
            color: "var(--text-primary)",
          }}
        />
      </div>

      {/* Frequency filter — segmented control with spring pill */}
      <div className="glass-panel flex p-1 rounded-2xl gap-1 w-full sm:w-auto">
        {filters.map((f) => {
          const isActive = frequencyFilter === f.value;
          return (
            <motion.button
              key={f.value}
              whileTap={{ scale: 0.96 }}
              onClick={() => onFrequencyChange(f.value)}
              className="relative flex-1 sm:flex-initial py-1.5 px-3.5 rounded-xl text-xs font-semibold transition-colors z-10"
              style={{
                color: isActive ? "#ffffff" : "var(--text-secondary)",
              }}
            >
              {isActive && (
                <motion.div
                  layoutId="habitFilterPill"
                  className="absolute inset-0 rounded-xl"
                  style={{
                    background: "var(--accent)",
                    boxShadow: "0 2px 10px -1px color-mix(in srgb, var(--accent) 50%, transparent)",
                  }}
                  transition={{ type: "spring", stiffness: 450, damping: 32 }}
                />
              )}
              <span className="relative z-10">{f.label}</span>
            </motion.button>
          );
        })}
      </div>

      {/* Progress summary badge */}
      <div
        className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl glass-card text-xs font-semibold"
        style={{ color: "var(--text-secondary)" }}
      >
        <span style={{ color: "var(--accent)" }}>{completedCount}</span>
        <span>/</span>
        <span>{totalCount}</span>
        <span className="font-normal" style={{ color: "var(--text-tertiary)" }}>done</span>
      </div>
    </div>
  );
}
