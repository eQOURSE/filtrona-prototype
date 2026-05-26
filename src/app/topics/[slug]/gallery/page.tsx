"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Box, X } from "lucide-react";
import TopNav from "@/components/TopNav";
import SubModuleHeader from "@/components/submodule/SubModuleHeader";
import CompletionCTA from "@/components/submodule/CompletionCTA";
import NonHistoryPlaceholder from "@/components/submodule/NonHistoryPlaceholder";
import { topics } from "@/lib/topics";

const EASE = [0.16, 1, 0.3, 1] as const;

interface GalleryCard {
  year: string;
  label: string;
  /** CSS gradient for background. */
  gradient: string;
  /** Tailwind grid span classes (desktop+). */
  span?: string;
  /** Whether to show a "3D preview" badge. */
  is3D?: boolean;
}

const galleryByTopic: Record<string, GalleryCard[]> = {
  'history': [
    {
      year: "1854",
      label: "Bratislava — original Bunzl haberdashery",
      gradient: "linear-gradient(135deg, var(--accent-mint) 0%, var(--accent-blue) 100%)",
      span: "lg:row-span-2",
    },
    {
      year: "1924",
      label: "Aivaz's original filter patent",
      gradient: "linear-gradient(135deg, var(--accent-violet) 0%, var(--accent-orange) 100%)",
    },
    {
      year: "1927",
      label: "Ortmann factory production line",
      gradient: "linear-gradient(135deg, var(--accent-orange) 0%, var(--accent-mint) 100%)",
      span: "lg:col-span-2",
      is3D: true,
    },
    {
      year: "1948",
      label: "Jarrow facility opening",
      gradient: "linear-gradient(135deg, var(--accent-blue) 0%, var(--accent-violet) 100%)",
    },
    {
      year: "1979",
      label: "First Filtrona-branded packaging",
      gradient: "linear-gradient(135deg, var(--accent-mint) 0%, var(--accent-violet) 100%)",
      span: "lg:row-span-2",
    },
    {
      year: "2013",
      label: "Essentra rebrand era",
      gradient: "linear-gradient(135deg, var(--accent-orange) 0%, var(--accent-blue) 100%)",
    },
    {
      year: "2022",
      label: "Centaury acquisition",
      gradient: "linear-gradient(135deg, var(--accent-violet) 0%, var(--accent-mint) 100%)",
    },
    {
      year: "2024",
      label: "100 years of filters — global celebration",
      gradient: "linear-gradient(135deg, var(--accent-mint) 0%, var(--accent-orange) 50%, var(--accent-violet) 100%)",
      span: "lg:col-span-2",
      is3D: true,
    },
  ],
  'filter-types': [
    {
      year: "CPS",
      label: "Standard cellulose acetate",
      gradient: "linear-gradient(135deg, var(--accent-mint) 0%, var(--accent-blue) 100%)",
      span: "lg:row-span-2",
      is3D: true,
    },
    {
      year: "COR",
      label: "Ventilated CO reduction",
      gradient: "linear-gradient(135deg, var(--accent-violet) 0%, var(--accent-orange) 100%)",
      is3D: true,
    },
    {
      year: "CCF",
      label: "Coaxial Core — visual distinction",
      gradient: "linear-gradient(135deg, var(--accent-orange) 0%, var(--accent-mint) 100%)",
      span: "lg:col-span-2",
      is3D: true,
    },
    {
      year: "CRN",
      label: "Corinthian — patented flutes",
      gradient: "linear-gradient(135deg, var(--accent-blue) 0%, var(--accent-violet) 100%)",
      is3D: true,
    },
    {
      year: "VTX",
      label: "Vortex — sensory airflow",
      gradient: "linear-gradient(135deg, var(--accent-mint) 0%, var(--accent-orange) 50%, var(--accent-violet) 100%)",
      span: "lg:col-span-2",
      is3D: true,
    },
  ]
};

export default function GalleryPage() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug;
  const prefersReducedMotion = useReducedMotion();
  const [activeIdx, setActiveIdx] = useState<number | null>(null);

  if (!(slug in galleryByTopic)) return <NonHistoryPlaceholder slug={slug} kind="gallery" />;

  const topic = topics.find((t) => t.slug === slug);
  const topicTitle = topic?.title ?? "Topic";
  const cards = galleryByTopic[slug] ?? [];

  const close = () => setActiveIdx(null);

  return (
    <div className="min-h-screen  text-[var(--text-primary)]">
      <TopNav />

      <main className="mx-auto max-w-[1100px] px-6 pt-12 pb-[120px]">
        <SubModuleHeader
          topicSlug={slug}
          topicTitle={topicTitle}
          accent="orange"
          pillLabel="07 · GALLERY"
          title="Filtrona through the years"
          subtitle="Photos, artifacts, and product cross-sections. Interactive 3D coming in v1.0."
        />

        {/* Masonry-ish grid */}
        <div
          className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
          style={{ gridAutoRows: "200px" }}
        >
          {cards.map((card, i) => (
            <motion.button
              key={card.year + "-" + i}
              onClick={() => setActiveIdx(i)}
              className={`group relative flex h-full w-full flex-col justify-end overflow-hidden rounded-2xl border border-[var(--border-default)] text-left transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-orange)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-base)] ${card.span ?? ""}`}
              style={{
                background: card.gradient,
                minHeight: 200,
              }}
              initial={
                !prefersReducedMotion
                  ? { opacity: 0, y: 12 }
                  : { opacity: 1, y: 0 }
              }
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4, ease: EASE, delay: i * 0.04 }}
              whileHover={!prefersReducedMotion ? { scale: 1.015 } : undefined}
              aria-label={`${card.year} — ${card.label}`}
            >
              {/* Year watermark */}
              <span
                className="pointer-events-none absolute right-3 bottom-1 select-none text-[120px] font-extrabold leading-none text-white sm:text-[140px] lg:text-[160px]"
                style={{ opacity: 0.18 }}
                aria-hidden="true"
              >
                {card.year}
              </span>

              {/* 3D preview badge */}
              {card.is3D && (
                <span
                  className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-black/35 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-white backdrop-blur-sm"
                  aria-hidden="true"
                >
                  <Box size={12} />
                  3D preview
                </span>
              )}

              {/* Bottom-left label */}
              <div className="relative z-[1] p-4">
                <span
                  className="inline-block rounded-full bg-black/35 px-2.5 py-0.5 text-[11px] font-semibold text-white backdrop-blur-sm"
                  style={{ letterSpacing: "0.05em" }}
                >
                  {card.year}
                </span>
                <p className="mt-2 max-w-[260px] text-[14px] font-medium text-white drop-shadow">
                  {card.label}
                </p>
              </div>
            </motion.button>
          ))}
        </div>

        <p className="mt-6 text-center text-[12px] italic text-[var(--text-muted)]">
          Real photographs and 3D filter cross-sections are in scoping for v1.0.
          This grid demonstrates the structure and interaction model.
        </p>

        <CompletionCTA
          topicSlug={slug}
          subModuleId="gallery"
          headline="Want to mark this complete?"
          body="Mark the gallery sub-module complete and head back to the module."
        />
      </main>

      {/* Modal */}
      <AnimatePresence>
        {activeIdx !== null && (
          <motion.div
            key="backdrop"
            className="fixed inset-0 z-[100] flex items-center justify-center px-6 py-10"
            style={{ backgroundColor: "rgba(0,0,0,0.55)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={close}
            role="dialog"
            aria-modal="true"
            aria-label={`${cards[activeIdx].year} preview`}
          >
            <motion.div
              className="relative w-full max-w-[720px] overflow-hidden rounded-2xl border border-[var(--border-default)] bg-[var(--bg-surface)]"
              onClick={(e) => e.stopPropagation()}
              initial={
                !prefersReducedMotion
                  ? { opacity: 0, scale: 0.96 }
                  : { opacity: 0 }
              }
              animate={{ opacity: 1, scale: 1 }}
              exit={
                !prefersReducedMotion
                  ? { opacity: 0, scale: 0.96 }
                  : { opacity: 0 }
              }
              transition={{ duration: 0.25, ease: EASE }}
            >
              <button
                onClick={close}
                aria-label="Close preview"
                className="absolute right-3 top-3 z-10 inline-flex h-9 w-9 items-center justify-center rounded-full bg-black/40 text-white transition-colors hover:bg-black/60"
              >
                <X size={18} />
              </button>

              {/* Big artwork */}
              <div
                className="flex aspect-[16/9] w-full items-end p-6 sm:p-8"
                style={{ background: cards[activeIdx].gradient }}
              >
                <div>
                  <span
                    className="inline-block rounded-full bg-black/35 px-3 py-1 text-[12px] font-semibold text-white backdrop-blur-sm"
                    style={{ letterSpacing: "0.05em" }}
                  >
                    {cards[activeIdx].year}
                  </span>
                  <h3 className="mt-3 text-[22px] font-semibold text-white drop-shadow">
                    {cards[activeIdx].label}
                  </h3>
                </div>
              </div>

              {/* Body */}
              <div className="p-6 sm:p-8">
                <p className="text-[14px] leading-[1.6] text-[var(--text-secondary)]">
                  Real images, 3D rotation, and zoom coming in v1.0.
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
