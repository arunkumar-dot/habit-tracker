"use client";

import { Link2, X } from "lucide-react";
import { useHabits } from "@/hooks/use-habits";
import type { Id } from "@/convex/_generated/dataModel";

interface HabitSelectorProps {
  linkedHabitId: Id<"habits"> | null;
  onSelect: (id: Id<"habits"> | null) => void;
}

export function HabitSelector({ linkedHabitId, onSelect }: HabitSelectorProps) {
  const { habits } = useHabits();
  const linked = habits?.find((h) => h._id === linkedHabitId);

  return (
    <div className="flex items-center gap-3">
      <Link2 size={15} style={{ color: "var(--text-disabled)", flexShrink: 0 }} />

      {linked ? (
        <div className="flex items-center gap-2 flex-1">
          {/* Color dot */}
          <span
            className="w-2 h-2 rounded-full flex-shrink-0"
            style={{ background: linked.color ?? "var(--accent-primary)" }}
          />
          <span className="text-sm font-medium truncate" style={{ color: "var(--text-primary)" }}>
            {linked.title}
          </span>
          <button
            onClick={() => onSelect(null)}
            className="ml-auto p-1 rounded-lg transition-colors hover:bg-white/5"
            style={{ color: "var(--text-disabled)" }}
            aria-label="Unlink habit"
          >
            <X size={13} />
          </button>
        </div>
      ) : (
        <select
          value=""
          onChange={(e) => {
            const val = e.target.value;
            if (val) onSelect(val as Id<"habits">);
          }}
          className="flex-1 bg-transparent text-sm outline-none"
          style={{ color: "var(--text-secondary)" }}
        >
          <option value="" disabled>
            Link a habit (optional)
          </option>
          {habits?.map((h) => (
            <option key={h._id} value={h._id} style={{ background: "var(--bg-elevated)" }}>
              {h.title}
            </option>
          ))}
        </select>
      )}
    </div>
  );
}
