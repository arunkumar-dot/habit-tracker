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

*Last updated: 2026-03-29*
