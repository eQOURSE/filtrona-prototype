"use client";

import { useState, useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  BookOpen,
  Flame,
  Zap,
  Check,
  ArrowLeft,
} from "lucide-react";
import QuizShell from "./QuizShell";
import QuizStreakMode from "./QuizStreakMode";
import QuizRapidFire from "./QuizRapidFire";
import { QuizQuestion } from "@/lib/quiz-content";
import { useProgressStore } from "@/lib/progress-store";

type QuizMode = "classic" | "streak" | "rapid" | null;

interface QuizModeSelectorProps {
  questions: QuizQuestion[];
  topicSlug: string;
}

/* ── Individual Mode Card ─────────────────────────────────── */
interface ModeCardProps {
  icon: React.ReactNode;
  name: string;
  tagline: string;
  features: string[];
  accentColor: string;
  recommended?: boolean;
  bestResult?: string | null;
  onSelect: () => void;
  prefersReducedMotion: boolean | null;
}

function ModeCard({
  icon,
  name,
  tagline,
  features,
  accentColor,
  recommended,
  bestResult,
  onSelect,
  prefersReducedMotion,
}: ModeCardProps) {
  return (
    <motion.button
      onClick={onSelect}
      className="group relative flex min-h-[320px] flex-1 cursor-pointer flex-col rounded-2xl border p-7 text-left transition-colors duration-200"
      style={{
        backgroundColor: "var(--bg-surface)",
        borderColor: "var(--border-default)",
      }}
      whileHover={
        prefersReducedMotion
          ? undefined
          : {
              y: -4,
              borderColor: accentColor,
              transition: { duration: 0.2 },
            }
      }
    >
      {/* Recommended badge */}
      {recommended && (
        <span
          className="absolute top-4 right-4 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-widest"
          style={{
            backgroundColor: "var(--accent-mint-soft)",
            color: "var(--accent-mint)",
          }}
        >
          Recommended
        </span>
      )}

      {/* Icon */}
      <div className="flex h-12 w-12 items-center justify-center">{icon}</div>

      {/* Name */}
      <h3 className="mt-4 text-[22px] font-semibold text-[var(--text-primary)]">
        {name}
      </h3>

      {/* Tagline */}
      <p className="mt-2 text-[14px] leading-[1.5] text-[var(--text-secondary)]">
        {tagline}
      </p>

      {/* Feature list */}
      <ul className="mt-6 flex flex-col gap-2.5">
        {features.map((f, i) => (
          <li key={i} className="flex items-start gap-2">
            <Check
              size={14}
              className="mt-0.5 shrink-0"
              style={{ color: accentColor }}
            />
            <span className="text-[13px] leading-[1.4] text-[var(--text-secondary)]">
              {f}
            </span>
          </li>
        ))}
      </ul>

      {/* Best result pill */}
      <div className="mt-auto pt-4">
        <span className="text-[12px] text-[var(--text-muted)]">
          {bestResult ?? "Not yet attempted"}
        </span>
      </div>

      {/* CTA */}
      <div
        className="mt-4 w-full rounded-xl py-3 text-center text-[14px] font-semibold transition-opacity duration-200 group-hover:opacity-90"
        style={{ backgroundColor: accentColor, color: "var(--bg-base)" }}
      >
        Start
      </div>
    </motion.button>
  );
}

/* ── Main Mode Selector ───────────────────────────────────── */
export default function QuizModeSelector({
  questions,
  topicSlug,
}: QuizModeSelectorProps) {
  const prefersReducedMotion = useReducedMotion();
  const [selectedMode, setSelectedMode] = useState<QuizMode>(null);
  const [mounted, setMounted] = useState(false);

  const getQuizScore = useProgressStore((s) => s.getQuizScore);

  useEffect(() => setMounted(true), []);

  const quizResult = mounted ? getQuizScore(topicSlug) : null;

  // Build best result strings
  const getClassicBest = () => {
    if (!quizResult) return null;
    if (quizResult.mode === "classic" || !quizResult.mode) {
      return `Best: ${quizResult.score}/${quizResult.total}`;
    }
    return null;
  };

  const getStreakBest = () => {
    if (!quizResult || quizResult.mode !== "streak") return null;
    const rank =
      quizResult.score >= 140
        ? "🥇 Gold"
        : quizResult.score >= 80
          ? "🥈 Silver"
          : "🥉 Bronze";
    return `Best: ${rank} · ${quizResult.score} pts`;
  };

  const getRapidBest = () => {
    if (typeof window === "undefined") return null;
    try {
      const raw = localStorage.getItem(`filtrona-rapidfire-best-${topicSlug}`);
      if (!raw) return null;
      const data = JSON.parse(raw);
      return `Best: ${data.correct}/${data.total} in ${data.timeUsed}s`;
    } catch {
      return null;
    }
  };

  // If a mode is selected, render it
  if (selectedMode === "classic") {
    return (
      <div>
        <button
          onClick={() => setSelectedMode(null)}
          className="mb-6 inline-flex cursor-pointer items-center gap-1.5 text-[14px] text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]"
        >
          <ArrowLeft size={14} />
          Choose a different mode
        </button>
        <QuizShell questions={questions} topicSlug={topicSlug} />
      </div>
    );
  }

  if (selectedMode === "streak") {
    return (
      <div>
        <button
          onClick={() => setSelectedMode(null)}
          className="mb-6 inline-flex cursor-pointer items-center gap-1.5 text-[14px] text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]"
        >
          <ArrowLeft size={14} />
          Choose a different mode
        </button>
        <QuizStreakMode questions={questions} topicSlug={topicSlug} />
      </div>
    );
  }

  if (selectedMode === "rapid") {
    return (
      <div>
        <button
          onClick={() => setSelectedMode(null)}
          className="mb-6 inline-flex cursor-pointer items-center gap-1.5 text-[14px] text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]"
        >
          <ArrowLeft size={14} />
          Choose a different mode
        </button>
        <QuizRapidFire questions={questions} topicSlug={topicSlug} />
      </div>
    );
  }

  // Mode selector entry screen
  return (
    <div>
      {/* Hero block */}
      <div className="mb-12">
        <div
          className="inline-block rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wider"
          style={{
            backgroundColor: "var(--accent-violet-soft)",
            color: "var(--accent-violet)",
          }}
        >
          02 · Quiz
        </div>
        <h1 className="mt-3 text-[36px] font-bold tracking-[-0.02em] text-[var(--text-primary)] sm:text-[44px]">
          Choose your challenge
        </h1>
        <p className="mt-2 text-[16px] text-[var(--text-secondary)]">
          Same eight questions, three completely different ways to play.
        </p>
      </div>

      {/* Mode cards */}
      <div className="flex flex-col gap-6 lg:flex-row">
        <ModeCard
          icon={
            <BookOpen size={48} className="text-[var(--accent-mint)]" />
          }
          name="Classic"
          tagline="Take your time. Learn from each answer."
          features={[
            "No timer",
            "Detailed explanation after each question",
            "Retry anytime",
          ]}
          accentColor="var(--accent-mint)"
          bestResult={getClassicBest()}
          onSelect={() => setSelectedMode("classic")}
          prefersReducedMotion={prefersReducedMotion}
        />

        <ModeCard
          icon={<Flame size={48} className="text-[#FFB547]" />}
          name="Streak Mode"
          tagline="20 seconds per question. Build streaks. Lose a heart on wrong answers."
          features={[
            "Score multipliers on streaks",
            "3 hearts — don't waste them",
            "Bronze / Silver / Gold ranks",
          ]}
          accentColor="#FFB547"
          recommended
          bestResult={getStreakBest()}
          onSelect={() => setSelectedMode("streak")}
          prefersReducedMotion={prefersReducedMotion}
        />

        <ModeCard
          icon={<Zap size={48} className="text-[var(--accent-violet)]" />}
          name="Rapid Fire"
          tagline="60 seconds. As many as you can. No second chances."
          features={[
            "Speed run leaderboard",
            "Instant feedback only",
            "Beat your personal best",
          ]}
          accentColor="var(--accent-violet)"
          bestResult={getRapidBest()}
          onSelect={() => setSelectedMode("rapid")}
          prefersReducedMotion={prefersReducedMotion}
        />
      </div>
    </div>
  );
}
