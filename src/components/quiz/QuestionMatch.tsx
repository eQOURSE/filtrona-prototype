"use client";

import { useState } from "react";

const PAIR_COLORS = [
  "var(--accent-mint)",
  "var(--accent-violet)",
  "var(--accent-orange)",
  "var(--accent-blue)",
];

interface QuestionMatchProps {
  question: string;
  leftItems: string[];
  rightItems: string[];
  correctPairs: [number, number][];
  pairs: [number, number][];
  onPair: (pairs: [number, number][]) => void;
  isSubmitted: boolean;
}

export default function QuestionMatch({
  question,
  leftItems,
  rightItems,
  correctPairs,
  pairs,
  onPair,
  isSubmitted,
}: QuestionMatchProps) {
  const [activeLeft, setActiveLeft] = useState<number | null>(null);

  const getPairForLeft = (leftIdx: number) =>
    pairs.find(([l]) => l === leftIdx);
  const getPairForRight = (rightIdx: number) =>
    pairs.find(([, r]) => r === rightIdx);

  const getPairColor = (pairIndex: number) =>
    PAIR_COLORS[pairIndex % PAIR_COLORS.length];

  const isPairCorrect = (pair: [number, number]) =>
    correctPairs.some(([cl, cr]) => cl === pair[0] && cr === pair[1]);

  const handleLeftClick = (leftIdx: number) => {
    if (isSubmitted) return;
    const existing = getPairForLeft(leftIdx);
    if (existing) {
      // Break existing pair
      onPair(pairs.filter(([l]) => l !== leftIdx));
      setActiveLeft(null);
      return;
    }
    setActiveLeft(leftIdx);
  };

  const handleRightClick = (rightIdx: number) => {
    if (isSubmitted || activeLeft === null) return;

    // If this right is already paired, break it first
    const existingRight = getPairForRight(rightIdx);
    let newPairs = existingRight
      ? pairs.filter(([, r]) => r !== rightIdx)
      : [...pairs];

    // Also break existing pair for activeLeft if any
    newPairs = newPairs.filter(([l]) => l !== activeLeft);

    newPairs.push([activeLeft, rightIdx]);
    onPair(newPairs);
    setActiveLeft(null);
  };

  return (
    <div>
      <h2 className="text-[20px] font-semibold leading-[1.35] text-[var(--text-primary)] sm:text-[22px]">
        {question}
      </h2>

      <div className="mt-6 grid grid-cols-[1fr_auto_1fr] items-start gap-4 sm:gap-6">
        {/* Left column */}
        <div className="flex flex-col gap-3">
          {leftItems.map((item, i) => {
            const pair = getPairForLeft(i);
            const pairIdx = pair ? pairs.indexOf(pair) : -1;
            const isActive = activeLeft === i;
            const correct = isSubmitted && pair ? isPairCorrect(pair) : null;

            let borderColor = "var(--border-default)";
            let bg = "var(--bg-surface)";

            if (isActive) {
              borderColor = "var(--accent-violet)";
              bg = "var(--accent-violet-soft)";
            } else if (pair && !isSubmitted) {
              borderColor = getPairColor(pairIdx);
              bg = `color-mix(in srgb, ${getPairColor(pairIdx)} 10%, transparent)`;
            } else if (correct === true) {
              borderColor = "var(--accent-mint)";
              bg = "var(--accent-mint-soft)";
            } else if (correct === false) {
              borderColor = "#FF5C7A";
              bg = "rgba(255, 92, 122, 0.08)";
            }

            return (
              <button
                key={i}
                onClick={() => handleLeftClick(i)}
                disabled={isSubmitted}
                className="cursor-pointer rounded-lg border px-4 py-3 text-left text-[14px] font-medium text-[var(--text-primary)] transition-all duration-200 disabled:cursor-default sm:text-[15px]"
                style={{ borderColor, backgroundColor: bg }}
              >
                {item}
              </button>
            );
          })}
        </div>

        {/* Center connector lines (simplified visual) */}
        <div className="flex flex-col items-center justify-center gap-3 pt-1">
          {leftItems.map((_, i) => {
            const pair = getPairForLeft(i);
            const pairIdx = pair ? pairs.indexOf(pair) : -1;
            const correct = isSubmitted && pair ? isPairCorrect(pair) : null;

            return (
              <div
                key={i}
                className="flex h-[44px] items-center sm:h-[48px]"
              >
                {pair ? (
                  <div
                    className="h-[2px] w-8 rounded-full sm:w-12"
                    style={{
                      backgroundColor:
                        correct === true
                          ? "var(--accent-mint)"
                          : correct === false
                            ? "#FF5C7A"
                            : getPairColor(pairIdx),
                    }}
                  />
                ) : (
                  <div className="h-[2px] w-8 rounded-full bg-[var(--border-default)] opacity-30 sm:w-12" />
                )}
              </div>
            );
          })}
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-3">
          {rightItems.map((item, i) => {
            const pair = getPairForRight(i);
            const pairIdx = pair ? pairs.indexOf(pair) : -1;
            const correct = isSubmitted && pair ? isPairCorrect(pair) : null;

            let borderColor = "var(--border-default)";
            let bg = "var(--bg-surface)";

            if (pair && !isSubmitted) {
              borderColor = getPairColor(pairIdx);
              bg = `color-mix(in srgb, ${getPairColor(pairIdx)} 10%, transparent)`;
            } else if (correct === true) {
              borderColor = "var(--accent-mint)";
              bg = "var(--accent-mint-soft)";
            } else if (correct === false) {
              borderColor = "#FF5C7A";
              bg = "rgba(255, 92, 122, 0.08)";
            }

            return (
              <button
                key={i}
                onClick={() => handleRightClick(i)}
                disabled={isSubmitted}
                className="cursor-pointer rounded-lg border px-4 py-3 text-left text-[14px] font-medium text-[var(--text-primary)] transition-all duration-200 disabled:cursor-default sm:text-[15px]"
                style={{ borderColor, backgroundColor: bg }}
              >
                {item}
              </button>
            );
          })}
        </div>
      </div>

      {/* Helper text */}
      {!isSubmitted && pairs.length === 0 && (
        <p className="mt-4 text-center text-[13px] text-[var(--text-muted)]">
          Click a left item, then its match on the right
        </p>
      )}
      {!isSubmitted && pairs.length > 0 && pairs.length < leftItems.length && (
        <p className="mt-4 text-center text-[13px] text-[var(--text-muted)]">
          {pairs.length} of {leftItems.length} matched
        </p>
      )}
    </div>
  );
}
