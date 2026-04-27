/**
 * Auth smoke tests
 *
 * Protects the "Authentication flow" hyperedge from GRAPH_REPORT.md:
 *   provider_clerk → app_root_page → auth_signin_page / dashboard_page
 *   [EXTRACTED 0.95]
 *
 * God nodes on the critical path: DashboardPage (14 edges), useHabits (12 edges)
 *
 * These tests run with the shared storageState (user is already signed in).
 * The sign-out test explicitly clears that state and verifies the redirect.
 */

import { test, expect } from "@playwright/test";
import { clerk, clerkSetup } from "@clerk/testing/playwright";

test.describe("Auth flow", () => {
  test("signed-in user lands on dashboard without being redirected to sign-in", async ({
    page,
  }) => {
    await page.goto("/dashboard");

    // Primary assertion: stayed on /dashboard (no redirect to sign-in)
    await expect(page).toHaveURL(/\/dashboard/);

    // Secondary: the dashboard layout rendered — the <main> element is present
    // in DashboardLayout (app/(dashboard)/layout.tsx) only when auth passed.
    // Avoid getByText("Today") — that word appears in the hero card <p>, in SVG
    // <title> nodes, and in SVG <text> nodes, causing a strict-mode violation.
    await expect(page.locator("main")).toBeVisible({ timeout: 10_000 });
  });

  test("root page redirects authenticated user to dashboard", async ({ page }) => {
    await page.goto("/");
    // RootPage gates on Clerk auth and sends signed-in users to /dashboard
    await expect(page).toHaveURL(/\/dashboard/, { timeout: 10_000 });
  });

  // Sign-out is isolated in its own describe block with a CLEAN context (no
  // pre-loaded storageState). This is critical: calling clerk.signOut() revokes
  // the session server-side. If we started from the shared user.json session,
  // we would invalidate the token that every other parallel test depends on,
  // causing navigation/journal tests to land on /sign-in instead of their pages.
  //
  // By starting with an empty context and signing in fresh here, we create a
  // brand-new Clerk session. Signing out revokes only that session — the shared
  // user.json session (and every other parallel test) is completely unaffected.
  test.describe("sign-out", () => {
    test.use({ storageState: { cookies: [], origins: [] } });

    test("sign-out redirects to sign-in page", async ({ page, context }) => {
      // Re-run clerkSetup() so the Clerk testing token is available in this
      // worker process (global setup runs in a separate process and its
      // in-memory state is not automatically inherited by test workers).
      await clerkSetup();

      const email = process.env.E2E_CLERK_USER_EMAIL;
      if (!email) throw new Error("E2E_CLERK_USER_EMAIL is not set");

      // Sign in fresh — this creates a NEW Clerk session that is independent
      // of the shared session in user.json used by all other tests.
      await page.goto("/sign-in");
      await clerk.signIn({ page, emailAddress: email });

      await page.goto("/dashboard");
      await expect(page).toHaveURL(/\/dashboard/);

      // Tell Clerk's SDK to sign out — replicates clicking the sign-out button
      // and lets Clerk fully tear down the session before we continue.
      // This revokes only the session we just created above.
      await clerk.signOut({ page });

      // Wait for Clerk's own post-signout redirect to complete. Clerk sends the
      // browser away from /dashboard after signing out; we wait for that before
      // proceeding so the SDK round-trip is fully done.
      await page.waitForURL((url) => !url.pathname.startsWith("/dashboard"), {
        timeout: 10_000,
      });

      // Belt-and-suspenders: wipe any residual cookies and storage so no stale
      // Clerk token can silently restore the session on the next navigation.
      await context.clearCookies();
      await page.evaluate(() => {
        localStorage.clear();
        sessionStorage.clear();
      });

      // Navigate to the protected route — Clerk middleware must redirect to
      // /sign-in because there is no valid session.
      await page.goto("/dashboard");
      await expect(page).toHaveURL(/\/sign-in/, { timeout: 10_000 });
    });
  });
});
