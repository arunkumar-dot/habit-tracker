"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";

// ============================================
// TYPES
// ============================================

interface Particle {
  id: number;
  x: number;      // final x offset from origin (px)
  y: number;      // final y offset (negative = up)
  rotate: number; // final rotation (deg)
  color: string;
  size: number;   // width in px
  aspect: number; // height = size * aspect (rect vs square)
  delay: number;
}

interface Burst {
  id: number;
  originX: number; // viewport px
  originY: number;
  particles: Particle[];
}

interface ConfettiContextValue {
  triggerConfetti: (originX?: number, originY?: number) => void;
}

// ============================================
// CONSTANTS
// ============================================

const COLORS = [
  "#6366f1", "#10b981", "#f59e0b", "#ef4444",
  "#8b5cf6", "#ec4899", "#06b6d4", "#84cc16",
];

const PARTICLE_COUNT = 36;

// ============================================
// CONTEXT
// ============================================

const ConfettiContext = createContext<ConfettiContextValue>({
  triggerConfetti: () => {},
});

export function useConfetti() {
  return useContext(ConfettiContext);
}

// ============================================
// PROVIDER
// ============================================

export function ConfettiProvider({ children }: { children: React.ReactNode }) {
  const [bursts, setBursts] = useState<Burst[]>([]);
  const counterRef = useRef(0);
  // Gate the portal so it only mounts after React has hydrated.
  // Without this, the server skips the portal (document is undefined) but the
  // client inserts it immediately, causing a hydration mismatch.
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const triggerConfetti = useCallback(
    (originX = window.innerWidth / 2, originY = window.innerHeight / 3) => {
      const id = ++counterRef.current;

      const particles: Particle[] = Array.from(
        { length: PARTICLE_COUNT },
        (_, i) => {
          const angle = (i / PARTICLE_COUNT) * Math.PI * 2;
          const speed = Math.random() * 220 + 80;
          return {
            id: i,
            x: Math.cos(angle) * speed * (0.5 + Math.random()),
            y: Math.sin(angle) * speed * (0.5 + Math.random()) - 120,
            rotate: Math.random() * 720 - 360,
            color: COLORS[Math.floor(Math.random() * COLORS.length)]!,
            size: Math.random() * 7 + 5,
            aspect: Math.random() > 0.5 ? 2.5 : 1,
            delay: Math.random() * 0.12,
          };
        }
      );

      setBursts((prev) => [...prev, { id, originX, originY, particles }]);

      // Auto-remove after animation completes
      setTimeout(() => {
        setBursts((prev) => prev.filter((b) => b.id !== id));
      }, 1800);
    },
    []
  );

  return (
    <ConfettiContext.Provider value={{ triggerConfetti }}>
      {children}
      {mounted &&
        createPortal(
          <div
            style={{
              position: "fixed",
              inset: 0,
              pointerEvents: "none",
              zIndex: 9999,
              overflow: "hidden",
            }}
          >
            <AnimatePresence>
              {bursts.map((burst) =>
                burst.particles.map((p) => (
                  <motion.div
                    key={`${burst.id}-${p.id}`}
                    initial={{
                      x: burst.originX,
                      y: burst.originY,
                      opacity: 1,
                      rotate: 0,
                      scale: 1,
                    }}
                    animate={{
                      x: burst.originX + p.x,
                      y: burst.originY + p.y,
                      opacity: 0,
                      rotate: p.rotate,
                      scale: 0.4,
                    }}
                    transition={{
                      duration: 1.2,
                      delay: p.delay,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    style={{
                      position: "absolute",
                      width: p.size,
                      height: p.size * p.aspect,
                      borderRadius: p.aspect === 1 ? "50%" : 2,
                      background: p.color,
                      top: 0,
                      left: 0,
                    }}
                  />
                ))
              )}
            </AnimatePresence>
          </div>,
          document.body
        )}
    </ConfettiContext.Provider>
  );
}
