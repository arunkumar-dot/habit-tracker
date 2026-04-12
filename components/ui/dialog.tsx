"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Dialog — Radix UI Dialog wrapped in a backward-compatible API.
 *
 * Existing callers using `isOpen`, `onClose`, `title`, `description`,
 * `maxWidth`, and `children` continue to work without changes.
 *
 * Accessibility improvements over the old custom implementation:
 *  - Focus is trapped inside the dialog when open
 *  - Screen readers announced via aria-labelledby / aria-describedby
 *  - Escape key handled natively by Radix
 *  - Body scroll lock handled natively by Radix
 *  - Portal rendering prevents z-index stacking issues
 */

// ─── Low-level primitives (re-exported for compound usage) ───────────────────

export const DialogRoot = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;
export const DialogPortal = DialogPrimitive.Portal;
export const DialogClose = DialogPrimitive.Close;

export function DialogOverlay({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>) {
  return (
    <DialogPrimitive.Overlay
      className={cn(
        "fixed inset-0 z-50 bg-black/70",
        "data-[state=open]:animate-in data-[state=closed]:animate-out",
        "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        className
      )}
      {...props}
    />
  );
}

export function DialogContent({
  className,
  children,
  ...props
}: React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>) {
  return (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Content
        className={cn(
          "fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2",
          "w-full rounded-2xl border border-border bg-popover shadow-2xl",
          "data-[state=open]:animate-in data-[state=closed]:animate-out",
          "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
          "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
          "data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%]",
          "data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]",
          "duration-150",
          className
        )}
        {...props}
      >
        {children}
      </DialogPrimitive.Content>
    </DialogPortal>
  );
}

export function DialogHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "flex items-start justify-between p-6 pb-4 border-b border-border",
        className
      )}
      {...props}
    />
  );
}

export function DialogTitle({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title
      className={cn("text-lg font-semibold text-foreground", className)}
      {...props}
    />
  );
}

export function DialogDescription({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>) {
  return (
    <DialogPrimitive.Description
      className={cn("text-sm text-muted-foreground mt-1", className)}
      {...props}
    />
  );
}

// ─── High-level convenience wrapper (keeps existing API) ─────────────────────

const maxWidthMap = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
};

interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  maxWidth?: "sm" | "md" | "lg";
}

/**
 * The primary `Dialog` export — maintains the existing API so no call-sites
 * need updating. Uses Radix primitives internally for full a11y compliance.
 */
export function Dialog({
  isOpen,
  onClose,
  title,
  description,
  children,
  className,
  maxWidth = "md",
}: DialogProps) {
  return (
    <DialogRoot open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        className={cn(maxWidthMap[maxWidth], className)}
        aria-describedby={description ? "dialog-description" : undefined}
      >
        {(title || description) && (
          <DialogHeader>
            <div className="flex-1">
              {title && <DialogTitle>{title}</DialogTitle>}
              {description && (
                <DialogDescription id="dialog-description">
                  {description}
                </DialogDescription>
              )}
            </div>
            <DialogClose
              className={cn(
                "flex-shrink-0 ml-4 p-1.5 rounded-lg transition-colors",
                "text-muted-foreground hover:text-foreground hover:bg-accent",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              )}
              aria-label="Close dialog"
            >
              <X size={18} aria-hidden="true" />
            </DialogClose>
          </DialogHeader>
        )}
        <div className="p-6">{children}</div>
      </DialogContent>
    </DialogRoot>
  );
}
