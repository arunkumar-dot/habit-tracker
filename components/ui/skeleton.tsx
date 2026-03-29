import { cn } from "@/lib/utils";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  width?: string | number;
  height?: string | number;
}

export function Skeleton({ width, height, className, style, ...props }: SkeletonProps) {
  return (
    <div
      className={cn("rounded-lg animate-shimmer", className)}
      style={{
        width,
        height: height ?? "1rem",
        ...style,
      }}
      {...props}
    />
  );
}

/** Pre-built skeleton for a habit card */
export function HabitCardSkeleton() {
  return (
    <div
      className="rounded-2xl p-4 border"
      style={{ background: "var(--bg-surface)", borderColor: "var(--border)" }}
    >
      <div className="flex items-start gap-3">
        <Skeleton width={40} height={40} className="rounded-xl flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <Skeleton width="60%" height={16} />
          <Skeleton width="40%" height={12} />
        </div>
        <Skeleton width={32} height={32} className="rounded-full flex-shrink-0" />
      </div>
    </div>
  );
}

/** Pre-built skeleton for the timeline */
export function TimelineItemSkeleton() {
  return (
    <div className="flex gap-4 py-3">
      <div className="flex flex-col items-center gap-1">
        <Skeleton width={12} height={12} className="rounded-full" />
        <Skeleton width={2} height={60} className="rounded-full" />
      </div>
      <div className="flex-1 space-y-2 pb-2">
        <Skeleton width="30%" height={12} />
        <Skeleton width="55%" height={16} />
      </div>
      <Skeleton width={28} height={28} className="rounded-full flex-shrink-0" />
    </div>
  );
}
