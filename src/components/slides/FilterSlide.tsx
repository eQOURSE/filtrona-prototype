"use client";

import { Check } from "lucide-react";
import FilterVisual from "./FilterVisual";
import AudioPlayer from "./AudioPlayer";
import type { FilterSlide as FilterSlideType } from "@/lib/slide-content";

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

interface FilterSlideProps {
  slide: FilterSlideType;
  isActive: boolean;
  slideIndex: number;
  totalSlides: number;
  onOpen3D?: () => void;
}

export default function FilterSlide({
  slide,
  isActive,
  slideIndex,
  totalSlides,
  onOpen3D,
}: FilterSlideProps) {
  const accentColor = ACCENT_CSS[slide.accent];
  const accentSoft = ACCENT_SOFT[slide.accent];

  return (
    <div
      className="rounded-3xl border border-[var(--border-default)] bg-[var(--bg-surface)] overflow-hidden"
      style={{
        boxShadow: `0 24px 80px color-mix(in srgb, ${accentColor} 8%, transparent)`,
      }}
    >
      <div className="grid grid-cols-1 lg:grid-cols-[45%_55%]">
        {/* ── Left: Visual ─────────────────────────────────────── */}
        <div className="flex flex-col items-center justify-center p-4 lg:p-8">
          <FilterVisual
            visualType={slide.visualType as "cps" | "cor" | "ccf" | "corinthian" | "vortex"}
            accent={slide.accent}
            isActive={isActive}
          />
          {onOpen3D && (
            <button
              onClick={onOpen3D}
              className="mt-8 flex items-center justify-center gap-2 rounded-full px-6 py-3 text-[14px] font-bold text-white shadow-lg transition-transform hover:scale-105 active:scale-95 w-full max-w-[280px]"
              style={{ backgroundColor: accentColor, boxShadow: `0 8px 24px ${accentColor}40` }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.29 7 12 12 20.71 7"/><line x1="12" y1="22" x2="12" y2="12"/></svg>
              View 360° 3D Model
            </button>
          )}
        </div>

        {/* ── Right: Content ───────────────────────────────────── */}
        <div className="flex flex-col justify-center px-6 py-6 lg:px-8 lg:py-6">
          {/* Top row: tag pill + slide counter */}
          <div className="flex items-center justify-between">
            <span
              className="inline-block rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wider"
              style={{ backgroundColor: accentSoft, color: accentColor }}
            >
              {slide.tag}
            </span>
            <span className="text-[13px] font-medium text-[var(--text-muted)] tabular-nums">
              {slideIndex + 1} / {totalSlides}
            </span>
          </div>

          {/* Filter name */}
          <h2 className="mt-4 text-[26px] font-bold tracking-tight text-[var(--text-primary)] lg:text-[32px]">
            {slide.filterName}
          </h2>
          <p className="mt-1 text-[15px] font-medium text-[var(--text-muted)]">
            {slide.fullName}
          </p>

          {/* Tagline */}
          <p className="mt-3 text-[16px] font-medium italic leading-[1.4] text-[var(--text-primary)]">
            {slide.tagline}
          </p>

          {/* Audio Player */}
          <div className="mt-4">
            <AudioPlayer
              audioUrl={slide.audioUrl}
              filterName={slide.filterName}
              accent={slide.accent}
              slideKey={slide.id}
            />
          </div>

          {/* Key Specs */}
          <div className="mt-5">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-[var(--text-muted)]">
              Key Specs
            </p>
            <div className="mt-3 flex flex-col gap-2.5">
              {slide.keySpecs.map((spec) => (
                <div key={spec} className="flex items-start gap-2.5">
                  <Check
                    size={16}
                    className="mt-0.5 shrink-0"
                    style={{ color: accentColor }}
                    strokeWidth={2.5}
                  />
                  <span className="text-[14px] leading-[1.5] text-[var(--text-secondary)]">
                    {spec}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* How It Works */}
          <div className="mt-5">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-[var(--text-muted)]">
              How It Works
            </p>
            <p className="mt-2 max-w-[480px] text-[15px] leading-[1.5] text-[var(--text-primary)]">
              {slide.howItWorks}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
