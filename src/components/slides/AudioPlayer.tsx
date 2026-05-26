"use client";

import { useEffect, useRef, useState } from "react";
import { Play, Pause, RotateCcw, Volume2 } from "lucide-react";

const ACCENT_CSS: Record<string, string> = {
  mint: "var(--accent-mint)",
  violet: "var(--accent-violet)",
  orange: "var(--accent-orange)",
  blue: "var(--accent-blue)",
};

interface AudioPlayerProps {
  audioUrl: string;
  filterName: string;
  accent: "mint" | "violet" | "orange" | "blue";
  slideKey: string; // changes when slide changes → auto-pause
}

function formatTime(s: number): string {
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, "0")}`;
}

export default function AudioPlayer({
  audioUrl,
  filterName,
  accent,
  slideKey,
}: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(30); // default placeholder duration
  const accentColor = ACCENT_CSS[accent];

  // Auto-pause when slide changes
  useEffect(() => {
    const audio = audioRef.current;
    if (audio && !audio.paused) {
      audio.pause();
      setIsPlaying(false);
    }
  }, [slideKey]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      audioRef.current?.pause();
    };
  }, []);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      audio.play().catch(() => {/* ignore autoplay blocks */});
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

  const handleTimeUpdate = () => {
    const audio = audioRef.current;
    if (audio) setCurrentTime(audio.currentTime);
  };

  const handleLoadedMetadata = () => {
    const audio = audioRef.current;
    if (audio && isFinite(audio.duration)) {
      setDuration(audio.duration);
    }
  };

  const handleEnded = () => setIsPlaying(false);

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="w-full">
      {/* Hidden audio element */}
      <audio
        ref={audioRef}
        src={audioUrl}
        preload="metadata"
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
      />

      {/* Player UI */}
      <div className="flex items-center gap-3 rounded-xl border border-[var(--border-default)] bg-[var(--bg-elevated)] px-3 py-2.5">
        {/* Play/Pause */}
        <button
          onClick={togglePlay}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-opacity hover:opacity-85"
          style={{ backgroundColor: accentColor }}
          aria-label={isPlaying ? "Pause narration" : "Play narration"}
          aria-pressed={isPlaying}
        >
          {isPlaying ? (
            <Pause size={16} className="text-white" fill="white" />
          ) : (
            <Play size={16} className="text-white ml-0.5" fill="white" />
          )}
        </button>

        {/* Center: title + progress */}
        <div className="flex-1 min-w-0">
          <p className="text-[13px] font-medium text-[var(--text-primary)] truncate">
            Narration · {filterName}
          </p>
          <div className="mt-1.5 flex items-center gap-2">
            <span className="text-[11px] text-[var(--text-muted)] tabular-nums w-8">
              {formatTime(currentTime)}
            </span>
            <div className="flex-1 h-[2px] rounded-full bg-[var(--border-default)] overflow-hidden">
              <div
                className="h-full rounded-full transition-[width] duration-200"
                style={{ width: `${progress}%`, backgroundColor: accentColor }}
              />
            </div>
            <span className="text-[11px] text-[var(--text-muted)] tabular-nums w-8 text-right">
              {formatTime(duration)}
            </span>
          </div>
        </div>

        {/* Rewind */}
        <button
          onClick={handleRewind}
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-[var(--text-muted)] transition-colors hover:text-[var(--text-primary)]"
          aria-label="Rewind to start"
        >
          <RotateCcw size={16} />
        </button>

        {/* Volume (visual only — decorative) */}
        <div className="flex h-7 w-7 shrink-0 items-center justify-center text-[var(--text-muted)]">
          <Volume2 size={16} />
        </div>
      </div>

      {/* Placeholder notice */}
      <p className="mt-1.5 text-[11px] italic text-[var(--text-muted)]">
        Placeholder narration · real audio coming with content delivery
      </p>
    </div>
  );
}
