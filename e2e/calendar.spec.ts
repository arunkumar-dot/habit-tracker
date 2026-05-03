/**
 * Calendar page structural tests.
 *
 * Verifies the three-section calendar redesign:
 *   1. MonthGrid      (data-testid="month-grid")
 *   2. DayDetailPanel (data-testid="day-detail-panel")
 *   3. MonthStats     (data-testid="month-stats")
 *
 * Strategy:
 *   - Does NOT assert specific data (completions, journal text) — just structure
 *   - Asserts today's formatted date appears in the detail panel heading by default
 *   - Clicks yesterday's cell (if it exists in the grid) and asserts the heading updates
 *   - No test data setup required — the structural assertions pass even with zero habits
 */

import { test, expect } from "@playwright/test";

/** Returns "Sunday, April 27, 2026" style from an ISO string */
function formatHeading(dateStr: string): string {
  return new Date(dateStr + "T00:00:00").toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

/** Returns today's ISO date string YYYY-MM-DD */
function todayISO(): string {
  return new Date().toLocaleDateString("en-CA");
}

/** Returns yesterday's ISO date string YYYY-MM-DD */
function yesterdayISO(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toLocaleDateString("en-CA");
}

test.describe("Calendar page", () => {
  test("renders all three sections", async ({ page }) => {
    await page.goto("/calendar");
    await expect(page.locator("main")).toBeVisible({ timeout: 12_000 });

    // All three sections present
    await expect(page.getByTestId("month-grid")).toBeVisible({ timeout: 12_000 });
    await expect(page.getByTestId("day-detail-panel")).toBeVisible({ timeout: 12_000 });
    await expect(page.getByTestId("month-stats")).toBeVisible({ timeout: 12_000 });

    // No error boundary
    await expect(
      page.getByRole("heading", { name: /something went wrong/i })
    ).not.toBeVisible();
  });

  test("detail panel defaults to today's date heading", async ({ page }) => {
    await page.goto("/calendar");
    await expect(page.getByTestId("day-detail-panel")).toBeVisible({ timeout: 12_000 });

    const todayHeading = formatHeading(todayISO());
    await expect(
      page.getByTestId("day-detail-panel").getByText(todayHeading)
    ).toBeVisible({ timeout: 8_000 });
  });

  test("clicking yesterday updates the detail panel heading", async ({ page }) => {
    await page.goto("/calendar");
    await expect(page.getByTestId("month-grid")).toBeVisible({ timeout: 12_000 });

    const yesterdayStr = yesterdayISO();
    const yesterdayCell = page
      .getByTestId("month-grid")
      .locator(`button[data-date="${yesterdayStr}"]`);

    // Only proceed if yesterday is in the current month grid
    const cellCount = await yesterdayCell.count();
    if (cellCount === 0) {
      test.skip();
      return;
    }

    await yesterdayCell.click();

    const yesterdayHeading = formatHeading(yesterdayStr);
    await expect(
      page.getByTestId("day-detail-panel").getByText(yesterdayHeading)
    ).toBeVisible({ timeout: 8_000 });
  });
});
