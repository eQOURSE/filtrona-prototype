"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import type { FilterModel3D } from "@/lib/filter-3d-models";

const EASE = [0.16, 1, 0.3, 1] as const;

interface FilterModel3DModalProps {
  model: FilterModel3D;
  onClose: () => void;
}

/**
 * Half-screen modal that embeds a Three.js 3D filter model via iframe.
 * Renders the 3D viewport on top and a white info panel below.
 * Responsive: ~50% screen on desktop, near-full on mobile.
 */
export default function FilterModel3DModal({
  model,
  onClose,
}: FilterModel3DModalProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  /* Lock body scroll while modal is open */
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  /* Close on Escape key */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <motion.div
      key="model3d-backdrop"
      className="fixed inset-0 z-[100] flex items-center justify-center px-4 py-6 sm:px-6"
      style={{ backgroundColor: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`${model.fullName} 3D preview`}
    >
      <motion.div
        /* Modal panel — roughly half-screen */
        className="relative flex flex-col overflow-hidden rounded-2xl bg-white shadow-2xl
                   w-full max-w-3xl
                   h-[85vh] sm:h-[75vh] lg:h-[70vh]
                   max-h-[750px]"
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.96, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 12 }}
        transition={{ duration: 0.3, ease: EASE }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          aria-label="Close 3D preview"
          className="absolute right-3 top-3 z-20 inline-flex h-9 w-9 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm transition-colors hover:bg-black/60"
        >
          <X size={18} />
        </button>

        {/* 3D Viewport (iframe) — takes up the top ~65% */}
        <div className="relative flex-grow min-h-0 bg-[#010308]">
          <iframe
            ref={iframeRef}
            src={model.iframeSrc}
            title={`${model.fullName} 3D Model`}
            className="h-full w-full border-0"
            allow="accelerometer; autoplay"
            sandbox="allow-scripts allow-same-origin"
            loading="eager"
          />
        </div>

        {/* Info panel — bottom section */}
        <div className="shrink-0 border-t border-slate-100 bg-white px-6 py-5 sm:px-8 sm:py-6">
          <div className="mb-2 flex items-center gap-2">
            <span
              className={`${model.badgeColor} inline-block rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white`}
            >
              {model.code}
            </span>
            <span className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">
              {model.subtitle}
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-800 sm:text-2xl">
            {model.fullName}
          </h2>
          <p className="mt-1.5 max-w-2xl text-[13px] leading-relaxed text-slate-500 sm:text-sm">
            {model.description}
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}
