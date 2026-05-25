"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import {
  Sparkles,
  Play,
  Network,
  Layers2,
  Headphones,
  Box,
  MessageCircle,
  Presentation,
} from "lucide-react";
import TopNav from "@/components/TopNav";
import { subModules } from "@/lib/sub-modules";
import { topics } from "@/lib/topics";

/* ── Icon mapping ──────────────────────────────────────────────── */
const iconMap: Record<
  string,
  React.ComponentType<{
    size?: number;
    className?: string;
    style?: React.CSSProperties;
    strokeWidth?: number;
  }>
> = {
  Presentation,
  Sparkles,
  Play,
  Network,
  Layers2,
  Headphones,
  Box,
  MessageCircle,
};

const accentColors: Record<string, string> = {
  mint: "var(--accent-mint)",
  violet: "var(--accent-violet)",
  orange: "var(--accent-orange)",
  blue: "var(--accent-blue)",
};

export default function SubModulePlaceholder() {
  const params = useParams<{ slug: string; subModule: string }>();
  const slug = params.slug;
  const subModuleId = params.subModule;

  const topic = topics.find((t) => t.slug === slug);
  const subModule = subModules.find((sm) => sm.id === subModuleId);

  // Resolve display values (fallback gracefully if sub-module slug is unknown)
  const title = subModule?.title ?? subModuleId;
  const iconName = subModule?.icon ?? "Presentation";
  const accent = subModule?.accent ?? "mint";
  const IconComponent = iconMap[iconName] || Presentation;

  // Filter Types is intentional scope, not missing work
  const isFilterTypes = slug === "filter-types";

  // Use orange accent for in-progress (Filter Types), the sub-module accent otherwise
  const iconColor = isFilterTypes ? accentColors.orange : accentColors[accent];

  // Pill style and label
  const pillLabel = isFilterTypes
    ? `${title.toUpperCase()} · IN PROGRESS`
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

  // Title and body
  const headingText = isFilterTypes
    ? `${title} — Filter Types`
    : title;

  const bodyText = isFilterTypes
    ? "We're applying the same module structure to Filter Types & Performance — CPS, COR, Coaxial Core, Corinthian, and Vortex each get their own deep-dive. Demo today covers The Filtrona Story end-to-end as the reference build."
    : "This sub-module is part of Filtrona Academy's full release. The prototype focuses on The Filtrona Story to demonstrate the complete learning loop.";

  const topicTitle = topic?.title ?? "Topic";

  return (
    <div className="min-h-screen bg-[var(--bg-base)] text-[var(--text-primary)]">
      <TopNav />

      <main className="flex min-h-[calc(100vh-72px)] flex-col items-center justify-center px-6 py-16 text-center">
        {/* Centered card */}
        <div className="flex flex-col items-center">
          {/* Icon — 56px, accent color */}
          <div
            className="flex h-[88px] w-[88px] items-center justify-center rounded-2xl"
            style={{
              backgroundColor: `color-mix(in srgb, ${iconColor} 14%, transparent)`,
            }}
          >
            <IconComponent
              size={56}
              strokeWidth={1.75}
              style={{ color: iconColor }}
            />
          </div>

          {/* Pill */}
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

          {/* Title */}
          <h1 className="mt-4 text-[28px] font-bold tracking-[-0.01em] text-[var(--text-primary)] md:text-[36px]">
            {headingText}
          </h1>

          {/* Body */}
          <p className="mt-3 max-w-[520px] text-[15px] leading-[1.65] text-[var(--text-secondary)]">
            {bodyText}
          </p>

          {/* CTA row */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
            {isFilterTypes ? (
              <>
                <Link
                  href="/topics/history"
                  className="inline-flex items-center gap-2 rounded-xl border border-[var(--border-default)] bg-[var(--bg-surface)] px-4 py-2.5 text-[14px] font-medium text-[var(--text-primary)] transition-all duration-200 hover:-translate-y-px hover:border-[color-mix(in_srgb,var(--accent-mint)_40%,transparent)] hover:bg-[var(--bg-elevated)]"
                >
                  <span>← The Filtrona Story</span>
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
                  <span>← {topicTitle}</span>
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
        </div>
      </main>
    </div>
  );
}
