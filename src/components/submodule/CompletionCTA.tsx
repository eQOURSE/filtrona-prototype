"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { useProgressStore, SubModuleId } from "@/lib/progress-store";

const EASE = [0.16, 1, 0.3, 1] as const;

interface CompletionCTAProps {
  topicSlug: string;
  subModuleId: SubModuleId;
  /** Headline for the CTA card. */
  headline?: string;
  /** Body line under the headline. */
  body?: string;
  /** Where to navigate after marking complete (defaults to module page). */
  returnHref?: string;
}

/**
 * Shared completion CTA used by the placeholder sub-modules
 * (video, mindmap, audio, gallery). Marks the sub-module complete
 * and bounces the user back to the module page.
 */
export default function CompletionCTA({
  topicSlug,
  subModuleId,
  headline = "Want to mark this complete?",
  body,
  returnHref,
}: CompletionCTAProps) {
  const router = useRouter();
  const prefersReducedMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);

  const markComplete = useProgressStore((s) => s.markComplete);
  const isComplete = useProgressStore((s) => s.isComplete);
  const alreadyComplete = mounted ? isComplete(topicSlug, subModuleId) : false;

  useEffect(() => setMounted(true), []);

  const handleComplete = () => {
    if (!alreadyComplete) markComplete(topicSlug, subModuleId);
    setTimeout(
      () => router.push(returnHref ?? `/topics/${topicSlug}`),
      600
    );
  };

  return (
    <motion.div
      className="mx-auto mt-16 max-w-[640px] rounded-2xl border border-[var(--border-default)] bg-[var(--bg-surface)] p-8 text-center"
      {...(!prefersReducedMotion
        ? {
            initial: { opacity: 0, y: 20 },
            whileInView: { opacity: 1, y: 0 },
            viewport: { once: true, margin: "-60px" },
            transition: { duration: 0.5, ease: EASE },
          }
        : {})}
    >
      <CheckCircle2
        size={36}
        className="mx-auto text-[var(--accent-green)]"
      />
      <h2 className="mt-3 text-[20px] font-semibold text-[var(--text-primary)]">
        {headline}
      </h2>
      {body && (
        <p className="mt-2 text-[14px] text-[var(--text-secondary)]">
          {alreadyComplete
            ? "This sub-module is already marked complete."
            : body}
        </p>
      )}
      <button
        onClick={handleComplete}
        className="mt-5 inline-flex cursor-pointer items-center gap-2 rounded-xl bg-[var(--accent-blue)] px-7 py-3 text-[14px] font-semibold text-[var(--bg-base)] shadow-blue-glow transition-all duration-300 hover:shadow-blue-glow-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-blue)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-base)]"
      >
        {alreadyComplete ? "Revisit completed ✓" : "Mark complete"}
      </button>
    </motion.div>
  );
}
