"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

type Accent = "blue" | "navy" | "green" | "sky";

interface Props {
  topicSlug: string;
  topicTitle: string;
  accent: Accent;
  pillLabel: string;
  title: string;
  subtitle: string;
}

const accentColor: Record<Accent, string> = {
  blue: "var(--accent-blue)",
  navy: "var(--accent-navy)",
  green: "var(--accent-green)",
  sky: "var(--accent-sky)",
};

const accentSoft: Record<Accent, string> = {
  blue: "var(--accent-blue-soft)",
  navy: "var(--accent-navy-soft)",
  green: "var(--accent-green-soft)",
  sky: "var(--accent-sky-soft)",
};

export default function SubModuleHeader({
  topicSlug,
  topicTitle,
  accent,
  pillLabel,
  title,
  subtitle,
}: Props) {
  return (
    <header>
      <Link
        href={`/topics/${topicSlug}`}
        className="inline-flex items-center gap-1.5 text-sm text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]"
      >
        <ArrowLeft size={14} />
        {topicTitle}
      </Link>

      <div
        className="mt-4 inline-block rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em]"
        style={{
          backgroundColor: accentSoft[accent],
          color: accentColor[accent],
        }}
      >
        {pillLabel}
      </div>

      <h1 className="mt-3 text-[32px] font-bold tracking-[-0.02em] text-[var(--text-primary)] sm:text-[40px]">
        {title}
      </h1>

      <p className="mt-2 text-[15px] leading-[1.55] text-[var(--text-secondary)] sm:text-[16px]">
        {subtitle}
      </p>
    </header>
  );
}
