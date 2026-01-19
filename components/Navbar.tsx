import React from 'react';
import { AppView } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

interface NavbarProps {
  currentView: AppView;
  setView: (view: AppView) => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentView, setView }) => {
  const { t } = useLanguage();

  const navItems = [
    { id: AppView.TRACKER, label: t.nav.tracker, icon: '📅' },
    { id: AppView.SCANNER, label: t.nav.scanner, icon: '📷' },
    { id: AppView.GUIDE, label: t.nav.guide, icon: '🍎' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-zinc-900 border-t border-gray-200 dark:border-zinc-800 shadow-lg pb-safe z-50 transition-colors duration-300">
      <div className="flex justify-around items-center h-16 max-w-md mx-auto">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setView(item.id)}
            className={`flex flex-col items-center justify-center w-full h-full transition-colors duration-200 ${
              currentView === item.id
                ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-zinc-800'
                : 'text-gray-400 dark:text-zinc-500 hover:text-emerald-500 dark:hover:text-emerald-300'
            }`}
          >
            <span className="text-2xl mb-1">{item.icon}</span>
            <span className="text-xs font-medium">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Navbar;