"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Image from "next/image";

/* ═══════════════════════════════════════════════════════════════════
   Filtrona Academy — Landing Page (page.tsx)
   ─────────────────────────────────────────────────────────────────
   Single-file implementation. Sections are marked with comments.
   StitchMCP design system: assets/12370850675125066534
   StitchMCP project:       projects/7860978822941879243
   ═══════════════════════════════════════════════════════════════════ */

/* ── Animation config ─────────────────────────────────────────── */
const EASE = [0.16, 1, 0.3, 1] as const;

const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.15,
    },
  },
};

const fadeSlideUp = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: EASE },
  },
};

/* ── Gradient orb positions (drifting background) ─────────────── */
const orbConfigs = [
  {
    // Mint: top-left quadrant
    left: "-10%",
    top: "-10%",
    color: "var(--accent-mint)",
    opacity: 0.18,
    duration: 38,
    x: ["0px", "80px", "-40px", "100px", "0px"],
    y: ["0px", "100px", "40px", "-60px", "0px"],
  },
  {
    // Violet: bottom-right quadrant
    left: "50%",
    top: "50%",
    color: "var(--accent-violet)",
    opacity: 0.18,
    duration: 44,
    x: ["0px", "-100px", "50px", "-80px", "0px"],
    y: ["0px", "-80px", "-120px", "60px", "0px"],
  },
  {
    // Orange: center-right
    left: "60%",
    top: "20%",
    color: "var(--accent-orange)",
    opacity: 0.10,
    duration: 35,
    x: ["0px", "120px", "-60px", "80px", "0px"],
    y: ["0px", "-100px", "100px", "-50px", "0px"],
  },
];

/* ── Page component ───────────────────────────────────────────── */
export default function Home() {
  const router = useRouter();
  const prefersReducedMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    document.body.classList.add("home-page-bg");
    return () => document.body.classList.remove("home-page-bg");
  }, []);

  return (
    <main className="relative flex min-h-screen flex-col overflow-hidden ">

      {/* ── Animated gradient orbs (background) ──────────────── */}
      {mounted && !prefersReducedMotion && (
        <div className="pointer-events-none absolute inset-0 z-0" aria-hidden="true">
          {orbConfigs.map((cfg, i) => {
            return (
              <motion.div
                key={i}
                className="absolute rounded-full"
                style={{
                  width: "800px",
                  height: "800px",
                  background: `radial-gradient(circle, ${cfg.color} 0%, transparent 70%)`,
                  filter: "blur(120px)",
                  opacity: cfg.opacity,
                  left: cfg.left,
                  top: cfg.top,
                }}
                animate={{
                  x: cfg.x,
                  y: cfg.y,
                }}
                transition={{
                  duration: cfg.duration,
                  ease: "easeInOut",
                  repeat: Infinity,
                  repeatType: "loop",
                }}
              />
            );
          })}
        </div>
      )}

      {/* ── Grid overlay ─────────────────────────────────────── */}
      <div
        className="grid-overlay pointer-events-none absolute inset-0 z-[1]"
        aria-hidden="true"
      />

      {/* ── Top nav bar ──────────────────────────────────────── */}
      <header className="relative z-10 flex w-full items-center justify-between px-6 py-5 md:px-10 md:py-6">

        {/* Wordmark with Official Logo */}
        <div className="flex items-center">
          <Image 
            src="/finallogo.webp" 
            alt="Filtrona Academy" 
            width={180} 
            height={55} 
            className="h-10 w-auto object-contain" 
            priority
          />
        </div>

        {/* Right side: version pill */}
        <div className="flex items-center gap-3">
          <span className="hidden rounded-full border border-[var(--border-default)] px-3.5 py-1 text-xs font-medium text-[var(--text-muted)] md:inline-block">
            v0.1 · Prototype
          </span>
        </div>
      </header>

      {/* ── Hero content (centered) ──────────────────────────── */}
      <motion.div
        className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 text-center md:px-10"
        variants={!prefersReducedMotion ? staggerContainer : undefined}
        initial={!prefersReducedMotion ? "hidden" : undefined}
        animate={mounted && !prefersReducedMotion ? "visible" : undefined}
      >
        {/* Heading */}
        <motion.h1
          variants={!prefersReducedMotion ? fadeSlideUp : undefined}
          className="max-w-[900px] text-[48px] font-bold leading-[1.05] tracking-[-0.02em] text-[var(--text-primary)] md:text-[80px]"
        >
          Learn how the world filters.
        </motion.h1>

        {/* Subheading */}
        <motion.p
          variants={!prefersReducedMotion ? fadeSlideUp : undefined}
          className="mt-5 max-w-[560px] text-lg leading-relaxed text-[var(--text-secondary)] md:mt-6"
        >
          An interactive induction experience for Filtrona&apos;s people. Built
          around how you actually learn.
        </motion.p>

        {/* CTA button */}
        <motion.div variants={!prefersReducedMotion ? fadeSlideUp : undefined}>
          <button
            id="cta-start-learning"
            onClick={() => router.push("/topics")}
            className="group relative mt-10 inline-flex cursor-pointer items-center gap-2 rounded-xl bg-[var(--accent-mint)] px-8 py-4 text-base font-semibold text-[var(--bg-base)] shadow-mint-glow transition-all duration-300 hover:shadow-mint-glow-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-mint)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-base)] md:mt-12 max-md:mx-6 max-md:w-[calc(100%-48px)]"
          >
            Start Learning
            <ArrowRight
              size={18}
              strokeWidth={2.5}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </button>
        </motion.div>
      </motion.div>

      {/* ── Bottom indicator (fixed) ─────────────────────────── */}
      <footer className="relative z-10 pb-6 pt-4 text-center">
        <p className="text-xs font-medium text-[var(--text-muted)]">
          ~25 minutes · 2 modules ready
        </p>
      </footer>
    </main>
  );
}
