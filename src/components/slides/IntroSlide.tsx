"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Play, Pause, RotateCcw, Volume2 } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import type { FilterSlide } from "@/lib/slide-content";

/* ── Filter tag config ───────────────────────────────────────────── */
const filterTags = [
  { label: "CPS", color: "#188ece" },
  { label: "COR", color: "#188ece" },
  { label: "CCR", color: "#d91f29" },
  { label: "Corinthian™", color: "#8abd40" },
  { label: "Vortex™", color: "#1B4B8E" },
];

/* ── Dark-theme inline audio player ───────────────────────────── */
function formatTime(s: number): string {
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, "0")}`;
}

function DarkAudioPlayer({
  audioUrl,
  label,
  slideKey,
}: {
  audioUrl: string;
  label: string;
  slideKey: string;
}) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(30);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio && !audio.paused) {
      audio.pause();
      setIsPlaying(false);
    }
  }, [slideKey]);

  useEffect(() => {
    return () => {
      audioRef.current?.pause();
    };
  }, []);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      audio.play().catch(() => {});
      setIsPlaying(true);
    } else {
      audio.pause();
      setIsPlaying(false);
    }
  };

  const handleRewind = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = 0;
    setCurrentTime(0);
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="w-full">
      <audio
        ref={audioRef}
        src={audioUrl}
        preload="metadata"
        onTimeUpdate={() => {
          if (audioRef.current) setCurrentTime(audioRef.current.currentTime);
        }}
        onLoadedMetadata={() => {
          if (audioRef.current && isFinite(audioRef.current.duration))
            setDuration(audioRef.current.duration);
        }}
        onEnded={() => setIsPlaying(false)}
      />
      <div className="flex items-center gap-2.5 sm:gap-3 rounded-xl border border-white/10 bg-white/[0.06] backdrop-blur-sm px-2.5 sm:px-3 py-2.5">
        {/* Play/Pause */}
        <button
          onClick={togglePlay}
          className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-full bg-[#188ece] transition-opacity hover:opacity-85 cursor-pointer"
          aria-label={isPlaying ? "Pause narration" : "Play narration"}
        >
          {isPlaying ? (
            <Pause size={14} className="text-white" fill="white" />
          ) : (
            <Play size={14} className="text-white ml-0.5" fill="white" />
          )}
        </button>

        {/* Center: title + progress */}
        <div className="flex-1 min-w-0">
          <p className="text-[12px] sm:text-[13px] font-medium text-white/80 truncate">
            Narration · {label}
          </p>
          <div className="mt-1 sm:mt-1.5 flex items-center gap-1.5 sm:gap-2">
            <span className="text-[10px] sm:text-[11px] text-white/40 tabular-nums w-7 sm:w-8">
              {formatTime(currentTime)}
            </span>
            <div className="flex-1 h-[2px] rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full rounded-full transition-[width] duration-200 bg-[#188ece]"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-[10px] sm:text-[11px] text-white/40 tabular-nums w-7 sm:w-8 text-right">
              {formatTime(duration)}
            </span>
          </div>
        </div>

        {/* Rewind */}
        <button
          onClick={handleRewind}
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-white/40 transition-colors hover:text-white/70 cursor-pointer"
          aria-label="Rewind to start"
        >
          <RotateCcw size={14} />
        </button>

        {/* Volume icon (decorative) */}
        <div className="hidden sm:flex h-7 w-7 shrink-0 items-center justify-center text-white/30">
          <Volume2 size={14} />
        </div>
      </div>
    </div>
  );
}

interface IntroSlideProps {
  slide: FilterSlide;
  slideIndex: number;
  totalSlides: number;
  onNext: () => void;
}

export default function IntroSlide({
  slide,
  slideIndex,
  totalSlides,
  onNext,
}: IntroSlideProps) {
  return (
    <div
      className="relative rounded-3xl border border-[var(--border-default)] overflow-hidden"
      style={{
        background: "linear-gradient(145deg, #0D1B2A 0%, #132D46 45%, #1A3A5C 100%)",
        boxShadow: "0 24px 80px rgba(24, 142, 206, 0.12)",
      }}
    >
      {/* Decorative background shapes */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-3xl">
        <div
          className="absolute -top-24 -right-24 h-[200px] w-[200px] sm:h-[300px] sm:w-[300px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(24,142,206,0.12) 0%, transparent 70%)" }}
        />
        <div
          className="absolute -bottom-12 -left-12 sm:-bottom-16 sm:-left-16 h-[140px] w-[140px] sm:h-[200px] sm:w-[200px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(138,189,64,0.08) 0%, transparent 70%)" }}
        />
        <div
          className="absolute top-1/3 right-1/4 h-[100px] w-[100px] sm:h-[150px] sm:w-[150px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(27,75,142,0.06) 0%, transparent 70%)" }}
        />
      </div>

      <div className="relative grid grid-cols-1 lg:grid-cols-[50%_50%]">
        {/* ── Left: Visual / Brand Panel ────────────────────────── */}
        <div className="relative flex flex-col items-center justify-center px-6 py-6 sm:p-8 lg:p-12">
          {/* Subtle grid pattern */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />

          {/* Filtrona logo area */}
          <motion.div
            className="relative text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Brand mark */}
            <div className="mx-auto flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.06] backdrop-blur-sm">
              <svg
                viewBox="0 0 40 40"
                width="28"
                height="28"
                className="sm:w-8 sm:h-8"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect x="4" y="8" width="32" height="4" rx="2" fill="#188ece" />
                <rect x="4" y="16" width="24" height="4" rx="2" fill="#8abd40" />
                <rect x="4" y="24" width="28" height="4" rx="2" fill="#188ece" opacity="0.7" />
                <rect x="4" y="32" width="18" height="4" rx="2" fill="#1B4B8E" opacity="0.5" />
              </svg>
            </div>

            <h3 className="mt-3 sm:mt-5 text-[12px] sm:text-[14px] font-bold uppercase tracking-[0.2em] text-white/50">
              Filtrona
            </h3>

            {/* Decorative divider */}
            <div className="mx-auto mt-3 sm:mt-4 h-px w-12 sm:w-16 bg-gradient-to-r from-transparent via-white/20 to-transparent" />

            {/* Stats row */}
            <div className="mt-4 sm:mt-6 flex items-center justify-center gap-4 sm:gap-6">
              <div className="text-center">
                <p className="text-[18px] sm:text-[22px] font-bold text-white">5</p>
                <p className="text-[9px] sm:text-[10px] font-medium uppercase tracking-wider text-white/40">Filters</p>
              </div>
              <div className="h-6 sm:h-8 w-px bg-white/10" />
              <div className="text-center">
                <p className="text-[18px] sm:text-[22px] font-bold text-[#8abd40]">100+</p>
                <p className="text-[9px] sm:text-[10px] font-medium uppercase tracking-wider text-white/40">Years</p>
              </div>
              <div className="h-6 sm:h-8 w-px bg-white/10" />
              <div className="text-center">
                <p className="text-[18px] sm:text-[22px] font-bold text-[#188ece]">120</p>
                <p className="text-[9px] sm:text-[10px] font-medium uppercase tracking-wider text-white/40">Countries</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* ── Right: Content Panel ──────────────────────────────── */}
        <div className="relative flex flex-col justify-center px-5 pb-6 sm:px-6 sm:py-8 lg:px-10 lg:py-10">
          {/* Top: tag + counter */}
          <motion.div
            className="flex items-center justify-between"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#188ece]/20 px-2.5 sm:px-3 py-1 text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-[#188ece]">
              <Sparkles size={11} className="sm:w-3 sm:h-3" />
              {slide.tag}
            </span>
            <span className="text-[12px] sm:text-[13px] font-medium text-white/40 tabular-nums">
              {slideIndex + 1} / {totalSlides}
            </span>
          </motion.div>

          {/* Main title */}
          <motion.div
            className="mt-4 sm:mt-5"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <h2 className="text-[24px] sm:text-[30px] font-bold tracking-tight text-white lg:text-[38px] leading-[1.15]">
              {slide.filterName}
            </h2>
            <p className="mt-1.5 sm:mt-2 text-[15px] sm:text-[17px] font-medium text-white/70">
              {slide.fullName}
            </p>
          </motion.div>

          {/* Tagline */}
          <motion.p
            className="mt-3 sm:mt-4 text-[13px] sm:text-[15px] font-medium italic leading-[1.5] text-[#8abd40]"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.6 }}
          >
            {slide.tagline}
          </motion.p>

          {/* Filter tags */}
          <motion.div
            className="mt-4 sm:mt-6 flex flex-wrap gap-1.5 sm:gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.55, duration: 0.6 }}
          >
            {filterTags.map((tag, i) => (
              <motion.span
                key={tag.label}
                className="rounded-full px-2.5 sm:px-3.5 py-1 sm:py-1.5 text-[11px] sm:text-[12px] font-bold text-white"
                style={{ backgroundColor: tag.color }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 + i * 0.08, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              >
                {tag.label}
              </motion.span>
            ))}
          </motion.div>

          {/* Audio player - dark themed */}
          <motion.div
            className="mt-4 sm:mt-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}
          >
            <DarkAudioPlayer
              audioUrl={slide.audioUrl}
              label="Introduction"
              slideKey={slide.id}
            />
          </motion.div>

          {/* Start Learning button */}
          <motion.button
            onClick={onNext}
            className="group mt-4 sm:mt-6 flex w-full items-center justify-center gap-2 sm:gap-2.5 rounded-xl px-6 sm:px-8 py-3 sm:py-4 text-[14px] sm:text-[16px] font-bold text-white transition-all duration-300 hover:scale-[1.02] hover:shadow-lg active:scale-[0.98] cursor-pointer"
            style={{
              background: "linear-gradient(135deg, #188ece 0%, #1270A8 100%)",
              boxShadow: "0 8px 32px rgba(24, 142, 206, 0.3)",
            }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.95, duration: 0.5 }}
            whileHover={{
              boxShadow: "0 12px 40px rgba(24, 142, 206, 0.45)",
            }}
          >
            Start Learning
            <ArrowRight
              size={16}
              className="sm:w-[18px] sm:h-[18px] transition-transform duration-300 group-hover:translate-x-1"
            />
          </motion.button>
        </div>
      </div>
    </div>
  );
}
