# HabitFlow RPG Space Redesign — Implementation Roadmap

> Source of truth: `ARCHITECTURE_REPORT.md` and `REDESIGN_PLAN.md`.
> Goal: deliver the "Stellar Quests" RPG space redesign through small, reviewable commits without changing backend behavior unless a later phase explicitly requires cached derived stats.

## Phase 0 — Safety Baseline

### Goal
Establish a safe working baseline before visual or interaction changes begin. Preserve current route structure, Convex data flow, auth, PWA behavior, and existing test affordances.

### Files affected
- `ARCHITECTURE_REPORT.md`
- `REDESIGN_PLAN.md`
- `IMPLEMENTATION_ROADMAP.md`
- `app/globals.css`
- `app/layout.tsx`
- `app/(dashboard)/layout.tsx`
- `components/layout/*`
- `components/ui/*`
- `hooks/*`
- `e2e/*`
- `package.json`
- `eslint.config.mjs`

### Dependencies
- Current `main`/feature branch compiles.
- Next.js 16 docs in `node_modules/next/dist/docs/` are consulted before changing framework-facing code.
- Convex guidelines are read before any Convex code is touched.

### Risk level
Low.

### Acceptance criteria
- Current behavior is documented with before screenshots for dashboard, habits, milestones, analytics, journal, settings/profile, and mobile nav.
- `npm run lint`, `npm run test`, and `npm run build` have a known baseline result.
- Existing `data-testid` and route URLs are preserved.
- Generated artifacts are not included in ordinary lint/code review noise.
- No production UI redesign code is introduced in this phase.

## Phase 1 — Space Theme Infrastructure

### Goal
Add the RPG space theme foundation while keeping the warm minimal theme available. Components should continue to work through token remapping before page-level redesigns begin.

### Files affected
- `app/globals.css`
- `app/layout.tsx`
- `components/providers/theme-provider.tsx`
- `components/layout/theme-toggle.tsx`
- `components/layout/topbar.tsx`
- `lib/clerk-appearance.ts`
- `components/ui/button.tsx`
- `components/ui/card.tsx`
- `components/ui/badge.tsx`
- `components/ui/input.tsx`
- `components/ui/textarea.tsx`
- `components/ui/switch.tsx`

### Dependencies
- Phase 0 baseline.
- Existing CSS custom-property architecture.
- Tailwind v4 `@theme inline` conventions.

### Risk level
Medium.

### Acceptance criteria
- New `space` and optional `space-light` theme tokens exist without deleting warm minimal tokens.
- Existing semantic tokens (`--bg-base`, `--text-primary`, `--accent`, etc.) map cleanly under the space theme.
- RPG tokens exist for `--space-*`, `--nebula-*`, `--stellar-*`, `--plasma-*`, `--ember-*`, gradients, shadows, and glows.
- Space Grotesk is loaded as `--font-display-rpg` without breaking current fonts.
- Theme selection can activate the space theme and persist it through reload.
- Clerk and shared primitives remain readable in light, dark, and space themes.

## Phase 2 — Animation Framework

### Goal
Introduce reusable, accessible RPG motion primitives before wiring animations into feature pages.

### Files affected
- `app/globals.css`
- `components/ui/confetti.tsx`
- `components/layout/page-transition.tsx`
- `components/rpg/xp-float.tsx`
- `components/rpg/level-up-overlay.tsx`
- `components/rpg/starfield-bg.tsx`
- `lib/utils.ts`

### Dependencies
- Phase 1 tokens and theme state.
- Existing `framer-motion` dependency.
- Existing `ConfettiProvider`.

### Risk level
Medium.

### Acceptance criteria
- CSS keyframes exist for `xp-float`, `level-up`, `shield-pulse`, `quest-complete`, `glow-breathe`, and `star-twinkle`.
- `prefers-reduced-motion` disables decorative/reward motion while preserving state changes.
- Starfield and ambient glow are subtle, non-interactive, and do not obscure content.
- Animation components are isolated under `components/rpg/`.
- No page depends on the new animation components yet except for safe preview/demo wiring if needed.

## Phase 3 — Dashboard Redesign

### Goal
Transform `/dashboard` into the "Mission Bridge" while preserving existing dashboard data sources and optimistic completion behavior.

### Files affected
- `app/(dashboard)/dashboard/page.tsx`
- `components/dashboard/up-next-card.tsx`
- `components/dashboard/todays-habits.tsx`
- `components/dashboard/weekly-heatmap.tsx`
- `components/StreakThread/*`
- `components/rpg/character-banner.tsx`
- `components/rpg/xp-bar.tsx`
- `components/rpg/quest-card.tsx`
- `components/rpg/xp-float.tsx`
- `hooks/use-habits.ts`
- `hooks/use-completions.ts`
- `hooks/use-weekly-goals.ts`
- `lib/streak-utils.ts`

### Dependencies
- Phase 1 theme tokens.
- Phase 2 animation primitives.
- Derived XP utility decisions from Phase 10 can be stubbed locally, but persistent leveling is not required yet.

### Risk level
High.

### Acceptance criteria
- Dashboard shows a character/level banner, active mission, today's quests, streak thread, and weekly mission log.
- Existing habit completion still uses the current optimistic Convex flow.
- Completed quest states show readable success treatment and preserve accessibility labels.
- XP shown on dashboard is derived from existing data or a temporary local helper, with no schema changes.
- Mobile layout remains usable with no overlapping text or controls.
- Existing dashboard empty/loading/error states still render.

## Phase 4 — Quest System UI

### Goal
Reframe habits as quests across the habit list and habit-related cards, without changing habit CRUD APIs or Convex schema.

### Files affected
- `app/(dashboard)/habits/page.tsx`
- `components/habits/habit-list.tsx`
- `components/habits/habit-card.tsx`
- `components/habits/habit-completion-button.tsx`
- `components/habits/habit-dialog.tsx`
- `components/habits/habit-form.tsx`
- `components/habits/habit-filters.tsx`
- `components/habits/habit-milestone-hint.tsx`
- `components/rpg/quest-card.tsx`
- `components/rpg/xp-float.tsx`
- `lib/nav-config.ts`

### Dependencies
- Phase 3 quest visual language.
- Existing habit mutation hooks.

### Risk level
Medium.

### Acceptance criteria
- Habit cards read visually as quest cards with time, XP preview, weekly objective progress, milestone hint, and completion state.
- Create/edit/delete/archive behavior is unchanged.
- Habit frequency and weekly goal controls remain clear.
- Completion animation is decorative and does not delay the data mutation.
- Existing habit colors remain useful as quest accents.
- Mobile swipe/tap behavior remains intact.

## Phase 5 — Streak Shield

### Goal
Replace generic streak badges/ribbons with the RPG "Streak Shield" visualization across dashboard, habits, analytics, and milestone-adjacent surfaces.

### Files affected
- `components/rpg/streak-shield.tsx`
- `components/ui/streak-ribbon.tsx`
- `components/habits/habit-streak-badge.tsx`
- `components/habits/habit-card.tsx`
- `components/dashboard/up-next-card.tsx`
- `components/analytics/streak-summary.tsx`
- `components/StreakThread/*`
- `hooks/use-streaks.ts`
- `lib/streak-utils.ts`

### Dependencies
- Phase 2 shield animation.
- Current client-side streak calculation.

### Risk level
Medium.

### Acceptance criteria
- Streak ranges map to the planned shield states: hidden, dim outline, solid ring, double ring, triple ring, and 30+ full shield.
- Shield uses icons/text/title labels so streak status is not color-only.
- `prefers-reduced-motion` disables pulse/rotating effects.
- Existing streak values are unchanged.
- Old `StreakRibbon` is either internally backed by `StreakShield` or retired only after all imports are migrated.

## Phase 6 — Achievements

### Goal
Redesign milestones as "Star Map Discoveries" with RPG reward presentation while preserving existing milestone award logic.

### Files affected
- `app/(dashboard)/milestones/page.tsx`
- `components/milestones/milestone-grid.tsx`
- `components/milestones/milestone-card.tsx`
- `components/ui/confetti.tsx`
- `components/rpg/xp-float.tsx`
- `lib/milestone-config.ts`
- `hooks/use-milestones.ts`
- `convex/milestones.ts` only if display data cannot be derived client-side

### Dependencies
- Phase 1 space cards/glows.
- Phase 2 reward animations.
- Phase 5 `StreakShield`.

### Risk level
Medium.

### Acceptance criteria
- Locked and unlocked milestone states match the plan: opacity/lock/progress for locked, gold glow/date/tier for unlocked.
- Tier badges are visually distinct and accessible.
- Existing milestone unlocks remain permanent and are not recalculated destructively.
- Confetti and XP burst only fire on new unlock events, not on every render.
- Habit selector behavior is unchanged.

## Phase 7 — Analytics

### Goal
Turn analytics into the "Ship Scanner" with scanner readouts, RPG-colored charts, and power rankings while preserving data accuracy.

### Files affected
- `app/(dashboard)/analytics/page.tsx`
- `components/analytics/weekly-chart.tsx`
- `components/analytics/streak-summary.tsx`
- `components/insights/metric-card.tsx`
- `components/insights/completion-bar-chart.tsx`
- `components/insights/completion-trend-chart.tsx`
- `components/insights/insight-card.tsx`
- `app/(dashboard)/insights/page.tsx`
- `components/rpg/streak-shield.tsx`
- `components/rpg/stat-radar.tsx` if shared scanner stats are introduced here
- `lib/insights.ts`

### Dependencies
- Phase 1 chart color tokens.
- Phase 5 `StreakShield`.
- Existing Recharts components.

### Risk level
Medium.

### Acceptance criteria
- Analytics stat cards become scanner readouts with Space Grotesk numbers and compact labels.
- Weekly chart uses nebula/space palette with readable axes/tooltips.
- Streak leaderboard becomes power rankings with shield indicators.
- Insights cards use Oracle styling without changing recommendation logic.
- Loading states remain visually compatible with the new surfaces.

## Phase 8 — Journal

### Goal
Reframe journal surfaces as "Captain's Log" while preserving one-entry-per-day upsert behavior and prompt flow.

### Files affected
- `app/(dashboard)/journal/page.tsx`
- `components/journal/reflection-prompt.tsx`
- `lib/journalPrompts.ts`
- `convex/journal.ts` only if display-only query shape proves insufficient
- `components/ui/textarea.tsx`
- `components/ui/card.tsx`

### Dependencies
- Phase 1 space inputs/cards.
- Existing journal query and mutation hooks.

### Risk level
Low.

### Acceptance criteria
- Journal page header, prompt cards, entry cards, and write area match Captain's Log styling.
- Auto-save/retry behavior is unchanged.
- Existing prompt rotation is unchanged.
- Empty, saving, saved, and error states remain clear.
- Journal entry content remains highly readable in the space theme.

## Phase 9 — Profile

### Goal
Add a "Character Sheet" layer to settings/profile using derived stats while keeping existing profile form fields and account management intact.

### Files affected
- `app/(dashboard)/settings/page.tsx`
- `components/profile/profile-avatar.tsx`
- `components/profile/profile-form.tsx`
- `components/profile/city-autocomplete.tsx`
- `components/delete-account-dialog.tsx`
- `components/rpg/stat-radar.tsx`
- `components/rpg/xp-bar.tsx`
- `hooks/use-current-user.ts`
- `hooks/use-user-profile.ts`
- `hooks/use-habits.ts`
- `hooks/use-completions.ts`
- `hooks/use-pomodoro.ts`
- `lib/streak-utils.ts`

### Dependencies
- Phase 1 form/control styling.
- Phase 7 stat-readout/radar direction.
- Phase 10 XP/level helper shape if already available.

### Risk level
Medium.

### Acceptance criteria
- Profile shows avatar, class, level, XP, rank, and derived RPG stats before the existing identity form.
- Existing profile update, avatar behavior, export, and delete account flows are unchanged.
- Stats are clearly labeled as derived/flavor and do not require schema changes.
- Danger zone retains high-contrast destructive styling.

## Phase 10 — Leveling System

### Goal
Centralize XP, level, class, and rank derivation so all RPG surfaces use consistent values. Keep it client-derived initially as specified.

### Files affected
- `lib/rpg/xp.ts`
- `lib/rpg/classes.ts`
- `lib/rpg/stats.ts`
- `hooks/use-rpg-progress.ts`
- `components/rpg/character-banner.tsx`
- `components/rpg/xp-bar.tsx`
- `components/rpg/level-up-overlay.tsx`
- `components/layout/sidebar.tsx`
- `components/layout/topbar.tsx`
- `components/layout/mobile-nav.tsx`
- `convex/schema.ts` only in a later caching follow-up, not initial delivery

### Dependencies
- Existing completions, milestones, pomodoro sessions, journal entries, and check-ins.
- Phase 3/6/7/9 consumers identified.

### Risk level
High.

### Acceptance criteria
- XP formula matches the redesign plan: habit completion, all-daily bonus, streak maintenance, milestone unlocks, pomodoro sessions, journal entry, and check-in.
- Level formula is `floor(sqrt(totalXP / 100))`.
- Character classes are flavor-only and derived from unlock conditions.
- A single hook exposes total XP, level, current level progress, next level target, class, and rank.
- No new Convex table is added in the first pass.
- Level-up overlay triggers only when crossing a level threshold in-session.

## Phase 11 — Polish

### Goal
Finish the visual system across lower-risk surfaces, navigation chrome, accessibility, and responsive behavior. Remove temporary compatibility seams after all consumers are migrated.

### Files affected
- `components/layout/sidebar.tsx`
- `components/layout/topbar.tsx`
- `components/layout/mobile-nav.tsx`
- `components/layout/offline-banner.tsx`
- `components/install-prompt.tsx`
- `app/(dashboard)/timeline/page.tsx`
- `components/timeline/*`
- `app/(dashboard)/calendar/page.tsx`
- `components/calendar/*`
- `app/(dashboard)/pomodoro/page.tsx`
- `components/pomodoro/*`
- `app/(auth)/*`
- `app/legal/*`
- `app/globals.css`
- `lib/nav-config.ts`
- `e2e/*`

### Dependencies
- Phases 1 through 10.
- Stable screenshots from Phase 0 for comparison.

### Risk level
Medium.

### Acceptance criteria
- Sidebar becomes Command Deck, topbar becomes Ship Status Bar, and mobile nav becomes Quick Access Dock.
- Timeline reads as Star Map, calendar as Mission Calendar, pomodoro as Training Chamber, settings as Ship Systems.
- Legal and auth pages remain calm and readable; only light thematic alignment is applied where appropriate.
- All interactive controls have visible focus states and non-color-only status indicators.
- Reduced-motion mode has no decorative animation.
- Desktop and mobile screenshots show no text overlap or broken layout.
- `npm run lint`, `npm run test`, `npm run build`, and relevant Playwright smoke tests pass or have documented known external blockers.

## Delivery Notes

- Prefer one small commit per component family or route subsection.
- Keep API and prop contracts stable unless a phase explicitly calls for a new isolated RPG component.
- Preserve routes, Convex schema, auth, push notifications, PWA manifest/service worker, legal pages, and existing test IDs.
- Implement visual infrastructure before page redesigns; implement derived leveling once enough consumers exist to validate the shared hook.
- Treat animations as progressive enhancement: state changes must remain clear without motion.
