# Today Screen V2 — Implementation Plan

## Goal

Replace the current dashboard (UpNextCard + TodaysHabits + WeeklyHeatmap) with a calm mobile-first morning ritual screen. The screen answers three questions: *Who am I becoming?* / *What do I need to do today?* / *How far have I come?*

---

## Screen Layout (mobile, 360–412px)

```
┌────────────────────────────────────┐
│  Safe area top                     │
│                                    │
│  Good morning, Arun         [time] │  ← greeting
│                                    │
│  You are becoming                  │  ← identity (Instrument Serif italic)
│  someone who reads every day       │
│                                    │
│  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  │  ← divider
│                                    │
│  Day 8   🔥                        │  ← best streak focal point
│                                    │
│  Today's habits                    │  ← section heading
│  ─────────────────────────────     │
│  ○  Read Book         7:00 AM  🔥7 │  ← habit row
│  ○  Workout           8:00 AM  🔥3 │
│  ○  Meditate          9:00 AM  🔥1 │
│                                    │
│  ✓  [completed habit] dimmed below │
│                                    │
│  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  │
│                                    │
│  Write today's reflection →        │  ← journal CTA
│                                    │
│  Safe area bottom                  │
└────────────────────────────────────┘
        ↑ MobileNav pill (fixed)
```

---

## Files

### Create
| File | Purpose |
|---|---|
| `hooks/use-best-streak.ts` | Computes max current streak across all active habits (2 subscriptions: habits + date-range completions) |
| `components/dashboard/today-screen.tsx` | Today Screen V2 component |

### Modify
| File | Change |
|---|---|
| `app/(dashboard)/dashboard/page.tsx` | Replace UpNextCard + TodaysHabits + WeeklyHeatmap with `<TodayScreen />` |
| `lib/nav-config.ts` | Update label "Dashboard" → "Today", mobileLabel "Home" → "Today" |

### Generate
| File | Purpose |
|---|---|
| `TODAY_SCREEN_V2_PLAN.md` | This document |
| `TODAY_SCREEN_V2_REPORT.md` | Post-implementation report |

---

## Component Design: `TodayScreen`

### Data needed
- `user.firstName` / `user.name` — from `useCurrentUser()`
- `user.identityStatement` — from `useCurrentUser()`
- `bestStreak` — from `useBestStreak()` (new hook)
- Habit list + completions — via existing `TodaysHabits` component (reused as-is)

### Time-based greeting
```ts
function greeting(firstName: string): string {
  const h = new Date().getHours();
  const tod = h < 12 ? "morning" : h < 17 ? "afternoon" : "evening";
  return `Good ${tod}, ${firstName}`;
}
```

### Identity statement display
- If `user.identityStatement` exists: show in Instrument Serif italic, 2 lines
  - Line 1 (small tertiary): "You are becoming"
  - Line 2 (large display): the statement
- If empty: show "Who do you want to become?" in tertiary colour, links to /habits

### Streak focal point
- `useBestStreak()` returns the highest `currentStreak` across all active habits
- Render as "Day {n}" with the StreakRibbon component inline
- If n === 0: render "Start your streak today"

### Habit list section
- Reuse `<TodaysHabits />` unchanged — completion logic, streak badges, animation all preserved
- Section heading styled to match V2 tone ("Today's habits" in sm semibold)

### Reflection CTA
- Simple link row: "Write today's reflection →"
- `href="/journal"`
- Shown always (not conditional on completion state)

---

## Hook Design: `useBestStreak`

```ts
// hooks/use-best-streak.ts
export function useBestStreak(): { bestStreak: number; isLoading: boolean } {
  const { habits, isLoading: habitsLoading } = useHabits();
  const startDate = addDays(today(), -100); // 100-day window covers any streak
  const { completions, isLoading: completionsLoading } = useCompletionsForDateRange(startDate, today());

  const bestStreak = useMemo(() => {
    if (!habits || !completions) return 0;
    let max = 0;
    for (const habit of habits) {
      const dates = completions
        .filter(c => c.habitId === habit._id)
        .map(c => c.date);
      const { currentStreak } = calculateStreak(dates, habit.frequency, today());
      max = Math.max(max, currentStreak);
    }
    return max;
  }, [habits, completions]);

  return { bestStreak, isLoading: habitsLoading || completionsLoading };
}
```

Two Convex subscriptions only — no N+1 per habit.

---

## Mobile Android Requirements

| Requirement | Implementation |
|---|---|
| 360/390/412px widths | `max-w-[440px] mx-auto`, no fixed-width elements |
| No horizontal scroll | All elements `w-full`, `min-w-0`, `overflow-hidden` on truncated text |
| Safe area | `pt-[env(safe-area-inset-top)]` on outer wrapper |
| Thumb-friendly | Habit rows `min-h-[52px]`, CTA `min-h-[52px]` |
| Bottom nav space | `pb-28` on scroll container (already in layout) |
| Smooth scroll | No `overflow-x` additions, native vertical scroll |
| No desktop artifacts | No grid columns, no sidebar patterns, no large analytics cards |

---

## What is explicitly NOT changed

- Habit completion logic (`useOptimisticCompletion`) — unchanged
- Streak calculation (`calculateStreak`, `useStreak`) — unchanged
- `StreakRibbon` component — unchanged
- `HabitCompletionButton` — unchanged
- `TodaysHabits` component — reused as-is
- Other screens (habits, journal, analytics, etc.) — not touched
- Convex schema — not touched

---

## Acceptance Criteria Mapping

| Criterion | Implementation |
|---|---|
| Today screen feels simple and emotional | Clean 4-section layout, Instrument Serif identity, terracotta streak |
| Identity statement appears correctly | Sourced from `user.identityStatement`, Instrument Serif italic |
| Today's habits work exactly as before | `TodaysHabits` reused unchanged |
| Completion logic unchanged | Same hooks and mutations |
| Streak logic unchanged | Same `calculateStreak`, new UI layer only |
| Android layout has no desktop artifacts | Mobile-first, no sidebar, no dense grid |
| No horizontal scrolling | All elements constrained to viewport width |
| No broken navigation | MobileNav pill unchanged; only label "Dashboard" → "Today" |
| No TypeScript errors | All new code typed; no `any` |

---

*Plan — June 2026*
