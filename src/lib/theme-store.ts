import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Theme = 'light' | 'dark';

type ThemeStore = {
  theme: Theme;
  setTheme: (t: Theme) => void;
  toggleTheme: () => void;
};

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set, get) => ({
      theme: 'dark',
      setTheme: (theme) => {
        set({ theme });
        if (typeof document !== 'undefined') {
          document.documentElement.setAttribute('data-theme', theme);
        }
      },
      toggleTheme: () => {
        const current = get().theme;
        const newTheme = current === 'dark' ? 'light' : 'dark';
        set({ theme: newTheme });
        if (typeof document !== 'undefined') {
          document.documentElement.setAttribute('data-theme', newTheme);
        }
      },
    }),
    {
      name: 'filtrona-theme',
    }
  )
);
