import React from 'react';
import { Clock, TrendingUp } from 'lucide-react';
import { DateTime } from './components/DateTime';
import { GlobalTicker, StockTicker } from './components/StockTicker';
import { SnippetGenerator } from './components/SnippetGenerator';
import { NewsHeadlines } from './components/NewsHeadlines';
import { ThemeToggle } from './components/ThemeToggle';

import { useTheme } from './hooks/useTheme';

function App() {
  const { theme } = useTheme();

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'dark bg-gray-900' : 'bg-gradient'}`}>
      <header className="sticky top-0 z-50 px-4 py-4 border-b border-gray-200/80 dark:border-gray-800/80
                       backdrop-blur-sm bg-white/90 dark:bg-gray-900/90">
        <div className="container mx-auto flex justify-between items-center max-w-7xl">
          <div className="flex items-center space-x-4">
            <DateTime />
          </div>
          <ThemeToggle />
        </div>
        <GlobalTicker />
      </header>

      {/* Hero Section */}
      <div className="relative overflow-hidden border-b border-gray-200/80 dark:border-gray-800/80">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="container mx-auto max-w-5xl px-4 py-20 md:py-28 relative">
          <div className="text-center space-y-8 relative z-10">
            <div className="flex flex-col items-center justify-center">
              <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-gray-900 dark:text-white">
                Market <span className="text-blue-600 dark:text-blue-400">Copilot</span>
              </h1>
            </div>
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
              AI-Powered Real-Time Stock Market Intelligence
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto max-w-7xl px-4 py-8 md:py-12 space-y-8 animate-fade-in">
        <SnippetGenerator />
        <NewsHeadlines />
      </main>

      {/* Footer Ticker */}
      <footer className="fixed bottom-0 w-full backdrop-blur-sm dark:bg-gray-900/90
                       bg-white/90 border-t border-gray-200/80 dark:border-gray-800/80">
        <StockTicker />
        <div className="text-center py-1.5 text-sm text-gray-600 dark:text-gray-400 border-t border-gray-200/80 dark:border-gray-800/80">
          Built with <span className="text-red-500">❤️</span> by Futurelab Studios
        </div>
      </footer>
    </div>
  );
}

export default App;