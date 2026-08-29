"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Volume2, VolumeX, CloudRain, Wind, Radio, Sparkles } from "lucide-react";

type SoundType = "rain" | "waves" | "drone" | "binaural";

const SOUNDS: { id: SoundType; label: string; icon: typeof CloudRain }[] = [
  { id: "rain", label: "Soft Rain", icon: CloudRain },
  { id: "waves", label: "Wind & Waves", icon: Wind },
  { id: "drone", label: "Deep Focus", icon: Radio },
  { id: "binaural", label: "Zen Alpha", icon: Sparkles },
];

export function AmbientSoundPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeSound, setActiveSound] = useState<SoundType>("rain");
  const [volume, setVolume] = useState(0.5);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const noiseSourceRef = useRef<AudioNode | null>(null);

  const stopAudio = () => {
    if (noiseSourceRef.current) {
      try {
        if ("stop" in noiseSourceRef.current) {
          (noiseSourceRef.current as AudioScheduledSourceNode).stop();
        }
        noiseSourceRef.current.disconnect();
      } catch {}
      noiseSourceRef.current = null;
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
      ctx.resume();
    }

    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(vol * 0.15, ctx.currentTime);
    masterGain.connect(ctx.destination);
    gainNodeRef.current = masterGain;

    if (type === "rain") {
      // Pink / Brown noise filter for rain
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
      noiseSourceRef.current = noise;
    } else if (type === "waves") {
      // Modulated pink noise for wind / waves
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

      // LFO for wave modulation
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
      noiseSourceRef.current = noise;
    } else if (type === "drone") {
      // Warm chord drone (F minor / ambient 432Hz harmonic)
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
      noiseSourceRef.current = osc1;
    } else if (type === "binaural") {
      // Alpha wave binaural (200Hz + 210Hz = 10Hz Alpha entrainment)
      const oscL = ctx.createOscillator();
      const oscR = ctx.createOscillator();
      oscL.type = "sine";
      oscR.type = "sine";
      oscL.frequency.setValueAtTime(196, ctx.currentTime);
      oscR.frequency.setValueAtTime(206, ctx.currentTime); // 10Hz difference

      const merger = ctx.createChannelMerger(2);
      oscL.connect(merger, 0, 0);
      oscR.connect(merger, 0, 1);
      merger.connect(masterGain);

      oscL.start();
      oscR.start();
      noiseSourceRef.current = oscL;
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
    setActiveSound(sound);
    if (isPlaying) {
      startAudio(sound, volume);
    }
  };

  const handleVolumeChange = (newVol: number) => {
    setVolume(newVol);
    if (gainNodeRef.current && audioCtxRef.current) {
      gainNodeRef.current.gain.setValueAtTime(
        newVol * 0.15,
        audioCtxRef.current.currentTime
      );
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
    <div className="glass-card rounded-2xl p-4 sm:p-5 flex flex-col gap-3.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{
              background: "color-mix(in srgb, var(--accent) 15%, transparent)",
              color: "var(--accent)",
            }}
          >
            {isPlaying ? <Volume2 size={16} /> : <VolumeX size={16} />}
          </div>
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--text-primary)" }}>
              Zen Soundscapes
            </h3>
            <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>
              Generative ambient sounds for focus
            </p>
          </div>
        </div>

        {/* Play/Pause Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleTogglePlay}
          className="px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200"
          style={{
            background: isPlaying ? "var(--accent)" : "var(--bg-sunken)",
            color: isPlaying ? "#ffffff" : "var(--text-secondary)",
            border: isPlaying ? "none" : "1px solid var(--border-subtle)",
          }}
        >
          {isPlaying ? "Playing ●" : "Start Ambient"}
        </motion.button>
      </div>

      {/* Sound Type Selector */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {SOUNDS.map((s) => {
          const isSelected = activeSound === s.id;
          return (
            <motion.button
              key={s.id}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleSelectSound(s.id)}
              className="relative flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium transition-colors"
              style={{
                background: isSelected
                  ? "color-mix(in srgb, var(--accent) 12%, transparent)"
                  : "var(--bg-sunken)",
                color: isSelected ? "var(--accent)" : "var(--text-secondary)",
                border: isSelected
                  ? "1px solid color-mix(in srgb, var(--accent) 30%, transparent)"
                  : "1px solid transparent",
              }}
            >
              <s.icon size={14} />
              <span>{s.label}</span>
            </motion.button>
          );
        })}
      </div>

      {/* Volume slider */}
      {isPlaying && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="flex items-center gap-3 pt-1"
        >
          <span className="text-xs" style={{ color: "var(--text-tertiary)" }}>
            Volume
          </span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={volume}
            onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
            className="flex-1 accent-[var(--accent)] h-1.5 bg-[var(--bg-sunken)] rounded-lg cursor-pointer"
          />
        </motion.div>
      )}
    </div>
  );
}
