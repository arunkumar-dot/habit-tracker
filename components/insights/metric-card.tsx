import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  icon: string;
  label: string;
  value: string;
  sub?: string;
  accent?: "primary" | "success" | "warning" | "danger";
  className?: string;
}

const accentColors: Record<string, string> = {
  primary: "var(--accent-primary)",
  success: "var(--accent-success)",
  warning: "var(--accent-warning)",
  danger: "var(--accent-danger, #ef4444)",
};

export function MetricCard({
  icon,
  label,
  value,
  sub,
  accent = "primary",
  className,
}: MetricCardProps) {
  const color = accentColors[accent] ?? accentColors.primary;

  return (
    <Card variant="default" padding="none" className={cn("flex flex-col gap-1.5 p-4", className)}>
      {/* Icon + label row */}
      <div className="flex items-start justify-between gap-1">
        <p className="text-xs font-medium leading-snug" style={{ color: "var(--text-secondary)" }}>
          {label}
        </p>
        <span className="text-base leading-none shrink-0">{icon}</span>
      </div>
      {/* Value — capped at one line with ellipsis */}
      <p
        className="text-xl font-bold leading-tight truncate"
        title={value}
        style={{ color }}
      >
        {value}
      </p>
      {/* Sub */}
      {sub && (
        <p className="text-[11px] leading-snug" style={{ color: "var(--text-disabled)" }}>
          {sub}
        </p>
      )}
    </Card>
  );
}

/** Skeleton placeholder while loading */
export function MetricCardSkeleton() {
  return (
    <Card variant="default" padding="none" className="flex flex-col gap-1.5 p-4">
      <div className="flex items-start justify-between gap-1">
        <div className="h-3 w-20 rounded animate-pulse" style={{ background: "var(--bg-elevated)" }} />
        <div className="w-4 h-4 rounded animate-pulse" style={{ background: "var(--bg-elevated)" }} />
      </div>
      <div className="h-6 w-16 rounded animate-pulse" style={{ background: "var(--bg-elevated)" }} />
      <div className="h-2.5 w-24 rounded animate-pulse" style={{ background: "var(--bg-elevated)" }} />
    </Card>
  );
}
