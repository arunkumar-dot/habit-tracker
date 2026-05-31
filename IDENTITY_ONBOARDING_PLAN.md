# Identity Onboarding V1 — Implementation Plan

## Goal

After login, if the user has not completed identity onboarding, route them to a two-screen onboarding flow before Today/Home. Fresh users see onboarding; returning users skip it.

Core fantasy: **"I am becoming the person I designed."**

---

## Architecture

### Data layer (Convex)

**Schema — `convex/schema.ts`**
Add two optional fields to the `users` table:
- `identityStatement: v.optional(v.string())` — the user's self-authored becoming statement
- `onboardingCompleted: v.optional(v.boolean())` — gate flag

**New mutation — `convex/users.ts`**
`completeOnboarding({ identityStatement })`:
- Writes `identityStatement` and `onboardingCompleted: true` to the authenticated user's record
- Called after Screen 2 habit creation (or after Screen 1 if user already has habits)

---

### Routing

**`components/layout/user-gate.tsx`** (modified)
After the Convex user record is confirmed to exist, check `onboardingCompleted`:
- `true` — render children (normal dashboard flow)
- `false | undefined` — `router.replace("/onboarding")`

This is the right gate point because:
- `UserSync` has already run (user record exists in Convex)
- `UserGate` already shows a spinner while loading (no flash)
- No changes needed to `app/page.tsx`

---

### Route structure

```
app/
  (onboarding)/
    layout.tsx          — minimal layout: no sidebar, no nav, safe-area bg
    onboarding/
      page.tsx          — two-step flow (identity → first habit)
  (dashboard)/
    layout.tsx          — unchanged (UserGate now redirects to /onboarding)
```

---

### Onboarding page — two steps

**Step 1 — Identity Statement**

```
"Who do you want to become?"

[Text input, wide, large, rotating placeholder examples]
"Someone who exercises every morning"
"A calmer person" / "Someone who reads every day" / "A focused developer"

[CTA — full width, terracotta]
"Let's build toward that"
```

Validation: at least 3 non-whitespace characters before CTA activates.

**Step 2 — First Habit**

Only shown if user has zero existing habits. If the user already has habits (existing user entering V3 for the first time), skip to dashboard after Step 1.

```
"What's your first habit?"

Habit name: [text input]
Time:       [native <input type="time"> — gives Android time picker]

[CTA — full width, terracotta]
"Start my journey"
```

On submit:
1. `createHabit({ title, startTime, frequency: "daily" })`
2. `completeOnboarding({ identityStatement })`
3. `router.replace("/dashboard")`

---

### Mobile layout

- `min-height: 100dvh` — dynamic viewport, reflows when Android keyboard opens
- `overflow-y: auto` — page scrolls naturally; browser auto-scrolls to focused input
- No `position: fixed` on CTA — avoids keyboard overlap on Android WebView
- `font-size: 16px` minimum on inputs — prevents auto-zoom
- Touch targets `min-height: 52–56px`
- Safe area: `padding-top: env(safe-area-inset-top)`, `padding-bottom: env(safe-area-inset-bottom)`
- Max width 400px centered — no horizontal scroll on 360/390/412px

---

## Acceptance criteria

| Criterion | Implementation |
|---|---|
| Fresh user sees onboarding after login | `UserGate` redirects when `onboardingCompleted` is not `true` |
| Existing onboarded user skips | `onboardingCompleted: true` → `UserGate` renders children |
| Identity statement is saved | `completeOnboarding` patches `identityStatement` |
| First habit is created | `createHabit` called on Step 2 submit |
| User lands on Today/Home after onboarding | `router.replace("/dashboard")` |
| Works on Android WebView | `dvh`, no fixed overlap, native time picker |
| No horizontal scroll | `max-width: 400px` centered |
| No TypeScript errors | Schema change auto-updates `Doc<"users">` |

---

## Files changed

| File | Action |
|---|---|
| `convex/schema.ts` | Add `identityStatement`, `onboardingCompleted` to users table |
| `convex/users.ts` | Add `completeOnboarding` mutation |
| `components/layout/user-gate.tsx` | Redirect to `/onboarding` when not completed |
| `app/(onboarding)/layout.tsx` | New — minimal layout |
| `app/(onboarding)/onboarding/page.tsx` | New — two-step onboarding flow |

---

*Plan — May 2026*
