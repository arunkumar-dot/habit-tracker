import { forwardRef } from "react";
import { cn } from "@/lib/utils";

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, helperText, className, id, ...props }, ref) => {
    const textareaId = id ?? label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={textareaId}
            className="text-sm font-medium"
            style={{ color: "var(--text-primary)" }}
          >
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          className={cn(
            "w-full px-3 py-2.5 rounded-xl text-sm outline-none transition-colors resize-none",
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
          rows={3}
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

Textarea.displayName = "Textarea";
