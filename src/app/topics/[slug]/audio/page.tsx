"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Play, Pause, SkipBack, SkipForward } from "lucide-react";
import TopNav from "@/components/TopNav";
import SubModuleHeader from "@/components/submodule/SubModuleHeader";
import CompletionCTA from "@/components/submodule/CompletionCTA";
import NonHistoryPlaceholder from "@/components/submodule/NonHistoryPlaceholder";
import { topics } from "@/lib/topics";

const EASE = [0.16, 1, 0.3, 1] as const;

const audioByTopic: Record<string, { idx: number; title: string; time: string; url?: string }[]> = {
  'history': [
    { idx: 1, title: "The Founding Story", time: "0:00" },
    { idx: 2, title: "From Patent to Production", time: "1:42" },
    { idx: 3, title: "Global Expansion", time: "3:18" },
    { idx: 4, title: "100 Years Later", time: "5:01" },
  ],
  'filter-types': [
    { idx: 1, title: "Intro", time: "0:00", url: "/audio/filter-types/intro.mp3" },
    { idx: 2, title: "CPS", time: "1:25", url: "/audio/filter-types/slide1.mp3" },
    { idx: 3, title: "COR", time: "2:15", url: "/audio/filter-types/slide2.mp3" },
    { idx: 4, title: "Coaxial Core", time: "3:00", url: "/audio/filter-types/slide3.mp3" },
    { idx: 5, title: "Corinthian", time: "3:45", url: "/audio/filter-types/slide4.mp3" },
    { idx: 6, title: "Vortex", time: "4:30", url: "/audio/filter-types/slide5.mp3" },
    { idx: 7, title: "Summary & CTA", time: "5:15", url: "/audio/filter-types/summary.mp3" },
    { idx: 8, title: "Closing", time: "6:00", url: "/audio/filter-types/closing.mp3" },
  ]
};

export default function AudioPage() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug;
  const prefersReducedMotion = useReducedMotion();
  const [showToast, setShowToast] = useState(false);
  const [listenedChapters, setListenedChapters] = useState<Set<number>>(new Set());

  const [activeIdx, setActiveIdx] = useState<number>(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [trackDuration, setTrackDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!showToast) return;
    const t = setTimeout(() => setShowToast(false), 3000);
    return () => clearTimeout(t);
  }, [showToast]);

  if (!(slug in audioByTopic)) return <NonHistoryPlaceholder slug={slug} kind="audio" />;

  const topic = topics.find((t) => t.slug === slug);
  const topicTitle = topic?.title ?? "Topic";
  const chapters = audioByTopic[slug] ?? [];
  const activeChapter = chapters.find(c => c.idx === activeIdx) ?? chapters[0];
  const globalDuration = slug === "filter-types" ? "7:00" : "6:24";

  const formatTime = (secs: number) => {
    if (!secs || isNaN(secs)) return "0:00";
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const handlePlayPause = () => {
    if (!activeChapter.url) {
      setShowToast(true);
      return;
    }
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const handleChapterEnd = () => {
    setListenedChapters((prev) => new Set(prev).add(activeIdx));
    if (activeIdx < chapters.length) {
      setActiveIdx(activeIdx + 1);
      setIsPlaying(true);
    } else {
      setIsPlaying(false);
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || !trackDuration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    audioRef.current.currentTime = percent * trackDuration;
  };

  const handleSkip = (dir: 1 | -1) => {
    if (audioRef.current) {
      audioRef.current.currentTime += dir * 10;
    }
  };

  useEffect(() => {
    if (activeChapter.url && isPlaying && audioRef.current) {
      audioRef.current.play().catch(() => setIsPlaying(false));
    }
  }, [activeIdx, activeChapter.url]);

  return (
    <div className="min-h-screen  text-[var(--text-primary)]">
      <TopNav />

      {/* Toast */}
      <div className="pointer-events-none fixed inset-x-0 top-[88px] z-[60] flex justify-center px-4">
        <AnimatePresence>
          {showToast && (
            <motion.div
              key="toast"
              className="pointer-events-auto rounded-xl border border-[var(--border-default)] bg-[var(--bg-surface)] px-4 py-3 text-[13px] text-[var(--text-primary)] shadow-lg"
              initial={
                !prefersReducedMotion ? { y: -16, opacity: 0 } : { opacity: 0 }
              }
              animate={{ y: 0, opacity: 1 }}
              exit={!prefersReducedMotion ? { y: -16, opacity: 0 } : { opacity: 0 }}
              transition={{ duration: 0.3, ease: EASE }}
              role="status"
              aria-live="polite"
            >
              Audio narration is scoped for v1.0 — the prototype demonstrates
              the player UI and chapter structure.
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <main className="mx-auto max-w-[900px] px-6 pt-6 pb-16">
        <SubModuleHeader
          topicSlug={slug}
          topicTitle={topicTitle}
          accent="navy"
          pillLabel="06 · AUDIO OVERVIEW"
          title="Listen to the story"
          subtitle={`A ${globalDuration.split(":")[0]}-minute narrated journey.`}
        />

        <div className="mt-6 rounded-xl border border-[color-mix(in_srgb,var(--accent-navy)_30%,transparent)] bg-[var(--accent-navy-soft)] px-4 py-3 text-[13px] font-medium text-[var(--accent-navy)]">
          💡 <strong className="font-semibold">Tip:</strong> Listen to all chapters below to unlock the completion button.
        </div>

        {/* Player card */}
        <div className="mt-4">
          <div
            className="mx-auto rounded-3xl border border-[var(--border-default)] bg-[var(--bg-surface)] p-6 sm:p-8"
            style={{ maxWidth: 640 }}
          >
            {/* Album art */}
            <div
              className="mx-auto flex aspect-square w-full max-w-[240px] flex-col items-center justify-center rounded-2xl text-center text-white"
              style={{
                background:
                  "linear-gradient(135deg, var(--accent-blue) 0%, var(--accent-navy) 50%, var(--accent-red) 100%)",
              }}
            >
              <span
                className="text-[12px] font-bold uppercase tracking-[0.2em]"
                style={{ opacity: 0.92 }}
              >
                {topicTitle}
              </span>
              <span
                className="mt-2 text-[10px] font-semibold uppercase tracking-[0.18em]"
                style={{ opacity: 0.85 }}
              >
                Audio Overview · {globalDuration}
              </span>
            </div>

            <div className="mt-6 text-center">
              <h2 className="text-[18px] font-semibold text-[var(--text-primary)]">
                {topicTitle} · Chapter {activeChapter?.idx}
              </h2>
              <p className="mt-1 text-[13px] text-[var(--text-muted)]">
                {activeChapter.title}
              </p>
            </div>

            {/* Progress bar */}
            <div className="mt-6">
              <div 
                className="h-[6px] w-full rounded-full bg-[var(--border-default)] cursor-pointer relative overflow-hidden"
                onClick={handleSeek}
              >
                <div
                  className="h-full rounded-full bg-[var(--accent-blue)] transition-all duration-100 ease-linear pointer-events-none"
                  style={{ width: `${trackDuration ? (currentTime / trackDuration) * 100 : 0}%` }}
                />
              </div>
              <div className="mt-1.5 flex justify-between text-[12px] font-mono text-[var(--text-muted)]">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(trackDuration)}</span>
              </div>
            </div>

            {/* Controls */}
            <div className="mt-4 flex items-center justify-center gap-6">
              <button
                aria-label="Skip back"
                onClick={() => handleSkip(-1)}
                className="flex h-10 w-10 items-center justify-center rounded-full text-[var(--text-secondary)] transition-colors hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)]"
              >
                <SkipBack size={20} />
              </button>

              <button
                aria-label={isPlaying ? "Pause" : "Play"}
                onClick={handlePlayPause}
                className="group flex h-16 w-16 items-center justify-center rounded-full bg-[var(--accent-blue)] transition-transform duration-200 hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-blue)] focus-visible:ring-offset-4 focus-visible:ring-offset-[var(--bg-surface)]"
                style={{
                  boxShadow:
                    "0 0 32px color-mix(in srgb, var(--accent-blue) 45%, transparent)",
                }}
              >
                {isPlaying ? (
                  <Pause
                    size={22}
                    strokeWidth={2}
                    className="fill-[var(--bg-base)] text-[var(--bg-base)]"
                  />
                ) : (
                  <Play
                    size={22}
                    strokeWidth={2}
                    className="ml-1 fill-[var(--bg-base)] text-[var(--bg-base)]"
                  />
                )}
              </button>

              <button
                aria-label="Skip forward"
                onClick={() => handleSkip(1)}
                className="flex h-10 w-10 items-center justify-center rounded-full text-[var(--text-secondary)] transition-colors hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)]"
              >
                <SkipForward size={20} />
              </button>
            </div>

            {/* Chapter list */}
            <ul className="mt-6 space-y-1">
              {chapters.map((c) => {
                const isListened = listenedChapters.has(c.idx);
                return (
                  <li key={c.idx}>
                    <button
                      onClick={() => {
                        if (!c.url) {
                          setShowToast(true);
                          return;
                        }
                        setActiveIdx(c.idx);
                        setIsPlaying(true);
                        setListenedChapters((prev) => new Set(prev).add(c.idx));
                      }}
                      className={`flex w-full items-center justify-between rounded-lg px-3 py-3 text-left text-[13px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-navy)] ${
                        activeIdx === c.idx
                          ? "bg-[var(--accent-navy-soft)] text-[var(--text-primary)]"
                          : isListened
                          ? "text-[var(--text-secondary)]"
                          : "text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)]"
                      }`}
                    >
                      <span>
                        <span className="font-semibold">{c.idx}</span>{" "}
                        <span className="text-[var(--text-muted)]">·</span>{" "}
                        {c.title}{" "}
                        <span className="text-[var(--text-muted)]">·</span>{" "}
                        <span className="font-mono text-[12px] text-[var(--text-muted)]">
                          {c.time}
                        </span>
                      </span>
                      {isListened ? (
                        <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--accent-navy)]">
                          Listened ✓
                        </span>
                      ) : (
                        <Play size={10} className="text-[var(--text-muted)]" />
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        <AnimatePresence>
          {listenedChapters.size === chapters.length && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <CompletionCTA
                topicSlug={slug}
                subModuleId="audio"
                headline="Want to mark this complete?"
                body="Mark the audio overview sub-module complete and head back to the module."
              />
            </motion.div>
          )}
        </AnimatePresence>

        {activeChapter?.url && (
          <audio
            ref={audioRef}
            src={activeChapter.url}
            onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
            onLoadedMetadata={(e) => setTrackDuration(e.currentTarget.duration)}
            onEnded={handleChapterEnd}
            className="hidden"
          />
        )}
      </main>
    </div>
  );
}
