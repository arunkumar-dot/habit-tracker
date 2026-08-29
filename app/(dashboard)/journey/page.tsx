"use client";

import { useQuery, useConvexAuth } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useHabits } from "@/hooks/use-habits";
import { JourneyHero } from "@/components/journey/journey-hero";
import { JourneyHeatmapSection } from "@/components/journey/journey-heatmap-section";
import { JourneyMilestones } from "@/components/journey/journey-milestones";
import { JourneyOneNumber } from "@/components/journey/journey-one-number";
import { JourneyRecent } from "@/components/journey/journey-recent";

import { motion } from "framer-motion";
import { PageHeader } from "@/components/layout/page-header";

export default function JourneyPage() {
  const { isAuthenticated } = useConvexAuth();
  const { habits, isLoading: habitsLoading } = useHabits();

  const stats = useQuery(
    api.completions.getTotalCompletionCount,
    isAuthenticated ? {} : "skip"
  );

  const statsLoading = stats === undefined;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="max-w-xl mx-auto w-full flex flex-col gap-6"
    >
      <PageHeader
        title="Growth Journey"
        description="Evidence of who you are becoming, one day at a time."
      />

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
    </motion.div>
  );
}
