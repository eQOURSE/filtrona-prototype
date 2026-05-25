"use client";

import { useRouter } from "next/navigation";
import { QuizQuestion } from "@/lib/quiz-content";
import { useProgressStore } from "@/lib/progress-store";

interface QuizResultsProps {
  questions: QuizQuestion[];
  results: Record<string, "correct" | "wrong" | "skipped">;
  topicSlug: string;
  onRetry: () => void;
}

export default function QuizResults({
  questions,
  results,
  topicSlug,
  onRetry,
}: QuizResultsProps) {
  const router = useRouter();
  const markComplete = useProgressStore((s) => s.markComplete);
  const saveQuizScore = useProgressStore((s) => s.saveQuizScore);

  const correct = Object.values(results).filter((r) => r === "correct").length;
  const total = questions.length;
  const percent = Math.round((correct / total) * 100);

  let title = "Time to revisit the slides.";
  if (percent === 100) title = "Filtrona scholar 🎓";
  else if (percent >= 75) title = "You know your history.";
  else if (percent >= 50) title = "Solid start — worth another pass.";

  const handleComplete = () => {
    markComplete(topicSlug, "quiz");
    saveQuizScore(topicSlug, correct, total);
    setTimeout(() => router.push(`/topics/${topicSlug}`), 600);
  };

  // Conic gradient for the score ring
  const conicGradient = `conic-gradient(var(--accent-mint) ${percent * 3.6}deg, var(--border-default) ${percent * 3.6}deg)`;

  return (
    <div className="mx-auto max-w-[640px] text-center">
      {/* Score ring */}
      <div
        className="relative mx-auto flex h-40 w-40 items-center justify-center rounded-full"
        style={{ background: conicGradient }}
      >
        <div className="flex h-[132px] w-[132px] flex-col items-center justify-center rounded-full bg-[var(--bg-base)]">
          <span className="text-[48px] font-bold text-[var(--text-primary)] leading-none">
            {percent}%
          </span>
          <span className="mt-1 text-[14px] text-[var(--text-muted)]">
            {correct} / {total}
          </span>
        </div>
      </div>

      {/* Title */}
      <h2 className="mt-6 text-[24px] font-semibold text-[var(--text-primary)] sm:text-[28px]">
        {title}
      </h2>

      {/* Question breakdown */}
      <div className="mx-auto mt-6 max-w-[480px] text-left">
        {questions.map((q, i) => {
          const result = results[q.id] ?? "skipped";
          let dotColor = "var(--text-muted)";
          let dotBg = "transparent";
          let dotBorder = "var(--text-muted)";

          if (result === "correct") {
            dotColor = "var(--accent-mint)";
            dotBg = "var(--accent-mint)";
            dotBorder = "var(--accent-mint)";
          } else if (result === "wrong") {
            dotColor = "var(--accent-orange)";
            dotBg = "transparent";
            dotBorder = "var(--accent-orange)";
          }

          return (
            <div
              key={q.id}
              className="flex items-center gap-3 border-b border-[var(--border-default)] py-3 last:border-b-0"
            >
              <span
                className="h-3 w-3 shrink-0 rounded-full border-2"
                style={{
                  backgroundColor: dotBg,
                  borderColor: dotBorder,
                }}
              />
              <span className="truncate text-[14px] text-[var(--text-secondary)]">
                {i + 1}. {q.question}
              </span>
              <span
                className="ml-auto shrink-0 text-[12px] font-semibold uppercase tracking-wider"
                style={{ color: dotColor }}
              >
                {result === "correct" ? "✓" : result === "wrong" ? "✗" : "—"}
              </span>
            </div>
          );
        })}
      </div>

      {/* Actions */}
      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <button
          onClick={onRetry}
          className="cursor-pointer rounded-xl border border-[var(--border-default)] bg-[var(--bg-elevated)] px-6 py-3.5 text-[14px] font-medium text-[var(--text-primary)] transition-colors hover:border-[var(--accent-violet)] hover:bg-[var(--bg-surface)]"
        >
          Retry quiz
        </button>
        <button
          onClick={handleComplete}
          className="cursor-pointer rounded-xl bg-[var(--accent-mint)] px-8 py-3.5 text-[14px] font-semibold text-[var(--bg-base)] shadow-mint-glow transition-all duration-300 hover:shadow-mint-glow-hover"
        >
          Mark complete &amp; return
        </button>
      </div>
    </div>
  );
}
