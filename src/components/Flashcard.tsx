"use client";

import { Lightbulb, RefreshCw } from "lucide-react";
import { Flashcard as FlashcardType } from "@/lib/flashcard-content";

const accentColors: Record<string, string> = {
  mint: "var(--accent-mint)",
  violet: "var(--accent-violet)",
  orange: "var(--accent-orange)",
  blue: "var(--accent-blue)",
};

const accentSoft: Record<string, string> = {
  mint: "var(--accent-mint-soft)",
  violet: "var(--accent-violet-soft)",
  orange: "var(--accent-orange-soft)",
  blue: "var(--accent-blue-soft)",
};

interface FlashcardProps {
  card: FlashcardType;
  isFlipped: boolean;
  onFlip: () => void;
}

export default function Flashcard({ card, isFlipped, onFlip }: FlashcardProps) {
  const color = accentColors[card.accent];
  const soft = accentSoft[card.accent];

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onFlip();
    }
  };

  return (
    <div
      className="mx-auto w-full cursor-pointer"
      style={{ maxWidth: "540px", perspective: "1500px" }}
      onClick={onFlip}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-label={isFlipped ? "Card is showing the answer. Tap to flip back." : "Tap to reveal the answer."}
    >
      <div
        className="relative w-full transition-transform duration-500"
        style={{
          aspectRatio: "3 / 4",
          transformStyle: "preserve-3d",
          transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
      >
        {/* ── Front face ─────────────────────────────────────────── */}
        <div
          className="absolute inset-0 flex flex-col justify-between rounded-3xl border p-8 transition-colors duration-300 sm:p-10"
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            backgroundColor: "var(--bg-surface)",
            borderColor: "var(--border-default)",
          }}
        >
          {/* Top pill */}
          <span
            className="inline-block self-start rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.15em]"
            style={{ backgroundColor: soft, color }}
          >
            Question
          </span>

          {/* Center: question */}
          <div className="flex flex-1 items-center justify-center py-8">
            <p className="text-center text-[22px] font-semibold leading-[1.4] text-[var(--text-primary)] sm:text-[26px]">
              {card.front}
            </p>
          </div>

          {/* Bottom hints */}
          <div className="flex flex-col items-center gap-2">
            {card.hint && (
              <span className="flex items-center gap-1.5 text-[14px] italic text-[var(--text-muted)]">
                <Lightbulb size={14} />
                {card.hint}
              </span>
            )}
            <span className="flex items-center gap-1.5 text-[13px] text-[var(--text-muted)]">
              <RefreshCw size={12} />
              Tap to reveal
            </span>
          </div>
        </div>

        {/* ── Back face ──────────────────────────────────────────── */}
        <div
          className="absolute inset-0 flex flex-col justify-between rounded-3xl border p-8 sm:p-10"
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
            backgroundColor: soft,
            borderColor: `color-mix(in srgb, ${color} 30%, transparent)`,
          }}
        >
          {/* Top pill */}
          <span
            className="inline-block self-start rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.15em]"
            style={{ backgroundColor: `color-mix(in srgb, ${color} 18%, transparent)`, color }}
          >
            Answer
          </span>

          {/* Center: answer */}
          <div className="flex flex-1 items-center justify-center py-8">
            <p className="text-center text-[18px] font-medium leading-[1.6] text-[var(--text-primary)] sm:text-[20px]">
              {card.back}
            </p>
          </div>

          {/* Bottom hint */}
          <span className="text-center text-[13px] text-[var(--text-muted)]">
            Tap to flip back
          </span>
        </div>
      </div>
    </div>
  );
}
