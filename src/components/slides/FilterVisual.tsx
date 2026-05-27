"use client";

import Image from "next/image";
import cpsImg from "../../../public/images-filters/cps.jpeg";
import corImg from "../../../public/images-filters/cor.jpeg";
import ccfImg from "../../../public/images-filters/ccf.jpeg";
import corinthianImg from "../../../public/images-filters/corinthian.jpeg";
import vortexImg from "../../../public/images-filters/vortex.jpeg";

const FILTER_IMAGES = {
  cps: cpsImg,
  cor: corImg,
  ccf: ccfImg,
  corinthian: corinthianImg,
  vortex: vortexImg,
};

const ACCENT_COLORS: Record<string, string> = {
  blue: "#188ece",
  navy: "#1B4B8E",
  green: "#8abd40",
  sky: "#188ece",
};

interface FilterVisualProps {
  visualType: "cps" | "cor" | "ccf" | "corinthian" | "vortex";
  accent: "blue" | "navy" | "green" | "sky";
  isActive: boolean;
}

export default function FilterVisual({
  visualType,
  accent,
  isActive,
}: FilterVisualProps) {
  const color = ACCENT_COLORS[accent];
  const imageSrc = FILTER_IMAGES[visualType];

  return (
    <div
      className="group relative flex items-center justify-center overflow-hidden rounded-full transition-all duration-700 hover:scale-105 hover:shadow-2xl cursor-pointer"
      style={{ 
        width: "100%", 
        maxWidth: 520, 
        aspectRatio: "1",
        border: `2px solid ${color}40`,
        boxShadow: `0 12px 48px ${color}30`
      }}
    >
      {/* Radial glow behind (mostly hidden by image, but acts as border glow) */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background: `radial-gradient(circle at center, ${color}30 0%, transparent 70%)`,
        }}
      />

      <Image
        src={imageSrc}
        alt={`${visualType.toUpperCase()} filter`}
        fill
        className="z-10 object-cover transition-transform duration-1000 group-hover:scale-110"
        sizes="(max-width: 768px) 100vw, 520px"
        priority={visualType === "cps"} // Preload the first one
        style={{
          animation: isActive ? "filter-rotate 60s linear infinite" : "none",
        }}
      />

      {/* CSS rotation keyframes */}
      <style jsx>{`
        @keyframes filter-rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @media (prefers-reduced-motion: reduce) {
          img { animation: none !important; }
        }
      `}</style>
    </div>
  );
}
