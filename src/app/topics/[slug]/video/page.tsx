"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  SkipBack,
  SkipForward,
  CheckCircle2,
} from "lucide-react";
import TopNav from "@/components/TopNav";
import SubModuleHeader from "@/components/submodule/SubModuleHeader";
import CompletionCTA from "@/components/submodule/CompletionCTA";
import NonHistoryPlaceholder from "@/components/submodule/NonHistoryPlaceholder";
import { topics } from "@/lib/topics";

/* ── Chapter definitions ─────────────────────────────────────────── */
// Timestamps in seconds
interface Chapter {
  num: string;
  id: string;
  title: string;
  desc: string;
  startSec: number;
  endSec: number;
  range: string;
}

const videoByTopic: Record<string, { src: string; chapters: Chapter[] }> = {
  "filter-types": {
    src: "https://59tysptfzd8nibqr.public.blob.vercel-storage.com/filtrona-video.mp4",
    chapters: [
      {
        num: "01",
        id: "intro",
        title: "Introduction",
        desc: "Welcome to the Filtrona Performance Range — filters that make a difference.",
        startSec: 0,
        endSec: 53,
        range: "0:00 – 0:53",
      },
      {
        num: "02",
        id: "cps",
        title: "CPS",
        desc: "Combined Performance Superior — cross-flow tar reduction.",
        startSec: 54,
        endSec: 82,
        range: "0:54 – 1:22",
      },
      {
        num: "03",
        id: "cor",
        title: "COR",
        desc: "Carbon Monoxide Reducing — high tip ventilation engineered to lower CO.",
        startSec: 83,
        endSec: 107,
        range: "1:23 – 1:47",
      },
      {
        num: "04",
        id: "ccf",
        title: "Coaxial Core (CCF)",
        desc: "When the cross-section becomes part of the brand — shaped, coloured cores.",
        startSec: 108,
        endSec: 143,
        range: "1:48 – 2:23",
      },
      {
        num: "05",
        id: "corinthian",
        title: "Corinthian™",
        desc: "Precision-formed flutes — a patented draw-resistance signature.",
        startSec: 144,
        endSec: 178,
        range: "2:24 – 2:58",
      },
      {
        num: "06",
        id: "vortex",
        title: "Vortex™",
        desc: "A twist inside — spiral airflow engineered for flavour delivery.",
        startSec: 179,
        endSec: 209,
        range: "2:59 – 3:29",
      },
      {
        num: "07",
        id: "thankyou",
        title: "Thank You",
        desc: "You've explored all Filtrona Performance Range filters.",
        startSec: 210,
        endSec: 234,
        range: "3:30 – 3:54",
      },
    ],
  },
  history: {
    src: "https://59tysptfzd8nibqr.public.blob.vercel-storage.com/filtrona-video.mp4",
    chapters: [
      {
        num: "01",
        id: "founding",
        title: "The Founding Years",
        desc: "1854 to 1924 — from Bratislava haberdashery to Aivaz's patent.",
        startSec: 0,
        endSec: 58,
        range: "0:00 – 0:58",
      },
      {
        num: "02",
        id: "century",
        title: "A Century of Filters",
        desc: "1927 production, Jarrow, the global expansion.",
        startSec: 58,
        endSec: 134,
        range: "0:58 – 2:14",
      },
      {
        num: "03",
        id: "today",
        title: "Filtrona Today",
        desc: "100 years on — Singapore HQ, 11 sites, 120 countries.",
        startSec: 134,
        endSec: 204,
        range: "2:14 – 3:24",
      },
    ],
  },
};

/* ── Helpers ─────────────────────────────────────────────────────── */
function formatTime(sec: number): string {
  if (!isFinite(sec)) return "0:00";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function pad(n: number) {
  return n.toString().padStart(2, "0");
}

/* ── Main Page ───────────────────────────────────────────────────── */
export default function VideoPage() {
  const params = useParams<{ slug: string }>();
  const searchParams = useSearchParams();
  const slug = params.slug;

  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [viewedChapters, setViewedChapters] = useState<Set<string>>(new Set());
  const [activeChapterId, setActiveChapterId] = useState<string | null>(null);
  const [videoError, setVideoError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const controlsTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  if (!(slug in videoByTopic)) return <NonHistoryPlaceholder slug={slug} kind="video" />;

  const topic = topics.find((t) => t.slug === slug);
  const topicTitle = topic?.title ?? "Topic";
  const { src, chapters } = videoByTopic[slug];

  // Handle ?chapter=N or ?timestamp=filterId from ConnectedActionsBar
  useEffect(() => {
    const chapterParam = searchParams.get("chapter");
    const timestampParam = searchParams.get("timestamp");
    const video = videoRef.current;
    if (!video || !isLoaded) return;

    if (timestampParam) {
      // Find chapter by id
      const ch = chapters.find((c) => c.id === timestampParam);
      if (ch) {
        video.currentTime = ch.startSec;
        video.play().catch(() => {});
        setActiveChapterId(ch.id);
        setViewedChapters((p) => new Set(p).add(ch.id));
      }
    } else if (chapterParam !== null) {
      const idx = parseInt(chapterParam, 10);
      const ch = chapters[idx];
      if (ch) {
        video.currentTime = ch.startSec;
        video.play().catch(() => {});
        setActiveChapterId(ch.id);
        setViewedChapters((p) => new Set(p).add(ch.id));
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded]);

  // Track active chapter based on current time
  useEffect(() => {
    const ch = chapters.find(
      (c) => currentTime >= c.startSec && currentTime <= c.endSec
    );
    if (ch && ch.id !== activeChapterId) {
      setActiveChapterId(ch.id);
    }
  }, [currentTime, chapters, activeChapterId]);

  // Mark chapter as viewed when we cross its start
  useEffect(() => {
    if (activeChapterId) {
      setViewedChapters((p) => {
        if (p.has(activeChapterId)) return p;
        const next = new Set(p);
        next.add(activeChapterId);
        return next;
      });
    }
  }, [activeChapterId]);

  /* Controls auto-hide */
  const resetControlsTimer = useCallback(() => {
    setShowControls(true);
    if (controlsTimerRef.current) clearTimeout(controlsTimerRef.current);
    controlsTimerRef.current = setTimeout(() => {
      if (videoRef.current && !videoRef.current.paused) {
        setShowControls(false);
      }
    }, 3000);
  }, []);

  /* Video event handlers */
  const handleTimeUpdate = () => {
    if (videoRef.current) setCurrentTime(videoRef.current.currentTime);
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
      setIsLoaded(true);
    }
  };

  const handlePlay = () => setIsPlaying(true);
  const handlePause = () => {
    setIsPlaying(false);
    setShowControls(true);
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setShowControls(true);
  };

  /* Controls actions */
  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      v.play().catch(() => {});
    } else {
      v.pause();
    }
    resetControlsTimer();
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const v = videoRef.current;
    const bar = progressRef.current;
    if (!v || !bar || !duration) return;
    const rect = bar.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    v.currentTime = ratio * duration;
    resetControlsTimer();
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = videoRef.current;
    const val = parseFloat(e.target.value);
    if (!v) return;
    v.volume = val;
    v.muted = val === 0;
    setVolume(val);
    setIsMuted(val === 0);
  };

  const toggleMute = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setIsMuted(v.muted);
  };

  const toggleFullscreen = () => {
    const el = containerRef.current;
    if (!el) return;
    if (!document.fullscreenElement) {
      el.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  useEffect(() => {
    const onFsChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onFsChange);
    return () => document.removeEventListener("fullscreenchange", onFsChange);
  }, []);

  const skipChapter = (dir: 1 | -1) => {
    const idx = chapters.findIndex((c) => c.id === activeChapterId);
    const next = chapters[idx + dir];
    if (!next || !videoRef.current) return;
    videoRef.current.currentTime = next.startSec;
    videoRef.current.play().catch(() => {});
    resetControlsTimer();
  };

  const jumpToChapter = (ch: Chapter) => {
    const v = videoRef.current;
    if (!v) return;
    v.currentTime = ch.startSec;
    v.play().catch(() => {});
    setViewedChapters((p) => new Set(p).add(ch.id));
    resetControlsTimer();
  };

  const progressPct = duration ? (currentTime / duration) * 100 : 0;
  const allChapterIds = chapters.map((c) => c.id);
  const allViewed = allChapterIds.every((id) => viewedChapters.has(id));

  return (
    <div className="min-h-screen text-[var(--text-primary)]">
      <TopNav />

      <main className="mx-auto max-w-[900px] px-6 pt-6 pb-16">
        <SubModuleHeader
          topicSlug={slug}
          topicTitle={topicTitle}
          accent="green"
          pillLabel="03 · VIDEO GALLERY"
          title="Filtrona at 100"
          subtitle="A three-minute film on a century of filter innovation. Click any chapter card below to jump to that moment."
        />

        {/* Tip banner */}
        <div className="mt-6 rounded-xl border border-[color-mix(in_srgb,var(--accent-red)_30%,transparent)] bg-[var(--accent-red-soft)] px-4 py-3 text-[13px] font-medium text-[var(--accent-red)]">
          💡 <strong className="font-semibold">Tip:</strong> Click any chapter card to jump to that section of the video.
        </div>

        {/* ── Video Player ─────────────────────────────────────────────── */}
        <div className="mt-4">
          <div
            ref={containerRef}
            className="relative w-full overflow-hidden rounded-2xl border border-[var(--border-default)] bg-black group"
            style={{ aspectRatio: "16 / 9" }}
            onMouseMove={resetControlsTimer}
            onMouseEnter={resetControlsTimer}
            onMouseLeave={() => {
              if (isPlaying) setShowControls(false);
            }}
            onClick={togglePlay}
          >
            {/* Actual video */}
            <video
              ref={videoRef}
              src={src}
              className="h-full w-full object-contain"
              preload="metadata"
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
              onPlay={handlePlay}
              onPause={handlePause}
              onEnded={handleEnded}
              onError={() => setVideoError(true)}
              playsInline
            />

            {/* Error overlay */}
            {videoError && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/80">
                <p className="text-white/70 text-sm text-center px-6">
                  Could not load video. Make sure the file exists at <code>/filtrona-video.mp4</code>.
                </p>
              </div>
            )}

            {/* Centre play/pause flash */}
            <AnimatePresence>
              {!isPlaying && !videoError && (
                <motion.div
                  key="play-icon"
                  className="pointer-events-none absolute inset-0 flex items-center justify-center"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.2 }}
                  transition={{ duration: 0.2 }}
                >
                  <div
                    className="flex h-20 w-20 items-center justify-center rounded-full"
                    style={{
                      background: "var(--accent-blue)",
                      boxShadow:
                        "0 0 60px color-mix(in srgb, var(--accent-blue) 50%, transparent)",
                    }}
                  >
                    <Play size={32} className="ml-1 fill-white text-white" />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Active chapter badge */}
            {activeChapterId && (
              <motion.div
                key={activeChapterId}
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute left-4 top-4 z-[3] rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.1em] backdrop-blur-sm"
                style={{
                  background: "color-mix(in srgb, var(--accent-blue) 80%, transparent)",
                  color: "white",
                  border: "1px solid color-mix(in srgb, var(--accent-blue) 40%, transparent)",
                }}
              >
                {chapters.find((c) => c.id === activeChapterId)?.title}
              </motion.div>
            )}

            {/* ── Controls overlay ──────────────────────────────────────── */}
            <AnimatePresence>
              {showControls && (
                <motion.div
                  key="controls"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="absolute inset-x-0 bottom-0 z-[4]"
                  style={{
                    background:
                      "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.5) 60%, transparent 100%)",
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Chapter tick marks on progress bar */}
                  <div className="px-4 pt-4">
                    {/* Progress bar */}
                    <div
                      ref={progressRef}
                      className="relative h-[4px] w-full cursor-pointer rounded-full bg-white/20 group/seek"
                      onClick={handleSeek}
                    >
                      {/* Buffered / filled */}
                      <div
                        className="absolute inset-y-0 left-0 rounded-full transition-all duration-100"
                        style={{
                          width: `${progressPct}%`,
                          background: "var(--accent-blue)",
                        }}
                      />
                      {/* Chapter markers */}
                      {duration > 0 &&
                        chapters.map((ch) => (
                          <div
                            key={ch.id}
                            className="absolute top-1/2 -translate-y-1/2 h-[10px] w-[2px] rounded-sm bg-white/50"
                            style={{
                              left: `${(ch.startSec / duration) * 100}%`,
                            }}
                            title={ch.title}
                          />
                        ))}
                      {/* Scrubber thumb */}
                      <div
                        className="absolute top-1/2 -translate-y-1/2 h-4 w-4 rounded-full bg-white shadow-lg transition-opacity"
                        style={{ left: `calc(${progressPct}% - 8px)` }}
                      />
                    </div>

                    {/* Time display */}
                    <div className="mt-1 flex justify-between text-[11px] font-mono text-white/60">
                      <span>{formatTime(currentTime)}</span>
                      <span>{formatTime(duration)}</span>
                    </div>
                  </div>

                  {/* Buttons row */}
                  <div className="flex items-center gap-3 px-4 pb-3">
                    {/* Skip back */}
                    <button
                      onClick={() => skipChapter(-1)}
                      className="text-white/80 transition-colors hover:text-white"
                      aria-label="Previous chapter"
                    >
                      <SkipBack size={20} />
                    </button>

                    {/* Play / Pause */}
                    <button
                      onClick={togglePlay}
                      className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-black transition-transform hover:scale-105 active:scale-95"
                      aria-label={isPlaying ? "Pause" : "Play"}
                    >
                      {isPlaying ? <Pause size={18} /> : <Play size={18} className="ml-0.5" />}
                    </button>

                    {/* Skip forward */}
                    <button
                      onClick={() => skipChapter(1)}
                      className="text-white/80 transition-colors hover:text-white"
                      aria-label="Next chapter"
                    >
                      <SkipForward size={20} />
                    </button>

                    {/* Spacer */}
                    <div className="flex-1" />

                    {/* Volume */}
                    <button
                      onClick={toggleMute}
                      className="text-white/80 transition-colors hover:text-white"
                      aria-label={isMuted ? "Unmute" : "Mute"}
                    >
                      {isMuted || volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
                    </button>
                    <input
                      type="range"
                      min={0}
                      max={1}
                      step={0.01}
                      value={isMuted ? 0 : volume}
                      onChange={handleVolumeChange}
                      className="h-[3px] w-20 cursor-pointer accent-white"
                      aria-label="Volume"
                      onClick={(e) => e.stopPropagation()}
                    />

                    {/* Fullscreen */}
                    <button
                      onClick={toggleFullscreen}
                      className="text-white/80 transition-colors hover:text-white"
                      aria-label="Toggle fullscreen"
                    >
                      <Maximize size={18} />
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* ── Chapter Cards ────────────────────────────────────────────── */}
        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {chapters.map((ch) => {
            const isActive = activeChapterId === ch.id;
            const isViewed = viewedChapters.has(ch.id);
            return (
              <button
                key={ch.id}
                id={`chapter-card-${ch.id}`}
                onClick={() => jumpToChapter(ch)}
                className={`relative flex flex-col items-start rounded-xl border p-[16px] text-left transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-blue)] ${
                  isActive
                    ? "border-[var(--accent-blue)] bg-[var(--accent-blue-soft)] shadow-sm"
                    : isViewed
                    ? "border-[var(--accent-green)] bg-[var(--accent-green-soft)]"
                    : "border-[var(--border-default)] bg-[var(--bg-surface)] hover:border-[color-mix(in_srgb,var(--accent-blue)_40%,var(--border-default))]"
                }`}
              >
                {/* Number + status */}
                <div className="flex w-full items-center justify-between">
                  <div
                    className="text-[22px] font-bold leading-none"
                    style={{
                      color: isActive
                        ? "var(--accent-blue)"
                        : isViewed
                        ? "var(--accent-green)"
                        : "var(--accent-blue)",
                    }}
                  >
                    {ch.num}
                  </div>
                  {isViewed && !isActive && (
                    <CheckCircle2
                      size={16}
                      className="text-[var(--accent-green)]"
                    />
                  )}
                  {isActive && (
                    <span className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-[var(--accent-blue)]">
                      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--accent-blue)]" />
                      Now Playing
                    </span>
                  )}
                </div>

                <h3 className="mt-2.5 text-[14px] font-semibold text-[var(--text-primary)]">
                  {ch.title}
                </h3>
                <p className="mt-1 text-[12px] leading-[1.5] text-[var(--text-secondary)] line-clamp-2">
                  {ch.desc}
                </p>
                <p className="mt-2.5 text-[11px] font-mono text-[var(--text-muted)]">
                  {ch.range}
                </p>
              </button>
            );
          })}
        </div>

        {/* ── Completion CTA ───────────────────────────────────────────── */}
        <AnimatePresence>
          {allViewed && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <CompletionCTA
                topicSlug={slug}
                subModuleId="video"
                headline="Want to mark this complete?"
                body="You've watched all chapters. Mark the video gallery sub-module complete and head back to the module."
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
