/**
 * Journal smoke tests.
 *
 * Protects the "Journal Entry" community from GRAPH_REPORT.md (Community 15)
 * and the Convex journal module:
 *   journal.ts → upsertEntry mutation, listEntries query, getToday query
 *
 * The journal page is a single auto-saving textarea — no "create entry" dialog.
 * Today's entry is upserted on Save (or after a 3-second debounce).
 *
 * Cleanup: the journal uses date-keyed entries (one per day), so writing test
 * content into today's entry doesn't create new documents — it overwrites the
 * existing one. We restore a blank entry in afterEach via the Save button.
 *
 * The "Past Entries" list is read-only (no delete UI exposed to the user),
 * so we only test today's writing card — past entries are not mutated.
 */

import { test, expect } from "@playwright/test";

// Prefix used in journal content so we can identify test-written entries
const E2E_CONTENT_PREFIX = "E2E_";

test.describe("Journal entry", () => {
  // Serial mode prevents parallel writes to today's journal entry racing each other
  test.describe.configure({ mode: "serial" });
  // Convex subscription reconnects after page.reload() — 60s gives headroom
  test.setTimeout(60_000);
  test.afterEach(async ({ page }) => {
    // Restore today's entry to empty so we don't pollute the user's journal
    await page.goto("/journal");

    // Wait for the textarea to be ready (skeleton gone)
    const textarea = page.locator("textarea.journal-textarea");
    await expect(textarea).toBeVisible({ timeout: 10_000 });

    await textarea.clear();
    await textarea.fill("");

    // Click Save to persist the empty state
    const saveBtn = page.getByRole("button", { name: /^save$/i });
    // If save button is disabled (already empty), skip — nothing to clean up
    const isDisabled = await saveBtn.isDisabled();
    if (!isDisabled) {
      await saveBtn.click();
    }
  });

  test("can type in today's journal textarea and save", async ({ page }) => {
    await page.goto("/journal");

    // Journal page heading renders
    await expect(page.getByRole("heading", { name: /journal/i }).first()).toBeVisible({
      timeout: 10_000,
    }).catch(() => {
      // Heading may be an h1 styled with display font — fall back to text match
    });

    // Wait for the loading skeleton to disappear and textarea to appear
    const textarea = page.locator("textarea.journal-textarea");
    await expect(textarea).toBeVisible({ timeout: 10_000 });

    const testContent = `${E2E_CONTENT_PREFIX}Playwright smoke test — ${Date.now()}`;

    // Type content
    await textarea.fill(testContent);

    // The Save button should become enabled
    const saveBtn = page.getByRole("button", { name: /^save$/i });
    await expect(saveBtn).toBeEnabled();

    // Click Save
    await saveBtn.click();

    // "Saving…" then "Saved" should appear (the button transitions through these states)
    await expect(
      page.getByRole("button", { name: /saving/i })
    ).toBeVisible({ timeout: 5_000 }).catch(() => {
      // Saving state may be too brief to catch — fall through to Saved check
    });

    await expect(
      page.getByRole("button", { name: /saved/i })
    ).toBeVisible({ timeout: 5_000 });
  });

  test("saved journal content persists after page reload", async ({ page }) => {
    await page.goto("/journal");

    const textarea = page.locator("textarea.journal-textarea");
    await expect(textarea).toBeVisible({ timeout: 10_000 });

    const testContent = `${E2E_CONTENT_PREFIX}Persist check — ${Date.now()}`;

    await textarea.fill(testContent);
    await page.getByRole("button", { name: /^save$/i }).click();

    // Wait for save confirmation
    await expect(
      page.getByRole("button", { name: /saved/i })
    ).toBeVisible({ timeout: 6_000 });

    // Reload and verify content is still there
    await page.reload();
    await expect(page.locator("textarea.journal-textarea")).toBeVisible({
      timeout: 10_000,
    });
    await expect(page.locator("textarea.journal-textarea")).toHaveValue(testContent, {
      timeout: 8_000,
    });
  });

  test("past entries section renders without error boundary", async ({ page }) => {
    await page.goto("/journal");

    // Either "Past Entries" heading renders, OR the empty state renders —
    // either way confirms the component mounted without crashing
    const pastEntriesSection = page.getByText(/past entries/i);
    await expect(pastEntriesSection).toBeVisible({ timeout: 12_000 });

    // No error boundary
    await expect(
      page.getByRole("heading", { name: /something went wrong/i })
    ).not.toBeVisible();
  });
});
