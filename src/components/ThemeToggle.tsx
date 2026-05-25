"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useThemeStore } from "@/lib/theme-store";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useThemeStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Placeholder to avoid hydration mismatch
    return (
      <button
        className="group relative flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border-default)] bg-[var(--bg-elevated)]"
        aria-hidden="true"
      >
        <span className="sr-only">Toggle theme placeholder</span>
      </button>
    );
  }

  const isDark = theme === "dark";

  return (
    <button
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      className="group relative flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border-default)] bg-[var(--bg-elevated)] transition-colors hover:border-[var(--accent-mint)] hover:bg-[var(--bg-surface)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-mint)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-base)]"
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={isDark ? "dark" : "light"}
          initial={{ opacity: 0, rotate: -180 }}
          animate={{ opacity: 1, rotate: 0 }}
          exit={{ opacity: 0, rotate: 180 }}
          transition={{ duration: 0.2 }}
          className="absolute inset-0 flex items-center justify-center text-[var(--text-secondary)] transition-colors group-hover:text-[var(--accent-mint)]"
        >
          {isDark ? <Sun size={18} /> : <Moon size={18} />}
        </motion.div>
      </AnimatePresence>
    </button>
  );
}
