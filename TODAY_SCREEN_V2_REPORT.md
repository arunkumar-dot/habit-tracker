# Today Screen V2 — Implementation Report

## What was built

A mobile-first Today screen that replaces the previous dashboard (UpNextCard + TodaysHabits + WeeklyHeatmap) with a calm, emotional morning ritual view. The screen answers: *Who am I becoming? / What do I need to do today? / How far have I come?*

---

## Files changed

### New files

| File | Description |
|---|---|
| `hooks/use-best-streak.ts` | Computes the highest current streak across all active habits using 2 Convex subscriptions (habits + date-range completions). Avoids N+1 per-habit subscriptions. |
| `components/dashboard/today-screen.tsx` | Today Screen V2 — greeting, identity statement, streak focal point, habit list (reusing TodaysHabits), reflection CTA. |
| `TODAY_SCREEN_V2_PLAN.md` | Pre-implementation plan document. |
| `TODAY_SCREEN_V2_REPORT.md` | This document. |

### Modified files

| File | Change |
|---|---|
| `app/(dashboard)/dashboard/page.tsx` | Replaced UpNextCard + TodaysHabits + WeeklyHeatmap with `<TodayScreen />`. Removed onboarding redirect check (handled by UserGate + onboarding route). |
| `lib/nav-config.ts` | Updated `/dashboard` label from "Dashboard"/"Home" → "Today"/"Today". |

---

## Screen sections

### 1. Greeting
- Time-based: "Good morning / afternoon / evening, [firstName]"
- First name sourced from `user.firstName` falling back to first word of `user.name`
- Loading state shows blank line (no layout shift)

### 2. Identity statement
- Source: `user.identityStatement` from Convex users table (set during onboarding)
- If set: "You are becoming" label + statement in Instrument Serif italic, 24px
- If empty: "Who do you want to become?" in tertiary color, tappable → `/habits`
- No direct edit — statement reflects the user's habits/intentions as entered during onboarding

### 3. Streak focal point
- Computed by `useBestStreak()` — max `currentStreak` across all active habits
- Displays the existing `StreakRibbon` badge (unchanged) + "Day N — keep going"
- If no streak: "Start your streak today" in tertiary text
- Skeleton loader during load

### 4. Today's habits
- Reuses `TodaysHabits` component **unchanged** — all completion logic, streak badges, animations, and layout preserved
- Section heading "Today's habits" above the component

### 5. Reflection CTA
- Full-width tappable row: "Write today's reflection →"
- `href="/journal"`, `min-height: 52px`, border radius 12px
- Always visible (not conditional on completion state)

---

## Mobile Android decisions

| Requirement | Implementation |
|---|---|
| 360/390/412px widths | `maxWidth: 440px` centered, no fixed-width elements |
| No horizontal scroll | `width: 100%`, `min-w-0` on truncated text, no flex overflow |
| Safe area padding | Provided by dashboard layout (`pb-28 lg:pb-0` on main scroll container) |
| Thumb-friendly | Reflection CTA `min-height: 52px`; habit rows via TodaysHabits existing `py-3` |
| Android WebView | All inline styles, no hover-only interactions, no fixed-position conflicts |
| Smooth scrolling | Native vertical scroll via dashboard layout overflow-y-auto |

---

## What was removed from Today

| Removed | Reason |
|---|---|
| `UpNextCard` | Complex intelligence card replaced by focused greeting + identity |
| `WeeklyHeatmap` | Dashboard analytics → belongs in Journey/Calendar (future V2 phase) |
| Onboarding check in page.tsx | Already handled by UserGate + /onboarding route — no duplication needed |

---

## What was NOT changed

- `TodaysHabits` component — zero changes, all habit completion and streak badge logic preserved
- `StreakRibbon` component — used as-is (the signature terracotta badge)
- `HabitCompletionButton` — unchanged
- `useOptimisticCompletion` — unchanged
- `calculateStreak` / `useStreak` — unchanged
- Convex schema — no migrations needed
- All other screens (habits, journal, analytics, calendar, milestones, pomodoro, timeline, settings) — not touched

---

## `useBestStreak` design

Instead of subscribing to completions per habit (N+1), the hook uses:
1. `useHabits()` — all active habits (1 subscription)
2. `useCompletionsForDateRange(today - 100d, today)` — 100-day window covering any realistic streak (1 subscription)

Then computes `calculateStreak()` per habit client-side using the already-fetched data, taking the max.

---

## Build output

```
✓ Compiled successfully in 26.5s
✓ TypeScript: 0 errors
/dashboard route: static (○)
npx cap sync android: ✔ Sync finished in 0.715s
```

---

## Acceptance criteria

| Criterion | Status |
|---|---|
| Today screen feels simple and emotional | Done — 4 focused sections, Instrument Serif identity, terracotta streak |
| Identity statement appears correctly | Done — sourced from user.identityStatement, Instrument Serif italic |
| Today's habits work exactly as before | Done — TodaysHabits reused unchanged |
| Completion logic unchanged | Done — same hooks/mutations |
| Streak logic unchanged | Done — calculateStreak untouched, new display layer only |
| Android layout has no desktop artifacts | Done — no grid, no sidebar, no analytics cards |
| No horizontal scrolling | Done — all elements constrained to viewport |
| No broken navigation | Done — MobileNav unchanged, only label updated to "Today" |
| No TypeScript errors | Done — build passed with 0 errors |

---

*Report — June 2026*
