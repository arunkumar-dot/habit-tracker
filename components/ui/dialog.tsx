"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  maxWidth?: "sm" | "md" | "lg";
}

const maxWidthMap = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
};

export function Dialog({
  isOpen,
  onClose,
  title,
  description,
  children,
  className,
  maxWidth = "md",
}: DialogProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  // Close on Escape key
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && isOpen) onClose();
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Prevent body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.7)" }}
      onClick={(e) => {
        if (e.target === overlayRef.current) onClose();
      }}
    >
      <div
        className={cn(
          "relative w-full rounded-2xl shadow-2xl",
          maxWidthMap[maxWidth],
          className
        )}
        style={{
          background: "var(--bg-elevated)",
          border: "1px solid var(--border)",
          animation: "dialogIn 0.15s ease-out",
        }}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? "dialog-title" : undefined}
      >
        {/* Header */}
        {(title || description) && (
          <div
            className="flex items-start justify-between p-6 pb-4"
            style={{ borderBottom: "1px solid var(--border)" }}
          >
            <div>
              {title && (
                <h2
                  id="dialog-title"
                  className="text-lg font-semibold"
                  style={{ color: "var(--text-primary)" }}
                >
                  {title}
                </h2>
              )}
              {description && (
                <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
                  {description}
                </p>
              )}
            </div>
            <button
              onClick={onClose}
              className="flex-shrink-0 ml-4 p-1.5 rounded-lg transition-colors"
              style={{ color: "var(--text-secondary)" }}
              aria-label="Close dialog"
            >
              <X size={18} />
            </button>
          </div>
        )}

        {/* Content */}
        <div className="p-6">{children}</div>
      </div>

      <style>{`
        @keyframes dialogIn {
          from { opacity: 0; transform: scale(0.95) translateY(4px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  );
}
