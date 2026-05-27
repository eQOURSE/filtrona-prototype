"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, MessageCircle } from "lucide-react";
import TopNav from "@/components/TopNav";
import ChatInterface from "@/components/chat/ChatInterface";
import { topics } from "@/lib/topics";
import { KNOWLEDGE_BY_TOPIC } from "@/lib/chatbot-knowledge";

export default function ChatbotPage() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug;

  // Show the real chatbot for any topic that has a knowledge base
  const hasKnowledge = slug in KNOWLEDGE_BY_TOPIC;

  if (!hasKnowledge) {
    return <NonHistoryPlaceholder slug={slug} />;
  }

  const topic = topics.find((t) => t.slug === slug);
  const topicTitle = topic?.title ?? "Topic";

  return (
    <div className="min-h-screen  text-[var(--text-primary)]">
      <TopNav />

      <main
        className="mx-auto flex max-w-[880px] flex-col px-6 pt-8 pb-6"
        style={{ minHeight: "calc(100vh - 72px)" }}
      >
        {/* Header — natural height, fixed */}
        <header className="flex-shrink-0 pt-10">
          <Link
            href={`/topics/${slug}`}
            className="inline-flex items-center gap-1.5 text-sm text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]"
          >
            <ArrowLeft size={14} />
            {topicTitle}
          </Link>

          <div
            className="mt-4 inline-block rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wider"
            style={{ backgroundColor: "var(--accent-blue-soft)", color: "var(--accent-blue)" }}
          >
            08 · Chatbot
          </div>

          <h1 className="mt-3 text-[32px] font-bold tracking-[-0.02em] text-[var(--text-primary)] sm:text-[40px]">
            Ask the Coach
          </h1>
          <p className="mt-2 text-[15px] text-[var(--text-secondary)] sm:text-[16px]">
            An AI tutor briefed on everything in {topicTitle}.
          </p>
        </header>

        {/* Chat area — fills remaining vertical space */}
        <div
          className="mt-8 flex flex-1 flex-col"
          style={{ minHeight: "500px" }}
        >
          <ChatInterface topicSlug={slug} />
        </div>
      </main>
    </div>
  );
}

/* ── Placeholder for locked topics ────────────────────────── */
function NonHistoryPlaceholder({ slug }: { slug: string }) {
  const topic = topics.find((t) => t.slug === slug);
  const topicTitle = topic?.title ?? "Topic";

  return (
    <div className="min-h-screen  text-[var(--text-primary)]">
      <TopNav />
      <main className="flex min-h-[calc(100vh-72px)] flex-col items-center justify-center px-6 py-16 text-center">
        <div
          className="flex h-[88px] w-[88px] items-center justify-center rounded-2xl"
          style={{
            backgroundColor: "color-mix(in srgb, var(--accent-blue) 14%, transparent)",
          }}
        >
          <MessageCircle size={56} strokeWidth={1.75} style={{ color: "var(--accent-blue)" }} />
        </div>

        <div
          className="mt-6 inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em]"
          style={{
            backgroundColor: "var(--bg-elevated)",
            borderColor: "var(--border-default)",
            color: "var(--text-muted)",
          }}
        >
          COMING NEXT
        </div>

        <h1 className="mt-4 text-[28px] font-bold tracking-[-0.01em] text-[var(--text-primary)] md:text-[36px]">
          Ask the Coach
        </h1>

        <p className="mt-3 max-w-[520px] text-[15px] leading-[1.65] text-[var(--text-secondary)]">
          This sub-module is part of Filtrona Academy&apos;s full release. The prototype focuses on Filter Types &amp; Performance to demonstrate the complete learning loop.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
          <Link
            href={`/topics/${slug}`}
            className="inline-flex items-center gap-2 rounded-xl border border-[var(--border-default)] bg-[var(--bg-surface)] px-4 py-2.5 text-[14px] font-medium text-[var(--text-primary)] transition-all duration-200 hover:-translate-y-px hover:border-[color-mix(in_srgb,var(--accent-blue)_40%,transparent)] hover:bg-[var(--bg-elevated)]"
          >
            ← {topicTitle}
          </Link>
          <Link
            href="/topics"
            className="text-[14px] font-medium text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)] hover:underline"
          >
            All topics
          </Link>
        </div>
      </main>
    </div>
  );
}
