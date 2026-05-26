"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, Sparkles } from "lucide-react";
import ChatInterface from "../chat/ChatInterface";

interface CoachDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  filterName: string;
  currentFilterId: string;
}

const PROMPTS_BY_FILTER: Record<string, string[]> = {
  cps: [
    "How is CPS different from a normal filter?",
    "What is cross-flow technology?",
    "When should I recommend CPS?",
    "How is it tested?",
  ],
  cor: [
    "How does tip ventilation work?",
    "Why CO and not tar?",
    "What's the trade-off with ventilation?",
    "Which brands use COR?",
  ],
  ccf: [
    "Why is it called coaxial?",
    "Can the inner core be any color?",
    "How does retention vary?",
    "Show me a customer use case",
  ],
  corinthian: [
    "What are the flutes for?",
    "Why is it patented?",
    "How does draw resistance work?",
    "What makes the mouth-feel distinct?",
  ],
  vortex: [
    "How does the spiral change flavour?",
    "What is 'harshness reduction'?",
    "Why is the twist visible?",
    "When to choose Vortex over Corinthian?",
  ],
};

export default function CoachDrawer({
  isOpen,
  onClose,
  filterName,
  currentFilterId,
}: CoachDrawerProps) {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const prompts = PROMPTS_BY_FILTER[currentFilterId] || [];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-0 right-0 top-[72px] z-50 flex w-full max-w-[420px] flex-col border-l border-[var(--border-default)] bg-[var(--bg-surface)] shadow-2xl"
            style={{ height: "calc(100vh - 72px)" }}
            role="dialog"
            aria-modal="true"
            aria-label={`Ask the Coach about ${filterName}`}
          >
            {/* Header */}
            <div className="flex shrink-0 items-center justify-between border-b border-[var(--border-default)] px-5 py-4">
              <div className="flex items-center gap-2">
                <Sparkles size={16} style={{ color: "var(--accent-blue)" }} />
                <h3 className="text-[16px] font-semibold text-[var(--text-primary)]">
                  Ask the Coach about {filterName}
                </h3>
              </div>
              <button
                onClick={onClose}
                className="rounded-md p-1.5 text-[var(--text-muted)] transition-colors hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)]"
              >
                <X size={18} />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-hidden px-4 pb-4">
              <ChatInterface
                topicSlug="filter-types"
                currentFilter={filterName}
                suggestedPromptsOverride={prompts}
                compact
              />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
