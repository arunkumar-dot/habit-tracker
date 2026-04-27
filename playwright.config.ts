/**
 * Playwright configuration for HabitFlow e2e smoke tests.
 *
 * ENV VARS REQUIRED (for CI — run `npm run test:e2e` locally with these set):
 *   PLAYWRIGHT_BASE_URL          — base URL of the running app (default: http://localhost:3000)
 *   E2E_CLERK_USER_EMAIL         — email of a dedicated test user in your Clerk *test* instance
 *   CLERK_SECRET_KEY             — Clerk secret key (sk_test_…) — used to create sign-in tokens via Clerk Backend API
 *   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY — Clerk publishable key (pk_test_…) for the test environment
 *   NEXT_PUBLIC_CONVEX_URL       — Convex deployment URL (test or dev deployment)
 *
 * Adding CI later is a 10-minute job: set those env vars as secrets and add a
 * workflow that runs `npm run test:e2e` after `npm run build && npm run start`.
 * Note: CI not yet configured — run `npm run test:e2e` locally before pushing
 * changes that touch core flows (auth, habit CRUD, navigation, pomodoro, journal).
 */

import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,

  // Fail fast in CI if `.only` was accidentally committed
  forbidOnly: !!process.env.CI,

  // Retry flaky tests twice on CI; no retries locally
  retries: process.env.CI ? 2 : 0,

  // Convex dev deployments get unhappy under heavy parallelism
  workers: process.env.CI ? 1 : undefined,

  // GitHub Actions annotations in CI; rich HTML report locally
  reporter: process.env.CI ? "github" : "html",

  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL ?? "http://localhost:3000",

    // Capture traces on first retry (helps diagnose CI failures)
    trace: "on-first-retry",

    // Screenshot only when a test fails — keeps the report lean
    screenshot: "only-on-failure",
  },

  projects: [
    // ── 1. Auth setup — runs once before all tests ─────────────────────────
    {
      name: "setup",
      testMatch: "**/global.setup.ts",
    },

    // ── 2. Main smoke suite — Chromium only for now ────────────────────────
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        // Every test starts already signed in
        storageState: "e2e/.auth/user.json",
      },
      dependencies: ["setup"],
    },
  ],

  // Start the dev server automatically; reuse an existing one locally
  webServer: {
    command: "npm run dev",
    url: process.env.PLAYWRIGHT_BASE_URL ?? "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
