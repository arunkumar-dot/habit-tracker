"use client";

interface TimelineNowIndicatorProps {
  nowMinutes: number;
}

export function TimelineNowIndicator({ nowMinutes }: TimelineNowIndicatorProps) {
  const hours = Math.floor(nowMinutes / 60);
  const mins = nowMinutes % 60;
  const timeLabel = `${hours % 12 || 12}:${String(mins).padStart(2, "0")} ${hours >= 12 ? "PM" : "AM"}`;

  return (
    <div className="flex items-center gap-2 py-1.5 relative">
      {/* Dot on timeline line */}
      <div
        className="w-3 h-3 rounded-full flex-shrink-0 z-10"
        style={{
          background: "var(--timeline-now)",
          boxShadow: "0 0 0 3px var(--bg-base), 0 0 0 5px var(--timeline-now)",
          animation: "pulse 2s ease-in-out infinite",
        }}
      />
      {/* Horizontal line */}
      <div
        className="flex-1 h-px"
        style={{ background: "var(--timeline-now)", opacity: 0.7 }}
      />
      {/* NOW label */}
      <span
        className="text-[10px] font-bold px-1.5 py-0.5 rounded-full flex-shrink-0"
        style={{
          background: "var(--timeline-now)",
          color: "white",
        }}
      >
        {timeLabel}
      </span>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}
