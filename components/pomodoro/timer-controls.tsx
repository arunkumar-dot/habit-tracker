"use client";

import { Play, Pause, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

interface TimerControlsProps {
  isRunning: boolean;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
}

export function TimerControls({ isRunning, onStart, onPause, onReset }: TimerControlsProps) {
  return (
    <div className="flex items-center justify-center gap-4">
      {/* Reset */}
      <button
        onClick={onReset}
        className="w-11 h-11 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95"
        style={{
          background: "var(--bg-sunken)",
          border: "1px solid var(--border-subtle)",
          color: "var(--text-secondary)",
        }}
        aria-label="Reset timer"
      >
        <RotateCcw size={18} />
      </button>

      {/* Start / Pause */}
      <button
        onClick={isRunning ? onPause : onStart}
        className="w-16 h-16 rounded-full flex items-center justify-center transition-all duration-150 hover:scale-105 active:scale-95"
        style={{
          background: "var(--accent)",
          color: "white",
          boxShadow: "var(--shadow-md)",
        }}
        aria-label={isRunning ? "Pause timer" : "Start timer"}
      >
        {isRunning ? <Pause size={26} fill="white" /> : <Play size={26} fill="white" />}
      </button>

      {/* Spacer to balance layout */}
      <div className="w-11 h-11" />
    </div>
  );
}
