/**
 * Navigation smoke tests — cheapest regression guard.
 *
 * Protects the "Dashboard data layer" hyperedge from GRAPH_REPORT.md:
 *   hook_use_habits, hook_use_completions → habits_page, dashboard_page,
 *   calendar_page, analytics_page, journal_page  [INFERRED 0.85]
 *
 * Also protects the "Global provider stack" hyperedge:
 *   ClerkProvider > ConvexClientProvider > ThemeProvider > ToastProvider
 *   > ConfettiProvider > NotificationProvider  [EXTRACTED 1.00]
 *
 * God nodes on the critical path:
 *   DashboardPage (14 edges), useHabits (12 edges), useCompletionsForDate (12 edges)
 *
 * Strategy: visit every dashboard route and assert that:
 *   1. The page renders (<main> visible — DashboardLayout always wraps children)
 *   2. No error boundary has taken over (no "Something went wrong" heading)
 *   3. No unhandled JS errors are logged to the console
 *
 * Each test should complete in under 10 seconds — this entire file in < 60s.
 */

import { test, expect } from "@playwright/test";

// Routes to visit. Landmark is a heading-level text unique to each page used
// to confirm the page actually rendered its own content (not just <main>).
// All use getByRole('heading') so they're not confused by body copy or SVG text.
const ROUTES = [
  {
    path: "/dashboard",
    // DashboardPage has no explicit <h1> — verify via <main> only (see below)
    headingPattern: null,
  },
  {
    path: "/habits",
    headingPattern: /my habits/i,   // PageHeader h1 on HabitsPage
  },
  {
    path: "/calendar",
    headingPattern: /calendar/i,
  },
  {
    path: "/analytics",
    headingPattern: /analytics/i,
  },
  {
    path: "/journal",
    headingPattern: /journal/i,
  },
  {
    path: "/profile",
    headingPattern: /profile/i,
  },
] as const;

// Known pre-existing console messages that are NOT regressions:
//   • React warns about <style> tags rendered inside components (journal/page.tsx,
//     possibly others). This fires on initial load and is a codebase convention,
//     not an error boundary or crash.
//   • Firebase / FCM noise during service-worker registration
//   • ResizeObserver benign loop notifications
const KNOWN_NOISE = [
  "script tag",           // "Encountered a script tag while rendering React component"
  "Warning:",
  "FCM",
  "firebase",
  "ResizeObserver",
];

function isCritical(msg: string): boolean {
  return !KNOWN_NOISE.some((pattern) => msg.includes(pattern));
}

test.describe("Dashboard navigation", () => {
  for (const { path, headingPattern } of ROUTES) {
    test(`${path} renders without error boundary`, async ({ page }) => {
      const consoleErrors: string[] = [];
      page.on("console", (msg) => {
        if (msg.type() === "error") consoleErrors.push(msg.text());
      });

      await page.goto(path);

      // Page should stay on the requested route (no auth redirect)
      await expect(page).toHaveURL(new RegExp(path.replace("/", "\\/")));

      // The DashboardLayout <main> element is always present when auth passed
      // and no top-level crash occurred
      await expect(page.locator("main")).toBeVisible({ timeout: 12_000 });

      // Page-specific heading — confirms the page's own content rendered
      if (headingPattern) {
        await expect(
          page.getByRole("heading", { name: headingPattern }).first()
        ).toBeVisible({ timeout: 12_000 });
      }

      // No error boundary
      await expect(
        page.getByRole("heading", { name: /something went wrong/i })
      ).not.toBeVisible();

      // No unhandled JS errors (after filtering known pre-existing noise)
      const criticalErrors = consoleErrors.filter(isCritical);
      expect(
        criticalErrors,
        `Unhandled console errors on ${path}:\n${criticalErrors.join("\n")}`
      ).toHaveLength(0);
    });
  }
});
