"use client";

import { Play, Network, Sparkles, Layers2, MessageCircle } from "lucide-react";
import Link from "next/link";
import type { FilterSlide } from "@/lib/slide-content";

interface ConnectedActionsBarProps {
  slide: FilterSlide;
  onAskCoach: () => void;
}

export default function ConnectedActionsBar({ slide, onAskCoach }: ConnectedActionsBarProps) {
  const actions = [
    {
      label: "Video",
      icon: Play,
      href: `/topics/filter-types/video?chapter=${slide.videoChapterIndex}`,
      accent: "var(--accent-green)",
    },
    {
      label: "Mind Map",
      icon: Network,
      href: `/topics/filter-types/mindmap?highlight=${slide.id}`,
      accent: "var(--accent-sky)",
    },
    {
      label: "Quiz",
      icon: Sparkles,
      href: `/topics/filter-types/quiz?focus=${slide.id}`,
      accent: "var(--accent-navy)",
    },
    {
      label: "Flashcards",
      icon: Layers2,
      href: `/topics/filter-types/flashcards`,
      accent: "var(--accent-blue)",
    },
  ];

  return (
    <div className="flex items-center justify-between border-t border-[var(--border-default)] bg-[var(--bg-elevated)] px-4 py-4 backdrop-blur sm:px-6 lg:px-8">
      {/* Left side chip */}
      <div className="hidden sm:block">
        <span className="text-[11px] font-semibold uppercase tracking-widest text-[var(--text-muted)]">
          Connected to this filter
        </span>
      </div>

      {/* Right side actions */}
      <div className="flex w-full items-center justify-between sm:w-auto sm:justify-end sm:gap-3">
        {actions.map((action) => (
          <Link
            key={action.label}
            href={action.href}
            title={action.label}
            className="group flex h-10 items-center justify-center gap-2 rounded-lg border border-[var(--border-default)] bg-[var(--bg-surface)] px-0 sm:px-3.5 w-10 sm:w-auto transition-all duration-200 hover:border-transparent hover:shadow-sm"
            style={
              {
                "--action-accent": action.accent,
              } as React.CSSProperties
            }
          >
            <action.icon
              size={16}
              className="text-[var(--text-secondary)] transition-colors group-hover:text-[var(--action-accent)]"
            />
            <span className="hidden text-[13px] font-medium text-[var(--text-secondary)] transition-colors group-hover:text-[var(--action-accent)] sm:block">
              {action.label}
            </span>
          </Link>
        ))}

        <div className="h-6 w-px bg-[var(--border-default)] mx-1 sm:mx-0" />

        {/* Ask Coach (triggers drawer, doesn't route) */}
        <button
          onClick={onAskCoach}
          title="Ask Coach"
          className="group flex h-10 items-center justify-center gap-2 rounded-lg border border-[var(--border-default)] bg-[var(--bg-surface)] px-0 sm:px-3.5 w-10 sm:w-auto transition-all duration-200 hover:border-[var(--accent-sky)] hover:shadow-sm"
        >
          <MessageCircle
            size={16}
            className="text-[var(--text-secondary)] transition-colors group-hover:text-[var(--accent-sky)]"
          />
          <span className="hidden text-[13px] font-medium text-[var(--text-secondary)] transition-colors group-hover:text-[var(--accent-sky)] sm:block">
            Ask Coach
          </span>
        </button>
      </div>
    </div>
  );
}
