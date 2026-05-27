"use client";

import { useCallback, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Check, Info, ArrowRight } from "lucide-react";
import { QuizQuestion } from "@/lib/quiz-content";
import QuestionMCQ from "./QuestionMCQ";
import QuestionTrueFalse from "./QuestionTrueFalse";
import QuestionMultiSelect from "./QuestionMultiSelect";
import QuestionMatch from "./QuestionMatch";
import QuizResults from "./QuizResults";

const EASE = [0.16, 1, 0.3, 1] as const;

interface QuizShellProps {
  questions: QuizQuestion[];
  topicSlug: string;
}

type AnswerState = {
  mcq: number | null;
  truefalse: boolean | null;
  multiselect: number[];
  match: [number, number][];
};

const emptyAnswer = (): AnswerState => ({
  mcq: null,
  truefalse: null,
  multiselect: [],
  match: [],
});

export default function QuizShell({ questions, topicSlug }: QuizShellProps) {
  const prefersReducedMotion = useReducedMotion();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, AnswerState>>({});
  const [submittedQuestions, setSubmittedQuestions] = useState<Set<string>>(new Set());
  const [results, setResults] = useState<Record<string, "correct" | "wrong" | "skipped">>({});
  const [isShowingResults, setIsShowingResults] = useState(false);

  const currentQ = questions[currentIndex];
  const currentAnswer = answers[currentQ?.id] ?? emptyAnswer();
  const isSubmitted = submittedQuestions.has(currentQ?.id);
  const correctSoFar = Object.values(results).filter((r) => r === "correct").length;
  const isLastQuestion = currentIndex === questions.length - 1;

  // ── Check if answer is provided ──────────────────────────────
  const hasAnswer = useCallback(() => {
    if (!currentQ) return false;
    switch (currentQ.type) {
      case "mcq":
        return currentAnswer.mcq !== null;
      case "truefalse":
        return currentAnswer.truefalse !== null;
      case "multiselect":
        return currentAnswer.multiselect.length > 0;
      case "match":
        return currentAnswer.match.length === currentQ.leftItems.length;
      default:
        return false;
    }
  }, [currentQ, currentAnswer]);

  // ── Check correctness ────────────────────────────────────────
  const checkCorrect = useCallback((): boolean => {
    if (!currentQ) return false;
    switch (currentQ.type) {
      case "mcq":
        return currentAnswer.mcq === currentQ.correctIndex;
      case "truefalse":
        return currentAnswer.truefalse === currentQ.correct;
      case "multiselect": {
        const selected = new Set(currentAnswer.multiselect);
        const correct = new Set(currentQ.correctIndices);
        return selected.size === correct.size && [...selected].every((i) => correct.has(i));
      }
      case "match": {
        return currentQ.correctPairs.every(([cl, cr]) =>
          currentAnswer.match.some(([l, r]) => l === cl && r === cr)
        );
      }
      default:
        return false;
    }
  }, [currentQ, currentAnswer]);

  // ── Submit answer ────────────────────────────────────────────
  const handleSubmit = () => {
    if (!currentQ || isSubmitted) return;
    const wasCorrect = checkCorrect();
    setSubmittedQuestions((s) => new Set([...s, currentQ.id]));
    setResults((r) => ({ ...r, [currentQ.id]: wasCorrect ? "correct" : "wrong" }));
  };

  // ── Skip ─────────────────────────────────────────────────────
  const handleSkip = () => {
    if (!currentQ) return;
    setResults((r) => ({ ...r, [currentQ.id]: "skipped" }));
    setSubmittedQuestions((s) => new Set([...s, currentQ.id]));
    advanceOrFinish();
  };

  // ── Advance or finish ────────────────────────────────────────
  const advanceOrFinish = () => {
    if (isLastQuestion) {
      setIsShowingResults(true);
    } else {
      setCurrentIndex((i) => i + 1);
    }
  };

  // ── Retry ────────────────────────────────────────────────────
  const handleRetry = () => {
    setCurrentIndex(0);
    setAnswers({});
    setSubmittedQuestions(new Set());
    setResults({});
    setIsShowingResults(false);
  };

  // ── Update answer ────────────────────────────────────────────
  const updateAnswer = (qId: string, partial: Partial<AnswerState>) => {
    setAnswers((prev) => ({
      ...prev,
      [qId]: { ...(prev[qId] ?? emptyAnswer()), ...partial },
    }));
  };

  if (isShowingResults) {
    return (
      <QuizResults
        questions={questions}
        results={results}
        topicSlug={topicSlug}
        onRetry={handleRetry}
      />
    );
  }

  if (!currentQ) return null;

  const wasCorrect = results[currentQ.id] === "correct";
  const progressPercent = (currentIndex / questions.length) * 100;

  return (
    <div>
      {/* ── Progress strip ─────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <span className="text-[14px] text-[var(--text-muted)]">
          {currentIndex + 1} of {questions.length}
        </span>
        {correctSoFar > 0 && (
          <span className="text-[14px] font-medium text-[var(--accent-blue)]">
            {correctSoFar} correct
          </span>
        )}
      </div>
      <div className="mt-2 h-[3px] w-full rounded-full bg-[var(--border-default)]">
        <div
          className="h-full rounded-full bg-[var(--accent-blue)] transition-all duration-500 ease-out"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* ── Question area ──────────────────────────────────────── */}
      <div className="mt-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQ.id}
            initial={!prefersReducedMotion ? { opacity: 0, x: 40 } : undefined}
            animate={{ opacity: 1, x: 0 }}
            exit={!prefersReducedMotion ? { opacity: 0, x: -40 } : undefined}
            transition={{ duration: 0.3, ease: EASE }}
          >
            {currentQ.type === "mcq" && (
              <QuestionMCQ
                question={currentQ.question}
                options={currentQ.options}
                correctIndex={currentQ.correctIndex}
                selectedIndex={currentAnswer.mcq}
                onSelect={(i) => updateAnswer(currentQ.id, { mcq: i })}
                isSubmitted={isSubmitted}
              />
            )}
            {currentQ.type === "truefalse" && (
              <QuestionTrueFalse
                question={currentQ.question}
                correct={currentQ.correct}
                selected={currentAnswer.truefalse}
                onSelect={(v) => updateAnswer(currentQ.id, { truefalse: v })}
                isSubmitted={isSubmitted}
              />
            )}
            {currentQ.type === "multiselect" && (
              <QuestionMultiSelect
                question={currentQ.question}
                options={currentQ.options}
                correctIndices={currentQ.correctIndices}
                selectedIndices={currentAnswer.multiselect}
                onToggle={(i) => {
                  const curr = currentAnswer.multiselect;
                  const next = curr.includes(i)
                    ? curr.filter((x) => x !== i)
                    : [...curr, i];
                  updateAnswer(currentQ.id, { multiselect: next });
                }}
                isSubmitted={isSubmitted}
              />
            )}
            {currentQ.type === "match" && (
              <QuestionMatch
                question={currentQ.question}
                leftItems={currentQ.leftItems}
                rightItems={currentQ.rightItems}
                correctPairs={currentQ.correctPairs}
                pairs={currentAnswer.match}
                onPair={(p) => updateAnswer(currentQ.id, { match: p })}
                isSubmitted={isSubmitted}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── Action row ─────────────────────────────────────────── */}
      <div className="mt-8">
        {!isSubmitted ? (
          <div className="flex items-center justify-between">
            <button
              onClick={handleSkip}
              className="cursor-pointer text-[14px] text-[var(--text-muted)] transition-colors hover:text-[var(--text-primary)]"
            >
              Skip
            </button>
            <button
              onClick={handleSubmit}
              disabled={!hasAnswer()}
              className="cursor-pointer rounded-xl bg-[var(--accent-blue)] px-6 py-3 text-[14px] font-semibold text-[var(--bg-base)] transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Submit answer
            </button>
          </div>
        ) : (
          <>
            {/* Explanation card */}
            <div
              className="rounded-xl border p-5"
              style={{
                borderColor: wasCorrect ? "var(--accent-blue)" : "var(--accent-red)",
                backgroundColor: "var(--bg-elevated)",
              }}
            >
              <div className="flex items-center gap-2">
                {wasCorrect ? (
                  <Check size={18} className="text-[var(--accent-blue)]" />
                ) : (
                  <Info size={18} className="text-[var(--accent-red)]" />
                )}
                <span
                  className="text-[14px] font-semibold"
                  style={{
                    color: wasCorrect ? "var(--accent-blue)" : "var(--accent-red)",
                  }}
                >
                  {wasCorrect ? "Correct" : "Not quite"}
                </span>
              </div>
              <p className="mt-2 text-[15px] leading-[1.6] text-[var(--text-primary)]">
                {"explanation" in currentQ ? currentQ.explanation : ""}
              </p>
            </div>

            {/* Next button */}
            <button
              onClick={advanceOrFinish}
              className="mt-4 flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[var(--accent-blue)] px-8 py-3.5 text-[14px] font-semibold text-[var(--bg-base)] transition-all duration-200"
            >
              {isLastQuestion ? "See results" : "Next question"}
              <ArrowRight size={16} />
            </button>
          </>
        )}
      </div>
    </div>
  );
}
