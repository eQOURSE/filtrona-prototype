"use client";

import { Check, X } from "lucide-react";

interface QuestionMultiSelectProps {
  question: string;
  options: string[];
  correctIndices: number[];
  selectedIndices: number[];
  onToggle: (index: number) => void;
  isSubmitted: boolean;
}

export default function QuestionMultiSelect({
  question,
  options,
  correctIndices,
  selectedIndices,
  onToggle,
  isSubmitted,
}: QuestionMultiSelectProps) {
  return (
    <div>
      <h2 className="text-[20px] font-semibold leading-[1.35] text-[var(--text-primary)] sm:text-[22px]">
        {question}
      </h2>

      <div className="mt-6 flex flex-col gap-3">
        {options.map((option, i) => {
          const isSelected = selectedIndices.includes(i);
          const isCorrect = correctIndices.includes(i);
          const wasSelectedCorrectly = isSubmitted && isSelected && isCorrect;
          const wasSelectedWrongly = isSubmitted && isSelected && !isCorrect;
          const wasMissed = isSubmitted && !isSelected && isCorrect;

          let borderColor = "var(--border-default)";
          let bgColor = "var(--bg-surface)";

          if (!isSubmitted && isSelected) {
            borderColor = "var(--accent-navy)";
            bgColor = "var(--accent-navy-soft)";
          } else if (wasSelectedCorrectly) {
            borderColor = "var(--accent-blue)";
            bgColor = "var(--accent-blue-soft)";
          } else if (wasSelectedWrongly) {
            borderColor = "#d91f29";
            bgColor = "rgba(255, 92, 122, 0.08)";
          } else if (wasMissed) {
            borderColor = "var(--accent-blue)";
            bgColor = "var(--accent-blue-soft)";
          }

          return (
            <button
              key={i}
              onClick={() => !isSubmitted && onToggle(i)}
              disabled={isSubmitted}
              className="group flex w-full cursor-pointer items-center gap-4 rounded-xl border px-5 py-4 text-left transition-all duration-200 disabled:cursor-default"
              style={{ borderColor, backgroundColor: bgColor }}
            >
              {/* Checkbox indicator */}
              <span
                className="flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 transition-colors"
                style={{
                  borderColor: isSelected || wasMissed ? borderColor : "var(--text-muted)",
                  backgroundColor:
                    isSelected && !isSubmitted
                      ? "var(--accent-navy)"
                      : wasSelectedCorrectly
                        ? "var(--accent-blue)"
                        : wasSelectedWrongly
                          ? "#d91f29"
                          : "transparent",
                }}
              >
                {(isSelected || wasMissed) && (
                  <Check size={12} className="text-white" strokeWidth={3} />
                )}
              </span>

              {/* Option text */}
              <span className="flex-1 text-[15px] text-[var(--text-primary)]">
                {option}
              </span>

              {/* Result feedback */}
              {wasSelectedCorrectly && (
                <Check size={18} className="shrink-0 text-[var(--accent-blue)]" />
              )}
              {wasSelectedWrongly && (
                <X size={18} className="shrink-0" style={{ color: "#d91f29" }} />
              )}
              {wasMissed && (
                <span className="shrink-0 rounded-full bg-[var(--accent-blue-soft)] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[var(--accent-blue)]">
                  Missed
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Selection count */}
      {!isSubmitted && (
        <p className="mt-3 text-[13px] text-[var(--text-muted)]">
          {selectedIndices.length} selected
        </p>
      )}
    </div>
  );
}
