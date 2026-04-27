/**
 * Dev-only API route — bulk-deletes E2E_ prefixed test habits.
 *
 * Called by Playwright's afterEach cleanup helper (e2e/fixtures/test-helpers.ts).
 * Hard-blocked in production via NODE_ENV guard.
 *
 * Uses the Convex HTTP client with the test user's Clerk JWT so the mutation
 * runs under the correct auth identity.
 */

import { NextRequest, NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";
import { auth } from "@clerk/nextjs/server";
import { api } from "@/convex/_generated/api";

export async function POST(req: NextRequest) {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Not available in production" }, { status: 403 });
  }

  // Clerk auth — get a fresh JWT for the current session
  const { getToken } = await auth();
  const token = await getToken({ template: "convex" });

  if (!token) {
    return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
  }

  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
  if (!convexUrl) {
    return NextResponse.json({ error: "NEXT_PUBLIC_CONVEX_URL not set" }, { status: 500 });
  }

  const client = new ConvexHttpClient(convexUrl);
  client.setAuth(token);

  try {
    const result = await client.mutation(api.habits.deleteTestHabits, {});
    return NextResponse.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
