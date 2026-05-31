# HabitFlow — Design System

> Warm minimalism. Every color leans warm, every shadow has a hint of terracotta, every screen feels like paper.

---

## Identity

| Property | Value |
|----------|-------|
| App name | **HabitFlow** |
| Tagline | Build Better Habits |
| App ID | `com.tryhabitflow.app` |
| Production URL | `https://tryhabitflow.com` |
| Platform | Next.js 16 + React 19 + Capacitor 8 (Android) |
| Primary accent | Terracotta `#C2410C` |
| Base background | Warm cream `#FAF8F4` |

---

## Color System

All colors are CSS custom properties applied to `:root` (light) and `[data-theme="dark"]`.

### Light Mode

| Token | Value | Usage |
|-------|-------|-------|
| `--bg-base` | `#FAF8F4` | Page background |
| `--bg-elevated` | `#FFFFFF` | Cards, modals |
| `--bg-sunken` | `#F3EFE8` | Inputs, code blocks |
| `--bg-hover` | `#EFEAE1` | Hover states |
| `--text-primary` | `#1C1B18` | Body text |
| `--text-secondary` | `#57534E` | Supporting text |
| `--text-tertiary` | `#8A8680` | Placeholders, captions |
| `--text-disabled` | `#B8B3AB` | Disabled states |
| `--border-subtle` | `#E8E3DA` | Dividers |
| `--border-default` | `#D9D3C7` | Input borders |
| `--accent` | `#C2410C` | Buttons, links, highlights |
| `--accent-hover` | `#9A3412` | Accent hover |
| `--accent-soft` | `#FEF3EC` | Accent background tint |
| `--accent-text` | `#7C2D12` | Text on accent-soft |
| `--success` | `#4D7C0F` | Completion states |
| `--warning` | `#A16207` | Warnings |
| `--danger` | `#B91C1C` | Destructive actions |

### Dark Mode

| Token | Value | Notes |
|-------|-------|-------|
| `--bg-base` | `#1A1614` | Warm near-black (not grey) |
| `--bg-elevated` | `#231E1B` | |
| `--bg-sunken` | `#14100E` | |
| `--text-primary` | `#F5F1EA` | Warm white |
| `--accent` | `#E86F3C` | Lifted for contrast |
| `--accent-text` | `#FDB58C` | |

### Habit Category Colors

Five fixed colors for habit categorisation — used across cards, charts, and the timeline.

| Token | Light | Dark |
|-------|-------|------|
| `--habit-1` | `#C2410C` | `#E86F3C` |
| `--habit-2` | `#7C6F5C` | `#9C8E7A` |
| `--habit-3` | `#4D7C0F` | `#7BAF2E` |
| `--habit-4` | `#1E6091` | `#3A8BC2` |
| `--habit-5` | `#9A3412` | `#C2513A` |

Available as Tailwind utilities: `bg-habit-1`, `text-habit-2`, etc.

### Shadows

Shadows use warm tints — never neutral grey.

| Token | Value |
|-------|-------|
| `--shadow-sm` | `0 1px 2px rgba(28,27,24,0.04)` |
| `--shadow-md` | `0 4px 12px rgba(28,27,24,0.06)` |
| `--shadow-lg` | `0 12px 32px rgba(28,27,24,0.08)` |

---

## Typography

Fonts are loaded via `next/font/google` and exposed as CSS variables.

| Variable | Font | Weights |
|----------|------|---------|
| `--nf-display` | Instrument Serif | 400 |
| `--nf-sans` | Inter | 400 500 600 700 |
| `--nf-mono` | JetBrains Mono | 400 500 |

### Type Scale

| Class | Font | Size | Weight | Usage |
|-------|------|------|--------|-------|
| `.type-page-title` | Instrument Serif | 40px | 400 | Page headings |
| `.type-hero-number` | Instrument Serif | 56px | 400 | Analytics stats, timer |
| `.type-section-header` | Inter | 18px | 600 | Section headers |
| `.type-habit-name` | Inter | 16px | 500 | Habit titles |
| `.type-body` | Inter | 14px | 400 | Default body text |
| `.type-meta-label` | Inter | 12px | 500 | Tags, labels (uppercase) |
| `.type-time-data` | JetBrains Mono | 13px | 500 | Times, durations |

---

## Spacing & Shape

### Border Radius

| Token | Value |
|-------|-------|
| `--radius-sm` | `6px` |
| `--radius-md` | `10px` |
| `--radius-lg` | `12px` |
| `--radius-xl` | `16px` |
| `--radius-2xl` | `20px` |

### Card Padding

| Variant | Value |
|---------|-------|
| `none` | 0 |
| `sm` | 12px |
| `md` | 16px (default) |
| `lg` | 24px |

---

## Layout

### Shell Structure

```
┌─────────────────────────────────────────┐
│  Sidebar (desktop, w-16 collapsed / w-60 expanded)   │
├─────────────────────────────────────────┤
│  Topbar (mobile + desktop)              │
├─────────────────────────────────────────┤
│  Main content  (max-w-3xl, px-4 lg:px-6, py-6)      │
│                                         │
├─────────────────────────────────────────┤
│  MobileNav bottom bar (mobile only)     │
└─────────────────────────────────────────┘
```

- Mobile bottom nav requires `pb-28` on the main content area
- Desktop sidebar collapses to icon-only rail (`w-16`) or expands to full (`w-60`)

### Pages

| Route | Description |
|-------|-------------|
| `/dashboard` | Today's habits, up-next, weekly heatmap |
| `/habits` | Habit list & management |
| `/calendar` | Calendar view of completions |
| `/timeline` | Timeline visualisation of the day |
| `/analytics` | Stats & completion rates |
| `/insights` | Deep analysis |
| `/journal` | Habit journalling |
| `/milestones` | Achievement tracking |
| `/pomodoro` | Pomodoro timer |
| `/settings` | User preferences |
| `/admin/reminders` | Admin reminder panel |
| `/sign-in` | Clerk auth (embedded) |
| `/sign-up` | Clerk auth (embedded) |

---

## Theme System

- **Storage**: `localStorage` key `theme` → `"light"` or `"dark"`
- **DOM**: `data-theme="dark"` on `<html>`
- **Flash prevention**: Inline synchronous script in `<head>` reads localStorage before React hydrates
- **Hook**: `useTheme()` → `{ theme, toggleTheme }`

---

## Component Patterns

### Cards

Three variants:

| Variant | Style |
|---------|-------|
| `default` | Subtle border, `--shadow-sm` |
| `elevated` | `--shadow-md`, no border |
| `bordered` | `--border-default`, no shadow |

Hoverable cards: `translateY(-1px)` + stronger shadow on `:hover`.

### Segmented Controls

`.seg-btn` — bottom-border indicator pattern.
Active: terracotta underline (`--accent`), 600 weight.
Padding: 6px 12px, 13px font size.

### Animations

| Class | Description |
|-------|-------------|
| `.animate-shimmer` | Loading skeleton (1.5s) |
| `.animate-pulse-ring` | Expanding ring pulse (2s) |
| `.animate-spin-slow` | Slow rotate (1s) |

Completion tap triggers a `completion-ripple` keyframe: scale 1 → 2.4 with opacity fade.

### Paper Grain Texture

`body::before` — SVG fractal noise at 3% opacity, `z-index: 9998`. Adds warmth without being visible as a pattern.

### Scrollbar

Webkit custom scrollbar: 6px wide, warm-tinted thumb, matches `--bg-sunken` track.

---

## Clerk Auth Appearance

The `clerkDarkAppearance` config in `lib/clerk-appearance.ts` applies the HabitFlow palette to all Clerk UI components.

| Property | Value |
|----------|-------|
| Primary | `#E86F3C` (lifted terracotta) |
| Background | `#1A1614` |
| Input background | `#14100E` |
| Text | `#F5F1EA` |
| Border | `1px solid #3D3631` |
| Card shadow | `0 25px 50px rgba(0,0,0,0.5)` |
| Card padding | `2rem` |

Social/OAuth dividers hidden — email+password flow only in the embedded component.

---

## Android / Capacitor

### Splash Screen

| Property | Value |
|----------|-------|
| Background | `#FAF8F4` |
| Auto-hide | `false` (hidden programmatically) |
| Fade out | 400ms |
| Immersive | Full screen |
| Hide trigger | After Clerk `isLoaded` resolves (`CapacitorSplashHider`) |

### Status Bar

```
Style: Light (dark icons on light background)
Background: #FAF8F4
```

### WebView Background

`#FAF8F4` set in `android/app/src/main/res/values/colors.xml` and applied via `AppTheme.NoActionBar` — prevents black flash on launch and relaunch.

### Auth Navigation

Clerk auth domains kept inside the WebView via `allowNavigation`:
- `*.clerk.accounts.dev`
- `*.clerk.com`
- `accounts.google.com` / `*.google.com`
- `github.com`

Android App Links configured via `/.well-known/assetlinks.json` to route `tryhabitflow.com` URLs back into the app.

---

## PWA

| Property | Value |
|----------|-------|
| Display | `standalone` |
| Background | `#FAF8F4` |
| Theme color | `#C2410C` |
| Orientation | `portrait-primary` |
| Icons | 192×192, 512×512 PNG |

iOS splash screens defined for iPhone SE → iPhone 16 Pro Max and iPad Pro / Air / mini.

---

## Component Library

| Library | Usage |
|---------|-------|
| Radix UI (via shadcn/ui) | Primitives — Dialog, Dropdown, Switch, Tabs |
| Recharts | Charts — streaks, completions, analytics |
| Lucide React | Icons (18–20px in nav, 16px inline) |
| Framer Motion | Page transitions, completion animations |
| Class Variance Authority | Component variant definitions |
| React Hook Form + Zod | Form handling and validation |

---

## Design Principles

1. **Warm over cold** — no neutral greys; all neutrals lean warm
2. **Semantic scale** — seven named type styles, not arbitrary sizes
3. **Mobile-first** — bottom nav, safe area padding, no forced scrolling
4. **Token-driven** — all values are variables; light/dark is a single attribute swap
5. **Habit colour coding** — 5-colour fixed palette for visual categorisation
6. **Human texture** — paper grain overlay at 3% opacity reinforces warmth
7. **Accessibility** — `userScalable: false` for native app feel; colour contrast maintained across both themes
