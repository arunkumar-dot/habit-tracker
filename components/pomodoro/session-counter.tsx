"use client";

interface SessionCounterProps {
  sessionCount: number;
}

const CYCLE = 4;

export function SessionCounter({ sessionCount }: SessionCounterProps) {
  const positionInCycle = sessionCount % CYCLE;
  const cycleNumber = Math.floor(sessionCount / CYCLE) + 1;

  return (
    <div className="flex flex-col items-center gap-2">
      <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
        Session{" "}
        <span style={{ color: "var(--text-primary)", fontWeight: 600 }}>
          {positionInCycle === 0 && sessionCount > 0 ? CYCLE : positionInCycle}
        </span>{" "}
        of {CYCLE}
        {cycleNumber > 1 && (
          <span style={{ color: "var(--text-disabled)" }}> · Cycle {cycleNumber}</span>
        )}
      </p>
      {/* Dot indicators */}
      <div className="flex gap-2">
        {Array.from({ length: CYCLE }).map((_, i) => {
          const filled =
            positionInCycle === 0 && sessionCount > 0
              ? true
              : i < positionInCycle;
          return (
            <span
              key={i}
              className="w-2.5 h-2.5 rounded-full transition-all duration-300"
              style={{
                background: filled ? "var(--accent-primary)" : "var(--bg-elevated)",
                border: "1.5px solid",
                borderColor: filled ? "var(--accent-primary)" : "var(--border)",
                transform: filled ? "scale(1.1)" : "scale(1)",
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
