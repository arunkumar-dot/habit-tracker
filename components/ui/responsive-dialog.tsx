"use client";

import { X } from "lucide-react";
import { Drawer } from "vaul";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-is-mobile";
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogRoot,
  DialogTitle,
} from "@/components/ui/dialog";

const maxWidthMap = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
};

const closeButtonClass = cn(
  "flex-shrink-0 ml-4 p-1.5 rounded-lg transition-colors",
  "text-muted-foreground hover:text-foreground hover:bg-accent",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
);

interface ResponsiveDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  /** Action buttons rendered outside the scrollable content area. */
  footer?: React.ReactNode;
  className?: string;
  maxWidth?: "sm" | "md" | "lg";
}

/**
 * ResponsiveDialog — renders a bottom-sheet Drawer on mobile (< 768 px) and
 * a centered Dialog on desktop. Drop-in replacement for `<Dialog>`; accepts
 * the same props plus an optional `footer` slot for action buttons that sit
 * outside the scrollable content area.
 */
export function ResponsiveDialog({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  className,
  maxWidth = "md",
}: ResponsiveDialogProps) {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <Drawer.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <Drawer.Portal>
          <Drawer.Overlay className="fixed inset-0 z-50 bg-black/70" />
          <Drawer.Content
            className={cn(
              "fixed bottom-0 left-0 right-0 z-50",
              "flex flex-col rounded-t-2xl border border-border bg-popover",
              "max-h-[90dvh]",
              className
            )}
          >
            <Drawer.Handle className="mx-auto mt-3 mb-1 h-1.5 w-12 rounded-full bg-muted-foreground/30" />
            {(title || description) && (
              <div className="flex items-start justify-between p-6 pb-4 border-b border-border">
                <div className="flex-1">
                  {title && (
                    <Drawer.Title className="text-lg font-semibold text-foreground">
                      {title}
                    </Drawer.Title>
                  )}
                  {description && (
                    <Drawer.Description className="text-sm text-muted-foreground mt-1">
                      {description}
                    </Drawer.Description>
                  )}
                </div>
                <Drawer.Close className={closeButtonClass} aria-label="Close">
                  <X size={18} aria-hidden="true" />
                </Drawer.Close>
              </div>
            )}
            <div className="overflow-y-auto p-6">{children}</div>
            {footer && (
              <div className="px-4 pb-6 pt-3 border-t border-border">{footer}</div>
            )}
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>
    );
  }

  return (
    <DialogRoot open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        className={cn(maxWidthMap[maxWidth], className)}
        aria-describedby={description ? "responsive-dialog-description" : undefined}
      >
        {(title || description) && (
          <DialogHeader>
            <div className="flex-1">
              {title && <DialogTitle>{title}</DialogTitle>}
              {description && (
                <DialogDescription id="responsive-dialog-description">
                  {description}
                </DialogDescription>
              )}
            </div>
            <DialogClose className={closeButtonClass} aria-label="Close dialog">
              <X size={18} aria-hidden="true" />
            </DialogClose>
          </DialogHeader>
        )}
        <div className="p-6">{children}</div>
        {footer && (
          <div className="px-6 pb-6 pt-4 border-t border-border">{footer}</div>
        )}
      </DialogContent>
    </DialogRoot>
  );
}
