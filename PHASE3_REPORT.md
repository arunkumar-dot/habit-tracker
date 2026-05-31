# Phase 3 Report — Mission Bridge Dashboard

## Scope

Implemented only Phase 3 from `IMPLEMENTATION_ROADMAP.md`: the `/dashboard` Mission Bridge redesign. No Phase 4 quest-board work or redesigns for Habits, Timeline, Calendar, Analytics, Insights, Journal, Pomodoro, Milestones, Profile, or Settings were started.

No backend logic, Convex schema, Clerk configuration, route structure, or API contracts were modified.

## Dashboard Architecture

The dashboard now renders in the requested Mission Bridge order:

1. Character Banner
2. Active Mission
3. Today's Quests
4. Streak Thread
5. Weekly Mission Log

`app/(dashboard)/dashboard/page.tsx` coordinates the top-level dashboard data needed by the new Character Banner and Streak Thread while keeping existing dashboard widgets responsible for their own existing completion behavior.

## New Components

- `components/rpg/character-banner.tsx`
  - Shows level, XP progress, rank title, and current streak.
  - Uses `XPBar`, `AnimatedCard`, `StarfieldBg`, and Phase 1 space tokens.

- `components/rpg/xp-bar.tsx`
  - GPU-friendly animated XP progress using `transform: scaleX`.
  - Respects `prefers-reduced-motion`.

- `components/rpg/streak-shield.tsx`
  - Reusable visual wrapper for streak strength.
  - Uses `StreakShieldAnimation` from Phase 2.

- `components/rpg/quest-complete-animation.tsx`
  - Dashboard-facing alias over `MissionCompleteAnimation` for quest completion semantics.

- `components/dashboard/streak-thread-card.tsx`
  - Dashboard-only Streak Thread panel using existing `StreakThread`.

- `lib/rpg-dashboard.ts`
  - Client-side derivation helpers for XP, level, rank, current streak, quest codenames, and weekly mission days.

## Modified Components

- `app/(dashboard)/dashboard/page.tsx`
  - Adds Mission Bridge structure and dashboard-level completion range query.

- `components/dashboard/up-next-card.tsx`
  - Reframes the existing Up Next card as Active Mission.
  - Preserves existing optimistic completion behavior.
  - Adds XP reward preview and `StreakShield`.

- `components/dashboard/todays-habits.tsx`
  - Reframes dashboard habit rows as Today's Quests.
  - Preserves `HabitCompletionButton` and `useOptimisticCompletion`.
  - Adds XP reward labels plus `MissionCompleteAnimation`, `QuestCompleteAnimation`, and `XPFloat` for completed rows.

- `components/dashboard/weekly-heatmap.tsx`
  - Reframes heatmap as Weekly Mission Log.
  - Uses dashboard-only nebula styling through a new `Heatmap` variant.

- `components/Heatmap.tsx`
  - Adds optional `variant="nebula"` styling.
  - Default visual behavior remains unchanged for other screens.

- `components/StreakThread/StreakThread.tsx`
  - Upgrades colors and current-day pulse using existing data and Phase 2 animation classes.

- `components/rpg/index.ts`
  - Exports new RPG dashboard primitives.

## Data Derivation Strategy

No fake data is used.

- Habits come from `useHabits()`.
- Today's completion states come from `useCompletionsForDate(today())`.
- Annual completion data for derived XP, level, rank, and streak comes from `useCompletionsForDateRange(yearStart, today())`.
- Active mission is selected from existing habit times and completion status using the existing `UpNextCard` logic.
- Current streak is derived from dates that have at least one completion.
- XP is derived from existing completions:
  - `+10 XP` per unique habit-day completion.
  - `+25 XP` for days where all current habits were completed.
  - `+5 XP` per current streak day after day 3.
- Level follows the redesign plan formula: `floor(sqrt(totalXP / 100))`, with a minimum display level of 1.
- Rank title is derived from level and current streak.

## Performance Notes

- Dashboard-level derived values are calculated with lightweight maps/sets over existing completion documents.
- XP bar animation uses transform scaling instead of layout-width animation.
- Card and reward animations reuse Phase 2 primitives and respect `prefers-reduced-motion`.
- Heatmap data and completion mutation paths remain unchanged.
- No new dependencies were added.
- No new database tables or API calls were introduced beyond existing Convex queries already used by the app.

## Screenshots

Screenshots were not captured in this run because no local dashboard server/session was available from the execution environment (`localhost:3000/dashboard` was unavailable). The implementation was verified through lint, tests, and production build.

## Verification

- `npm run lint` passed with the existing 24 warnings and 0 errors.
- `npm run test` passed: 1 test file, 11 tests.
- `npm run build` passed and generated 20 static app routes.

## Not Done

- No Phase 4 Quest Board implementation.
- No redesign of Habits, Timeline, Calendar, Analytics, Insights, Journal, Pomodoro, Milestones, Profile, or Settings.
- No Convex/backend/schema changes.
- No Clerk changes.
- No API contract changes.
