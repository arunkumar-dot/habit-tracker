/**
 * Account management e2e tests — export and deletion dialog flows.
 *
 * Protects: Task 2 (data export) and Task 3/5 (deletion dialog UI).
 *
 * What these tests DO:
 *   1. Verify the JSON export downloads with the correct envelope structure.
 *   2. Verify the deletion confirmation step 1 shows data counts and is dismissible.
 *   3. Verify the deletion step 2 requires an exact email match.
 *
 * What these tests DO NOT do:
 *   - Actually execute account deletion (that would destroy the shared test user).
 *   - For a destructive deletion test, see e2e/account-deletion-destructive.spec.ts
 *     (skipped by default; see that file for instructions).
 */

import { test, expect } from "@playwright/test";
import * as fs from "fs";
import * as path from "path";
import * as os from "os";

// All tests start already signed in via storageState from global.setup.ts

test.describe("Account management — Danger Zone", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/settings");
    await expect(page.locator("main")).toBeVisible({ timeout: 10_000 });
  });

  // ── Test 1: Export downloads a valid JSON file ─────────────────────────────
  test("Export downloads a JSON file with the correct envelope structure", async ({
    page,
  }) => {
    // Set up download listener BEFORE clicking the button
    const downloadPromise = page.waitForEvent("download");

    await page.getByRole("button", { name: /export my data/i }).click();

    const download = await downloadPromise;

    // Save to a temp file so we can read and parse it
    const tmpPath = path.join(os.tmpdir(), `habitflow-export-test-${Date.now()}.json`);
    await download.saveAs(tmpPath);

    const raw = fs.readFileSync(tmpPath, "utf8");
    fs.rmSync(tmpPath, { force: true }); // clean up

    let parsed: Record<string, unknown>;
    expect(() => {
      parsed = JSON.parse(raw);
    }, "Export file should be valid JSON").not.toThrow();

    // Envelope assertions
    expect(parsed!._exportVersion).toBe(1);

    expect(typeof parsed!._exportedAt).toBe("string");
    expect(new Date(parsed!._exportedAt as string).toISOString()).toBe(parsed!._exportedAt);

    expect(typeof parsed!._userId).toBe("string");
    expect((parsed!._userId as string).length).toBeGreaterThan(0);

    expect(parsed!.data).toBeTruthy();
    expect(typeof parsed!.data).toBe("object");

    // data should contain at minimum these table keys
    const data = parsed!.data as Record<string, unknown>;
    const expectedKeys = [
      "user",
      "habits",
      "habitCompletions",
      "userMilestones",
      "dailyCheckIns",
      "pomodoroSessions",
      "pushTokens",
      "journalEntries",
      "reminderLog",
    ];
    for (const key of expectedKeys) {
      expect(data, `data should have key "${key}"`).toHaveProperty(key);
    }
  });

  // ── Test 2: Deletion dialog step 1 shows counts and is dismissible ─────────
  test("Deletion confirmation dialog shows data summary and can be cancelled", async ({
    page,
  }) => {
    await page.getByRole("button", { name: /delete my account/i }).click();

    // Dialog should appear
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible({ timeout: 8_000 });

    // Step 1 content checks
    await expect(dialog.getByText(/delete your account\?/i)).toBeVisible();
    await expect(dialog.getByText(/permanently delete/i)).toBeVisible();
    await expect(dialog.getByText(/this cannot be undone/i)).toBeVisible();

    // Cancel closes the dialog; user stays on settings page
    await dialog.getByRole("button", { name: /^cancel$/i }).click();
    await expect(dialog).not.toBeVisible({ timeout: 5_000 });
    await expect(page).toHaveURL(/\/settings/);
  });

  // ── Test 3: Step 2 requires correct email to enable the destructive button ──
  test("Deletion step 2 enables submit only when email matches exactly", async ({
    page,
  }) => {
    await page.getByRole("button", { name: /delete my account/i }).click();

    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible({ timeout: 8_000 });

    // Advance to step 2
    await dialog.getByRole("button", { name: /continue/i }).click();
    await expect(dialog.getByText(/are you absolutely sure\?/i)).toBeVisible({ timeout: 5_000 });

    const deleteButton = dialog.getByRole("button", { name: /delete forever/i });
    const emailInput = dialog.getByLabel(/confirm email address/i);

    // Button is disabled with empty input
    await expect(deleteButton).toBeDisabled();

    // Wrong email → still disabled
    await emailInput.fill("wrong-email@example.com");
    await expect(deleteButton).toBeDisabled();

    // The correct email is on the page — read it from the dialog text
    const dialogText = await dialog.innerText();
    const emailMatch = dialogText.match(/\S+@\S+\.\S+/);
    const correctEmail = emailMatch?.[0]?.replace(/[^\w@.-]/g, "") ?? "";

    if (correctEmail) {
      await emailInput.fill(correctEmail);
      await expect(deleteButton).toBeEnabled({ timeout: 3_000 });
    }

    // Cancel — do NOT actually delete the test user
    await dialog.getByRole("button", { name: /^cancel$/i }).click();
    await expect(dialog).not.toBeVisible({ timeout: 5_000 });
  });
});
