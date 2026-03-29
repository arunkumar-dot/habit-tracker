import { cn } from "@/lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "elevated" | "bordered";
  padding?: "none" | "sm" | "md" | "lg";
}

const paddingStyles = {
  none: "",
  sm: "p-3",
  md: "p-4",
  lg: "p-6",
};

export function Card({
  variant = "default",
  padding = "md",
  className,
  children,
  style,
  ...props
}: CardProps) {
  const variantStyle: React.CSSProperties = {
    default: {
      background: "var(--bg-surface)",
      border: "1px solid var(--border)",
    },
    elevated: {
      background: "var(--bg-elevated)",
      border: "1px solid var(--border)",
      boxShadow: "0 4px 24px rgba(0,0,0,0.3)",
    },
    bordered: {
      background: "var(--bg-surface)",
      border: "1px solid var(--border)",
    },
  }[variant];

  return (
    <div
      className={cn("rounded-2xl", paddingStyles[padding], className)}
      style={{ ...variantStyle, ...style }}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("flex items-center justify-between mb-4", className)}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardTitle({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn("text-base font-semibold", className)}
      style={{ color: "var(--text-primary)" }}
      {...props}
    >
      {children}
    </h3>
  );
}

export function CardContent({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn(className)} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "flex items-center justify-between mt-4 pt-4",
        className
      )}
      style={{ borderTop: "1px solid var(--border)" }}
      {...props}
    >
      {children}
    </div>
  );
}
