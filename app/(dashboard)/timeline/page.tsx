"use client";

import { useState } from "react";
import { TimelineHeader } from "@/components/timeline/timeline-header";
import { TimelineView } from "@/components/timeline/timeline-view";
import { today } from "@/lib/date-utils";

export default function TimelinePage() {
  const [selectedDate, setSelectedDate] = useState(today);

  return (
    <>
      <TimelineHeader date={selectedDate} onDateChange={setSelectedDate} />
      <TimelineView date={selectedDate} />
    </>
  );
}
