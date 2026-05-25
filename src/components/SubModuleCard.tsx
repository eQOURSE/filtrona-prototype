"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Presentation,
  Sparkles,
  Play,
  Network,
  Layers2,
  Headphones,
  Box,
  MessageCircle,
  CheckCircle2,
  Lock,
  Clock,
} from "lucide-react";
import { SubModule } from "@/lib/sub-modules";
import { useProgressStore } from "@/lib/progress-store";

/* ── Icon mapping ──────────────────────────────────────────────── */
const iconMap: Record<string, React.ComponentType<{ size?: number; strokeWidth?: number; className?: string; style?: React.CSSProperties }>> = {
  Presentation,
  Sparkles,
  Play,
  Network,
  Layers2,
  Headphones,
  Box,
  MessageCircle,
};

/* ── Accent styling ────────────────────────────────────────────── */
const accentStyles = {
  mint: {
    color: "var(--accent-mint)",
    softBg: "var(--accent-mint-soft)",
    glowClass: "group-hover:shadow-[0_0_20px_color-mix(in_srgb,var(--accent-mint)_18%,transparent)]",
  },
  violet: {
    color: "var(--accent-violet)",
    softBg: "var(--accent-violet-soft)",
    glowClass: "group-hover:shadow-[0_0_20px_color-mix(in_srgb,var(--accent-violet)_18%,transparent)]",
  },
  orange: {
    color: "var(--accent-orange)",
    softBg: "var(--accent-orange-soft)",
    glowClass: "group-hover:shadow-[0_0_20px_color-mix(in_srgb,var(--accent-orange)_18%,transparent)]",
  },
  blue: {
    color: "var(--accent-blue)",
    softBg: "var(--accent-blue-soft)",
    glowClass: "group-hover:shadow-[0_0_20px_color-mix(in_srgb,var(--accent-blue)_18%,transparent)]",
  },
};

interface SubModuleCardProps {
  topicSlug: string;
  subModule: SubModule;
}

export default function SubModuleCard({ topicSlug, subModule }: SubModuleCardProps) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const isCompleteCheck = useProgressStore((s) => s.isComplete);

  useEffect(() => setMounted(true), []);

  const IconComponent = iconMap[subModule.icon] || Presentation;
  const accent = accentStyles[subModule.accent];
  const completed = mounted ? isCompleteCheck(topicSlug, subModule.id) : false;

  const handleClick = () => {
    if (subModule.available) {
      router.push(`/topics/${topicSlug}/${subModule.id}`);
    }
  };

  // ── Unavailable state ─────────────────────────────────────────
  if (!subModule.available) {
    return (
      <div
        className="relative flex w-full flex-col justify-between rounded-2xl border border-[var(--border-default)] bg-[var(--bg-surface)] p-[22px] opacity-50 cursor-not-allowed select-none"
        style={{ aspectRatio: "1.15", minHeight: "180px" }}
        role="presentation"
        aria-disabled="true"
      >
        <span className="sr-only">Coming next: {subModule.title}</span>

        {/* Top row */}
        <div className="flex w-full items-start justify-between">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-lg"
            style={{ backgroundColor: accent.softBg }}
          >
            <IconComponent size={22} className="shrink-0" style={{ color: accent.color }} strokeWidth={2} />
          </div>
          <Lock size={18} className="text-[var(--text-muted)]" />
        </div>

        {/* Info */}
        <div className="mt-4 flex-1">
          <h3 className="text-[17px] font-semibold text-[var(--text-primary)]">
            {subModule.title}
          </h3>
          <p className="mt-1.5 line-clamp-2 text-[13px] leading-[1.5] text-[var(--text-secondary)]">
            {subModule.description}
          </p>
        </div>

        {/* Bottom row */}
        <div className="mt-4 flex items-center gap-2">
          {subModule.estimatedMinutes > 0 && (
            <div className="flex items-center gap-1.5 rounded-full bg-[var(--bg-elevated)] px-3 py-0.5 text-[11px] font-medium text-[var(--text-muted)]">
              <Clock size={11} />
              <span>{subModule.estimatedMinutes} min</span>
            </div>
          )}
          <span className="rounded-full border border-[var(--border-default)] px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">
            Coming next
          </span>
        </div>
      </div>
    );
  }

  // ── Available / Complete state ─────────────────────────────────
  return (
    <button
      onClick={handleClick}
      className={`group relative flex w-full flex-col justify-between rounded-2xl border bg-[var(--bg-surface)] p-[22px] transition-all duration-300 ease-[0.16,1,0.3,1] hover:-translate-y-[3px] hover:bg-[var(--bg-elevated)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-mint)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-base)] cursor-pointer text-left ${
        completed
          ? "border-[var(--accent-mint)]"
          : "border-[var(--border-default)] hover:border-[color-mix(in_srgb,var(--accent-mint)_25%,transparent)]"
      }`}
      style={{ aspectRatio: "1.15", minHeight: "180px" }}
      aria-label={`${subModule.title}${completed ? " — Completed" : ""}. Click to ${completed ? "revisit" : "start"}.`}
    >
      {/* Top row */}
      <div className="flex w-full items-start justify-between">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-lg transition-all duration-300 ${accent.glowClass}`}
          style={{ backgroundColor: accent.softBg }}
        >
          <IconComponent size={22} className="shrink-0" style={{ color: accent.color }} strokeWidth={2} />
        </div>
        {completed ? (
          <CheckCircle2 size={22} className="text-[var(--accent-mint)]" />
        ) : (
          /* Empty progress ring placeholder */
          <svg width="22" height="22" viewBox="0 0 22 22" aria-hidden="true">
            <circle
              cx="11"
              cy="11"
              r="9"
              stroke="var(--text-muted)"
              strokeWidth="1.5"
              fill="none"
              opacity="0.5"
            />
          </svg>
        )}
      </div>

      {/* Info */}
      <div className="mt-4 flex-1">
        <h3 className="text-[17px] font-semibold text-[var(--text-primary)]">
          {subModule.title}
        </h3>
        <p className="mt-1.5 line-clamp-2 text-[13px] leading-[1.5] text-[var(--text-secondary)]">
          {subModule.description}
        </p>
      </div>

      {/* Bottom row */}
      <div className="mt-4 flex items-center gap-2">
        {subModule.estimatedMinutes > 0 && (
          <div className="flex items-center gap-1.5 rounded-full bg-[var(--bg-elevated)] px-3 py-0.5 text-[11px] font-medium text-[var(--text-muted)]">
            <Clock size={11} />
            <span>{subModule.estimatedMinutes} min</span>
          </div>
        )}
        {subModule.estimatedMinutes === 0 && (
          <div className="flex items-center gap-1.5 rounded-full bg-[var(--bg-elevated)] px-3 py-0.5 text-[11px] font-medium text-[var(--text-muted)]">
            <span>Open-ended</span>
          </div>
        )}
      </div>
    </button>
  );
}
