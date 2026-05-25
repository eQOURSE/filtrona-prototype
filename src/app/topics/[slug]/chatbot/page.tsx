"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, MessageCircle } from "lucide-react";
import TopNav from "@/components/TopNav";
import ChatInterface from "@/components/chat/ChatInterface";
import { topics } from "@/lib/topics";

export default function ChatbotPage() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug;

  // Only history has a knowledge base in the prototype — show the same
  // placeholder pattern used elsewhere for non-history topics.
  if (slug !== "history") {
    return <NonHistoryPlaceholder slug={slug} />;
  }

  const topic = topics.find((t) => t.slug === slug);
  const topicTitle = topic?.title ?? "The Filtrona Story";

  return (
    <div className="min-h-screen bg-[var(--bg-base)] text-[var(--text-primary)]">
      <TopNav />

      <main
        className="mx-auto flex max-w-[880px] flex-col px-6 pt-8 pb-6"
        style={{ minHeight: "calc(100vh - 72px)" }}
      >
        {/* Header — natural height, fixed */}
        <header className="flex-shrink-0">
          <Link
            href={`/topics/${slug}`}
            className="inline-flex items-center gap-1.5 text-sm text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]"
          >
            <ArrowLeft size={14} />
            {topicTitle}
          </Link>

          <div
            className="mt-4 inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em]"
            style={{
              backgroundColor: "var(--accent-blue-soft)",
              borderColor:
                "color-mix(in srgb, var(--accent-blue) 30%, transparent)",
              color: "var(--accent-blue)",
            }}
          >
            08 · ASK THE COACH
          </div>

          <h1 className="mt-3 text-[28px] font-bold tracking-[-0.02em] text-[var(--text-primary)] md:text-[36px]">
            Ask the Coach
          </h1>

          <p className="mt-2 text-[15px] leading-[1.5] text-[var(--text-secondary)] md:text-[16px]">
            An AI tutor briefed on everything in The Filtrona Story. Ask
            anything.
          </p>
        </header>

        {/* Chat area — fills remaining vertical space */}
        <div
          className="mt-8 flex flex-1 flex-col"
          style={{ minHeight: "500px" }}
        >
          <ChatInterface topicSlug="history" />
        </div>
      </main>
    </div>
  );
}

/* ── Placeholder for non-history topics ────────────────────────── */
function NonHistoryPlaceholder({ slug }: { slug: string }) {
  const topic = topics.find((t) => t.slug === slug);
  const isFilterTypes = slug === "filter-types";
  const topicTitle = topic?.title ?? "Topic";

  const iconColor = isFilterTypes
    ? "var(--accent-orange)"
    : "var(--accent-blue)";

  const pillLabel = isFilterTypes
    ? "ASK THE COACH · IN PROGRESS"
    : "COMING NEXT";
  const pillTextColor = isFilterTypes
    ? "var(--accent-orange)"
    : "var(--text-muted)";
  const pillBg = isFilterTypes
    ? "var(--accent-orange-soft)"
    : "var(--bg-elevated)";
  const pillBorder = isFilterTypes
    ? "color-mix(in srgb, var(--accent-orange) 30%, transparent)"
    : "var(--border-default)";

  const headingText = isFilterTypes
    ? "Ask the Coach — Filter Types"
    : "Ask the Coach";

  const bodyText = isFilterTypes
    ? "We're applying the same module structure to Filter Types & Performance — CPS, COR, Coaxial Core, Corinthian, and Vortex each get their own deep-dive. Demo today covers The Filtrona Story end-to-end as the reference build."
    : "This sub-module is part of Filtrona Academy's full release. The prototype focuses on The Filtrona Story to demonstrate the complete learning loop.";

  return (
    <div className="min-h-screen bg-[var(--bg-base)] text-[var(--text-primary)]">
      <TopNav />
      <main className="flex min-h-[calc(100vh-72px)] flex-col items-center justify-center px-6 py-16 text-center">
        <div
          className="flex h-[88px] w-[88px] items-center justify-center rounded-2xl"
          style={{
            backgroundColor: `color-mix(in srgb, ${iconColor} 14%, transparent)`,
          }}
        >
          <MessageCircle size={56} strokeWidth={1.75} style={{ color: iconColor }} />
        </div>

        <div
          className="mt-6 inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em]"
          style={{
            backgroundColor: pillBg,
            borderColor: pillBorder,
            color: pillTextColor,
          }}
        >
          {pillLabel}
        </div>

        <h1 className="mt-4 text-[28px] font-bold tracking-[-0.01em] text-[var(--text-primary)] md:text-[36px]">
          {headingText}
        </h1>

        <p className="mt-3 max-w-[520px] text-[15px] leading-[1.65] text-[var(--text-secondary)]">
          {bodyText}
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
          {isFilterTypes ? (
            <>
              <Link
                href="/topics/history"
                className="inline-flex items-center gap-2 rounded-xl border border-[var(--border-default)] bg-[var(--bg-surface)] px-4 py-2.5 text-[14px] font-medium text-[var(--text-primary)] transition-all duration-200 hover:-translate-y-px hover:border-[color-mix(in_srgb,var(--accent-mint)_40%,transparent)] hover:bg-[var(--bg-elevated)]"
              >
                ← The Filtrona Story
              </Link>
              <Link
                href="/topics"
                className="text-[14px] font-medium text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)] hover:underline"
              >
                All topics
              </Link>
            </>
          ) : (
            <>
              <Link
                href={`/topics/${slug}`}
                className="inline-flex items-center gap-2 rounded-xl border border-[var(--border-default)] bg-[var(--bg-surface)] px-4 py-2.5 text-[14px] font-medium text-[var(--text-primary)] transition-all duration-200 hover:-translate-y-px hover:border-[color-mix(in_srgb,var(--accent-mint)_40%,transparent)] hover:bg-[var(--bg-elevated)]"
              >
                ← {topicTitle}
              </Link>
              <Link
                href="/topics"
                className="text-[14px] font-medium text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)] hover:underline"
              >
                All topics
              </Link>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
