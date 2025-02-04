import { useState, useEffect } from 'react';

type Theme = 'light' | 'dark' | 'day';

export const useTheme = () => {
  const [theme, setTheme] = useState<Theme>(() => {
    // Check if theme is stored in localStorage
    const stored = localStorage.getItem('theme') as Theme;
    if (stored) return stored;

    // Check if user prefers dark mode
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }

    // Check time of day (dark mode between 6 PM and 6 AM)
    const hour = new Date().getHours();
    if (hour >= 18 || hour < 6) {
      return 'dark';
    }

    return 'light';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    const body = window.document.body;

    // Remove all theme classes first
    root.classList.remove('dark', 'day');
    body.classList.remove('theme-light', 'theme-dark', 'theme-day');

    switch (theme) {
      case 'dark':
        root.classList.add('dark');
        body.classList.add('theme-dark');
        break;
      case 'day':
        root.classList.add('day');
        body.classList.add('theme-day');
        break;
      default:
        body.classList.add('theme-light');
    }

    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => {
      switch (prev) {
        case 'light': return 'dark';
        case 'dark': return 'day';
        default: return 'light';
      }
    });
  };

  return { theme, toggleTheme };
};