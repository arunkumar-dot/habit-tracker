"use client";

import { cn } from "@/lib/utils";

interface StarfieldBgProps {
  className?: string;
  density?: "low" | "medium";
}

export function StarfieldBg({ className, density = "low" }: StarfieldBgProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]",
        density === "medium" ? "rpg-starfield rpg-starfield-medium" : "rpg-starfield",
        className
      )}
    />
  );
}
