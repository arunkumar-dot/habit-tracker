"use client";

/**
 * StreakRibbon — the project's signature streak indicator.
 *
 * Spec (Phase 4):
 *   - ~56px wide × 28px tall rounded-rectangle badge
 *   - Gradient fill: deep terracotta (#7C2D12) → terracotta (#C2410C)
 *   - White text in --font-display, 16px, weight 700
 *   - Custom 2-path flame SVG (no emoji)
 *   - Rotated −3° for personality
 *   - Warm shadow: 0 2px 6px rgba(194, 65, 12, 0.35)
 *   - Hidden when count < 1
 */

interface StreakRibbonProps {
  count: number;
  className?: string;
  /** Override the default tooltip. Defaults to "{count}-day streak". */
  title?: string;
}

/** Hand-drawn 2-path flame — outer body + inner luminous core. */
function FlameSVG() {
  return (
    <svg
      width="9"
      height="12"
      viewBox="0 0 9 12"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      {/* Outer flame body */}
      <path
        d="M4.5 0.5 C4.5 0.5 7.5 3.8 7.5 6.3 C7.5 8.07 6.16 9.5 4.5 9.5 C2.84 9.5 1.5 8.07 1.5 6.3 C1.5 3.8 4.5 0.5 4.5 0.5 Z"
        fill="white"
        fillOpacity="0.92"
      />
      {/* Inner luminous core */}
      <path
        d="M4.5 4.8 C4.5 4.8 6 6.2 6 7.1 C6 7.9 5.33 8.5 4.5 8.5 C3.67 8.5 3 7.9 3 7.1 C3 6.2 4.5 4.8 4.5 4.8 Z"
        fill="white"
        fillOpacity="0.5"
      />
    </svg>
  );
}

export function StreakRibbon({ count, className, title }: StreakRibbonProps) {
  if (count < 1) return null;

  const label = title ?? `${count}-day streak`;

  return (
    <span
      className={className}
      title={label}
      aria-label={label}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "4px",
        width: "56px",
        height: "28px",
        padding: "0 8px",
        borderRadius: "6px",
        background: "linear-gradient(135deg, #7C2D12 0%, #C2410C 100%)",
        boxShadow: "0 2px 6px rgba(194, 65, 12, 0.35)",
        transform: "rotate(-3deg)",
        flexShrink: 0,
      }}
    >
      <FlameSVG />
      <span
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "16px",
          fontWeight: 700,
          color: "white",
          lineHeight: 1,
          userSelect: "none",
          textShadow: "0 1px 2px rgba(60, 10, 0, 0.4)",
        }}
      >
        {count}
      </span>
    </span>
  );
}
