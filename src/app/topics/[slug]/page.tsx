"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import TopNav from "@/components/TopNav";
import SubModuleCard from "@/components/SubModuleCard";
import { topics } from "@/lib/topics";
import { subModules } from "@/lib/sub-modules";
import { useProgressStore } from "@/lib/progress-store";

/* ── Animation ───────────────────────────────────────────────────── */
const EASE = [0.16, 1, 0.3, 1] as const;

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.06, delayChildren: 0.08 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: EASE },
  },
};

export default function ModulePage() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug;
  const prefersReducedMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);

  const getModuleCompletionPercent = useProgressStore(
    (s) => s.getModuleCompletionPercent
  );
  const modules = useProgressStore((s) => s.modules);

  useEffect(() => setMounted(true), []);

  const topic = topics.find((t) => t.slug === slug);

  // Gate: topic not found or locked
  if (!topic || !topic.unlocked) {
    return (
      <div className="min-h-screen bg-[var(--bg-base)] text-[var(--text-primary)]">
        <TopNav />
        <main className="mx-auto flex max-w-[640px] flex-col items-center justify-center px-8 py-40 text-center">
          <h1 className="text-[28px] font-bold">Topic not available</h1>
          <p className="mt-3 text-[var(--text-secondary)]">
            This topic hasn&apos;t been unlocked yet.
          </p>
          <Link
            href="/topics"
            className="mt-8 text-sm font-medium text-[var(--accent-mint)] hover:underline"
          >
            ← Back to all topics
          </Link>
        </main>
      </div>
    );
  }

  const totalCount = subModules.length;
  const completedCount = mounted
    ? (modules[slug]?.completed.length ?? 0)
    : 0;
  const completionPercent = mounted
    ? getModuleCompletionPercent(slug, totalCount)
    : 0;

  return (
    <div className="min-h-screen bg-[var(--bg-base)] text-[var(--text-primary)]">
      <TopNav />

      <main className="mx-auto max-w-[1280px] px-4 pt-16 pb-[120px] sm:px-8">
        {/* ── Header ──────────────────────────────────────────────── */}
        <header>
          {/* Back link */}
          <Link
            href="/topics"
            className="inline-flex items-center gap-1.5 text-sm text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]"
          >
            <ArrowLeft size={14} />
            All topics
          </Link>

          {/* Title */}
          <h1 className="mt-6 text-[28px] font-bold tracking-[-0.02em] text-[var(--text-primary)] md:text-[44px]">
            {topic.title}
          </h1>

          {/* Subtitle */}
          <p className="mt-2 max-w-[720px] text-[16px] text-[var(--text-secondary)]">
            {topic.description}
          </p>

          {/* Stat row */}
          <div className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px] uppercase tracking-wider text-[var(--text-muted)]">
            <span>
              <span className="text-[var(--accent-mint)] font-semibold">
                {completedCount}
              </span>{" "}
              / {totalCount} complete
            </span>
            <span aria-hidden="true">·</span>
            <span>{topic.estimatedMinutes} min total</span>
            <span aria-hidden="true">·</span>
            <span>{topic.subModules} sub-modules</span>
          </div>

          {/* Progress bar */}
          <div className="mt-6 h-1.5 w-full max-w-[480px] rounded-full bg-[var(--border-default)]">
            <div
              className="h-full rounded-full bg-[var(--accent-mint)] transition-all duration-[600ms] ease-out"
              style={{ width: `${completionPercent}%` }}
            />
          </div>
        </header>

        {/* ── Sub-module grid ─────────────────────────────────────── */}
        <div className="mt-14">
          {mounted && !prefersReducedMotion ? (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            >
              {subModules.map((sm) => (
                <motion.div key={sm.id} variants={cardVariants}>
                  <SubModuleCard topicSlug={slug} subModule={sm} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {subModules.map((sm) => (
                <div key={sm.id}>
                  <SubModuleCard topicSlug={slug} subModule={sm} />
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
