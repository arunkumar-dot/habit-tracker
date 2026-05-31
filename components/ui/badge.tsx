import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * Badge — small labeling component using cva for type-safe variants.
 *
 * Variants use inline rgba for tinted backgrounds to avoid needing
 * opacity utilities on the CSS variable colors.
 *
 * Backward-compatible: all existing variant names preserved.
 */

const badgeVariants = cva(
  "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium",
  {
    variants: {
      variant: {
        default:
          "bg-secondary text-muted-foreground border border-border",
        success:
          "bg-[var(--success-soft)] text-[var(--success)] border border-[color-mix(in_srgb,var(--success)_30%,transparent)]",
        warning:
          "bg-[var(--warning-soft)] text-[var(--warning)] border border-[color-mix(in_srgb,var(--warning)_30%,transparent)]",
        danger:
          "bg-[var(--danger-soft)] text-destructive border border-[color-mix(in_srgb,var(--danger)_30%,transparent)]",
        info:
          "bg-[var(--nebula-blue-soft)] text-[var(--nebula-blue)] border border-[color-mix(in_srgb,var(--nebula-blue)_25%,transparent)]",
        purple:
          "bg-[var(--nebula-purple-soft)] text-[var(--nebula-purple)] border border-[color-mix(in_srgb,var(--nebula-purple)_25%,transparent)]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ variant, className, children, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props}>
      {children}
    </span>
  );
}

export { badgeVariants };
