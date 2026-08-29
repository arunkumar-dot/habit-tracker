"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useConvexAuth } from "convex/react";
import { useUser } from "@clerk/nextjs";
import { api } from "@/convex/_generated/api";
import { Spinner } from "@/components/ui/spinner";

const PLACEHOLDERS = [
  "Someone who exercises every morning",
  "A calmer person",
  "Someone who reads every day",
  "A focused developer",
];

export default function OnboardingPage() {
  const router = useRouter();
  const { user: clerkUser, isSignedIn, isLoaded } = useUser();
  const { isAuthenticated, isLoading: authLoading } = useConvexAuth();

  const [step, setStep] = useState<1 | 2>(1);
  const [identityStatement, setIdentityStatement] = useState("");
  const [habitName, setHabitName] = useState("");
  const [habitTime, setHabitTime] = useState("07:00");
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [placeholderIdx, setPlaceholderIdx] = useState(0);

  const identityInputRef = useRef<HTMLTextAreaElement>(null);
  const habitInputRef = useRef<HTMLInputElement>(null);

  const upsertUser = useMutation(api.users.upsertUser);
  const completeOnboarding = useMutation(api.users.completeOnboarding);
  const createHabit = useMutation(api.habits.createHabit);

  // Sync Clerk user -> Convex as soon as auth resolves
  useEffect(() => {
    if (authLoading || !isAuthenticated || !clerkUser) return;
    upsertUser({
      name: clerkUser.fullName ?? clerkUser.username ?? "Anonymous",
      firstName: clerkUser.firstName ?? undefined,
      lastName: clerkUser.lastName ?? undefined,
      email: clerkUser.primaryEmailAddress?.emailAddress ?? "",
      imageUrl: clerkUser.imageUrl,
    }).catch(console.error);
  }, [authLoading, isAuthenticated, clerkUser, upsertUser]);

  // Query existing habits to decide whether to show Step 2
  const habits = useQuery(
    api.habits.listHabits,
    !authLoading && isAuthenticated ? {} : "skip"
  );

  // Redirect away if not signed in
  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.replace("/sign-in");
    }
  }, [isLoaded, isSignedIn, router]);

  // Redirect away if already onboarded
  const currentUser = useQuery(
    api.users.getCurrentUser,
    !authLoading && isAuthenticated ? {} : "skip"
  );
  useEffect(() => {
    if (currentUser?.onboardingCompleted) {
      router.replace("/dashboard");
    }
  }, [currentUser, router]);

  // Rotate placeholder text every 3 seconds on Step 1
  useEffect(() => {
    if (step !== 1) return;
    const id = setInterval(() => {
      setPlaceholderIdx((i) => (i + 1) % PLACEHOLDERS.length);
    }, 3000);
    return () => clearInterval(id);
  }, [step]);

  // Focus identity input on mount
  useEffect(() => {
    if (step === 1) {
      const t = setTimeout(() => identityInputRef.current?.focus(), 120);
      return () => clearTimeout(t);
    }
  }, [step]);

  // Focus habit name input when step 2 appears
  useEffect(() => {
    if (step === 2) {
      const t = setTimeout(() => habitInputRef.current?.focus(), 120);
      return () => clearTimeout(t);
    }
  }, [step]);

  const identityTrimmed = identityStatement.trim();
  const canAdvance = identityTrimmed.length >= 3;

  async function handleStep1() {
    if (!canAdvance || submitting) return;
    setErrorMsg(null);

    // If user already has habits, skip Step 2 and complete onboarding now
    const hasHabits = Array.isArray(habits) && habits.length > 0;
    if (hasHabits) {
      setSubmitting(true);
      try {
        if (clerkUser) {
          await upsertUser({
            name: clerkUser.fullName ?? clerkUser.username ?? "Anonymous",
            firstName: clerkUser.firstName ?? undefined,
            lastName: clerkUser.lastName ?? undefined,
            email: clerkUser.primaryEmailAddress?.emailAddress ?? "",
            imageUrl: clerkUser.imageUrl,
          });
        }
        await completeOnboarding({ identityStatement: identityTrimmed });
        router.replace("/dashboard");
      } catch (err: unknown) {
        console.error(err);
        setErrorMsg(err instanceof Error ? err.message : "Failed to save. Please try again.");
        setSubmitting(false);
      }
      return;
    }

    setStep(2);
  }

  const habitNameTrimmed = habitName.trim();
  const canFinish = habitNameTrimmed.length >= 1 && habitTime.length > 0;

  async function handleStep2() {
    if (!canFinish || submitting) return;
    setSubmitting(true);
    setErrorMsg(null);
    try {
      if (clerkUser) {
        await upsertUser({
          name: clerkUser.fullName ?? clerkUser.username ?? "Anonymous",
          firstName: clerkUser.firstName ?? undefined,
          lastName: clerkUser.lastName ?? undefined,
          email: clerkUser.primaryEmailAddress?.emailAddress ?? "",
          imageUrl: clerkUser.imageUrl,
        });
      }
      await createHabit({
        title: habitNameTrimmed,
        startTime: habitTime,
        frequency: "daily",
      });
      await completeOnboarding({
        identityStatement: identityTrimmed.length >= 3 ? identityTrimmed : habitNameTrimmed,
      });
      router.replace("/dashboard");
    } catch (err: unknown) {
      console.error(err);
      setErrorMsg(err instanceof Error ? err.message : "Failed to save habit. Please try again.");
      setSubmitting(false);
    }
  }

  // Show a centred spinner while Clerk or Convex auth is still resolving
  if (!isLoaded || authLoading) {
    return (
      <div
        style={{
          minHeight: "100dvh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "var(--bg-base)",
        }}
      >
        <Spinner size="lg" className="text-terracotta" />
      </div>
    );
  }

  if (!isSignedIn) return null;

  return (
    <div
      style={{
        minHeight: "100dvh",
        display: "flex",
        flexDirection: "column",
        overflowY: "auto",
        background: "var(--bg-base)",
        paddingTop: "env(safe-area-inset-top)",
        paddingBottom: "env(safe-area-inset-bottom)",
      }}
    >
      {/* Progress dots */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: 8,
          paddingTop: 20,
          paddingBottom: 4,
        }}
        aria-label={`Step ${step} of 2`}
      >
        {[1, 2].map((n) => (
          <div
            key={n}
            style={{
              width: n === step ? 24 : 8,
              height: 8,
              borderRadius: 100,
              background: n === step ? "var(--accent)" : "var(--border-default)",
              transition: "width 0.3s ease, background 0.3s ease",
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "24px 24px 16px",
          maxWidth: 440,
          width: "100%",
          margin: "0 auto",
          boxSizing: "border-box",
        }}
      >
        {step === 1 ? (
          <Step1
            value={identityStatement}
            onChange={setIdentityStatement}
            placeholder={PLACEHOLDERS[placeholderIdx]}
            inputRef={identityInputRef}
            onSubmit={handleStep1}
          />
        ) : (
          <Step2
            habitName={habitName}
            onHabitNameChange={setHabitName}
            habitTime={habitTime}
            onHabitTimeChange={setHabitTime}
            habitInputRef={habitInputRef}
            onSubmit={handleStep2}
          />
        )}
      </div>

      {/* CTA — lives in the natural flow, not fixed, so keyboard pushes it up */}
      <div
        style={{
          padding: "0 24px 32px",
          maxWidth: 440,
          width: "100%",
          margin: "0 auto",
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          gap: 12,
        }}
      >
        {errorMsg && (
          <div
            role="alert"
            style={{
              padding: "12px 16px",
              borderRadius: 12,
              background: "rgba(239, 68, 68, 0.1)",
              border: "1px solid rgba(239, 68, 68, 0.25)",
              color: "#ef4444",
              fontSize: 14,
              fontFamily: "var(--font-sans)",
              textAlign: "center",
            }}
          >
            {errorMsg}
          </div>
        )}

        <button
          type="button"
          onClick={step === 1 ? handleStep1 : handleStep2}
          disabled={step === 1 ? !canAdvance || submitting : !canFinish || submitting}
          style={{
            width: "100%",
            minHeight: 56,
            borderRadius: 16,
            border: "none",
            background: (step === 1 ? canAdvance : canFinish) && !submitting
              ? "var(--accent)"
              : "var(--border-default)",
            color: (step === 1 ? canAdvance : canFinish) && !submitting
              ? "#fff"
              : "var(--text-disabled)",
            fontSize: 17,
            fontWeight: 600,
            fontFamily: "var(--font-sans)",
            cursor: (step === 1 ? canAdvance : canFinish) && !submitting
              ? "pointer"
              : "not-allowed",
            transition: "background 0.2s ease, color 0.2s ease",
            WebkitTapHighlightColor: "transparent",
          }}
        >
          {submitting
            ? "Saving…"
            : step === 1
            ? "Let's build toward that"
            : "Start my journey"}
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Step 1 — Identity Statement
// ─────────────────────────────────────────────

interface Step1Props {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  inputRef: React.RefObject<HTMLTextAreaElement | null>;
  onSubmit: () => void;
}

function Step1({ value, onChange, placeholder, inputRef, onSubmit }: Step1Props) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <p
          style={{
            margin: 0,
            fontSize: 13,
            fontWeight: 500,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            color: "var(--accent)",
            fontFamily: "var(--font-sans)",
          }}
        >
          Your identity
        </p>
        <h1
          style={{
            margin: 0,
            fontSize: "clamp(28px, 8vw, 38px)",
            lineHeight: 1.15,
            fontFamily: "var(--font-display)",
            fontStyle: "italic",
            fontWeight: 400,
            color: "var(--text-primary)",
          }}
        >
          Who do you want to become?
        </h1>
      </div>

      <textarea
        ref={inputRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={3}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            onSubmit();
          }
        }}
        style={{
          width: "100%",
          boxSizing: "border-box",
          minHeight: 100,
          padding: "14px 16px",
          borderRadius: 14,
          border: "1.5px solid var(--border-default)",
          background: "var(--bg-elevated)",
          color: "var(--text-primary)",
          fontSize: 17,
          lineHeight: 1.5,
          fontFamily: "var(--font-sans)",
          resize: "none",
          outline: "none",
          WebkitAppearance: "none",
          transition: "border-color 0.15s ease",
        }}
        onFocus={(e) => {
          e.target.style.borderColor = "var(--accent)";
        }}
        onBlur={(e) => {
          e.target.style.borderColor = "var(--border-default)";
        }}
        autoComplete="off"
        autoCorrect="on"
        spellCheck
        enterKeyHint="go"
        aria-label="Your identity statement"
      />

      <p
        style={{
          margin: 0,
          fontSize: 14,
          color: "var(--text-tertiary)",
          fontFamily: "var(--font-sans)",
          lineHeight: 1.5,
        }}
      >
        This is the person you&apos;re designing. You&apos;ll see it every time you open the app.
      </p>
    </div>
  );
}

// ─────────────────────────────────────────────
// Step 2 — First Habit
// ─────────────────────────────────────────────

interface Step2Props {
  habitName: string;
  onHabitNameChange: (v: string) => void;
  habitTime: string;
  onHabitTimeChange: (v: string) => void;
  habitInputRef: React.RefObject<HTMLInputElement | null>;
  onSubmit: () => void;
}

function Step2({
  habitName,
  onHabitNameChange,
  habitTime,
  onHabitTimeChange,
  habitInputRef,
  onSubmit,
}: Step2Props) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <p
          style={{
            margin: 0,
            fontSize: 13,
            fontWeight: 500,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            color: "var(--accent)",
            fontFamily: "var(--font-sans)",
          }}
        >
          First habit
        </p>
        <h1
          style={{
            margin: 0,
            fontSize: "clamp(28px, 8vw, 38px)",
            lineHeight: 1.15,
            fontFamily: "var(--font-display)",
            fontStyle: "italic",
            fontWeight: 400,
            color: "var(--text-primary)",
          }}
        >
          What&apos;s your first habit?
        </h1>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {/* Habit name */}
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <label
            htmlFor="habit-name"
            style={{
              fontSize: 14,
              fontWeight: 500,
              color: "var(--text-secondary)",
              fontFamily: "var(--font-sans)",
            }}
          >
            Habit name
          </label>
          <input
            id="habit-name"
            ref={habitInputRef}
            type="text"
            value={habitName}
            onChange={(e) => onHabitNameChange(e.target.value)}
            placeholder="Morning run"
            onKeyDown={(e) => {
              if (e.key === "Enter") onSubmit();
            }}
            style={{
              width: "100%",
              boxSizing: "border-box",
              minHeight: 52,
              padding: "14px 16px",
              borderRadius: 14,
              border: "1.5px solid var(--border-default)",
              background: "var(--bg-elevated)",
              color: "var(--text-primary)",
              fontSize: 17,
              fontFamily: "var(--font-sans)",
              outline: "none",
              WebkitAppearance: "none",
              transition: "border-color 0.15s ease",
            }}
            onFocus={(e) => {
              e.target.style.borderColor = "var(--accent)";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "var(--border-default)";
            }}
            autoComplete="off"
            autoCorrect="on"
            spellCheck
            enterKeyHint="next"
            aria-label="Habit name"
          />
        </div>

        {/* Time */}
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <label
            htmlFor="habit-time"
            style={{
              fontSize: 14,
              fontWeight: 500,
              color: "var(--text-secondary)",
              fontFamily: "var(--font-sans)",
            }}
          >
            Time
          </label>
          <input
            id="habit-time"
            type="time"
            value={habitTime}
            onChange={(e) => onHabitTimeChange(e.target.value)}
            style={{
              width: "100%",
              boxSizing: "border-box",
              minHeight: 52,
              padding: "14px 16px",
              borderRadius: 14,
              border: "1.5px solid var(--border-default)",
              background: "var(--bg-elevated)",
              color: "var(--text-primary)",
              fontSize: 17,
              fontFamily: "var(--font-sans)",
              outline: "none",
              WebkitAppearance: "none",
              transition: "border-color 0.15s ease",
            }}
            onFocus={(e) => {
              e.target.style.borderColor = "var(--accent)";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "var(--border-default)";
            }}
            aria-label="Habit time"
          />
        </div>
      </div>

      <p
        style={{
          margin: 0,
          fontSize: 14,
          color: "var(--text-tertiary)",
          fontFamily: "var(--font-sans)",
          lineHeight: 1.5,
        }}
      >
        Keep it simple. You can add more habits and details later.
      </p>
    </div>
  );
}
