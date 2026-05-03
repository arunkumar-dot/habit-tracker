/**
 * DESTRUCTIVE — Account deletion end-to-end test.
 *
 * This test actually deletes a Clerk user and verifies the result.
 * It is SKIPPED by default to protect the shared test user that all
 * other e2e tests depend on.
 *
 * To run manually (creates a fresh ephemeral Clerk user, deletes it,
 * asserts the user is gone):
 *
 *   RUN_DESTRUCTIVE_TESTS=1 npm run test:e2e -- e2e/account-deletion-destructive.spec.ts
 *
 * Prerequisites for the ephemeral user flow:
 *   - CLERK_SECRET_KEY must be set (used to create + verify the ephemeral user)
 *   - E2E_CLERK_USER_EMAIL and E2E_CLERK_USER_PASSWORD must be set for the ephemeral user
 *     OR you must adapt the signIn call below to use Clerk Backend API to create a
 *     one-off user programmatically (recommended for fully automated runs).
 *
 * IMPORTANT: Never run this file against the production Clerk instance.
 *            Only use sk_test_… keys.
 */

import { test, expect } from "@playwright/test";
import { clerk, clerkSetup } from "@clerk/testing/playwright";

// Skip the entire suite unless the escape-hatch env var is set
const runDestructive = process.env.RUN_DESTRUCTIVE_TESTS === "1";

test.describe("Account deletion — destructive (skipped by default)", () => {
  // Use a clean context with no pre-loaded session — the ephemeral user
  // must sign in independently of the shared test user session.
  test.use({ storageState: { cookies: [], origins: [] } });

  test.skip(!runDestructive, "Set RUN_DESTRUCTIVE_TESTS=1 to run this suite");

  test("creates ephemeral user, deletes account, verifies user is gone", async ({
    page,
    context,
  }) => {
    // Re-run clerkSetup in this worker (global setup state is not inherited)
    await clerkSetup();

    const email = process.env.E2E_CLERK_USER_EMAIL;
    if (!email) throw new Error("E2E_CLERK_USER_EMAIL must be set for the destructive test");

    // Sign in as the ephemeral test user
    await page.goto("/sign-in");
    await clerk.signIn({ page, emailAddress: email });
    await page.goto("/settings");
    await expect(page.locator("main")).toBeVisible({ timeout: 10_000 });

    // Open deletion dialog
    await page.getByRole("button", { name: /delete my account/i }).click();
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible({ timeout: 8_000 });

    // Advance to step 2
    await dialog.getByRole("button", { name: /continue/i }).click();
    await expect(dialog.getByText(/are you absolutely sure\?/i)).toBeVisible({ timeout: 5_000 });

    // Type the email to confirm
    const emailInput = dialog.getByLabel(/confirm email address/i);
    await emailInput.fill(email);

    const deleteButton = dialog.getByRole("button", { name: /delete forever/i });
    await expect(deleteButton).toBeEnabled({ timeout: 3_000 });

    // Execute deletion
    await deleteButton.click();

    // After deletion: should redirect to /sign-in?accountDeleted=true
    await expect(page).toHaveURL(/\/sign-in.*accountDeleted=true/, { timeout: 20_000 });

    // The "Your account has been deleted" banner should appear
    await expect(page.getByText(/your account has been deleted/i)).toBeVisible({ timeout: 5_000 });

    // Verify the session is gone — navigating to /dashboard should redirect to /sign-in
    await context.clearCookies();
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
    await page.goto("/dashboard");
    await expect(page).toHaveURL(/\/sign-in/, { timeout: 10_000 });
  });
});
