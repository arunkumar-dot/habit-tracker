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

  // Today and selected both use accent fill + white number.
  // Today: always a perfect circle (per spec: 28px diameter).
  // Selected non-today: rounded-full too for visual consistency.
  const isHighlighted = isToday || isSelected;

  return (
    <button
      onClick={onClick}
      disabled={isFuture || !isCurrentMonth}
      className={cn(
        "relative w-7 h-7 flex flex-col items-center justify-center text-[11px] font-medium transition-colors mx-auto",
        isHighlighted ? "rounded-full" : "rounded-md",
        !isFuture && isCurrentMonth && !isHighlighted && "hover:bg-[var(--bg-hover)]",
        isFuture && "cursor-default",
        !isCurrentMonth && "opacity-30"
      )}
      style={{
        background: isHighlighted ? "var(--accent)" : "transparent",
        color: isHighlighted
          ? "white"
          : isCurrentMonth
          ? "var(--text-primary)"
          : "var(--text-disabled)",
      }}
    >
      <span>{day}</span>

      {/* 3px completion dot, 2px below the number, hidden when day is highlighted */}
      {completedCount > 0 && !isFuture && !isHighlighted && (
        <div className="absolute" style={{ bottom: 2 }}>
          <div
            style={{
              width: 3,
              height: 3,
              borderRadius: "50%",
              background: completedCount >= totalCount ? "var(--success)" : "var(--warning)",
            }}
          />
        </div>
      )}
    </button>
  );
}
