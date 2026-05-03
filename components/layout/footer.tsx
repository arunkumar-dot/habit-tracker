import Link from "next/link";

/**
 * Minimal site footer with legal links.
 * Used in the dashboard layout (inside <main>), the auth layout,
 * and any marketing/root layouts.
 *
 * Intentionally small and muted — designed not to compete with primary content.
 */
export function Footer() {
  return (
    <footer
      className="py-5 text-center text-xs"
      style={{
        borderTop: "1px solid var(--border-subtle)",
        color: "var(--text-tertiary)",
      }}
    >
      <span>© 2026 HabitFlow</span>
      <span className="mx-2" aria-hidden="true">
        ·
      </span>
      <Link
        href="/legal/privacy"
        className="transition-colors hover:underline"
        style={{ color: "var(--text-secondary)" }}
      >
        Privacy
      </Link>
      <span className="mx-2" aria-hidden="true">
        ·
      </span>
      <Link
        href="/legal/terms"
        className="transition-colors hover:underline"
        style={{ color: "var(--text-secondary)" }}
      >
        Terms
      </Link>
    </footer>
  );
}
