"use client";

// Web Audio API pure synthesizer sound engine — 0 audio files required

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
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

/**
 * Plays a crystalline, harmonic celebratory chime on habit completion.
 * Synthesizes a layered triad chord with exponential decay and harmonic overtone shimmer.
 */
export function playCompletionChime() {
  if (!isSoundEnabled()) return;

  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    // Harmonic frequencies for crystalline celebratory chord (C6, E6, G6, B6, C7)
    const notes = [1046.5, 1318.51, 1567.98, 1975.53, 2093.0];

    notes.forEach((freq, index) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      // Sine wave with slight triangle shimmer on the top note
      osc.type = index === notes.length - 1 ? "triangle" : "sine";
      osc.frequency.setValueAtTime(freq, now + index * 0.035);

      // Gain Envelope: Fast attack, delicate sparkling decay
      const startTime = now + index * 0.035;
      const duration = 0.65;
      const volume = (0.12 / (index + 1)) * 1.2;

      gain.gain.setValueAtTime(0.0001, startTime);
      gain.gain.exponentialRampToValueAtTime(volume, startTime + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.00001, startTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + duration + 0.05);
    });
  } catch {
    // Gracefully ignore any browser audio policy rejections
  }
}
