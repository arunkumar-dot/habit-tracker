/**
 * Global Playwright setup — runs once before the entire test suite.
 *
 * Uses clerk.signIn() with the emailAddress overload (ticket strategy).
 * Clerk's Backend API (CLERK_SECRET_KEY) creates a short-lived sign-in token
 * for the test user — no password required, no UI form, no flake.
 *
 * Ref: graphify-out/GRAPH_REPORT.md → "Authentication flow" hyperedge
 *      provider_clerk → app_root_page → dashboard_page  [EXTRACTED 0.95]
 *
 * Env vars needed (in .env.local):
 *   E2E_CLERK_USER_EMAIL  — a real user in your Clerk test instance
 *   CLERK_SECRET_KEY      — sk_test_… (already in .env.local)
 */

import { test as setup, expect } from "@playwright/test";
import { clerkSetup, clerk } from "@clerk/testing/playwright";
import path from "path";

const AUTH_FILE = path.join(__dirname, ".auth/user.json");

setup("authenticate test user", async ({ page }) => {
  // Validates CLERK_SECRET_KEY and fetches the Clerk testing token.
  await clerkSetup();

  const email = process.env.E2E_CLERK_USER_EMAIL;
  if (!email) {
    throw new Error(
      "E2E_CLERK_USER_EMAIL is not set.\n" +
        "Add it to .env.local — it must be a real user in your Clerk test instance."
    );
  }

  // Navigate to a page where the Clerk JS SDK is loaded so clerk.signIn()
  // can call window.Clerk internally.
  await page.goto("/sign-in");

  // Sign in via the ticket strategy — Clerk Backend API creates a one-time
  // token for this email and the SDK redeems it. No password, no UI widgets.
  await clerk.signIn({ page, emailAddress: email });

  // Confirm the session is active before saving state
  await page.goto("/dashboard");
  await expect(page).toHaveURL(/\/dashboard/, { timeout: 15_000 });

  // Save storage state so every test starts signed in
  await page.context().storageState({ path: AUTH_FILE });
});
