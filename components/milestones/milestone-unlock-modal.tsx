"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import {
  HolographicMilestoneCard,
  HolographicMilestoneData,
} from "@/components/3d/holographic-milestone-card";

interface MilestoneUnlockModalProps {
  milestone: HolographicMilestoneData | null;
  isOpen: boolean;
  onClose: () => void;
}

export function MilestoneUnlockModal({
  milestone,
  isOpen,
  onClose,
}: MilestoneUnlockModalProps) {
  if (!isOpen || !milestone) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Dark Frosted Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/75 backdrop-blur-xl"
        />

        {/* Modal Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: "spring", stiffness: 350, damping: 28 }}
          className="relative z-10 flex flex-col items-center max-w-lg w-full"
        >
          {/* Close Button Top Right */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close milestone card"
            className="absolute top-0 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer z-30"
          >
            <X size={18} />
          </button>

          <HolographicMilestoneCard milestone={milestone} onClose={onClose} />
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
