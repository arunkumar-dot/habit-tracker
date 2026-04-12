"use client";

import { forwardRef } from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * Button — shadcn/ui-style with cva, Radix Slot support.
 *
 * Variants map to the project's design tokens via @theme inline:
 *   primary  → bg-primary  (--accent-primary / indigo-500)
 *   secondary→ bg-secondary (--bg-elevated)
 *   ghost    → transparent  (--text-secondary)
 *   danger   → bg-destructive (--accent-danger / red-500)
 *   outline  → border-primary transparent background
 *   success  → bg-success   (--accent-success / emerald-500)
 *
 * Backward-compatible: all existing callers work unchanged.
 */

const buttonVariants = cva(
  // Base styles shared by all variants
  [
    "inline-flex items-center justify-center gap-2 select-none whitespace-nowrap",
    "text-sm font-medium transition-all duration-150",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
    "disabled:pointer-events-none disabled:opacity-50",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0",
  ],
  {
    variants: {
      variant: {
        primary:
          "bg-primary text-primary-foreground hover:bg-primary/90 active:scale-[0.97]",
        secondary:
          "bg-secondary text-secondary-foreground border border-border hover:bg-secondary/80 active:scale-[0.97]",
        ghost:
          "bg-transparent text-muted-foreground hover:opacity-80 active:scale-[0.97]",
        danger:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 active:scale-[0.97]",
        outline:
          "bg-transparent text-primary border border-primary hover:bg-primary/10 active:scale-[0.97]",
        success:
          "bg-success text-success-foreground hover:bg-success/90 active:scale-[0.97]",
      },
      size: {
        sm: "px-3 py-1.5 text-sm rounded-lg",
        md: "px-4 py-2 text-sm rounded-xl",
        lg: "px-6 py-3 text-base rounded-xl",
        icon: "p-2 rounded-xl aspect-square",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  /** Render as child element (Radix Slot pattern) */
  asChild?: boolean;
  /** Show spinner and disable the button */
  isLoading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      isLoading = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, size, className }))}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && (
          <svg
            className="animate-spin-slow w-4 h-4 shrink-0"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
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
      </Comp>
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };
