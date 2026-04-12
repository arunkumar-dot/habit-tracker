"use client";

import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { cn } from "@/lib/utils";

/**
 * DropdownMenu — Radix UI dropdown with two layers:
 *
 * 1. Low-level primitives (re-exported) for flexible composition.
 * 2. High-level `DropdownMenu` component that keeps the existing
 *    `trigger` / `items` API so no call-sites need updating.
 *
 * Accessibility improvements over old custom implementation:
 *  - Keyboard navigation (arrow keys, Enter, Escape, Tab)
 *  - Screen reader announcements
 *  - Focus management
 *  - Portal rendering (no z-index battles)
 */

// ─── Low-level primitives ────────────────────────────────────────────────────

export const DropdownMenuRoot = DropdownMenuPrimitive.Root;
export const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;
export const DropdownMenuPortal = DropdownMenuPrimitive.Portal;
export const DropdownMenuSeparator = DropdownMenuPrimitive.Separator;

export function DropdownMenuContent({
  className,
  sideOffset = 6,
  align = "end",
  ...props
}: React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content>) {
  return (
    <DropdownMenuPrimitive.Portal>
      <DropdownMenuPrimitive.Content
        sideOffset={sideOffset}
        align={align}
        className={cn(
          "z-50 min-w-[160px] rounded-xl border border-border bg-popover py-1 shadow-xl",
          "data-[state=open]:animate-in data-[state=closed]:animate-out",
          "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
          "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
          "data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2",
          "duration-100",
          className
        )}
        {...props}
      />
    </DropdownMenuPrimitive.Portal>
  );
}

export function DropdownMenuItem({
  className,
  inset,
  ...props
}: React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item> & {
  inset?: boolean;
}) {
  return (
    <DropdownMenuPrimitive.Item
      className={cn(
        "relative flex cursor-pointer select-none items-center gap-2.5",
        "rounded-sm px-3 py-2 text-sm text-foreground outline-none transition-colors",
        "hover:bg-accent hover:text-accent-foreground",
        "focus:bg-accent focus:text-accent-foreground",
        "data-[disabled]:pointer-events-none data-[disabled]:opacity-40",
        inset && "pl-8",
        className
      )}
      {...props}
    />
  );
}

export function DropdownMenuLabel({
  className,
  inset,
  ...props
}: React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Label> & {
  inset?: boolean;
}) {
  return (
    <DropdownMenuPrimitive.Label
      className={cn(
        "px-3 py-1.5 text-xs font-semibold text-muted-foreground",
        inset && "pl-8",
        className
      )}
      {...props}
    />
  );
}

// ─── High-level convenience wrapper (keeps existing API) ─────────────────────

export interface DropdownMenuItemDef {
  label: string;
  icon?: React.ReactNode;
  onClick: () => void;
  variant?: "default" | "danger";
  disabled?: boolean;
}

interface DropdownMenuProps {
  trigger: React.ReactNode;
  items: DropdownMenuItemDef[];
  align?: "left" | "right";
}

/**
 * Primary export — maintains the existing `trigger` / `items` API.
 * Uses Radix primitives for keyboard nav and a11y.
 */
export function DropdownMenu({ trigger, items, align = "right" }: DropdownMenuProps) {
  return (
    <DropdownMenuRoot>
      <DropdownMenuTrigger asChild>
        <div className="cursor-pointer">{trigger}</div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={align === "right" ? "end" : "start"}>
        {items.map((item, idx) => (
          <DropdownMenuItem
            key={idx}
            disabled={item.disabled}
            onSelect={item.onClick}
            className={
              item.variant === "danger" ? "text-destructive focus:text-destructive" : ""
            }
          >
            {item.icon && (
              <span className="flex-shrink-0" aria-hidden="true">
                {item.icon}
              </span>
            )}
            {item.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenuRoot>
  );
}
