"use client";

import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

export interface DropdownMenuItem {
  label: string;
  icon?: React.ReactNode;
  onClick: () => void;
  variant?: "default" | "danger";
  disabled?: boolean;
}

interface DropdownMenuProps {
  trigger: React.ReactNode;
  items: DropdownMenuItem[];
  align?: "left" | "right";
}

export function DropdownMenu({ trigger, items, align = "right" }: DropdownMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative inline-block">
      <div onClick={() => setIsOpen((o) => !o)} className="cursor-pointer">
        {trigger}
      </div>

      {isOpen && (
        <div
          className={cn(
            "absolute z-50 mt-1.5 min-w-[160px] rounded-xl shadow-xl py-1",
            align === "right" ? "right-0" : "left-0"
          )}
          style={{
            background: "var(--bg-elevated)",
            border: "1px solid var(--border)",
            animation: "dropdownIn 0.1s ease-out",
          }}
        >
          {items.map((item, idx) => (
            <button
              key={idx}
              disabled={item.disabled}
              onClick={() => {
                item.onClick();
                setIsOpen(false);
              }}
              className={cn(
                "w-full flex items-center gap-2.5 px-3 py-2 text-sm text-left transition-colors",
                "hover:bg-[color:var(--bg-hover)] disabled:opacity-40 disabled:cursor-not-allowed"
              )}
              style={{
                color:
                  item.variant === "danger"
                    ? "var(--accent-danger)"
                    : "var(--text-primary)",
              }}
            >
              {item.icon && <span className="flex-shrink-0">{item.icon}</span>}
              {item.label}
            </button>
          ))}
        </div>
      )}

      <style>{`
        @keyframes dropdownIn {
          from { opacity: 0; transform: scale(0.95) translateY(-4px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  );
}
