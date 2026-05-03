import { cn } from "@/lib/utils";
import { cellStyle } from "@/lib/heatmap";

interface CalendarDayCellProps {
  dateStr: string;
  isCurrentMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
  isFuture: boolean;
  /** 0 = no fill, 1–4 = increasing saturation (matches heatmap palette) */
  saturationLevel: 0 | 1 | 2 | 3 | 4;
  onClick: () => void;
}

export function CalendarDayCell({
  dateStr,
  isCurrentMonth,
  isToday,
  isSelected,
  isFuture,
  saturationLevel,
  onClick,
}: CalendarDayCellProps) {
  const day = parseInt(dateStr.split("-")[2]!);

  // Today: orange accent circle. Selected (non-today): blue-ish sidebar active style.
  // Both override saturation fill.
  const isHighlighted = isToday || isSelected;

  const highlightBackground = isToday
    ? "var(--accent)"
    : "var(--bg-active, color-mix(in srgb, var(--accent) 18%, transparent))";

  const cellFill = isHighlighted
    ? highlightBackground
    : saturationLevel > 0
    ? cellStyle(saturationLevel).background
    : "transparent";

  return (
    <button
      onClick={onClick}
      disabled={isFuture || !isCurrentMonth}
      data-date={dateStr}
      className={cn(
        "relative w-7 h-7 flex items-center justify-center text-[11px] font-medium transition-colors mx-auto",
        isHighlighted ? "rounded-full" : "rounded-md",
        !isFuture && isCurrentMonth && !isHighlighted && "hover:brightness-95 cursor-pointer",
        isFuture && "cursor-default",
        !isCurrentMonth && "opacity-30"
      )}
      style={{
        background: cellFill as string,
        color: isHighlighted
          ? "white"
          : isCurrentMonth
          ? "var(--text-primary)"
          : "var(--text-disabled)",
      }}
    >
      <span>{day}</span>
    </button>
  );
}
