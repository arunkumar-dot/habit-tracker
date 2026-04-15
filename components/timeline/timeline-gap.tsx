import { Clock } from "lucide-react";

interface TimelineGapProps {
  label: string;
  gapMinutes: number;
}

export function TimelineGap({ label, gapMinutes }: TimelineGapProps) {
  return (
    <div className="flex items-center gap-3 py-2 my-1">
      {/* Timeline line connector (centered on left) */}
      <div className="flex flex-col items-center w-8 flex-shrink-0">
        <div
          className="w-px flex-1 min-h-[24px]"
          style={{
            background: "var(--timeline-line)",
            backgroundImage: "repeating-linear-gradient(to bottom, var(--timeline-line) 0, var(--timeline-line) 4px, transparent 4px, transparent 8px)",
          }}
        />
      </div>

      {/* Gap indicator */}
      <div
        className="flex items-center gap-2 px-3 py-1.5 rounded-md text-xs"
        style={{
          background: "var(--bg-sunken)",
          color: "var(--text-tertiary)",
          border: "1px dashed var(--border-subtle)",
        }}
      >
        <Clock size={11} />
        <span>{label}</span>
      </div>
    </div>
  );
}
