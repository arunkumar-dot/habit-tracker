import Link from "next/link";

export default function NotFound() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 text-center"
      style={{ background: "var(--bg-base)" }}
    >
      <div
        className="text-8xl font-bold mb-4"
        style={{ color: "var(--accent-primary)" }}
      >
        404
      </div>
      <h1 className="text-2xl font-semibold mb-2" style={{ color: "var(--text-primary)" }}>
        Page not found
      </h1>
      <p className="mb-8" style={{ color: "var(--text-secondary)" }}>
        The page you&apos;re looking for doesn&apos;t exist.
      </p>
      <Link
        href="/dashboard"
        className="px-6 py-2.5 rounded-xl font-medium text-white transition-colors"
        style={{ background: "var(--accent-primary)" }}
      >
        Go to Dashboard
      </Link>
    </div>
  );
}
