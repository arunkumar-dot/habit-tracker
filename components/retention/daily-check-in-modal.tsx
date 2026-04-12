"use client";

import { useEffect, useState } from "react";
import { CheckCircle, XCircle } from "lucide-react";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useDailyCheckIn } from "@/hooks/use-daily-check-in";

/**
 * Auto-shows a modal once per day prompting the user to confirm habit completion.
 * Renders nothing if the user has already answered today's check-in.
 */
export function DailyCheckInModal() {
  const { checkIn, isLoading, submitCheckIn } = useDailyCheckIn();
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Open modal when we confirm no check-in has been recorded today
  useEffect(() => {
    if (!isLoading && checkIn === null) {
      setIsOpen(true);
    }
  }, [isLoading, checkIn]);

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
