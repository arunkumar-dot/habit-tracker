# Phase 2 Report — Animation Framework

## Scope

Implemented only Phase 2 from `IMPLEMENTATION_ROADMAP.md`: a reusable RPG motion framework for future screens. No dashboard, habits, analytics, journal, profile, Convex, Clerk, backend logic, or API contract redesign work was started.

## Motion Architecture

Phase 2 adds two isolated component namespaces:

- `components/animations/` for shared motion tokens, reduced-motion handling, and route/page transition primitives.
- `components/rpg/` for reusable RPG animation and reward primitives that future phases can compose into redesigned screens.

The existing dashboard `PageTransition` import path remains valid. `components/layout/page-transition.tsx` now delegates to the shared animation primitive so existing layout behavior is preserved while future screens can import from `components/animations`.

CSS keyframes live in `app/globals.css` because they are token-driven global utilities:

- `xp-float`
- `level-up`
- `shield-pulse`
- `quest-complete`
- `glow-breathe`
- `star-twinkle`

## New Components

- `AnimatedCard` — motion-enabled card shell with optional hover lift.
- `FloatingCard` — glass-style elevated card with optional RPG glow.
- `GlowButton` — token-driven animated reward button.
- `XPFloat` — floating `+XP` reward label.
- `ProgressRing` — SVG progress ring with animated stroke offset.
- `MissionCompleteAnimation` — completion flash overlay for quest/card surfaces.
- `AchievementUnlockAnimation` — reusable achievement notification block.
- `LevelUpOverlay` — full-screen level-up celebration overlay.
- `StreakShieldAnimation` — shield pulse wrapper for future streak shield UI.
- `StarfieldBg` — subtle CSS starfield background layer.
- `PageTransition` — shared reduced-motion-aware page transition.

## New Hooks

- `useMotionPreference` wraps Framer Motion's `useReducedMotion()` and exposes:
  - `prefersReducedMotion`
  - `shouldReduceMotion`

This keeps reduced-motion checks consistent across the RPG primitives.

## New Utilities

- `motionDurations` — shared duration scale for UI, reward, ambient, and celebration motion.
- `motionEasings` — standard, emphasized, reward, and exit easing curves.
- `motionSprings` — gentle, responsive, reward, and overlay spring presets.
- `motionStaggers` — tight, list, and reward stagger presets.
- Shared Framer Motion variants:
  - `pageTransitionVariants`
  - `cardMotionVariants`
  - `floatingCardVariants`

## Performance Considerations

- Motion is GPU-friendly: primitives animate `transform`, `opacity`, and SVG stroke offset instead of layout-affecting properties.
- Components use `will-change` only on animated elements and drop it in reduced-motion mode.
- Ambient starfield is CSS-only and non-interactive.
- Decorative/reward motion is disabled under `prefers-reduced-motion: reduce`.
- State changes remain visible without animation, including progress ring value, mission completion overlays, and achievement text.
- No screen-level wiring was added, so the framework does not add runtime animation cost to dashboard, habits, analytics, journal, or profile redesigns yet.

## Verification

- `npm run lint` passed with the existing 24 warnings and 0 errors.
- `npm run test` passed: 1 test file, 11 tests.
- `npm run build` passed and generated 20 static app routes.

## Not Done

- No dashboard redesign.
- No quest card rollout.
- No analytics, journal, profile, or habits redesign.
- No Convex/backend/schema changes.
- No Clerk changes.
- No API contract changes.
