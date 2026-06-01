# Journey V2 — Implementation Plan

## Goal

Replace four fragmented pages (Analytics, Insights, Timeline, Milestones) with a single emotional destination that answers: *"Am I becoming the person I wanted to become?"*

---

## Navigation changes

| Change | Before | After |
|---|---|---|
| PRIMARY_NAV | Today, Habits, Timeline, Pomodoro, Journal | Today, Habits, Journal, Journey, Settings |
| Removed from all nav | — | Analytics, Insights, Timeline, Milestones, Calendar, Pomodoro |
| Added | — | Journey (`/journey`) with Compass icon |
| Preserved pages | — | All pages remain, just not linked from nav |

---

## Files

### New files

| File | Description |
|---|---|
| `app/(dashboard)/journey/page.tsx` | Journey V2 route |
| `components/journey/journey-hero.tsx` | Section 1 — identity + journey stats |
| `components/journey/journey-heatmap-section.tsx` | Section 2 — "Days you showed up" |
| `components/journey/journey-milestones.tsx` | Section 3 — personal milestone names |
| `components/journey/journey-one-number.tsx` | Section 4 — big total completions count |
| `components/journey/journey-recent.tsx` | Section 5 — recent growth timeline |
| `JOURNEY_V2_PLAN.md` | This document |
| `JOURNEY_V2_REPORT.md` | Post-implementation report |

### Modified files

| File | Change |
|---|---|
| `lib/nav-config.ts` | New PRIMARY_NAV + remove Analytics/Insights/Timeline/Milestones/Calendar from nav |
| `convex/completions.ts` | Add `getTotalCompletionCount` query |

---

## Backend: `getTotalCompletionCount`

Single query that returns all-time journey stats from one database scan:

```ts
{ totalCompletions: number, daysActive: number, firstDate: string | null }
```

- `totalCompletions` — raw count of all habit completion records
- `daysActive` — count of unique dates with ≥1 completion
- `firstDate` — earliest completion date ("YYYY-MM-DD") — journey start anchor

Cost: reads all user completions once. Same read as `getHeatmapStats` but returns aggregated integers.

---

## Section 1: Your Journey (Hero)

### Data
- `user.identityStatement` — from `useCurrentUser()`
- Journey start: `firstDate` from `getTotalCompletionCount`, fallback to `user.createdAt`
- Best streak: from `useBestStreak()` (already built in Prompt 2)
- Days active: `daysActive` from `getTotalCompletionCount`

### Visual
```
You are becoming
someone who reads every day.     ← Instrument Serif italic, 22px

Journey started:   June 1, 2025
Best streak:       Day 14  [🔥badge]
Days active:       47
```

Warm background card, no dense grid. Three stats in a clean row.

---

## Section 2: Your History

Reuse `<Heatmap />` exactly as-is with a new label.

```
Days you showed up.    ← section label in Instrument Serif italic

[Year heatmap — existing component unchanged]
```

Horizontal scroll inside the heatmap's own `overflow-x-auto` wrapper. No change to heatmap logic.

---

## Section 3: Milestones

Personal names replacing Bronze/Silver tiers:

| daysRequired | Old name | New name |
|---|---|---|
| 3 | Getting Started | "3 days of [title]" |
| 7 | First Week | "7 days of [title]" |
| 14 | Building Momentum | "14 days of [title]" |
| 21 | Habit Forming | "21 days of [title]" |
| 30 | Strong Habit | "30 days of [title]" |
| 45 | Lifestyle Change | "45 days of [title]" |
| 66 | Habit Mastery | "66 days of [title]. This is who you are now." |

Per-habit display using a `<HabitMilestonesBlock>` sub-component that calls `useMilestones(habitId)`. Shows:
- Unlocked: warm solid row with check and achieved date
- Next locked: muted, shows progress bar "X / N days"
- Further locked: hidden (only show next + unlocked)

---

## Section 4: One Number

```
         You showed up
              124
             times
```

- Font: Instrument Serif, 72px, italic
- `124` — `totalCompletions` from `getTotalCompletionCount`
- Centered, large whitespace around it
- This is the emotional centerpiece

---

## Section 5: Recent Growth

Top 5 most recent items from:
1. All earned milestones from `getUserMilestones({})` joined with habit names
2. Recent journal entries from `listEntries` (first page, take up to 2)

Sorted by timestamp desc, max 5 total.

Item types:
- **Milestone**: "[daysRequired] days of [habitTitle]" + date
- **Journal**: Excerpt (first 80 chars) + date

Rendered as a simple vertical list with a left-side icon, no cards, no gamification styling.

---

## Personal milestone name generation

Client-side function, no backend change:
```ts
function personalMilestoneName(habitTitle: string, daysRequired: number): string {
  const t = habitTitle.toLowerCase().trim();
  if (daysRequired === 66) return `66 days of ${t}. This is who you are now.`;
  return `${daysRequired} days of ${t}`;
}
```

---

## Mobile Android requirements

| Requirement | Implementation |
|---|---|
| 360/390/412px | `max-width: 440px` centered, no fixed widths |
| Heatmap readable | Heatmap's own `overflow-x-auto`, `cellSize=11` for small screens |
| No horizontal overflow | All sections `width: 100%`, `box-sizing: border-box` |
| Smooth scroll | Native vertical scroll, no JavaScript-driven scroll |
| Typography readable | Instrument Serif 22px for hero, 72px for one-number, 15px for lists |
| Thumb-friendly | Min 44px tap targets on milestone items and growth items |

---

## Acceptance criteria

| Criterion | Implementation |
|---|---|
| Journey replaces fragmented pages | Single /journey route |
| User understands progress in <10s | Hero (identity + stats) visible above fold |
| Heatmap retained | Reused exactly |
| One-number implemented | Section 4 with total completions |
| Milestones feel personal | "[N] days of [title]" naming |
| Android works | Mobile-first, no fixed widths |
| No horizontal scrolling | Heatmap has its own scroll; page has none |
| No TypeScript errors | Strict typing throughout |

---

*Plan — June 2026*
