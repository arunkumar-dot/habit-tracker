"use client";

// Web Audio API pure synthesizer sound engine — 0 external asset latency

export type SoundTheme = "crystal" | "singing_bowl" | "arcade" | "keystroke" | "pop";

export interface SoundThemeInfo {
  id: SoundTheme;
  name: string;
  description: string;
  emoji: string;
}

export const SOUND_THEMES: SoundThemeInfo[] = [
  {
    id: "crystal",
    name: "Crystal Chime",
    description: "Multi-octave harmonic chord with sparkling crystal decay",
    emoji: "💎",
  },
  {
    id: "singing_bowl",
    name: "Zen Singing Bowl",
    description: "Resonant 432Hz meditative tone with deep acoustic vibration",
    emoji: "🧘",
  },
  {
    id: "arcade",
    name: "8-Bit Arcade Ding",
    description: "Retro Nintendo coin power-up double arpeggio",
    emoji: "👾",
  },
  {
    id: "keystroke",
    name: "Mechanical Switch",
    description: "Crisp tactile thock click with low body resonance",
    emoji: "⌨️",
  },
  {
    id: "pop",
    name: "Organic Bubble Pop",
    description: "Satisfying bubbly frequency sweep pop",
    emoji: "🫧",
  },
];

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!audioCtx) {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === "suspended") {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

export function isSoundEnabled(): boolean {
  if (typeof window === "undefined") return true;
  return localStorage.getItem("habitflow_sound_enabled") !== "false";
}

export function setSoundEnabled(enabled: boolean) {
  if (typeof window === "undefined") return;
  localStorage.setItem("habitflow_sound_enabled", enabled ? "true" : "false");
}

export function getSoundTheme(): SoundTheme {
  if (typeof window === "undefined") return "crystal";
  return (localStorage.getItem("habitflow_sound_theme") as SoundTheme | null) ?? "crystal";
}

export function setSoundTheme(theme: SoundTheme) {
  if (typeof window === "undefined") return;
  localStorage.setItem("habitflow_sound_theme", theme);
}

/**
 * Synthesizes sound effects dynamically using Web Audio API
 */
export function playCompletionSound(themeOverride?: SoundTheme) {
  if (!isSoundEnabled()) return;

  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const theme = themeOverride ?? getSoundTheme();
    const now = ctx.currentTime;

    // ── 1. CRYSTAL CHIME ─────────────────────────────────────────────────────────
    if (theme === "crystal") {
      const notes = [1046.5, 1318.51, 1567.98, 1975.53, 2093.0];
      notes.forEach((freq, index) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = index === notes.length - 1 ? "triangle" : "sine";
        osc.frequency.setValueAtTime(freq, now + index * 0.035);

        const startTime = now + index * 0.035;
        const duration = 0.7;
        const volume = (0.13 / (index + 1)) * 1.2;

        gain.gain.setValueAtTime(0.0001, startTime);
        gain.gain.exponentialRampToValueAtTime(volume, startTime + 0.015);
        gain.gain.exponentialRampToValueAtTime(0.00001, startTime + duration);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + duration + 0.05);
      });
    }

    // ── 2. ZEN SINGING BOWL ──────────────────────────────────────────────────────
    else if (theme === "singing_bowl") {
      // 432Hz Fundamental + 864Hz Harmonic + 1296Hz Shimmer
      const fundamentalFreq = 432;
      const harmonics = [fundamentalFreq, fundamentalFreq * 2, fundamentalFreq * 3.01];

      harmonics.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, now);

        // Subtle vibrato
        const lfo = ctx.createOscillator();
        const lfoGain = ctx.createGain();
        lfo.frequency.setValueAtTime(5.5, now);
        lfoGain.gain.setValueAtTime(2.5, now);
        lfo.connect(osc.frequency);
        lfo.start(now);
        lfo.stop(now + 1.8);

        const duration = 1.6;
        const vol = i === 0 ? 0.22 : 0.08 / (i + 1);

        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.exponentialRampToValueAtTime(vol, now + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.00001, now + duration);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + duration + 0.1);
      });
    }

    // ── 3. 8-BIT ARCADE DING ─────────────────────────────────────────────────────
    else if (theme === "arcade") {
      // Rapid square wave arpeggio (B5 -> E6)
      const pitches = [987.77, 1318.51];
      pitches.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = "square";
        const startTime = now + idx * 0.075;
        const duration = 0.28;

        osc.frequency.setValueAtTime(freq, startTime);

        gain.gain.setValueAtTime(0.0001, startTime);
        gain.gain.exponentialRampToValueAtTime(0.12, startTime + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.00001, startTime + duration);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + duration + 0.02);
      });
    }

    // ── 4. MECHANICAL KEYSTROKE ──────────────────────────────────────────────────
    else if (theme === "keystroke") {
      // High click transient + low thock body
      const click = ctx.createOscillator();
      const clickGain = ctx.createGain();
      click.type = "triangle";
      click.frequency.setValueAtTime(2400, now);
      click.frequency.exponentialRampToValueAtTime(300, now + 0.035);

      clickGain.gain.setValueAtTime(0.25, now);
      clickGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.035);
      click.connect(clickGain);
      clickGain.connect(ctx.destination);
      click.start(now);
      click.stop(now + 0.04);

      // Thock body
      const thock = ctx.createOscillator();
      const thockGain = ctx.createGain();
      thock.type = "sine";
      thock.frequency.setValueAtTime(280, now);
      thock.frequency.exponentialRampToValueAtTime(80, now + 0.08);

      thockGain.gain.setValueAtTime(0.18, now);
      thockGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);
      thock.connect(thockGain);
      thockGain.connect(ctx.destination);
      thock.start(now);
      thock.stop(now + 0.09);
    }

    // ── 5. ORGANIC BUBBLE POP ────────────────────────────────────────────────────
    else if (theme === "pop") {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(450, now);
      osc.frequency.exponentialRampToValueAtTime(1400, now + 0.05);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.exponentialRampToValueAtTime(0.24, now + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.14);
    }
  } catch {
    // Gracefully handle browser autoplay policy
  }
}

// Backwards compatibility alias
export const playCompletionChime = playCompletionSound;
