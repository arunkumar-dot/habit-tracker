# HabitFlow Theme Refactor — Warm Minimal

You are refactoring the HabitFlow app from a generic dark indigo theme to a "Warm Minimal" light theme inspired by Things 3, Linear, and editorial design. Work through the phases in order. After each phase, stop and summarize what changed so I can review before you continue.

## Design principles (apply throughout)

1. **Warm, never cold** — off-white backgrounds with yellow undertones, charcoal (not black) text, terracotta accent.
2. **One accent color** — terracotta (#C2410C). No indigo, no purple, no gradients on buttons.
3. **Typography carries personality** — Instrument Serif for page titles and hero numbers, Inter for UI, JetBrains Mono for times/data.
4. **Subtle by default** — barely-there borders, minimal shadows, generous whitespace. Cards should feel earned, not uniform.
5. **Kill generic AI-template smells** — no emoji in UI chrome, no gradient buttons, no thick left color bars on cards, no pill backgrounds on inactive segmented controls.

## Phase 1 — Design tokens

Create or replace the global CSS variables / Tailwind theme config with these tokens. Support both light and dark mode (warm dark, not grey-black).

```css
:root {
  /* Neutrals */
  --bg-base: #FAF8F4;
  --bg-elevated: #FFFFFF;
  --bg-sunken: #F3EFE8;
  --bg-hover: #EFEAE1;

  /* Text */
  --text-primary: #1C1B18;
  --text-secondary: #57534E;
  --text-tertiary: #8A8680;
  --text-disabled: #B8B3AB;

  /* Borders */
  --border-subtle: #E8E3DA;
  --border-default: #D9D3C7;

  /* Accent (terracotta) */
  --accent: #C2410C;
  --accent-hover: #9A3412;
  --accent-soft: #FEF3EC;
  --accent-text: #7C2D12;

  /* Semantic */
  --success: #4D7C0F;
  --success-soft: #F3F7EB;
  --warning: #A16207;
  --warning-soft: #FBF5E7;
  --danger: #B91C1C;
  --danger-soft: #FBEDED;

  /* Habit category colors (desaturated, on-palette) */
  --habit-1: #C2410C; /* terracotta */
  --habit-2: #7C6F5C; /* mushroom */
  --habit-3: #4D7C0F; /* olive */
  --habit-4: #1E6091; /* muted teal */
  --habit-5: #9A3412; /* rust */

  /* Radii */
  --radius-sm: 6px;
  --radius-md: 10px;
  --radius-lg: 12px;
  --radius-xl: 16px;

  /* Shadows (warm, never cold grey) */
  --shadow-sm: 0 1px 2px rgba(28, 27, 24, 0.04);
  --shadow-md: 0 4px 12px rgba(28, 27, 24, 0.06);
  --shadow-lg: 0 12px 32px rgba(28, 27, 24, 0.08);
}

[data-theme="dark"] {
  --bg-base: #1A1614;
  --bg-elevated: #231E1B;
  --bg-sunken: #14100E;
  --bg-hover: #2A2522;

  --text-primary: #F5F1EA;
  --text-secondary: #C8C2B8;
  --text-tertiary: #8A8680;
  --text-disabled: #5A5550;

  --border-subtle: #2E2825;
  --border-default: #3D3631;

  --accent: #E86F3C;        /* lifted for dark mode contrast */
  --accent-hover: #F08558;
  --accent-soft: #3A2419;
  --accent-text: #FDB58C;
}
```

Update the Tailwind config (if Tailwind is in use) so these tokens are available as `bg-base`, `bg-elevated`, `text-primary`, `accent`, etc. Remove the existing indigo-centric color scheme entirely.

## Phase 2 — Typography

1. Add Google Fonts in the root HTML/layout file:
   - Instrument Serif (400, 400 italic)
   - Inter (400, 500, 600, 700)
   - JetBrains Mono (400, 500)
2. Set up font tokens:
```css
   --font-display: 'Instrument Serif', Georgia, serif;
   --font-sans: 'Inter', -apple-system, sans-serif;
   --font-mono: 'JetBrains Mono', ui-monospace, monospace;
```
3. Apply a type scale:
   - Page titles (`My Habits`, `Analytics`, `Calendar`, etc.): `font-display`, 40px, weight 400, line-height 1.1
   - Hero stat numbers (Analytics cards, timer): `font-display`, 56px, weight 400
   - Section headers: `font-sans`, 18px, weight 600
   - Habit names: `font-sans`, 16px, weight 500, capitalize first letter
   - Body: `font-sans`, 14px, weight 400
   - Meta labels: `font-sans`, 12px, weight 500, uppercase, letter-spacing 0.05em
   - Times/durations ("5:00–5:10 AM"): `font-mono`, 13px, weight 500
4. Apply `font-sans` as the default on body. Replace all existing hardcoded font references.

## Phase 3 — Core components

### Buttons

- **Primary**: solid `--accent` bg, white text, 10px radius, no gradient, no shadow by default. Hover: `--accent-hover`.
- **Secondary (ghost)**: transparent bg, 1px `--border-default` border, `--text-primary` text. Hover: `--bg-hover` bg.
- **Icon buttons**: 36x36, transparent, rounded-full, `--text-tertiary`. Hover: `--bg-hover` bg, `--text-primary` color.

### Inputs (search, profile fields)

- `--bg-sunken` background, no border
- 10px radius, 12px padding y, 16px padding x
- Focus: 1px `--accent` border, no outline ring

### Cards

- Base: `--bg-elevated` bg, 1px `--border-subtle` border, `--radius-lg`, `--shadow-sm`
- Hover: `--border-default` border, `--shadow-md`, translateY(-1px), 150ms transition
- **Remove the thick left-edge color bar on habit cards.** Replace with an 8px filled circle (using `--habit-N` color) placed beside the habit name.

### Segmented controls (All / Daily / Weekly, 7 days / 30 days)

- Inactive: transparent bg, `--text-secondary`, no border
- Active: `--text-primary` color, 2px bottom border in `--accent`, no pill background
- Drop all pill/filled-background treatments on these.

### Checkboxes (habit completion circles)

- 28px diameter, 1.5px border `--border-default`, transparent bg
- Completed: filled `--accent`, white check icon (lucide `Check`, 16px)
- Use the habit's category color for the border when uncompleted (subtle tint)

### Progress bars

- 3px tall, `--bg-sunken` track, `--accent` fill
- No gradient, no animation on fill except on value change

## Phase 4 — Signature element: the Streak Ribbon

Replace every 🔥 emoji with a custom `<StreakRibbon />` component.

Spec:
- Small rounded-rectangle badge, ~56px wide, 28px tall
- Background: linear gradient from `#C2410C` to `#E08A4B` (terracotta to amber)
- White text, number in `--font-display`, 16px, weight 400
- Tiny custom flame SVG on the left (not emoji — draw a simple 2-path flame)
- Rotated -3deg for personality
- Soft shadow: `0 2px 6px rgba(194, 65, 12, 0.25)`

Only show when streak >= 1. Below that, show nothing (don't show "0").

## Phase 5 — Page-specific changes

### Top bar (all pages)
- Remove the "Good afternoon, Anonymous 👋" greeting entirely.
- Replace with today's date in `--font-display` italic, 16px, `--text-secondary`. Example: *Wednesday, April 15*
- The "Reminders On" pill → convert to an icon-only bell (lucide `Bell`) with a 6px `--accent` dot indicator if reminders are on.
- Theme toggle stays as sun/moon icon.

### Sidebar
- Logo lockup: keep the bolt icon but swap the purple bg for `--accent`. "HabitFlow" in `--font-display`, 22px.
- Nav items: remove filled backgrounds on active. Active = `--accent` text + 2px left border in `--accent`. Inactive = `--text-secondary`.
- Drop the "v1.0" footer or move it to Profile page.

### Dashboard (`My Habits`)
- Page title in display serif, 40px.
- Kill the "Today" subtitle — redundant with the date in top bar.
- The missed-habit alerts: use `--warning-soft` bg, `--warning` left border (3px), `--text-primary` text. Not a full dark pill.
- "0 / 5 done" badge: remove the dark pill background, just show as `--text-tertiary` meta text.
- Habit cards per Phase 3 spec.

### Timeline
- Remove the vertical timeline line's indigo tint; use `--border-default`.
- Timeline dots: use the habit's `--habit-N` color, 10px, filled.
- "30m free" gap badges: `--bg-sunken` bg, `--text-tertiary` text, very subtle.
- Completed items: strikethrough stays, but apply 60% opacity to the whole card (not just the text).

### Calendar
- Replace the indigo "selected day" circle with `--accent` filled, white text.
- "Day with completions" indicator (the green dot under 13): use `--success`, 4px dot.
- Month header in `--font-display`, 20px.

### Analytics
- **Biggest win here.** The three stat cards ("5 Active Habits", "7 This Week", "20% Avg Completion") — make the numbers 64px in `--font-display`, weight 400. Labels underneath in meta style (uppercase, 12px, `--text-tertiary`). Remove the colored number treatment (currently indigo/green/orange) — all numbers in `--text-primary`, let the serif do the work.
- Bar chart: single `--accent` color for all bars, `--border-subtle` gridlines, `--text-tertiary` axis labels.
- Streak leaderboard: remove the trophy emoji, use lucide `Trophy` icon in `--text-tertiary`.

### Insights
- Same stat-card treatment as Analytics (big serif numbers, muted labels).
- Remove emoji on card headers (📊 ⭐ 😔 🔥 ⚡ ⏱️) — replace with lucide icons (`TrendingUp`, `Star`, `Frown`, `Flame`, `Zap`, `Timer`) in `--text-tertiary`, 18px.
- Charts: `--accent` for primary data, `--success` / `--warning` / `--danger` only for semantic meaning.

### Pomodoro
- Timer number: `--font-display`, 96px, weight 400, `--text-primary`.
- Progress ring: `--bg-sunken` track, `--accent` progress.
- Play button: `--accent` filled, white icon, `--shadow-md`. No glow/blur effect.
- Mode tabs (Focus / Short Break / Long Break): segmented control per Phase 3 spec.

### Milestones
- Remove the colored habit-filter pills; use segmented control style.
- Milestone cards: keep the lock icon, but replace the "BRONZE/SILVER/GOLD/PLATINUM" colored tags with uppercase meta text in `--text-tertiary`. Tier is communicated by the icon, not a colored tag.
- Locked state: 40% opacity on the whole card.
- Progress bar per Phase 3 spec.

### Profile
- Section cards use base card styling.
- "Male / Female / Other" selector: segmented control per Phase 3 spec (not filled pills).
- Location input: add lucide `MapPin` icon on the right in `--text-tertiary`.

## Phase 6 — Icon pass

Remove every emoji from the UI chrome and replace with lucide-react icons:
- 👋 → remove entirely
- 🌱 → `Sprout`
- 🔥 → handled by StreakRibbon component
- 📊 → `BarChart3`
- ⭐ → `Star`
- 😔 → `Frown`
- ⚡ → `Zap`
- ⏱️ → `Timer`
- 🏆 → `Trophy`
- 📍 → `MapPin`

Emojis stay allowed in **user-generated content** (habit names, bios) — only remove from chrome.

## Phase 7 — Final polish

1. Capitalize habit names in display ("wake up" → "Wake up"). Don't change the stored value — do it with CSS `::first-letter` or a display helper.
2. Add a subtle paper-grain texture to `--bg-base` using an inline SVG noise pattern at 3% opacity. Keep it very subtle — it should read as warmth, not texture.
3. Audit all `transition` properties — use `150ms ease` as the default, `200ms ease` for larger movements. No 300ms+ transitions.
4. Verify dark mode works end-to-end with the warm dark tokens.
5. Run through every page and confirm: no indigo remains anywhere, no emoji in chrome, all page titles in serif, all stat numbers in serif.

## Deliverable

After all phases, provide:
1. A summary of files changed
2. Any places where you made a judgment call that I should review
3. Screenshots or a list of pages to manually QA

## Rules

- **Do not change functionality.** This is a visual refactor only. Routes, state, data flow, component APIs stay identical.
- **Preserve accessibility.** All color combinations must meet WCAG AA (4.5:1 for body text, 3:1 for large text). Verify the terracotta on off-white passes.
- **Commit after each phase** with a message like `refactor(theme): phase 3 — core components`.
- If any token or spec conflicts with an existing constraint in the codebase, stop and ask before improvising.