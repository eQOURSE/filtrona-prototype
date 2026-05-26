"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import TopNav from "@/components/TopNav";
import { getQuestions } from "@/lib/quiz-content";
import { useProgressStore } from "@/lib/progress-store";
import { topics } from "@/lib/topics";
import QuizModeSelector from "@/components/quiz/QuizModeSelector";

export default function QuizPage() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug;
  const topic = topics.find((t) => t.slug === slug);
  const topicTitle = topic?.title ?? "Topic";

  const questions = getQuestions(slug);
  const isComplete = useProgressStore((state) => state.isComplete);
  const markComplete = useProgressStore((state) => state.markComplete);

  return (
    <div className="min-h-screen  text-[var(--text-primary)]">
      <TopNav />

      <main className="mx-auto max-w-[960px] px-4 pt-12 pb-[120px] sm:px-6">
        <header>
          <Link
            href={`/topics/${slug}`}
            className="inline-flex items-center gap-1.5 text-sm text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]"
          >
            <ArrowLeft size={14} />
            {topicTitle}
          </Link>
        </header>

        <div className="mt-6">
          <QuizModeSelector questions={questions} topicSlug={slug} />
        </div>
      </main>
    </div>
  );
}
