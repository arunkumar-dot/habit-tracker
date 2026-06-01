"use client";

import { useMemo } from "react";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useBestStreak } from "@/hooks/use-best-streak";
import { StreakRibbon } from "@/components/ui/streak-ribbon";

interface HeroStatsProps {
  totalCompletions: number;
  daysActive: number;
  firstDate: string | null;
  isLoading: boolean;
}

function formatJourneyStart(firstDate: string | null, createdAt?: number): string {
  const raw = firstDate ?? (createdAt ? new Date(createdAt).toLocaleDateString("en-CA") : null);
  if (!raw) return "—";
  return new Date(raw + "T00:00:00").toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function StatRow({
  label,
  value,
  extra,
}: {
  label: string;
  value: React.ReactNode;
  extra?: React.ReactNode;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        paddingTop: 10,
        paddingBottom: 10,
        borderBottom: "1px solid var(--border-subtle)",
      }}
    >
      <span
        style={{
          fontFamily: "var(--font-sans)",
          fontSize: 14,
          color: "var(--text-subtle)",
        }}
      >
        {label}
      </span>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: 14,
            fontWeight: 600,
            color: "var(--text)",
          }}
        >
          {value}
        </span>
        {extra}
      </div>
    </div>
  );
}

export function JourneyHero({ totalCompletions, daysActive, firstDate, isLoading }: HeroStatsProps) {
  const { user, isLoading: userLoading } = useCurrentUser();
  const { bestStreak, isLoading: streakLoading } = useBestStreak();

  const startLabel = useMemo(
    () => formatJourneyStart(firstDate, user?.createdAt),
    [firstDate, user?.createdAt]
  );

  const anyLoading = userLoading || isLoading || streakLoading;

  return (
    <section style={{ marginBottom: 32 }}>
      {/* Identity statement */}
      <div style={{ marginBottom: 24 }}>
        {userLoading ? (
          <div
            className="animate-pulse rounded-md"
            style={{ height: 52, background: "var(--surface-alt)" }}
          />
        ) : user?.identityStatement ? (
          <p
            style={{
              margin: 0,
              fontFamily: "var(--font-display)",
              fontStyle: "italic",
              fontSize: "clamp(20px, 5vw, 26px)",
              lineHeight: 1.3,
              color: "var(--text)",
            }}
          >
            You are becoming{" "}
            <span style={{ color: "var(--accent)" }}>{user.identityStatement}</span>
          </p>
        ) : (
          <p
            style={{
              margin: 0,
              fontFamily: "var(--font-display)",
              fontStyle: "italic",
              fontSize: 22,
              lineHeight: 1.3,
              color: "var(--text-subtle)",
            }}
          >
            Who do you want to become?
          </p>
        )}
      </div>

      {/* Stats rows */}
      <div
        style={{
          background: "var(--bg-surface)",
          borderRadius: 12,
          border: "1px solid var(--border)",
          overflow: "hidden",
        }}
      >
        {anyLoading ? (
          <div style={{ padding: "12px 16px" }}>
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="animate-pulse rounded"
                style={{
                  height: 16,
                  background: "var(--surface-alt)",
                  marginBottom: i < 2 ? 14 : 0,
                  width: i === 0 ? "60%" : i === 1 ? "45%" : "55%",
                }}
              />
            ))}
          </div>
        ) : (
          <div style={{ padding: "0 16px" }}>
            <StatRow label="Journey started" value={startLabel} />
            <StatRow
              label="Best streak"
              value={bestStreak > 0 ? `Day ${bestStreak}` : "—"}
              extra={bestStreak > 0 ? <StreakRibbon count={bestStreak} /> : undefined}
            />
            <StatRow
              label="Days active"
              value={daysActive > 0 ? `${daysActive} day${daysActive !== 1 ? "s" : ""}` : "—"}
            />
          </div>
        )}
      </div>
    </section>
  );
}
