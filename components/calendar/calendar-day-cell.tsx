import { cn } from "@/lib/utils";

interface CalendarDayCellProps {
  dateStr: string;
  isCurrentMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
  isFuture: boolean;
  completedCount: number;
  totalCount: number;
  onClick: () => void;
}

export function CalendarDayCell({
  dateStr,
  isCurrentMonth,
  isToday,
  isSelected,
  isFuture,
  completedCount,
  totalCount,
  onClick,
}: CalendarDayCellProps) {
  const day = parseInt(dateStr.split("-")[2]!);
  const completionRate = totalCount > 0 ? completedCount / totalCount : 0;

  // Color intensity based on completion rate
  const bgOpacity =
    completedCount === 0 || isFuture
      ? 0
      : completionRate >= 1
      ? 0.9
      : completionRate >= 0.5
      ? 0.5
      : 0.2;

  return (
    <button
      onClick={onClick}
      disabled={isFuture || !isCurrentMonth}
      className={cn(
        "relative w-8 h-8 flex flex-col items-center justify-center rounded-lg text-[11px] font-medium transition-all mx-auto",
        !isFuture && isCurrentMonth && "hover:scale-105",
        isFuture && "cursor-default",
        !isCurrentMonth && "opacity-30"
      )}
      style={{
        background:
          isSelected
            ? "var(--accent-primary)"
            : completedCount > 0 && !isFuture
            ? `rgba(16, 185, 129, ${bgOpacity})`
            : isToday
            ? "var(--bg-elevated)"
            : "transparent",
        color: isSelected
          ? "white"
          : isToday
          ? "var(--accent-primary)"
          : isCurrentMonth
          ? "var(--text-primary)"
          : "var(--text-disabled)",
        border: isToday && !isSelected ? `1px solid var(--accent-primary)` : "1px solid transparent",
      }}
    >
      <span>{day}</span>
      {/* Completion dots */}
      {completedCount > 0 && !isFuture && !isSelected && (
        <div className="absolute bottom-1 flex gap-0.5">
          {completedCount >= totalCount ? (
            <div className="w-1 h-1 rounded-full" style={{ background: "var(--accent-success)" }} />
          ) : (
            <div className="w-1 h-1 rounded-full" style={{ background: "var(--accent-warning)" }} />
          )}
        </div>
      )}
    </button>
  );
}
