import { cn } from "@/lib/utils";

type BadgeVariant = "default" | "success" | "warning" | "danger" | "info" | "purple";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

const variantStyles: Record<BadgeVariant, React.CSSProperties> = {
  default: { background: "var(--bg-elevated)", color: "var(--text-secondary)", border: "1px solid var(--border)" },
  success: { background: "rgba(16,185,129,0.15)", color: "var(--accent-success)", border: "1px solid rgba(16,185,129,0.3)" },
  warning: { background: "rgba(245,158,11,0.15)", color: "var(--accent-warning)", border: "1px solid rgba(245,158,11,0.3)" },
  danger: { background: "rgba(239,68,68,0.15)", color: "var(--accent-danger)", border: "1px solid rgba(239,68,68,0.3)" },
  info: { background: "rgba(99,102,241,0.15)", color: "var(--accent-primary)", border: "1px solid rgba(99,102,241,0.3)" },
  purple: { background: "rgba(168,85,247,0.15)", color: "#a855f7", border: "1px solid rgba(168,85,247,0.3)" },
};

export function Badge({ variant = "default", className, style, children, ...props }: BadgeProps) {
  return (
    <span
      className={cn("inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium", className)}
      style={{ ...variantStyles[variant], ...style }}
      {...props}
    >
      {children}
    </span>
  );
}
