"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Flame } from "lucide-react";

interface StreakIndicatorProps {
  streak: number;
}

function getStreakTier(streak: number) {
  if (streak >= 7)
    return {
      color: "var(--accent-navy)",
      glow: "0 0 16px rgba(124, 92, 255, 0.5)",
      rainbow: true,
    };
  if (streak >= 5)
    return {
      color: "#7C5CFF",
      glow: "0 0 14px rgba(124, 92, 255, 0.4)",
      rainbow: false,
    };
  if (streak >= 3)
    return {
      color: "#00E5A0",
      glow: "0 0 12px rgba(0, 229, 160, 0.4)",
      rainbow: false,
    };
  if (streak >= 1)
    return { color: "#FFB547", glow: "none", rainbow: false };
  return { color: "var(--text-muted)", glow: "none", rainbow: false };
}

export default function StreakIndicator({ streak }: StreakIndicatorProps) {
  const prefersReducedMotion = useReducedMotion();
  const tier = getStreakTier(streak);

  const textStyle: React.CSSProperties = tier.rainbow
    ? {
        background: "linear-gradient(90deg, #7C5CFF, #00E5A0, #FFB547)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
      }
    : { color: tier.color };

  return (
    <motion.div
      key={streak}
      className="flex items-center gap-1.5"
      initial={
        prefersReducedMotion || streak === 0
          ? false
          : { scale: 1.3 }
      }
      animate={
        tier.rainbow && !prefersReducedMotion
          ? {
              scale: [1.0, 1.05, 1.0],
              transition: { repeat: Infinity, duration: 1.2 },
            }
          : { scale: 1 }
      }
      transition={{ duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
      style={{ filter: tier.glow !== "none" ? `drop-shadow(${tier.glow})` : undefined }}
      aria-label={`${streak} streak`}
    >
      <Flame
        size={20}
        style={{ color: tier.color }}
        fill={streak > 0 ? tier.color : "none"}
      />
      <span
        className="text-[14px] font-semibold tabular-nums"
        style={textStyle}
      >
        {streak}× streak
      </span>
    </motion.div>
  );
}
