import { cn } from "@/lib/utils";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  width?: string | number;
  height?: string | number;
}

/** Base shimmer block. All pre-built skeletons compose this. */
export function Skeleton({ width, height, className, style, ...props }: SkeletonProps) {
  return (
    <div
      className={cn("rounded-lg animate-shimmer", className)}
      style={{ width, height: height ?? "1rem", ...style }}
      {...props}
    />
  );
}

// ─────────────────────────────────────────────
// HABIT CARD SKELETON
// Mirrors the real HabitCard layout closely:
//   color-accent bar | icon | title + desc | completion button
//   meta row: time · duration · frequency · streak · milestone
//   optional weekly goal progress
// ─────────────────────────────────────────────
export function HabitCardSkeleton() {
  return (
    <div
      className="relative rounded-2xl p-4"
      style={{ background: "var(--bg-surface)", border: "1px solid var(--border)" }}
    >
      {/* Color accent bar */}
      <Skeleton
        className="absolute left-0 top-3 bottom-3 rounded-r-full"
        width={4}
        style={{ height: "calc(100% - 1.5rem)" }}
      />

      <div className="flex items-start gap-3 ml-2">
        {/* Icon placeholder */}
        <Skeleton width={40} height={40} className="rounded-xl flex-shrink-0" />

        {/* Content */}
        <div className="flex-1 space-y-2 min-w-0">
          {/* Title */}
          <Skeleton width="55%" height={14} />
          {/* Description */}
          <Skeleton width="38%" height={11} />

          {/* Meta row: time · badge · badge · streak · milestone */}
          <div className="flex items-center gap-2 pt-1 flex-wrap">
            <Skeleton width={60} height={11} className="rounded-full" />
            <Skeleton width={44} height={18} className="rounded-full" />
            <Skeleton width={52} height={18} className="rounded-full" />
            <Skeleton width={36} height={18} className="rounded-full" />
          </div>

          {/* Weekly goal progress bar (optional row) */}
          <div className="space-y-1 pt-0.5">
            <div className="flex justify-between">
              <Skeleton width={48} height={10} />
              <Skeleton width={32} height={10} />
            </div>
            <Skeleton width="100%" height={4} className="rounded-full" />
          </div>
        </div>

        {/* Completion button */}
        <Skeleton width={28} height={28} className="rounded-full flex-shrink-0 mt-1" />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// TIMELINE ITEM SKELETON
// ─────────────────────────────────────────────
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

// ─────────────────────────────────────────────
// PAGE HEADER SKELETON
// Mirrors <PageHeader> — title on left, action button on right
// ─────────────────────────────────────────────
export function PageHeaderSkeleton() {
  return (
    <div className="flex items-start justify-between mb-6">
      <div className="space-y-2">
        <Skeleton width={160} height={28} className="rounded-xl" />
        <Skeleton width={100} height={14} />
      </div>
      <Skeleton width={110} height={36} className="rounded-xl flex-shrink-0" />
    </div>
  );
}

// ─────────────────────────────────────────────
// STAT CARD SKELETON
// Mirrors the analytics stat cards (big number + label)
// ─────────────────────────────────────────────
export function StatCardSkeleton() {
  return (
    <div
      className="rounded-2xl p-4"
      style={{ background: "var(--bg-surface)", border: "1px solid var(--border)" }}
    >
      <Skeleton width={56} height={32} className="rounded-lg mb-2" />
      <Skeleton width={80} height={12} />
    </div>
  );
}

// ─────────────────────────────────────────────
// STREAK ROW SKELETON
// Mirrors a single row in the StreakSummary leaderboard
// ─────────────────────────────────────────────
export function StreakRowSkeleton() {
  return (
    <div
      className="flex items-center justify-between py-3"
      style={{ borderBottom: "1px solid var(--border)" }}
    >
      {/* Color dot + habit name */}
      <div className="flex items-center gap-3 min-w-0">
        <Skeleton width={12} height={12} className="rounded-full flex-shrink-0" />
        <Skeleton width={120} height={14} />
      </div>
      {/* Stats: current · best · total */}
      <div className="flex items-center gap-4 flex-shrink-0 ml-4">
        <div className="text-right space-y-1">
          <Skeleton width={28} height={14} className="ml-auto" />
          <Skeleton width={36} height={10} className="ml-auto" />
        </div>
        <div className="text-right space-y-1">
          <Skeleton width={28} height={14} className="ml-auto" />
          <Skeleton width={28} height={10} className="ml-auto" />
        </div>
        <div className="text-right space-y-1 hidden sm:block">
          <Skeleton width={24} height={14} className="ml-auto" />
          <Skeleton width={28} height={10} className="ml-auto" />
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// CALENDAR GRID SKELETON
// 7-column day grid matching HabitCalendar layout
// ─────────────────────────────────────────────
export function CalendarGridSkeleton() {
  return (
    <div className="space-y-3">
      {/* Day-of-week headers */}
      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: 7 }).map((_, i) => (
          <Skeleton key={i} height={14} className="rounded" />
        ))}
      </div>
      {/* 5 week rows × 7 cells */}
      {Array.from({ length: 5 }).map((_, row) => (
        <div key={row} className="grid grid-cols-7 gap-1">
          {Array.from({ length: 7 }).map((_, col) => (
            <Skeleton key={col} height={36} className="rounded-xl" />
          ))}
        </div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────
// DASHBOARD CONTENT SKELETON
// Full skeleton for the dashboard content area
// (used while Clerk is initialising or habits are loading)
// ─────────────────────────────────────────────
export function DashboardContentSkeleton() {
  return (
    <div>
      <PageHeaderSkeleton />

      {/* Progress bar placeholder */}
      <div className="mb-5 space-y-2">
        <div className="flex justify-between">
          <Skeleton width={100} height={12} />
          <Skeleton width={80} height={12} />
        </div>
        <Skeleton width="100%" height={8} className="rounded-full" />
      </div>

      {/* Habit list */}
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <HabitCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
