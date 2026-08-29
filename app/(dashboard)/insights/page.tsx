"use client";

import { useState, useCallback } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import { BarChart3, Star, Frown, Flame, Zap, Timer, Sparkles } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { MetricCard, MetricCardSkeleton } from "@/components/insights/metric-card";
import { InsightCard } from "@/components/insights/insight-card";
import { useInsights } from "@/hooks/use-insights";

// Lazy-load Recharts to avoid SSR issues
const CompletionBarChart = dynamic(
  () =>
    import("@/components/insights/completion-bar-chart").then(
      (m) => m.CompletionBarChart
    ),
  { ssr: false, loading: () => <div className="h-[200px] animate-pulse rounded-xl" style={{ background: "var(--bg-sunken)" }} /> }
);

const CompletionTrendChart = dynamic(
  () =>
    import("@/components/insights/completion-trend-chart").then(
      (m) => m.CompletionTrendChart
    ),
  { ssr: false, loading: () => <div className="h-[200px] animate-pulse rounded-xl" style={{ background: "var(--bg-sunken)" }} /> }
);

type Window = 7 | 30;

export default function InsightsPage() {
  const [window, setWindow] = useState<Window>(30);
  const { metrics, insights, recommendations, completionStats, isLoading } =
    useInsights(window);

  // Session-only dismiss
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());
  const dismiss = useCallback((id: string) => {
    setDismissed((prev) => new Set([...prev, id]));
  }, []);

  const visibleInsights = insights.filter((i) => !dismissed.has(i.id));
  const visibleRecs = recommendations.filter((r) => !dismissed.has(r.id));

  const hasNoData =
    !isLoading && metrics && metrics.overallRate === 0 && (completionStats?.every((r) => r.total === 0) ?? true);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="max-w-4xl mx-auto flex flex-col gap-6"
    >
      <PageHeader
        title="Behavioral Insights"
        description="Understand your subconscious habit patterns and receive smart suggestions."
        actions={
          <div className="flex items-center gap-1 p-1 rounded-2xl glass-panel">
            {([7, 30] as Window[]).map((w) => {
              const isSelected = window === w;
              return (
                <button
                  key={w}
                  onClick={() => setWindow(w)}
                  className={`relative px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    isSelected
                      ? "text-[var(--text-primary)]"
                      : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                  }`}
                >
                  {isSelected && (
                    <motion.div
                      layoutId="insightWindowPill"
                      className="absolute inset-0 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] shadow-sm"
                      transition={{ type: "spring", stiffness: 450, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{w} Days</span>
                </button>
              );
            })}
          </div>
        }
      />

      {/* Empty state for new users */}
      {hasNoData && (
        <div className="glass-card rounded-3xl p-8 text-center">
          <BarChart3 size={32} className="mb-3 mx-auto text-[var(--accent)] opacity-80" />
          <p className="font-semibold text-base mb-1" style={{ color: "var(--text-primary)" }}>
            Building Your Dataset
          </p>
          <p className="text-sm max-w-md mx-auto" style={{ color: "var(--text-secondary)" }}>
            Complete a few habits this week — AI pattern analysis and behavior recommendations will automatically emerge here.
          </p>
        </div>
      )}

      {/* Metric cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, i) => <MetricCardSkeleton key={i} />)
        ) : (
          <>
            <MetricCard
              icon={<BarChart3 size={18} />}
              label="Completion Rate"
              value={metrics ? `${metrics.overallRate}%` : "—"}
              sub={`Last ${window} days`}
            />
            <MetricCard
              icon={<Star size={18} />}
              label="Best Day"
              value={metrics?.bestDay?.day ?? "—"}
              sub={metrics?.bestDay ? `${metrics.bestDay.rate}% avg` : "Not enough data"}
            />
            <MetricCard
              icon={<Frown size={18} />}
              label="Worst Day"
              value={metrics?.worstDay?.day ?? "—"}
              sub={metrics?.worstDay ? `${metrics.worstDay.rate}% avg` : "Not enough data"}
            />
            <MetricCard
              icon={<Flame size={18} />}
              label="Most Consistent"
              value={metrics?.mostConsistentTitle ?? "—"}
              sub={metrics?.mostConsistentTitle ? `${metrics.mostConsistentRate}%` : undefined}
            />
            <MetricCard
              icon={<Zap size={18} />}
              label="Most Missed"
              value={metrics?.mostMissedTitle ?? "—"}
              sub={metrics?.mostMissedTitle ? `${metrics.mostMissedRate}%` : undefined}
            />
            {(metrics?.focusSessionCount ?? 0) > 0 ? (
              <MetricCard
                icon={<Timer size={18} />}
                label="Focus Time"
                value={`${metrics!.totalFocusMinutes} min`}
                sub={`${metrics!.focusSessionCount} sessions`}
              />
            ) : (
              <MetricCard
                icon={<Timer size={18} />}
                label="Focus Time"
                value="—"
                sub="No Pomodoro sessions yet"
              />
            )}
          </>
        )}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="glass-card rounded-3xl p-6">
          <h3 className="text-sm font-semibold mb-4" style={{ color: "var(--text-primary)" }}>
            Completion by Day of Week
          </h3>
          {isLoading ? (
            <div className="h-[200px] animate-pulse rounded-2xl" style={{ background: "var(--bg-sunken)" }} />
          ) : (
            <CompletionBarChart data={metrics?.dayOfWeekStats ?? []} />
          )}
        </div>

        <div className="glass-card rounded-3xl p-6">
          <h3 className="text-sm font-semibold mb-4" style={{ color: "var(--text-primary)" }}>
            Daily Consistency Trend ({window} Days)
          </h3>
          {isLoading ? (
            <div className="h-[200px] animate-pulse rounded-2xl" style={{ background: "var(--bg-sunken)" }} />
          ) : (
            <CompletionTrendChart data={completionStats ?? []} />
          )}
        </div>
      </div>

      {/* Behaviour insights */}
      {(isLoading || visibleInsights.length > 0) && (
        <section>
          <div className="flex items-center gap-1.5 mb-3">
            <Sparkles size={14} className="text-[var(--accent)]" />
            <h2 className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--text-secondary)" }}>
              Behavior Patterns
            </h2>
          </div>
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2].map((i) => (
                <div
                  key={i}
                  className="h-16 rounded-2xl animate-pulse"
                  style={{ background: "var(--bg-sunken)" }}
                />
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {visibleInsights.map((insight) => (
                <InsightCard key={insight.id} insight={insight} onDismiss={dismiss} />
              ))}
            </div>
          )}
        </section>
      )}

      {/* Recommendations */}
      {(isLoading || visibleRecs.length > 0) && (
        <section>
          <div className="flex items-center gap-1.5 mb-3">
            <Zap size={14} className="text-[var(--warning)]" />
            <h2 className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--text-secondary)" }}>
              AI Recommendations
            </h2>
          </div>
          {isLoading ? (
            <div className="space-y-3">
              {[1].map((i) => (
                <div
                  key={i}
                  className="h-16 rounded-2xl animate-pulse"
                  style={{ background: "var(--bg-sunken)" }}
                />
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {visibleRecs.map((rec) => (
                <InsightCard key={rec.id} insight={rec} onDismiss={dismiss} />
              ))}
            </div>
          )}
        </section>
      )}
    </motion.div>
  );
}
