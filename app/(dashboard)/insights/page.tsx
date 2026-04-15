"use client";

import { useState, useCallback } from "react";
import dynamic from "next/dynamic";
import { BarChart3, Star, Frown, Flame, Zap, Timer } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { MetricCard, MetricCardSkeleton } from "@/components/insights/metric-card";
import { InsightCard } from "@/components/insights/insight-card";
import { useInsights } from "@/hooks/use-insights";

// Lazy-load Recharts to avoid SSR issues
const CompletionBarChart = dynamic(
  () =>
    import("@/components/insights/completion-bar-chart").then(
      (m) => m.CompletionBarChart
    ),
  { ssr: false, loading: () => <div className="h-[200px] animate-pulse rounded-xl" style={{ background: "var(--bg-elevated)" }} /> }
);

const CompletionTrendChart = dynamic(
  () =>
    import("@/components/insights/completion-trend-chart").then(
      (m) => m.CompletionTrendChart
    ),
  { ssr: false, loading: () => <div className="h-[200px] animate-pulse rounded-xl" style={{ background: "var(--bg-elevated)" }} /> }
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
    <>
      <PageHeader
        title="Insights"
        description="Understand your habit patterns and get smart suggestions"
      />

      {/* Window toggle — segmented control */}
      <div className="flex items-end gap-0 mb-6">
        {([7, 30] as Window[]).map((w) => (
          <button
            key={w}
            onClick={() => setWindow(w)}
            className="seg-btn"
            data-active={window === w}
          >
            {w} days
          </button>
        ))}
      </div>

      {/* Empty state for new users */}
      {hasNoData && (
        <div
          className="rounded-2xl p-8 text-center mb-6"
          style={{ background: "var(--bg-surface)", border: "1px solid var(--border)" }}
        >
          <BarChart3 size={32} className="mb-3" style={{ color: "var(--text-tertiary)" }} />
          <p className="font-semibold mb-1" style={{ color: "var(--text-primary)" }}>
            No data yet
          </p>
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            Complete a few habits and check back — insights will appear here.
          </p>
        </div>
      )}

      {/* Metric cards — 2 cols on mobile, 3 on sm+ */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <Card variant="default" padding="md">
          <CardHeader>
            <CardTitle>Completion by Day of Week</CardTitle>
          </CardHeader>
          {isLoading ? (
            <div className="h-[200px] animate-pulse rounded-xl" style={{ background: "var(--bg-elevated)" }} />
          ) : (
            <CompletionBarChart data={metrics?.dayOfWeekStats ?? []} />
          )}
        </Card>

        <Card variant="default" padding="md">
          <CardHeader>
            <CardTitle>Daily Trend ({window} days)</CardTitle>
          </CardHeader>
          {isLoading ? (
            <div className="h-[200px] animate-pulse rounded-xl" style={{ background: "var(--bg-elevated)" }} />
          ) : (
            <CompletionTrendChart data={completionStats ?? []} />
          )}
        </Card>
      </div>

      {/* Behaviour insights */}
      {(isLoading || visibleInsights.length > 0) && (
        <section className="mb-6">
          <h2
            className="text-sm font-semibold mb-3 uppercase tracking-wide"
            style={{ color: "var(--text-secondary)" }}
          >
            Behaviour Patterns
          </h2>
          {isLoading ? (
            <div className="space-y-2">
              {[1, 2].map((i) => (
                <div
                  key={i}
                  className="h-14 rounded-xl animate-pulse"
                  style={{ background: "var(--bg-surface)" }}
                />
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {visibleInsights.map((insight) => (
                <InsightCard key={insight.id} insight={insight} onDismiss={dismiss} />
              ))}
            </div>
          )}
        </section>
      )}

      {/* Recommendations */}
      {(isLoading || visibleRecs.length > 0) && (
        <section className="mb-6">
          <h2
            className="text-sm font-semibold mb-3 uppercase tracking-wide"
            style={{ color: "var(--text-secondary)" }}
          >
            Recommendations
          </h2>
          {isLoading ? (
            <div className="space-y-2">
              {[1].map((i) => (
                <div
                  key={i}
                  className="h-14 rounded-xl animate-pulse"
                  style={{ background: "var(--bg-surface)" }}
                />
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {visibleRecs.map((rec) => (
                <InsightCard key={rec.id} insight={rec} onDismiss={dismiss} />
              ))}
            </div>
          )}
        </section>
      )}
    </>
  );
}
