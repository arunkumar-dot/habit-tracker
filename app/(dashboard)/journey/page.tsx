"use client";

import { useQuery, useConvexAuth } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useHabits } from "@/hooks/use-habits";
import { JourneyHero } from "@/components/journey/journey-hero";
import { JourneyHeatmapSection } from "@/components/journey/journey-heatmap-section";
import { JourneyMilestones } from "@/components/journey/journey-milestones";
import { JourneyOneNumber } from "@/components/journey/journey-one-number";
import { JourneyRecent } from "@/components/journey/journey-recent";

const PAGE_STYLE = `
.journey-page h1 {
  margin: 0 0 6px;
  font-family: var(--font-display);
  font-style: italic;
  font-weight: 400;
  font-size: 42px;
  line-height: 1.1;
  color: var(--text);
}
.journey-page p.subtitle {
  font-family: var(--font-sans);
  font-size: 15px;
  color: var(--text-muted);
  margin: 0 0 32px;
}
`;

export default function JourneyPage() {
  const { isAuthenticated } = useConvexAuth();
  const { habits, isLoading: habitsLoading } = useHabits();

  const stats = useQuery(
    api.completions.getTotalCompletionCount,
    isAuthenticated ? {} : "skip"
  );

  const statsLoading = stats === undefined;

  return (
    <>
      <style>{PAGE_STYLE}</style>

      <div
        className="journey-page"
        style={{
          maxWidth: 440,
          width: "100%",
          margin: "0 auto",
          boxSizing: "border-box",
        }}
      >
        {/* Page header */}
        <div style={{ marginBottom: 32 }}>
          <h1>Journey</h1>
          <p className="subtitle">Evidence of who you are becoming</p>
        </div>

        {/* Section 1: Hero — identity + journey stats */}
        <JourneyHero
          totalCompletions={stats?.totalCompletions ?? 0}
          daysActive={stats?.daysActive ?? 0}
          firstDate={stats?.firstDate ?? null}
          isLoading={statsLoading}
        />

        {/* Section 2: History — year heatmap */}
        <JourneyHeatmapSection />

        {/* Section 3: Milestones — personal names */}
        <JourneyMilestones habits={habits} isLoading={habitsLoading} />

        {/* Section 4: One Number — total completions */}
        <JourneyOneNumber
          totalCompletions={stats?.totalCompletions ?? 0}
          isLoading={statsLoading}
        />

        {/* Section 5: Recent Growth */}
        <JourneyRecent />
      </div>
    </>
  );
}
