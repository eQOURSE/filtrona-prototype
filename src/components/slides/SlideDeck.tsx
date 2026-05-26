"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, ChevronLeft, ChevronRight } from "lucide-react";
import FilterSlide from "./FilterSlide";
import SlideNavigation from "./SlideNavigation";
import ConnectedActionsBar from "./ConnectedActionsBar";
import CoachDrawer from "./CoachDrawer";
import { useProgressStore } from "@/lib/progress-store";
import type { FilterSlide as FilterSlideType } from "@/lib/slide-content";

interface SlideDeckProps {
  slides: FilterSlideType[];
  topicSlug: string;
}

export default function SlideDeck({ slides, topicSlug }: SlideDeckProps) {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [hasReachedEnd, setHasReachedEnd] = useState(false);
  const [mounted, setMounted] = useState(false);

  const markComplete = useProgressStore((s) => s.markComplete);
  const isComplete = useProgressStore((s) => s.isComplete);
  const alreadyComplete = mounted ? isComplete(topicSlug, "slides") : false;

  useEffect(() => setMounted(true), []);

  // Completion logic
  useEffect(() => {
    if (currentIndex === slides.length - 1 && !hasReachedEnd) {
      const timer = setTimeout(() => setHasReachedEnd(true), 2000);
      return () => clearTimeout(timer);
    }
  }, [currentIndex, slides.length, hasReachedEnd]);

  // Keyboard navigation
  useEffect(() => {
    if (isDrawerOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "Home") handleGoTo(0);
      if (e.key === "End") handleGoTo(slides.length - 1);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentIndex, isDrawerOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      setDirection(1);
      setCurrentIndex((i) => i + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setDirection(-1);
      setCurrentIndex((i) => i - 1);
    }
  };

  const handleGoTo = (idx: number) => {
    if (idx === currentIndex) return;
    setDirection(idx > currentIndex ? 1 : -1);
    setCurrentIndex(idx);
  };

  const handleMarkComplete = () => {
    markComplete(topicSlug, "slides");
    setTimeout(() => router.push(`/topics/${topicSlug}`), 600);
  };

  const currentSlide = slides[currentIndex];

  const variants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 100 : -100,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -100 : 100,
      opacity: 0,
    }),
  };

  return (
    <div className="w-full max-w-[1280px] mx-auto">
      <SlideNavigation
        currentIndex={currentIndex}
        totalSlides={slides.length}
        accent={currentSlide.accent}
        onNext={handleNext}
        onPrev={handlePrev}
        onGoTo={handleGoTo}
      />

      <div className="relative">
        {/* Navigation arrows (desktop: outside, mobile: hidden/swipe) */}
        <div className="hidden lg:block">
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className="absolute -left-6 top-1/2 -translate-y-1/2 z-10 flex h-12 w-12 items-center justify-center rounded-full border border-[var(--border-default)] bg-[var(--bg-elevated)] transition-all hover:border-[var(--accent-mint)] hover:bg-[var(--accent-mint-soft)] disabled:opacity-30 disabled:cursor-not-allowed shadow-sm"
            aria-label="Previous slide"
          >
            <ChevronLeft size={24} className="text-[var(--text-secondary)] -ml-0.5" />
          </button>
          <button
            onClick={handleNext}
            disabled={currentIndex === slides.length - 1}
            className="absolute -right-6 top-1/2 -translate-y-1/2 z-10 flex h-12 w-12 items-center justify-center rounded-full border border-[var(--border-default)] bg-[var(--bg-elevated)] transition-all hover:border-[var(--accent-mint)] hover:bg-[var(--accent-mint-soft)] disabled:opacity-30 disabled:cursor-not-allowed shadow-sm"
            aria-label="Next slide"
          >
            <ChevronRight size={24} className="text-[var(--text-secondary)] -mr-0.5" />
          </button>
        </div>

        {/* Main slide area with swipe support */}
        <div className="relative overflow-hidden rounded-3xl" aria-live="polite">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentIndex}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragEnd={(e, { offset, velocity }) => {
                const swipe = offset.x;
                if (swipe < -50 || velocity.x < -500) handleNext();
                else if (swipe > 50 || velocity.x > 500) handlePrev();
              }}
              className="w-full flex flex-col"
            >
              <FilterSlide
                slide={currentSlide}
                isActive={true}
                slideIndex={currentIndex}
                totalSlides={slides.length}
              />
              <ConnectedActionsBar
                slide={currentSlide}
                onAskCoach={() => setIsDrawerOpen(true)}
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Completion CTA */}
      <AnimatePresence>
        {hasReachedEnd && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mx-auto mt-8 max-w-[540px] rounded-2xl border border-[var(--accent-mint)] bg-[var(--bg-surface)] p-8 text-center shadow-sm"
          >
            <CheckCircle2 size={40} className="mx-auto text-[var(--accent-mint)]" />
            <h2 className="mt-4 text-[20px] font-semibold text-[var(--text-primary)]">
              You&apos;ve met all five filters.
            </h2>
            <p className="mt-2 text-[15px] text-[var(--text-secondary)]">
              {alreadyComplete
                ? "This slide deck is already marked complete."
                : "Mark this slide deck complete to track your progress."}
            </p>
            <button
              onClick={handleMarkComplete}
              className="mt-6 w-full rounded-xl bg-[var(--accent-mint)] px-8 py-3.5 text-[15px] font-semibold text-[var(--bg-base)] shadow-mint-glow transition-all duration-300 hover:shadow-mint-glow-hover cursor-pointer"
            >
              {alreadyComplete ? "Revisit completed ✓" : "Mark as complete"}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <CoachDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        filterName={currentSlide.filterName}
        currentFilterId={currentSlide.id}
      />
    </div>
  );
}
