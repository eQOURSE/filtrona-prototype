"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Zap, Trophy } from "lucide-react";
import { useRouter } from "next/navigation";
import { QuizQuestion } from "@/lib/quiz-content";
import { useProgressStore } from "@/lib/progress-store";
import QuestionMCQ from "./QuestionMCQ";
import QuestionTrueFalse from "./QuestionTrueFalse";
import QuestionMultiSelect from "./QuestionMultiSelect";
import QuestionMatch from "./QuestionMatch";

const EASE = [0.16, 1, 0.3, 1] as const;
const TOTAL_TIME = 60;

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

interface RapidFireBest {
  correct: number;
  total: number;
  timeUsed: number;
}

interface QuizRapidFireProps {
  questions: QuizQuestion[];
  topicSlug: string;
}

export default function QuizRapidFire({
  questions,
  topicSlug,
}: QuizRapidFireProps) {
  const router = useRouter();
  const prefersReducedMotion = useReducedMotion();
  const markComplete = useProgressStore((s) => s.markComplete);
  const saveQuizScore = useProgressStore((s) => s.saveQuizScore);

  const [started, setStarted] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(TOTAL_TIME);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [answered, setAnswered] = useState(0);
  const [finished, setFinished] = useState(false);
  const [answers, setAnswers] = useState<Record<string, AnswerState>>({});
  const [flashResult, setFlashResult] = useState<"correct" | "wrong" | null>(
    null
  );
  const [bestRapid, setBestRapid] = useState<RapidFireBest | null>(null);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number>(0);

  // Load best from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(`filtrona-rapidfire-best-${topicSlug}`);
      if (raw) setBestRapid(JSON.parse(raw));
    } catch {
      /* no-op */
    }
  }, [topicSlug]);

  // The current question cycles through the array
  const currentQ = questions[currentIndex % questions.length];
  const currentAnswer = answers[`${currentQ?.id}-${answered}`] ?? emptyAnswer();

  // Start countdown
  useEffect(() => {
    if (!started || finished) return;

    startTimeRef.current = Date.now();

    timerRef.current = setInterval(() => {
      const elapsed = (Date.now() - startTimeRef.current) / 1000;
      const remaining = Math.max(0, TOTAL_TIME - elapsed);
      setSecondsLeft(remaining);

      if (remaining <= 0) {
        if (timerRef.current) clearInterval(timerRef.current);
        setFinished(true);
      }
    }, 100);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [started, finished]);

  // Check correctness
  const checkCorrect = useCallback((): boolean => {
    if (!currentQ) return false;
    const ans = currentAnswer;
    switch (currentQ.type) {
      case "mcq":
        return ans.mcq === currentQ.correctIndex;
      case "truefalse":
        return ans.truefalse === currentQ.correct;
      case "multiselect": {
        const selected = new Set(ans.multiselect);
        const correctSet = new Set(currentQ.correctIndices);
        return (
          selected.size === correctSet.size &&
          [...selected].every((i) => correctSet.has(i))
        );
      }
      case "match": {
        return currentQ.correctPairs.every(([cl, cr]) =>
          ans.match.some(([l, r]) => l === cl && r === cr)
        );
      }
      default:
        return false;
    }
  }, [currentQ, currentAnswer]);

  // Update answer
  const updateAnswer = (partial: Partial<AnswerState>) => {
    if (!currentQ || finished) return;
    const key = `${currentQ.id}-${answered}`;
    setAnswers((prev) => ({
      ...prev,
      [key]: { ...(prev[key] ?? emptyAnswer()), ...partial },
    }));
  };

  // Submit answer
  const handleSubmit = () => {
    if (!currentQ || finished) return;

    const wasCorrect = checkCorrect();

    // Flash result
    setFlashResult(wasCorrect ? "correct" : "wrong");
    setTimeout(() => setFlashResult(null), 200);

    if (wasCorrect) setCorrect((c) => c + 1);
    setAnswered((a) => a + 1);

    // Advance to next question (cycles)
    setCurrentIndex((i) => i + 1);
  };

  // Has answer
  const hasAnswer = (): boolean => {
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
  };

  // Save best and complete
  const saveBest = useCallback(() => {
    const timeUsed = TOTAL_TIME - Math.ceil(secondsLeft);
    const newBest: RapidFireBest = {
      correct,
      total: answered,
      timeUsed,
    };

    // Save to localStorage if better
    try {
      const raw = localStorage.getItem(
        `filtrona-rapidfire-best-${topicSlug}`
      );
      const prev: RapidFireBest | null = raw ? JSON.parse(raw) : null;
      if (!prev || correct > prev.correct) {
        localStorage.setItem(
          `filtrona-rapidfire-best-${topicSlug}`,
          JSON.stringify(newBest)
        );
        setBestRapid(newBest);
      }
    } catch {
      /* no-op */
    }
  }, [correct, answered, secondsLeft, topicSlug]);

  // Save on finish
  useEffect(() => {
    if (finished) saveBest();
  }, [finished, saveBest]);

  // Keyboard shortcuts
  useEffect(() => {
    if (!started || finished) return;

    const handler = (e: KeyboardEvent) => {
      if (!currentQ) return;

      if (currentQ.type === "mcq") {
        const keyMap: Record<string, number> = {
          a: 0,
          b: 1,
          c: 2,
          d: 3,
        };
        const idx = keyMap[e.key.toLowerCase()];
        if (idx !== undefined && idx < currentQ.options.length) {
          updateAnswer({ mcq: idx });
        }
      }

      if (currentQ.type === "truefalse") {
        if (e.key.toLowerCase() === "t") updateAnswer({ truefalse: true });
        if (e.key.toLowerCase() === "f") updateAnswer({ truefalse: false });
      }

      if (e.key === "Enter") {
        e.preventDefault();
        handleSubmit();
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [started, finished, currentQ, currentAnswer]);

  const handleRetry = () => {
    setStarted(false);
    setSecondsLeft(TOTAL_TIME);
    setCurrentIndex(0);
    setCorrect(0);
    setAnswered(0);
    setFinished(false);
    setAnswers({});
    setFlashResult(null);
  };

  const handleComplete = () => {
    markComplete(topicSlug, "quiz");
    saveQuizScore(topicSlug, correct, answered, {
      mode: "rapid",
    });
    setTimeout(() => router.push(`/topics/${topicSlug}`), 600);
  };

  // ── PRE-START SCREEN ───────────────────────────────────────
  if (!started) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center text-center">
        <motion.div
          initial={prefersReducedMotion ? false : { scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: EASE }}
        >
          <Zap size={48} className="mx-auto text-[var(--accent-violet)]" />
        </motion.div>

        <h2 className="mt-6 text-[32px] font-bold text-[var(--text-primary)]">
          60 seconds. Ready?
        </h2>
        <p className="mt-3 max-w-md text-[16px] text-[var(--text-secondary)]">
          Tap as fast as you can. Answer → next question. No mercy.
        </p>

        {bestRapid && (
          <p className="mt-4 text-[14px] text-[var(--text-muted)]">
            Best: {bestRapid.correct}/{bestRapid.total} in {bestRapid.timeUsed}s
          </p>
        )}

        <button
          onClick={() => setStarted(true)}
          className="mt-8 cursor-pointer rounded-xl bg-[var(--accent-violet)] px-10 py-4 text-[16px] font-semibold text-white transition-opacity hover:opacity-90"
        >
          Start
        </button>
      </div>
    );
  }

  // ── FINISHED SCREEN ────────────────────────────────────────
  if (finished) {
    const timeUsed = TOTAL_TIME - Math.ceil(secondsLeft);
    const isNewBest = bestRapid
      ? correct > bestRapid.correct ||
        (correct === bestRapid.correct && bestRapid !== null)
      : true;

    return (
      <div className="mx-auto max-w-lg text-center">
        <motion.div
          initial={prefersReducedMotion ? false : { scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: EASE }}
        >
          <Trophy size={48} className="mx-auto text-[var(--accent-violet)]" />
        </motion.div>

        <h2 className="mt-6 text-[32px] font-bold text-[var(--text-primary)]">
          Time&apos;s up!
        </h2>

        <div className="mx-auto mt-6 grid max-w-sm grid-cols-2 gap-4">
          <div className="rounded-xl border border-[var(--border-default)] bg-[var(--bg-surface)] p-4">
            <div className="text-[32px] font-bold text-[var(--accent-violet)]">
              {answered}
            </div>
            <div className="mt-1 text-[12px] text-[var(--text-muted)]">
              Answered
            </div>
          </div>
          <div className="rounded-xl border border-[var(--border-default)] bg-[var(--bg-surface)] p-4">
            <div className="text-[32px] font-bold text-[var(--accent-mint)]">
              {correct}
            </div>
            <div className="mt-1 text-[12px] text-[var(--text-muted)]">
              Correct
            </div>
          </div>
        </div>

        {bestRapid && (
          <p className="mt-4 text-[14px] text-[var(--text-muted)]">
            {isNewBest
              ? "🎉 New personal best!"
              : `Personal best: ${bestRapid.correct}/${bestRapid.total}`}
          </p>
        )}

        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <button
            onClick={handleComplete}
            className="cursor-pointer rounded-xl bg-[var(--accent-mint)] px-8 py-3.5 text-[14px] font-semibold text-[var(--bg-base)] shadow-mint-glow transition-all hover:shadow-mint-glow-hover"
          >
            Mark complete & return
          </button>
          <button
            onClick={handleRetry}
            className="cursor-pointer rounded-xl border border-[var(--border-default)] bg-[var(--bg-elevated)] px-6 py-3.5 text-[14px] font-medium text-[var(--text-primary)] transition-colors hover:border-[var(--accent-violet)]"
          >
            Try again
          </button>
        </div>

        <div role="status" aria-live="polite" className="sr-only">
          Time is up. You answered {answered} questions, {correct} correct.
        </div>
      </div>
    );
  }

  // ── PLAYING SCREEN ─────────────────────────────────────────
  const displaySeconds = Math.ceil(secondsLeft);
  let timerColor = "var(--text-primary)";
  if (displaySeconds <= 10) timerColor = "#FF5C7A";
  else if (displaySeconds <= 20) timerColor = "var(--accent-orange)";

  return (
    <div className="relative">
      {/* Flash overlay */}
      <AnimatePresence>
        {flashResult && (
          <motion.div
            className="pointer-events-none fixed inset-0 z-40"
            initial={{ opacity: 0.5 }}
            animate={{ opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{
              backgroundColor:
                flashResult === "correct"
                  ? "rgba(0, 229, 160, 0.15)"
                  : "rgba(255, 92, 122, 0.15)",
            }}
          />
        )}
      </AnimatePresence>

      {/* Timer */}
      <div className="mb-6 text-center">
        <motion.span
          key={displaySeconds}
          className="text-[48px] font-bold tabular-nums"
          style={{
            color: timerColor,
            fontFamily: "var(--font-sans), monospace",
          }}
          initial={prefersReducedMotion ? false : { scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.1 }}
        >
          {displaySeconds}s
        </motion.span>

        <div className="mt-2 text-[14px] text-[var(--text-muted)]">
          {correct}/{answered} correct
        </div>
      </div>

      {/* Question */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${currentQ.id}-${answered}`}
          initial={!prefersReducedMotion ? { opacity: 0, x: 30 } : undefined}
          animate={{ opacity: 1, x: 0 }}
          exit={!prefersReducedMotion ? { opacity: 0, x: -30 } : undefined}
          transition={{ duration: 0.15, ease: EASE }}
        >
          {currentQ.type === "mcq" && (
            <QuestionMCQ
              question={currentQ.question}
              options={currentQ.options}
              correctIndex={currentQ.correctIndex}
              selectedIndex={currentAnswer.mcq}
              onSelect={(i) => updateAnswer({ mcq: i })}
              isSubmitted={false}
            />
          )}
          {currentQ.type === "truefalse" && (
            <QuestionTrueFalse
              question={currentQ.question}
              correct={currentQ.correct}
              selected={currentAnswer.truefalse}
              onSelect={(v) => updateAnswer({ truefalse: v })}
              isSubmitted={false}
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
                updateAnswer({ multiselect: next });
              }}
              isSubmitted={false}
            />
          )}
          {currentQ.type === "match" && (
            <QuestionMatch
              question={currentQ.question}
              leftItems={currentQ.leftItems}
              rightItems={currentQ.rightItems}
              correctPairs={currentQ.correctPairs}
              pairs={currentAnswer.match}
              onPair={(p) => updateAnswer({ match: p })}
              isSubmitted={false}
            />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Submit */}
      <div className="mt-6 flex justify-end">
        <button
          onClick={handleSubmit}
          disabled={!hasAnswer()}
          className="cursor-pointer rounded-xl bg-[var(--accent-violet)] px-6 py-3 text-[14px] font-semibold text-white transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Answer →
        </button>
      </div>

      <div role="timer" aria-live="polite" className="sr-only">
        {displaySeconds} seconds remaining
      </div>
    </div>
  );
}
