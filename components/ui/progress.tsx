import { cn } from "@/lib/utils";

interface ProgressProps {
  value: number; // 0-100
  max?: number;
  className?: string;
  color?: string;
  showLabel?: boolean;
}

export function Progress({
  value,
  max = 100,
  className,
  color,
  showLabel = false,
}: ProgressProps) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div className={cn("w-full", className)}>
      <div
        className="w-full overflow-hidden rounded-full"
        style={{ height: "3px", background: "var(--bg-sunken)" }}
      >
        <div
          className="h-full rounded-full transition-all duration-150"
          style={{
            width: `${percentage}%`,
            background: color ?? "var(--accent)",
          }}
        />
      </div>
      {showLabel && (
        <p className="text-xs mt-1 text-right" style={{ color: "var(--text-secondary)" }}>
          {Math.round(percentage)}%
        </p>
      )}
    </div>
  );
}
