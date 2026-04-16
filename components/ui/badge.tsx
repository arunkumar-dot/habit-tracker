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
          "bg-[rgba(16,185,129,0.15)] text-[#10b981] border border-[rgba(16,185,129,0.3)]",
        warning:
          "bg-[rgba(245,158,11,0.15)] text-[#f59e0b] border border-[rgba(245,158,11,0.3)]",
        danger:
          "bg-[rgba(239,68,68,0.15)] text-destructive border border-[rgba(239,68,68,0.3)]",
        info:
          "bg-[rgba(30,96,145,0.12)] text-[#1E6091] border border-[rgba(30,96,145,0.25)]",
        purple:
          "bg-[rgba(124,111,92,0.12)] text-[#7C6F5C] border border-[rgba(124,111,92,0.25)]",
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
