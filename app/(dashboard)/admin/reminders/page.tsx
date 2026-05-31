"use client";

import { notFound } from "next/navigation";
import { useState } from "react";
import { useQuery, useAction } from "convex/react";
import { api } from "@/convex/_generated/api";

type Outcome = "sent" | "stale_token" | "error";

const OUTCOME_LABEL: Record<Outcome, string> = {
  sent: "✓ sent",
  stale_token: "⚠ stale token",
  error: "✗ error",
};

const OUTCOME_CLASS: Record<Outcome, string> = {
  sent: "text-green-600 dark:text-green-400",
  stale_token: "text-yellow-600 dark:text-yellow-400",
  error: "text-red-600 dark:text-red-400",
};

export default function AdminRemindersPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  const logs = useQuery(api.reminderLog.getRecentLogs);
  const triggerAction = useAction(api.notifications.devTriggerReminders);

  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function runTrigger(mode: "dryRun" | "mockMode" | "real") {
    setLoading(true);
    setStatus(null);
    try {
      await triggerAction({
        dryRun: mode === "dryRun",
        mockMode: mode === "mockMode",
      });
      setStatus(
        mode === "dryRun"
          ? "Dry run complete — check Convex logs for what would have been sent."
          : mode === "mockMode"
            ? "Mock send complete — reminderLog updated without hitting FCM."
            : "Real send complete — FCM called for matching habits."
      );
    } catch (err) {
      setStatus(`Error: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-8 space-y-8">
      <div>
        <h1 className="text-2xl font-bold">FCM Reminder Admin</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Dev-only — not available in production.
        </p>
      </div>

      {/* Trigger buttons */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Manual Trigger</h2>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => runTrigger("dryRun")}
            disabled={loading}
            className="px-4 py-2 rounded bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 disabled:opacity-50 text-sm font-medium"
          >
            Dry Run
          </button>
          <button
            onClick={() => runTrigger("mockMode")}
            disabled={loading}
            className="px-4 py-2 rounded bg-blue-100 dark:bg-blue-900 hover:bg-blue-200 dark:hover:bg-blue-800 disabled:opacity-50 text-sm font-medium"
          >
            Mock Send
          </button>
          <button
            onClick={() => runTrigger("real")}
            disabled={loading}
            className="px-4 py-2 rounded bg-green-100 dark:bg-green-900 hover:bg-green-200 dark:hover:bg-green-800 disabled:opacity-50 text-sm font-medium"
          >
            Real Send
          </button>
        </div>

        {loading && (
          <p className="text-sm text-muted-foreground">Running…</p>
        )}

        {status && !loading && (
          <p
            data-testid="trigger-result"
            className="text-sm border rounded px-3 py-2 bg-muted"
          >
            {status}
          </p>
        )}
      </section>

      {/* Recent reminderLog entries */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">
          Recent reminderLog{" "}
          <span className="text-muted-foreground font-normal text-sm">
            (last 20)
          </span>
        </h2>

        {logs === undefined && (
          <p className="text-sm text-muted-foreground">Loading…</p>
        )}

        {logs !== undefined && logs.length === 0 && (
          <p className="text-sm text-muted-foreground">No entries yet.</p>
        )}

        {logs !== undefined && logs.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="border-b text-left">
                  <th className="pb-2 pr-3 font-medium">Date</th>
                  <th className="pb-2 pr-3 font-medium">Slot</th>
                  <th className="pb-2 pr-3 font-medium">Habit ID</th>
                  <th className="pb-2 pr-3 font-medium">Token ID</th>
                  <th className="pb-2 pr-3 font-medium">Outcome</th>
                  <th className="pb-2 font-medium">Sent At</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((row) => (
                  <tr key={row._id} className="border-b last:border-0">
                    <td className="py-1.5 pr-3 font-mono">{row.date}</td>
                    <td className="py-1.5 pr-3 font-mono">{row.timeSlot}</td>
                    <td
                      className="py-1.5 pr-3 font-mono truncate max-w-[8rem]"
                      title={row.habitId}
                    >
                      {row.habitId.slice(-8)}
                    </td>
                    <td
                      className="py-1.5 pr-3 font-mono truncate max-w-[8rem]"
                      title={row.pushTokenId}
                    >
                      {row.pushTokenId.slice(-8)}
                    </td>
                    <td
                      className={`py-1.5 pr-3 font-medium ${OUTCOME_CLASS[row.outcome as Outcome] ?? ""}`}
                    >
                      {OUTCOME_LABEL[row.outcome as Outcome] ?? row.outcome}
                    </td>
                    <td className="py-1.5 text-muted-foreground">
                      {new Date(row.sentAt).toLocaleTimeString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}
