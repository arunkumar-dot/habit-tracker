"use client";

import { MoreVertical, Pencil, Trash2 } from "lucide-react";
import { DropdownMenu } from "@/components/ui/dropdown-menu";
import { useHabitMutations } from "@/hooks/use-habit-mutations";
import { useToast } from "@/components/ui/toast";
import type { Habit } from "@/types";

interface HabitMenuProps {
  habit: Habit;
  onEdit: (habit: Habit) => void;
}

export function HabitMenu({ habit, onEdit }: HabitMenuProps) {
  const { deleteHabit } = useHabitMutations();
  const { showToast } = useToast();

  async function handleDelete() {
    if (!confirm(`Delete "${habit.title}"? This will also remove all completion history.`)) return;
    try {
      await deleteHabit(habit._id);
      showToast("Habit deleted.", "info");
    } catch {
      showToast("Failed to delete habit.", "error");
    }
  }

  return (
    <DropdownMenu
      trigger={
        <button
          className="p-1.5 rounded-lg transition-colors hover:bg-[color:var(--bg-hover)]"
          style={{ color: "var(--text-disabled)" }}
          aria-label="Habit options"
        >
          <MoreVertical size={16} />
        </button>
      }
      items={[
        {
          label: "Edit",
          icon: <Pencil size={14} />,
          onClick: () => onEdit(habit),
        },
        {
          label: "Delete",
          icon: <Trash2 size={14} />,
          onClick: handleDelete,
          variant: "danger",
        },
      ]}
    />
  );
}
