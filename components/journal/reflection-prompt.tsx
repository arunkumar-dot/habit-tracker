"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { useQuery, useMutation, useConvexAuth } from "convex/react";
import { api } from "@/convex/_generated/api";
import { ChevronDown, ChevronUp } from "lucide-react";
import Link from "next/link";
import { today as todayString } from "@/lib/date-utils";
import { getDailyPrompt } from "@/lib/journalPrompts";

const PROMPT_STYLE = `
.rp-textarea::placeholder {
  font-family: var(--font-display);
  font-style: italic;
  color: var(--text-subtle);
}
.rp-header:hover {
  background: var(--surface-alt);
}
`;

type SaveState = "idle" | "saving" | "error" | "error-final";

export function ReflectionPrompt() {
  const todayStr = todayString();
  const prompt = getDailyPrompt(todayStr);

  const { isAuthenticated } = useConvexAuth();
  const todayEntry = useQuery(
    api.journal.getToday,
    isAuthenticated ? {} : "skip"
  );
  const upsertEntry = useMutation(api.journal.upsertEntry);

  const [expanded, setExpanded] = useState(false);
  const [content, setContent] = useState("");
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [sessionSaved, setSessionSaved] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const retryTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const contentRef = useRef(content);
  contentRef.current = content;

  // Auto-grow textarea
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, [content]);

  // Focus when expanding
  useEffect(() => {
    if (expanded) setTimeout(() => textareaRef.current?.focus(), 50);
  }, [expanded]);

  useEffect(() => {
    return () => {
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
        await upsertEntry({ content: trimmed, source: "dashboard" });
        const elapsed = Date.now() - saveStart;
        if (elapsed < 400) {
          await new Promise<void>((r) => setTimeout(r, 400 - elapsed));
        }
        setSessionSaved(true);
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

  const handleRetry = () => {
    if (retryTimerRef.current) clearTimeout(retryTimerRef.current);
    setSaveState("idle");
    doSave(true);
  };

  // Still loading
  if (todayEntry === undefined) return null;

  // Entry already exists and not saved this session
  if (todayEntry.entry && !sessionSaved) return null;

  // ── Saved state ───────────────────────────────────────────────────────────
  if (sessionSaved) {
    return (
      <>
        <style>{PROMPT_STYLE}</style>
        <div style={{ borderTop: "1px dashed var(--border)", marginTop: 24, paddingTop: 16 }}>
          <span
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: 13,
              color: "var(--text-subtle)",
            }}
          >
            Reflection saved
          </span>
          {"  "}
          <Link
            href="/journal"
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: 13,
              color: "var(--accent)",
              textDecoration: "none",
            }}
          >
            View in Journal →
          </Link>
        </div>
      </>
    );
  }

  const isEmpty = content.trim().length === 0;
  const isSaving = saveState === "saving";
  const hasError = saveState === "error" || saveState === "error-final";

  // ── Prompt ────────────────────────────────────────────────────────────────
  return (
    <>
      <style>{PROMPT_STYLE}</style>
      <div style={{ borderTop: "1px dashed var(--border)", marginTop: 24 }}>
        {/* Header row — always visible */}
        <div
          className="rp-header"
          onClick={() => setExpanded((v) => !v)}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "12px 0",
            cursor: "pointer",
            borderRadius: 6,
            transition: "background 150ms",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-display)",
              fontStyle: "italic",
              fontSize: 15,
              color: "var(--text-subtle)",
            }}
          >
            How did today go?
          </span>
          {expanded ? (
            <ChevronUp size={16} style={{ color: "var(--text-subtle)", flexShrink: 0 }} />
          ) : (
            <ChevronDown size={16} style={{ color: "var(--text-subtle)", flexShrink: 0 }} />
          )}
        </div>

        {/* Expanded body — always rendered, height-animated */}
        <div
          style={{
            overflow: "hidden",
            maxHeight: expanded ? 360 : 0,
            transition: "max-height 200ms ease",
          }}
        >
          <div style={{ paddingBottom: 16 }}>
            <textarea
              ref={textareaRef}
              className="rp-textarea"
              value={content}
              onChange={(e) => {
                if (e.target.value.length > 5000) return;
                setContent(e.target.value);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                  e.preventDefault();
                  doSave();
                }
              }}
              placeholder={prompt}
              rows={1}
              style={{
                display: "block",
                width: "100%",
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
                minHeight: 80,
                maxHeight: 200,
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

            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 10 }}>
              <button
                onClick={() => doSave()}
                disabled={isEmpty || isSaving}
                style={{
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
                {isSaving ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
