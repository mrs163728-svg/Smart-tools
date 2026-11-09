import React, { useState } from 'react';
import {
  Wrench,
  Search,
  Sun,
  Moon,
  Menu,
  X,
  Compass,
  LayoutGrid,
  Info,
  Mail,
  Home,
  Sparkles
} from 'lucide-react';

interface NavbarProps {
  currentView: string;
  onNavigate: (view: string, toolId?: string) => void;
  isDark: boolean;
  onToggleTheme: () => void;
  onOpenSearch: () => void;
  favoritesCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  isDark,
  onToggleTheme,
  onOpenSearch,
  favoritesCount,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (view: string) => {
    onNavigate(view);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-white/85 dark:bg-slate-950/80 border-b border-slate-200 dark:border-slate-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-6">
        {/* Zone 1: Single text element Brand wordmark */}
        <button
          onClick={() => handleNavClick('home')}
          className="flex items-center gap-2.5 text-left group shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-lg p-1"
          aria-label="Smart Tools World Home"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
            <Wrench className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-base font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5 whitespace-nowrap">
              Smart Tools World
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
            </span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium tracking-wider uppercase -mt-0.5">
              100% Free & Private
            </span>
          </div>
        </button>

        {/* Zone 2: 4-5 concise single-line nav links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600 dark:text-slate-300">
          <button
            onClick={() => handleNavClick('home')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-slate-900 dark:hover:text-white ${
              currentView === 'home' ? 'text-indigo-600 dark:text-indigo-400 font-semibold' : ''
            }`}
          >
            Home
          </button>
          <button
            onClick={() => handleNavClick('all-tools')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-slate-900 dark:hover:text-white ${
              currentView === 'all-tools' ? 'text-indigo-600 dark:text-indigo-400 font-semibold' : ''
            }`}
          >
            All Tools
          </button>
          <button
            onClick={() => handleNavClick('categories')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-slate-900 dark:hover:text-white ${
              currentView === 'categories' ? 'text-indigo-600 dark:text-indigo-400 font-semibold' : ''
            }`}
          >
            Categories
          </button>
          <button
            onClick={() => handleNavClick('about')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-slate-900 dark:hover:text-white ${
              currentView === 'about' ? 'text-indigo-600 dark:text-indigo-400 font-semibold' : ''
            }`}
          >
            About Us
          </button>
          <button
            onClick={() => handleNavClick('contact')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-slate-900 dark:hover:text-white ${
              currentView === 'contact' ? 'text-indigo-600 dark:text-indigo-400 font-semibold' : ''
            }`}
          >
            Contact
          </button>
        </nav>

        {/* Zone 3: Search bar trigger & Theme Switch */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={onOpenSearch}
            className="flex items-center gap-2 px-3 py-1.5 text-xs text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-900/90 hover:bg-slate-200 dark:hover:bg-slate-800/90 border border-slate-300 dark:border-slate-700/80 rounded-lg hover:text-slate-900 dark:hover:text-white transition-all shadow-sm"
            aria-label="Search tools"
          >
            <Search className="w-3.5 h-3.5 text-indigo-500 dark:text-slate-400" />
            <span className="hidden sm:inline">Search tools...</span>
            <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono font-medium text-slate-600 dark:text-slate-400 bg-slate-200 dark:bg-slate-800 rounded border border-slate-300 dark:border-slate-700">
              /
            </kbd>
          </button>

          <button
            onClick={onToggleTheme}
            className="p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/80 rounded-lg transition-colors border border-transparent hover:border-slate-300 dark:hover:border-slate-700"
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
          </button>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-800 bg-slate-950/95 px-4 pt-3 pb-6 space-y-2 backdrop-blur-xl">
          <button
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-3 w-full px-3 py-2.5 text-sm font-medium text-slate-200 hover:bg-slate-900 rounded-lg text-left"
          >
            <Home className="w-4 h-4 text-indigo-400" />
            Home
          </button>
          <button
            onClick={() => handleNavClick('all-tools')}
            className="flex items-center gap-3 w-full px-3 py-2.5 text-sm font-medium text-slate-200 hover:bg-slate-900 rounded-lg text-left"
          >
            <Compass className="w-4 h-4 text-indigo-400" />
            All Tools ({favoritesCount > 0 ? `${favoritesCount} Saved` : '34 Tools'})
          </button>
          <button
            onClick={() => handleNavClick('categories')}
            className="flex items-center gap-3 w-full px-3 py-2.5 text-sm font-medium text-slate-200 hover:bg-slate-900 rounded-lg text-left"
          >
            <LayoutGrid className="w-4 h-4 text-indigo-400" />
            Categories (6 Suites)
          </button>
          <button
            onClick={() => handleNavClick('about')}
            className="flex items-center gap-3 w-full px-3 py-2.5 text-sm font-medium text-slate-200 hover:bg-slate-900 rounded-lg text-left"
          >
            <Info className="w-4 h-4 text-indigo-400" />
            About Us
          </button>
          <button
            onClick={() => handleNavClick('contact')}
            className="flex items-center gap-3 w-full px-3 py-2.5 text-sm font-medium text-slate-200 hover:bg-slate-900 rounded-lg text-left"
          >
            <Mail className="w-4 h-4 text-indigo-400" />
            Contact
          </button>
        </div>
      )}
    </header>
  );
};
