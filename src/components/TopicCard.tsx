"use client";

import { useRouter } from "next/navigation";
import { BookOpen, Layers, Atom, Flame, Leaf, TrendingUp, Grid3x3, Clock, Lock, ArrowRight } from "lucide-react";
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

/* ── Rich gradient themes per accent ─────────────────────────── */
const accentMap = {
  blue: {
    gradient: "linear-gradient(135deg, #188ece 0%, #1565A0 40%, #0D4F7E 100%)",
    glowGradient: "linear-gradient(135deg, #1BA3E8 0%, #188ece 100%)",
    patternColor: "rgba(255,255,255,0.08)",
    iconBg: "rgba(255,255,255,0.18)",
    pillBg: "rgba(255,255,255,0.15)",
    shadow: "0 12px 40px rgba(24, 142, 206, 0.35)",
    hoverShadow: "0 20px 60px rgba(24, 142, 206, 0.45)",
  },
  navy: {
    gradient: "linear-gradient(135deg, #1B4B8E 0%, #163D73 40%, #0F2D5A 100%)",
    glowGradient: "linear-gradient(135deg, #2560A8 0%, #1B4B8E 100%)",
    patternColor: "rgba(255,255,255,0.07)",
    iconBg: "rgba(255,255,255,0.15)",
    pillBg: "rgba(255,255,255,0.12)",
    shadow: "0 12px 40px rgba(27, 75, 142, 0.35)",
    hoverShadow: "0 20px 60px rgba(27, 75, 142, 0.45)",
  },
  sky: {
    gradient: "linear-gradient(135deg, #2BA5E0 0%, #188ece 40%, #1275B0 100%)",
    glowGradient: "linear-gradient(135deg, #3CB8F0 0%, #2BA5E0 100%)",
    patternColor: "rgba(255,255,255,0.08)",
    iconBg: "rgba(255,255,255,0.18)",
    pillBg: "rgba(255,255,255,0.15)",
    shadow: "0 12px 40px rgba(24, 142, 206, 0.30)",
    hoverShadow: "0 20px 60px rgba(24, 142, 206, 0.40)",
  },
  green: {
    gradient: "linear-gradient(135deg, #8abd40 0%, #6EA030 40%, #558025 100%)",
    glowGradient: "linear-gradient(135deg, #9ED150 0%, #8abd40 100%)",
    patternColor: "rgba(255,255,255,0.08)",
    iconBg: "rgba(255,255,255,0.18)",
    pillBg: "rgba(255,255,255,0.15)",
    shadow: "0 12px 40px rgba(138, 189, 64, 0.30)",
    hoverShadow: "0 20px 60px rgba(138, 189, 64, 0.40)",
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

  if (topic.unlocked) {
    return (
      <button
        onClick={handleClick}
        className="group relative flex min-h-[280px] w-full flex-col justify-between overflow-hidden rounded-2xl p-6 md:p-8 transition-all duration-500 ease-[0.16,1,0.3,1] hover:-translate-y-2 hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-base)] cursor-pointer text-left"
        style={{
          background: theme.gradient,
          boxShadow: theme.shadow,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.boxShadow = theme.hoverShadow;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow = theme.shadow;
        }}
        aria-label={`Topic: ${topic.title}. Unlocked. Click to start learning.`}
      >
        {/* ── Decorative background shapes ───────────────────── */}
        {/* Large circle top-right */}
        <div
          className="pointer-events-none absolute -top-16 -right-16 h-[200px] w-[200px] rounded-full transition-transform duration-700 group-hover:scale-110"
          style={{ background: theme.patternColor }}
        />
        {/* Medium circle bottom-left */}
        <div
          className="pointer-events-none absolute -bottom-10 -left-10 h-[140px] w-[140px] rounded-full transition-transform duration-700 group-hover:translate-x-2 group-hover:translate-y-[-4px]"
          style={{ background: theme.patternColor }}
        />
        {/* Diagonal accent stripe */}
        <div
          className="pointer-events-none absolute top-0 right-0 h-full w-[40%] transition-opacity duration-500 group-hover:opacity-100 opacity-60"
          style={{
            background: `linear-gradient(160deg, transparent 0%, ${theme.patternColor} 50%, transparent 100%)`,
          }}
        />
        {/* Subtle mesh overlay */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)`,
            backgroundSize: '30px 30px, 40px 40px',
          }}
        />

        {/* ── Icon ───────────────────────────────────────────── */}
        <div className="relative">
          <div
            className="flex h-14 w-14 items-center justify-center rounded-2xl backdrop-blur-sm transition-all duration-300 group-hover:scale-110 group-hover:rotate-[-3deg]"
            style={{ backgroundColor: theme.iconBg }}
          >
            <IconComponent size={30} stroke="white" strokeWidth={1.8} />
          </div>
        </div>

        {/* ── Content ─────────────────────────────────────────── */}
        <div className="relative mt-auto">
          <h2 className="text-[24px] font-bold tracking-tight text-white md:text-[28px] leading-tight">
            {topic.title}
          </h2>
          <p className="mt-2 line-clamp-2 text-[14px] leading-relaxed text-white/75">
            {topic.description}
          </p>

          {/* Bottom row: pills + arrow */}
          <div className="mt-5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div
                className="flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-medium text-white/90"
                style={{ backgroundColor: theme.pillBg }}
              >
                <Grid3x3 size={12} />
                <span>{topic.subModules} modules</span>
              </div>
              <div
                className="flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-medium text-white/90"
                style={{ backgroundColor: theme.pillBg }}
              >
                <Clock size={12} />
                <span>{topic.estimatedMinutes} min</span>
              </div>
            </div>

            {/* Arrow CTA */}
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm transition-all duration-300 group-hover:bg-white/30 group-hover:translate-x-1">
              <ArrowRight size={18} className="text-white" />
            </div>
          </div>
        </div>
      </button>
    );
  }

  // ── Locked State ────────────────────────────────────────────────
  return (
    <div
      className="group relative flex min-h-[280px] w-full flex-col justify-between overflow-hidden rounded-2xl p-6 md:p-8 cursor-not-allowed select-none"
      style={{
        background: "linear-gradient(135deg, #E0E0DD 0%, #D0D0CD 40%, #C4C4C1 100%)",
        boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
      }}
      role="presentation"
      aria-disabled="true"
    >
      <span className="sr-only">Locked — coming soon: {topic.title}</span>

      {/* Decorative circles */}
      <div className="pointer-events-none absolute -top-12 -right-12 h-[160px] w-[160px] rounded-full bg-white/[0.06]" />
      <div className="pointer-events-none absolute -bottom-8 -left-8 h-[120px] w-[120px] rounded-full bg-white/[0.06]" />

      {/* Icon */}
      <div className="relative">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/[0.12]">
          <IconComponent size={30} stroke="white" strokeWidth={1.8} className="opacity-60" />
        </div>
      </div>

      {/* Content */}
      <div className="relative mt-auto">
        <h2 className="text-[24px] font-bold tracking-tight text-white/70 md:text-[28px] leading-tight">
          {topic.title}
        </h2>
        <p className="mt-2 line-clamp-2 text-[14px] leading-relaxed text-white/50">
          {topic.description}
        </p>

        {/* Bottom row */}
        <div className="mt-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 rounded-full bg-white/[0.10] px-3 py-1 text-[11px] font-medium text-white/60">
              <Grid3x3 size={12} />
              <span>{topic.subModules} modules</span>
            </div>
            <div className="flex items-center gap-1.5 rounded-full bg-white/[0.10] px-3 py-1 text-[11px] font-medium text-white/60">
              <Clock size={12} />
              <span>{topic.estimatedMinutes} min</span>
            </div>
          </div>

          {/* Lock icon */}
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/[0.10]">
            <Lock size={16} className="text-white/50" />
          </div>
        </div>
      </div>
    </div>
  );
}
