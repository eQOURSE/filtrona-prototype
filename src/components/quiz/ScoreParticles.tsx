"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

interface ScoreParticlesProps {
  trigger: number;
  x: number;
  y: number;
}

interface Particle {
  id: number;
  angle: number;
  distance: number;
  color: string;
}

const PARTICLE_COLORS = ["#00E5A0", "#2ff3ad", "#7C5CFF", "#FFB547"];

export default function ScoreParticles({ trigger, x, y }: ScoreParticlesProps) {
  const prefersReducedMotion = useReducedMotion();
  const [bursts, setBursts] = useState<{ id: number; particles: Particle[] }[]>([]);
  const burstCounter = useRef(0);

  useEffect(() => {
    if (trigger <= 0) return;

    burstCounter.current += 1;
    const burstId = burstCounter.current;

    const particles: Particle[] = Array.from({ length: 12 }, (_, i) => ({
      id: i,
      angle: (360 / 12) * i + (Math.random() * 30 - 15),
      distance: 80 + Math.random() * 60,
      color: PARTICLE_COLORS[i % PARTICLE_COLORS.length],
    }));

    setBursts((prev) => [...prev, { id: burstId, particles }]);

    // Auto-cleanup after animation
    const timer = setTimeout(() => {
      setBursts((prev) => prev.filter((b) => b.id !== burstId));
    }, 900);

    return () => clearTimeout(timer);
  }, [trigger]);

  if (prefersReducedMotion) {
    // Reduced motion: just flash the score area
    return (
      <AnimatePresence>
        {trigger > 0 && (
          <motion.div
            key={trigger}
            className="pointer-events-none absolute z-50"
            style={{ left: x, top: y }}
            initial={{ scale: 1.5, opacity: 1 }}
            animate={{ scale: 1, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div
              className="h-4 w-4 rounded-full"
              style={{ backgroundColor: "#00E5A0" }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      <AnimatePresence>
        {bursts.map((burst) =>
          burst.particles.map((p) => {
            const rad = (p.angle * Math.PI) / 180;
            const tx = Math.cos(rad) * p.distance;
            const ty = Math.sin(rad) * p.distance;

            return (
              <motion.div
                key={`${burst.id}-${p.id}`}
                className="absolute rounded-full"
                style={{
                  left: x,
                  top: y,
                  width: 5,
                  height: 5,
                  backgroundColor: p.color,
                }}
                initial={{ x: 0, y: 0, scale: 1, opacity: 1 }}
                animate={{
                  x: tx,
                  y: ty,
                  scale: 0,
                  opacity: 0,
                }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
            );
          })
        )}
      </AnimatePresence>
    </div>
  );
}
