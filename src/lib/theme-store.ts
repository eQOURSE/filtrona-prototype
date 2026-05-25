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
      theme: 'light',
      setTheme: (theme) => {
        // Theme is locked to light mode
      },
      toggleTheme: () => {
        // Theme is locked to light mode
      },
    }),
    {
      name: 'filtrona-theme',
    }
  )
);
