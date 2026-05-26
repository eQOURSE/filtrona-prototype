"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

interface SlideNavigationProps {
  currentIndex: number;
  totalSlides: number;
  accent: "mint" | "violet" | "orange" | "blue";
  onNext: () => void;
  onPrev: () => void;
  onGoTo: (index: number) => void;
}

const ACCENT_CSS: Record<string, string> = {
  mint: "var(--accent-mint)",
  violet: "var(--accent-violet)",
  orange: "var(--accent-orange)",
  blue: "var(--accent-blue)",
};

const ACCENT_SOFT: Record<string, string> = {
  mint: "var(--accent-mint-soft)",
  violet: "var(--accent-violet-soft)",
  orange: "var(--accent-orange-soft)",
  blue: "var(--accent-blue-soft)",
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
    <div className="flex flex-col items-center gap-4 mb-6">
      {/* Dots */}
      <div className="flex items-center gap-3">
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
                width: isActive ? 24 : 8,
                height: 8,
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
      <div className="w-[320px] h-[2px] bg-[var(--border-default)] rounded-full overflow-hidden">
        <div
          className="h-full transition-[width] duration-300 ease-out"
          style={{ width: `${progressPercent}%`, backgroundColor: accentColor }}
        />
      </div>
    </div>
  );
}
