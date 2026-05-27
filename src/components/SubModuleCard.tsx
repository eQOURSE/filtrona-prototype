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
  ArrowRight,
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

/* ── Rich gradient themes per accent ─────────────────────────── */
const accentStyles = {
  blue: {
    gradient: "linear-gradient(145deg, #188ece 0%, #1270A8 60%, #0D5A8C 100%)",
    iconBg: "rgba(255,255,255,0.20)",
    patternColor: "rgba(255,255,255,0.07)",
    pillBg: "rgba(255,255,255,0.15)",
    shadow: "0 6px 24px rgba(24, 142, 206, 0.25)",
    hoverShadow: "0 14px 44px rgba(24, 142, 206, 0.40)",
    completedRing: "rgba(138, 189, 64, 0.9)",
  },
  navy: {
    gradient: "linear-gradient(145deg, #1B4B8E 0%, #163D73 60%, #102E5A 100%)",
    iconBg: "rgba(255,255,255,0.16)",
    patternColor: "rgba(255,255,255,0.06)",
    pillBg: "rgba(255,255,255,0.12)",
    shadow: "0 6px 24px rgba(27, 75, 142, 0.25)",
    hoverShadow: "0 14px 44px rgba(27, 75, 142, 0.40)",
    completedRing: "rgba(138, 189, 64, 0.9)",
  },
  green: {
    gradient: "linear-gradient(145deg, #8abd40 0%, #72A030 60%, #5C8525 100%)",
    iconBg: "rgba(255,255,255,0.22)",
    patternColor: "rgba(255,255,255,0.08)",
    pillBg: "rgba(255,255,255,0.16)",
    shadow: "0 6px 24px rgba(138, 189, 64, 0.22)",
    hoverShadow: "0 14px 44px rgba(138, 189, 64, 0.38)",
    completedRing: "rgba(24, 142, 206, 0.9)",
  },
  sky: {
    gradient: "linear-gradient(145deg, #2BA5E0 0%, #1E90CC 60%, #1478B0 100%)",
    iconBg: "rgba(255,255,255,0.20)",
    patternColor: "rgba(255,255,255,0.07)",
    pillBg: "rgba(255,255,255,0.15)",
    shadow: "0 6px 24px rgba(24, 142, 206, 0.22)",
    hoverShadow: "0 14px 44px rgba(24, 142, 206, 0.38)",
    completedRing: "rgba(138, 189, 64, 0.9)",
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
        className="relative flex w-full flex-col justify-between overflow-hidden rounded-2xl p-5 cursor-not-allowed select-none"
        style={{
          aspectRatio: "1.05",
          minHeight: "190px",
          background: "linear-gradient(145deg, #D8D8D5 0%, #C8C8C5 60%, #BCBCB9 100%)",
          boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
        }}
        role="presentation"
        aria-disabled="true"
      >
        <span className="sr-only">Coming next: {subModule.title}</span>

        {/* Decorative circle */}
        <div className="pointer-events-none absolute -top-8 -right-8 h-[100px] w-[100px] rounded-full bg-white/[0.06]" />

        {/* Icon */}
        <div className="relative flex items-start justify-between">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/[0.14]">
            <IconComponent size={22} className="shrink-0 text-white/50" strokeWidth={2} />
          </div>
          <Lock size={16} className="text-white/40 mt-1" />
        </div>

        {/* Info */}
        <div className="relative mt-auto">
          <h3 className="text-[16px] font-semibold text-white/60 leading-tight">
            {subModule.title}
          </h3>
          <p className="mt-1.5 line-clamp-2 text-[12px] leading-[1.5] text-white/40">
            {subModule.description}
          </p>

          {/* Bottom row */}
          <div className="mt-3 flex items-center gap-2">
            {subModule.estimatedMinutes > 0 && (
              <div className="flex items-center gap-1 rounded-full bg-white/[0.10] px-2.5 py-0.5 text-[10px] font-medium text-white/50">
                <Clock size={10} />
                <span>{subModule.estimatedMinutes} min</span>
              </div>
            )}
            <span className="rounded-full bg-white/[0.08] px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white/45">
              Coming next
            </span>
          </div>
        </div>
      </div>
    );
  }

  // ── Available / Complete state ─────────────────────────────────
  return (
    <button
      onClick={handleClick}
      className="group relative flex w-full flex-col justify-between overflow-hidden rounded-2xl p-5 transition-all duration-500 ease-[0.16,1,0.3,1] hover:-translate-y-[5px] hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-base)] cursor-pointer text-left"
      style={{
        aspectRatio: "1.05",
        minHeight: "190px",
        background: accent.gradient,
        boxShadow: accent.shadow,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = accent.hoverShadow;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = accent.shadow;
      }}
      aria-label={`${subModule.title}${completed ? " — Completed" : ""}. Click to ${completed ? "revisit" : "start"}.`}
    >
      {/* ── Decorative shapes ──────────────────────────────── */}
      {/* Circle top-right */}
      <div
        className="pointer-events-none absolute -top-10 -right-10 h-[120px] w-[120px] rounded-full transition-transform duration-700 group-hover:scale-110"
        style={{ background: accent.patternColor }}
      />
      {/* Small circle bottom-left */}
      <div
        className="pointer-events-none absolute -bottom-6 -left-6 h-[80px] w-[80px] rounded-full transition-transform duration-700 group-hover:translate-x-1"
        style={{ background: accent.patternColor }}
      />
      {/* Diagonal sheen */}
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background: "linear-gradient(110deg, transparent 30%, rgba(255,255,255,0.06) 50%, transparent 70%)",
        }}
      />

      {/* ── Top row ────────────────────────────────────────── */}
      <div className="relative flex items-start justify-between">
        <div
          className="flex h-11 w-11 items-center justify-center rounded-xl backdrop-blur-sm transition-all duration-300 group-hover:scale-110 group-hover:rotate-[-2deg]"
          style={{ backgroundColor: accent.iconBg }}
        >
          <IconComponent size={22} className="shrink-0 text-white" strokeWidth={2} />
        </div>

        {completed ? (
          <div className="flex h-7 w-7 items-center justify-center rounded-full" style={{ backgroundColor: accent.completedRing }}>
            <CheckCircle2 size={18} className="text-white" />
          </div>
        ) : (
          /* Subtle arrow hint */
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white/[0.12] opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0.5">
            <ArrowRight size={14} className="text-white/80" />
          </div>
        )}
      </div>

      {/* ── Content ────────────────────────────────────────── */}
      <div className="relative mt-auto">
        <h3 className="text-[17px] font-bold text-white leading-tight">
          {subModule.title}
        </h3>
        <p className="mt-1.5 line-clamp-2 text-[12px] leading-[1.5] text-white/65">
          {subModule.description}
        </p>

        {/* Bottom row */}
        <div className="mt-3 flex items-center gap-2">
          {subModule.estimatedMinutes > 0 && (
            <div
              className="flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-medium text-white/85"
              style={{ backgroundColor: accent.pillBg }}
            >
              <Clock size={10} />
              <span>{subModule.estimatedMinutes} min</span>
            </div>
          )}
          {subModule.estimatedMinutes === 0 && (
            <div
              className="flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-medium text-white/85"
              style={{ backgroundColor: accent.pillBg }}
            >
              <span>Open-ended</span>
            </div>
          )}
          {completed && (
            <div className="flex items-center gap-1 rounded-full bg-white/[0.18] px-2.5 py-0.5 text-[10px] font-semibold text-white/90">
              <span>✓ Complete</span>
            </div>
          )}
        </div>
      </div>
    </button>
  );
}
