"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

interface SlideNavigationProps {
  currentIndex: number;
  totalSlides: number;
  accent: "blue" | "navy" | "green" | "sky";
  onNext: () => void;
  onPrev: () => void;
  onGoTo: (index: number) => void;
}

const ACCENT_CSS: Record<string, string> = {
  blue: "var(--accent-blue)",
  navy: "var(--accent-navy)",
  green: "var(--accent-green)",
  sky: "var(--accent-sky)",
};

const ACCENT_SOFT: Record<string, string> = {
  blue: "var(--accent-blue-soft)",
  navy: "var(--accent-navy-soft)",
  green: "var(--accent-green-soft)",
  sky: "var(--accent-sky-soft)",
};

export default function SlideNavigation({
  currentIndex,
  totalSlides,
  accent,
  onNext,
  onPrev,
  onGoTo,
}: SlideNavigationProps) {
  const accentColor = ACCENT_CSS[accent];
  const accentSoft = ACCENT_SOFT[accent];

  const progressPercent = ((currentIndex + 1) / totalSlides) * 100;

  return (
    <div className="flex flex-col items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
      {/* Dots */}
      <div className="flex items-center gap-2 sm:gap-3">
        {Array.from({ length: totalSlides }).map((_, i) => {
          const isActive = i === currentIndex;
          return (
            <button
              key={i}
              onClick={() => onGoTo(i)}
              aria-label={`Go to slide ${i + 1}`}
              aria-current={isActive ? "step" : undefined}
              className="transition-all duration-300 rounded-full"
              style={{
                width: isActive ? 20 : 6,
                height: 6,
                backgroundColor: isActive ? accentColor : "var(--border-default)",
              }}
              onMouseEnter={(e) => {
                if (!isActive) e.currentTarget.style.backgroundColor = accentSoft;
              }}
              onMouseLeave={(e) => {
                if (!isActive) e.currentTarget.style.backgroundColor = "var(--border-default)";
              }}
            />
          );
        })}
      </div>

      {/* Thin Progress Bar */}
      <div className="w-full max-w-[320px] h-[2px] bg-[var(--border-default)] rounded-full overflow-hidden">
        <div
          className="h-full transition-[width] duration-300 ease-out"
          style={{ width: `${progressPercent}%`, backgroundColor: accentColor }}
        />
      </div>
    </div>
  );
}
