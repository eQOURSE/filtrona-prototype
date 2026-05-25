"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Play, SkipBack, SkipForward } from "lucide-react";
import TopNav from "@/components/TopNav";
import SubModuleHeader from "@/components/submodule/SubModuleHeader";
import CompletionCTA from "@/components/submodule/CompletionCTA";
import NonHistoryPlaceholder from "@/components/submodule/NonHistoryPlaceholder";
import { topics } from "@/lib/topics";

const EASE = [0.16, 1, 0.3, 1] as const;

const CHAPTERS = [
  { idx: 1, title: "The Founding Story", time: "0:00", active: true },
  { idx: 2, title: "From Patent to Production", time: "1:42" },
  { idx: 3, title: "Global Expansion", time: "3:18" },
  { idx: 4, title: "100 Years Later", time: "5:01" },
];

export default function AudioPage() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug;
  const prefersReducedMotion = useReducedMotion();
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    if (!showToast) return;
    const t = setTimeout(() => setShowToast(false), 3000);
    return () => clearTimeout(t);
  }, [showToast]);

  if (slug !== "history") return <NonHistoryPlaceholder slug={slug} kind="audio" />;

  const topic = topics.find((t) => t.slug === slug);
  const topicTitle = topic?.title ?? "The Filtrona Story";

  return (
    <div className="min-h-screen bg-[var(--bg-base)] text-[var(--text-primary)]">
      <TopNav />

      {/* Toast */}
      <div className="pointer-events-none fixed inset-x-0 top-[88px] z-[60] flex justify-center px-4">
        <AnimatePresence>
          {showToast && (
            <motion.div
              key="toast"
              className="pointer-events-auto rounded-xl border border-[var(--border-default)] bg-[var(--bg-surface)] px-4 py-3 text-[13px] text-[var(--text-primary)] shadow-lg"
              initial={
                !prefersReducedMotion ? { y: -16, opacity: 0 } : { opacity: 0 }
              }
              animate={{ y: 0, opacity: 1 }}
              exit={!prefersReducedMotion ? { y: -16, opacity: 0 } : { opacity: 0 }}
              transition={{ duration: 0.3, ease: EASE }}
              role="status"
              aria-live="polite"
            >
              Audio narration is scoped for v1.0 — the prototype demonstrates
              the player UI and chapter structure.
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <main className="mx-auto max-w-[900px] px-6 pt-12 pb-[120px]">
        <SubModuleHeader
          topicSlug={slug}
          topicTitle={topicTitle}
          accent="violet"
          pillLabel="06 · AUDIO OVERVIEW"
          title="Listen to the story"
          subtitle="A 6-minute narrated journey through Filtrona's 170 years."
        />

        {/* Player card */}
        <div className="mt-10">
          <div
            className="mx-auto rounded-3xl border border-[var(--border-default)] bg-[var(--bg-surface)] p-6 sm:p-8"
            style={{ maxWidth: 640 }}
          >
            {/* Album art */}
            <div
              className="mx-auto flex aspect-square w-full max-w-[240px] flex-col items-center justify-center rounded-2xl text-center text-white"
              style={{
                background:
                  "linear-gradient(135deg, var(--accent-mint) 0%, var(--accent-violet) 50%, var(--accent-orange) 100%)",
              }}
            >
              <span
                className="text-[12px] font-bold uppercase tracking-[0.2em]"
                style={{ opacity: 0.92 }}
              >
                The Filtrona Story
              </span>
              <span
                className="mt-2 text-[10px] font-semibold uppercase tracking-[0.18em]"
                style={{ opacity: 0.85 }}
              >
                Audio Overview · 6:24
              </span>
            </div>

            {/* Track info */}
            <div className="mt-6 text-center">
              <h2 className="text-[18px] font-semibold text-[var(--text-primary)]">
                The Filtrona Story · Chapter 1
              </h2>
              <p className="mt-1 text-[13px] text-[var(--text-muted)]">
                Narrated overview · 6 min 24 sec
              </p>
            </div>

            {/* Progress bar */}
            <div className="mt-6">
              <div className="h-[3px] w-full rounded-full bg-[var(--border-default)]">
                <div
                  className="h-full rounded-full bg-[var(--accent-mint)]"
                  style={{ width: "23%" }}
                />
              </div>
              <div className="mt-1.5 flex justify-between text-[12px] font-mono text-[var(--text-muted)]">
                <span>1:28</span>
                <span>6:24</span>
              </div>
            </div>

            {/* Controls */}
            <div className="mt-4 flex items-center justify-center gap-6">
              <button
                aria-label="Skip back"
                onClick={() => setShowToast(true)}
                className="flex h-10 w-10 items-center justify-center rounded-full text-[var(--text-secondary)] transition-colors hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)]"
              >
                <SkipBack size={20} />
              </button>

              <button
                aria-label="Play"
                onClick={() => setShowToast(true)}
                className="group flex h-16 w-16 items-center justify-center rounded-full bg-[var(--accent-mint)] transition-transform duration-200 hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-mint)] focus-visible:ring-offset-4 focus-visible:ring-offset-[var(--bg-surface)]"
                style={{
                  boxShadow:
                    "0 0 32px color-mix(in srgb, var(--accent-mint) 45%, transparent)",
                }}
              >
                <Play
                  size={22}
                  strokeWidth={2}
                  className="ml-1 fill-[var(--bg-base)] text-[var(--bg-base)]"
                />
              </button>

              <button
                aria-label="Skip forward"
                onClick={() => setShowToast(true)}
                className="flex h-10 w-10 items-center justify-center rounded-full text-[var(--text-secondary)] transition-colors hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)]"
              >
                <SkipForward size={20} />
              </button>
            </div>

            {/* Chapter list */}
            <ul className="mt-6 space-y-1">
              {CHAPTERS.map((c) => (
                <li key={c.idx}>
                  <button
                    onClick={() => setShowToast(true)}
                    className={`flex w-full items-center justify-between rounded-lg px-3 py-3 text-left text-[13px] transition-colors ${
                      c.active
                        ? "bg-[var(--accent-mint-soft)] text-[var(--text-primary)]"
                        : "text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)]"
                    }`}
                  >
                    <span>
                      <span className="font-semibold">{c.idx}</span>{" "}
                      <span className="text-[var(--text-muted)]">·</span>{" "}
                      {c.title}{" "}
                      <span className="text-[var(--text-muted)]">·</span>{" "}
                      <span className="font-mono text-[12px] text-[var(--text-muted)]">
                        {c.time}
                      </span>
                    </span>
                    <Play size={10} className="text-[var(--text-muted)]" />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <CompletionCTA
          topicSlug={slug}
          subModuleId="audio"
          headline="Want to mark this complete?"
          body="Mark the audio overview sub-module complete and head back to the module."
        />
      </main>
    </div>
  );
}
