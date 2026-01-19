import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import ChallengeTracker from './components/ChallengeTracker';
import FoodGuide from './components/FoodGuide';
import FoodScanner from './components/FoodScanner';
import { AppView } from './types';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';

const AppContent: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.TRACKER);
  const [darkMode, setDarkMode] = useState(false);
  const { language, setLanguage, t } = useLanguage();

  useEffect(() => {
    // Check local storage or system preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setDarkMode(true);
    } else if (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setDarkMode(true);
    }
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  const toggleLanguage = () => {
    setLanguage(language === 'ar' ? 'en' : 'ar');
  };

  const renderView = () => {
    switch (currentView) {
      case AppView.TRACKER:
        return <ChallengeTracker />;
      case AppView.GUIDE:
        return <FoodGuide />;
      case AppView.SCANNER:
        return <FoodScanner />;
      default:
        return <ChallengeTracker />;
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'dark bg-zinc-950 text-gray-100' : 'bg-gradient-to-br from-emerald-50 to-teal-50 text-gray-800'}`}>
      {/* Header */}
      <header className="pt-8 px-6 pb-2">
        <div className="flex items-center justify-between max-w-md mx-auto">
          <h1 className="text-xl font-bold dark:text-emerald-400 text-emerald-900 flex items-center gap-2">
            🌱 {t.appTitle}
          </h1>
          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="w-10 h-10 rounded-full bg-white dark:bg-zinc-800 shadow-sm flex items-center justify-center text-xl transition-transform active:scale-95"
              aria-label="Toggle Dark Mode"
            >
              {darkMode ? '☀️' : '🌙'}
            </button>
            <button
              onClick={toggleLanguage}
              className="w-10 h-10 rounded-full bg-emerald-200 dark:bg-emerald-900 flex items-center justify-center text-emerald-700 dark:text-emerald-300 text-xs font-bold transition-transform active:scale-95 hover:bg-emerald-300 dark:hover:bg-emerald-800"
              aria-label="Toggle Language"
            >
              {language === 'ar' ? 'EN' : 'AR'}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="h-[calc(100vh-140px)] overflow-hidden relative">
        {renderView()}
      </main>

      {/* Navigation */}
      <Navbar currentView={currentView} setView={setCurrentView} />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
};

export default App;