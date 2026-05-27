"use client";

import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Heart } from "lucide-react";

interface HeartsIndicatorProps {
  hearts: number;
  max?: number;
}

export default function HeartsIndicator({
  hearts,
  max = 3,
}: HeartsIndicatorProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className="flex items-center gap-1.5" aria-label={`${hearts} of ${max} hearts remaining`}>
      {Array.from({ length: max }, (_, i) => {
        const isFilled = i < hearts;
        return (
          <AnimatePresence mode="wait" key={i}>
            {isFilled ? (
              <motion.div
                key={`filled-${i}-${hearts}`}
                initial={false}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
              >
                <Heart
                  size={22}
                  fill="#d91f29"
                  color="#d91f29"
                  strokeWidth={0}
                />
              </motion.div>
            ) : (
              <motion.div
                key={`empty-${i}-${hearts}`}
                initial={
                  prefersReducedMotion
                    ? { opacity: 0.4 }
                    : { scale: 1.4, x: 0 }
                }
                animate={
                  prefersReducedMotion
                    ? { opacity: 0.4 }
                    : {
                        scale: 1,
                        x: [0, -8, 8, -6, 4, 0],
                        opacity: 0.4,
                      }
                }
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                <Heart
                  size={22}
                  color="var(--text-muted)"
                  strokeWidth={1.5}
                  style={{ opacity: 0.4 }}
                />
              </motion.div>
            )}
          </AnimatePresence>
        );
      })}
    </div>
  );
}
