import { cn } from "@/lib/utils";

/**
 * PageContainer — standardized page-level wrapper.
 *
 * Provides consistent horizontal padding and max-width across all pages.
 * Use `size` to control the content width:
 *   - "sm"   → max-w-2xl  (forms, settings)
 *   - "md"   → max-w-3xl  (default, dashboards)
 *   - "lg"   → max-w-5xl  (analytics, wide layouts)
 *   - "full" → no max-width constraint
 *
 * Usage:
 *   <PageContainer>
 *     <PageHeader title="My Habits" />
 *     <HabitList />
 *   </PageContainer>
 */

interface PageContainerProps {
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "full";
  className?: string;
}

const sizeMap = {
  sm: "max-w-2xl",
  md: "max-w-3xl",
  lg: "max-w-5xl",
  full: "",
};

export function PageContainer({
  children,
  size = "md",
  className,
}: PageContainerProps) {
  return (
    <div
      className={cn(
        "w-full px-4 py-6 md:px-6 lg:px-8 mx-auto",
        sizeMap[size],
        className
      )}
    >
      {children}
    </div>
  );
}
