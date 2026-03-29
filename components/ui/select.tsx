import { forwardRef } from "react";
import { cn } from "@/lib/utils";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  options: Array<{ value: string; label: string }>;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, helperText, options, className, id, ...props }, ref) => {
    const selectId = id ?? label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={selectId}
            className="text-sm font-medium"
            style={{ color: "var(--text-primary)" }}
          >
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={selectId}
          className={cn(
            "w-full px-3 py-2.5 rounded-xl text-sm outline-none transition-colors appearance-none cursor-pointer",
            error
              ? "ring-1 ring-[color:var(--accent-danger)]"
              : "focus:ring-1 focus:ring-[color:var(--border-focus)]",
            className
          )}
          style={{
            background: "var(--bg-input)",
            border: "1px solid var(--border)",
            color: "var(--text-primary)",
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
            backgroundRepeat: "no-repeat",
            backgroundPosition: "right 12px center",
            paddingRight: "36px",
          }}
          {...props}
        >
          {options.map((option) => (
            <option
              key={option.value}
              value={option.value}
              style={{ background: "var(--bg-elevated)" }}
            >
              {option.label}
            </option>
          ))}
        </select>
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

Select.displayName = "Select";
