# HabitFlow — Project Plan & Progress Tracker

> Use this file to track progress across development sessions.
> Update checkbox status as each item is completed.

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

*Last updated: 2026-03-31 (Phase 15 added — User Profile)*
