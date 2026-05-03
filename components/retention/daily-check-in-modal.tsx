"use client";

import { useEffect, useState } from "react";
import { CheckCircle, XCircle } from "lucide-react";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useDailyCheckIn } from "@/hooks/use-daily-check-in";

/** Show the modal at or after this hour (24-hour clock). */
const EVENING_HOUR = 18; // 6 PM

/**
 * Returns true if the current local time is 6 PM or later.
 * Re-evaluated on every render — good enough since the modal only
 * needs to check once when the page loads or when habits complete.
 */
function isEvening(): boolean {
  return new Date().getHours() >= EVENING_HOUR;
}

interface DailyCheckInModalProps {
  /**
   * Pass true when the user has ticked off every habit for today.
   * Triggers the modal immediately regardless of time of day —
   * "you just finished, great moment to confirm!"
   */
  allHabitsDone?: boolean;
}

/**
 * Auto-shows a modal once per day prompting the user to confirm habit completion.
 *
 * Opens only when ALL of the following are true:
 *   1. The user has not answered today's check-in yet (no DB record)
 *   2. Either:
 *        a. It is 6 PM or later (end-of-day recap), OR
 *        b. The user just completed all their habits (natural completion moment)
 *
 * This prevents the dialog from nagging the user every time they visit
 * the dashboard during the day when habits may still be in progress.
 */
export function DailyCheckInModal({ allHabitsDone = false }: DailyCheckInModalProps) {
  const { checkIn, isLoading, submitCheckIn } = useDailyCheckIn();
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Only proceed once loading is complete and no check-in exists for today
    if (isLoading || checkIn !== null) return;

    // Show if it's evening OR the user finished all habits
    if (isEvening() || allHabitsDone) {
      setIsOpen(true);
    }
  }, [isLoading, checkIn, allHabitsDone]);

  async function handleResponse(completed: boolean) {
    setIsSubmitting(true);
    try {
      await submitCheckIn(completed);
    } finally {
      setIsSubmitting(false);
      setIsOpen(false);
    }
  }

  return (
    <Dialog
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      title="Daily Check-In"
      description="How did your habits go today?"
      maxWidth="sm"
    >
      <div className="flex flex-col gap-3 pt-1">
        <Button
          variant="primary"
          className="w-full justify-center gap-2"
          onClick={() => handleResponse(true)}
          disabled={isSubmitting}
        >
          <CheckCircle size={16} />
          Yes, I completed my habits
        </Button>
        <Button
          variant="secondary"
          className="w-full justify-center gap-2"
          onClick={() => handleResponse(false)}
          disabled={isSubmitting}
        >
          <XCircle size={16} />
          Not today
        </Button>
      </div>
    </Dialog>
  );
}
