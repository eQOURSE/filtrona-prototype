"use client";

import { Check, X } from "lucide-react";

interface QuestionTrueFalseProps {
  question: string;
  correct: boolean;
  selected: boolean | null;
  onSelect: (value: boolean) => void;
  isSubmitted: boolean;
}

export default function QuestionTrueFalse({
  question,
  correct,
  selected,
  onSelect,
  isSubmitted,
}: QuestionTrueFalseProps) {
  const getButtonStyle = (value: boolean) => {
    const isSelected = selected === value;
    const isCorrectAnswer = correct === value;

    if (!isSubmitted) {
      if (isSelected && value === true) {
        return {
          borderColor: "var(--accent-mint)",
          bg: "var(--accent-mint-soft)",
          text: "var(--accent-mint)",
        };
      }
      if (isSelected && value === false) {
        return {
          borderColor: "var(--accent-violet)",
          bg: "var(--accent-violet-soft)",
          text: "var(--accent-violet)",
        };
      }
      return {
        borderColor: "var(--border-default)",
        bg: "var(--bg-surface)",
        text: "var(--text-primary)",
      };
    }

    // Submitted
    if (isCorrectAnswer) {
      return {
        borderColor: "var(--accent-mint)",
        bg: "var(--accent-mint-soft)",
        text: "var(--accent-mint)",
      };
    }
    if (isSelected && !isCorrectAnswer) {
      return {
        borderColor: "#FF5C7A",
        bg: "rgba(255, 92, 122, 0.08)",
        text: "#FF5C7A",
      };
    }
    return {
      borderColor: "var(--border-default)",
      bg: "var(--bg-surface)",
      text: "var(--text-muted)",
    };
  };

  const trueStyle = getButtonStyle(true);
  const falseStyle = getButtonStyle(false);

  return (
    <div>
      <h2 className="text-[20px] font-semibold leading-[1.35] text-[var(--text-primary)] sm:text-[22px]">
        {question}
      </h2>

      <div className="mt-6 grid grid-cols-2 gap-4">
        {/* True button */}
        <button
          onClick={() => !isSubmitted && onSelect(true)}
          disabled={isSubmitted}
          className="flex h-20 cursor-pointer flex-col items-center justify-center rounded-2xl border transition-all duration-200 disabled:cursor-default"
          style={{
            borderColor: trueStyle.borderColor,
            backgroundColor: trueStyle.bg,
          }}
        >
          <div className="flex items-center gap-2">
            {isSubmitted && correct === true && <Check size={20} style={{ color: trueStyle.text }} />}
            {isSubmitted && selected === true && correct !== true && <X size={20} style={{ color: trueStyle.text }} />}
            <span className="text-[24px] font-semibold sm:text-[28px]" style={{ color: trueStyle.text }}>
              True
            </span>
          </div>
        </button>

        {/* False button */}
        <button
          onClick={() => !isSubmitted && onSelect(false)}
          disabled={isSubmitted}
          className="flex h-20 cursor-pointer flex-col items-center justify-center rounded-2xl border transition-all duration-200 disabled:cursor-default"
          style={{
            borderColor: falseStyle.borderColor,
            backgroundColor: falseStyle.bg,
          }}
        >
          <div className="flex items-center gap-2">
            {isSubmitted && correct === false && <Check size={20} style={{ color: falseStyle.text }} />}
            {isSubmitted && selected === false && correct !== false && <X size={20} style={{ color: falseStyle.text }} />}
            <span className="text-[24px] font-semibold sm:text-[28px]" style={{ color: falseStyle.text }}>
              False
            </span>
          </div>
        </button>
      </div>
    </div>
  );
}
