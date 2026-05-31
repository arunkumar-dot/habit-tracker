# Journal "Then" Feature — Implementation Report

## What was built

A "memory card" that appears on the Journal page when a past entry exists at a milestone interval. When the user opens Journal, they may see a warm, reflective card above the past entries section showing a past entry from 30, 60, 90, 180, or 365 days ago — their own words, dated — reminding them of who they used to be.

This is the strongest emotional moment in HabitFlow.

---

## Files changed

### New files

| File | Description |
|---|---|
| `components/journal/then-memory-card.tsx` | Memory card component — warm `var(--bg-sunken)` background, terracotta left border, Instrument Serif italic excerpt, framer-motion fade-in, in-place expand/collapse |
| `THEN_FEATURE_PLAN.md` | Pre-implementation plan document |
| `THEN_FEATURE_REPORT.md` | This document |

### Modified files

| File | Change |
|---|---|
| `convex/journal.ts` | Added `getThenMemory` query — accepts `candidateDates: string[]`, returns first matching entry in priority order, or `{ entry: null }` |
| `app/(dashboard)/journal/page.tsx` | Added `ThenMemorySection` component and `MEMORY_INTERVALS` constant; rendered between today's card and past entries |

---

## Backend: `getThenMemory`

Accepts an array of candidate date strings in priority order. Iterates through them and returns the first journal entry found via the existing `by_user_date` index. Exits immediately on first match — no wasted reads.

No schema changes. No new tables. Uses the existing `journalEntries` table and index.

---

## Frontend: `ThenMemorySection` (in journal/page.tsx)

Thin wrapper that:
1. Computes the 5 candidate dates: `today - [30, 60, 90, 180, 365]`
2. Calls `api.journal.getThenMemory` with these dates
3. If a match is returned, resolves the matching interval (days ago)
4. Renders `<ThenMemoryCard entry={...} daysAgo={...} />`
5. Returns `null` if no entry found — no placeholder, no skeleton after load

---

## `ThenMemoryCard` component

| Property | Implementation |
|---|---|
| Background | `var(--bg-sunken)` — the warm paper tone |
| Left accent bar | `3px solid var(--accent)` — terracotta, emotional |
| Entry font | Instrument Serif italic, 16px — the display voice of HabitFlow |
| Default state | 2-line clamp (`-webkit-line-clamp: 2`) |
| Expanded state | Full entry text, `white-space: pre-wrap` |
| Toggle | "Read full entry →" / "Close" — `minHeight: 44px` for thumb taps |
| Entrance animation | `framer-motion`: `{opacity: 0, y: 8}` → `{opacity: 1, y: 0}`, 400ms ease |
| Excerpt transition | `AnimatePresence` — clamped ↔ full content, 200ms cross-fade |
| Date format | "May 2, 2026" — human, not technical |

---

## Memory interval priority

| Priority | Days ago | Example for June 1, 2026 |
|---|---|---|
| 1 (shown first) | 30 | May 2, 2026 |
| 2 | 60 | April 2, 2026 |
| 3 | 90 | March 3, 2026 |
| 4 | 180 | December 3, 2025 |
| 5 | 365 | June 1, 2025 |

Only the first match is shown. No cascade display.

---

## Mobile Android decisions

| Requirement | Implementation |
|---|---|
| 360/390/412px widths | `width: 100%`, `box-sizing: border-box`, no fixed widths |
| No horizontal scroll | Excerpt uses `-webkit-line-clamp`; expanded text uses `word-break: break-word` |
| Comfortable reading | 16px Instrument Serif, 1.65 line height, generous padding |
| Thumb-friendly taps | "Read full entry" button `min-height: 44px` |
| Android WebView | No hover states, no position:fixed, inline styles |
| Keyboard behavior | Card is in natural page flow; no overlap with keyboard |

---

## What is NOT changed

- Journal save/autosave logic — unchanged
- `PastEntries` / `EntryRow` components — unchanged
- Journal prompts — unchanged
- Convex schema — no migrations (query only, new function added)
- Other screens — not touched

---

## Build output

```
✓ Compiled successfully in 13.5s
✓ TypeScript: 0 errors
/journal route: static (○)
npx cap sync android: ✔ Sync finished in 0.356s
```

---

## Acceptance criteria

| Criterion | Status |
|---|---|
| Memory appears when matching entry exists | Done — `getThenMemory` returns entry, card renders |
| Correct interval chosen (30d first) | Done — candidates passed in priority order; first match returned |
| No fake data | Done — renders only when real Convex entry returned |
| Full entry can be opened | Done — in-place expand via "Read full entry →" |
| Android layout works correctly | Done — mobile-first inline styles, no fixed widths |
| No horizontal scrolling | Done — `-webkit-line-clamp` + `word-break: break-word` |
| No broken journal flows | Done — additive change only; today's card logic unchanged |
| No TypeScript errors | Done — build passed 0 errors |

---

*Report — June 2026*
