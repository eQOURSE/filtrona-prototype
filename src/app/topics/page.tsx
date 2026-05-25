"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import TopNav from "@/components/TopNav";
import TopicCard from "@/components/TopicCard";
import { topics } from "@/lib/topics";

/* ── Animation parameters ────────────────────────────────────── */
const EASE = [0.16, 1, 0.3, 1] as const;

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: EASE,
    },
  },
};

export default function TopicsPage() {
  const prefersReducedMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen bg-[var(--bg-base)] text-[var(--text-primary)]">
      {/* Persistent Navigation */}
      <TopNav />

      {/* Main Content Area */}
      <main className="mx-auto max-w-[1280px] px-4 py-16 sm:px-8 md:py-20">
        
        {/* Page Title & Subtitle */}
        <header className="mb-10 text-left">
          <h1 className="text-[28px] font-bold tracking-[-0.02em] text-[var(--text-primary)] md:text-[40px]">
            Choose your path
          </h1>
          <p className="mt-2.5 text-sm text-[var(--text-secondary)] sm:text-base">
            Two modules are ready for the prototype. The rest are next.
          </p>
        </header>

        {/* Grid Layout of Topic Cards */}
        {mounted && !prefersReducedMotion ? (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
          >
            {topics.map((topic) => (
              <motion.div key={topic.slug} variants={cardVariants}>
                <TopicCard topic={topic} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {topics.map((topic) => (
              <div key={topic.slug}>
                <TopicCard topic={topic} />
              </div>
            ))}
          </div>
        )}

      </main>
    </div>
  );
}
