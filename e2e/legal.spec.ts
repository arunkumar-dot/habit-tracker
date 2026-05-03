/**
 * Legal pages e2e tests.
 *
 * Covers:
 *   - /legal/privacy and /legal/terms load without authentication
 *   - Frontmatter title is visible on each page
 *   - Dashboard footer "Privacy" link navigates to /legal/privacy (signed-in context)
 *   - Sign-in page footer "Privacy" link navigates to /legal/privacy without triggering auth
 *
 * The unauthenticated tests use an empty storageState so they never carry
 * the shared user session — this is the same pattern used by auth.spec.ts
 * for its sign-out test.
 */

import { test, expect } from "@playwright/test";

// ── Unauthenticated access ────────────────────────────────────────────────────

test.describe("Legal pages — unauthenticated", () => {
  // Clear the shared signed-in session for these tests so they are truly public.
  test.use({ storageState: { cookies: [], origins: [] } });

  test("visits /legal/privacy without signing in — page loads and shows title", async ({
    page,
  }) => {
    await page.goto("/legal/privacy");

    // Must stay on /legal/privacy — no auth redirect
    await expect(page).toHaveURL(/\/legal\/privacy/);

    // Frontmatter title rendered by data-testid
    await expect(
      page.getByTestId("legal-page-title")
    ).toBeVisible({ timeout: 10_000 });

    await expect(
      page.getByTestId("legal-page-title")
    ).toHaveText(/privacy/i);
  });

  test("visits /legal/terms without signing in — page loads and shows title", async ({
    page,
  }) => {
    await page.goto("/legal/terms");

    await expect(page).toHaveURL(/\/legal\/terms/);

    await expect(
      page.getByTestId("legal-page-title")
    ).toBeVisible({ timeout: 10_000 });

    await expect(
      page.getByTestId("legal-page-title")
    ).toHaveText(/terms/i);
  });
});

// ── Authenticated — dashboard footer ─────────────────────────────────────────

test.describe("Legal pages — authenticated", () => {
  // Uses the shared storageState from global.setup.ts (signed-in user).

  test('dashboard footer "Privacy" link navigates to /legal/privacy', async ({
    page,
  }) => {
    await page.goto("/dashboard");
    await expect(page.locator("main")).toBeVisible({ timeout: 12_000 });

    // Footer is inside <main> — find the Privacy link
    const privacyLink = page
      .locator("main")
      .getByRole("link", { name: /privacy/i })
      .first();

    await expect(privacyLink).toBeVisible({ timeout: 8_000 });
    await privacyLink.click();

    await expect(page).toHaveURL(/\/legal\/privacy/, { timeout: 10_000 });
    await expect(page.getByTestId("legal-page-title")).toBeVisible();
  });
});

// ── Sign-in page footer ───────────────────────────────────────────────────────

test.describe("Legal pages — from sign-in page", () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test('sign-in page footer "Privacy" link navigates to /legal/privacy without auth redirect', async ({
    page,
  }) => {
    await page.goto("/sign-in");

    // The footer is rendered at the bottom of the auth layout
    const privacyLink = page
      .getByRole("link", { name: /privacy/i })
      .first();

    await expect(privacyLink).toBeVisible({ timeout: 8_000 });
    await privacyLink.click();

    // Must land on /legal/privacy — NOT be redirected to /sign-in
    await expect(page).toHaveURL(/\/legal\/privacy/, { timeout: 10_000 });
    await expect(page.getByTestId("legal-page-title")).toBeVisible();
  });
});
