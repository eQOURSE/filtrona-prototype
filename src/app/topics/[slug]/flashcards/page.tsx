"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ArrowLeft, CheckCircle2, RotateCcw, Info } from "lucide-react";
import TopNav from "@/components/TopNav";
import Flashcard from "@/components/Flashcard";
import { getFlashcards, Flashcard as FlashcardType } from "@/lib/flashcard-content";
import { useProgressStore } from "@/lib/progress-store";
import { topics } from "@/lib/topics";

const EASE = [0.16, 1, 0.3, 1] as const;

export default function FlashcardsPage() {
  const router = useRouter();
  const params = useParams<{ slug: string }>();
  const prefersReducedMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  const slug = params.slug;
  const topic = topics.find((t) => t.slug === slug);
  const topicTitle = topic?.title ?? "Topic";
  
  const flashcards = getFlashcards(slug);

  const markComplete = useProgressStore((s) => s.markComplete);
  const isComplete = useProgressStore((s) => s.isComplete);
  const alreadyComplete = mounted ? isComplete(slug, "flashcards") : false;

  // ── Card state ────────────────────────────────────────────────
  const [queue, setQueue] = useState<FlashcardType[]>([...flashcards]);
  const [isFlipped, setIsFlipped] = useState(false);
  const [totalReviewed, setTotalReviewed] = useState(0);
  const [direction, setDirection] = useState(1); // 1 = forward, -1 = backward
  const [showBanner, setShowBanner] = useState(true);
  const [started, setStarted] = useState(false);

  const currentCard = queue[0] ?? null;
  const totalCards = flashcards.length;
  const gotCount = totalCards - queue.length;
  const isDone = queue.length === 0;

  useEffect(() => setMounted(true), []);

  // Auto-start if not previously completed
  useEffect(() => {
    if (mounted && !alreadyComplete) {
      setStarted(true);
    }
  }, [mounted, alreadyComplete]);

  const advanceCard = useCallback(
    (action: "got" | "review") => {
      if (!currentCard) return;
      setIsFlipped(false);
      setTotalReviewed((n) => n + 1);

      if (action === "got") {
        setDirection(1);
        setTimeout(() => setQueue((q) => q.slice(1)), 50);
      } else {
        setDirection(-1);
        setTimeout(() => {
          setQueue((q) => {
            const [first, ...rest] = q;
            return [...rest, first];
          });
        }, 50);
      }
    },
    [currentCard]
  );

  // ── Keyboard shortcuts ──────────────────────────────────────
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (isDone || !started) return;
      if (e.key === " ") {
        e.preventDefault();
        setIsFlipped((f) => !f);
      }
      if (isFlipped) {
        if (e.key === "ArrowRight" || e.key.toLowerCase() === "g") {
          advanceCard("got");
        }
        if (e.key === "ArrowLeft" || e.key.toLowerCase() === "r") {
          advanceCard("review");
        }
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isFlipped, isDone, started, advanceCard]);

  const handleComplete = () => {
    markComplete(slug, "flashcards");
    setTimeout(() => router.push(`/topics/${slug}`), 600);
  };

  const handleStartOver = () => {
    setQueue([...flashcards]);
    setIsFlipped(false);
    setTotalReviewed(0);
    setStarted(true);
    setShowBanner(false);
  };

  // ── Animation variants ──────────────────────────────────────
  const cardVariants = {
    enter: (dir: number) => ({
      x: prefersReducedMotion ? 0 : dir > 0 ? 200 : -200,
      opacity: 0,
    }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({
      x: prefersReducedMotion ? 0 : dir > 0 ? -200 : 200,
      opacity: 0,
    }),
  };

  return (
    <div className="min-h-screen  text-[var(--text-primary)]">
      <TopNav />

      <main className="mx-auto max-w-[720px] px-4 pt-6 pb-16 sm:px-6">
        {/* ── Header ─────────────────────────────────────────────── */}
        <header>
          <Link
            href={`/topics/${slug}`}
            className="inline-flex items-center gap-1.5 text-sm text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]"
          >
            <ArrowLeft size={14} />
            {topicTitle}
          </Link>

          <div
            className="mt-4 inline-block rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wider"
            style={{ backgroundColor: "var(--accent-mint-soft)", color: "var(--accent-mint)" }}
          >
            Flashcards
          </div>

          <h1 className="mt-3 text-[32px] font-bold tracking-[-0.02em] text-[var(--text-primary)] sm:text-[40px]">
            {topicTitle} Flashcards
          </h1>
          <p className="mt-2 text-[15px] text-[var(--text-secondary)] sm:text-[16px]">
            Flip each card. Mark the ones you&apos;ve got, send the rest back for review.
          </p>
        </header>

        {/* ── Resume banner ──────────────────────────────────────── */}
        {mounted && alreadyComplete && showBanner && !started && (
          <div className="mt-6 flex items-center justify-between rounded-xl border border-[var(--border-default)] bg-[var(--bg-surface)] px-5 py-4">
            <div className="flex items-center gap-3">
              <Info size={18} className="text-[var(--accent-mint)]" />
              <span className="text-[14px] text-[var(--text-secondary)]">
                You completed these earlier. Run through them again to refresh.
              </span>
            </div>
            <button
              onClick={handleStartOver}
              className="shrink-0 rounded-lg bg-[var(--accent-mint)] px-4 py-2 text-[13px] font-semibold text-[var(--bg-base)] transition-opacity hover:opacity-90"
            >
              Start over
            </button>
          </div>
        )}

        {started && (
          <div className="mt-6">
            {/* ── Progress indicator ─────────────────────────────── */}
            {!isDone && (
              <div className="mx-auto mb-6 flex max-w-[540px] flex-col items-center gap-2">
                <span className="text-[14px] text-[var(--text-muted)]">
                  {gotCount + 1} / {totalCards}
                </span>
                <div className="h-[3px] w-[240px] rounded-full bg-[var(--border-default)]">
                  <div
                    className="h-full rounded-full bg-[var(--accent-mint)] transition-all duration-500 ease-out"
                    style={{ width: `${(gotCount / totalCards) * 100}%` }}
                  />
                </div>
              </div>
            )}

            {/* ── Card area ──────────────────────────────────────── */}
            {!isDone && currentCard && (
              <>
                <AnimatePresence mode="wait" custom={direction}>
                  <motion.div
                    key={currentCard.id + "-" + queue.length}
                    custom={direction}
                    variants={cardVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.35, ease: EASE }}
                  >
                    <Flashcard
                      card={currentCard}
                      isFlipped={isFlipped}
                      onFlip={() => setIsFlipped((f) => !f)}
                    />
                  </motion.div>
                </AnimatePresence>

                {/* Action row */}
                <div className="mx-auto mt-8 flex max-w-[540px] items-center justify-center gap-4">
                  {!isFlipped ? (
                    <p className="text-[14px] text-[var(--text-muted)]">
                      Flip the card to see the answer
                    </p>
                  ) : (
                    <>
                      <button
                        onClick={() => advanceCard("review")}
                        className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-[var(--border-default)] bg-[var(--bg-elevated)] px-6 py-3.5 text-[14px] font-medium text-[var(--text-primary)] transition-colors hover:border-[var(--accent-violet)] hover:bg-[var(--bg-surface)]"
                      >
                        <RotateCcw size={16} />
                        Review again
                      </button>
                      <button
                        onClick={() => advanceCard("got")}
                        className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-[var(--accent-mint)] px-7 py-3.5 text-[14px] font-semibold text-[var(--bg-base)] shadow-mint-glow transition-all duration-300 hover:shadow-mint-glow-hover"
                      >
                        Got it ✓
                      </button>
                    </>
                  )}
                </div>

                {/* Keyboard hint */}
                <p className="mt-4 text-center text-[12px] text-[var(--text-muted)] opacity-60">
                  Space to flip · → or G for Got it · ← or R for Review
                </p>
              </>
            )}

            {/* ── Completion card ────────────────────────────────── */}
            {isDone && (
              <motion.div
                className="mx-auto max-w-[540px] rounded-2xl border border-[var(--border-default)] bg-[var(--bg-surface)] p-8 text-center sm:p-10"
                initial={!prefersReducedMotion ? { opacity: 0, y: 20 } : undefined}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: EASE }}
              >
                <CheckCircle2 size={56} className="mx-auto text-[var(--accent-mint)]" />
                <h2 className="mt-4 text-[24px] font-semibold text-[var(--text-primary)]">
                  All cards locked in 🧠
                </h2>
                <p className="mt-2 text-[14px] text-[var(--text-secondary)]">
                  {totalReviewed} cards reviewed ·{" "}
                  {totalReviewed > totalCards
                    ? `${totalReviewed - totalCards} extra reviews`
                    : "no repeats needed"}
                </p>
                <button
                  onClick={handleComplete}
                  className="mt-6 w-full cursor-pointer rounded-xl bg-[var(--accent-mint)] px-8 py-3.5 text-[15px] font-semibold text-[var(--bg-base)] shadow-mint-glow transition-all duration-300 hover:shadow-mint-glow-hover"
                >
                  Mark complete &amp; return
                </button>
                <button
                  onClick={handleStartOver}
                  className="mt-3 cursor-pointer text-[14px] font-medium text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]"
                >
                  Run through them again
                </button>
              </motion.div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
