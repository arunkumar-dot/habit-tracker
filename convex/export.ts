import { httpAction } from "./_generated/server";
import { internal } from "./_generated/api";
import type { UserDataBundle } from "./userData";

// ── CORS ──────────────────────────────────────────────────────────────────────
// The export endpoint is called by the browser via fetch from the Next.js app
// origin (e.g. localhost:3000 in dev, your production domain in prod).
// Convex HTTP actions run on a separate convex.site domain, so browsers send a
// CORS preflight (OPTIONS) before the real GET. We must respond to OPTIONS and
// include the right CORS headers on the GET response.
//
// In production, restrict NEXT_PUBLIC_SITE_URL to your actual domain.
// For now we reflect the request Origin so it works across dev + prod origins.

function corsHeaders(requestOrigin: string | null): HeadersInit {
  return {
    "Access-Control-Allow-Origin": requestOrigin ?? "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Authorization, Content-Type",
    "Access-Control-Allow-Credentials": "true",
  };
}

/**
 * OPTIONS /export-user-data — CORS preflight handler.
 * The browser sends this before the real GET when the Authorization header
 * is present. Must return 200 with the CORS headers.
 */
export const exportUserDataOptions = httpAction(async (_ctx, request) => {
  const origin = request.headers.get("Origin");
  return new Response(null, {
    status: 200,
    headers: corsHeaders(origin),
  });
});

/**
 * GET /export-user-data
 *
 * Authenticates via the Clerk JWT in the Authorization header
 * (must be fetched with template: "convex" on the client side),
 * collects all user-owned data via the shared collectUserData internal query,
 * and returns it as a pretty-printed JSON download.
 *
 * Export envelope format (schema version 1):
 *   {
 *     _exportVersion: 1,
 *     _exportedAt: "<ISO timestamp>",
 *     _userId: "<Clerk user ID>",
 *     data: { user, habits, habitCompletions, ... }
 *   }
 */
export const exportUserData = httpAction(async (ctx, request) => {
  const origin = request.headers.get("Origin");

  // ── 1. Auth ──────────────────────────────────────────────────────────────
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders(origin),
      },
    });
  }

  // ── 2. Resolve Convex user ────────────────────────────────────────────────
  const user = await ctx.runQuery(internal.userData.getUserByClerkId, {
    clerkId: identity.subject,
  });
  if (!user) {
    return new Response(JSON.stringify({ error: "User not found" }), {
      status: 404,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders(origin),
      },
    });
  }

  // ── 3. Collect all user data via shared enumerator ────────────────────────
  const data: UserDataBundle = await ctx.runQuery(
    internal.userData.collectUserData,
    { userId: user._id }
  );

  // ── 4. Build export envelope ──────────────────────────────────────────────
  const exportedAt = new Date().toISOString();
  const exportDate = exportedAt.slice(0, 10); // "YYYY-MM-DD"

  const envelope = {
    _exportVersion: 1,
    _exportedAt: exportedAt,
    _userId: identity.subject,
    data,
  };

  return new Response(JSON.stringify(envelope, null, 2), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Content-Disposition": `attachment; filename="habitflow-export-${exportDate}.json"`,
      ...corsHeaders(origin),
    },
  });
});
