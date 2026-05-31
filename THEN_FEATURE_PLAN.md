# Journal "Then" Feature — Implementation Plan

## Goal

When a user opens the Journal page, show them a "memory card" if a journal entry exists at a milestone interval in their past (30 / 60 / 90 / 180 / 365 days ago). This creates the strongest emotional moment in HabitFlow: the user sees who they used to be, in their own words.

---

## Feature Summary

```
You wrote this 30 days ago

"Today I struggled to wake up before 8 AM..."

May 2, 2026

[Read full entry]
```

Only one card. Closest matching interval wins.
Empty state = nothing rendered.

---

## Candidate dates

Priority order (checked in sequence; first match wins):

| Priority | Days ago |
|---|---|
| 1 | 30 |
| 2 | 60 |
| 3 | 90 |
| 4 | 180 |
| 5 | 365 |

Client computes these as absolute dates:
```ts
const MEMORY_INTERVALS = [30, 60, 90, 180, 365];
const candidateDates = MEMORY_INTERVALS.map(n => addDays(todayStr, -n));
```

Passed to the backend in a single query call.

---

## Files

### New files

| File | Description |
|---|---|
| `components/journal/then-memory-card.tsx` | The memory card component — warm, reflective, Instrument Serif |
| `THEN_FEATURE_PLAN.md` | This document |
| `THEN_FEATURE_REPORT.md` | Post-implementation report |

### Modified files

| File | Change |
|---|---|
| `convex/journal.ts` | Add `getThenMemory` query |
| `app/(dashboard)/journal/page.tsx` | Render `<ThenMemoryCard>` between today's card and past entries |

---

## Backend: `getThenMemory` query

```ts
export const getThenMemory = query({
  args: { candidateDates: v.array(v.string()) },
  handler: async (ctx, args) => {
    const user = await getAuthUser(ctx);
    for (const date of args.candidateDates) {
      const entry = await ctx.db
        .query("journalEntries")
        .withIndex("by_user_date", (q) =>
          q.eq("userId", user._id).eq("date", date)
        )
        .unique();
      if (entry) return { entry };
    }
    return { entry: null };
  },
});
```

- One database query per candidate date, exits on first match
- No schema changes needed
- Uses existing `by_user_date` index
- Returns the full entry document (or null)

---

## "Days ago" resolution

The client already knows the candidate dates and their intervals. After receiving the entry, it resolves the matching interval:

```ts
const daysAgo = MEMORY_INTERVALS.find(
  n => addDays(todayStr, -n) === memory.entry.date
);
// → 30 | 60 | 90 | 180 | 365
```

This keeps the backend pure and the frontend self-contained.

---

## Component: `ThenMemoryCard`

### Layout

```
┌──────────────────────────────────────────────────────────┐
│  You wrote this 30 days ago                              │  ← xs label
│                                                          │
│  "Today I struggled to wake up before 8 AM. I set my    │  ← Instrument Serif
│   alarm three times..."                                  │    italic, 2-line clamp
│                                                          │
│  May 2, 2026                         Read full entry →   │  ← date + CTA
└──────────────────────────────────────────────────────────┘
         ↑ expanded state shows full text + Close button
```

### Visual spec

| Property | Value |
|---|---|
| Background | `var(--bg-sunken)` (#F3EFE8) |
| Border | none (clean, warm) |
| Left accent bar | 3px solid `var(--accent)` |
| Border radius | 12px |
| Excerpt font | Instrument Serif italic, 16px |
| Date font | Inter, 13px, `var(--text-subtle)` |
| Label | Inter, 11px uppercase, `var(--text-subtle)` |
| Entry animation | `initial: {opacity:0, y:8}` → `animate: {opacity:1, y:0}`, 400ms ease |

### Expand / "Read full entry"

- Tapping "Read full entry →" expands the card in-place to show the full content
- No modal, no navigation — entry is fully readable inline
- Expanded state shows a "Close" text to collapse
- `max-height` + framer-motion `AnimatePresence` for smooth expansion

### Empty state

If `getThenMemory` returns `{ entry: null }`: render nothing.
No placeholder, no skeleton after load.

---

## Placement in journal page

```
[Today's writing card]
[ThenMemoryCard]           ← NEW — between writing and past entries
[Past Entries section]
```

The memory is most powerful when seen while the user is writing today's entry — a quiet reminder of who they were.

---

## Mobile Android requirements

| Requirement | Implementation |
|---|---|
| 360/390/412px widths | `width: 100%`, `box-sizing: border-box`, no fixed widths |
| No horizontal scroll | All text `overflow-hidden` / `-webkit-line-clamp` for excerpt |
| Readable on small screens | 2-line clamp on excerpt; full expand on tap |
| Android WebView compat | No hover-only, no position:fixed, `minHeight: 44px` on tap targets |
| Smooth scroll | Native scroll; card fades in without layout shift |

---

## What is NOT changed

- Journal completion/save logic — unchanged
- `PastEntries` component — unchanged
- `EntryRow` component — unchanged (memory card has its own expand)
- Journal prompts — unchanged
- Convex schema — no migrations (query only)

---

## Acceptance criteria mapping

| Criterion | Implementation |
|---|---|
| Memory appears when matching entry exists | `getThenMemory` returns entry, card renders |
| Correct interval chosen (closest first) | Candidate dates passed in priority order; first match returned |
| No fake data | Only renders when real entry returned from Convex |
| Full entry can be opened | In-place expand inside the card |
| Android layout works | Mobile-first inline styles, no fixed-width elements |
| No horizontal scrolling | All elements constrained to width |
| No broken journal flows | Today's card logic unchanged; memory is additive |
| No TypeScript errors | All types from Convex generated types |

---

*Plan — June 2026*
