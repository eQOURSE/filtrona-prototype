"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useProgressStore } from "@/lib/progress-store";

export default function TopNav() {
  const [mounted, setMounted] = useState(false);
  const getOverallProgress = useProgressStore((s) => s.getOverallProgress);

  useEffect(() => setMounted(true), []);

  // SSR-safe: show 0% until mounted, then read real progress
  const percent = mounted ? getOverallProgress() : 0;

  return (
    <header className="sticky top-0 z-50 flex h-[72px] w-full items-center justify-between border-b border-[var(--border-default)] bg-[var(--bg-base)]/80 px-6 backdrop-blur-xl md:px-10">
      
      {/* ── Left: Wordmark + SVG filter mark (Link to Home) ───────── */}
      <Link href="/" className="flex items-center gap-2.5 outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-mint)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-base)] rounded-lg p-1">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
          className="shrink-0"
        >
          <rect x="3" y="4" width="4" height="16" rx="1.5" fill="var(--accent-mint)" opacity="0.9" />
          <rect x="10" y="6" width="4" height="12" rx="1.5" fill="var(--accent-mint)" opacity="0.6" />
          <rect x="17" y="8" width="4" height="8" rx="1.5" fill="var(--accent-mint)" opacity="0.35" />
        </svg>
        <span className="text-sm font-semibold tracking-[0.08em] text-[var(--text-primary)]">
          FILTRONA ACADEMY
        </span>
      </Link>

      {/* ── Center: Overall progress bar (hidden on mobile for space) ─ */}
      <div className="hidden flex-col items-center gap-1.5 sm:flex">
        <div className="h-1 w-[240px] rounded-full bg-[var(--border-default)]" aria-hidden="true">
          <div
            className="h-full rounded-full bg-[var(--accent-mint)] transition-all duration-600 ease-out"
            style={{ width: `${percent}%` }}
          />
        </div>
        <span className="text-[11px] font-medium tracking-wider uppercase text-[var(--text-muted)]">
          Overall progress · {percent}%
        </span>
      </div>

      {/* ── Right: Theme Toggle + Profile avatar ─────────────────────── */}
      <div className="flex items-center gap-4">
        {/* Mobile progress label (smaller, shown instead of bar) */}
        <span className="text-[10px] font-medium tracking-wider uppercase text-[var(--text-muted)] sm:hidden">
          {percent}% COMPLETE
        </span>
        <div 
          className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--bg-elevated)] border border-[var(--border-default)] text-sm font-semibold text-[var(--accent-mint)]"
          aria-label="User profile avatar"
        >
          F
        </div>
      </div>

    </header>
  );
}
