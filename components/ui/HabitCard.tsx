import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

/**
 * HabitCard — reusable card shell for displaying a habit's key info.
 *
 * Uses shadcn Card internally. The color accent bar is driven by
 * the `accentColor` prop (the habit's chosen color).
 *
 * Usage:
 *   <HabitCard
 *     title="Morning Run"
 *     description="30 minutes outside"
 *     accentColor="#C2410C"
 *     badge={<Badge variant="info">Daily</Badge>}
 *     meta={<span>07:00</span>}
 *     trailing={<CompletionButton />}
 *   />
 */

interface HabitCardProps {
  title: string;
  description?: string;
  accentColor?: string;
  /** Optional badge(s) rendered below the title */
  badge?: React.ReactNode;
  /** Optional left-side meta text (time, duration) */
  meta?: React.ReactNode;
  /** Optional right-side element (completion button, menu) */
  trailing?: React.ReactNode;
  /** Whether the habit is completed — applies visual treatment */
  isCompleted?: boolean;
  className?: string;
  onClick?: () => void;
}

export function HabitCard({
  title,
  description,
  accentColor = "#C2410C",
  badge,
  meta,
  trailing,
  isCompleted = false,
  className,
  onClick,
}: HabitCardProps) {
  return (
    <Card
      variant="default"
      padding="none"
      className={cn(
        "relative overflow-hidden transition-opacity",
        isCompleted && "opacity-75",
        className
      )}
      onClick={onClick}
    >
      {/* Color accent bar */}
      <div
        className="absolute left-0 top-3 bottom-3 w-1 rounded-r-full"
        style={{ background: accentColor }}
        aria-hidden="true"
      />

      <div className="flex items-start gap-3 p-4 pl-5">
        {/* Habit icon dot */}
        <div
          className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-lg mt-0.5"
          style={{ background: `${accentColor}20` }}
          aria-hidden="true"
        >
          <span style={{ color: accentColor }}>●</span>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <p
            className={cn(
              "font-medium text-sm leading-snug text-foreground",
              isCompleted && "line-through opacity-60"
            )}
          >
            {title}
          </p>
          {description && (
            <p className="text-xs text-muted-foreground mt-0.5 truncate">
              {description}
            </p>
          )}
          {(meta || badge) && (
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              {meta && (
                <span className="text-xs text-muted-foreground">{meta}</span>
              )}
              {badge}
            </div>
          )}
        </div>

        {/* Trailing slot (completion toggle, menu, etc.) */}
        {trailing && (
          <div className="flex-shrink-0 mt-1">{trailing}</div>
        )}
      </div>
    </Card>
  );
}
