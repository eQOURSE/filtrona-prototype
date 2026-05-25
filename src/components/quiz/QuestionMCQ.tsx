"use client";

import { Check, X } from "lucide-react";

const LETTERS = ["A", "B", "C", "D", "E", "F"];

interface QuestionMCQProps {
  question: string;
  options: string[];
  correctIndex: number;
  selectedIndex: number | null;
  onSelect: (index: number) => void;
  isSubmitted: boolean;
}

export default function QuestionMCQ({
  question,
  options,
  correctIndex,
  selectedIndex,
  onSelect,
  isSubmitted,
}: QuestionMCQProps) {
  return (
    <div>
      <h2 className="text-[20px] font-semibold leading-[1.35] text-[var(--text-primary)] sm:text-[22px]">
        {question}
      </h2>

      <div className="mt-6 flex flex-col gap-3">
        {options.map((option, i) => {
          const isSelected = selectedIndex === i;
          const isCorrect = i === correctIndex;
          const userPickedWrong = isSubmitted && isSelected && !isCorrect;
          const showCorrect = isSubmitted && isCorrect;

          let borderColor = "var(--border-default)";
          let bgColor = "var(--bg-surface)";
          let ringColor = "var(--text-muted)";

          if (!isSubmitted && isSelected) {
            borderColor = "var(--accent-violet)";
            bgColor = "var(--accent-violet-soft)";
            ringColor = "var(--accent-violet)";
          } else if (!isSubmitted) {
            // default
          } else if (showCorrect) {
            borderColor = "var(--accent-mint)";
            bgColor = "var(--accent-mint-soft)";
          } else if (userPickedWrong) {
            borderColor = "#FF5C7A";
            bgColor = "rgba(255, 92, 122, 0.08)";
          }

          return (
            <button
              key={i}
              onClick={() => !isSubmitted && onSelect(i)}
              disabled={isSubmitted}
              className="group flex w-full cursor-pointer items-center gap-4 rounded-xl border px-5 py-4 text-left transition-all duration-200 disabled:cursor-default"
              style={{ borderColor, backgroundColor: bgColor }}
            >
              {/* Letter badge */}
              <span
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-[13px] font-semibold"
                style={{
                  color: isSelected || showCorrect ? ringColor : "var(--text-muted)",
                  backgroundColor: isSelected || showCorrect
                    ? `color-mix(in srgb, ${ringColor} 12%, transparent)`
                    : "var(--bg-elevated)",
                }}
              >
                {LETTERS[i]}
              </span>

              {/* Option text */}
              <span className="flex-1 text-[15px] text-[var(--text-primary)]">
                {option}
              </span>

              {/* Result icon */}
              {isSubmitted && showCorrect && (
                <Check size={18} className="shrink-0 text-[var(--accent-mint)]" />
              )}
              {isSubmitted && userPickedWrong && (
                <X size={18} className="shrink-0" style={{ color: "#FF5C7A" }} />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
