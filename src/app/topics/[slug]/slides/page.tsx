"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import TopNav from "@/components/TopNav";
import { getSlidesForTopic, TimelineMilestone, FilterSlide } from "@/lib/slide-content";
import { useProgressStore } from "@/lib/progress-store";
import { topics } from "@/lib/topics";
import SlideDeck from "@/components/slides/SlideDeck";

/* ── Accent color map ──────────────────────────────────────────── */
const accentColors: Record<string, string> = {
  mint: "var(--accent-mint)",
  violet: "var(--accent-violet)",
  orange: "var(--accent-orange)",
  blue: "var(--accent-blue)",
};

const accentSoftBg: Record<string, string> = {
  mint: "var(--accent-mint-soft)",
  violet: "var(--accent-violet-soft)",
  orange: "var(--accent-orange-soft)",
  blue: "var(--accent-blue-soft)",
};

const EASE = [0.16, 1, 0.3, 1] as const;

/* ── Legacy Timeline Component for History ─────────────────────── */
function MilestoneBlock({
  milestone,
  index,
  isLast,
  reduceMotion,
}: {
  milestone: TimelineMilestone;
  index: number;
  isLast: boolean;
  reduceMotion: boolean | null;
}) {
  const color = accentColors[milestone.accent];
  const softBg = accentSoftBg[milestone.accent];

  return (
    <div className="relative flex gap-0" style={{ paddingBottom: isLast ? 0 : "96px" }}>
      <div className="relative flex flex-col items-center" style={{ width: "48px", minWidth: "48px" }}>
        {!isLast && (
          <div
            className="absolute left-1/2 top-0 -translate-x-1/2 w-[2px] h-full bg-[var(--border-default)]"
            aria-hidden="true"
          />
        )}
        {index > 0 && (
          <div
            className="absolute left-1/2 top-0 -translate-x-1/2 w-[2px] bg-[var(--border-default)]"
            style={{ height: "0px" }}
            aria-hidden="true"
          />
        )}
        <motion.div
          className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full border-2 transition-colors duration-500"
          style={{ backgroundColor: "var(--bg-base)", borderColor: color }}
          {...(!reduceMotion
            ? {
                initial: { opacity: 0, scale: 0.5 },
                whileInView: { opacity: 1, scale: 1, backgroundColor: color, borderColor: color },
                viewport: { once: true, margin: "-100px" },
                transition: { duration: 0.6, ease: EASE },
              }
            : { style: { backgroundColor: color, borderColor: color, opacity: 1 } })}
        >
          <span className="text-[13px] font-semibold font-mono transition-colors duration-500" style={{ color: "var(--bg-base)" }}>
            {milestone.year}
          </span>
        </motion.div>
      </div>

      <motion.div
        className="flex-1 pl-8 pt-0.5"
        {...(!reduceMotion
          ? {
              initial: { opacity: 0, y: 20 },
              whileInView: { opacity: 1, y: 0 },
              viewport: { once: true, margin: "-100px" },
              transition: { duration: 0.6, ease: EASE, delay: 0.1 },
            }
          : {})}
      >
        {milestone.tag && (
          <span
            className="inline-block rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider"
            style={{ backgroundColor: softBg, color }}
          >
            {milestone.tag}
          </span>
        )}
        <h3 className="mt-3 text-[22px] font-semibold text-[var(--text-primary)] sm:text-[28px]">
          {milestone.title}
        </h3>
        <p className="mt-3 max-w-[640px] text-[15px] leading-[1.6] text-[var(--text-secondary)] sm:text-[16px]">
          {milestone.body}
        </p>
      </motion.div>
    </div>
  );
}

function LegacyTimeline({ slug, milestones, prefersReducedMotion }: { slug: string, milestones: TimelineMilestone[], prefersReducedMotion: boolean | null }) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const markComplete = useProgressStore((s) => s.markComplete);
  const isComplete = useProgressStore((s) => s.isComplete);
  const alreadyComplete = mounted ? isComplete(slug, "slides") : false;

  useEffect(() => setMounted(true), []);

  const handleComplete = () => {
    if (!alreadyComplete) markComplete(slug, "slides");
    setTimeout(() => router.push(`/topics/${slug}`), 600);
  };

  return (
    <>
      <div className="mt-20">
        {milestones.map((milestone, i) => (
          <MilestoneBlock
            key={milestone.year}
            milestone={milestone}
            index={i}
            isLast={i === milestones.length - 1}
            reduceMotion={prefersReducedMotion}
          />
        ))}
      </div>
      <motion.div
        className="mx-auto mt-20 max-w-[640px] rounded-2xl border border-[var(--border-default)] bg-[var(--bg-surface)] p-8 text-center"
        {...(!prefersReducedMotion
          ? {
              initial: { opacity: 0, y: 20 },
              whileInView: { opacity: 1, y: 0 },
              viewport: { once: true, margin: "-60px" },
              transition: { duration: 0.6, ease: EASE },
            }
          : {})}
      >
        <CheckCircle2 size={40} className="mx-auto text-[var(--accent-mint)]" />
        <h2 className="mt-4 text-[20px] font-semibold text-[var(--text-primary)]">
          You&apos;ve made it through the story of our innovations.
        </h2>
        <p className="mt-2 text-[15px] text-[var(--text-secondary)]">
          {alreadyComplete ? "This slide deck is already marked complete." : "Mark this slide deck complete to track your progress."}
        </p>
        <button
          onClick={handleComplete}
          className="mt-5 inline-flex cursor-pointer items-center gap-2 rounded-xl bg-[var(--accent-mint)] px-8 py-3.5 text-[15px] font-semibold text-[var(--bg-base)] shadow-mint-glow transition-all duration-300 hover:shadow-mint-glow-hover"
        >
          {alreadyComplete ? "Revisit completed ✓" : "Mark as complete"}
        </button>
      </motion.div>
    </>
  );
}

/* ── Main Page ─────────────────────────────────────────────────── */
export default function SlidesPage() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug;
  const topic = topics.find((t) => t.slug === slug);
  const topicTitle = topic?.title ?? "Topic";
  const prefersReducedMotion = useReducedMotion();

  const rawSlides = getSlidesForTopic(slug);

  return (
    <div className="min-h-screen  text-[var(--text-primary)]">
      <TopNav />

      <main className="mx-auto max-w-[1280px] px-4 pt-6 pb-20 sm:px-8">
        {/* Header */}
        <header className={slug === "history" ? "max-w-[1100px] mx-auto" : ""}>
          <Link
            href={`/topics/${slug}`}
            className="inline-flex items-center gap-1.5 text-sm text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]"
          >
            <ArrowLeft size={14} />
            {topicTitle}
          </Link>

          <div className="mt-2 inline-block rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wider"
            style={{ backgroundColor: "var(--accent-mint-soft)", color: "var(--accent-mint)" }}
          >
            01 · Slide Deck
          </div>

          <h1 className="mt-2 text-[28px] font-bold tracking-[-0.02em] text-[var(--text-primary)] sm:text-[36px]">
            {topicTitle}
          </h1>

          <p className="mt-1 text-[15px] text-[var(--text-secondary)] sm:text-[17px]">
            {slug === "filter-types"
              ? "Five engineered solutions, one industry. Use the connected actions on each slide to dive deeper."
              : "Eight moments that shaped a century of filter innovation."}
          </p>
        </header>

        {/* Content switch */}
        <div className="mt-6">
          {slug === "filter-types" ? (
            <SlideDeck slides={rawSlides as FilterSlide[]} topicSlug={slug} />
          ) : slug === "history" ? (
            <div className="max-w-[1100px] mx-auto">
              <LegacyTimeline slug={slug} milestones={rawSlides as TimelineMilestone[]} prefersReducedMotion={prefersReducedMotion} />
            </div>
          ) : (
            <p className="text-[var(--text-muted)] mt-12 text-center">Placeholder for {slug}</p>
          )}
        </div>
      </main>
    </div>
  );
}
