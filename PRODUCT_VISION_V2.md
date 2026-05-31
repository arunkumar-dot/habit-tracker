# HabitFlow V2 — Product Vision
### One Core Fantasy. Everything Else Cut.

---

## The Core Fantasy

> **"I am becoming the person I designed."**

Not "I tracked my habits." Not "My completion rate is 78%." Not "I have a 14-day streak."

The fantasy is transformation with evidence. The user designed a version of themselves — someone who runs in the morning, reads before bed, meditates before work — and they want to feel, concretely and emotionally, that they are becoming that person.

Every feature either serves this fantasy or it does not exist.

---

## What This Changes Immediately

### Cut from the product entirely

| Feature | Why it's cut |
|---|---|
| Pomodoro timer | A standalone utility. Does not serve "becoming." Belongs in a different product. |
| Analytics page | Charts of completion data serve "knowing." Not "becoming." Merge one key metric into the main view. |
| Timeline page | Calendar already does this. Two destinations for the same idea. |
| Recommendations section | Algorithmic advice that feels like no one. Cut completely. |
| Daily Check-In Modal | A Yes/No survey at 6 PM. Not a conversation. Not a relationship. |
| "Behaviour Patterns" section | Enterprise language. Wrong register for this product. |
| Milestone Bronze/Silver/Gold/Platinum | Generic. Could describe any person in any app. |
| Weekly Goal (optional) field | Invisible in the experience after creation. Confusing without purpose. |
| NudgeBanner with 4 algorithmic rules | The algorithm is visible. Trust breaks when the system shows its seams. |

### Navigation collapses to 5

**Before:** Dashboard / Habits / Timeline / Calendar / Analytics / Insights / Journal / Pomodoro / Milestones / Settings

**After:**
1. **Today** — The morning ritual view (replaces Dashboard)
2. **Habits** — Create and manage habits
3. **Journal** — Daily reflection
4. **Journey** — Milestones, history, heatmap (replaces Calendar + Insights + Milestones)
5. **Settings**

---

## The Five Surfaces That Remain

---

### 1. Today (was: Dashboard)

**The morning ritual view. Designed to be the first screen opened every day.**

The screen exists in three time-states:

**Morning (before noon):**
A calm, focused view. Not a dashboard — a briefing. The user sees:
- Their identity statement (see below) at the top in Instrument Serif italic
- Today's habits in time order, uncompleted, quiet and waiting
- One line of context: the current streak across all active habits

No charts. No analytics. No nudge banners. Nothing that competes for attention.

**Afternoon:**
The screen shifts to show progress. Completed habits are acknowledged (dimmed, checked). Remaining habits are still present but the tone changes — this is the window, not the morning. The identity statement shifts to reflect today's progress ("You're halfway there.").

**Evening (after 7 PM):**
If all habits are complete: the screen becomes a celebration. The confetti has already played. What remains is quieter — "Today is yours. You did it." with a soft CTA to write in the journal. Tomorrow's first habit is shown. The app is ready for tomorrow before the user closes it.

If habits are incomplete: no judgment. The screen shows what remains with a simple "Tomorrow is a fresh start." The streak for those habits is shown honestly — not as failure, but as information. The journal CTA is still there.

**The Identity Statement**

At the very top of the Today screen, in Instrument Serif italic, is a sentence the app generates from the user's habits:

> *"You are someone who meditates in the morning and runs after work."*

On day 1, this is aspirational. On day 30, it is factual. The user feels the difference.

The identity statement is not editable directly — it reflects the habits the user created. If they have no habits, the line reads: *"Who do you want to become?"* — and tapping it opens habit creation.

This is the fantasy made visible. Every time the user opens the app, they see who they are becoming.

---

### 2. Habits (unchanged structure, refined experience)

**Create, edit, and view all habits.**

What changes:
- Remove Weekly Goal field (it was invisible after creation)
- Habit creation opens with a single first question: **"What will this habit make you?"** — a subtitle field that becomes the identity layer. E.g., "a morning runner", "someone who reads every day", "a person who sleeps before midnight."
- This subtitle surfaces in the Today screen's identity statement and in personal milestone names.
- Streak badge remains (it is perfect, do not change it)
- Swipe to complete remains
- Completion animation remains
- Nudge logic is replaced with a single, human-voiced line per habit when opened: "Day 5. You're building something real." These do not rotate algorithmically — they follow a crafted narrative arc from day 1 to day 66.

---

### 3. Journal (deepened, not changed)

**The place where becoming is articulated.**

What changes:
- **"Then" feature:** When the user opens the journal, above the blank editor, the app shows a past entry from this date in a previous month — if one exists. "You wrote this 30 days ago:" followed by the entry excerpt. This is the single most powerful retention feature available. The user's past self speaks to their present self.
- Cut: 24 rotating prompts → 7 curated prompts, cycled by day of week. Fewer, better, more memorable.
- The day's habit completion dots remain next to past entries (this is good, keep it).
- The journal becomes part of the Journey surface for browsing, but the *writing* experience is still its own destination.

**The 7 prompts (one per day of week):**
1. (Mon) What is one thing that felt different this week because of a habit you kept?
2. (Tue) What is the hardest part right now?
3. (Wed) When do you feel most like the person you want to be?
4. (Thu) What would you tell yourself from 30 days ago?
5. (Fri) What made today feel like yours?
6. (Sat) What are you carrying into next week?
7. (Sun) Who are you becoming?

Sunday's prompt is the identity question. It recurs every week. Over months, reading past Sunday entries becomes the product's most emotional experience.

---

### 4. Journey (was: Calendar + Analytics + Milestones)

**Evidence of becoming. Not charts — a narrative.**

Three sections on one page:

**Your history** — The year-long heatmap. This remains. It is the most powerful visualization of consistency. Keep it exactly as built.

**Your milestones** — Rebuilt entirely. Milestone names are no longer generic tiers. They are personal and earned from the habit's identity subtitle:

> Instead of: "Habit Forming (21 days)"
> Now: **"21 days as a morning runner."**

> Instead of: "Lifestyle Change (45 days)"
> Now: **"45 days. This is who you are now."**

> Instead of: "Habit Mastery (66 days)"
> Now: **"66 days. The science says this is permanent."**

The 66-day milestone carries the scientific context: the average time for a behavior to become automatic (Phillippa Lally, UCL, 2010). The product cites it. The user feels it. This is meaning, not gamification.

Bronze/Silver/Gold/Platinum are removed. Milestone cards show: days achieved, the identity subtitle, and the date it was reached. They look like certificates, not badges.

**Your one number** — One stat, large, centered, no chart: "You have kept a habit for X days in the last year." Not completion rate. Not best day. The accumulation of consistent days, total. This is the number that captures the fantasy: not perfection, but persistence.

---

### 5. Settings

No changes needed here. Settings should be invisible.

---

## The Onboarding That Must Exist

The current product has no onboarding. Users land on an empty dashboard. This must change.

**A two-screen onboarding, maximum:**

**Screen 1 — The Identity Question**
Full-screen. Instrument Serif. Large. Quiet.

> "Who do you want to become?"
>
> *(a text field, wide, centered)*

The user types: "Someone who exercises every morning" or "A calmer person" or "More focused."

This text is stored. It appears in their profile. It informs the identity statement language throughout the app. It is not a form field — it is a commitment.

A single button: "Let's build toward that."

**Screen 2 — The First Habit**
Simplified habit creation — just title and time. No description, no frequency options (daily is the default), no color picker. Those exist in edit mode. The first habit should take 20 seconds to create.

After creation, the user lands on the Today screen with their identity statement already visible, their first habit waiting, and their journey started.

---

## What the Product Must Stop Doing

**Stop showing users what they failed at.**

The current NudgeBanner system surfaces: streak-close warnings, time-based reminders, missed-yesterday warnings, milestone progress. Three of these four are about failure or near-failure. Duolingo does this too — and it works for language learning because missing a lesson is low stakes. Habit failure is not low stakes. A user who missed yesterday's meditation does not need to be told they missed it. They know. Saying it again is not motivation — it is shame.

**Replace nudges with affirmation of what is true.**
Instead of: "You missed X yesterday — try again today."
Use: "Day 3. You're building something real. [Habit name]."

The difference: one looks backward at failure, one looks forward at becoming.

**Stop calling it "Behaviour Patterns."**

The user is a person, not a behavior. The language of the product should reflect what the user is — someone in the process of intentional change — not what their data pattern looks like from outside.

---

## The Emotional Arc the Product Must Create

| Day | What the user feels |
|---|---|
| Day 1 | Possibility. "I designed this. It could become real." |
| Day 3 | Surprise. "I actually did it again." |
| Day 7 | Investment. "I have a streak I don't want to lose." |
| Day 14 | Identity shift. "I'm kind of a morning person now." |
| Day 21 | Evidence. "The journal shows who I was 3 weeks ago. I'm different." |
| Day 30 | Pride. The milestone names it: "30 days. Strong habit." |
| Day 66 | Transformation. The milestone names it: "This is permanent now." |
| Day 90 | The product becomes invisible. The habit lives in the person. This is the goal. |

The app's job is to make itself unnecessary by day 90. That sounds like product suicide, but it is the opposite: users who feel genuinely transformed return to start the next habit. The cycle begins again with a new identity statement.

---

## The One Thing That Must Never Change

**The streak badge.** Terracotta gradient. −3° tilt. Hand-drawn flame. The only element in the product that unambiguously feels like it was made by someone who cared.

Everything else can evolve. This stays.

---

## Summary: The Edit

**Keep:** Streak badge, streak mechanics, UpNextCard intelligence, warm color system, swipe to complete, completion animation, confetti, journal, year heatmap, Instrument Serif display font.

**Remove:** Pomodoro, Analytics page, Timeline page, Recommendations section, Daily Check-In Modal, Bronze/Silver/Gold/Platinum milestone names, "Behaviour Patterns" label, NudgeBanner algorithm, Weekly Goal field, 24-prompt rotation.

**Add:** Identity statement on Today screen, "Who do you want to become?" onboarding, "Then" journal feature (past entry on this date), personal milestone names from habit identity subtitle, crafted day-arc nudge copy (days 1–66), Sunday identity journal prompt, 66-day milestone with Lally citation.

**One sentence:** HabitFlow V2 is the product that shows you, with evidence, that you are becoming the person you designed.

---

*Vision document — May 2026*
