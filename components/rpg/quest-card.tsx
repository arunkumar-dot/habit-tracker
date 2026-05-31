import { cn } from "@/lib/utils";

interface QuestCardProps {
  /** Habit's hex color — drives the per-card hover glow accent. */
  color?: string;
  className?: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
}

export function QuestCard({ color, className, children, style }: QuestCardProps) {
  return (
    <div
      className={cn("quest-card", className)}
      style={{ "--quest-color": color, ...style } as React.CSSProperties}
    >
      {children}
    </div>
  );
}
