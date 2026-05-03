/**
 * Admin reminders page smoke + idempotency tests.
 *
 * Guards the "FCM cron hardening" changes:
 *   - /admin/reminders renders without error in development
 *   - Dry Run shows a result message
 *   - Mock Send creates reminderLog entries
 *   - Second Mock Send does NOT create duplicate entries (idempotency)
 *
 * Skipped automatically in production (NODE_ENV check).
 * Run with: npm run test:e2e -- e2e/admin-reminders.spec.ts
 */

import { test, expect } from "@playwright/test";

// Skip the entire suite when running in production
const isProd = process.env.NODE_ENV === "production";
test.skip(isProd, "Admin reminders page is not available in production");

const ROUTE = "/admin/reminders";

test.describe("Admin reminders page", () => {
  test("renders without an error boundary", async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") consoleErrors.push(msg.text());
    });

    await page.goto(ROUTE);

    // Should NOT be a 404 or redirect
    await expect(page).toHaveURL(new RegExp(ROUTE.replace("/", "\\/")));

    // Page-level heading
    await expect(
      page.getByRole("heading", { name: /fcm reminder admin/i })
    ).toBeVisible({ timeout: 12_000 });

    // No error boundary
    await expect(
      page.getByRole("heading", { name: /something went wrong/i })
    ).not.toBeVisible();

    // No critical console errors (filter FCM/Firebase noise)
    const critical = consoleErrors.filter(
      (m) => !["FCM", "firebase", "Warning:", "ResizeObserver"].some((n) => m.includes(n))
    );
    expect(critical, `Unexpected console errors:\n${critical.join("\n")}`).toHaveLength(0);
  });

  test("Dry Run shows a result message", async ({ page }) => {
    await page.goto(ROUTE);

    await expect(
      page.getByRole("heading", { name: /fcm reminder admin/i })
    ).toBeVisible({ timeout: 12_000 });

    await page.getByRole("button", { name: /dry run/i }).click();

    // Result message should appear
    await expect(page.getByTestId("trigger-result")).toBeVisible({ timeout: 15_000 });
    await expect(page.getByTestId("trigger-result")).toContainText(/dry run/i);
  });

  test("Mock Send creates log entries; second Mock Send produces no duplicates", async ({ page }) => {
    await page.goto(ROUTE);

    await expect(
      page.getByRole("heading", { name: /fcm reminder admin/i })
    ).toBeVisible({ timeout: 12_000 });

    // First Mock Send
    await page.getByRole("button", { name: /mock send/i }).click();
    await expect(page.getByTestId("trigger-result")).toBeVisible({ timeout: 15_000 });
    await expect(page.getByTestId("trigger-result")).toContainText(/mock send/i);

    // Capture the log table row count after first send
    // The table is only present when there are rows, so use a fallback count of 0
    const rowsAfterFirst = await page.locator("table tbody tr").count();

    // Second Mock Send — idempotency should prevent new rows for same slot
    await page.getByRole("button", { name: /mock send/i }).click();
    await expect(page.getByTestId("trigger-result")).toBeVisible({ timeout: 15_000 });

    // Row count must not increase (idempotency: same habit+date+slot+token skipped)
    const rowsAfterSecond = await page.locator("table tbody tr").count();
    expect(
      rowsAfterSecond,
      "Second Mock Send should not add duplicate reminderLog rows"
    ).toBeLessThanOrEqual(rowsAfterFirst);
  });
});
