"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, VolumeX, CloudRain, Wind, Radio, Sparkles, Square, Play } from "lucide-react";

type SoundType = "rain" | "waves" | "drone" | "binaural";

const SOUNDS: { id: SoundType; label: string; icon: typeof CloudRain; desc: string }[] = [
  { id: "rain", label: "Soft Rain", icon: CloudRain, desc: "Gentle natural rain texture" },
  { id: "waves", label: "Wind & Waves", icon: Wind, desc: "Ocean rhythmic ebb & flow" },
  { id: "drone", label: "Deep Focus", icon: Radio, desc: "432Hz ambient chord tone" },
  { id: "binaural", label: "Zen Alpha", icon: Sparkles, desc: "10Hz alpha wave entrainment" },
];

export function AmbientSoundPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeSound, setActiveSound] = useState<SoundType>("rain");
  const [volume, setVolume] = useState(0.5);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const activeSourcesRef = useRef<(AudioNode)[]>([]);

  const stopAudio = () => {
    // Gracefully fade and stop all scheduled audio sources
    const ctx = audioCtxRef.current;
    if (masterGainRef.current && ctx && ctx.state === "running") {
      try {
        masterGainRef.current.gain.cancelScheduledValues(ctx.currentTime);
        masterGainRef.current.gain.setValueAtTime(masterGainRef.current.gain.value, ctx.currentTime);
        masterGainRef.current.gain.linearRampToValueAtTime(0.001, ctx.currentTime + 0.05);
      } catch {}
    }

    // Stop and disconnect every tracked source/oscillator
    activeSourcesRef.current.forEach((node) => {
      try {
        if ("stop" in node && typeof (node as AudioScheduledSourceNode).stop === "function") {
          (node as AudioScheduledSourceNode).stop();
        }
        node.disconnect();
      } catch {}
    });
    activeSourcesRef.current = [];

    if (masterGainRef.current) {
      try {
        masterGainRef.current.disconnect();
      } catch {}
      masterGainRef.current = null;
    }
  };

  const startAudio = (type: SoundType, vol: number) => {
    stopAudio();

    const AudioContextClass =
      window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;

    if (!audioCtxRef.current || audioCtxRef.current.state === "closed") {
      audioCtxRef.current = new AudioContextClass();
    }
    const ctx = audioCtxRef.current;
    if (ctx.state === "suspended") {
      ctx.resume().catch(() => {});
    }

    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.001, ctx.currentTime);
    masterGain.gain.linearRampToValueAtTime(vol * 0.15, ctx.currentTime + 0.08);
    masterGain.connect(ctx.destination);
    masterGainRef.current = masterGain;

    if (type === "rain") {
      // Pink / Brown filtered noise
      const bufferSize = ctx.sampleRate * 2;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      let lastOut = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        data[i] = (lastOut + 0.02 * white) / 1.02;
        lastOut = data[i];
        data[i] *= 3.5;
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      noise.loop = true;

      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(1000, ctx.currentTime);

      noise.connect(filter);
      filter.connect(masterGain);
      noise.start();

      activeSourcesRef.current.push(noise, filter);
    } else if (type === "waves") {
      // Modulated pink noise with LFO
      const bufferSize = ctx.sampleRate * 2;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      noise.loop = true;

      const filter = ctx.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.setValueAtTime(400, ctx.currentTime);
      filter.Q.setValueAtTime(1.5, ctx.currentTime);

      const lfo = ctx.createOscillator();
      lfo.frequency.setValueAtTime(0.12, ctx.currentTime);
      const lfoGain = ctx.createGain();
      lfoGain.gain.setValueAtTime(250, ctx.currentTime);
      lfo.connect(lfoGain);
      lfoGain.connect(filter.frequency);
      lfo.start();

      noise.connect(filter);
      filter.connect(masterGain);
      noise.start();

      activeSourcesRef.current.push(noise, filter, lfo, lfoGain);
    } else if (type === "drone") {
      // Harmonic drone chord
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      osc1.type = "sine";
      osc2.type = "triangle";
      osc1.frequency.setValueAtTime(108, ctx.currentTime); // low root
      osc2.frequency.setValueAtTime(162, ctx.currentTime); // fifth

      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(280, ctx.currentTime);

      osc1.connect(filter);
      osc2.connect(filter);
      filter.connect(masterGain);
      osc1.start();
      osc2.start();

      activeSourcesRef.current.push(osc1, osc2, filter);
    } else if (type === "binaural") {
      // Alpha wave stereo binaural (196Hz Left + 206Hz Right = 10Hz Alpha difference)
      const oscL = ctx.createOscillator();
      const oscR = ctx.createOscillator();
      oscL.type = "sine";
      oscR.type = "sine";
      oscL.frequency.setValueAtTime(196, ctx.currentTime);
      oscR.frequency.setValueAtTime(206, ctx.currentTime);

      const merger = ctx.createChannelMerger(2);
      oscL.connect(merger, 0, 0);
      oscR.connect(merger, 0, 1);
      merger.connect(masterGain);

      oscL.start();
      oscR.start();

      activeSourcesRef.current.push(oscL, oscR, merger);
    }
  };

  const handleTogglePlay = () => {
    if (isPlaying) {
      stopAudio();
      setIsPlaying(false);
    } else {
      startAudio(activeSound, volume);
      setIsPlaying(true);
    }
  };

  const handleSelectSound = (sound: SoundType) => {
    if (isPlaying && activeSound === sound) {
      // Clicking currently playing sound pauses it
      stopAudio();
      setIsPlaying(false);
    } else {
      // Switch to new sound and play
      setActiveSound(sound);
      startAudio(sound, volume);
      setIsPlaying(true);
    }
  };

  const handleVolumeChange = (newVol: number) => {
    setVolume(newVol);
    const ctx = audioCtxRef.current;
    if (masterGainRef.current && ctx && ctx.state === "running") {
      masterGainRef.current.gain.cancelScheduledValues(ctx.currentTime);
      masterGainRef.current.gain.setValueAtTime(masterGainRef.current.gain.value, ctx.currentTime);
      masterGainRef.current.gain.linearRampToValueAtTime(newVol * 0.15, ctx.currentTime + 0.05);
    }
  };

  useEffect(() => {
    return () => {
      stopAudio();
      if (audioCtxRef.current) {
        audioCtxRef.current.close().catch(() => {});
      }
    };
  }, []);

  return (
    <div className="glass-card rounded-2xl p-4 sm:p-5 flex flex-col gap-3.5 border border-[var(--border-subtle)]">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={handleTogglePlay}
          className="flex items-center gap-2 text-left bg-transparent border-0 p-0 cursor-pointer group"
          title={isPlaying ? "Click to stop sound" : "Click to play sound"}
        >
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center transition-transform group-hover:scale-105"
            style={{
              background: isPlaying
                ? "color-mix(in srgb, var(--accent) 20%, transparent)"
                : "var(--bg-sunken)",
              color: isPlaying ? "var(--accent)" : "var(--text-tertiary)",
              border: isPlaying
                ? "1px solid color-mix(in srgb, var(--accent) 35%, transparent)"
                : "1px solid var(--border-subtle)",
            }}
          >
            {isPlaying ? <Volume2 size={16} className="animate-pulse" /> : <VolumeX size={16} />}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="text-xs font-semibold uppercase tracking-wider m-0" style={{ color: "var(--text-primary)" }}>
                Zen Soundscapes
              </h3>
              {isPlaying && (
                <span className="inline-block w-2 h-2 rounded-full bg-[var(--accent)] animate-ping" />
              )}
            </div>
            <p className="text-xs m-0" style={{ color: "var(--text-tertiary)" }}>
              {isPlaying ? `Playing ${SOUNDS.find((s) => s.id === activeSound)?.label}` : "Generative ambient sounds for focus"}
            </p>
          </div>
        </button>

        {/* Play/Stop Button */}
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          onClick={handleTogglePlay}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer shadow-sm"
          style={{
            background: isPlaying ? "var(--accent)" : "var(--bg-elevated)",
            color: isPlaying ? "#ffffff" : "var(--text-primary)",
            border: isPlaying ? "none" : "1.5px solid var(--border-default)",
          }}
          aria-label={isPlaying ? "Stop ambient sound" : "Start ambient sound"}
        >
          {isPlaying ? (
            <>
              <Square size={12} className="fill-current" />
              <span>Stop Sound</span>
            </>
          ) : (
            <>
              <Play size={12} className="fill-current" />
              <span>Start Ambient</span>
            </>
          )}
        </motion.button>
      </div>

      {/* Sound Type Selector */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {SOUNDS.map((s) => {
          const isSelected = activeSound === s.id;
          const isCurrentlyPlayingThis = isPlaying && isSelected;
          return (
            <motion.button
              key={s.id}
              whileTap={{ scale: 0.96 }}
              onClick={() => handleSelectSound(s.id)}
              className="relative flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all duration-200 cursor-pointer"
              style={{
                background: isCurrentlyPlayingThis
                  ? "color-mix(in srgb, var(--accent) 16%, transparent)"
                  : isSelected
                  ? "var(--bg-elevated)"
                  : "var(--bg-sunken)",
                color: isCurrentlyPlayingThis
                  ? "var(--accent)"
                  : isSelected
                  ? "var(--text-primary)"
                  : "var(--text-secondary)",
                border: isCurrentlyPlayingThis
                  ? "1.5px solid var(--accent)"
                  : isSelected
                  ? "1.5px solid var(--border-default)"
                  : "1.5px solid transparent",
              }}
              title={s.desc}
            >
              <div className="flex items-center gap-2 min-w-0">
                <s.icon size={14} className={isCurrentlyPlayingThis ? "text-[var(--accent)]" : ""} />
                <span className="truncate">{s.label}</span>
              </div>
              {isCurrentlyPlayingThis && (
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] flex-shrink-0" />
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Volume slider */}
      <AnimatePresence>
        {isPlaying && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="flex items-center gap-3 pt-1 border-t border-[var(--border-subtle)]"
          >
            <span className="text-xs font-medium" style={{ color: "var(--text-tertiary)" }}>
              Volume ({Math.round(volume * 100)}%)
            </span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={volume}
              onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
              className="flex-1 accent-[var(--accent)] h-1.5 bg-[var(--bg-sunken)] rounded-lg cursor-pointer"
              aria-label="Ambient volume"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
