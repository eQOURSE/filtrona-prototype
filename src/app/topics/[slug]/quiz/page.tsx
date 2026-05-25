"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Sparkles } from "lucide-react";
import TopNav from "@/components/TopNav";
import QuizModeSelector from "@/components/quiz/QuizModeSelector";
import { historyQuestions } from "@/lib/quiz-content";
import { topics } from "@/lib/topics";

export default function QuizPage() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug;
  const topic = topics.find((t) => t.slug === slug);

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

  return (
    <div className="min-h-screen bg-[var(--bg-base)] text-[var(--text-primary)]">
      <TopNav />

      <main className="mx-auto max-w-[960px] px-4 pt-12 pb-[120px] sm:px-6">
        {/* Back link */}
        <Link
          href={`/topics/${slug}`}
          className="inline-flex items-center gap-1.5 text-sm text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]"
        >
          <ArrowLeft size={14} />
          The Filtrona Story
        </Link>

        <div className="mt-6">
          <QuizModeSelector questions={historyQuestions} topicSlug="history" />
        </div>
      </main>
    </div>
  );
}
