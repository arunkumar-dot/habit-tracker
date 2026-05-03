/**
 * Dashboard interaction tests.
 *
 * Protects the new three-section dashboard structure introduced in the
 * "active control panel" redesign:
 *   1. UpNextCard   (data-testid="up-next-card")
 *   2. TodaysHabits (data-testid="todays-habits")
 *   3. WeeklyHeatmap(data-testid="weekly-heatmap")
 *
 * Strategy:
 *   - Creates a test habit via /habits so the dashboard has data to work with
 *   - Asserts structural presence of all three cards
 *   - Clicks the completion checkbox on the first uncompleted habit in
 *     Today's Habits and asserts the remaining count updates (or the "all done"
 *     message appears if that was the only habit)
 *   - Does NOT assert specific copy that may change — asserts structural behaviour
 *   - Cleans up test habits after the suite runs
 */

import { test, expect } from "@playwright/test";
import { createTestHabit, cleanupTestHabits } from "./fixtures/test-helpers";

test.describe("Dashboard structure", () => {
  test.afterEach(async ({ page }) => {
    await cleanupTestHabits(page);
  });

  test("renders all three sections", async ({ page }) => {
    // Ensure there is at least one habit so all three cards render
    await createTestHabit(page, "DashboardStructure");

    await page.goto("/dashboard");
    await expect(page.locator("main")).toBeVisible({ timeout: 12_000 });

    // All three cards must be present
    await expect(page.getByTestId("up-next-card")).toBeVisible({ timeout: 12_000 });
    await expect(page.getByTestId("todays-habits")).toBeVisible({ timeout: 12_000 });
    await expect(page.getByTestId("weekly-heatmap")).toBeVisible({ timeout: 12_000 });

    // No error boundary
    await expect(
      page.getByRole("heading", { name: /something went wrong/i })
    ).not.toBeVisible();
  });

  test("checking a habit updates the Today section", async ({ page }) => {
    await createTestHabit(page, "DashboardComplete");

    await page.goto("/dashboard");

    const todaysHabits = page.getByTestId("todays-habits");
    await expect(todaysHabits).toBeVisible({ timeout: 12_000 });

    // Read the "X of Y remaining" badge text before clicking
    const remainingBadge = todaysHabits.locator("span").filter({ hasText: /remaining/ }).first();
    const initialText = await remainingBadge.textContent({ timeout: 8_000 });
    // e.g. "1 of 1 remaining" — extract the leading number
    const initialCount = initialText ? parseInt(initialText.trim(), 10) : NaN;

    // Find the completion button (aria-label "Mark complete") in the Today section
    const firstCheckbox = todaysHabits
      .getByRole("button", { name: /mark complete/i })
      .first();
    await expect(firstCheckbox).toBeVisible({ timeout: 8_000 });
    await firstCheckbox.click();

    // After clicking, either:
    //   A) the remaining count decremented  (more than 1 habit)
    //   B) the "all done" / "everything today" message appeared (was the last habit)
    const allDoneMsg = todaysHabits.getByText(/completed everything today/i);
    const countDecremented = async () => {
      const newText = await remainingBadge.textContent({ timeout: 5_000 }).catch(() => null);
      if (!newText) return false;
      const newCount = parseInt(newText.trim(), 10);
      return !isNaN(initialCount) && !isNaN(newCount) && newCount < initialCount;
    };

    // Wait for one of the two outcomes
    await expect(async () => {
      const done = await allDoneMsg.isVisible();
      const decremented = await countDecremented();
      expect(done || decremented).toBe(true);
    }).toPass({ timeout: 8_000 });
  });
});
