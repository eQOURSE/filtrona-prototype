"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import TopNav from "@/components/TopNav";
import SubModuleHeader from "@/components/submodule/SubModuleHeader";
import CompletionCTA from "@/components/submodule/CompletionCTA";
import NonHistoryPlaceholder from "@/components/submodule/NonHistoryPlaceholder";
import { topics } from "@/lib/topics";

const EASE = [0.16, 1, 0.3, 1] as const;

type Accent = "mint" | "violet" | "orange" | "blue";

interface BranchDef {
  id: string;
  label: string;
  accent: Accent;
  /** Branch node center, in SVG coords (canvas 1000×560) */
  cx: number;
  cy: number;
  dashed?: boolean;
  leaves: { label: string; cx: number; cy: number }[];
}

const ACCENT_VAR: Record<Accent, string> = {
  mint: "var(--accent-mint)",
  violet: "var(--accent-violet)",
  orange: "var(--accent-orange)",
  blue: "var(--accent-blue)",
};
const ACCENT_SOFT: Record<Accent, string> = {
  mint: "var(--accent-mint-soft)",
  violet: "var(--accent-violet-soft)",
  orange: "var(--accent-orange-soft)",
  blue: "var(--accent-blue-soft)",
};

/* Center: (500, 280). 6 branches at 60° intervals on radius ~200. */
const HISTORY_BRANCHES: BranchDef[] = [
  {
    id: "founders",
    label: "Founders",
    accent: "mint",
    cx: 500,
    cy: 80, // top
    leaves: [
      { label: "Moritz Bunzl 1854", cx: 380, cy: 30 },
      { label: "Boris Aivaz 1924", cx: 620, cy: 30 },
    ],
  },
  {
    id: "inventions",
    label: "Inventions",
    accent: "violet",
    cx: 760,
    cy: 180, // upper-right
    leaves: [
      { label: "Crepe paper filter", cx: 900, cy: 110 },
      { label: "ECO range", cx: 920, cy: 220 },
    ],
  },
  {
    id: "manufacturing",
    label: "Manufacturing",
    accent: "orange",
    cx: 760,
    cy: 380, // lower-right
    leaves: [
      { label: "Ortmann 1927", cx: 920, cy: 350 },
      { label: "Jarrow 1948", cx: 900, cy: 460 },
    ],
  },
  {
    id: "ownership",
    label: "Ownership",
    accent: "blue",
    cx: 500,
    cy: 480, // bottom
    leaves: [
      { label: "Bunzl 1854", cx: 360, cy: 540 },
      { label: "Essentra 2013", cx: 500, cy: 555 },
      { label: "Centaury 2022", cx: 640, cy: 540 },
    ],
  },
  {
    id: "today",
    label: "Today",
    accent: "mint",
    cx: 240,
    cy: 380, // lower-left
    leaves: [
      { label: "Singapore HQ", cx: 80, cy: 460 },
      { label: "120 countries", cx: 100, cy: 350 },
    ],
  },
  {
    id: "future",
    label: "Future",
    accent: "violet",
    cx: 240,
    cy: 180, // upper-left
    dashed: true,
    leaves: [
      { label: "Boreas HTP", cx: 100, cy: 220 },
      { label: "Sustainability", cx: 80, cy: 110 },
    ],
  },
];

/* Center: (500, 280). 5 branches at 72° intervals on radius ~200. */
const FILTER_TYPES_BRANCHES: BranchDef[] = [
  {
    id: "cps",
    label: "CPS",
    accent: "mint",
    cx: 500,
    cy: 80, // top (0°)
    leaves: [
      { label: "Tar reduction", cx: 380, cy: 30 },
      { label: "Cross-flow tech", cx: 620, cy: 30 },
    ],
  },
  {
    id: "cor",
    label: "COR",
    accent: "blue",
    cx: 690,
    cy: 218, // right (72°)
    leaves: [
      { label: "CO reduction", cx: 850, cy: 150 },
      { label: "Tip ventilation", cx: 850, cy: 280 },
    ],
  },
  {
    id: "ccf",
    label: "Coaxial Core",
    accent: "orange",
    cx: 617,
    cy: 441, // bottom-right (144°)
    leaves: [
      { label: "Visual design", cx: 770, cy: 450 },
      { label: "Coloured core", cx: 620, cy: 550 },
    ],
  },
  {
    id: "corinthian",
    label: "Corinthian",
    accent: "violet",
    cx: 382,
    cy: 441, // bottom-left (216°)
    leaves: [
      { label: "Patented tech", cx: 380, cy: 550 },
      { label: "Fluted structure", cx: 230, cy: 450 },
    ],
  },
  {
    id: "vortex",
    label: "Vortex",
    accent: "mint",
    cx: 309,
    cy: 218, // left (288°)
    leaves: [
      { label: "Twist inside", cx: 150, cy: 280 },
      { label: "Sensory feel", cx: 150, cy: 150 },
    ],
  },
];

const mindmapByTopic: Record<string, BranchDef[]> = {
  'history': HISTORY_BRANCHES,
  'filter-types': FILTER_TYPES_BRANCHES
};

const CENTER = { cx: 500, cy: 280 };

export default function MindMapPage() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug;
  const prefersReducedMotion = useReducedMotion();
  const [hovered, setHovered] = useState<string | null>(null);

  if (!(slug in mindmapByTopic)) return <NonHistoryPlaceholder slug={slug} kind="mindmap" />;

  const topic = topics.find((t) => t.slug === slug);
  const topicTitle = topic?.title ?? "Topic";
  const branches = mindmapByTopic[slug] ?? [];

  // Build curved path between two points using a Q control point
  // pulled toward the canvas center for a gentle bend.
  const curvePath = (
    x1: number,
    y1: number,
    x2: number,
    y2: number
  ): string => {
    const mx = (x1 + x2) / 2;
    const my = (y1 + y2) / 2;
    const dx = x2 - x1;
    const dy = y2 - y1;
    // Perpendicular offset for the control point — gives a soft curve
    const offset = 30;
    const len = Math.sqrt(dx * dx + dy * dy) || 1;
    const px = (-dy / len) * offset;
    const py = (dx / len) * offset;
    return `M ${x1} ${y1} Q ${mx + px} ${my + py} ${x2} ${y2}`;
  };

  // Stagger entry: center first, then each branch + its leaves
  const stagger = (i: number) => (prefersReducedMotion ? 0 : 0.08 + i * 0.05);

  return (
    <div className="min-h-screen  text-[var(--text-primary)]">
      <TopNav />

      <main className="mx-auto max-w-[900px] px-6 pt-12 pb-[120px]">
        <SubModuleHeader
          topicSlug={slug}
          topicTitle={topicTitle}
          accent="blue"
          pillLabel="04 · MIND MAP"
          title="How it all connects"
          subtitle="Drag, zoom, and explore the relationships between people, places, and milestones."
        />

        {/* SVG mind map */}
        <div className="mt-10 overflow-hidden rounded-2xl border border-[var(--border-default)] bg-[var(--bg-surface)] p-4 sm:p-6">
          <svg
            viewBox="0 0 1000 560"
            width="100%"
            height="560"
            preserveAspectRatio="xMidYMid meet"
            role="img"
            aria-label="Mind map of The Filtrona Story"
          >
            {/* ── Connection lines ──────────────────────────── */}
            {branches.map((b) => {
              const isActive = hovered === b.id;
              const lineColor = isActive
                ? ACCENT_VAR[b.accent]
                : "var(--border-default)";
              return (
                <g key={`lines-${b.id}`}>
                  {/* center → branch */}
                  <path
                    d={curvePath(CENTER.cx, CENTER.cy, b.cx, b.cy)}
                    stroke={lineColor}
                    strokeWidth={1.5}
                    strokeDasharray={b.dashed ? "6 4" : undefined}
                    fill="none"
                  />
                  {/* branch → leaves */}
                  {b.leaves.map((l, idx) => (
                    <path
                      key={`leaf-line-${b.id}-${idx}`}
                      d={curvePath(b.cx, b.cy, l.cx, l.cy)}
                      stroke={lineColor}
                      strokeWidth={1.25}
                      fill="none"
                    />
                  ))}
                </g>
              );
            })}

            {/* ── Branch leaves (drawn before branches so the larger
                  branch nodes sit on top if they overlap) ────── */}
            {branches.map((b, bi) =>
              b.leaves.map((l, li) => (
                <motion.g
                  key={`leaf-${b.id}-${li}`}
                  initial={
                    !prefersReducedMotion
                      ? { scale: 0, opacity: 0 }
                      : { scale: 1, opacity: 1 }
                  }
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{
                    duration: 0.4,
                    ease: EASE,
                    delay: stagger(bi) + 0.18 + li * 0.04,
                  }}
                  style={{ transformOrigin: `${l.cx}px ${l.cy}px` }}
                >
                  <circle
                    cx={l.cx}
                    cy={l.cy}
                    r={28}
                    fill="var(--bg-elevated)"
                    stroke="var(--border-default)"
                    strokeWidth={1}
                  />
                  <text
                    x={l.cx}
                    y={l.cy}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontSize="10"
                    fill="var(--text-secondary)"
                    style={{ pointerEvents: "none" }}
                  >
                    {l.label.length > 16
                      ? splitLabel(l.label).map((line, i, arr) => (
                          <tspan
                            key={i}
                            x={l.cx}
                            dy={i === 0 ? -((arr.length - 1) * 6) : 12}
                          >
                            {line}
                          </tspan>
                        ))
                      : l.label}
                  </text>
                </motion.g>
              ))
            )}

            {/* ── Branch nodes ──────────────────────────────── */}
            {branches.map((b, bi) => {
              const isActive = hovered === b.id;
              return (
                <motion.g
                  key={`branch-${b.id}`}
                  onMouseEnter={() => setHovered(b.id)}
                  onMouseLeave={() => setHovered((c) => (c === b.id ? null : c))}
                  initial={
                    !prefersReducedMotion
                      ? { scale: 0, opacity: 0 }
                      : { scale: 1, opacity: 1 }
                  }
                  animate={{
                    scale: isActive && !prefersReducedMotion ? 1.08 : 1,
                    opacity: 1,
                  }}
                  transition={{
                    duration: 0.4,
                    ease: EASE,
                    delay: stagger(bi),
                  }}
                  style={{
                    cursor: "pointer",
                    transformOrigin: `${b.cx}px ${b.cy}px`,
                  }}
                >
                  <circle
                    cx={b.cx}
                    cy={b.cy}
                    r={45}
                    fill={ACCENT_SOFT[b.accent]}
                    stroke={ACCENT_VAR[b.accent]}
                    strokeWidth={2}
                    strokeDasharray={b.dashed ? "5 4" : undefined}
                  />
                  <text
                    x={b.cx}
                    y={b.cy}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontSize="13"
                    fontWeight="600"
                    fill={ACCENT_VAR[b.accent]}
                    style={{ pointerEvents: "none" }}
                  >
                    {b.label}
                  </text>
                </motion.g>
              );
            })}

            {/* ── Center node ───────────────────────────────── */}
            <motion.g
              initial={
                !prefersReducedMotion
                  ? { scale: 0, opacity: 0 }
                  : { scale: 1, opacity: 1 }
              }
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, ease: EASE }}
              style={{ transformOrigin: `${CENTER.cx}px ${CENTER.cy}px` }}
            >
              <circle
                cx={CENTER.cx}
                cy={CENTER.cy}
                r={60}
                fill="var(--accent-mint)"
              />
              <text
                x={CENTER.cx}
                y={CENTER.cy}
                textAnchor="middle"
                dominantBaseline="central"
                fontSize="18"
                fontWeight="700"
                fill="var(--bg-base)"
                style={{ pointerEvents: "none" }}
              >
                {slug === "filter-types" ? "FILTERS" : "FILTRONA"}
              </text>
            </motion.g>
          </svg>
        </div>

        <p className="mt-3 text-center text-[12px] italic text-[var(--text-muted)]">
          This is a static preview. Interactive zoom, drag, and search are in
          v1.0.
        </p>

        <CompletionCTA
          topicSlug={slug}
          subModuleId="mindmap"
          headline="Want to mark this complete?"
          body="Mark the mind map sub-module complete and head back to the module."
        />
      </main>
    </div>
  );
}

/** Split a long label into 2 lines around the last space before midpoint. */
function splitLabel(label: string): string[] {
  if (label.length <= 16) return [label];
  const mid = Math.floor(label.length / 2);
  let splitAt = label.lastIndexOf(" ", mid + 4);
  if (splitAt < 6) splitAt = label.indexOf(" ", mid);
  if (splitAt < 0) return [label];
  return [label.slice(0, splitAt), label.slice(splitAt + 1)];
}
