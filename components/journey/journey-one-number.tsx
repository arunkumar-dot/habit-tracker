"use client";

interface JourneyOneNumberProps {
  totalCompletions: number;
  isLoading: boolean;
}

export function JourneyOneNumber({ totalCompletions, isLoading }: JourneyOneNumberProps) {
  return (
    <section
      style={{
        marginBottom: 40,
        textAlign: "center",
        padding: "36px 16px",
        background: "var(--bg-surface)",
        borderRadius: 16,
        border: "1px solid var(--border)",
      }}
    >
      <p
        style={{
          margin: 0,
          fontFamily: "var(--font-sans)",
          fontSize: 13,
          fontWeight: 500,
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          color: "var(--text-subtle)",
          marginBottom: 8,
        }}
      >
        You showed up
      </p>

      {isLoading ? (
        <div
          className="animate-pulse rounded-lg"
          style={{
            height: 80,
            width: 160,
            background: "var(--surface-alt)",
            margin: "0 auto 8px",
          }}
        />
      ) : (
        <p
          style={{
            margin: "0 0 8px",
            fontFamily: "var(--font-display)",
            fontStyle: "italic",
            fontSize: "clamp(64px, 18vw, 88px)",
            fontWeight: 400,
            lineHeight: 1,
            color: "var(--text)",
          }}
          aria-label={`${totalCompletions} total habit completions`}
        >
          {totalCompletions.toLocaleString()}
        </p>
      )}

      <p
        style={{
          margin: 0,
          fontFamily: "var(--font-sans)",
          fontSize: 15,
          color: "var(--text-muted)",
        }}
      >
        {totalCompletions === 1 ? "time" : "times"}
      </p>
    </section>
  );
}
