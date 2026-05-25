"use client";

import Link from "next/link";
import TopNav from "@/components/TopNav";
import { topics } from "@/lib/topics";
import {
  Play,
  Network,
  Headphones,
  Box,
  type LucideIcon,
} from "lucide-react";

type SubKind = "video" | "mindmap" | "audio" | "gallery";

const ICON: Record<SubKind, LucideIcon> = {
  video: Play,
  mindmap: Network,
  audio: Headphones,
  gallery: Box,
};

const TITLE: Record<SubKind, string> = {
  video: "Related Video",
  mindmap: "Mind Map",
  audio: "Audio Overview",
  gallery: "Gallery",
};

interface Props {
  slug: string;
  kind: SubKind;
}

/**
 * Reused for /topics/{!history}/{video|mindmap|audio|gallery}.
 * Mirrors the styling of the [subModule] placeholder.
 */
export default function NonHistoryPlaceholder({ slug, kind }: Props) {
  const topic = topics.find((t) => t.slug === slug);
  const isFilterTypes = slug === "filter-types";
  const topicTitle = topic?.title ?? "Topic";
  const subTitle = TITLE[kind];
  const Icon = ICON[kind];

  const iconColor = isFilterTypes
    ? "var(--accent-orange)"
    : "var(--accent-blue)";
  const pillLabel = isFilterTypes
    ? `${subTitle.toUpperCase()} · IN PROGRESS`
    : "COMING NEXT";
  const pillColor = isFilterTypes
    ? "var(--accent-orange)"
    : "var(--text-muted)";
  const pillBg = isFilterTypes
    ? "var(--accent-orange-soft)"
    : "var(--bg-elevated)";
  const pillBorder = isFilterTypes
    ? "color-mix(in srgb, var(--accent-orange) 30%, transparent)"
    : "var(--border-default)";

  const headingText = isFilterTypes
    ? `${subTitle} — Filter Types`
    : subTitle;
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
          <Icon size={56} strokeWidth={1.75} style={{ color: iconColor }} />
        </div>

        <div
          className="mt-6 inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em]"
          style={{
            backgroundColor: pillBg,
            borderColor: pillBorder,
            color: pillColor,
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
