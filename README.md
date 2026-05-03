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
| `e2e/admin-reminders.spec.ts` | FCM cron hardening (idempotency, error isolation) | reminderLog, devTriggerReminders |

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

## Account deletion and data export

Accessible from **Settings → Danger Zone** (`/settings`).

### What gets exported

A single JSON file (`habitflow-export-YYYY-MM-DD.json`) with schema version 1:

```json
{
  "_exportVersion": 1,
  "_exportedAt": "<ISO timestamp>",
  "_userId": "<Clerk user ID>",
  "data": {
    "user": { ... },
    "habits": [ ... ],
    "habitCompletions": [ ... ],
    "userMilestones": [ ... ],
    "dailyCheckIns": [ ... ],
    "pomodoroSessions": [ ... ],
    "pushTokens": [ ... ],
    "journalEntries": [ ... ],
    "reminderLog": [ ... ]
  }
}
```

The export is generated on demand by the Convex HTTP action `GET /export-user-data`
(registered in `convex/http.ts`). No file is stored — the response streams directly
to the browser.

### What gets deleted

Account deletion is **permanent and immediate**. There is no recovery window.
The following are hard-deleted in this order:

1. `reminderLog` rows
2. `pushTokens` rows
3. `pomodoroSessions` rows
4. `dailyCheckIns` rows
5. `journalEntries` rows
6. `userMilestones` rows
7. `habitCompletions` rows
8. `habits` rows
9. Convex `_storage` blob (profile image, if one was uploaded)
10. `users` row
11. Clerk user record (via Clerk Admin API)

If the Clerk user deletion fails (network error, API outage), the Convex data
is already gone. The error is logged to Sentry but not surfaced to the user.
Their next sign-in attempt would create a fresh Convex user row.

### Convex environment variable required

Account deletion calls the Clerk Admin REST API. Set `CLERK_SECRET_KEY` in
Convex's environment (separate from `.env.local`):

```bash
npx convex env set CLERK_SECRET_KEY sk_test_...
```

### For developers: testing deletion locally

The destructive deletion test is skipped by default. To run it manually with
an ephemeral Clerk test user:

```bash
RUN_DESTRUCTIVE_TESTS=1 npm run test:e2e -- e2e/account-deletion-destructive.spec.ts
```

See `e2e/account-deletion-destructive.spec.ts` for full prerequisites and setup.

## FCM Cron Testing

The habit reminder cron (`sendHabitReminders`, fires every minute) is hardened
with idempotency, error isolation, and a dev-only manual trigger.

### Manual trigger — `/admin/reminders` page

Navigate to [http://localhost:3000/admin/reminders](http://localhost:3000/admin/reminders)
in development. Two independent guards protect this page:

- **Next.js page** returns 404 when `NODE_ENV === "production"` — the page never renders in a production build.
- **Convex actions** (`devTriggerReminders`, `triggerRemindersNow`) throw unless `ALLOW_DEV_TRIGGERS === "true"` is set in the Convex deployment's env vars. Convex always runs with `NODE_ENV=production` internally, so the Next.js env is not a reliable gate at the Convex layer — this explicit flag is.

Three buttons are available:

| Button | What it does |
|--------|-------------|
| **Dry Run** | Walks through the scan logic and logs what *would* be sent, but makes no FCM calls and writes no `reminderLog` entries. |
| **Mock Send** | Skips FCM entirely and treats every send as successful. **Does** write `reminderLog` entries — use this to test idempotency without real Firebase credentials. |
| **Real Send** | Calls FCM for real. Requires `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, and `FIREBASE_PRIVATE_KEY` to be set in Convex env vars (see below). |

The bottom of the page shows the last 20 `reminderLog` entries so you can
confirm what fired and what was skipped.

### Verifying idempotency

1. Click **Mock Send** once — entries appear in the log table.
2. Click **Mock Send** again immediately — the row count must not increase.
   The idempotency check (`wasReminderSent`) finds the existing `sent`/`stale_token`
   row in `reminderLog` and skips the re-send.

### Setting Convex env vars

All of these must be set in Convex (not `.env.local`) because Convex actions
run in an isolated runtime that only sees Convex env vars.

**Enable the manual trigger in dev:**

```bash
npx convex env set ALLOW_DEV_TRIGGERS true
```

> **Do not set `ALLOW_DEV_TRIGGERS` in your production Convex deployment.**
> Even if the flag were accidentally set, the Next.js page additionally hides
> itself when `NODE_ENV=production`, so the UI would never expose the buttons.

**Firebase credentials (required for Real Send and the production cron):**

```bash
npx convex env set FIREBASE_PROJECT_ID  your-project-id
npx convex env set FIREBASE_CLIENT_EMAIL service-account@your-project.iam.gserviceaccount.com
npx convex env set FIREBASE_PRIVATE_KEY  "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

The private key must use literal `\n` escape sequences (not actual newlines)
when stored via `npx convex env set`. The cron unescapes them at runtime.

### reminderLog table

| Field | Purpose |
|-------|---------|
| `habitId` + `date` + `timeSlot` + `pushTokenId` | Idempotency key (index: `by_habit_date_slot_token`) |
| `outcome` | `sent` / `stale_token` / `error` — only `sent` and `stale_token` block re-sends |
| `sentAt` | Timestamp for the admin UI |

Rows are cleaned up automatically at 3 AM UTC daily (7-day retention) via
the `cleanup-reminder-logs` cron registered in `convex/crons.ts`.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
