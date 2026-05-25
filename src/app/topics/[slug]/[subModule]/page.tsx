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
  Lock,
} from "lucide-react";
import TopNav from "@/components/TopNav";
import { subModules } from "@/lib/sub-modules";
import { topics } from "@/lib/topics";

/* ── Icon mapping ──────────────────────────────────────────────── */
const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string; style?: React.CSSProperties }>> = {
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

  // If the sub-module isn't recognized, show a generic message
  const title = subModule?.title ?? subModuleId;
  const description = subModule?.description ?? "This sub-module is not available yet.";
  const iconName = subModule?.icon ?? "Presentation";
  const accent = subModule?.accent ?? "mint";
  const IconComponent = iconMap[iconName] || Presentation;
  const color = accentColors[accent];

  const topicTitle = topic?.title ?? "Topic";
  const backHref = `/topics/${slug}`;

  return (
    <div className="min-h-screen bg-[var(--bg-base)] text-[var(--text-primary)]">
      <TopNav />

      <main className="flex min-h-[calc(100vh-72px)] flex-col items-center justify-center px-8 text-center">
        {/* Large icon */}
        <div
          className="flex h-20 w-20 items-center justify-center rounded-2xl"
          style={{ backgroundColor: `color-mix(in srgb, ${color} 12%, transparent)` }}
        >
          <IconComponent size={40} className="opacity-60" style={{ color }} />
        </div>

        {/* Lock badge */}
        <div className="mt-5 flex items-center gap-2 text-[var(--text-muted)]">
          <Lock size={14} />
          <span className="text-[13px] font-semibold uppercase tracking-wider">
            Coming soon
          </span>
        </div>

        {/* Title */}
        <h1 className="mt-4 text-[28px] font-bold text-[var(--text-primary)] md:text-[36px]">
          {title}
        </h1>

        {/* Description */}
        <p className="mt-3 max-w-[480px] text-[15px] leading-relaxed text-[var(--text-secondary)]">
          {description} This experience is being built for the next version of
          Filtrona Academy.
        </p>

        {/* Back link */}
        <Link
          href={backHref}
          className="mt-8 text-sm font-medium text-[var(--accent-mint)] transition-colors hover:underline"
        >
          ← Back to {topicTitle}
        </Link>
      </main>
    </div>
  );
}
