"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import FilterSlide from "./FilterSlide";
import IntroSlide from "./IntroSlide";
import ThankYouSlide from "./ThankYouSlide";
import SlideNavigation from "./SlideNavigation";
import ConnectedActionsBar from "./ConnectedActionsBar";
import CoachDrawer from "./CoachDrawer";
import FilterModel3DModal from "@/components/gallery/FilterModel3DModal";
import type { FilterSlide as FilterSlideType } from "@/lib/slide-content";
import { getFilterModelById } from "@/lib/filter-3d-models";

interface SlideDeckProps {
  slides: FilterSlideType[];
  topicSlug: string;
}

export default function SlideDeck({ slides, topicSlug }: SlideDeckProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [is3DModalOpen, setIs3DModalOpen] = useState(false);

  // Keyboard navigation
  useEffect(() => {
    if (isDrawerOpen || is3DModalOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "Home") handleGoTo(0);
      if (e.key === "End") handleGoTo(slides.length - 1);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentIndex, isDrawerOpen, is3DModalOpen]); // eslint-disable-line react-hooks/exhaustive-deps

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

  const currentSlide = slides[currentIndex];
  const isIntro = currentSlide.visualType === "intro";
  const isThankYou = currentSlide.visualType === "thankyou";
  const isSpecialSlide = isIntro || isThankYou;
  const active3DModel = isSpecialSlide ? null : getFilterModelById(currentSlide.visualType);

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
            className="absolute -left-6 top-1/2 -translate-y-1/2 z-10 flex h-12 w-12 items-center justify-center rounded-full border border-[var(--border-default)] bg-[var(--bg-elevated)] transition-all hover:border-[var(--accent-blue)] hover:bg-[var(--accent-blue-soft)] disabled:opacity-30 disabled:cursor-not-allowed shadow-sm"
            aria-label="Previous slide"
          >
            <ChevronLeft size={24} className="text-[var(--text-secondary)] -ml-0.5" />
          </button>
          <button
            onClick={handleNext}
            disabled={currentIndex === slides.length - 1}
            className="absolute -right-6 top-1/2 -translate-y-1/2 z-10 flex h-12 w-12 items-center justify-center rounded-full border border-[var(--border-default)] bg-[var(--bg-elevated)] transition-all hover:border-[var(--accent-blue)] hover:bg-[var(--accent-blue-soft)] disabled:opacity-30 disabled:cursor-not-allowed shadow-sm"
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
              {isIntro ? (
                <IntroSlide
                  slide={currentSlide}
                  slideIndex={currentIndex}
                  totalSlides={slides.length}
                  onNext={handleNext}
                />
              ) : isThankYou ? (
                <ThankYouSlide
                  slide={currentSlide}
                  slideIndex={currentIndex}
                  totalSlides={slides.length}
                  topicSlug={topicSlug}
                />
              ) : (
                <>
                  <FilterSlide
                    slide={currentSlide}
                    isActive={true}
                    slideIndex={currentIndex}
                    totalSlides={slides.length}
                    onOpen3D={active3DModel ? () => setIs3DModalOpen(true) : undefined}
                  />
                  <ConnectedActionsBar
                    slide={currentSlide}
                    onAskCoach={() => setIsDrawerOpen(true)}
                  />
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <CoachDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        filterName={currentSlide.filterName}
        currentFilterId={currentSlide.id}
      />

      <AnimatePresence>
        {is3DModalOpen && active3DModel && (
          <FilterModel3DModal
            key="model3d"
            model={active3DModel}
            onClose={() => setIs3DModalOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
