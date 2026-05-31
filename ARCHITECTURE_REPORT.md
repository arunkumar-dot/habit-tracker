# HabitFlow — Architecture Report

> Comprehensive analysis of the codebase as of `2026-05-31`, branch `feature/rpg-space-ui-redesign`.
> Purpose: serve as a map for the RPG space UI redesign initiative.

---

## 1. Route Structure

### App Router Layout

```
app/
├── layout.tsx                         ← Root layout (fonts, metadata, ProvidersWrapper)
├── page.tsx                           ← / — redirect to /dashboard or /sign-in
├── globals.css                        ← Design tokens + type scale + utility classes
├── not-found.tsx                      ← 404 page
├── global-error.tsx                   ← Sentry error boundary
├── icon.svg                           ← Favicon
│
├── (auth)/                            ← Auth route group (no shell)
│   ├── sign-in/[[...sign-in]]/page.tsx
│   └── sign-up/[[...sign-up]]/page.tsx
│
├── (dashboard)/                       ← Authenticated route group (shell layout)
│   ├── layout.tsx                     ← Dashboard shell (sidebar + topbar + mobile nav)
│   ├── error.tsx                      ← Error boundary for dashboard routes
│   ├── dashboard/page.tsx             ← /dashboard — UpNextCard + TodaysHabits + WeeklyHeatmap
│   ├── habits/page.tsx                ← /habits — habit list & CRUD
│   ├── timeline/page.tsx              ← /timeline — vertical timeline of daily habits
│   ├── calendar/page.tsx              ← /calendar — monthly grid + day detail panel
│   ├── analytics/page.tsx             ← /analytics — charts + streak summaries
│   ├── insights/page.tsx              ← /insights — intelligence dashboard
│   ├── journal/page.tsx               ← /journal — daily reflection + prompts
│   ├── pomodoro/page.tsx              ← /pomodoro — timer + session tracking
│   ├── milestones/page.tsx            ← /milestones — achievement grid
│   ├── settings/page.tsx              ← /settings — profile, export, delete account
│   └── admin/reminders/page.tsx       ← /admin/reminders — dev-only FCM testing
│
├── legal/                             ← Public route group (no auth)
│   ├── privacy/page.tsx
│   └── terms/page.tsx
│
├── sentry-test/                       ← Sentry integration test page
│
└── api/                               ← API routes
    └── firebase-messaging-sw/route.ts ← Dynamic service worker endpoint
```

### Route → Component Map

| Route | Page Component | Primary Children |
|-------|---------------|------------------|
| `/dashboard` | `DashboardPage` | `UpNextCard`, `TodaysHabits`, `WeeklyHeatmap` |
| `/habits` | `HabitsPage` | `HabitList`, `HabitCard`, `HabitDialog`, `HabitFilters` |
| `/timeline` | `TimelinePage` | `TimelineView` → `TimelineItem`, `TimelineGap`, `TimelineNowIndicator` |
| `/calendar` | `CalendarPage` | `HabitCalendar`, `MonthGrid`, `DayDetailPanel`, `MonthStats` |
| `/analytics` | `AnalyticsPage` | `WeeklyChart`, `StreakSummary` |
| `/insights` | `InsightsPage` | `MetricCard`, `CompletionBarChart`, `CompletionTrendChart`, `InsightCard` |
| `/journal` | `JournalPage` | `ReflectionPrompt` |
| `/pomodoro` | `PomodoroPage` | `PomodoroTimer`, `ModeSelector`, `TimerControls`, `SessionCounter`, `HabitSelector`, `DurationSettings` |
| `/milestones` | `MilestonesPage` | `MilestoneGrid`, `MilestoneCard` |
| `/settings` | `SettingsPage` | `ProfileAvatar`, `ProfileForm`, `CityAutocomplete`, `DeleteAccountDialog` |

---

## 2. App Shell & Component Hierarchy

### Provider Tree (root → leaf)

```
RootLayout (app/layout.tsx)
  ├── <head> inline themeInitScript (flash prevention)
  ├── CapacitorInit
  └── ProvidersWrapper
      └── AppProviders
          ├── ClerkProvider
          │   ├── CapacitorSplashHider
          │   ├── SentryUserContext
          │   ├── ServiceWorkerProvider
          │   └── ConvexClientProvider
          │       └── ThemeProvider
          │           └── {children} ← pages
```

### Dashboard Shell (app/(dashboard)/layout.tsx)

```
ToastProvider (keyed on user.id — remounts on user switch)
  └── ConfettiProvider
      ├── UserSync (Clerk → Convex user upsert)
      └── NotificationProvider
          └── <div className="flex h-full">
              ├── Sidebar (desktop: w-16 collapsed / w-60 expanded)
              └── <div> (flex-1 main column)
                  ├── OfflineBanner
                  ├── Topbar (date, theme toggle, notifications, UserButton)
                  ├── InstallPrompt (PWA)
                  └── <main> (overflow-y-auto, pb-28 mobile)
                      └── <div> (max-w-3xl mx-auto px-4 lg:px-6 py-6)
                          └── UserGate
                              └── PageTransition (framer-motion fade-up)
                                  └── {children} ← page content
                      └── Footer
              └── MobileNav (floating pill bar + "More" drawer via vaul)
```

### Navigation Architecture

| Location | Component | Pattern |
|----------|-----------|---------|
| Desktop | `Sidebar` | Collapsible rail (w-16) ↔ full (w-60), accent left-border active state |
| Mobile primary | `MobileNav` | Floating pill bottom bar, 5 primary tabs |
| Mobile secondary | `MobileNav` (Drawer) | `vaul` bottom sheet with 3-col grid of remaining routes |
| Config | `lib/nav-config.ts` | `NAV_ITEMS[]`, `PRIMARY_NAV[]`, `MORE_NAV[]` — single source of truth |

**Primary mobile tabs:** Dashboard, Habits, Timeline, Pomodoro, Journal
**More drawer:** Calendar, Analytics, Insights, Milestones, Settings

---

## 3. Design System

### Color Tokens (CSS Custom Properties)

All colors live in `app/globals.css` as CSS custom properties on `:root` (light) and `[data-theme="dark"]`.

#### Light Mode Palette

| Token | Hex | Role |
|-------|-----|------|
| `--bg-base` | `#FAF8F4` | Page background (warm cream) |
| `--bg-elevated` | `#FFFFFF` | Cards, modals |
| `--bg-sunken` | `#F3EFE8` | Inputs, code blocks, tracks |
| `--bg-hover` | `#EFEAE1` | Hover states |
| `--text-primary` | `#1C1B18` | Body text (warm charcoal) |
| `--text-secondary` | `#57534E` | Supporting text |
| `--text-tertiary` | `#8A8680` | Placeholders, captions |
| `--text-disabled` | `#B8B3AB` | Disabled states |
| `--border-subtle` | `#E8E3DA` | Dividers, card borders |
| `--border-default` | `#D9D3C7` | Input borders |
| `--accent` | `#C2410C` | Primary accent (terracotta) |
| `--accent-hover` | `#9A3412` | Accent hover |
| `--accent-soft` | `#FEF3EC` | Accent tint background |
| `--accent-text` | `#7C2D12` | Text on accent-soft |
| `--success` | `#4D7C0F` | Completion, positive states |
| `--warning` | `#A16207` | Warnings |
| `--danger` | `#B91C1C` | Destructive actions |

#### Dark Mode Palette

| Token | Hex | Delta |
|-------|-----|-------|
| `--bg-base` | `#1A1614` | Warm near-black |
| `--bg-elevated` | `#231E1B` | — |
| `--accent` | `#E86F3C` | Lifted for contrast |
| `--accent-text` | `#FDB58C` | — |
| `--text-primary` | `#F5F1EA` | Warm white |

#### Habit Category Colors (5 fixed)

| Token | Light | Dark | Name |
|-------|-------|------|------|
| `--habit-1` | `#C2410C` | `#E86F3C` | Terracotta |
| `--habit-2` | `#7C6F5C` | `#9C8E7A` | Mushroom |
| `--habit-3` | `#4D7C0F` | `#7BAF2E` | Olive |
| `--habit-4` | `#1E6091` | `#3A8BC2` | Muted Teal |
| `--habit-5` | `#9A3412` | `#C2513A` | Rust |

### Typography

Fonts loaded via `next/font/google` in `app/layout.tsx`, exposed as CSS variables:

| Variable | Font | Weights | Role |
|----------|------|---------|------|
| `--nf-display` / `--font-display` | Instrument Serif | 400, 400i | Page titles, hero numbers, "today" labels |
| `--nf-sans` / `--font-sans` | Inter | 400, 500, 600, 700 | Body, UI text, section headers |
| `--nf-mono` / `--font-mono` | JetBrains Mono | 400, 500 | Times, durations, data labels |

#### Type Scale (CSS utility classes)

| Class | Font | Size | Weight | Usage |
|-------|------|------|--------|-------|
| `.type-page-title` | Instrument Serif | 40px | 400 | Page headings (h1) |
| `.type-hero-number` | Instrument Serif | 56px | 400 | Analytics stats, timer display |
| `.type-section-header` | Inter | 18px | 600 | Section headers |
| `.type-habit-name` | Inter | 16px | 500 | Habit titles (auto `::first-letter` uppercase) |
| `.type-body` | Inter | 14px | 400 | Default body text |
| `.type-meta-label` | Inter | 12px | 500 | Tags, labels (uppercase, 0.05em spacing) |
| `.type-time-data` | JetBrains Mono | 13px | 500 | Times, durations |
| `.cap-first` | — | — | — | `::first-letter` uppercase helper |

### Spacing & Shape

| Token | Value |
|-------|-------|
| `--radius-sm` | 6px |
| `--radius-md` | 10px |
| `--radius-lg` | 12px |
| `--radius-xl` | 16px |
| `--radius-2xl` | 20px |

### Shadows (warm-tinted, never cold grey)

| Token | Value |
|-------|-------|
| `--shadow-sm` | `0 1px 2px rgba(28, 27, 24, 0.04)` |
| `--shadow-md` | `0 4px 12px rgba(28, 27, 24, 0.06)` |
| `--shadow-lg` | `0 12px 32px rgba(28, 27, 24, 0.08)` |

Utility classes: `.shadow-warm-sm`, `.shadow-warm-md`, `.shadow-warm-lg`

---

## 4. Theme Architecture

### Theme Switching Mechanism

1. **Flash prevention:** Inline `<script>` in `<head>` reads `localStorage.theme` synchronously before React hydration. Sets `data-theme="dark"` on `<html>` if stored value is `"dark"`.
2. **React context:** `ThemeProvider` (`components/providers/theme-provider.tsx`) exposes `useTheme()` → `{ theme: "light" | "dark", toggleTheme: () => void }`. Initial state: `"light"` (matches server render); `useEffect` syncs from localStorage.
3. **CSS switching:** All tokens respond to `[data-theme="dark"]` selector in `globals.css`. No class-based switching.
4. **Clerk theming:** Topbar passes dynamic color objects to `<UserButton appearance={...}>` based on `theme === "light"`.
5. **Toggle UI:** `ThemeToggle` component in topbar — Sun icon (dark mode) / Moon icon (light mode).

### Tailwind v4 Integration

- `@import "tailwindcss"` (not `@tailwind` directives)
- `@theme inline { ... }` block maps CSS variables to Tailwind utility names
- `@plugin "tailwindcss-animate"` for animation utilities
- shadcn/ui compatibility aliases: `--color-background`, `--color-primary`, `--color-border`, etc.
- Direct token utilities: `bg-base`, `bg-elevated`, `text-tertiary`, `border-subtle`, `bg-habit-1`, etc.

### Backward-Compat Aliases

Legacy variable names are aliased in a `:root, [data-theme="dark"]` block:
- `--bg-surface` → `--bg-elevated`
- `--bg-input` → `--bg-sunken`
- `--border` → `--border-default`
- `--accent-primary` → `--accent`
- `--text-muted` → `--text-secondary`
- etc.

---

## 5. Shared UI Primitives

### Component Library (`components/ui/`)

| Component | File | Variant System | Notes |
|-----------|------|---------------|-------|
| **Button** | `button.tsx` | cva: `primary`, `secondary`, `ghost`, `danger`, `outline`, `success` × `sm`, `md`, `lg`, `icon` | Radix Slot support, `isLoading` spinner |
| **Card** | `card.tsx` | `default`, `elevated`, `bordered` × padding `none`/`sm`/`md`/`lg` | Sub-components: `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter` |
| **Input** | `input.tsx` | — | Token-styled |
| **Textarea** | `textarea.tsx` | — | Token-styled |
| **Select** | `select.tsx` | — | Radix-based |
| **Badge** | `badge.tsx` | cva variants | — |
| **Dialog** | `dialog.tsx` | — | Radix-based |
| **ResponsiveDialog** | `responsive-dialog.tsx` | — | Dialog on desktop, drawer on mobile |
| **DropdownMenu** | `dropdown-menu.tsx` | — | Radix-based |
| **Progress** | `progress.tsx` | — | 3px track, accent fill |
| **Switch** | `switch.tsx` | — | Radix-based |
| **Tabs** | `tabs.tsx` | — | Radix-based |
| **Toast** | `toast.tsx` | — | Context-based provider |
| **Confetti** | `confetti.tsx` | — | Milestone celebration effect |
| **Skeleton** | `skeleton.tsx` | — | Multiple page-specific skeletons |
| **Spinner** | `spinner.tsx` | — | Loading indicator |
| **EmptyState** | `empty-state.tsx` | — | Zero-data state |
| **Label** | `label.tsx` | — | Form label |
| **Avatar** | `avatar.tsx` | — | Radix-based |
| **StreakRibbon** | `streak-ribbon.tsx` | — | Branded streak badge (terracotta gradient, rotated, custom flame SVG) |
| **PageContainer** | `PageContainer.tsx` | — | Layout wrapper |
| **SectionHeader** | `SectionHeader.tsx` | — | Section title |
| **HabitCard** (ui) | `HabitCard.tsx` | — | Alternative habit card in ui/ |

### Shared Layout Components (`components/layout/`)

| Component | File | Purpose |
|-----------|------|---------|
| `Sidebar` | `sidebar.tsx` | Desktop nav rail/panel |
| `MobileNav` | `mobile-nav.tsx` | Mobile pill bar + vaul drawer |
| `Topbar` | `topbar.tsx` | Date display, theme toggle, notifications, Clerk UserButton |
| `PageHeader` | `page-header.tsx` | Reusable page title + description + action slot |
| `PageTransition` | `page-transition.tsx` | Framer Motion fade-up entrance |
| `Footer` | `footer.tsx` | App footer |
| `ThemeToggle` | `theme-toggle.tsx` | Sun/Moon toggle |
| `UserSync` | `user-sync.tsx` | Clerk → Convex user sync on load |
| `UserGate` | `user-gate.tsx` | Blocks rendering until Convex user exists |
| `OfflineBanner` | `offline-banner.tsx` | Offline status indicator |

---

## 6. Motion Patterns

### CSS Keyframes (globals.css)

| Keyframe | Duration | Usage |
|----------|----------|-------|
| `shimmer` | 1.5s infinite | Loading skeleton |
| `pulse-ring` | 2s infinite | Expanding ring pulse |
| `spin` | 1s linear infinite | Loading spinner |
| `completion-ripple` | — | Scale 1→2.4 with opacity fade on habit check |
| `fade-in-right` | — | Swipe hint entrance |

### CSS Utility Classes

| Class | Animation |
|-------|-----------|
| `.animate-shimmer` | Gradient sweep skeleton |
| `.animate-pulse-ring` | Terracotta ring pulse |
| `.animate-spin-slow` | Rotate spinner |
| `.card-hoverable` | `translateY(-1px)` + shadow escalation on hover (150ms) |
| `.habit-card-hover` | `translateY(-2px)` on hover (150ms) |

### Framer Motion Usage

| Location | Animation |
|----------|-----------|
| `PageTransition` | `opacity: 0→1, y: 8→0` (220ms, cubic bezier) |
| Confetti provider | Particle burst on milestone unlock |

### Transition Standards

- Default: `150ms ease`
- Larger movements: `200ms ease`
- No transitions > 300ms (per THEME_REFACTOR.md spec)
- Completion ring: `stroke-dashoffset 400ms ease` (exception — follows the data fill)

---

## 7. State Management

### Architecture: No global state manager

HabitFlow uses **Convex real-time queries as the source of truth** with local `useState` for UI-only state. No Redux, Zustand, or Context-based global stores (except for providers).

### Data Flow Layers

```
Convex Backend (real-time WebSocket subscriptions)
  ↕ useQuery / useMutation (Convex React hooks)
Custom Hooks Layer (hooks/)
  ↕ useMemo / useState (derived + local state)
Components
```

### Custom Hooks (hooks/)

| Hook | Data Source | Returns |
|------|-----------|---------|
| `use-habits` | `api.habits.listHabits` | `{ habits, isLoading }` |
| `use-completions` | `api.completions.*` | `{ completedHabitIds, isLoading }` + date range variants |
| `use-optimistic-completion` | `api.completions.toggleCompletion` | `{ isCompleted, toggle }` with Convex optimistic updates |
| `use-habit-mutations` | `api.habits.*` | `{ createHabit, updateHabit, deleteHabit }` |
| `use-streaks` | Derived from completions | `{ currentStreak, longestStreak }` |
| `use-timeline` | `api.habits.listHabitsForTimeline` | Timeline items + gaps + now indicator |
| `use-milestones` | `api.milestones.getUserMilestones` | Per-milestone progress, next milestone |
| `use-current-user` | `api.users.getCurrentUser` | `{ user, isLoading }` |
| `use-user-profile` | `api.users.*` | Profile CRUD + image upload |
| `use-daily-check-in` | `api.checkIns.*` | Check-in state + submit |
| `use-weekly-goals` | Derived from completions | Weekly goal progress |
| `use-nudges` | Derived from habits + completions | Smart nudge generation |
| `use-insights` | `api.insights.*` + derived | Metrics + insights + recommendations |
| `use-pomodoro` | Local + `api.pomodoro.*` | Timer state machine, localStorage persistence |
| `use-habit-notifications` | Local + browser Notification API | Permission, scheduling, toggle |
| `usePushNotifications` | FCM + `api.pushTokens.*` | FCM registration, foreground messages |
| `use-pwa-install` | Browser beforeinstallprompt | Install prompt state |
| `use-is-mobile` | `matchMedia` | Boolean responsive check |
| `useHeatmapData` | Derived from completions | Grid data for heatmap component |

### Context Providers

| Provider | Context | Scope |
|----------|---------|-------|
| `ClerkProvider` | Authentication state | Entire app |
| `ConvexClientProvider` | Convex client + auth integration | Entire app |
| `ThemeProvider` | `{ theme, toggleTheme }` | Entire app |
| `ToastProvider` | Toast queue + show/dismiss | Dashboard routes (keyed by user.id) |
| `ConfettiProvider` | Confetti trigger | Dashboard routes |
| `NotificationProvider` | `{ enabled, permission, toggleEnabled }` | Dashboard routes |

---

## 8. Technical Constraints

| Constraint | Detail |
|-----------|--------|
| **Next.js 16** | Uses `proxy.ts` (not `middleware.ts`). App Router with `"use client"` directives. |
| **Tailwind CSS v4** | `@import "tailwindcss"`, `@theme inline`, `@plugin`. NOT v3 `@tailwind` directives. |
| **React 19** | New hook rules apply. |
| **Convex** | Real-time WebSocket — all queries are subscriptions. No REST API. Schema in `convex/schema.ts`. |
| **Clerk auth** | JWT-based. Custom appearance config in `lib/clerk-appearance.ts`. |
| **No axios** | Hard rule: all HTTP via `fetch` API only. |
| **Date storage** | `YYYY-MM-DD` strings in user's local timezone (not UTC). Prevents midnight-drift issues. |
| **Completions model** | Hard-delete on uncheck (no boolean flag). Enforced by `by_habit_date` index. |
| **Streaks** | Calculated client-side from fetched completion dates (`lib/streak-utils.ts`). |
| **PWA** | Service worker (`public/sw.js`), manifest, iOS splash screens. |
| **Capacitor** | Android wrapper support via Capacitor 8. Splash screen, status bar, WebView background. |
| **Sentry** | Error tracking + session replay integrated. |

---

## 9. Reusable Components (Cross-Cutting)

### Visualization Components

| Component | Location | Description |
|-----------|----------|-------------|
| `Heatmap` | `components/Heatmap.tsx` | GitHub-style contribution grid. Configurable days/range/cellSize. Uses `lib/heatmap.ts` for styling. Custom tooltip. |
| `StreakThread` | `components/StreakThread/` | SVG thread visualization (week/month variants). Deterministic organic curve via seeded RNG. Status-colored nodes. |
| `CompletionRing` | Inline in `up-next-card.tsx` | SVG donut chart for daily progress. |
| `WeeklyChart` | `components/analytics/weekly-chart.tsx` | Recharts bar chart |
| `CompletionBarChart` | `components/insights/completion-bar-chart.tsx` | Day-of-week completion chart |
| `CompletionTrendChart` | `components/insights/completion-trend-chart.tsx` | Daily rate trend line |

### Form Components

| Component | Location | Description |
|-----------|----------|-------------|
| `HabitForm` | `components/habits/habit-form.tsx` | React Hook Form + Zod. Fields: title, description, frequency, startTime, endTime, color, weeklyGoal. |
| `HabitDialog` | `components/habits/habit-dialog.tsx` | Create/Edit dialog wrapping HabitForm. |
| `ProfileForm` | `components/profile/profile-form.tsx` | React Hook Form + Zod. Fields: name, age, sex, location, bio. |
| `CityAutocomplete` | `components/profile/city-autocomplete.tsx` | Location search with suggestions. |

### Data Display Components

| Component | Location | Description |
|-----------|----------|-------------|
| `HabitCard` | `components/habits/habit-card.tsx` | Main habit card: 8px color dot, completion button, streak badge, milestone hint, weekly goal progress. |
| `MilestoneCard` | `components/milestones/milestone-card.tsx` | Locked/unlocked achievement card with tier, progress bar. |
| `InsightCard` | `components/insights/insight-card.tsx` | Pattern/recommendation card with left accent border. |
| `MetricCard` | `components/insights/metric-card.tsx` | Stat card (value, label, icon, tooltip). |

---

## 10. Feature-Specific Architecture

### Dashboard Flow

```
DashboardPage
  ├── UpNextCard ← state machine: empty → upnext → late → done → endofday
  │   ├── CompletionRing (SVG)
  │   └── MarkCompleteButton (isolated optimistic toggle)
  ├── TodaysHabits ← filtered habit list for today
  │   └── HabitCard[] (with swipe, completion, streak)
  └── WeeklyHeatmap ← 7-day mini heatmap
```

### Habit Tracking Flow

```
User creates habit → HabitDialog → HabitForm → useHabitMutations.createHabit
  → Convex mutation (habits.createHabit) → real-time sync

User completes habit → HabitCompletionButton → useOptimisticCompletion.toggle
  → Convex mutation (completions.toggleCompletion)
    → checkAndAwardMilestones (internal mutation)
    → returns { action, newMilestones }
  → Optimistic UI update (instant)
  → Milestone toast if newMilestones.length > 0
  → Confetti trigger
```

### Milestones

- 7 milestones: 3, 7, 14, 21, 30, 45, 66 days (`lib/milestone-config.ts`)
- Tier system: Bronze → Silver → Gold → Platinum
- Awards are permanent — never revoked on streak break
- Per-habit tracking via `userMilestones` table

### Retention System

- **Daily Check-In:** Modal auto-opens once per day (upsert guard)
- **Weekly Goals:** Optional per-habit (1–7), progress bar on card
- **Smart Nudges:** Pure function (`lib/nudges.ts`), 4 rules, max 2 nudges, session-only dismiss

### Journal

- Single `ReflectionPrompt` component (`components/journal/reflection-prompt.tsx`)
- One entry per user per day (upsert model)
- Dual source: journal page or dashboard quick-reflection
- Prompt system: curated prompts from `lib/journalPrompts.ts`

### Pomodoro

- Drift-free timer using `endTimestamp` strategy
- Mode cycling: Focus → Short Break → Focus → ... → Long Break (after 4 focus sessions)
- localStorage persistence for session recovery across refreshes
- Optional habit linking for session tracking

---

## 11. Areas Requiring Redesign

### High-Priority Redesign Targets

#### 1. Dashboard (`/dashboard`)
- **Current:** Functional cards (UpNextCard, TodaysHabits, WeeklyHeatmap) — clean but static, no RPG personality
- **Issue:** No gamification surface. The UpNextCard is a utility component, not an engaging game element
- **Opportunity:** RPG character/avatar, XP bar, quest framing for daily habits, level-up animations

#### 2. Milestones (`/milestones`)
- **Current:** Grid of locked/unlocked cards with progress bars. Tier text labels (BRONZE/SILVER/GOLD/PLATINUM)
- **Issue:** Generic achievement system. No RPG reward feel
- **Opportunity:** RPG achievement badges, skill trees, visual progression, unlockable cosmetics

#### 3. Streak Visualization
- **Current:** `StreakRibbon` (small terracotta gradient badge) + `StreakThread` (SVG thread with nodes)
- **Issue:** Functional but not gamified. No power-up or combo feel
- **Opportunity:** RPG streak power meters, combo multipliers, streak shields

#### 4. Analytics (`/analytics`)
- **Current:** Three stat cards + Recharts bar chart + streak leaderboard
- **Issue:** Data-focused, no narrative
- **Opportunity:** RPG stats screen (STR/INT/DEX-style radar), quest log, battle history

#### 5. Mobile Navigation
- **Current:** Floating pill bar (5 tabs) + vaul drawer
- **Issue:** Clean but generic iOS-style navigation
- **Opportunity:** RPG-themed navigation (quest map, tavern, etc.)

### Medium-Priority Redesign Targets

#### 6. Profile / Settings
- **Current:** Standard form layout (avatar, name, age, sex, location, bio)
- **Opportunity:** RPG character sheet, class selection, stat allocation

#### 7. Timeline (`/timeline`)
- **Current:** Vertical timeline with time slots and completion states
- **Opportunity:** Quest log / adventure timeline

#### 8. Habit Cards
- **Current:** Warm minimal design — 8px color dot, name, streak badge, milestone hint
- **Opportunity:** Quest cards with XP rewards, difficulty indicators, rarity

#### 9. Pomodoro (`/pomodoro`)
- **Current:** Large timer with SVG progress ring
- **Opportunity:** Battle/training session framing, boss fight timers

### Low-Priority (Keep as-is or Light Reskin)

#### 10. Calendar (`/calendar`)
- **Current:** Monthly grid + day detail panel — functional and well-designed
- **Note:** Could receive a thematic reskin but the interaction pattern works well

#### 11. Journal (`/journal`)
- **Current:** Reflection prompts with curated questions
- **Note:** Could become a "Captain's Log" or "Scroll" but lower priority

#### 12. Auth pages
- **Current:** Clerk embedded components with custom terracotta appearance
- **Note:** Minimal redesign needed — Clerk handles the UI

### Design System Impact

| Current Element | Status | Redesign Risk |
|----------------|--------|---------------|
| CSS custom properties | ✅ Well-structured, token-driven | Low — can extend with RPG tokens |
| Type scale utilities | ✅ Comprehensive | Low — add RPG-specific classes |
| Card variants | ✅ Working well | Medium — may need new RPG variants |
| Segmented controls | ✅ Clean | Low — reskinnable |
| Color palette | ⚠️ Warm minimal only | **High** — RPG theme needs additional palette (cosmic, magical, etc.) |
| Icon system | ✅ Lucide throughout | Medium — may need custom RPG icons |
| Motion patterns | ⚠️ Minimal (150ms ease) | **High** — RPG needs richer animations (particles, glow, level-up) |
| Paper grain texture | ⚠️ Warm minimal signature | **High** — conflicts with RPG space aesthetic |
| Shadows | ✅ Warm-tinted | Medium — space theme may need cooler shadows |

### Technical Considerations for Redesign

1. **Theme system is extensible:** `data-theme` attribute can support additional themes (e.g., `data-theme="rpg-space"`)
2. **Component APIs are stable:** Most components accept `className` and style props — reskinnable without API changes
3. **Convex queries unchanged:** Backend data model doesn't need modification for visual redesign
4. **Framer Motion already installed:** Can be leveraged for richer RPG animations
5. **`@theme inline` block:** New token utilities can be added without breaking existing ones
6. **cva variants:** Button, Badge, Card can receive new RPG-specific variants alongside existing ones

---

## 12. Convex Backend (Schema Summary)

| Table | Key Fields | Indexes |
|-------|-----------|---------|
| `users` | clerkId, name, email, profile fields | `by_clerk_id` |
| `habits` | userId, title, frequency, startTime, color, weeklyGoal | `by_user`, `by_user_archived`, `by_user_start_time` |
| `habitCompletions` | habitId, userId, date | `by_habit_date`, `by_user_date`, `by_habit`, `by_user` |
| `userMilestones` | userId, habitId, daysRequired, achievedAt | `by_user_habit`, `by_user` |
| `dailyCheckIns` | userId, date, completed | `by_user_date`, `by_user` |
| `pomodoroSessions` | userId, habitId?, mode, durationSecs, date | `by_user`, `by_user_date` |
| `journalEntries` | userId, date, content, source | `by_user_date` |
| `pushTokens` | userId, token, timezone | `by_user`, `by_token` |
| `reminderLog` | habitId, userId, date, timeSlot, pushTokenId, outcome | `by_habit_date_slot_token`, `by_date`, `by_user` |

---

## 13. External Dependencies (UI-relevant)

| Package | Version Range | Usage |
|---------|--------------|-------|
| `framer-motion` | — | Page transitions, confetti |
| `recharts` | — | Analytics charts |
| `lucide-react` | — | Icon system (18–20px nav, 16px inline) |
| `class-variance-authority` | — | Component variants (Button, Badge) |
| `@radix-ui/*` | — | Headless UI primitives (Dialog, Dropdown, Switch, Tabs, Select) |
| `vaul` | — | Mobile bottom sheet drawer |
| `react-hook-form` | — | Form state management |
| `zod` | — | Schema validation |
| `date-fns` | — | Date formatting/parsing |
| `@clerk/nextjs` | — | Authentication UI + hooks |

---

*Generated from codebase analysis on 2026-05-31. Branch: `feature/rpg-space-ui-redesign`.*
