import { create } from "zustand";
import { persist } from "zustand/middleware";

export type SubModuleId =
  | "slides"
  | "quiz"
  | "video"
  | "mindmap"
  | "flashcards"
  | "audio"
  | "gallery"
  | "chatbot";

type QuizResult = {
  score: number;
  total: number;
  mode?: "classic" | "streak" | "rapid";
  bestStreak?: number;
};

type ModuleProgress = {
  completed: SubModuleId[];
  lastVisited?: SubModuleId;
  quizResult?: QuizResult;
};

type ProgressStore = {
  modules: Record<string, ModuleProgress>;
  markComplete: (topicSlug: string, subModule: SubModuleId) => void;
  isComplete: (topicSlug: string, subModule: SubModuleId) => boolean;
  getModuleCompletionPercent: (
    topicSlug: string,
    totalSubModules: number
  ) => number;
  getOverallProgress: () => number;
  saveQuizScore: (
    topicSlug: string,
    score: number,
    total: number,
    meta?: { mode?: "classic" | "streak" | "rapid"; bestStreak?: number }
  ) => void;
  getQuizScore: (topicSlug: string) => QuizResult | null;
  resetProgress: () => void;
};

/* ── Unlocked topics and their sub-module count ────────────────── */
const UNLOCKED_TOPICS = ["filter-types"] as const;
const SUB_MODULES_PER_TOPIC = 8;
const TOTAL_DENOMINATOR = UNLOCKED_TOPICS.length * SUB_MODULES_PER_TOPIC; // 8

export const useProgressStore = create<ProgressStore>()(
  persist(
    (set, get) => ({
      modules: {},

      markComplete: (topicSlug, subModule) => {
        set((state) => {
          const existing = state.modules[topicSlug] ?? { completed: [] };
          // Idempotent — don't add duplicates
          if (existing.completed.includes(subModule)) {
            return {
              modules: {
                ...state.modules,
                [topicSlug]: { ...existing, lastVisited: subModule },
              },
            };
          }
          return {
            modules: {
              ...state.modules,
              [topicSlug]: {
                ...existing,
                completed: [...existing.completed, subModule],
                lastVisited: subModule,
              },
            },
          };
        });
      },

      isComplete: (topicSlug, subModule) => {
        const mod = get().modules[topicSlug];
        return mod ? mod.completed.includes(subModule) : false;
      },

      getModuleCompletionPercent: (topicSlug, totalSubModules) => {
        const mod = get().modules[topicSlug];
        if (!mod || totalSubModules === 0) return 0;
        return Math.round((mod.completed.length / totalSubModules) * 100);
      },

      getOverallProgress: () => {
        const { modules } = get();
        let completed = 0;
        for (const slug of UNLOCKED_TOPICS) {
          const mod = modules[slug];
          if (mod) completed += mod.completed.length;
        }
        return Math.round((completed / TOTAL_DENOMINATOR) * 100);
      },

      saveQuizScore: (topicSlug, score, total, meta) => {
        set((state) => {
          const existing = state.modules[topicSlug] ?? { completed: [] };
          return {
            modules: {
              ...state.modules,
              [topicSlug]: {
                ...existing,
                quizResult: { score, total, mode: meta?.mode, bestStreak: meta?.bestStreak },
              },
            },
          };
        });
      },

      getQuizScore: (topicSlug) => {
        const mod = get().modules[topicSlug];
        return mod?.quizResult ?? null;
      },

      resetProgress: () => set({ modules: {} }),
    }),
    {
      name: "filtrona-progress",
    }
  )
);
