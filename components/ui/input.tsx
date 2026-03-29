import { forwardRef } from "react";
import { cn } from "@/lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium"
            style={{ color: "var(--text-primary)" }}
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            "w-full px-3 py-2.5 rounded-xl text-sm outline-none transition-colors",
            "placeholder:text-[color:var(--text-disabled)]",
            error
              ? "ring-1 ring-[color:var(--accent-danger)]"
              : "focus:ring-1 focus:ring-[color:var(--border-focus)]",
            className
          )}
          style={{
            background: "var(--bg-input)",
            border: "1px solid var(--border)",
            color: "var(--text-primary)",
          }}
          {...props}
        />
        {error && (
          <p className="text-xs" style={{ color: "var(--accent-danger)" }}>
            {error}
          </p>
        )}
        {!error && helperText && (
          <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
