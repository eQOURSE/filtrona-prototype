"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import TopNav from "@/components/TopNav";
import { historySlides } from "@/lib/slide-content";
import { useProgressStore } from "@/lib/progress-store";

/* ── Accent color map ──────────────────────────────────────────── */
const accentColors: Record<string, string> = {
  mint: "var(--accent-mint)",
  violet: "var(--accent-violet)",
  orange: "var(--accent-orange)",
  blue: "var(--accent-blue)",
};

const accentSoftBg: Record<string, string> = {
  mint: "var(--accent-mint-soft)",
  violet: "var(--accent-violet-soft)",
  orange: "var(--accent-orange-soft)",
  blue: "var(--accent-blue-soft)",
};

/* ── Animation config ──────────────────────────────────────────── */
const EASE = [0.16, 1, 0.3, 1] as const;

/* ── Single milestone block ────────────────────────────────────── */
function MilestoneBlock({
  milestone,
  index,
  isLast,
  reduceMotion,
}: {
  milestone: (typeof historySlides)[number];
  index: number;
  isLast: boolean;
  reduceMotion: boolean | null;
}) {
  const color = accentColors[milestone.accent];
  const softBg = accentSoftBg[milestone.accent];

  return (
    <div className="relative flex gap-0" style={{ paddingBottom: isLast ? 0 : "96px" }}>
      {/* ── Left rail: vertical line + node ──────────────────── */}
      <div className="relative flex flex-col items-center" style={{ width: "48px", minWidth: "48px" }}>
        {/* Vertical line segment — hidden for last item's bottom half */}
        {!isLast && (
          <div
            className="absolute left-1/2 top-0 -translate-x-1/2 w-[2px] h-full bg-[var(--border-default)]"
            aria-hidden="true"
          />
        )}
        {/* Line above node (connects from previous) */}
        {index > 0 && (
          <div
            className="absolute left-1/2 top-0 -translate-x-1/2 w-[2px] bg-[var(--border-default)]"
            style={{ height: "0px" }}
            aria-hidden="true"
          />
        )}

        {/* The circular year node */}
        <motion.div
          className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full border-2 transition-colors duration-500"
          style={{
            backgroundColor: "var(--bg-base)",
            borderColor: color,
          }}
          {...(!reduceMotion
            ? {
                initial: { opacity: 0, scale: 0.5 },
                whileInView: {
                  opacity: 1,
                  scale: 1,
                  backgroundColor: color,
                  borderColor: color,
                },
                viewport: { once: true, margin: "-100px" },
                transition: { duration: 0.6, ease: EASE },
              }
            : {
                // Static: filled state
                style: {
                  backgroundColor: color,
                  borderColor: color,
                  opacity: 1,
                },
              })}
        >
          <span
            className="text-[13px] font-semibold font-mono transition-colors duration-500"
            style={{ color: "var(--bg-base)" }}
          >
            {milestone.year}
          </span>
        </motion.div>
      </div>

      {/* ── Right content area ───────────────────────────────── */}
      <motion.div
        className="flex-1 pl-8 pt-0.5"
        {...(!reduceMotion
          ? {
              initial: { opacity: 0, y: 20 },
              whileInView: { opacity: 1, y: 0 },
              viewport: { once: true, margin: "-100px" },
              transition: { duration: 0.6, ease: EASE, delay: 0.1 },
            }
          : {})}
      >
        {/* Tag pill */}
        {milestone.tag && (
          <span
            className="inline-block rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider"
            style={{ backgroundColor: softBg, color }}
          >
            {milestone.tag}
          </span>
        )}

        {/* Title */}
        <h3 className="mt-3 text-[22px] font-semibold text-[var(--text-primary)] sm:text-[28px]">
          {milestone.title}
        </h3>

        {/* Body */}
        <p className="mt-3 max-w-[640px] text-[15px] leading-[1.6] text-[var(--text-secondary)] sm:text-[16px]">
          {milestone.body}
        </p>
      </motion.div>
    </div>
  );
}

/* ── Page component ────────────────────────────────────────────── */
export default function SlidesPage() {
  const router = useRouter();
  const prefersReducedMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);

  const markComplete = useProgressStore((s) => s.markComplete);
  const isComplete = useProgressStore((s) => s.isComplete);
  const alreadyComplete = mounted ? isComplete("history", "slides") : false;

  useEffect(() => setMounted(true), []);

  const handleComplete = () => {
    if (!alreadyComplete) {
      markComplete("history", "slides");
    }
    // Navigate back after a short delay for state to persist
    setTimeout(() => router.push("/topics/history"), 600);
  };

  return (
    <div className="min-h-screen bg-[var(--bg-base)] text-[var(--text-primary)]">
      <TopNav />

      <main className="mx-auto max-w-[1100px] px-4 pt-12 pb-40 sm:px-8">
        {/* ── Header ─────────────────────────────────────────────── */}
        <header>
          <Link
            href="/topics/history"
            className="inline-flex items-center gap-1.5 text-sm text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]"
          >
            <ArrowLeft size={14} />
            The Filtrona Story
          </Link>

          <div className="mt-4 inline-block rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wider"
            style={{ backgroundColor: "var(--accent-mint-soft)", color: "var(--accent-mint)" }}
          >
            01 · Slide Deck
          </div>

          <h1 className="mt-3 text-[32px] font-bold tracking-[-0.02em] text-[var(--text-primary)] sm:text-[48px]">
            The Filtrona Story
          </h1>

          <p className="mt-2 text-[15px] text-[var(--text-secondary)] sm:text-[17px]">
            Eight moments that shaped a century of filter innovation.
          </p>
        </header>

        {/* ── Timeline ───────────────────────────────────────────── */}
        <div className="mt-20">
          {historySlides.map((milestone, i) => (
            <MilestoneBlock
              key={milestone.year}
              milestone={milestone}
              index={i}
              isLast={i === historySlides.length - 1}
              reduceMotion={prefersReducedMotion}
            />
          ))}
        </div>

        {/* ── Completion card ────────────────────────────────────── */}
        <motion.div
          className="mx-auto mt-20 max-w-[640px] rounded-2xl border border-[var(--border-default)] bg-[var(--bg-surface)] p-8 text-center"
          {...(!prefersReducedMotion
            ? {
                initial: { opacity: 0, y: 20 },
                whileInView: { opacity: 1, y: 0 },
                viewport: { once: true, margin: "-60px" },
                transition: { duration: 0.6, ease: EASE },
              }
            : {})}
        >
          <CheckCircle2
            size={40}
            className="mx-auto text-[var(--accent-mint)]"
          />
          <h2 className="mt-4 text-[20px] font-semibold text-[var(--text-primary)]">
            You&apos;ve made it through 100 years of filter history.
          </h2>
          <p className="mt-2 text-[15px] text-[var(--text-secondary)]">
            {alreadyComplete
              ? "This slide deck is already marked complete."
              : "Mark this slide deck complete to unlock the next sub-module."}
          </p>
          <button
            onClick={handleComplete}
            className="mt-5 inline-flex cursor-pointer items-center gap-2 rounded-xl bg-[var(--accent-mint)] px-8 py-3.5 text-[15px] font-semibold text-[var(--bg-base)] shadow-mint-glow transition-all duration-300 hover:shadow-mint-glow-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-mint)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-base)]"
          >
            {alreadyComplete ? "Revisit completed ✓" : "Mark as complete"}
          </button>
        </motion.div>
      </main>
    </div>
  );
}
