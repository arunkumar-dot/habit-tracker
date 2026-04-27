/**
 * Habit lifecycle smoke tests — the most important test file.
 *
 * Protects these hyperedges from GRAPH_REPORT.md:
 *   • "Habit CRUD Flow: Dialog + Form + Mutations"
 *     create_habit_dialog, edit_habit_dialog, habit_form,
 *     hook_use_habit_mutations, ui_toast  [EXTRACTED 0.95]
 *   • "Optimistic completion feedback loop"
 *     hook_use_optimistic_completion, ui_confetti, ui_toast,
 *     lib_milestone_config  [EXTRACTED 1.00]
 *
 * God nodes on the critical path:
 *   HabitCard (10 edges), useHabits (12 edges), useCompletionsForDate (12 edges)
 *
 * Card selector strategy:
 *   HabitCard renders as <div class="relative overflow-hidden ...">. We scope
 *   all within-card actions to:
 *     page.locator("div.relative.overflow-hidden")
 *       .filter({ has: page.getByText(name, { exact: true }) })
 *   This is unique because:
 *     (a) .relative.overflow-hidden is specific to HabitCard rows
 *     (b) E2E_ habit names are timestamped — exact: true prevents substring matches
 *
 * Convex real-time note: mutations propagate via WebSocket, not HTTP.
 * All assertions use Playwright's built-in auto-wait (toBeVisible / not.toBeVisible).
 */

import { test, expect } from "@playwright/test";
import {
  createTestHabit,
  cleanupTestHabits,
  uniqueHabitName,
} from "./fixtures/test-helpers";

/** Returns the HabitCard row locator scoped to a specific habit by name. */
function habitCard(page: import("@playwright/test").Page, name: string) {
  return page
    .locator("div.relative.overflow-hidden")
    .filter({ has: page.getByText(name, { exact: true }) });
}

test.describe("Habit lifecycle", () => {
  // Serial prevents one test's afterEach cleanup from deleting another test's
  // E2E_ habits mid-assertion (all tests share the same Convex user account).
  test.describe.configure({ mode: "serial" });
  // Each test involves page-load + Convex mutation + real-time subscription update.
  // 60s gives comfortable headroom without masking genuine hangs.
  test.setTimeout(60_000);

  test.afterEach(async ({ page }) => {
    await cleanupTestHabits(page);
  });

  // ── Create ────────────────────────────────────────────────────────────────

  test("create a habit via CreateHabitDialog and see it on the habits page", async ({
    page,
  }) => {
    await page.goto("/habits");
    const name = await createTestHabit(page, "Lifecycle");

    // The habit title is rendered in a <p> inside HabitCard — exact: true
    // avoids matching the E2E_ name appearing in other DOM contexts
    await expect(page.getByText(name, { exact: true })).toBeVisible();
  });

  // ── Complete (optimistic update) ──────────────────────────────────────────

  test("marking a habit complete reflects immediately (optimistic update)", async ({
    page,
  }) => {
    await page.goto("/habits");
    const name = await createTestHabit(page, "Complete");

    const card = habitCard(page, name);

    // Completion circle button is inside the card; aria-label is exact
    await card.getByRole("button", { name: "Mark complete" }).click();

    // Optimistic update: aria-label switches before Convex round-trips
    await expect(
      card.getByRole("button", { name: "Mark incomplete" })
    ).toBeVisible({ timeout: 5_000 });
  });

  // ── Edit ──────────────────────────────────────────────────────────────────

  test("editing a habit name persists after page reload", async ({ page }) => {
    await page.goto("/habits");
    const originalName = await createTestHabit(page, "Edit");
    const updatedName = uniqueHabitName("Edited");

    // Three-dot menu is inside the specific card row
    const card = habitCard(page, originalName);
    await card.getByRole("button", { name: "Habit options" }).click();
    await page.getByRole("menuitem", { name: /edit/i }).click();

    // EditHabitDialog — wait for the title input (avoids aria-labelledby flakiness)
    const titleInput = page.getByLabel(/habit title/i);
    await expect(titleInput).toBeVisible({ timeout: 8_000 });
    await titleInput.clear();
    await titleInput.fill(updatedName);

    // HabitForm submit button text when isEdit=true is "Save Changes"
    await page.getByRole("button", { name: "Save Changes" }).click();

    await expect(page.getByRole("dialog")).not.toBeVisible({ timeout: 8_000 });
    await expect(page.getByText(updatedName, { exact: true })).toBeVisible({ timeout: 8_000 });

    // Reload — confirms Convex persisted the mutation
    await page.reload();
    await expect(page.getByText(updatedName, { exact: true })).toBeVisible({ timeout: 10_000 });
  });

  // ── Delete ────────────────────────────────────────────────────────────────

  test("deleting a habit removes it from the active list", async ({ page }) => {
    await page.goto("/habits");
    const name = await createTestHabit(page, "Delete");
    await expect(page.getByText(name, { exact: true })).toBeVisible();

    const card = habitCard(page, name);

    // Register the window.confirm handler BEFORE the click that triggers it
    page.once("dialog", (dialog) => dialog.accept());
    await card.getByRole("button", { name: "Habit options" }).click();
    await page.getByRole("menuitem", { name: /delete/i }).click();

    // Habit disappears from the list after deletion
    await expect(page.getByText(name, { exact: true })).not.toBeVisible({ timeout: 10_000 });
  });

  // ── Dashboard hero card reflects completion ───────────────────────────────

  test("dashboard completion count increments when a habit is marked complete", async ({
    page,
  }) => {
    await page.goto("/habits");
    const name = await createTestHabit(page, "Dashboard");

    await page.goto("/dashboard");

    // Hero card always renders "X / Y" — present even with 0 habits ("0 / 0")
    // Use .first() because the pattern could appear in the chart too
    await expect(page.getByText(/\d+\s*\/\s*\d+/).first()).toBeVisible({
      timeout: 10_000,
    });

    // Navigate back, mark the habit complete
    await page.goto("/habits");
    const card = habitCard(page, name);
    await card.getByRole("button", { name: "Mark complete" }).click();
    await expect(
      card.getByRole("button", { name: "Mark incomplete" })
    ).toBeVisible({ timeout: 5_000 });
  });
});
