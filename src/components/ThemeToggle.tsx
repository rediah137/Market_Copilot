import React from 'react';
import { Sun, Moon, Sunrise } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  const getIcon = () => {
    switch (theme) {
      case 'light': return <Moon className="w-5 h-5 text-gray-600" />;
      case 'dark': return <Sunrise className="w-5 h-5 text-gray-300" />;
      case 'day': return <Sun className="w-5 h-5 text-amber-500" />;
    }
  };

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 day:bg-blue-50
                hover:bg-gray-200 dark:hover:bg-gray-700 day:hover:bg-blue-100
                transition-all duration-200 ease-in-out"
      aria-label={`Switch to ${theme === 'light' ? 'dark' : theme === 'dark' ? 'day' : 'light'} mode`}
    >
      {getIcon()}
    </button>
  );
};