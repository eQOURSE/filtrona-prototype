"use client";

import { Sparkles } from "lucide-react";
import { useMemo } from "react";

type Role = "user" | "assistant";

interface MessageBubbleProps {
  role: Role;
  content: string;
  isError?: boolean;
  onRetry?: () => void;
}

/**
 * Lightweight markdown for assistant messages.
 * Supports: **bold**, *italic*, line breaks. No HTML from user content.
 *
 * Strategy: escape HTML, then run a small regex pass for the three formats,
 * then split on \n to render each line as a separate fragment with <br/>.
 */
function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function renderAssistantMarkdown(raw: string): string {
  const escaped = escapeHtml(raw);
  // Bold: **text** (non-greedy, no newline crossing)
  const withBold = escaped.replace(
    /\*\*([^*\n]+?)\*\*/g,
    "<strong>$1</strong>"
  );
  // Italic: *text* — avoid eating bolds (already replaced above) and
  // avoid bare * pairs spanning newlines
  const withItalic = withBold.replace(
    /(^|[^*])\*([^*\n]+?)\*(?!\*)/g,
    "$1<em>$2</em>"
  );
  // Line breaks
  return withItalic.replace(/\n/g, "<br/>");
}

export default function MessageBubble({
  role,
  content,
  isError = false,
  onRetry,
}: MessageBubbleProps) {
  const isUser = role === "user";

  const html = useMemo(
    () => (isUser ? null : renderAssistantMarkdown(content)),
    [isUser, content]
  );

  if (isUser) {
    return (
      <div className="flex w-full justify-end">
        <div
          className="max-w-[80%] rounded-2xl rounded-br-md px-4 py-3 text-[15px] leading-[1.55] text-[var(--text-primary)] sm:max-w-[75%]"
          style={{ backgroundColor: "var(--accent-blue-soft)" }}
        >
          {/* Render as plain text — never as HTML */}
          {content.split("\n").map((line, i, arr) => (
            <span key={i}>
              {line}
              {i < arr.length - 1 ? <br /> : null}
            </span>
          ))}
        </div>
      </div>
    );
  }

  // Assistant
  return (
    <div className="flex w-full flex-col items-start">
      <div className="mb-1.5 flex items-center gap-1.5">
        <Sparkles size={14} style={{ color: "var(--accent-blue)" }} />
        <span className="text-[12px] font-medium text-[var(--text-muted)]">
          Coach
        </span>
      </div>

      {isError ? (
        <div className="max-w-[85%] text-[15px] leading-[1.6]">
          <p className="text-[color-mix(in_srgb,var(--accent-orange)_70%,var(--text-secondary))]">
            {content}
          </p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="mt-2 inline-flex items-center rounded-lg border border-[var(--border-default)] bg-[var(--bg-surface)] px-3 py-1.5 text-[13px] font-medium text-[var(--text-primary)] transition-colors hover:border-[var(--accent-blue)] hover:bg-[var(--bg-elevated)]"
            >
              Retry
            </button>
          )}
        </div>
      ) : (
        <div
          className="max-w-[85%] text-[15px] leading-[1.6] text-[var(--text-primary)]"
          style={{ textWrap: "pretty" } as React.CSSProperties}
          // Markdown is rendered from a model response; user content is never
          // routed through this branch.
          dangerouslySetInnerHTML={{ __html: html ?? "" }}
        />
      )}
    </div>
  );
}
