"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  Skull,
  Volume2,
  VolumeX,
  Trophy,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { QuizQuestion } from "@/lib/quiz-content";
import { useProgressStore } from "@/lib/progress-store";
import {
  playCorrect,
  playWrong,
  playStreakUp,
  playGameOver,
  isMuted,
  toggleMute,
} from "@/lib/sound-effects";
import HeartsIndicator from "./HeartsIndicator";
import StreakIndicator from "./StreakIndicator";
import TimerRing from "./TimerRing";
import ScoreParticles from "./ScoreParticles";
import QuestionMCQ from "./QuestionMCQ";
import QuestionTrueFalse from "./QuestionTrueFalse";
import QuestionMultiSelect from "./QuestionMultiSelect";
import QuestionMatch from "./QuestionMatch";

const EASE = [0.16, 1, 0.3, 1] as const;
const TIME_PER_QUESTION = 20;

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

type Phase = "playing" | "feedback" | "gameover" | "finished";

interface FeedbackData {
  wasCorrect: boolean;
  pointsEarned: number;
  basePoints: number;
  streakBonus: number;
  timeBonus: number;
  timeBonusApplied: boolean;
  correctAnswer?: string;
}

interface QuizStreakModeProps {
  questions: QuizQuestion[];
  topicSlug: string;
}

export default function QuizStreakMode({
  questions,
  topicSlug,
}: QuizStreakModeProps) {
  const router = useRouter();
  const prefersReducedMotion = useReducedMotion();
  const markComplete = useProgressStore((s) => s.markComplete);
  const saveQuizScore = useProgressStore((s) => s.saveQuizScore);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [hearts, setHearts] = useState(3);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [score, setScore] = useState(0);
  const [fastAnswerCount, setFastAnswerCount] = useState(0);
  const [answers, setAnswers] = useState<Record<string, AnswerState>>({});
  const [timerKey, setTimerKey] = useState(0);
  const [phase, setPhase] = useState<Phase>("playing");
  const [feedbackData, setFeedbackData] = useState<FeedbackData | null>(null);
  const [particleTrigger, setParticleTrigger] = useState(0);
  const [particlePos, setParticlePos] = useState({ x: 0, y: 0 });
  const [muted, setMuted] = useState(false);
  const [autoAdvanceProgress, setAutoAdvanceProgress] = useState(100);
  const [shakeQuestion, setShakeQuestion] = useState(false);

  const submitBtnRef = useRef<HTMLButtonElement>(null);
  const autoAdvanceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const autoAdvanceIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    setMuted(isMuted());
  }, []);

  const currentQ = questions[currentIndex];
  const currentAnswer = answers[currentQ?.id] ?? emptyAnswer();
  const isLastQuestion = currentIndex === questions.length - 1;

  // ── Check if answer is provided
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

  // ── Check correctness
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
        return (
          selected.size === correct.size &&
          [...selected].every((i) => correct.has(i))
        );
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

  // ── Get correct answer text for feedback
  const getCorrectAnswerText = useCallback((): string => {
    if (!currentQ) return "";
    switch (currentQ.type) {
      case "mcq":
        return currentQ.options[currentQ.correctIndex];
      case "truefalse":
        return currentQ.correct ? "True" : "False";
      default:
        return currentQ.explanation?.slice(0, 120) ?? "";
    }
  }, [currentQ]);

  // ── Update answer
  const updateAnswer = (qId: string, partial: Partial<AnswerState>) => {
    if (phase !== "playing") return;
    setAnswers((prev) => ({
      ...prev,
      [qId]: { ...(prev[qId] ?? emptyAnswer()), ...partial },
    }));
  };

  // ── Clear auto-advance timers
  const clearAutoAdvance = () => {
    if (autoAdvanceTimerRef.current) clearTimeout(autoAdvanceTimerRef.current);
    if (autoAdvanceIntervalRef.current) clearInterval(autoAdvanceIntervalRef.current);
  };

  // ── Start auto-advance countdown
  const startAutoAdvance = (durationMs: number) => {
    clearAutoAdvance();
    setAutoAdvanceProgress(100);
    const stepMs = 50;
    const totalSteps = durationMs / stepMs;
    let step = 0;
    autoAdvanceIntervalRef.current = setInterval(() => {
      step++;
      setAutoAdvanceProgress(Math.max(0, 100 - (step / totalSteps) * 100));
    }, stepMs);
    autoAdvanceTimerRef.current = setTimeout(() => {
      clearAutoAdvance();
      advanceOrFinish();
    }, durationMs);
  };

  // ── Advance to next question or finish
  const advanceOrFinish = useCallback(() => {
    clearAutoAdvance();
    if (isLastQuestion) {
      setPhase("finished");
    } else {
      setCurrentIndex((i) => i + 1);
      setTimerKey((k) => k + 1);
      setPhase("playing");
      setFeedbackData(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLastQuestion]);

  // ── Handle submit
  const handleSubmit = () => {
    if (!currentQ || phase !== "playing") return;
    if (!hasAnswer()) return;

    const wasCorrect = checkCorrect();
    // Get remaining time from the timer (approximate based on timer key)
    const timeRemainingApprox = TIME_PER_QUESTION; // We'll track this

    if (wasCorrect) {
      const newStreak = streak + 1;
      const basePoints = 10;
      const streakBonus = newStreak * 5;
      // We can't easily get exact remaining time from TimerRing; track separately
      const timeBonusApplied = false; // will be computed via ref
      const timeBonusVal = timeBonusApplied ? 10 : 0;
      const totalPoints = basePoints + streakBonus + timeBonusVal;

      setStreak(newStreak);
      if (newStreak > bestStreak) setBestStreak(newStreak);
      setScore((s) => s + totalPoints);

      // Particle burst
      if (submitBtnRef.current) {
        const rect = submitBtnRef.current.getBoundingClientRect();
        setParticlePos({ x: rect.left + rect.width / 2, y: rect.top });
      }
      setParticleTrigger((t) => t + 1);

      playCorrect();
      if (newStreak === 3 || newStreak === 5 || newStreak === 7) {
        playStreakUp();
      }

      setFeedbackData({
        wasCorrect: true,
        pointsEarned: totalPoints,
        basePoints,
        streakBonus,
        timeBonus: timeBonusVal,
        timeBonusApplied,
      });
    } else {
      const newHearts = hearts - 1;
      setStreak(0);
      setHearts(newHearts);

      // Screen shake
      setShakeQuestion(true);
      setTimeout(() => setShakeQuestion(false), 400);

      playWrong();

      if (newHearts <= 0) {
        playGameOver();
        setPhase("gameover");
        return;
      }

      setFeedbackData({
        wasCorrect: false,
        pointsEarned: 0,
        basePoints: 0,
        streakBonus: 0,
        timeBonus: 0,
        timeBonusApplied: false,
        correctAnswer: getCorrectAnswerText(),
      });
    }

    setPhase("feedback");
  };

  // Start auto-advance when feedback phase begins
  useEffect(() => {
    if (phase === "feedback") {
      startAutoAdvance(2500);
    }
    return () => clearAutoAdvance();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  // ── Timer expired
  const handleTimerComplete = useCallback(() => {
    if (phase !== "playing") return;
    const newHearts = hearts - 1;
    setStreak(0);
    setHearts(newHearts);
    playWrong();

    if (newHearts <= 0) {
      playGameOver();
      setPhase("gameover");
      return;
    }

    setFeedbackData({
      wasCorrect: false,
      pointsEarned: 0,
      basePoints: 0,
      streakBonus: 0,
      timeBonus: 0,
      timeBonusApplied: false,
      correctAnswer: "Time's up!",
    });
    setPhase("feedback");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, hearts]);

  // ── Keyboard shortcuts
  useEffect(() => {
    if (phase !== "playing") return;

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
          updateAnswer(currentQ.id, { mcq: idx });
        }
      }

      if (currentQ.type === "truefalse") {
        if (e.key.toLowerCase() === "t") {
          updateAnswer(currentQ.id, { truefalse: true });
        }
        if (e.key.toLowerCase() === "f") {
          updateAnswer(currentQ.id, { truefalse: false });
        }
      }

      if (e.key === "Enter") {
        e.preventDefault();
        handleSubmit();
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, currentQ, currentAnswer]);

  // ── Retry
  const handleRetry = () => {
    setCurrentIndex(0);
    setHearts(3);
    setStreak(0);
    setBestStreak(0);
    setScore(0);
    setFastAnswerCount(0);
    setAnswers({});
    setTimerKey((k) => k + 1);
    setPhase("playing");
    setFeedbackData(null);
  };

  // ── Sound toggle
  const handleToggleMute = () => {
    const newMuted = toggleMute();
    setMuted(newMuted);
  };

  // ── GAME OVER SCREEN ──────────────────────────────────────
  if (phase === "gameover") {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
        <motion.div
          animate={
            prefersReducedMotion
              ? undefined
              : {
                  x: [0, -3, 3, -2, 2, 0],
                  transition: { repeat: Infinity, duration: 0.5 },
                }
          }
        >
          <Skull size={64} color="#FF5C7A" />
        </motion.div>

        <h2 className="mt-6 text-[36px] font-bold text-[var(--text-primary)]">
          Out of hearts
        </h2>
        <p className="mt-3 text-[16px] text-[var(--text-secondary)]">
          {currentIndex} of {questions.length} questions answered · {score} pts ·
          best streak {bestStreak}×
        </p>

        <div
          className="mt-3"
          role="status"
          aria-live="polite"
        >
          Game over — {currentIndex} of {questions.length} answered, {score}{" "}
          points
        </div>

        <div className="mt-8 flex gap-4">
          <button
            onClick={handleRetry}
            className="cursor-pointer rounded-xl bg-[var(--accent-mint)] px-8 py-3.5 text-[14px] font-semibold text-[var(--bg-base)] transition-opacity hover:opacity-90"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  // ── FINISHED SCREEN ────────────────────────────────────────
  if (phase === "finished") {
    let rankEmoji = "🥉";
    let rankTitle = "You made it through";
    let rankGlowColor = "var(--accent-orange)";

    if (score >= 140) {
      rankEmoji = "🥇";
      rankTitle = "Filtrona scholar";
      rankGlowColor = "var(--accent-mint)";
    } else if (score >= 80) {
      rankEmoji = "🥈";
      rankTitle = "Solid run";
      rankGlowColor = "var(--accent-violet)";
    }

    const handleComplete = () => {
      markComplete(topicSlug, "quiz");
      saveQuizScore(topicSlug, score, questions.length, {
        mode: "streak",
        bestStreak,
      });
      setTimeout(() => router.push(`/topics/${topicSlug}`), 600);
    };

    return (
      <div className="mx-auto max-w-2xl text-center">
        {/* Rank badge */}
        <motion.div
          className="mx-auto flex h-32 w-32 items-center justify-center rounded-full"
          style={{
            boxShadow: `0 0 40px color-mix(in srgb, ${rankGlowColor} 40%, transparent)`,
          }}
          initial={prefersReducedMotion ? false : { scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: EASE }}
        >
          <span className="text-[64px]">{rankEmoji}</span>
        </motion.div>

        <h2 className="mt-6 text-[32px] font-bold text-[var(--text-primary)]">
          {rankTitle}
        </h2>

        {/* Stats grid */}
        <div className="mx-auto mt-8 grid max-w-lg grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="rounded-xl border border-[var(--border-default)] bg-[var(--bg-surface)] p-4">
            <div className="text-[24px] font-bold text-[var(--accent-mint)]">
              {score}
            </div>
            <div className="mt-1 text-[12px] text-[var(--text-muted)]">
              Points
            </div>
          </div>
          <div className="rounded-xl border border-[var(--border-default)] bg-[var(--bg-surface)] p-4">
            <div className="text-[24px] font-bold text-[var(--accent-orange)]">
              {bestStreak}× 🔥
            </div>
            <div className="mt-1 text-[12px] text-[var(--text-muted)]">
              Best streak
            </div>
          </div>
          <div className="rounded-xl border border-[var(--border-default)] bg-[var(--bg-surface)] p-4">
            <div className="flex justify-center">
              <HeartsIndicator hearts={hearts} />
            </div>
            <div className="mt-1 text-[12px] text-[var(--text-muted)]">
              Hearts left
            </div>
          </div>
          <div className="rounded-xl border border-[var(--border-default)] bg-[var(--bg-surface)] p-4">
            <div className="text-[24px] font-bold text-[var(--accent-violet)]">
              {fastAnswerCount}
            </div>
            <div className="mt-1 text-[12px] text-[var(--text-muted)]">
              Fast answers
            </div>
          </div>
        </div>

        {/* Actions */}
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
          Quiz complete! {rankTitle} — {score} points, best streak{" "}
          {bestStreak}
        </div>
      </div>
    );
  }

  // ── PLAYING / FEEDBACK ─────────────────────────────────────
  if (!currentQ) return null;

  const progressPercent = ((currentIndex + 1) / questions.length) * 100;

  return (
    <div className="relative">
      <ScoreParticles
        trigger={particleTrigger}
        x={particlePos.x}
        y={particlePos.y}
      />

      {/* ── Mute toggle (top-right) */}
      <button
        onClick={handleToggleMute}
        className="absolute top-0 right-0 cursor-pointer rounded-lg p-2 text-[var(--text-muted)] transition-colors hover:text-[var(--text-primary)]"
        aria-label={muted ? "Unmute sounds" : "Mute sounds"}
      >
        {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
      </button>

      {/* ── Top bar */}
      <div className="flex items-center justify-between gap-4 pb-4">
        <HeartsIndicator hearts={hearts} />
        <StreakIndicator streak={streak} />
        <div
          className="text-[18px] font-bold tabular-nums"
          style={{
            color: score > 0 ? "var(--accent-mint)" : "var(--text-muted)",
            fontFamily: "var(--font-sans), monospace",
          }}
        >
          {score} pts
        </div>
      </div>

      {/* ── Progress strip */}
      <div className="flex items-center justify-between">
        <span className="text-[14px] text-[var(--text-muted)]">
          {currentIndex + 1} / {questions.length}
        </span>
      </div>
      <div className="mt-2 h-[3px] w-full rounded-full bg-[var(--border-default)]">
        <div
          className="h-full rounded-full bg-[var(--accent-mint)] transition-all duration-500 ease-out"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* ── Question area with timer */}
      <div className="mt-8">
        <div className="flex items-start justify-between gap-4">
          <motion.div
            className="flex-1"
            animate={
              shakeQuestion && !prefersReducedMotion
                ? {
                    x: [0, -12, 12, -8, 8, -4, 4, 0],
                    transition: { duration: 0.4 },
                  }
                : shakeQuestion
                  ? { opacity: [1, 0.5, 1], transition: { duration: 0.3 } }
                  : {}
            }
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={currentQ.id}
                initial={
                  !prefersReducedMotion ? { opacity: 0, x: 40 } : undefined
                }
                animate={{ opacity: 1, x: 0 }}
                exit={
                  !prefersReducedMotion ? { opacity: 0, x: -40 } : undefined
                }
                transition={{ duration: 0.3, ease: EASE }}
              >
                {currentQ.type === "mcq" && (
                  <QuestionMCQ
                    question={currentQ.question}
                    options={currentQ.options}
                    correctIndex={currentQ.correctIndex}
                    selectedIndex={currentAnswer.mcq}
                    onSelect={(i) =>
                      updateAnswer(currentQ.id, { mcq: i })
                    }
                    isSubmitted={phase === "feedback"}
                  />
                )}
                {currentQ.type === "truefalse" && (
                  <QuestionTrueFalse
                    question={currentQ.question}
                    correct={currentQ.correct}
                    selected={currentAnswer.truefalse}
                    onSelect={(v) =>
                      updateAnswer(currentQ.id, { truefalse: v })
                    }
                    isSubmitted={phase === "feedback"}
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
                      updateAnswer(currentQ.id, {
                        multiselect: next,
                      });
                    }}
                    isSubmitted={phase === "feedback"}
                  />
                )}
                {currentQ.type === "match" && (
                  <QuestionMatch
                    question={currentQ.question}
                    leftItems={currentQ.leftItems}
                    rightItems={currentQ.rightItems}
                    correctPairs={currentQ.correctPairs}
                    pairs={currentAnswer.match}
                    onPair={(p) =>
                      updateAnswer(currentQ.id, { match: p })
                    }
                    isSubmitted={phase === "feedback"}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </motion.div>

          {/* Timer */}
          <div className="shrink-0 pt-1">
            <TimerRing
              key={timerKey}
              seconds={TIME_PER_QUESTION}
              total={TIME_PER_QUESTION}
              isPaused={phase !== "playing"}
              onComplete={handleTimerComplete}
            />
          </div>
        </div>
      </div>

      {/* ── Action row */}
      {phase === "playing" && (
        <div className="mt-8 flex justify-end">
          <button
            ref={submitBtnRef}
            onClick={handleSubmit}
            disabled={!hasAnswer()}
            className="cursor-pointer rounded-xl bg-[var(--accent-mint)] px-6 py-3 text-[14px] font-semibold text-[var(--bg-base)] transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Submit answer
          </button>
        </div>
      )}

      {/* ── Feedback overlay */}
      <AnimatePresence>
        {phase === "feedback" && feedbackData && (
          <motion.div
            className="mt-6"
            initial={prefersReducedMotion ? { opacity: 0 } : { y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={prefersReducedMotion ? { opacity: 0 } : { y: 100, opacity: 0 }}
            transition={{ duration: 0.3, ease: EASE }}
          >
            <div
              className="mx-auto max-w-2xl rounded-2xl border p-6"
              style={{
                backgroundColor: "var(--bg-elevated)",
                borderColor: feedbackData.wasCorrect
                  ? "var(--accent-mint)"
                  : "var(--accent-orange)",
              }}
            >
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-[24px]"
                  style={{
                    backgroundColor: feedbackData.wasCorrect
                      ? "var(--accent-mint-soft)"
                      : "var(--accent-orange-soft)",
                    color: feedbackData.wasCorrect
                      ? "var(--accent-mint)"
                      : "var(--accent-orange)",
                  }}
                >
                  {feedbackData.wasCorrect ? "✓" : "✗"}
                </div>

                {/* Text */}
                <div className="flex-1">
                  <h3
                    className="text-[24px] font-bold"
                    style={{
                      color: feedbackData.wasCorrect
                        ? "var(--accent-mint)"
                        : "var(--accent-orange)",
                    }}
                  >
                    {feedbackData.wasCorrect ? "Correct!" : "Not quite"}
                  </h3>

                  {feedbackData.wasCorrect ? (
                    <div className="mt-2 space-y-1 text-[14px] text-[var(--text-secondary)]">
                      <div>+{feedbackData.basePoints} base</div>
                      {feedbackData.streakBonus > 0 && (
                        <div>+{feedbackData.streakBonus} streak bonus</div>
                      )}
                      {feedbackData.timeBonusApplied && (
                        <div>+{feedbackData.timeBonus} fast answer</div>
                      )}
                    </div>
                  ) : (
                    <p className="mt-2 text-[14px] text-[var(--text-secondary)]">
                      {feedbackData.correctAnswer}
                    </p>
                  )}
                </div>
              </div>

              {/* Auto-advance button + progress bar */}
              <button
                onClick={() => {
                  clearAutoAdvance();
                  advanceOrFinish();
                }}
                className="mt-4 flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[var(--accent-mint)] px-6 py-3 text-[14px] font-semibold text-[var(--bg-base)] transition-opacity hover:opacity-90"
              >
                {isLastQuestion ? "See results" : "Next question"}
                <ArrowRight size={16} />
              </button>
              {/* Auto-advance bar */}
              <div className="mt-2 h-[2px] w-full overflow-hidden rounded-full bg-[var(--border-default)]">
                <div
                  className="h-full rounded-full bg-[var(--accent-mint)] transition-all duration-75"
                  style={{ width: `${autoAdvanceProgress}%` }}
                />
              </div>
            </div>

            <div role="status" aria-live="polite" className="sr-only">
              {feedbackData.wasCorrect
                ? `Correct! +${feedbackData.pointsEarned} points`
                : `Wrong. ${feedbackData.correctAnswer}`}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
