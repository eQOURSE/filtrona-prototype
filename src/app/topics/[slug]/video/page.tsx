"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Play, Volume2, Film } from "lucide-react";
import TopNav from "@/components/TopNav";
import SubModuleHeader from "@/components/submodule/SubModuleHeader";
import CompletionCTA from "@/components/submodule/CompletionCTA";
import NonHistoryPlaceholder from "@/components/submodule/NonHistoryPlaceholder";
import { topics } from "@/lib/topics";

const EASE = [0.16, 1, 0.3, 1] as const;

const CHAPTERS = [
  {
    num: "01",
    title: "The Founding Years",
    desc: "1854 to 1924 — from Bratislava haberdashery to Aivaz's patent.",
    range: "0:00 – 0:58",
  },
  {
    num: "02",
    title: "A Century of Filters",
    desc: "1927 production, Jarrow, the global expansion.",
    range: "0:58 – 2:14",
  },
  {
    num: "03",
    title: "Filtrona Today",
    desc: "100 years on — Singapore HQ, 11 sites, 120 countries.",
    range: "2:14 – 3:24",
  },
];

export default function VideoPage() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug;
  const prefersReducedMotion = useReducedMotion();
  const [showInfoCard, setShowInfoCard] = useState(false);

  if (slug !== "history") return <NonHistoryPlaceholder slug={slug} kind="video" />;

  const topic = topics.find((t) => t.slug === slug);
  const topicTitle = topic?.title ?? "The Filtrona Story";

  return (
    <div className="min-h-screen bg-[var(--bg-base)] text-[var(--text-primary)]">
      <TopNav />

      <main className="mx-auto max-w-[900px] px-6 pt-12 pb-[120px]">
        <SubModuleHeader
          topicSlug={slug}
          topicTitle={topicTitle}
          accent="orange"
          pillLabel="03 · RELATED VIDEO"
          title="Filtrona at 100"
          subtitle="A three-minute film on a century of filter innovation. Coming with the full release."
        />

        {/* Video mockup */}
        <div className="mt-10">
          <div
            className="relative w-full overflow-hidden rounded-2xl border border-[var(--border-default)]"
            style={{
              aspectRatio: "16 / 9",
              background:
                "linear-gradient(135deg, var(--accent-orange-soft) 0%, var(--bg-surface) 50%, var(--accent-mint-soft) 100%)",
            }}
          >
            {/* PREVIEW pill */}
            <div
              className="absolute left-4 top-4 z-[2] inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em]"
              style={{
                backgroundColor: "var(--accent-orange-soft)",
                color: "var(--accent-orange)",
                border:
                  "1px solid color-mix(in srgb, var(--accent-orange) 30%, transparent)",
              }}
            >
              PREVIEW
            </div>

            <AnimatePresence mode="wait">
              {!showInfoCard ? (
                <motion.div
                  key="player"
                  className="absolute inset-0 flex items-center justify-center"
                  initial={!prefersReducedMotion ? { opacity: 0 } : false}
                  animate={{ opacity: 1 }}
                  exit={!prefersReducedMotion ? { opacity: 0 } : { opacity: 0 }}
                  transition={{ duration: 0.25, ease: EASE }}
                >
                  {/* Big play button */}
                  <button
                    onClick={() => setShowInfoCard(true)}
                    aria-label="Play video"
                    className="group flex h-24 w-24 items-center justify-center rounded-full bg-[var(--accent-mint)] transition-transform duration-300 hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-mint)] focus-visible:ring-offset-4 focus-visible:ring-offset-[var(--bg-base)]"
                    style={{
                      boxShadow:
                        "0 0 60px color-mix(in srgb, var(--accent-mint) 50%, transparent), 0 0 24px color-mix(in srgb, var(--accent-mint) 35%, transparent)",
                    }}
                  >
                    <Play
                      size={36}
                      strokeWidth={2}
                      className="ml-1 fill-[var(--bg-base)] text-[var(--bg-base)]"
                    />
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  key="info"
                  className="absolute inset-0 flex items-center justify-center px-6"
                  initial={!prefersReducedMotion ? { opacity: 0, y: 8 } : false}
                  animate={{ opacity: 1, y: 0 }}
                  exit={!prefersReducedMotion ? { opacity: 0, y: 8 } : { opacity: 0 }}
                  transition={{ duration: 0.3, ease: EASE }}
                >
                  <div className="max-w-[440px] rounded-2xl border border-[var(--border-default)] bg-[var(--bg-surface)] p-6 text-center shadow-lg">
                    <Film
                      size={32}
                      className="mx-auto"
                      style={{ color: "var(--accent-orange)" }}
                    />
                    <h3 className="mt-3 text-[18px] font-semibold text-[var(--text-primary)]">
                      Full video coming in v1.0
                    </h3>
                    <p className="mt-2 text-[14px] leading-[1.55] text-[var(--text-secondary)]">
                      Full video production is scoped for v1.0. The prototype
                      demonstrates the surrounding learning loop.
                    </p>
                    <button
                      onClick={() => setShowInfoCard(false)}
                      className="mt-4 inline-flex items-center rounded-lg border border-[var(--border-default)] bg-[var(--bg-elevated)] px-4 py-2 text-[13px] font-medium text-[var(--text-primary)] transition-colors hover:border-[var(--accent-mint)]"
                    >
                      OK, got it
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Bottom overlay strip */}
            <div
              className="pointer-events-none absolute inset-x-0 bottom-0 flex h-20 items-end justify-between px-5 pb-3"
              style={{
                background:
                  "linear-gradient(to top, rgba(0,0,0,0.55), transparent)",
              }}
            >
              <span
                className="text-[12px] font-mono text-white"
                style={{ opacity: 0.8 }}
              >
                0:00 / 3:24
              </span>
              <Volume2
                size={16}
                className="text-white"
                style={{ opacity: 0.8 }}
              />
            </div>
          </div>
        </div>

        {/* Chapter cards */}
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {CHAPTERS.map((c) => (
            <div
              key={c.num}
              className="rounded-xl border border-[var(--border-default)] bg-[var(--bg-surface)] p-[18px] transition-colors duration-200 hover:border-[color-mix(in_srgb,var(--accent-orange)_30%,var(--border-default))]"
            >
              <div
                className="text-[24px] font-bold leading-none"
                style={{ color: "var(--accent-mint)" }}
              >
                {c.num}
              </div>
              <h3 className="mt-3 text-[15px] font-semibold text-[var(--text-primary)]">
                {c.title}
              </h3>
              <p className="mt-1.5 text-[13px] leading-[1.5] text-[var(--text-secondary)]">
                {c.desc}
              </p>
              <p className="mt-3 text-[12px] font-mono text-[var(--text-muted)]">
                {c.range}
              </p>
            </div>
          ))}
        </div>

        <CompletionCTA
          topicSlug={slug}
          subModuleId="video"
          headline="Want to mark this complete?"
          body="Mark the related video sub-module complete and head back to the module."
        />
      </main>
    </div>
  );
}
