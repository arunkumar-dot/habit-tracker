import { cn } from "@/lib/utils";

/**
 * SectionHeader — consistent heading block for page sections.
 *
 * Usage:
 *   <SectionHeader
 *     title="Today's Habits"
 *     description="Track your daily routines"
 *     action={<Button size="sm">Add</Button>}
 *   />
 */

interface SectionHeaderProps {
  title: string;
  description?: string;
  /** Optional right-aligned content (button, badge, etc.) */
  action?: React.ReactNode;
  className?: string;
  /** Heading level for semantic HTML */
  as?: "h1" | "h2" | "h3" | "h4";
}

export function SectionHeader({
  title,
  description,
  action,
  className,
  as: Tag = "h2",
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "flex items-start justify-between gap-4 mb-4",
        className
      )}
    >
      <div className="min-w-0 flex-1">
        <Tag className="text-base font-semibold text-foreground leading-snug truncate">
          {title}
        </Tag>
        {description && (
          <p className="text-sm text-muted-foreground mt-0.5">{description}</p>
        )}
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  );
}
