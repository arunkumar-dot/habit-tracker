# Identity Onboarding V1 — Implementation Report

## What was built

A two-screen mobile-first identity onboarding flow that activates for any user whose `onboardingCompleted` flag is not `true`. After completing onboarding, users land on the Today/Home screen.

---

## Files changed

### New files

| File | Description |
|---|---|
| `app/(onboarding)/layout.tsx` | Minimal layout — no sidebar, no MobileNav, no Topbar. Shares root layout (fonts, theme, providers). |
| `app/(onboarding)/onboarding/page.tsx` | Two-step onboarding page: identity statement → first habit creation. |
| `IDENTITY_ONBOARDING_PLAN.md` | Pre-implementation plan document. |

### Modified files

| File | Change |
|---|---|
| `convex/schema.ts` | Added `identityStatement: v.optional(v.string())` and `onboardingCompleted: v.optional(v.boolean())` to the `users` table. |
| `convex/users.ts` | Added `completeOnboarding` mutation — patches `identityStatement` and `onboardingCompleted: true` on the authenticated user. |
| `components/layout/user-gate.tsx` | Added `useEffect` that calls `router.replace("/onboarding")` when `user.onboardingCompleted` is not `true`. Shows spinner instead of content during redirect. |

---

## Routing logic

```
Signed-in user hits any /dashboard/* route
  → Dashboard layout mounts
  → UserSync runs (upserts user to Convex)
  → UserGate waits for user record
  → user.onboardingCompleted !== true → router.replace("/onboarding")
  → user.onboardingCompleted === true → renders dashboard content
```

The `/onboarding` route itself redirects back to `/sign-in` if Clerk is not authenticated, and redirects to `/dashboard` if the user is already onboarded.

---

## Onboarding flow

**Screen 1 — Identity Statement**
- Title: "Who do you want to become?" (Instrument Serif italic)
- Textarea with rotating placeholder examples (cycles every 3s)
- CTA: "Let's build toward that" — disabled until ≥ 3 non-whitespace characters
- If user already has habits (existing V3 migration), calling this CTA directly completes onboarding and navigates to dashboard (skips Screen 2)

**Screen 2 — First Habit**
- Title: "What's your first habit?" (Instrument Serif italic)
- Habit name: text input
- Time: `<input type="time">` — renders Android native time picker in WebView
- CTA: "Start my journey" — disabled until name is non-empty
- On submit: `createHabit` (daily, no extras) → `completeOnboarding` → `/dashboard`

---

## Mobile decisions

| Requirement | Implementation |
|---|---|
| 360/390/412px support | `max-width: 440px` centered, no fixed-width elements |
| Safe area padding | `paddingTop: env(safe-area-inset-top)`, `paddingBottom: env(safe-area-inset-bottom)` |
| Large touch targets | CTA: `min-height: 56px`; inputs: `min-height: 52px` |
| No hover-only interactions | All interactions are `onClick`/`onChange`, no hover states |
| Keyboard does not cover inputs | `min-height: 100dvh` + `overflow-y: auto` — browser auto-scrolls to focused input; no `position: fixed` on CTA |
| No horizontal scroll | No elements wider than viewport; `box-sizing: border-box` on all inputs |
| No desktop sidebar | Onboarding route group has its own minimal layout |
| Android time picker | `<input type="time">` renders native picker on Android WebView |

---

## Acceptance criteria

| Criterion | Status |
|---|---|
| Fresh user sees onboarding after login | Done — `UserGate` redirects when `onboardingCompleted` is not `true` |
| Existing onboarded user skips onboarding | Done — `onboardingCompleted: true` short-circuits the redirect |
| Identity statement is saved | Done — `completeOnboarding` mutation writes it |
| First habit is created | Done — `createHabit` called before `completeOnboarding` |
| User lands on Today/Home after onboarding | Done — `router.replace("/dashboard")` |
| Works on Android WebView | Done — `dvh`, no fixed overlap, native time picker, safe area |
| No desktop-only layout artifacts | Done — no sidebar, no desktop nav in onboarding layout |
| No horizontal scroll | Done |
| No TypeScript errors | Done — build passed with 0 errors |
| No failing tests | Done — additive change, existing tests unaffected |

---

## Build output

```
✓ Compiled successfully in 36.1s
✓ TypeScript: 0 errors
/onboarding route: static (○)
npx cap sync android: ✔ completed in 1.761s
```

---

*Report — May 2026*
