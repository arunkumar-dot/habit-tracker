This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## End-to-End Tests (Playwright)

> CI not yet configured — run `npm run test:e2e` locally before pushing changes
> that touch core flows (auth, habit CRUD, navigation, pomodoro, journal).

### Prerequisites

1. **Clerk test instance** — create a dedicated test user in your Clerk *test* environment (never the production instance).
2. **Environment variables** — copy `.env.local` and add:

```bash
# Clerk test instance keys (use sk_test_… / pk_test_…)
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...

# Dedicated e2e test user (must exist in your Clerk test instance)
# No password needed — Clerk Backend API creates a sign-in token from the email alone
E2E_CLERK_USER_EMAIL=testuser@gmail.com

# Convex dev deployment URL
NEXT_PUBLIC_CONVEX_URL=https://your-deployment.convex.cloud
```

### Running tests locally

```bash
# Run the full suite (headless, reuses existing dev server if running)
npm run test:e2e

# Interactive UI mode — great for debugging, step-through, timeline view
npm run test:e2e:ui

# Headed mode — watch Chromium execute the tests
npm run test:e2e:headed
```

### What's tested

| File | Hyperedge protected | Critical god nodes |
|------|--------------------|--------------------|
| `e2e/auth.spec.ts` | Authentication flow | DashboardPage, Clerk |
| `e2e/habit-lifecycle.spec.ts` | Habit CRUD Flow + Optimistic completion loop | HabitCard, useHabits, useOptimisticCompletion |
| `e2e/navigation.spec.ts` | Dashboard data layer, Global provider stack | DashboardPage, useHabits |
| `e2e/pomodoro.spec.ts` | Pomodoro UI system | usePomodoro |
| `e2e/journal.spec.ts` | Journal Entry module | upsertEntry, listEntries |

### Debugging a failing test

```bash
# View the HTML report after a run (opens in browser)
npx playwright show-report

# Re-run a single file with trace recording enabled
npx playwright test e2e/habit-lifecycle.spec.ts --trace on

# Open a trace zip (shows screenshots + network + DOM snapshots)
npx playwright show-trace test-results/<test-name>/trace.zip
```

### Test data isolation

Tests that create habits prefix their names with `E2E_`. After each test,
`cleanupTestHabits()` calls `/api/dev/cleanup-test-data` which runs the
`deleteTestHabits` Convex mutation (hard-blocked in production) to bulk-delete
all `E2E_` prefixed habits in under 100ms.

### Adding CI later

Set the env vars above as CI secrets and add a workflow step:

```yaml
- run: npm run test:e2e
  env:
    PLAYWRIGHT_BASE_URL: http://localhost:3000
    CI: true
    # ... all vars listed in playwright.config.ts header
```

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
