import { forwardRef } from "react";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger" | "outline" | "success";
type ButtonSize = "sm" | "md" | "lg" | "icon";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
  secondary:
    "font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
  ghost:
    "font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
  danger:
    "text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
  outline:
    "font-medium border transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
  success:
    "text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-sm rounded-lg",
  md: "px-4 py-2 text-sm rounded-xl",
  lg: "px-6 py-3 text-base rounded-xl",
  icon: "p-2 rounded-xl",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      isLoading = false,
      disabled,
      className,
      children,
      style,
      ...props
    },
    ref
  ) => {
    const variantInlineStyle: React.CSSProperties = {
      primary: {
        background: "var(--accent-primary)",
        // hover handled via CSS
      },
      secondary: {
        background: "var(--bg-elevated)",
        color: "var(--text-primary)",
        border: "1px solid var(--border)",
      },
      ghost: {
        background: "transparent",
        color: "var(--text-secondary)",
      },
      danger: {
        background: "var(--accent-danger)",
      },
      outline: {
        background: "transparent",
        color: "var(--accent-primary)",
        borderColor: "var(--accent-primary)",
      },
      success: {
        background: "var(--accent-success)",
      },
    }[variant];

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          "inline-flex items-center justify-center gap-2 select-none",
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        style={{ ...variantInlineStyle, ...style }}
        {...props}
      >
        {isLoading && (
          <svg
            className="animate-spin-slow w-4 h-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
