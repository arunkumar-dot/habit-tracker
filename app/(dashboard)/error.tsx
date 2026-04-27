"use client";

import { useEffect } from "react";
import * as Sentry from "@sentry/nextjs";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center px-4">
      <h2 className="text-xl font-semibold" style={{ color: "var(--text-primary)" }}>
        Something went wrong
      </h2>
      <p className="text-sm max-w-sm" style={{ color: "var(--text-secondary)" }}>
        An unexpected error occurred. The team has been notified.
      </p>
      <button
        onClick={reset}
        className="px-4 py-2 rounded-lg text-sm font-medium text-white"
        style={{ background: "var(--accent)" }}
      >
        Try again
      </button>
    </div>
  );
}
