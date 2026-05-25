"use client";

import { useRouter } from "next/navigation";
import { BookOpen, Layers, Atom, Flame, Leaf, TrendingUp, Grid3x3, Clock, Lock } from "lucide-react";
import { Topic } from "@/lib/topics";

/* ── Icon mapping for safe Lucide usage ──────────────────────── */
const iconMap = {
  BookOpen,
  Layers,
  Atom,
  Flame,
  Leaf,
  TrendingUp,
};

/* ── Color mapping for themes ────────────────────────────────── */
const accentMap = {
  mint: {
    hex: "var(--accent-mint)",
    bg: "var(--accent-mint-soft)",
    borderHoverClass: "hover:border-[color-mix(in_srgb,var(--accent-mint)_25%,transparent)]",
    glowClass: "group-hover:shadow-[0_0_24px_color-mix(in_srgb,var(--accent-mint)_20%,transparent)]",
  },
  violet: {
    hex: "var(--accent-violet)",
    bg: "var(--accent-violet-soft)",
    borderHoverClass: "hover:border-[color-mix(in_srgb,var(--accent-violet)_25%,transparent)]",
    glowClass: "group-hover:shadow-[0_0_24px_color-mix(in_srgb,var(--accent-violet)_20%,transparent)]",
  },
  blue: {
    hex: "var(--accent-blue)",
    bg: "var(--accent-blue-soft)",
    borderHoverClass: "hover:border-[color-mix(in_srgb,var(--accent-blue)_25%,transparent)]",
    glowClass: "group-hover:shadow-[0_0_24px_color-mix(in_srgb,var(--accent-blue)_20%,transparent)]",
  },
  orange: {
    hex: "var(--accent-orange)",
    bg: "var(--accent-orange-soft)",
    borderHoverClass: "hover:border-[color-mix(in_srgb,var(--accent-orange)_25%,transparent)]",
    glowClass: "group-hover:shadow-[0_0_24px_color-mix(in_srgb,var(--accent-orange)_20%,transparent)]",
  },
};

interface TopicCardProps {
  topic: Topic;
}

export default function TopicCard({ topic }: TopicCardProps) {
  const router = useRouter();
  const theme = accentMap[topic.accent];
  const IconComponent = iconMap[topic.icon as keyof typeof iconMap] || BookOpen;

  const handleClick = () => {
    if (topic.unlocked) {
      router.push(`/topics/${topic.slug}`);
    }
  };

  // SVG Progress ring geometry
  const radius = 12;
  const strokeWidth = 2.5;

  if (topic.unlocked) {
    return (
      <button
        onClick={handleClick}
        className={`group flex min-h-[240px] w-full flex-col justify-between rounded-2xl border border-[var(--border-default)] bg-[var(--bg-surface)] p-5 md:p-7 transition-all duration-300 ease-[0.16,1,0.3,1] hover:-translate-y-1 hover:bg-[var(--bg-elevated)] ${theme.borderHoverClass} focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-mint)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-base)] cursor-pointer`}
        aria-label={`Topic: ${topic.title}. Unlocked. Click to start learning.`}
      >
        {/* Top row */}
        <div className="flex w-full items-start justify-between">
          <div
            className={`flex h-12 w-12 items-center justify-center rounded-xl transition-all duration-300 ${theme.glowClass}`}
            style={{ backgroundColor: theme.bg }}
          >
            <IconComponent size={28} stroke={theme.hex} strokeWidth={2} />
          </div>
          {/* Progress Ring (0%) */}
          <div className="h-8 w-8" aria-hidden="true">
            <svg width="32" height="32" viewBox="0 0 32 32" className="rotate-[-90deg]">
              <circle
                cx="16"
                cy="16"
                r={radius}
                stroke="var(--border-default)"
                strokeWidth={strokeWidth}
                fill="none"
              />
            </svg>
          </div>
        </div>

        {/* Info */}
        <div className="mt-6 flex-1 text-left">
          <h2 className="text-[22px] font-semibold tracking-tight text-[var(--text-primary)]">
            {topic.title}
          </h2>
          <p className="mt-2.5 line-clamp-2 text-sm leading-relaxed text-[var(--text-secondary)]">
            {topic.description}
          </p>
        </div>

        {/* Bottom row pills */}
        <div className="mt-6 flex items-center gap-2">
          <div className="flex items-center gap-1.5 rounded-full bg-[var(--bg-elevated)] px-3.5 py-1 text-xs font-medium text-[var(--text-muted)]">
            <Grid3x3 size={13} />
            <span>{topic.subModules} modules</span>
          </div>
          <div className="flex items-center gap-1.5 rounded-full bg-[var(--bg-elevated)] px-3.5 py-1 text-xs font-medium text-[var(--text-muted)]">
            <Clock size={13} />
            <span>{topic.estimatedMinutes} min</span>
          </div>
        </div>
      </button>
    );
  }

  // Locked State
  return (
    <div
      className="group relative flex min-h-[240px] w-full flex-col justify-between rounded-2xl border border-[var(--border-default)] bg-[var(--bg-surface)] p-5 md:p-7 opacity-50 cursor-not-allowed select-none"
      role="presentation"
      aria-disabled="true"
    >
      <span className="sr-only">Locked — coming soon: {topic.title}</span>

      {/* Top row */}
      <div className="flex w-full items-start justify-between">
        <div
          className="flex h-12 w-12 items-center justify-center rounded-xl"
          style={{ backgroundColor: theme.bg }}
        >
          <IconComponent size={28} stroke={theme.hex} strokeWidth={2} />
        </div>
        <div className="flex h-8 w-8 items-center justify-center text-[var(--text-muted)]">
          <Lock size={16} />
        </div>
      </div>

      {/* Info */}
      <div className="mt-6 flex-1 text-left">
        <h2 className="text-[22px] font-semibold tracking-tight text-[var(--text-primary)]">
          {topic.title}
        </h2>
        <p className="mt-2.5 line-clamp-2 text-sm leading-relaxed text-[var(--text-secondary)]">
          {topic.description}
        </p>
      </div>

      {/* Bottom row pills */}
      <div className="mt-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 rounded-full bg-[var(--bg-elevated)] px-3.5 py-1 text-xs font-medium text-[var(--text-muted)]">
            <Grid3x3 size={13} />
            <span>{topic.subModules} modules</span>
          </div>
          <div className="flex items-center gap-1.5 rounded-full bg-[var(--bg-elevated)] px-3.5 py-1 text-xs font-medium text-[var(--text-muted)]">
            <Clock size={13} />
            <span>{topic.estimatedMinutes} min</span>
          </div>
        </div>
        <span className="rounded-full border border-[var(--border-default)] px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">
          Coming soon
        </span>
      </div>
    </div>
  );
}
