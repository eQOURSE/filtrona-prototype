"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Info, Sparkles } from "lucide-react";
import TopNav from "@/components/TopNav";
import QuizShell from "@/components/quiz/QuizShell";
import { historyQuestions } from "@/lib/quiz-content";
import { topics } from "@/lib/topics";
import { useProgressStore } from "@/lib/progress-store";

export default function QuizPage() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug;
  const [mounted, setMounted] = useState(false);
  const [started, setStarted] = useState(false);

  const getQuizScore = useProgressStore((s) => s.getQuizScore);
  const topic = topics.find((t) => t.slug === slug);

  useEffect(() => setMounted(true), []);

  const previousScore = mounted ? getQuizScore(slug) : null;

  // Only history has quiz content for now
  if (slug !== "history") {
    const topicTitle = topic?.title ?? "Topic";
    return (
      <div className="min-h-screen bg-[var(--bg-base)] text-[var(--text-primary)]">
        <TopNav />
        <main className="flex min-h-[calc(100vh-72px)] flex-col items-center justify-center px-8 text-center">
          <div
            className="flex h-20 w-20 items-center justify-center rounded-2xl"
            style={{ backgroundColor: "var(--accent-violet-soft)" }}
          >
            <Sparkles size={40} className="opacity-60" style={{ color: "var(--accent-violet)" }} />
          </div>
          <h1 className="mt-6 text-[28px] font-bold">Quiz · Coming soon</h1>
          <p className="mt-3 max-w-[480px] text-[15px] text-[var(--text-secondary)]">
            The quiz for this topic is being built for the next version of Filtrona Academy.
          </p>
          <Link
            href={`/topics/${slug}`}
            className="mt-8 text-sm font-medium text-[var(--accent-mint)] hover:underline"
          >
            ← Back to {topicTitle}
          </Link>
        </main>
      </div>
    );
  }

  // Auto-start if no previous score
  const autoStart = mounted && !previousScore;
  const showQuiz = started || autoStart;

  return (
    <div className="min-h-screen bg-[var(--bg-base)] text-[var(--text-primary)]">
      <TopNav />

      <main className="mx-auto max-w-[800px] px-4 pt-12 pb-[120px] sm:px-6">
        {/* ── Header ─────────────────────────────────────────────── */}
        <header>
          <Link
            href={`/topics/${slug}`}
            className="inline-flex items-center gap-1.5 text-sm text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]"
          >
            <ArrowLeft size={14} />
            The Filtrona Story
          </Link>

          <div
            className="mt-4 inline-block rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wider"
            style={{ backgroundColor: "var(--accent-violet-soft)", color: "var(--accent-violet)" }}
          >
            02 · Quiz
          </div>

          <h1 className="mt-3 text-[32px] font-bold tracking-[-0.02em] text-[var(--text-primary)] sm:text-[40px]">
            Quiz
          </h1>
          <p className="mt-2 text-[15px] text-[var(--text-secondary)] sm:text-[16px]">
            Eight questions across four interaction types. Take your time.
          </p>
        </header>

        {/* ── Resume banner ──────────────────────────────────────── */}
        {mounted && previousScore && !started && (
          <div className="mt-6 flex items-center justify-between rounded-xl border border-[var(--border-default)] bg-[var(--bg-surface)] px-5 py-4">
            <div className="flex items-center gap-3">
              <Info size={18} className="text-[var(--accent-violet)]" />
              <span className="text-[14px] text-[var(--text-secondary)]">
                Last attempt: {previousScore.score}/{previousScore.total}. Want to try again?
              </span>
            </div>
            <button
              onClick={() => setStarted(true)}
              className="shrink-0 rounded-lg bg-[var(--accent-mint)] px-4 py-2 text-[13px] font-semibold text-[var(--bg-base)] transition-opacity hover:opacity-90"
            >
              Start over
            </button>
          </div>
        )}

        {/* ── Quiz shell ─────────────────────────────────────────── */}
        {showQuiz && (
          <div className="mt-12">
            <QuizShell questions={historyQuestions} topicSlug="history" />
          </div>
        )}
      </main>
    </div>
  );
}
