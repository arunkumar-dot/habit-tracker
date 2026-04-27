"use client";

import { useRef, useState, useEffect, useCallback, useMemo } from "react";
import { useQuery, useMutation, useConvexAuth, usePaginatedQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Check } from "lucide-react";
import { today as todayString } from "@/lib/date-utils";
import { getDailyPrompt } from "@/lib/journalPrompts";
import { useHabits } from "@/hooks/use-habits";
import { useCompletionsForDateRange } from "@/hooks/use-completions";
import type { Doc } from "@/convex/_generated/dataModel";

// ── Injected styles ───────────────────────────────────────────────────────────
const PAGE_STYLE = `
.journal-textarea::placeholder {
  font-family: var(--font-display);
  font-style: italic;
  color: var(--text-subtle);
}
.journal-load-more:hover {
  text-decoration: underline;
}
.journal-clamp {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}
@keyframes journal-check-appear {
  0%   { opacity: 0; }
  6.5% { opacity: 1; }
  87%  { opacity: 1; }
  100% { opacity: 0; }
}
.journal-check-anim {
  display: inline-flex;
  align-items: center;
  animation: journal-check-appear 2.3s ease forwards;
}
`;

// ── Helpers ───────────────────────────────────────────────────────────────────
function formatTodayLong(): string {
  return new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

type SaveState = "idle" | "saving" | "saved" | "error" | "error-final";

// ── Page ──────────────────────────────────────────────────────────────────────
export default function JournalPage() {
  const todayStr = todayString();
  const prompt = getDailyPrompt(todayStr);

  const { isAuthenticated } = useConvexAuth();
  const todayEntry = useQuery(
    api.journal.getToday,
    isAuthenticated ? {} : "skip"
  );
  const upsertEntry = useMutation(api.journal.upsertEntry);

  const [content, setContent] = useState("");
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [loaded, setLoaded] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const savedTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const retryTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Always-current content ref — prevents stale closure in doSave
  const contentRef = useRef(content);
  contentRef.current = content;

  // Populate textarea once today's entry loads; autofocus when new
  useEffect(() => {
    if (loaded) return;
    if (todayEntry === undefined) return;
    const existingContent = todayEntry.entry?.content ?? "";
    setContent(existingContent);
    setLoaded(true);
    // Only autofocus when the entry is empty (don't override edit scroll position)
    if (!existingContent) {
      setTimeout(() => textareaRef.current?.focus(), 50);
    }
  }, [todayEntry, loaded]);

  // Auto-grow textarea whenever content changes
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, [content]);

  // Clean up all timers on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      if (savedTimerRef.current) clearTimeout(savedTimerRef.current);
      if (retryTimerRef.current) clearTimeout(retryTimerRef.current);
    };
  }, []);

  const doSave = useCallback(
    async (isRetry = false) => {
      const trimmed = contentRef.current.trim();
      if (!trimmed) return;
      setSaveState("saving");
      setErrorMsg("");
      const saveStart = Date.now();
      try {
        await upsertEntry({ content: trimmed, source: "journal" });
        // Ensure "Saving…" is visible for at least 400ms so the user sees feedback
        const elapsed = Date.now() - saveStart;
        if (elapsed < 400) {
          await new Promise<void>((r) => setTimeout(r, 400 - elapsed));
        }
        setSaveState("saved");
        if (savedTimerRef.current) clearTimeout(savedTimerRef.current);
        savedTimerRef.current = setTimeout(() => setSaveState("idle"), 2300);
      } catch {
        if (isRetry) {
          setSaveState("error-final");
          setErrorMsg("Couldn't save. Check your connection.");
        } else {
          setSaveState("error");
          setErrorMsg("Couldn't save — trying again...");
          retryTimerRef.current = setTimeout(() => doSave(true), 3000);
        }
      }
    },
    [upsertEntry]
  );

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    if (val.length > 5000) return;
    setContent(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => doSave(), 3000);
  };

  const handleSaveClick = () => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    doSave();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      if (debounceRef.current) clearTimeout(debounceRef.current);
      doSave();
    }
  };

  const handleRetry = () => {
    if (retryTimerRef.current) clearTimeout(retryTimerRef.current);
    setSaveState("idle");
    doSave(true);
  };

  const isEmpty = content.trim().length === 0;
  const charCount = content.length;
  const isSaving = saveState === "saving";
  const hasError = saveState === "error" || saveState === "error-final";

  // ── Loading skeleton for today's card ─────────────────────────────────────
  const cardSkeleton = (
    <div
      style={{
        background: "var(--bg-surface)",
        borderRadius: 12,
        border: "1px solid var(--border)",
        boxShadow: "0 1px 2px rgba(28,25,23,0.04)",
        padding: 24,
        minHeight: 120,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
        <div
          style={{ height: 20, width: "45%", borderRadius: 4, background: "var(--surface-alt)" }}
          className="animate-pulse"
        />
        <div
          style={{ height: 20, width: 52, borderRadius: 99, background: "var(--surface-alt)" }}
          className="animate-pulse"
        />
      </div>
      <div
        style={{ height: 120, borderRadius: 12, background: "var(--surface-alt)" }}
        className="animate-pulse"
      />
    </div>
  );

  return (
    <>
      <style>{PAGE_STYLE}</style>

      {/* Page header */}
      <div style={{ marginBottom: 32 }}>
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 42,
            fontWeight: 400,
            fontStyle: "italic",
            lineHeight: 1.1,
            color: "var(--text)",
            margin: 0,
          }}
        >
          Journal
        </h1>
        <p
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: 15,
            color: "var(--text-muted)",
            marginTop: 4,
            marginBottom: 0,
          }}
        >
          Your daily reflections
        </p>
      </div>

      {/* Today's writing card — skeleton until entry loads */}
      {!loaded ? cardSkeleton : (
        <div
          style={{
            background: "var(--bg-surface)",
            borderRadius: 12,
            border: "1px solid var(--border)",
            boxShadow: "0 1px 2px rgba(28,25,23,0.04)",
            padding: 24,
          }}
        >
          {/* Top row: date + "Today" pill */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span
              style={{
                fontFamily: "var(--font-display)",
                fontStyle: "italic",
                fontSize: 20,
                fontWeight: 400,
                color: "var(--text)",
              }}
            >
              {formatTodayLong()}
            </span>
            <span
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: 12,
                fontWeight: 500,
                color: "var(--accent)",
                background: "var(--accent-soft)",
                borderRadius: 99,
                padding: "2px 10px",
                lineHeight: 1.6,
              }}
            >
              Today
            </span>
          </div>

          {/* Textarea */}
          <textarea
            ref={textareaRef}
            className="journal-textarea"
            value={content}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder={prompt}
            rows={1}
            style={{
              display: "block",
              width: "100%",
              marginTop: 16,
              padding: 16,
              boxSizing: "border-box",
              background: "var(--bg-base)",
              border: "none",
              borderRadius: 12,
              outline: "none",
              resize: "none",
              fontFamily: "var(--font-sans)",
              fontSize: 15,
              lineHeight: 1.6,
              color: "var(--text)",
              minHeight: 120,
              maxHeight: 300,
              overflowY: "auto",
            }}
          />

          {/* Error message */}
          {hasError && (
            <p
              style={{
                margin: "8px 0 0",
                fontFamily: "var(--font-sans)",
                fontSize: 13,
                color: "var(--danger)",
              }}
            >
              {errorMsg}
              {saveState === "error-final" && (
                <>
                  {" "}
                  <button
                    onClick={handleRetry}
                    style={{
                      background: "none",
                      border: "none",
                      padding: 0,
                      fontFamily: "var(--font-sans)",
                      fontSize: 13,
                      color: "var(--danger)",
                      textDecoration: "underline",
                      cursor: "pointer",
                    }}
                  >
                    Try again
                  </button>
                </>
              )}
            </p>
          )}

          {/* Bottom row: char count + save button */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              gap: 12,
              marginTop: 12,
            }}
          >
            {charCount > 4000 && (
              <span
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: 12,
                  color: "var(--text-subtle)",
                }}
              >
                {charCount}/5000
              </span>
            )}

            <button
              onClick={handleSaveClick}
              disabled={isEmpty || isSaving}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 4,
                fontFamily: "var(--font-sans)",
                fontSize: 13,
                fontWeight: 500,
                color: "var(--bg-base)",
                background: "var(--text)",
                border: "none",
                borderRadius: 8,
                padding: "6px 20px",
                cursor: isEmpty || isSaving ? "default" : "pointer",
                opacity: isEmpty ? 0.4 : 1,
                transition: "opacity 0.15s",
              }}
            >
              {saveState === "saved" ? (
                <>
                  <span className="journal-check-anim">
                    <Check size={13} strokeWidth={2.5} />
                  </span>
                  Saved
                </>
              ) : isSaving ? (
                "Saving..."
              ) : (
                "Save"
              )}
            </button>
          </div>
        </div>
      )}

      {/* Past Entries */}
      <div style={{ marginTop: 48 }}>
        <PastEntries />
      </div>
    </>
  );
}

// ── Past Entries ──────────────────────────────────────────────────────────────

function PastEntries() {
  const { isAuthenticated } = useConvexAuth();
  const todayStr = todayString();

  const { results, status, loadMore } = usePaginatedQuery(
    api.journal.listEntries,
    isAuthenticated ? {} : "skip",
    { initialNumItems: 11 }
  );

  const pastEntries = useMemo(
    () => results.filter((e) => e.date !== todayStr),
    [results, todayStr]
  );

  const rangeStart =
    pastEntries.length > 0 ? pastEntries[pastEntries.length - 1].date : todayStr;
  const rangeEnd = pastEntries.length > 0 ? pastEntries[0].date : todayStr;

  const { habits } = useHabits();
  const { completions } = useCompletionsForDateRange(rangeStart, rangeEnd);

  const completionsByDate = useMemo(() => {
    const map = new Map<string, Set<string>>();
    completions?.forEach((c) => {
      if (!map.has(c.date)) map.set(c.date, new Set());
      map.get(c.date)!.add(c.habitId as string);
    });
    return map;
  }, [completions]);

  const [expandedId, setExpandedId] = useState<string | null>(null);
  const toggle = (id: string) =>
    setExpandedId((prev) => (prev === id ? null : id));

  const isLoading = status === "LoadingFirstPage";
  const isEmpty = !isLoading && status !== "LoadingMore" && pastEntries.length === 0;
  const canLoadMore = status === "CanLoadMore";

  return (
    <>
      {/* Section header */}
      <div style={{ paddingBottom: 12, borderBottom: "1px solid var(--border)" }}>
        <span
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: 13,
            fontWeight: 500,
            color: "var(--text-subtle)",
            letterSpacing: "0.05em",
            textTransform: "uppercase",
          }}
        >
          Past Entries
        </span>
      </div>

      {/* Loading skeleton — 3 rows */}
      {isLoading && (
        <div>
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              style={{ padding: "16px 0", borderBottom: "1px solid var(--border)" }}
            >
              <div className="animate-pulse" style={{ height: 17, width: "40%", borderRadius: 4, background: "var(--surface-alt)", marginBottom: 10 }} />
              <div className="animate-pulse" style={{ height: 13, width: "88%", borderRadius: 4, background: "var(--surface-alt)", marginBottom: 6 }} />
              <div className="animate-pulse" style={{ height: 13, width: "65%", borderRadius: 4, background: "var(--surface-alt)" }} />
            </div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {isEmpty && (
        <div style={{ paddingTop: 64, textAlign: "center" }}>
          <span
            style={{
              fontFamily: "var(--font-display)",
              fontStyle: "italic",
              fontSize: 17,
              color: "var(--text-subtle)",
            }}
          >
            Your past reflections will appear here
          </span>
        </div>
      )}

      {/* Entry rows */}
      {!isLoading &&
        pastEntries.map((entry) => (
          <EntryRow
            key={entry._id}
            entry={entry}
            expanded={expandedId === entry._id}
            onToggle={() => toggle(entry._id)}
            habits={habits}
            completedIds={completionsByDate.get(entry.date)}
          />
        ))}

      {/* Load more */}
      {canLoadMore && (
        <div style={{ paddingTop: 16 }}>
          <button
            className="journal-load-more"
            onClick={() => loadMore(10)}
            style={{
              background: "none",
              border: "none",
              padding: 0,
              fontFamily: "var(--font-sans)",
              fontSize: 14,
              color: "var(--accent)",
              cursor: "pointer",
              textDecoration: "none",
            }}
          >
            Show earlier entries
          </button>
        </div>
      )}

      {status === "LoadingMore" && (
        <div
          style={{
            paddingTop: 16,
            fontFamily: "var(--font-sans)",
            fontSize: 14,
            color: "var(--text-subtle)",
          }}
        >
          Loading…
        </div>
      )}
    </>
  );
}

// ── Entry Row ─────────────────────────────────────────────────────────────────

type JournalEntry = Doc<"journalEntries">;
type Habit = Doc<"habits">;

function formatEntryDate(dateStr: string): string {
  return new Date(dateStr + "T00:00:00").toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

interface EntryRowProps {
  entry: JournalEntry;
  expanded: boolean;
  onToggle: () => void;
  habits: Habit[] | undefined;
  completedIds: Set<string> | undefined;
}

function EntryRow({ entry, expanded, onToggle, habits, completedIds }: EntryRowProps) {
  return (
    <div
      onClick={onToggle}
      style={{
        padding: "16px 0",
        borderBottom: "1px solid var(--border)",
        cursor: "pointer",
      }}
    >
      {/* Top row: date + habit dots */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
        <span
          style={{
            fontFamily: "var(--font-display)",
            fontStyle: "italic",
            fontSize: 17,
            fontWeight: 400,
            color: "var(--text)",
          }}
        >
          {formatEntryDate(entry.date)}
        </span>

        {habits && habits.length > 0 && (
          <div style={{ display: "flex", gap: 4, flexShrink: 0 }}>
            {habits.map((habit) => {
              const done = completedIds?.has(habit._id as string) ?? false;
              return (
                <div
                  key={habit._id}
                  title={habit.title}
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    flexShrink: 0,
                    background: done ? (habit.color ?? "var(--accent)") : "transparent",
                    border: done ? "none" : "1px solid var(--border-strong)",
                  }}
                />
              );
            })}
          </div>
        )}
      </div>

      {/* Content — 200ms max-height animation */}
      <div
        style={{
          marginTop: 8,
          overflow: "hidden",
          maxHeight: expanded ? 2000 : 44,
          transition: "max-height 200ms ease",
        }}
      >
        <p
          className={expanded ? undefined : "journal-clamp"}
          style={{
            margin: 0,
            fontFamily: "var(--font-sans)",
            fontSize: expanded ? 15 : 14,
            color: expanded ? "var(--text)" : "var(--text-muted)",
            lineHeight: expanded ? 1.6 : 1.5,
          }}
        >
          {entry.content}
        </p>
      </div>
    </div>
  );
}
