"use client";

interface SuggestedPromptsProps {
  topicSlug: string;
  onPick: (text: string) => void;
  prompts?: string[];
}

const HISTORY_PROMPTS = [
  "Who was Boris Aivaz and why does he matter?",
  "What happened between 2013 and 2022?",
  "Where is Filtrona today?",
  "Why did the company change names so many times?",
];

const FILTER_TYPES_PROMPTS = [
  "What's the difference between CPS and COR?",
  "Which filter has the patented flutes?",
  "When would I recommend Vortex to a customer?",
  "What makes Coaxial Core visually distinct?",
];

export default function SuggestedPrompts({ topicSlug, onPick, prompts: overridePrompts }: SuggestedPromptsProps) {
  const prompts = overridePrompts || (topicSlug === "filter-types" ? FILTER_TYPES_PROMPTS : HISTORY_PROMPTS);

  return (
    <div className="grid w-full max-w-[560px] grid-cols-1 gap-2.5 sm:grid-cols-2">
      {prompts.map((p) => (
        <button
          key={p}
          onClick={() => onPick(p)}
          className="group rounded-xl border border-[var(--border-default)] bg-[var(--bg-surface)] px-[18px] py-[14px] text-left text-[14px] leading-[1.4] text-[var(--text-secondary)] transition-all duration-200 hover:-translate-y-px hover:border-[color-mix(in_srgb,var(--accent-blue)_40%,var(--border-default))] hover:text-[var(--text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-blue)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-base)]"
        >
          {p}
        </button>
      ))}
    </div>
  );
}
