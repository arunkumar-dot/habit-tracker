# HabitFlow — Project Plan & Progress Tracker

> Use this file to track progress across development sessions.
> Update checkbox status as each item is completed.

---

## Theme Refactor — Warm Minimal (see THEME_REFACTOR.md)

| Phase | Status | Notes |
|-------|--------|-------|
| Phase 1 — Design tokens | ✅ Done | globals.css rewritten; theme-provider & layout anti-flash script updated |
| Phase 2 — Typography | ✅ Done | Fonts loaded via next/font; type-scale utilities added; PageHeader, analytics stats, pomodoro timer, habit names, time labels updated |
| Phase 3 — Core components | ✅ Done | Button, Card, Input, Progress, HabitCompletionButton, HabitCard (color bar → dot), HabitFilters, Insights toggle, Topbar Clerk colors all updated |
| Phase 4 — Streak Ribbon | ✅ Done | Created components/ui/streak-ribbon.tsx; HabitStreakBadge and StreakSummary leaderboard updated |
| Phase 5 — Page-specific changes | ✅ Done | Milestones, Insights, Calendar, Dashboard, Profile, Pomodoro, Timeline pages updated; StreakSummary, InsightCard, MilestoneCard, ProfileForm, CityAutocomplete token cleanup |
| Phase 6 — Icon pass | ✅ Done | Milestone emoji icons → lucide (Sprout/Flame/Zap/Medal/Trophy/Star/Gem); habit-card swipe hints ✓/✏️ → Check/Pencil; milestone-card ✓ → Check; profile-form ✓ → Check; habit-milestone-hint updated |
| Phase 7 — Final polish | ✅ Done | Paper-grain texture on body; cap-first utility; pomodoro ring transition → 200ms; all indigo purged (charts, auth pages, badge variants, fallback colors, confetti, auth layout) |

---

## ⚠️ Hard Rules — Read Before Every Session

| Rule | Detail |
|------|--------|
| **NEVER install axios** | All HTTP is done via the native `fetch` API. Do not add axios under any circumstances — not as a dependency, not as a dev dependency, not as a transitive import. |
| Use `fetch` for all HTTP | Google OAuth2, FCM, and any future external API calls must use `fetch`. |

---

## Setup Instructions (First Time)

### 1. Prerequisites
- Node.js 18+
- npm 9+
- Git

### 2. Clone / Open the project
```bash
cd /Users/arunkumarkulkarni/Downloads/Dev/habit-tracker
npm install
```

### 3. Set up Clerk
1. Go to [dashboard.clerk.com](https://dashboard.clerk.com)
2. Create a new application (enable Email + Google sign-in)
3. Go to **Configure → Integrations** and enable the **Convex** integration
4. Copy your **Publishable Key** and **Secret Key**
5. Copy your **Frontend API URL** (e.g. `https://verb-noun-00.clerk.accounts.dev`)
6. Update `.env.local`:
   ```
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
   CLERK_SECRET_KEY=sk_test_...
   CLERK_JWT_ISSUER_DOMAIN=https://your-domain.clerk.accounts.dev
   ```

### 4. Set up Convex
```bash
# This authenticates via browser, creates a project, and auto-sets NEXT_PUBLIC_CONVEX_URL
npx convex dev
```
- Keep this terminal running (watches `convex/` for changes and deploys automatically)

### 5. Run the app (separate terminal)
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000)

---

## Environment Variables Required

| Variable | Source | Description |
|----------|--------|-------------|
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk dashboard | Public key for Clerk |
| `CLERK_SECRET_KEY` | Clerk dashboard | Secret key (server-side only) |
| `NEXT_PUBLIC_CLERK_SIGN_IN_URL` | Set to `/sign-in` | Sign-in redirect |
| `NEXT_PUBLIC_CLERK_SIGN_UP_URL` | Set to `/sign-up` | Sign-up redirect |
| `NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL` | Set to `/dashboard` | After sign-in |
| `NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL` | Set to `/dashboard` | After sign-up |
| `CLERK_JWT_ISSUER_DOMAIN` | Clerk Frontend API URL | Convex JWT validation |
| `NEXT_PUBLIC_CONVEX_URL` | Auto-set by `npx convex dev` | Convex deployment URL |

---

## Feature Implementation Status

### ✅ Phase 1: Project Foundation
- [x] Next.js 16 with TypeScript + Tailwind CSS v4
- [x] Dark mode design tokens (`globals.css`)
- [x] `lib/utils.ts` — `cn()` helper
- [x] `lib/date-utils.ts` — Date/time utilities
- [x] `lib/streak-utils.ts` — Streak calculation
- [x] `lib/time-utils.ts` — Timeline gap detection
- [x] `lib/validations.ts` — Zod schemas
- [x] `types/index.ts` — Shared TypeScript types

### ✅ Phase 2: Convex Backend
- [x] `convex/schema.ts` — 3 tables (users, habits, habitCompletions)
- [x] `convex/auth.config.ts` — Clerk JWT integration
- [x] `convex/users.ts` — getCurrentUser, upsertUser
- [x] `convex/habits.ts` — listHabits, getHabit, listHabitsForTimeline, createHabit, updateHabit, deleteHabit, archiveHabit
- [x] `convex/completions.ts` — getCompletionsForDate, getCompletionsForHabit, getCompletionsForDateRange, isHabitCompletedOnDate, toggleCompletion, markComplete, markIncomplete

### ✅ Phase 3: Authentication (Clerk)
- [x] `proxy.ts` — Clerk route protection (Next.js 16 proxy convention)
- [x] `components/providers/convex-client-provider.tsx`
- [x] `app/layout.tsx` — Root layout with ClerkProvider + ConvexClientProvider
- [x] `app/(auth)/layout.tsx` — Centered auth layout
- [x] `app/(auth)/sign-in/[[...sign-in]]/page.tsx`
- [x] `app/(auth)/sign-up/[[...sign-up]]/page.tsx`
- [x] `app/page.tsx` — Auth-based redirect

### ✅ Phase 4: Custom Hooks
- [x] `hooks/use-current-user.ts`
- [x] `hooks/use-habits.ts`
- [x] `hooks/use-habit-mutations.ts`
- [x] `hooks/use-completions.ts`
- [x] `hooks/use-optimistic-completion.ts`
- [x] `hooks/use-streaks.ts`
- [x] `hooks/use-timeline.ts`

### ✅ Phase 5: UI Component Library
- [x] `components/ui/button.tsx`
- [x] `components/ui/card.tsx`
- [x] `components/ui/input.tsx`
- [x] `components/ui/textarea.tsx`
- [x] `components/ui/select.tsx`
- [x] `components/ui/badge.tsx`
- [x] `components/ui/skeleton.tsx`
- [x] `components/ui/spinner.tsx`
- [x] `components/ui/dialog.tsx`
- [x] `components/ui/dropdown-menu.tsx`
- [x] `components/ui/progress.tsx`
- [x] `components/ui/toast.tsx`
- [x] `components/ui/empty-state.tsx`

### ✅ Phase 6: Habit CRUD Frontend
- [x] `components/habits/habit-form.tsx`
- [x] `components/habits/habit-dialog.tsx`
- [x] `components/habits/habit-completion-button.tsx`
- [x] `components/habits/habit-streak-badge.tsx`
- [x] `components/habits/habit-menu.tsx`
- [x] `components/habits/habit-card.tsx`
- [x] `components/habits/habit-filters.tsx`
- [x] `components/habits/habit-list.tsx`
- [x] `components/layout/sidebar.tsx`
- [x] `components/layout/mobile-nav.tsx`
- [x] `components/layout/topbar.tsx`
- [x] `components/layout/page-header.tsx`
- [x] `components/layout/user-sync.tsx`
- [x] `app/(dashboard)/layout.tsx`
- [x] `app/(dashboard)/dashboard/page.tsx`

### ✅ Phase 7-9: Timeline View
- [x] `components/timeline/timeline-now-indicator.tsx`
- [x] `components/timeline/timeline-gap.tsx`
- [x] `components/timeline/timeline-item.tsx`
- [x] `components/timeline/timeline-header.tsx`
- [x] `components/timeline/timeline-view.tsx`
- [x] `app/(dashboard)/timeline/page.tsx`

### ✅ Phase 10-11: Bonus Features
- [x] `components/calendar/habit-calendar.tsx`
- [x] `components/calendar/calendar-day-cell.tsx`
- [x] `app/(dashboard)/calendar/page.tsx`
- [x] `components/analytics/weekly-chart.tsx`
- [x] `components/analytics/streak-summary.tsx`
- [x] `app/(dashboard)/analytics/page.tsx`
- [x] `app/not-found.tsx`

### ✅ Phase 13: Pomodoro Timer
- [x] `convex/schema.ts` — Added `pomodoroSessions` table (userId, habitId?, mode, durationSecs, date, completedAt)
- [x] `convex/pomodoro.ts` — `saveSession` mutation + `listSessionsForDate` query
- [x] `hooks/use-pomodoro.ts` — Drift-free timer (endTimestamp strategy), auto-mode-switch, localStorage persistence, Convex save, notifications + toast on completion
- [x] `components/pomodoro/mode-selector.tsx` — Focus / Short Break / Long Break tab buttons
- [x] `components/pomodoro/pomodoro-timer.tsx` — Large MM:SS countdown + animated SVG progress ring, per-mode color
- [x] `components/pomodoro/timer-controls.tsx` — Start / Pause / Reset buttons
- [x] `components/pomodoro/session-counter.tsx` — "Session X of 4" with filled dot indicators
- [x] `components/pomodoro/habit-selector.tsx` — Dropdown to link a habit to the session
- [x] `app/(dashboard)/pomodoro/page.tsx` — Full Pomodoro page with daily stats row
- [x] `components/layout/sidebar.tsx` — Added Pomodoro nav item (Timer icon)
- [x] `components/layout/mobile-nav.tsx` — Added Pomodoro nav item

### ✅ Phase 12: Notification & Reminder System
- [x] `hooks/use-habit-notifications.ts` — Permission management, `setTimeout`-based scheduling, localStorage toggle, daily recurrence, timer cleanup
- [x] `components/notifications/notification-provider.tsx` — Context provider; fetches habits via `useHabits()`, runs the hook, exposes `{ enabled, permission, toggleEnabled }` to all children
- [x] `components/notifications/notification-toggle.tsx` — Bell icon button in topbar; green dot when enabled; toast fallback if permission denied
- [x] `components/notifications/notification-scheduler.tsx` — Stub kept for import compatibility
- [x] `app/(dashboard)/layout.tsx` — Wrapped layout content with `<NotificationProvider>`
- [x] `components/layout/topbar.tsx` — Added `<NotificationToggle />` next to `<UserButton />`

---

## Architecture Notes

### Key Technical Decisions
1. **Next.js 16**: Uses `proxy.ts` (not `middleware.ts`) — file renamed in v16
2. **Tailwind CSS v4**: Uses `@import "tailwindcss"` in CSS (not `@tailwind` directives)
3. **Convex date storage**: `YYYY-MM-DD` in LOCAL timezone (not UTC) to prevent midnight drift
4. **Completions**: Hard-deleted when unchecked (no boolean field), enforced by `by_habit_date` index
5. **Optimistic UI**: Uses Convex's `withOptimisticUpdate` for instant toggle feedback
6. **Streak calculation**: Pure client-side from fetched completion dates (`lib/streak-utils.ts`)
7. **State**: No global state manager — Convex queries + local useState only

### Routes
| URL | Description |
|-----|-------------|
| `/` | Redirects to /dashboard or /sign-in |
| `/sign-in` | Clerk sign-in |
| `/sign-up` | Clerk sign-up |
| `/dashboard` | Main habit list |
| `/timeline` | Daily vertical timeline |
| `/calendar` | Monthly history view |
| `/analytics` | Charts + streak stats |
| `/milestones` | Per-habit milestone achievements |
| `/profile` | User profile edit page |

### ✅ Phase 14: Milestones & Achievements
- [x] `lib/milestone-config.ts` — 7 milestone definitions (3/7/14/21/30/45/66 days), tier colours (bronze → platinum)
- [x] `convex/schema.ts` — Added `userMilestones` table (`userId`, `habitId`, `daysRequired`, `achievedAt`); indexes `by_user_habit`, `by_user`
- [x] `convex/milestones.ts` — `getUserMilestones` query (optional habitId filter) + `checkAndAwardMilestones` internal mutation (streak check → insert awards → return newly unlocked `daysRequired[]`)
- [x] `convex/completions.ts` — `toggleCompletion` now calls `checkAndAwardMilestones` on completion and returns `{ action, newMilestones: number[] }`
- [x] `hooks/use-milestones.ts` — `useMilestones(habitId, frequency)` → per-milestone progress, `nextMilestone`, `unlockedCount`
- [x] `hooks/use-optimistic-completion.ts` — Captures `newMilestones` from mutation result; fires achievement `showToast` for each unlocked milestone
- [x] `components/milestones/milestone-card.tsx` — Locked/unlocked card: tier-coloured border, icon, progress bar, achievement date
- [x] `components/milestones/milestone-grid.tsx` — Responsive grid (`sm:2 lg:3 xl:4` cols) + "X / 7 milestones unlocked" header + skeleton loading state
- [x] `components/habits/habit-milestone-hint.tsx` — Inline badge showing next milestone with current progress (e.g. "🔥 First Week (5/7)")
- [x] `components/habits/habit-card.tsx` — Added `<HabitMilestoneHint>` to the meta row
- [x] `app/(dashboard)/milestones/page.tsx` — `/milestones` route: habit selector tabs + `<MilestoneGrid>` + empty state
- [x] `components/layout/sidebar.tsx` — Added Milestones nav item (Trophy icon)
- [x] `components/layout/mobile-nav.tsx` — Added Milestones nav item (Trophy icon)

### ✅ Phase 15: User Profile
- [x] `convex/schema.ts` — Extended `users` table with optional `age`, `sex`, `location`, `bio`, `profileImageStorageId`, `updatedAt` (zero-downtime — all optional)
- [x] `convex/users.ts` — Fixed `upsertUser` (no longer overwrites user-edited name on sync); added `updateProfile`, `generateUploadUrl`, `saveProfileImage` mutations; `getCurrentUser` now resolves `resolvedImageUrl` from Convex storage or falls back to Clerk `imageUrl`
- [x] `hooks/use-user-profile.ts` — `useUserProfile()` hook: wraps `getCurrentUser`, `updateProfile`, `uploadProfileImage` (3-step: generate URL → POST bytes → save storageId); exposes `isSaving`, `isUploading`, `error`
- [x] `components/profile/profile-avatar.tsx` — Circular avatar with hover Camera overlay, local `createObjectURL` preview before upload, initials fallback, upload spinner
- [x] `components/profile/profile-form.tsx` — `react-hook-form` + Zod form: Name (required), Age (number, validated), Sex (3-button radio: Male/Female/Other), Location (with MapPin icon), Bio (textarea, 300-char counter); "✓ Saved!" feedback state
- [x] `app/(dashboard)/profile/page.tsx` — `/profile` route: avatar card + name/email display + profile form; full skeleton loading state
- [x] `components/layout/sidebar.tsx` — Added Profile nav item (User icon)
- [x] `components/layout/mobile-nav.tsx` — Added Profile nav item (User icon)

### ✅ Phase 16: Retention System

#### Feature 1 — Daily Check-In System
- [x] `convex/schema.ts` — Added `dailyCheckIns` table (`userId`, `date`, `completed`, `createdAt`); indexes `by_user_date`, `by_user`
- [x] `convex/checkIns.ts` — `getDailyCheckIn` query (returns today's record or null) + `upsertDailyCheckIn` mutation (insert-or-update, prevents duplicates) + `getRecentCheckIns` query (for streak-freeze lookback)
- [x] `hooks/use-daily-check-in.ts` — `useDailyCheckIn()`: wraps query + mutation; distinguishes loading/null/doc states; exposes `submitCheckIn(completed)`
- [x] `components/retention/daily-check-in-modal.tsx` — Reuses `<Dialog>`; auto-opens once per day when `checkIn === null`; "Yes, I completed" / "Not today" CTA buttons; closes after either action

#### Feature 2 — Habit Goals (Weekly Targets)
- [x] `convex/schema.ts` — Extended `habits` table with optional `weeklyGoal: v.optional(v.number())` (zero-downtime — all existing docs unaffected)
- [x] `convex/habits.ts` — `createHabit` and `updateHabit` accept and persist optional `weeklyGoal`
- [x] `types/index.ts` — Added `weeklyGoal?: number` to `CreateHabitInput`
- [x] `lib/date-utils.ts` — Added `getWeekStart(dateStr)` — returns Monday of the ISO week
- [x] `lib/validations.ts` — Added `weeklyGoal` field to `habitSchema` (int 1–7, optional, preprocessed from form string)
- [x] `hooks/use-weekly-goals.ts` — `useWeeklyGoal(habitId, weeklyGoal)`: reuses existing `useCompletionsForHabit(id, weekStart, weekEnd)` to count this-week completions; skips query when no goal set
- [x] `components/retention/habit-goal-progress.tsx` — "X / Y this week" label + `<Progress>` bar; green when goal met; only renders when `weeklyGoal` is set
- [x] `components/habits/habit-form.tsx` — Added "Weekly Goal" number input (1–7); `habitToFormValues` now includes `weeklyGoal`
- [x] `components/habits/habit-dialog.tsx` — `createHabit` and `updateHabit` calls pass `weeklyGoal`
- [x] `hooks/use-habit-mutations.ts` — `createHabit` and `updateHabit` forward `weeklyGoal` to Convex mutations
- [x] `components/habits/habit-card.tsx` — Mounts `<HabitGoalProgress>` below meta row when `habit.weeklyGoal` is set

#### Feature 3 — Smart Nudges
- [x] `lib/nudges.ts` — Pure `generateNudges()` function (no React deps); 4 rules in priority order: streak-close (6-day streak), time-based (startTime within 1h), missed-yesterday (daily habit), streak-milestone (multiple of 5); returns max 2 nudges
- [x] `hooks/use-nudges.ts` — `useNudges()`: uses `useHabits()`, `useCompletionsForDate(today)`, `useCompletionsForDate(yesterday)`, `useCompletionsForDateRange(14 days)` to approximate per-habit streaks without per-habit hook calls; session-only dismiss via `useState<Set>`
- [x] `components/retention/nudge-banner.tsx` — Dismissible nudge cards with accent left-border; renders nothing when nudges array is empty
- [x] `app/(dashboard)/dashboard/page.tsx` — Mounts `<DailyCheckInModal />` at top; mounts `<NudgeBanner>` between PageHeader and progress bar

### ✅ Phase 17: Light / Dark Mode
- [x] `app/globals.css` — Added `html.light { ... }` block that overrides all 19 CSS design tokens for light theme (bright backgrounds, dark text, same accent colours); added `html.light` Clerk popup CSS overrides so popover text/hover adapts
- [x] `components/providers/theme-provider.tsx` — `ThemeProvider` context: reads `localStorage.theme` on mount (defaults to `"dark"`), applies/removes `"light"` class on `<html>`, persists changes; exports `useTheme()` hook
- [x] `components/layout/theme-toggle.tsx` — `<ThemeToggle />`: Sun icon in dark mode, Moon icon in light mode; uses `useTheme()`; styled with `--text-secondary` to blend with topbar
- [x] `app/layout.tsx` — Injected inline `<script>` in `<head>` (runs before hydration) to read `localStorage.theme` and add `"light"` class immediately — eliminates flash of wrong theme; added `suppressHydrationWarning` on `<html>`; wrapped children with `<ThemeProvider>`
- [x] `components/layout/topbar.tsx` — Imported `<ThemeToggle />` (placed left of notification bell); imported `useTheme()` to derive `isLight`; Clerk `<UserButton>` appearance now passes dynamic colors based on `isLight` flag (background, text, borders, icon colours)

---

## Verification Checklist

Run through these after setup:
- [ ] Sign up → redirected to /dashboard
- [ ] Create habit → appears in list immediately (Convex real-time)
- [ ] Edit habit → updates in place
- [ ] Delete habit → removed (with confirmation)
- [ ] Toggle completion → instant (optimistic) checkbox animation
- [ ] Visit /timeline → habits sorted by time, gaps shown, NOW indicator visible
- [ ] Complete habits 3 days in a row → streak badge shows 🔥 3
- [ ] Visit /calendar → month grid with completion dots
- [ ] Visit /analytics → bar chart + streak leaderboard
- [ ] Sign out → redirected to /sign-in
- [ ] Sign back in → all data persists
- [ ] Mobile (375px viewport) → bottom nav visible, layout usable
- [ ] Click "Enable Reminders" in topbar → browser prompts for notification permission
- [ ] Grant permission → bell icon shows green dot, button label changes to "Reminders On"
- [ ] Set a habit's `startTime` to 1–2 min from now → browser notification fires with correct title
- [ ] Deny permission → toast appears: "Notifications blocked — enable them in your browser settings."
- [ ] Toggle reminders off → green dot disappears, no further notifications fire
- [ ] Refresh page → enabled state persists from localStorage; timers rescheduled automatically
- [ ] Edit or add a habit → timers cleared and rescheduled with updated habit list
- [ ] Visit /pomodoro → Timer icon appears in sidebar and mobile nav
- [ ] Start focus timer → countdown runs, SVG ring shrinks, pulse animation visible
- [ ] Pause → remaining time preserved; Resume → continues from exact pause point
- [ ] Reset → timer returns to mode default (25:00 for Focus)
- [ ] Switch mode tab → timer resets to that mode's duration, ring color changes
- [ ] Timer reaches 0 → toast shown, browser notification fires, mode auto-switches
- [ ] Refresh mid-session → timer resumes correctly from remaining time
- [ ] Complete 4 focus sessions → long break auto-selected, cycle counter increments
- [ ] Link a habit → session saved to Convex; daily stats row updates
- [ ] Daily stats row shows correct focus session count and total minutes

---

## Deployment

### Vercel (recommended)
```bash
# 1. Push to GitHub
git init && git add . && git commit -m "Initial commit"
gh repo create habit-tracker --public --push

# 2. Import in Vercel dashboard (vercel.com/new)
# 3. Add all environment variables from .env.local
# 4. Deploy

# 5. Update Convex deployment URL in Vercel env vars after deploying
npx convex deploy --cmd "npm run build"
```

---

- [ ] Visit `/milestones` → all 7 milestone cards visible; locked cards show progress bar
- [ ] Mark a habit complete 3 days running → toast "🎉 Milestone unlocked: 🌱 Getting Started" fires
- [ ] "Getting Started" card shows as unlocked with achievement date and green border
- [ ] Habit cards show milestone hint: "Next: 🔥 First Week (X/7)" in meta row
- [ ] Marking a habit incomplete does NOT remove already-earned milestones
- [ ] With multiple habits, habit selector tabs switch milestone view per habit
- [ ] Milestones nav item (Trophy icon) visible in sidebar and mobile bottom nav
- [ ] Empty state shown on `/milestones` when user has no habits

- [ ] Visit `/profile` → form pre-fills with Clerk name; avatar shows Clerk photo
- [ ] Edit name → save → name persists after page refresh (not overwritten by `upsertUser`)
- [ ] Fill age, sex, location, bio → save → "✓ Saved!" button state + "Profile saved!" toast
- [ ] Click avatar → file picker opens → select image → local preview shows immediately
- [ ] After upload completes → avatar updates to the new photo
- [ ] Reload page → all profile fields retain saved values
- [ ] Invalid age (e.g. 0 or "abc") → validation error shown, save blocked
- [ ] Empty name → "Name is required" error shown, save blocked
- [ ] Bio over 300 chars → validation error shown
- [ ] Profile nav item (User icon) appears in sidebar and mobile bottom nav

- [ ] Open dashboard fresh each day → Daily Check-In modal appears automatically
- [ ] Click "Yes, I completed" → modal closes, does not reappear on same-day page refresh
- [ ] Click "Not today" → modal closes, records `completed: false`
- [ ] Open app a second time the same day → modal does NOT appear again (upsert guard)
- [ ] Create habit with Weekly Goal = 4 → habit card shows "0 / 4 this week" with empty progress bar
- [ ] Complete habit 3 times this week → card shows "3 / 4 this week" with 75% filled bar
- [ ] Complete habit 4 times → bar turns green ("4 / 4 this week")
- [ ] Edit habit → Weekly Goal field pre-filled with saved value; can update or clear
- [ ] Habit with no weeklyGoal → goal progress bar not shown on card
- [ ] Build 6-day streak on a habit → nudge "You're 1 day away from a 7-day streak" appears on dashboard
- [ ] Leave a daily habit undone yesterday → nudge "You missed [Habit] yesterday — try again today" appears
- [ ] Dismiss a nudge → card disappears; does not return on same session
- [ ] Reload page → dismissed nudges reappear (dismiss is session-only, not persisted)
- [ ] Maximum 2 nudges shown at once even when many conditions are triggered
- [ ] Mobile (375px viewport) → check-in modal, weekly goal bar, nudge banner all render correctly

- [ ] Click Sun/Moon icon in topbar → entire app switches theme instantly (no page reload)
- [ ] Light mode: backgrounds are white/light-gray, text is near-black, borders are light
- [ ] Dark mode: backgrounds are near-black, text is light-gray — identical to original
- [ ] Refresh page in light mode → light mode persists (localStorage)
- [ ] Refresh page in dark mode → dark mode persists (no flash of light theme)
- [ ] Open Clerk user popover in both modes → popover colours match current theme
- [ ] All habit cards, modals, inputs, badges, toasts adapt correctly in both modes
- [ ] Mobile (375px) → theme toggle visible and functional

*Last updated: 2026-03-31 (Phase 17 added — Light/Dark Mode)*

---

### Phase 18: Intelligence Layer — Insights, Analysis & Recommendations

> Goal: surface actionable analytics so users understand their behaviour and receive smart suggestions.

---

#### Feature 1 — Insights Dashboard (`/insights` route)

**Convex backend** — `convex/insights.ts`

- [ ] `getCompletionStats` query — accepts `{ days: 7 | 30 }`, returns per-day completion counts + total habits for the window; uses `by_user_date` index, grouped by date string
- [ ] `getPomodoroStats` query — sums `durationSecs` of all focus-mode `pomodoroSessions` for the current user; uses `by_user` index
- [ ] Both queries are user-scoped (call `getCurrentUser` internally); heavy aggregation happens server-side so the client only receives summary rows

**Analysis logic** — `lib/insights.ts`

Pure TypeScript module (no React, no Convex imports). Receives raw data arrays and returns structured results.

```ts
// Output shape
type InsightResult = {
  type: "pattern" | "recommendation" | "stat";
  message: string;
  icon?: string; // e.g. "📊" | "🔥" | "⚡"
};
```

Functions to implement:

| Function | Input | Output |
|----------|-------|--------|
| `getOverallCompletionRate(rows, days)` | per-day `{ date, completed, total }[]` | `number` (0–100 %) |
| `getBestDay(rows)` | same | `{ day: string; rate: number }` |
| `getWorstDay(rows)` | same | `{ day: string; rate: number }` |
| `getMostConsistentHabit(habitRows)` | per-habit `{ habitId, title, completions, possibleDays }[]` | `{ title: string; rate: number }` |
| `getMostMissedHabit(habitRows)` | same | `{ title: string; rate: number }` |
| `getTotalFocusTime(sessions)` | `{ durationSecs: number }[]` | `number` (minutes) |
| `generateBehaviourInsights(data)` | combined dataset | `InsightResult[]` — patterns e.g. "Most consistent on Mondays" |
| `generateRecommendations(data)` | combined dataset | `InsightResult[]` — suggestions e.g. "Reduce weekly goal" |

**Rules for recommendations:**
- `completionRate < 50%` → "Consider reducing your weekly goal for '{habit}' to build consistency."
- Habit missed on ≥ 3 weekends in last 30 days → "Try moving '{habit}' to a weekday."
- `currentStreak === 0` and `longestStreak > 5` → "Your longest streak was {n} days — try a smaller daily habit to rebuild momentum."
- Session focus time < 20 min on average → "Shorter sessions (15 min) may help you stay consistent."

**Hook** — `hooks/use-insights.ts`

```ts
"use client";
export function useInsights(window: 7 | 30 = 30) {
  // 1. useQuery(api.insights.getCompletionStats, { days: window })
  // 2. useQuery(api.insights.getPomodoroStats)
  // 3. useQuery(api.habits.listHabits)  ← reuse existing query
  // 4. For each habit, useCompletionsForHabit → build habitRows[]
  //    (batch via a single getCompletionsForDateRange call for performance)
  // 5. useMemo → compute all metrics + insights + recommendations
  // 6. Return { metrics, insights, recommendations, isLoading }
}
```

**Memoization strategy:**
- All derived values wrapped in `useMemo`; dependencies are the raw query results
- `window` change resets all memos automatically
- No `useEffect`-based caching needed — Convex subscriptions handle revalidation

**Page** — `app/(dashboard)/insights/page.tsx`

Layout:

```
<PageHeader title="Insights" subtitle="Understand your habits" />
<WindowToggle />          ← "7 days" / "30 days" tab buttons
<MetricsGrid />           ← 6 stat cards (see below)
<ChartsRow />             ← bar chart (completions by day-of-week) + line chart (daily rate trend)
<BehaviourInsights />     ← pattern insight cards
<Recommendations />       ← recommendation banners
```

**Stat cards — `components/insights/metric-card.tsx`**

| Card | Icon | Value |
|------|------|-------|
| Overall Completion Rate | 📊 | `{n}%` + sparkline |
| Best Day | 🌟 | Day name + rate |
| Worst Day | 😓 | Day name + rate |
| Most Consistent Habit | 🔥 | Habit title + `{n}%` |
| Most Missed Habit | ⚡ | Habit title + `{n}%` |
| Total Focus Time | ⏱️ | `{n} min` (hidden if Pomodoro sessions = 0) |

Each card uses the existing `<Card>` component + `<Tooltip>` explaining how the metric is calculated.

**Charts — `components/insights/completion-bar-chart.tsx` & `completion-trend-chart.tsx`**

- Use **Recharts** (already likely a transitive dep; confirm with `npm ls recharts`; install if absent: `npm install recharts`)
- Bar chart: X = day of week (Mon–Sun), Y = average completion rate
- Line chart: X = date, Y = daily completion % over the selected window
- Charts respect light/dark theme via CSS variable colours (`--bg-card`, `--text-primary`)
- Subtle `animationDuration={600}` entry animation

**Insight cards — `components/insights/insight-card.tsx`**

- Left-accent border coloured by `type`: blue = pattern, amber = recommendation
- Icon + message text
- Dismissible per session (same `useState<Set>` pattern used in `NudgeBanner`)

**Navigation:**

- [ ] Add "Insights" nav item (Sparkles icon from `lucide-react`) to `components/layout/sidebar.tsx`
- [ ] Add "Insights" nav item to `components/layout/mobile-nav.tsx`
- [ ] Add `/insights` to the Routes table in Architecture Notes

---

#### Feature 2 — Edge Cases

| Scenario | Handling |
|----------|----------|
| New user (0 completions) | All metric cards show "—" or "No data yet"; charts render empty state with `<EmptyState>` |
| Only 1–2 days of data | Best/Worst day cards show "Not enough data"; trend line omitted |
| Timezone differences | All date strings are already stored in local timezone (`YYYY-MM-DD`); no extra conversion needed |
| All habits paused/archived | `listHabits` with `isArchived: false` returns empty; dashboard shows empty state |

---

#### Feature 3 — Performance

- [ ] Convex queries aggregate on the server — only summary rows sent to client (not raw completion documents)
- [ ] `useMemo` on all derived analytics in `use-insights.ts` — recalculates only when raw data changes
- [ ] Window toggle (7 vs 30 days) is a local `useState` — switches between two already-subscribed query results without a new network round-trip (subscribe to both upfront)

---

#### Verification Checklist (Phase 18)

- [ ] Visit `/insights` → page loads; sidebar and mobile nav show "Insights" item
- [ ] Default window = 30 days; toggle to 7 days → all metrics update instantly
- [ ] Overall completion rate matches manual count of completions ÷ (habits × days)
- [ ] Best Day and Worst Day cards show correct day names
- [ ] Most Consistent and Most Missed habits reflect actual data
- [ ] Total Focus Time hidden when user has no Pomodoro sessions; shows correct minutes otherwise
- [ ] Bar chart renders one bar per day-of-week; hover tooltip shows percentage
- [ ] Trend line chart renders with one point per day in the selected window
- [ ] Behaviour insight cards show e.g. "You are most consistent on Mondays"
- [ ] Recommendation cards appear when completion rate < 50 % for any habit
- [ ] Dismiss an insight card → it disappears; reappears on page reload (session-only)
- [ ] New user with zero data → all cards show "No data yet"; no chart crash
- [ ] Light mode → charts and cards adapt to light theme colours
- [ ] Mobile (375 px) → metrics grid stacks to 1 column; charts scroll horizontally

*Last updated: 2026-03-31 (Phase 18 added — Intelligence Layer)*

---

### Phase 19: Production Push Notifications (FCM)

> Goal: deliver habit reminders even when the browser tab is closed, using Firebase Cloud Messaging (FCM) with a Convex-scheduled backend cron.

---

#### Step 1 — Firebase Project Setup *(manual — one-time)*

- [ ] Go to [console.firebase.google.com](https://console.firebase.google.com) and create a new project (or reuse an existing one)
- [ ] In **Project Settings → General → Your apps**, add a **Web app**
- [ ] Copy the Firebase config object (apiKey, authDomain, projectId, storageBucket, messagingSenderId, appId)
- [ ] In **Project Settings → Cloud Messaging → Web Push certificates**, click **Generate key pair**; copy the VAPID public key
- [ ] In **Project Settings → Service accounts**, click **Generate new private key** and download the JSON

---

#### Step 2 — Set Client Env Vars *(`.env.local` already has placeholders)*

- [ ] Fill in `NEXT_PUBLIC_FIREBASE_API_KEY`
- [ ] Fill in `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- [ ] Fill in `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- [ ] Fill in `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- [ ] Fill in `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- [ ] Fill in `NEXT_PUBLIC_FIREBASE_APP_ID`
- [ ] Fill in `NEXT_PUBLIC_FIREBASE_VAPID_KEY`

---

#### Step 3 — Set Server Env Vars in Convex *(Admin SDK credentials — never expose to browser)*

```bash
npx convex env set FIREBASE_PROJECT_ID   "your-project-id"
npx convex env set FIREBASE_CLIENT_EMAIL "service-account@your-project.iam.gserviceaccount.com"
# Paste the private key with literal \n sequences:
npx convex env set FIREBASE_PRIVATE_KEY  "-----BEGIN PRIVATE KEY-----\nMIIE...\n-----END PRIVATE KEY-----\n"
```

---

#### Step 4 — Files Created *(already in codebase)*

- [x] `lib/firebase.ts` — Firebase app + messaging singleton; `isFirebaseConfigured()` guard
- [x] `app/api/firebase-messaging-sw/route.ts` — Dynamic service worker endpoint; injects env vars; sets `Service-Worker-Allowed: /` header so scope covers entire app
- [x] `hooks/usePushNotifications.ts` — Requests permission, registers SW, calls `getToken()`, upserts token in Convex, listens for foreground messages via `onMessage()`
- [x] `convex/schema.ts` — Added `pushTokens` table (`userId`, `token`, `timezone`, `createdAt`); indexes `by_user` and `by_token`
- [x] `convex/pushTokens.ts` — `upsertToken` mutation (de-duplication); `deleteToken` / `deleteAllTokensForUser` mutations; `getAllTokensWithTimezones` + `getActiveHabitsForUserAtTime` internal queries; `deleteStaleToken` internal mutation
- [x] `convex/notifications.ts` — `sendHabitReminders` internal action; WebCrypto RS256 JWT auth against Google OAuth2; FCM HTTP v1 API; automatic stale-token cleanup; timezone-aware local time matching
- [x] `convex/crons.ts` — Fires `sendHabitReminders` every minute
- [x] `components/notifications/notification-provider.tsx` — Updated to combine in-app (setTimeout) and FCM strategies; foreground FCM messages shown as toasts; single bell-icon toggle controls both

---

#### Step 5 — How the notification flow works

```
User enables notifications (bell icon)
  └─ 1. Browser permission requested                (Notification.requestPermission)
  └─ 2. Service worker registered                   (/api/firebase-messaging-sw)
  └─ 3. FCM token acquired                          (getToken + VAPID key)
  └─ 4. Token + timezone stored in Convex           (pushTokens.upsertToken)

Every minute (Convex cron)
  └─ sendHabitReminders action fires
       └─ fetches all push tokens
       └─ for each token: converts timezone → local "HH:MM"
       └─ queries habits with startTime === localTime
       └─ exchanges service-account key → Google OAuth2 access token (WebCrypto RS256)
       └─ POSTs to FCM HTTP v1 API  →  user receives push notification
       └─ stale tokens (UNREGISTERED) auto-deleted from Convex

App is open (foreground)
  └─ onMessage() fires → custom DOM event → toast shown via NotificationProvider
```

---

#### Verification Checklist (Phase 19)

- [ ] Fill in all `NEXT_PUBLIC_FIREBASE_*` env vars and `npx convex env set` the 3 admin vars
- [ ] `npx convex dev` deploys without errors; cron `send-habit-reminders` visible in Convex dashboard
- [ ] Open app → click "Enable Reminders" → browser permission prompt appears
- [ ] Grant permission → bell icon turns green; no console errors
- [ ] Visit `/api/firebase-messaging-sw` in browser → valid JavaScript returned (not the "not configured" stub)
- [ ] Convex dashboard → Data → `pushTokens` table → your token row appears with correct `timezone`
- [ ] Set a habit `startTime` to 1–2 min from now → close the browser tab completely → push notification arrives
- [ ] Tap notification → browser opens and navigates to `/dashboard`
- [ ] Leave the tab open → foreground message arrives as a toast instead of a native notification
- [ ] Click "Enable Reminders" again (toggle off) → `pushTokens` row deleted from Convex
- [ ] Deny browser notification permission → toast "Notifications blocked" appears; FCM registration skipped
- [ ] Create account on a second device → enable reminders → both devices receive the notification
- [ ] Firebase-unconfigured state: leave `NEXT_PUBLIC_FIREBASE_*` vars empty → app works normally; FCM silently skipped; in-app setTimeout notifications still work
- [ ] Stale token: revoke permission in browser settings → next cron run auto-deletes the stale token from Convex

*Last updated: 2026-03-31 (Phase 19 added — Production Push Notifications)*
