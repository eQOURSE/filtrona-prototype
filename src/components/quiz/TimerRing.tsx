"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useReducedMotion } from "framer-motion";

interface TimerRingProps {
  seconds: number;
  total: number;
  isPaused: boolean;
  onComplete: () => void;
}

export default function TimerRing({
  seconds,
  total,
  isPaused,
  onComplete,
}: TimerRingProps) {
  const prefersReducedMotion = useReducedMotion();
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  // Internal smooth timer
  const [display, setDisplay] = useState(seconds);
  const startTimeRef = useRef<number | null>(null);
  const startValueRef = useRef(seconds);
  const frameRef = useRef<number>(0);
  const completedRef = useRef(false);

  // Reset when seconds prop changes (new question)
  useEffect(() => {
    setDisplay(seconds);
    startTimeRef.current = null;
    startValueRef.current = seconds;
    completedRef.current = false;
  }, [seconds]);

  const tick = useCallback(() => {
    if (completedRef.current) return;

    const now = performance.now();
    if (startTimeRef.current === null) {
      startTimeRef.current = now;
    }

    const elapsed = (now - startTimeRef.current) / 1000;
    const remaining = Math.max(0, startValueRef.current - elapsed);

    setDisplay(remaining);

    if (remaining <= 0) {
      completedRef.current = true;
      onCompleteRef.current();
      return;
    }

    frameRef.current = requestAnimationFrame(tick);
  }, []);

  useEffect(() => {
    if (isPaused || completedRef.current) {
      cancelAnimationFrame(frameRef.current);
      // Save current position for resume
      startValueRef.current = display;
      startTimeRef.current = null;
      return;
    }

    startValueRef.current = display;
    startTimeRef.current = null;
    frameRef.current = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(frameRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPaused, tick]);

  const ratio = display / total;
  const displaySeconds = Math.ceil(display);

  // SVG params
  const size = 64;
  const strokeWidth = 5;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - ratio);

  // Color tiers
  let color = "var(--accent-blue)";
  if (ratio <= 0.25) color = "#d91f29";
  else if (ratio <= 0.5) color = "var(--accent-red)";

  const shouldPulse = ratio <= 0.25 && !prefersReducedMotion;

  return (
    <div
      className="relative flex items-center justify-center"
      style={{
        width: size,
        height: size,
        animation: shouldPulse
          ? "timer-pulse 0.8s ease-in-out infinite"
          : undefined,
      }}
      role="timer"
      aria-label={`${displaySeconds} seconds remaining`}
    >
      <svg width={size} height={size} className="rotate-[-90deg]">
        {/* Background track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--border-default)"
          strokeWidth={strokeWidth}
        />
        {/* Foreground */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          style={{ transition: "stroke 0.3s ease" }}
        />
      </svg>
      <span
        className="absolute text-[18px] font-bold tabular-nums"
        style={{ color, fontFamily: "var(--font-sans), monospace" }}
      >
        {displaySeconds}
      </span>

      <style jsx>{`
        @keyframes timer-pulse {
          0%,
          100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.08);
          }
        }
      `}</style>
    </div>
  );
}
