"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAction, useQuery } from "convex/react";
import { useAuth, useUser } from "@clerk/nextjs";
import { AlertTriangle, Trash2, X } from "lucide-react";
import { api } from "@/convex/_generated/api";
import {
  DialogRoot,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import * as Sentry from "@sentry/nextjs";

type Step = "summary" | "confirm";

interface DeleteAccountDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Two-step account deletion confirmation dialog.
 *
 * Step 1 — Summary: shows counts of data that will be permanently deleted.
 * Step 2 — Final confirm: user must type their email address to unlock the
 *           destructive button.
 *
 * On success: calls Clerk signOut() and redirects to /sign-in?accountDeleted=true.
 * On failure: shows an error message inside the dialog and keeps the user signed in.
 */
export function DeleteAccountDialog({ isOpen, onClose }: DeleteAccountDialogProps) {
  const [step, setStep] = useState<Step>("summary");
  const [confirmEmail, setConfirmEmail] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();
  const { signOut } = useAuth();
  const { user } = useUser();
  const { showToast } = useToast();

  const summary = useQuery(api.userData.getUserDataSummary);
  const deleteMyAccount = useAction(api.deleteAccount.deleteMyAccount);

  const userEmail = user?.primaryEmailAddress?.emailAddress ?? "";
  const emailMatches = confirmEmail.trim() === userEmail;

  function handleClose() {
    if (isDeleting) return;
    setStep("summary");
    setConfirmEmail("");
    setError(null);
    onClose();
  }

  async function handleDelete() {
    if (!emailMatches || isDeleting) return;
    setIsDeleting(true);
    setError(null);
    try {
      await deleteMyAccount();
      // All Convex data is gone. Sign out of Clerk and redirect.
      await signOut();
      router.replace("/sign-in?accountDeleted=true");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "An unexpected error occurred.";
      setError(message);
      Sentry.captureException(err, { tags: { action: "deleteMyAccount" } });
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <DialogRoot open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="max-w-md">
        {step === "summary" ? (
          <>
            {/* ── Step 1: summary ─────────────────────────────────────────── */}
            <DialogHeader>
              <div className="flex items-center gap-3 flex-1">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: "color-mix(in srgb, var(--danger) 15%, transparent)" }}
                >
                  <Trash2 size={18} style={{ color: "var(--danger)" }} />
                </div>
                <DialogTitle>Delete your account?</DialogTitle>
              </div>
              <DialogClose
                className="flex-shrink-0 ml-4 p-1.5 rounded-lg transition-colors text-muted-foreground hover:text-foreground hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                aria-label="Close dialog"
              >
                <X size={18} aria-hidden="true" />
              </DialogClose>
            </DialogHeader>

            <div className="p-6 space-y-5">
              <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                This will permanently delete:
              </p>

              <ul className="space-y-1.5 text-sm pl-1" style={{ color: "var(--text-primary)" }}>
                {summary ? (
                  <>
                    {summary.habits > 0 && (
                      <li className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-current opacity-40 flex-shrink-0" />
                        <span>{summary.habits} habit{summary.habits !== 1 ? "s" : ""}</span>
                      </li>
                    )}
                    {summary.completions > 0 && (
                      <li className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-current opacity-40 flex-shrink-0" />
                        <span>{summary.completions} completion record{summary.completions !== 1 ? "s" : ""}</span>
                      </li>
                    )}
                    {summary.journalEntries > 0 && (
                      <li className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-current opacity-40 flex-shrink-0" />
                        <span>{summary.journalEntries} journal entr{summary.journalEntries !== 1 ? "ies" : "y"}</span>
                      </li>
                    )}
                    {summary.milestones > 0 && (
                      <li className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-current opacity-40 flex-shrink-0" />
                        <span>{summary.milestones} milestone{summary.milestones !== 1 ? "s" : ""}</span>
                      </li>
                    )}
                    {summary.pomodoroSessions > 0 && (
                      <li className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-current opacity-40 flex-shrink-0" />
                        <span>{summary.pomodoroSessions} pomodoro session{summary.pomodoroSessions !== 1 ? "s" : ""}</span>
                      </li>
                    )}
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-40 flex-shrink-0" />
                      <span>Your account itself</span>
                    </li>
                  </>
                ) : (
                  // Loading skeleton
                  <>
                    {[...Array(4)].map((_, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-current opacity-20 flex-shrink-0" />
                        <span
                          className="h-4 rounded animate-pulse"
                          style={{
                            width: `${60 + i * 12}px`,
                            background: "var(--bg-hover)",
                          }}
                        />
                      </li>
                    ))}
                  </>
                )}
              </ul>

              <div
                className="flex items-start gap-3 rounded-lg p-3"
                style={{
                  background: "color-mix(in srgb, var(--danger) 8%, transparent)",
                  border: "1px solid color-mix(in srgb, var(--danger) 25%, transparent)",
                }}
              >
                <AlertTriangle size={16} className="flex-shrink-0 mt-0.5" style={{ color: "var(--danger)" }} />
                <p className="text-xs font-semibold" style={{ color: "var(--danger)" }}>
                  This cannot be undone.
                </p>
              </div>

              <div className="flex gap-3 justify-end pt-1">
                <Button variant="secondary" size="md" onClick={handleClose}>
                  Cancel
                </Button>
                <Button
                  variant="danger"
                  size="md"
                  onClick={() => setStep("confirm")}
                >
                  Continue
                </Button>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* ── Step 2: final confirmation ───────────────────────────────── */}
            <DialogHeader>
              <div className="flex items-center gap-3 flex-1">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: "color-mix(in srgb, var(--danger) 15%, transparent)" }}
                >
                  <AlertTriangle size={18} style={{ color: "var(--danger)" }} />
                </div>
                <DialogTitle>Are you absolutely sure?</DialogTitle>
              </div>
              <DialogClose
                className="flex-shrink-0 ml-4 p-1.5 rounded-lg transition-colors text-muted-foreground hover:text-foreground hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                aria-label="Close dialog"
              >
                <X size={18} aria-hidden="true" />
              </DialogClose>
            </DialogHeader>

            <div className="p-6 space-y-5">
              <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                Type your email address{" "}
                <span
                  className="font-semibold select-all"
                  style={{ color: "var(--text-primary)" }}
                >
                  {userEmail}
                </span>{" "}
                to confirm.
              </p>

              <input
                type="email"
                autoComplete="off"
                placeholder={userEmail}
                value={confirmEmail}
                onChange={(e) => setConfirmEmail(e.target.value)}
                disabled={isDeleting}
                className="w-full rounded-md border bg-input px-4 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-[var(--danger)] focus:ring-0 disabled:opacity-50"
                style={{
                  borderColor: confirmEmail && !emailMatches
                    ? "var(--danger)"
                    : "transparent",
                }}
                aria-label="Confirm email address"
              />

              {error && (
                <div
                  className="rounded-lg p-3 text-xs"
                  style={{
                    background: "color-mix(in srgb, var(--danger) 8%, transparent)",
                    border: "1px solid color-mix(in srgb, var(--danger) 25%, transparent)",
                    color: "var(--danger)",
                  }}
                >
                  {error}
                </div>
              )}

              {isDeleting && (
                <p className="text-sm text-center" style={{ color: "var(--text-secondary)" }}>
                  Deleting your account…
                </p>
              )}

              <div className="flex gap-3 justify-end pt-1">
                <Button
                  variant="secondary"
                  size="md"
                  onClick={() => {
                    setStep("summary");
                    setConfirmEmail("");
                    setError(null);
                  }}
                  disabled={isDeleting}
                >
                  Cancel
                </Button>
                <Button
                  variant="danger"
                  size="md"
                  disabled={!emailMatches || isDeleting}
                  isLoading={isDeleting}
                  onClick={handleDelete}
                >
                  Delete forever
                </Button>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </DialogRoot>
  );
}
