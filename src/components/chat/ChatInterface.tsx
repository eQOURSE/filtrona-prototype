"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  KeyboardEvent,
} from "react";
import { ArrowUp, Sparkles, Trash2, X } from "lucide-react";
import { useReducedMotion } from "framer-motion";
import MessageBubble from "./MessageBubble";
import SuggestedPrompts from "./SuggestedPrompts";
import { useProgressStore } from "@/lib/progress-store";

type Role = "user" | "assistant";

type ChatMessage = {
  id: string;
  role: Role;
  content: string;
  isError?: boolean;
};

interface ChatInterfaceProps {
  topicSlug: string;
  currentFilter?: string;
  suggestedPromptsOverride?: string[];
  compact?: boolean;
}

const STORAGE_PREFIX = "filtrona-chat-history";

function newId() {
  return `m-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export default function ChatInterface({
  topicSlug,
  currentFilter,
  suggestedPromptsOverride,
  compact,
}: ChatInterfaceProps) {
  const prefersReducedMotion = useReducedMotion();
  const storageKey = `${STORAGE_PREFIX}:${topicSlug}`;

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [bannerDismissed, setBannerDismissed] = useState(false);

  const markComplete = useProgressStore((s) => s.markComplete);
  const isCompleteCheck = useProgressStore((s) => s.isComplete);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  /* ── Hydrate from localStorage ──────────────────────────────── */
  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        const parsed = JSON.parse(raw) as ChatMessage[];
        if (Array.isArray(parsed)) setMessages(parsed);
      }
    } catch {
      // ignore corrupt storage
    }
    setHydrated(true);
  }, [storageKey]);

  /* ── Persist on change ──────────────────────────────────────── */
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(storageKey, JSON.stringify(messages));
    } catch {
      // ignore quota errors
    }
  }, [messages, storageKey, hydrated]);

  /* ── Auto-scroll: run after DOM has painted, depend on both
        message count and loading state so the typing indicator is
        scrolled into view too. ──────────────────────────────── */
  useEffect(() => {
    const id = requestAnimationFrame(() => {
      const node = messagesEndRef.current;
      if (!node) return;
      node.scrollIntoView({
        behavior: prefersReducedMotion ? "auto" : "smooth",
        block: "end",
      });
    });
    return () => cancelAnimationFrame(id);
  }, [messages, isLoading, prefersReducedMotion]);

  /* ── Auto-grow textarea (max ~4 lines) ──────────────────────── */
  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    const max = 24 * 4 + 28; // line-height ~24px × 4 + vertical padding
    ta.style.height = Math.min(ta.scrollHeight, max) + "px";
  }, [input]);

  /* ── Send a message ─────────────────────────────────────────── */
  const send = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || isLoading) return;

      const userMsg: ChatMessage = {
        id: newId(),
        role: "user",
        content: trimmed,
      };

      // Snapshot the conversation we'll send to the API, dropping any prior
      // error placeholders so we don't replay them as assistant turns.
      const cleanHistory = messages.filter((m) => !m.isError);
      const nextForApi = [...cleanHistory, userMsg];

      // Strip prior error bubbles from the UI as well — they should disappear
      // on the next user attempt.
      setMessages([...cleanHistory, userMsg]);
      setInput("");
      setIsLoading(true);

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            topicSlug,
            currentFilter,
            messages: nextForApi.map(({ role, content }) => ({
              role,
              content,
            })),
          }),
        });

        const data = (await res.json().catch(() => null)) as {
          message?: string;
          error?: string;
        } | null;

        if (!res.ok || !data?.message) {
          throw new Error(
            data?.error || `Request failed with status ${res.status}`
          );
        }

        setMessages((prev) => [
          ...prev,
          { id: newId(), role: "assistant", content: data.message! },
        ]);
      } catch (err) {
        const _ = err;
        void _;
        setMessages((prev) => [
          ...prev,
          {
            id: newId(),
            role: "assistant",
            isError: true,
            content:
              "I'm having trouble reaching the API right now. Try again in a moment.",
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading, messages, topicSlug, currentFilter]
  );

  /* ── Retry the most recent user message ─────────────────────── */
  const handleRetry = useCallback(() => {
    const lastUser = [...messages].reverse().find((m) => m.role === "user");
    if (!lastUser) return;
    const idx = messages.findIndex((m) => m.id === lastUser.id);
    setMessages(messages.slice(0, idx + 1));
    void send(lastUser.content);
  }, [messages, send]);

  /* ── Submit handlers ────────────────────────────────────────── */
  const handleSubmit = () => {
    const text = input.trim();
    if (!text) return;
    void send(text);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  /* ── Clear conversation ─────────────────────────────────────── */
  const handleClear = () => {
    if (messages.length === 0) return;
    const ok = window.confirm(
      "Clear this conversation? This can't be undone."
    );
    if (!ok) return;
    setMessages([]);
    try {
      localStorage.removeItem(storageKey);
    } catch {
      // ignore
    }
    setBannerDismissed(false);
  };

  /* ── Mark complete banner logic ─────────────────────────────── */
  const userMessageCount = messages.filter((m) => m.role === "user").length;
  const alreadyComplete = hydrated
    ? isCompleteCheck(topicSlug, "chatbot")
    : false;
  const showBanner =
    !compact && hydrated && userMessageCount >= 3 && !alreadyComplete && !bannerDismissed;

  const handleMarkComplete = () => {
    markComplete(topicSlug, "chatbot");
    setBannerDismissed(true);
  };

  /* ── Render ─────────────────────────────────────────────────── */
  const sendDisabled = !input.trim() || isLoading;
  const hasMessages = hydrated && messages.length > 0;

  return (
    <section
      className="flex h-full flex-col"
      aria-label="Filtrona Coach chat"
    >
      {/* Top toolbar row — always present so the messages area stays in
          a consistent vertical rhythm, but the Clear button only shows
          once there's something to clear. */}
      <div className="flex h-7 flex-shrink-0 items-center justify-end">
        {hasMessages && (
          <button
            onClick={handleClear}
            className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--border-default)] bg-[var(--bg-elevated)] px-3 py-1.5 text-[12px] font-medium text-[var(--text-muted)] transition-colors hover:border-[color-mix(in_srgb,#d91f29_40%,var(--border-default))] hover:text-[#d91f29]"
            aria-label="Clear conversation"
          >
            <Trash2 size={14} />
            <span>Clear</span>
          </button>
        )}
      </div>

      {/* Messages list — fills remaining space, internally scrollable */}
      <div
        ref={scrollContainerRef}
        className="mt-4 flex-1 overflow-y-auto"
        style={{ scrollBehavior: prefersReducedMotion ? "auto" : "smooth" }}
      >
        {/* Mark-complete banner — sticky inside the scroll container */}
        {showBanner && (
          <div
            className="sticky top-0 z-10 -mx-1 mb-4 flex flex-wrap items-center justify-between gap-3 border-b px-5 py-3 backdrop-blur-md"
            style={{
              backgroundColor:
                "color-mix(in srgb, var(--bg-base) 85%, transparent)",
              borderColor: "var(--border-default)",
            }}
          >
            <div className="flex items-center gap-2">
              <Sparkles
                size={16}
                style={{ color: "var(--accent-blue)" }}
              />
              <span className="text-[14px] text-[var(--text-primary)]">
                Nice conversation! Mark this sub-module complete?
              </span>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={handleMarkComplete}
                className="rounded-lg bg-[var(--accent-blue)] px-4 py-2 text-[13px] font-semibold text-[var(--bg-base)] transition-opacity hover:opacity-90"
              >
                Mark complete
              </button>
              <button
                onClick={() => setBannerDismissed(true)}
                aria-label="Dismiss banner"
                className="ml-1 inline-flex h-7 w-7 items-center justify-center rounded-md text-[var(--text-muted)] transition-colors hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)]"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        )}

        {!hasMessages && hydrated ? (
          <EmptyState
            topicSlug={topicSlug}
            onPick={(t) => void send(t)}
            suggestedPromptsOverride={suggestedPromptsOverride}
          />
        ) : (
          <div className="flex flex-col gap-4 px-1 pt-1">
            {messages.map((m) => (
              <MessageBubble
                key={m.id}
                role={m.role}
                content={m.content}
                isError={m.isError}
                onRetry={m.isError ? handleRetry : undefined}
              />
            ))}

            {isLoading && (
              <div className="flex items-center gap-1.5 pt-1">
                {prefersReducedMotion ? (
                  <span className="text-[14px] text-[var(--text-muted)]">
                    Coach is typing...
                  </span>
                ) : (
                  <>
                    <span className="coach-typing-dot" aria-hidden="true" />
                    <span className="coach-typing-dot" aria-hidden="true" />
                    <span className="coach-typing-dot" aria-hidden="true" />
                    <span className="sr-only">Coach is typing</span>
                  </>
                )}
              </div>
            )}

            {/* End sentinel for auto-scroll */}
            <div ref={messagesEndRef} className="h-px w-full" />
          </div>
        )}
      </div>

      {/* Bottom input area — sticks to the bottom of this container */}
      <div
        className="flex-shrink-0 pt-4"
        style={{
          background:
            "linear-gradient(to bottom, transparent 0%, var(--bg-base) 16px, var(--bg-base) 100%)",
        }}
      >
        <div className="flex items-end gap-3">
          <div className="flex-1">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={`Ask the Coach anything about ${topicSlug === 'filter-types' ? 'the filters' : 'Filtrona\'s story'}...`}
              rows={1}
              disabled={isLoading}
              className="block w-full resize-none rounded-2xl border border-[var(--border-default)] bg-[var(--bg-surface)] px-[18px] py-[14px] text-[14px] leading-[1.5] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] outline-none transition-colors focus:border-[color-mix(in_srgb,var(--accent-sky)_60%,var(--border-default))] disabled:opacity-60"
              style={{ maxHeight: 124 }}
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={sendDisabled}
            aria-label="Send message"
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[var(--accent-navy)] text-white transition-all duration-200 hover:opacity-95 active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ArrowUp size={20} strokeWidth={2.25} />
          </button>
        </div>

        <p className="mt-2 text-[11px] text-[var(--text-muted)]">
          AI responses may occasionally be imperfect. Verify important facts
          with the source material.
        </p>
      </div>
    </section>
  );
}

function EmptyState({
  topicSlug,
  onPick,
  suggestedPromptsOverride,
}: {
  topicSlug: string;
  onPick: (text: string) => void;
  suggestedPromptsOverride?: string[];
}) {
  return (
    <div className="flex h-full min-h-[400px] flex-col items-center justify-center px-4 text-center">
      <div
        className="flex h-[88px] w-[88px] items-center justify-center rounded-full"
        style={{ backgroundColor: "var(--accent-sky-soft)" }}
      >
        <Sparkles
          size={56}
          strokeWidth={1.75}
          style={{ color: "var(--accent-sky)" }}
        />
      </div>

      <h2 className="mt-4 text-[24px] font-semibold text-[var(--text-primary)]">
        Hi! I&apos;m your Filtrona Coach.
      </h2>

      <p className="mt-2 max-w-[520px] text-[15px] leading-[1.6] text-[var(--text-secondary)]">
        {topicSlug === "filter-types" 
          ? "I know everything from the Performance Range- Filters That Make a Difference module. Ask me anything about CPS, COR, Coaxial Core, Corinthian, or Vortex." 
          : "I know everything from The Filtrona Story module. Ask me anything about the company's history, key people, or what makes Filtrona what it is today."}
      </p>

      <div className="mt-6">
        <SuggestedPrompts
          topicSlug={topicSlug}
          onPick={onPick}
          prompts={suggestedPromptsOverride}
        />
      </div>
    </div>
  );
}
