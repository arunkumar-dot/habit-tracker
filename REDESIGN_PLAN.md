# HabitFlow — RPG Space Redesign Plan

> Transform HabitFlow from "warm minimalism" into an immersive **RPG space adventure** — where every habit is a quest, every streak is a power-up, and every day is a mission.

---

## 1. Design Vision

### Concept: "Stellar Quests"

HabitFlow becomes a **personal space RPG** where the user is a **Starkeeper** — a cosmic explorer whose daily habits fuel their ship, level their character, and chart new star systems. The app retains its utility-first ethos but wraps every interaction in a layer of meaningful gamification.

**Guiding metaphors:**

| App Concept | RPG Metaphor |
|------------|--------------|
| Habit | Quest / Mission |
| Completing a habit | Completing a quest → earning XP |
| Streak | Power Shield (consecutive days = shield strength) |
| Milestone | Achievement Badge / Star Map discovery |
| Daily check-in | Ship's Log entry |
| Pomodoro session | Training / Battle encounter |
| Analytics | Star Chart / Mission Control |
| Profile | Character Sheet |
| Journal | Captain's Log |
| Weekly goal | Mission Objective |

### Design Principles (RPG Edition)

1. **Substance over spectacle** — Gamification amplifies real progress; never obscure the data
2. **Earned richness** — Visual complexity grows with user progress; new users see a clean, inviting cockpit; power users see a rich star map
3. **Dark-first, warm accents** — Space is dark; warmth comes from glowing accents, not backgrounds
4. **Depth through layers** — Glassmorphism, subtle parallax, z-depth to create spatial immersion
5. **Motion as reward** — Animations fire on achievements, not on page load; idle states are calm
6. **Respect the data** — Charts, streaks, and completion states remain instantly readable

---

## 2. Visual Language

### 2.1 Color System — "Nebula Palette"

Extend the existing token system. The warm minimal palette remains available (for settings/legal/fallback), but the RPG theme introduces a new cosmic palette.

#### Primary RPG Tokens (Dark Mode — Primary)

| Token | Hex | Role |
|-------|-----|------|
| `--space-void` | `#0B0D12` | Deep background |
| `--space-surface` | `#12151C` | Card/panel surfaces |
| `--space-elevated` | `#1A1E28` | Elevated surfaces, modals |
| `--space-hover` | `#222838` | Hover states |
| `--space-glow` | `#2A3148` | Active/selected surfaces |
| `--nebula-purple` | `#8B5CF6` | Primary accent (XP, levels) |
| `--nebula-purple-soft` | `rgba(139, 92, 246, 0.12)` | Tinted backgrounds |
| `--nebula-blue` | `#3B82F6` | Secondary accent (info, navigation) |
| `--nebula-cyan` | `#06B6D4` | Tertiary accent (focus, pomodoro) |
| `--stellar-gold` | `#F59E0B` | Rewards, XP, achievements |
| `--stellar-gold-soft` | `rgba(245, 158, 11, 0.12)` | Gold tint |
| `--plasma-green` | `#10B981` | Success, completion, health |
| `--plasma-green-soft` | `rgba(16, 185, 129, 0.12)` | Green tint |
| `--ember-red` | `#EF4444` | Danger, missed, damage |
| `--ember-orange` | `#F97316` | Warning, streak-at-risk |
| `--comet-white` | `#F1F5F9` | Primary text |
| `--stardust` | `#94A3B8` | Secondary text |
| `--asteroid` | `#64748B` | Tertiary text |
| `--void-border` | `rgba(148, 163, 184, 0.08)` | Subtle borders |
| `--void-border-strong` | `rgba(148, 163, 184, 0.15)` | Visible borders |

#### RPG Light Mode (Optional — "Daybreak" Variant)

| Token | Hex | Role |
|-------|-----|------|
| `--space-void` | `#F8FAFC` | Light background |
| `--space-surface` | `#FFFFFF` | Cards |
| `--space-elevated` | `#FFFFFF` | Modals |
| `--nebula-purple` | `#7C3AED` | Deepened for contrast |
| `--comet-white` | `#0F172A` | Dark text |
| `--stardust` | `#475569` | Secondary text |

#### Gradients

| Name | Value | Usage |
|------|-------|-------|
| `--grad-xp` | `linear-gradient(135deg, #8B5CF6, #3B82F6)` | XP bars, level badges |
| `--grad-gold` | `linear-gradient(135deg, #F59E0B, #EAB308)` | Achievement highlights |
| `--grad-streak` | `linear-gradient(135deg, #F97316, #EF4444)` | Streak shields |
| `--grad-health` | `linear-gradient(135deg, #10B981, #06B6D4)` | Completion bars |
| `--grad-cosmic` | `radial-gradient(ellipse at 30% 20%, rgba(139,92,246,0.15), transparent 60%)` | Ambient background glow |

#### Glassmorphism

```css
.glass-panel {
  background: rgba(18, 21, 28, 0.7);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(148, 163, 184, 0.08);
}
```

### 2.2 Typography Additions

Keep Instrument Serif, Inter, JetBrains Mono. Add:

| Variable | Font | Weights | Role |
|----------|------|---------|------|
| `--font-display-rpg` | Space Grotesk | 500, 700 | RPG headings, level numbers, XP values |

New type scale additions:

| Class | Font | Size | Weight | Usage |
|-------|------|------|--------|-------|
| `.type-level` | Space Grotesk | 48px | 700 | Level number display |
| `.type-xp` | Space Grotesk | 20px | 500 | XP values |
| `.type-quest-title` | Space Grotesk | 16px | 700 | Quest/habit titles |
| `.type-stat-label` | Inter | 10px | 600 | Stat labels (STR, INT, etc.) |

### 2.3 Iconography

Replace Lucide icons for in-app chrome with a mix of Lucide + custom SVG:

| Current | RPG Replacement | Context |
|---------|----------------|---------|
| `LayoutDashboard` | Custom: Mission Control console | Dashboard nav |
| `ListChecks` | `Swords` or custom: Quest scroll | Habits nav |
| `Clock` | `Map` or custom: Star chart | Timeline nav |
| `CalendarDays` | Keep or custom: Star calendar | Calendar nav |
| `BarChart3` | `Radar` or custom: Ship scanner | Analytics nav |
| `Sparkles` | Keep `Sparkles` | Insights nav |
| `BookOpen` | `ScrollText` | Journal nav |
| `Timer` | `Crosshair` or `Shield` | Pomodoro nav |
| `Trophy` | `Medal` or custom: Star badge | Milestones nav |
| `Settings` | `Wrench` or `Cog` | Settings nav |

### 2.4 Shadows & Glow

| Token | Value | Usage |
|-------|-------|-------|
| `--shadow-space-sm` | `0 1px 3px rgba(0,0,0,0.3)` | Subtle elevation |
| `--shadow-space-md` | `0 4px 16px rgba(0,0,0,0.4)` | Cards |
| `--shadow-space-lg` | `0 12px 40px rgba(0,0,0,0.5)` | Modals |
| `--glow-purple` | `0 0 20px rgba(139,92,246,0.3)` | XP/level glow |
| `--glow-gold` | `0 0 20px rgba(245,158,11,0.3)` | Achievement glow |
| `--glow-streak` | `0 0 20px rgba(249,115,22,0.3)` | Streak glow |
| `--glow-health` | `0 0 20px rgba(16,185,129,0.2)` | Completion glow |

---

## 3. Gamification Mechanics

### 3.1 XP System

| Action | XP Awarded |
|--------|-----------|
| Complete a habit | +10 XP |
| Complete all daily habits | +25 XP bonus |
| Maintain streak (per day after 3) | +5 XP |
| Unlock a milestone | +50 XP |
| Complete a Pomodoro session | +15 XP |
| Write a journal entry | +10 XP |
| Daily check-in (positive) | +5 XP |

**Level formula:** `level = floor(sqrt(totalXP / 100))`
- Level 1: 100 XP
- Level 5: 2,500 XP
- Level 10: 10,000 XP
- Level 20: 40,000 XP

> **Implementation note:** XP and level are derived values computed from existing data (completions, milestones, sessions, entries). No new Convex table needed initially — can be calculated client-side from existing queries. A `userStats` table can be added later for caching.

### 3.2 Character Classes (Flavor Only — Phase 2+)

| Class | Unlock Condition | Visual Theme |
|-------|-----------------|-------------|
| Starkeeper | Default | Purple nebula |
| Firestarter | 30-day streak on any habit | Orange/ember |
| Timeweaver | 50+ Pomodoro sessions | Cyan/teal |
| Chronicler | 30+ journal entries | Blue/sapphire |
| Titan | All 7 milestones on any habit | Gold |

### 3.3 Streak Shield

Replace the `StreakRibbon` with a **Streak Shield** — a dynamic badge that visually strengthens with streak length.

| Streak Range | Shield Visual |
|-------------|--------------|
| 0 | No shield shown |
| 1–2 | Dim outline ring |
| 3–6 | Solid ring, slight glow |
| 7–13 | Double ring, pulse animation |
| 14–29 | Triple ring + ember particles |
| 30+ | Full shield with rotating glow |

### 3.4 Quest States (Habit Card)

| State | Visual Treatment |
|-------|-----------------|
| Available (not started today) | Card at full opacity, pulsing "!" marker |
| In Progress (has startTime, time hasn't passed) | Subtle glow border |
| Completed | Green glow flash → card dims to 70% with ✓ overlay |
| Missed (time passed, not completed) | Red tint border, "!" warning |
| Locked (future/weekly) | Desaturated, lock icon |

---

## 4. Component-by-Component Redesign

### 4.1 App Shell

#### Sidebar → "Command Deck"

```
┌──────────────────┐
│  ◆ HabitFlow     │  ← Logo + app name (Space Grotesk)
│  ★ Lv. 12        │  ← Level badge with XP micro-bar
├──────────────────┤
│  ◎ Bridge        │  ← Dashboard (Mission Control)
│  ⚔ Quests       │  ← Habits
│  ◈ Star Map     │  ← Timeline
│  ◐ Calendar     │  ← Calendar
│  ◉ Scanner      │  ← Analytics
│  ✦ Oracle       │  ← Insights
│  ◇ Captain's Log│  ← Journal
│  ⊕ Training     │  ← Pomodoro
│  ★ Achievements │  ← Milestones
│  ⚙ Systems      │  ← Settings
├──────────────────┤
│  ▣ 12,450 XP    │  ← Total XP display (footer)
└──────────────────┘
```

- **Active state:** Nebula purple left border + text + subtle glow
- **Collapsed state:** Icon-only with tooltip, level badge shrinks to number
- **Background:** `--space-void` with subtle starfield SVG pattern (very low opacity)

#### Topbar → "Ship Status Bar"

```
┌─────────────────────────────────────────────────────┐
│  ≡ │ ★ Lv.12  ████████░░ 450/500 XP  │ ☀ 🔔 👤 │
│    │          Mission Day: Saturday, May 31        │
└─────────────────────────────────────────────────────┘
```

- Left: sidebar toggle + level badge with XP progress bar
- Center: date in Instrument Serif italic (kept from current)
- Right: theme toggle, notification bell, Clerk UserButton
- **Background:** glass panel (`glass-panel` class)

#### Mobile Nav → "Quick Access Dock"

- Keep the floating pill pattern but with space styling
- Active tab: nebula purple fill with subtle glow
- Inactive: `--asteroid` color on `--space-void`
- "More" drawer: dark glass panel with grid layout

### 4.2 Dashboard → "Mission Bridge"

```
┌─────────────────────────────────────────┐
│  ★ Level 12 Starkeeper                  │  ← Character banner
│  ████████████░░░░ 450/500 XP            │
│  ▸ Next: Level 13 — Complete 5 quests   │
├─────────────────────────────────────────┤
│  ◎ ACTIVE MISSION                       │  ← Up Next Card (redesigned)
│  ┌─────────────────────────────────┐    │
│  │  ⚔ Wake Up Early    ⏱ in 23m   │    │
│  │  +10 XP  ▸ Mark Complete        │    │
│  │  🛡 Streak: 14 days             │    │
│  └─────────────────────────────────┘    │
├─────────────────────────────────────────┤
│  TODAY'S QUESTS                    3/5  │  ← Today's Habits
│  ┌─ ✅ Meditate ─────── +10 XP ───┐    │
│  ├─ ✅ Read ────────── +10 XP ───┤    │
│  ├─ ○ Exercise ──────── 10 XP ───┤    │
│  ├─ ○ Journal ─────── 10 XP ────┤    │
│  └─ ○ Study ──────── 10 XP ─────┘    │
├─────────────────────────────────────────┤
│  STREAK THREAD                          │  ← Weekly StreakThread
│  ●──●──●──●──●──◎──○                   │
│  M  T  W  T  F  Sa Su                  │
├─────────────────────────────────────────┤
│  WEEKLY MISSION LOG                     │  ← Weekly Heatmap
│  ░░▓▓████░░▓▓████░░▓▓                  │
└─────────────────────────────────────────┘
```

#### New Component: `CharacterBanner`

- Level number (`.type-level`), class name, XP progress bar
- Gradient background (`--grad-xp`)
- Subtle particle effect on level-up (reuse ConfettiProvider)

#### Redesigned: `UpNextCard` → `ActiveMission`

- Glass panel background
- Quest icon + title + time remaining
- XP reward preview
- Streak shield inline
- "Mark Complete" button with glow hover

#### Redesigned: `TodaysHabits` → `QuestList`

- Each habit card becomes a quest row
- Completed quests: green checkmark + "+10 XP" tag, dimmed
- Uncompleted: full brightness, XP preview
- Completion animation: green flash → XP number floats up

#### Kept: `WeeklyHeatmap`

- Restyle cells with space palette (void → nebula purple intensity scale)
- Keep interaction pattern

### 4.3 Habits → "Quest Board"

#### `HabitCard` → `QuestCard`

```
┌─────────────────────────────────────┐
│  ● Meditate           🛡 14 days   │  ← Color dot + name + streak shield
│  ⏱ 6:00 AM  │  ★ +10 XP          │  ← Time + XP reward
│  ▸ Next: First Week (5/7)          │  ← Milestone hint
│  ████████░░ 4/5 this week          │  ← Weekly goal bar
│                            ○ / ✅  │  ← Completion button
└─────────────────────────────────────┘
```

- Card background: `--space-surface` with `--void-border`
- Hover: translate + glow border in habit color
- Completion button: ring → filled with green flash + "+10 XP" toast
- Streak shield replaces StreakRibbon

### 4.4 Timeline → "Star Map"

- Vertical timeline line: gradient from `--nebula-purple` (top) to `--nebula-blue` (bottom)
- Timeline dots: habit color filled circles (kept)
- NOW indicator: pulsing nebula ring
- Gap badges: glass panel with "free time" label
- Completed items: green glow outline, 70% opacity

### 4.5 Calendar → "Mission Calendar"

- Selected day: `--nebula-purple` filled circle
- Completion dots: `--plasma-green` 4px dots
- Month header: Instrument Serif (kept)
- Day cells: subtle glass panel on hover
- Stats panel: RPG stat card style

### 4.6 Analytics → "Ship Scanner"

#### Stat Cards → "Scanner Readouts"

```
┌──────────┐ ┌──────────┐ ┌──────────┐
│    5     │ │    7     │ │   20%    │
│ ACTIVE   │ │ COMPLETE │ │ AVG RATE │
│ QUESTS   │ │ THIS WK  │ │          │
└──────────┘ └──────────┘ └──────────┘
```

- Numbers in Space Grotesk 48px
- Labels in `.type-stat-label` (10px uppercase)
- Card backgrounds: glass panel with subtle gradient border
- Chart colors: `--nebula-purple` primary, `--nebula-blue` secondary

#### Streak Summary → "Power Rankings"

- Leaderboard with rank badges (gold/silver/bronze glow)
- Streak shield inline per habit

### 4.7 Insights → "Oracle"

- Metric cards: glass panel + stat readout style
- Charts: nebula purple + cyan color scheme
- Insight cards: left border in `--nebula-blue` (pattern) or `--stellar-gold` (recommendation)
- Recommendation cards: subtle gold glow

### 4.8 Pomodoro → "Training Chamber"

```
┌─────────────────────────────┐
│        TRAINING MODE        │
│                             │
│         25:00               │  ← Space Grotesk 96px
│      ╭───────────╮          │
│      │  ◉        │          │  ← SVG ring (nebula cyan)
│      ╰───────────╯          │
│                             │
│   ▸ Focus  │ Rest  │ Long  │  ← Mode selector
│                             │
│      [ ▶ START ]            │  ← Glow button
│                             │
│   Session 2 of 4  ●●○○     │
│   ⚔ Linked: Meditate       │
└─────────────────────────────┘
```

- Timer: Space Grotesk 96px (replaces Instrument Serif)
- Ring: `--nebula-cyan` track on `--space-hover` bg
- Play button: gradient fill (`--grad-health`) with glow
- Mode selector: segmented control with nebula purple active

### 4.9 Milestones → "Star Map Discoveries"

```
┌───────────────────────────────────────┐
│  ★ ACHIEVEMENTS           4 / 7      │
├───────────────────────────────────────┤
│  ┌─────────┐  ┌─────────┐            │
│  │  🌱     │  │  🔥     │            │
│  │ Getting │  │  First  │            │
│  │ Started │  │  Week   │            │
│  │  ✅     │  │  ✅     │            │
│  │ BRONZE  │  │ SILVER  │            │
│  └─────────┘  └─────────┘            │
│  ┌─────────┐  ┌─────────┐            │
│  │  🔒     │  │  🔒     │            │
│  │  Iron   │  │  Steel  │            │
│  │  Will   │  │  Soul   │            │
│  │ ████░░  │  │ ██░░░░  │            │
│  │ 12/14   │  │  8/21   │            │
│  └─────────┘  └─────────┘            │
└───────────────────────────────────────┘
```

- Unlocked: gold glow border, filled icon, achievement date
- Locked: 40% opacity, lock icon, progress bar
- Tier badges: color-coded glow (bronze → gold → platinum)
- On unlock: confetti + XP burst animation

### 4.10 Journal → "Captain's Log"

- Header: Instrument Serif "Captain's Log" (keep the serif personality)
- Entry cards: glass panel with date in mono font
- Prompt cards: subtle nebula tint background
- Write area: `--space-surface` background, `--void-border` border

### 4.11 Profile → "Character Sheet"

```
┌─────────────────────────────────────┐
│         [Avatar]                    │
│      ★ Starkeeper                   │
│      Level 12  │  12,450 XP         │
├─────────────────────────────────────┤
│  CLASS: Starkeeper                  │
│  RANK: Nebula Explorer              │
│                                     │
│  STR ████████░░  80%  (Consistency) │
│  INT ██████░░░░  60%  (Variety)     │
│  DEX ████░░░░░░  40%  (Timing)     │
│  WIS ███████░░░  70%  (Reflection)  │
├─────────────────────────────────────┤
│  IDENTITY                           │
│  Name: ___________                  │
│  Age:  ___                          │
│  ...                                │
└─────────────────────────────────────┘
```

- Radar chart for "stats" derived from completion rate, streak consistency, pomodoro usage, journaling frequency
- Character class display
- Keep all existing form fields below the RPG section

### 4.12 Settings → "Ship Systems"

- Section cards: glass panel
- Toggle switches: nebula purple active state
- Danger zone: ember red tint panel
- Keep all existing functionality

---

## 5. Motion Design

### 5.1 New Animations

| Animation | Trigger | Duration | Description |
|-----------|---------|----------|-------------|
| `xp-float` | Habit completion | 800ms | "+10 XP" text floats up and fades from completion point |
| `level-up` | Level threshold crossed | 1500ms | Full-screen flash + number scale-up + particle burst |
| `shield-pulse` | Streak milestone (7, 14, 30) | 600ms | Shield ring expands with glow |
| `quest-complete` | Habit marked done | 400ms | Card border flashes green, dims smoothly |
| `glow-breathe` | Active mission card (idle) | 3000ms | Subtle border glow pulse (very subtle) |
| `star-twinkle` | Background ambient | 4000ms | Random star opacity fade (CSS only) |

### 5.2 Transition Standards

- Keep 150ms for UI interactions (hover, toggle)
- 200ms for card state changes
- 300-400ms for completion animations (exception to the 300ms max — rewards should feel weighty)
- 600-800ms for celebration animations (XP float, level-up)
- Background ambient animations: 3000ms+ (must be very subtle, `prefers-reduced-motion` respected)

### 5.3 Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  .xp-float, .level-up, .shield-pulse, .glow-breathe, .star-twinkle {
    animation: none !important;
  }
  /* Completion still shows state change, just without animation */
}
```

---

## 6. Background & Texture

### Replace Paper Grain

The `body::before` paper-grain texture is replaced with a **starfield** effect.

#### Option A: CSS-only starfield (recommended for performance)

```css
body::before {
  content: "";
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: -1;
  background:
    radial-gradient(1px 1px at 20% 30%, rgba(255,255,255,0.15), transparent),
    radial-gradient(1px 1px at 40% 70%, rgba(255,255,255,0.1), transparent),
    radial-gradient(1px 1px at 80% 20%, rgba(255,255,255,0.12), transparent),
    radial-gradient(2px 2px at 60% 50%, rgba(139,92,246,0.08), transparent);
}
```

#### Option B: SVG noise (same technique, space palette)

Replace the fractalNoise SVG with a dark-tinted version at 2% opacity.

#### Cosmic ambient glow

```css
body::after {
  content: "";
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: -1;
  background: radial-gradient(
    ellipse at 20% 0%,
    rgba(139, 92, 246, 0.06),
    transparent 50%
  );
}
```

---

## 7. Accessibility Considerations

| Concern | Mitigation |
|---------|-----------|
| Low-contrast text on dark backgrounds | All text combinations verified to WCAG AA (4.5:1 body, 3:1 large). `--comet-white` on `--space-void` = 14.5:1. `--stardust` on `--space-void` = 6.8:1. |
| Glow effects reducing readability | Glows are decorative only; never placed behind text. Box-shadow, not text-shadow. |
| Animations causing discomfort | All reward animations respect `prefers-reduced-motion`. Background ambient effects are very subtle (< 5% opacity variation). |
| Color-only status indication | Quest states use icons + text labels in addition to color. Completed = ✓ icon, not just green. |
| Screen reader support | RPG labels are aria-hidden decorative; functional labels preserved (e.g., "Mark habit as complete" not "Complete quest"). |
| Focus indicators | Visible focus rings using `--nebula-purple` with 2px offset on all interactive elements. |

---

## 8. Theme Coexistence Strategy

The RPG Space theme does NOT replace the warm minimal theme. Both coexist.

### Implementation approach

```css
/* Default: warm minimal (existing) */
:root { ... }
[data-theme="dark"] { ... }

/* RPG Space: new theme */
[data-theme="space"] {
  --bg-base: var(--space-void);
  --bg-elevated: var(--space-surface);
  /* ... map all existing tokens to space equivalents ... */
}

[data-theme="space-light"] {
  /* ... daybreak variant ... */
}
```

### Theme provider extension

```ts
type Theme = "light" | "dark" | "space" | "space-light";
```

The theme toggle cycles: light → dark → space (or shows a picker).

### Component compatibility

All existing components use `var(--bg-base)`, `var(--text-primary)`, etc. By remapping these tokens under `[data-theme="space"]`, every component automatically adapts. RPG-specific components (CharacterBanner, XP bar, etc.) use `--nebula-*` / `--stellar-*` tokens directly.

---

## 9. What Stays the Same

| Element | Status |
|---------|--------|
| All Convex backend logic | Unchanged |
| Route structure | Unchanged |
| Component APIs (props, hooks) | Unchanged |
| Form validation (Zod schemas) | Unchanged |
| Authentication (Clerk) | Unchanged |
| Push notifications (FCM) | Unchanged |
| PWA manifest + service worker | Unchanged |
| Legal pages | Unchanged |
| Data model | Unchanged (XP is derived) |
| Playwright tests | Unchanged (data-testid attributes preserved) |

---

## 10. New Components Required

| Component | Location | Purpose |
|-----------|----------|---------|
| `CharacterBanner` | `components/rpg/character-banner.tsx` | Level + XP bar + class display |
| `XPBar` | `components/rpg/xp-bar.tsx` | Animated XP progress bar |
| `StreakShield` | `components/rpg/streak-shield.tsx` | Dynamic streak visualization (replaces StreakRibbon) |
| `XPFloat` | `components/rpg/xp-float.tsx` | "+10 XP" floating animation |
| `QuestCard` | `components/rpg/quest-card.tsx` | RPG-styled habit card wrapper |
| `StatRadar` | `components/rpg/stat-radar.tsx` | Character stats radar chart |
| `LevelUpOverlay` | `components/rpg/level-up-overlay.tsx` | Full-screen level-up celebration |
| `StarfieldBg` | `components/rpg/starfield-bg.tsx` | CSS starfield background (or just CSS) |

### Modified Components (Visual Only)

Every component listed in ARCHITECTURE_REPORT.md §11 "Areas Requiring Redesign" receives visual updates but no API changes.

---

*Design plan v1.0 — 2026-05-31*
