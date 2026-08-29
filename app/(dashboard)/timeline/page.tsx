"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { TimelineHeader } from "@/components/timeline/timeline-header";
import { TimelineView } from "@/components/timeline/timeline-view";
import { today } from "@/lib/date-utils";

export default function TimelinePage() {
  const [selectedDate, setSelectedDate] = useState(today);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="max-w-2xl mx-auto flex flex-col gap-6"
    >
      <TimelineHeader date={selectedDate} onDateChange={setSelectedDate} />
      <TimelineView date={selectedDate} />
    </motion.div>
  );
}
