"use client";

import * as Sentry from "@sentry/nextjs";
import { useState } from "react";

export default function SentryTestClient() {
  const [sent, setSent] = useState(false);

  function throwError() {
    throw new Error("Sentry test error — intentional throw from /sentry-test");
  }

  function captureManual() {
    Sentry.captureException(
      new Error("Sentry test error — manual capture from /sentry-test")
    );
    setSent(true);
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-6 text-center px-4">
      <h1 className="text-2xl font-bold">Sentry Test Page</h1>
      <p className="text-sm text-gray-500 max-w-sm">
        Only visible in non-production environments. Use the buttons below to
        confirm events arrive in your Sentry dashboard.
      </p>

      <div className="flex flex-col gap-3 w-full max-w-xs">
        <button
          onClick={throwError}
          className="px-4 py-2 rounded-lg font-medium text-white bg-red-600 hover:bg-red-700"
        >
          Throw unhandled error (triggers error boundary)
        </button>

        <button
          onClick={captureManual}
          className="px-4 py-2 rounded-lg font-medium text-white bg-orange-500 hover:bg-orange-600"
        >
          Capture exception manually
        </button>
      </div>

      {sent && (
        <p className="text-sm text-green-600 font-medium">
          Event sent — check your Sentry dashboard.
        </p>
      )}
    </div>
  );
}
