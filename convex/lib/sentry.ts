/**
 * convex/lib/sentry.ts
 *
 * Minimal Sentry integration for Convex functions.
 *
 * Convex functions run in a sandboxed V8 or Node runtime that cannot import
 * @sentry/nextjs directly. This module reports errors to Sentry via the
 * Sentry Envelope HTTP API (fetch is available in all Convex runtimes).
 *
 * Setup:
 *   npx convex env set SENTRY_DSN <your-dsn>
 *
 * Usage — call inside a mutation/query/action handler:
 *
 *   export const toggleCompletion = mutation({
 *     args: { ... },
 *     handler: async (ctx, args) => {
 *       return withSentry("completions.toggleCompletion", "mutation", ctx,
 *         async () => {
 *           // ctx and args are in scope with full types from Convex
 *           const user = await getAuthUser(ctx);
 *           // ...
 *         }
 *       );
 *     },
 *   });
 *
 * Why this pattern instead of a handler HOF?
 * TypeScript cannot propagate Convex's contextual arg-type inference backwards
 * through a generic HOF — `args` would collapse to `unknown`. Wrapping a thunk
 * keeps `ctx`/`args` in the outer handler scope where contextual typing works.
 */

// ─── DSN parser ───────────────────────────────────────────────────────────────

interface ParsedDsn {
  envelopeUrl: string;
  publicKey: string;
}

function parseDsn(dsn: string): ParsedDsn | null {
  try {
    const url = new URL(dsn);
    const projectId = url.pathname.replace(/^\//, "");
    const publicKey = url.username;
    const host = url.host;
    return {
      envelopeUrl: `https://${host}/api/${projectId}/envelope/`,
      publicKey,
    };
  } catch {
    return null;
  }
}

// ─── Stack frame parser ───────────────────────────────────────────────────────

interface StackFrame {
  filename: string;
  function: string;
  lineno: number;
  colno: number;
}

function parseStackFrames(stack: string): StackFrame[] {
  return stack
    .split("\n")
    .slice(1)
    .map((line): StackFrame | null => {
      const withFn = line.match(/^\s*at (.+?) \((.+?):(\d+):(\d+)\)$/);
      if (withFn) {
        return {
          function: withFn[1],
          filename: withFn[2],
          lineno: parseInt(withFn[3], 10),
          colno: parseInt(withFn[4], 10),
        };
      }
      const noFn = line.match(/^\s*at (.+?):(\d+):(\d+)$/);
      if (noFn) {
        return {
          function: "<anonymous>",
          filename: noFn[1],
          lineno: parseInt(noFn[2], 10),
          colno: parseInt(noFn[3], 10),
        };
      }
      return null;
    })
    .filter((f): f is StackFrame => f !== null)
    .reverse(); // Sentry expects innermost frame last
}

// ─── Core envelope sender ─────────────────────────────────────────────────────

/**
 * Send an error to Sentry directly (without rethrowing).
 * Use this when you want to report a non-fatal error that should not surface
 * to the caller — e.g., a best-effort cleanup step after the main operation
 * has already completed successfully.
 */
export async function sendToSentry(
  error: unknown,
  context: {
    tags?: Record<string, string>;
    user?: { id: string } | null;
  } = {}
): Promise<void> {
  const dsn = process.env.SENTRY_DSN;
  if (!dsn) return;

  const parsed = parseDsn(dsn);
  if (!parsed) return;

  const err = error instanceof Error ? error : new Error(String(error));

  const envelopeHeader = JSON.stringify({
    dsn,
    sdk: { name: "sentry.javascript.convex", version: "1.0.0" },
    sent_at: new Date().toISOString(),
  });

  const eventPayload = JSON.stringify({
    event_id: crypto.randomUUID().replace(/-/g, ""),
    timestamp: Date.now() / 1000,
    platform: "node",
    level: "error",
    environment: process.env.NODE_ENV ?? "production",
    exception: {
      values: [
        {
          type: err.name,
          value: err.message,
          stacktrace: { frames: parseStackFrames(err.stack ?? "") },
        },
      ],
    },
    tags: context.tags,
    user: context.user ?? undefined,
  });

  const itemHeader = JSON.stringify({
    type: "event",
    content_type: "application/json",
    length: new TextEncoder().encode(eventPayload).length,
  });

  const body = `${envelopeHeader}\n${itemHeader}\n${eventPayload}`;

  try {
    await fetch(parsed.envelopeUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-sentry-envelope",
        "X-Sentry-Auth": [
          "Sentry sentry_version=7",
          `sentry_key=${parsed.publicKey}`,
          "sentry_client=sentry.javascript.convex/1.0.0",
        ].join(", "),
      },
      body,
    });
  } catch (fetchErr) {
    // Best-effort — never let Sentry failures break the app.
    console.error("[Sentry] Failed to send envelope:", fetchErr);
  }
}

// ─── withSentry ───────────────────────────────────────────────────────────────

/**
 * Executes `fn` inside a Sentry error boundary for a Convex function.
 *
 * Any unhandled error is captured and sent to Sentry (with the authed userId
 * attached as user context), then rethrown so Convex still sees the failure.
 *
 * @param name - Dotted function name used as the `convex_function` Sentry tag.
 * @param type - "mutation" | "action" used as the `convex_type` tag.
 * @param ctx  - Convex context (used to look up the authed userId).
 * @param fn   - Thunk containing the actual handler logic.
 */
export async function withSentry<Return>(
  name: string,
  type: "mutation" | "action",
  ctx: { auth: { getUserIdentity(): Promise<{ subject?: string } | null> } },
  fn: () => Promise<Return>
): Promise<Return> {
  try {
    return await fn();
  } catch (error) {
    let userId: string | undefined;
    try {
      const identity = await ctx.auth.getUserIdentity();
      userId = identity?.subject;
    } catch {
      // Unauthenticated context — no user to attach.
    }

    await sendToSentry(error, {
      tags: { convex_function: name, convex_type: type },
      user: userId ? { id: userId } : null,
    });

    throw error;
  }
}
