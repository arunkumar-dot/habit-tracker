/**
 * Shared Playwright test helpers.
 *
 * createTestHabit  — creates a habit via the UI with a unique E2E_ name
 * cleanupTestHabits — bulk-deletes all E2E_ habits via the dev API route (Option B)
 *
 * Cleanup strategy: POST /api/dev/cleanup-test-data calls the Convex
 * deleteTestHabits mutation (gated to NODE_ENV !== "production").
 * This is ~100ms regardless of habit count — far faster than UI-based deletion.
 */

import type { Page } from "@playwright/test";
import { expect } from "@playwright/test";

// ── Unique name generator ─────────────────────────────────────────────────────

/**
 * Returns a unique habit name prefixed with E2E_ so the cleanup route can
 * identify and delete it. Format: E2E_<timestamp>_<4-char random hex>
 */
export function uniqueHabitName(label = "Habit"): string {
  const ts = Date.now();
  const rand = Math.floor(Math.random() * 0xffff)
    .toString(16)
    .padStart(4, "0");
  return `E2E_${label}_${ts}_${rand}`;
}

// ── Habit creation via the UI ─────────────────────────────────────────────────

/**
 * Opens the CreateHabitDialog from /habits, fills the form with a unique name,
 * submits, and waits for the habit to appear in the list.
 *
 * Returns the habit name so the caller can assert on it later.
 *
 * Assumes the page is already on /habits (or navigates there if not).
 */
export async function createTestHabit(page: Page, label = "Habit"): Promise<string> {
  const name = uniqueHabitName(label);

  // Ensure we're on the habits page
  if (!page.url().includes("/habits")) {
    await page.goto("/habits");
  }

  // Open the create dialog
  await page.getByRole("button", { name: /new habit/i }).click();

  // Wait for the title input to be visible (it lives inside the dialog).
  // Avoids relying on aria-labelledby resolution which can be flaky in JSDOM.
  const titleInput = page.getByLabel(/habit title/i);
  await expect(titleInput).toBeVisible({ timeout: 8_000 });
  await titleInput.fill(name);

  // Submit — button text is "Create Habit" in create mode
  await page.getByRole("button", { name: /create habit/i }).click();

  // Wait for dialog to close and the habit to appear in the list
  await expect(page.getByRole("dialog")).not.toBeVisible({ timeout: 8_000 });
  await expect(page.getByText(name)).toBeVisible({ timeout: 8_000 });

  return name;
}

// ── Bulk cleanup via API ──────────────────────────────────────────────────────

/**
 * Deletes all habits whose title starts with "E2E_" for the signed-in user.
 * Calls the dev-only API route which runs the Convex deleteTestHabits mutation.
 *
 * Safe to call even if no E2E_ habits exist (returns { deleted: 0 }).
 */
export async function cleanupTestHabits(page: Page): Promise<void> {
  const response = await page.request.post("/api/dev/cleanup-test-data");

  // A non-200 here means the route is misconfigured — surface it clearly
  if (!response.ok()) {
    const body = await response.text();
    throw new Error(
      `cleanupTestHabits: /api/dev/cleanup-test-data returned ${response.status()}: ${body}`
    );
  }
}
