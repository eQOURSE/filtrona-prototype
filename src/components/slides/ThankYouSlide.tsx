"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  Sparkles,
  Play,
  Pause,
  Network,
  Layers2,
  Headphones,
  Box,
  MessageCircle,
  ArrowRight,
  PartyPopper,
  RotateCcw,
  Volume2,
} from "lucide-react";
import { useProgressStore } from "@/lib/progress-store";
import type { FilterSlide } from "@/lib/slide-content";

/* ── Sub-module navigation buttons ────────────────────────────── */
const subModuleLinks = [
  {
    label: "Attempt Quiz",
    description: "Test what stuck",
    icon: Sparkles,
    href: "/topics/filter-types/quiz",
    color: "#1B4B8E",
    softBg: "rgba(27, 75, 142, 0.12)",
  },
  {
    label: "Related Videos",
    description: "Watch key moments",
    icon: Play,
    href: "/topics/filter-types/video",
    color: "#8abd40",
    softBg: "rgba(138, 189, 64, 0.12)",
  },
  {
    label: "Audio Overview",
    description: "Listen on the go",
    icon: Headphones,
    href: "/topics/filter-types/audio",
    color: "#1B4B8E",
    softBg: "rgba(27, 75, 142, 0.12)",
  },
  {
    label: "Flashcards",
    description: "Flip & review",
    icon: Layers2,
    href: "/topics/filter-types/flashcards",
    color: "#188ece",
    softBg: "rgba(24, 142, 206, 0.12)",
  },
  {
    label: "Mind Map",
    description: "See connections",
    icon: Network,
    href: "/topics/filter-types/mindmap",
    color: "#188ece",
    softBg: "rgba(24, 142, 206, 0.12)",
  },
  {
    label: "2D / 3D Gallery",
    description: "Explore products",
    icon: Box,
    href: "/topics/filter-types/gallery",
    color: "#8abd40",
    softBg: "rgba(138, 189, 64, 0.12)",
  },
  {
    label: "Ask the Coach",
    description: "Live AI Q&A",
    icon: MessageCircle,
    href: "/topics/filter-types/chatbot",
    color: "#188ece",
    softBg: "rgba(24, 142, 206, 0.12)",
  },
];

/* ── Confetti particle component ──────────────────────────────── */
function ConfettiParticle({ index }: { index: number }) {
  const colors = ["#188ece", "#8abd40", "#1B4B8E", "#d91f29", "#FFD700"];
  const color = colors[index % colors.length];
  const left = 10 + Math.random() * 80;
  const delay = Math.random() * 0.6;
  const size = 4 + Math.random() * 6;
  const rotation = Math.random() * 360;

  return (
    <motion.div
      className="pointer-events-none absolute"
      style={{
        left: `${left}%`,
        top: "-10px",
        width: `${size}px`,
        height: `${size}px`,
        backgroundColor: color,
        borderRadius: size > 7 ? "50%" : "1px",
        transform: `rotate(${rotation}deg)`,
      }}
      initial={{ y: 0, opacity: 1 }}
      animate={{
        y: [0, 250 + Math.random() * 150],
        x: [-20 + Math.random() * 40, -30 + Math.random() * 60],
        opacity: [1, 1, 0],
        rotate: [rotation, rotation + 200 + Math.random() * 300],
      }}
      transition={{
        duration: 1.8 + Math.random() * 1.2,
        delay,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
    />
  );
}

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
        <button
          onClick={handleRewind}
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-white/40 transition-colors hover:text-white/70 cursor-pointer"
          aria-label="Rewind to start"
        >
          <RotateCcw size={14} />
        </button>
        <div className="hidden sm:flex h-7 w-7 shrink-0 items-center justify-center text-white/30">
          <Volume2 size={14} />
        </div>
      </div>
    </div>
  );
}

interface ThankYouSlideProps {
  slide: FilterSlide;
  slideIndex: number;
  totalSlides: number;
  topicSlug: string;
}

export default function ThankYouSlide({
  slide,
  slideIndex,
  totalSlides,
  topicSlug,
}: ThankYouSlideProps) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [showConfetti, setShowConfetti] = useState(true);

  const markComplete = useProgressStore((s) => s.markComplete);
  const isComplete = useProgressStore((s) => s.isComplete);
  const alreadyComplete = mounted ? isComplete(topicSlug, "slides") : false;

  useEffect(() => setMounted(true), []);
  useEffect(() => {
    const t = setTimeout(() => setShowConfetti(false), 3500);
    return () => clearTimeout(t);
  }, []);

  const handleMarkComplete = () => {
    markComplete(topicSlug, "slides");
    setTimeout(() => router.push(`/topics/${topicSlug}`), 600);
  };

  return (
    <div
      className="relative rounded-3xl border border-[var(--border-default)] overflow-hidden"
      style={{
        background: "linear-gradient(145deg, #0D1B2A 0%, #132D46 45%, #1A3A5C 100%)",
        boxShadow: "0 24px 80px rgba(24, 142, 206, 0.12)",
      }}
    >
      {/* Confetti overlay */}
      {showConfetti && (
        <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-3xl z-10">
          {Array.from({ length: 30 }).map((_, i) => (
            <ConfettiParticle key={i} index={i} />
          ))}
        </div>
      )}

      {/* Decorative background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-3xl">
        <div
          className="absolute -top-16 -right-16 sm:-top-24 sm:-right-24 h-[200px] w-[200px] sm:h-[300px] sm:w-[300px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(138,189,64,0.12) 0%, transparent 70%)" }}
        />
        <div
          className="absolute -bottom-12 -left-12 sm:-bottom-16 sm:-left-16 h-[140px] w-[140px] sm:h-[200px] sm:w-[200px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(24,142,206,0.08) 0%, transparent 70%)" }}
        />
      </div>

      <div className="relative px-5 py-6 sm:px-6 sm:py-8 lg:px-12 lg:py-10">
        {/* Top counter */}
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#8abd40]/20 px-2.5 sm:px-3 py-1 text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-[#8abd40]">
            <PartyPopper size={11} className="sm:w-3 sm:h-3" />
            {slide.tag}
          </span>
          <span className="text-[12px] sm:text-[13px] font-medium text-white/40 tabular-nums">
            {slideIndex + 1} / {totalSlides}
          </span>
        </div>

        {/* ── Hero section ──────────────────────────────────────── */}
        <motion.div
          className="mt-6 sm:mt-8 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Animated check icon */}
          <motion.div
            className="mx-auto flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-full"
            style={{
              background: "linear-gradient(135deg, rgba(138,189,64,0.2), rgba(138,189,64,0.05))",
              border: "2px solid rgba(138,189,64,0.3)",
            }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, duration: 0.6, type: "spring", stiffness: 200 }}
          >
            <CheckCircle2 size={32} className="sm:w-10 sm:h-10 text-[#8abd40]" />
          </motion.div>

          <h2 className="mt-4 sm:mt-5 text-[24px] sm:text-[28px] font-bold text-white lg:text-[34px]">
            {slide.filterName}
          </h2>
          <p className="mt-1 text-[14px] sm:text-[16px] font-medium text-white/50">
            {slide.fullName}
          </p>
          <p className="mx-auto mt-2 sm:mt-3 max-w-[480px] text-[13px] sm:text-[15px] leading-[1.5] text-white/65 px-2">
            {slide.tagline}
          </p>
        </motion.div>

        {/* ── Audio Player ─────────────────────────────────────── */}
        <motion.div
          className="mx-auto mt-5 sm:mt-6 max-w-[480px]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <DarkAudioPlayer
            audioUrl={slide.audioUrl}
            label="Closing"
            slideKey={slide.id}
          />
        </motion.div>

        {/* ── Mark as Done button ──────────────────────────────── */}
        <motion.div
          className="mx-auto mt-4 sm:mt-6 max-w-[480px]"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65, duration: 0.5 }}
        >
          <button
            onClick={handleMarkComplete}
            className="group flex w-full items-center justify-center gap-2 sm:gap-2.5 rounded-xl px-6 sm:px-8 py-3 sm:py-4 text-[14px] sm:text-[16px] font-bold text-white transition-all duration-300 hover:scale-[1.02] hover:shadow-lg active:scale-[0.98] cursor-pointer"
            style={{
              background: alreadyComplete
                ? "linear-gradient(135deg, #8abd40 0%, #72A030 100%)"
                : "linear-gradient(135deg, #188ece 0%, #1270A8 100%)",
              boxShadow: alreadyComplete
                ? "0 8px 32px rgba(138, 189, 64, 0.3)"
                : "0 8px 32px rgba(24, 142, 206, 0.3)",
            }}
          >
            {alreadyComplete ? (
              <>
                <CheckCircle2 size={16} className="sm:w-[18px] sm:h-[18px]" />
                <span className="truncate">Completed — Revisit Module</span>
              </>
            ) : (
              <>
                <CheckCircle2 size={16} className="sm:w-[18px] sm:h-[18px]" />
                Mark as Done
              </>
            )}
          </button>
        </motion.div>

        {/* ── Divider ──────────────────────────────────────────── */}
        <div className="mx-auto mt-6 sm:mt-8 h-px max-w-[480px] bg-gradient-to-r from-transparent via-white/15 to-transparent" />

        {/* ── Explore More label ───────────────────────────────── */}
        <motion.p
          className="mt-5 sm:mt-6 text-center text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.15em] text-white/40"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.4 }}
        >
          Continue your learning journey
        </motion.p>

        {/* ── Sub-module navigation grid ───────────────────────── */}
        <motion.div
          className="mx-auto mt-3 sm:mt-4 grid max-w-[600px] grid-cols-2 gap-2 sm:gap-3 sm:grid-cols-3 lg:grid-cols-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.5 }}
        >
          {subModuleLinks.map((mod, i) => (
            <motion.button
              key={mod.label}
              onClick={() => router.push(mod.href)}
              className={`group flex flex-col items-center gap-1.5 sm:gap-2 rounded-xl border border-white/[0.06] bg-white/[0.04] px-2 sm:px-3 py-3 sm:py-4 text-center transition-all duration-300 hover:border-white/15 hover:bg-white/[0.08] cursor-pointer ${
                i === subModuleLinks.length - 1 && subModuleLinks.length % 2 !== 0
                  ? "col-span-2 sm:col-span-1"
                  : ""
              }`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.95 + i * 0.06, duration: 0.4 }}
              whileHover={{ y: -2 }}
            >
              <div
                className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg transition-transform duration-300 group-hover:scale-110"
                style={{ backgroundColor: mod.softBg }}
              >
                <mod.icon size={16} className="sm:w-[18px] sm:h-[18px]" style={{ color: mod.color }} />
              </div>
              <span className="text-[11px] sm:text-[12px] font-semibold text-white/80 leading-tight">
                {mod.label}
              </span>
              <span className="hidden sm:block text-[10px] text-white/35 leading-tight">
                {mod.description}
              </span>
            </motion.button>
          ))}
        </motion.div>

        {/* ── Back to module button ────────────────────────────── */}
        <motion.div
          className="mx-auto mt-5 sm:mt-6 max-w-[480px] text-center pb-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3, duration: 0.4 }}
        >
          <button
            onClick={() => router.push(`/topics/${topicSlug}`)}
            className="inline-flex items-center gap-1.5 text-[12px] sm:text-[13px] font-medium text-white/40 transition-colors duration-200 hover:text-white/70 cursor-pointer"
          >
            Back to module overview
            <ArrowRight size={12} className="sm:w-[13px] sm:h-[13px]" />
          </button>
        </motion.div>
      </div>
    </div>
  );
}
