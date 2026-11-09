/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { HomePage } from './components/pages/HomePage';
import { AllToolsPage } from './components/pages/AllToolsPage';
import { CategoriesPage } from './components/pages/CategoriesPage';
import { AboutPage } from './components/pages/AboutPage';
import { ContactPage } from './components/pages/ContactPage';
import { PrivacyPage } from './components/pages/PrivacyPage';
import { TermsPage } from './components/pages/TermsPage';
import { NotFoundPage } from './components/pages/NotFoundPage';
import { ToolDispatcher } from './components/tools/ToolDispatcher';
import { SearchModal } from './components/common/SearchModal';
import { FeedbackModal } from './components/common/FeedbackModal';
import { FloatingFeedbackButton } from './components/common/FloatingFeedbackButton';
import { TOOLS } from './data/tools';

// Helper to reliably parse both pathname and hash routes
function parseCurrentRoute(): { view: string; toolId: string | null; filter: string } {
  const rawPath = window.location.pathname.replace(/^\/+/, '').trim();
  const rawHash = window.location.hash.replace(/^#\/?/, '').trim();

  // If there's a pathname like tools/age-calculator, use it; otherwise fallback to hash
  let target = '';
  if (rawPath && rawPath !== 'index.html') {
    target = rawPath;
  } else if (rawHash && rawHash !== 'home' && rawHash !== '/') {
    target = rawHash;
  }

  if (!target || target === 'home' || target === 'index.html') {
    return { view: 'home', toolId: null, filter: '' };
  }

  // Match tools/:id or tool/:id
  const toolMatch = target.match(/^(?:tools|tool)\/([^/?#]+)/i);
  if (toolMatch) {
    const id = toolMatch[1].toLowerCase();
    const exists = TOOLS.some(t => t.id === id);
    if (exists) {
      return { view: 'tool', toolId: id, filter: '' };
    }
    return { view: '404', toolId: null, filter: '' };
  }

  if (target.startsWith('all-tools')) {
    const filter = target.includes('?') ? target.split('?')[1] : '';
    return { view: 'all-tools', toolId: null, filter };
  }

  const cleanTarget = target.split('?')[0].split('/')[0];
  if (['categories', 'about', 'contact', 'privacy', 'terms'].includes(cleanTarget)) {
    return { view: cleanTarget, toolId: null, filter: '' };
  }

  return { view: '404', toolId: null, filter: '' };
}

export default function App() {
  // Theme state
  const [isDark, setIsDark] = useState<boolean>(() => {
    const saved = localStorage.getItem('smart_tools_theme');
    if (saved) return saved === 'dark';
    return true; // Default dark futuristic theme
  });

  // Initial Route parsed reliably
  const initialRoute = parseCurrentRoute();
  const [currentView, setCurrentView] = useState<string>(initialRoute.view);
  const [activeToolId, setActiveToolId] = useState<string | null>(initialRoute.toolId);
  const [filterQuery, setFilterQuery] = useState<string>(initialRoute.filter);

  // Modals state
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);

  // Favorites & Recents in localStorage
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('smart_tools_favorites');
      return saved ? JSON.parse(saved) : ['age-calculator', 'image-compressor', 'merge-pdf', 'currency-converter'];
    } catch {
      return [];
    }
  });

  const [recents, setRecents] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('smart_tools_recents');
      return saved ? JSON.parse(saved) : ['age-calculator', 'word-counter', 'qr-code-generator'];
    } catch {
      return [];
    }
  });

  // Sync theme with <html> class
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('smart_tools_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('smart_tools_theme', 'light');
    }
  }, [isDark]);

  const recordRecent = useCallback((id: string) => {
    setRecents(prev => {
      const updated = [id, ...prev.filter(item => item !== id)].slice(0, 10);
      try {
        localStorage.setItem('smart_tools_recents', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  }, []);

  // Listen to browser Back / Forward buttons and Hash changes
  useEffect(() => {
    const handleNavigationChange = () => {
      const route = parseCurrentRoute();
      setCurrentView(route.view);
      setActiveToolId(route.toolId);
      setFilterQuery(route.filter);

      if (route.view === 'tool' && route.toolId) {
        recordRecent(route.toolId);
      }

      window.scrollTo({ top: 0, behavior: 'instant' });
    };

    window.addEventListener('popstate', handleNavigationChange);
    window.addEventListener('hashchange', handleNavigationChange);
    return () => {
      window.removeEventListener('popstate', handleNavigationChange);
      window.removeEventListener('hashchange', handleNavigationChange);
    };
  }, [recordRecent]);

  // Keyboard shortcut for search (/ and Ctrl+K / Cmd+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        (e.key === '/' || ((e.metaKey || e.ctrlKey) && e.key === 'k')) &&
        !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)
      ) {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleToggleFavorite = (id: string) => {
    setFavorites(prev => {
      const updated = prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id];
      try {
        localStorage.setItem('smart_tools_favorites', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  // Primary navigation dispatcher: updates view state, history URL, and scrolls clean
  const navigateTo = (view: string, param?: string) => {
    if (view === 'tool' && param) {
      const toolId = param.toLowerCase();
      setCurrentView('tool');
      setActiveToolId(toolId);
      recordRecent(toolId);

      const targetPath = `/tools/${toolId}`;
      if (window.location.pathname !== targetPath) {
        window.history.pushState({ view: 'tool', toolId }, '', targetPath);
      }

      window.scrollTo({ top: 0, behavior: 'instant' });
      return;
    }

    if (view === 'all-tools') {
      setCurrentView('all-tools');
      setActiveToolId(null);
      const filter = param || '';
      setFilterQuery(filter);

      const targetPath = filter ? `/all-tools?${filter}` : '/all-tools';
      if (window.location.pathname + window.location.search !== targetPath) {
        window.history.pushState({ view: 'all-tools', filter }, '', targetPath);
      }

      window.scrollTo({ top: 0, behavior: 'instant' });
      return;
    }

    if (view === 'home') {
      setCurrentView('home');
      setActiveToolId(null);
      setFilterQuery('');

      if (window.location.pathname !== '/' && window.location.pathname !== '') {
        window.history.pushState({ view: 'home' }, '', '/');
      }

      window.scrollTo({ top: 0, behavior: 'instant' });
      return;
    }

    // Other pages: categories, about, contact, privacy, terms
    setCurrentView(view);
    setActiveToolId(null);
    setFilterQuery('');

    const targetPath = `/${view}`;
    if (window.location.pathname !== targetPath) {
      window.history.pushState({ view }, '', targetPath);
    }

    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const activeTool = TOOLS.find(t => t.id === activeToolId);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors duration-200">
      {/* Navigation Top Bar */}
      <Navbar
        currentView={currentView}
        onNavigate={navigateTo}
        isDark={isDark}
        onToggleTheme={() => setIsDark(!isDark)}
        onOpenSearch={() => setIsSearchOpen(true)}
        favoritesCount={favorites.length}
      />

      {/* Main Content Area with Smooth Page Transitions */}
      <div className="flex-1 relative overflow-x-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentView === 'tool' && activeTool ? `tool-${activeTool.id}` : currentView}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -14 }}
            transition={{ duration: 0.28, ease: 'easeOut' }}
            className="w-full"
          >
            {currentView === 'home' && (
              <HomePage
                onNavigate={navigateTo}
                onOpenSearch={() => setIsSearchOpen(true)}
                favorites={favorites}
                onToggleFavorite={handleToggleFavorite}
                recents={recents}
              />
            )}

            {currentView === 'all-tools' && (
              <AllToolsPage
                initialFilter={filterQuery}
                onNavigate={navigateTo}
                favorites={favorites}
                onToggleFavorite={handleToggleFavorite}
              />
            )}

            {currentView === 'categories' && (
              <CategoriesPage onNavigate={navigateTo} />
            )}

            {currentView === 'about' && (
              <AboutPage onNavigate={navigateTo} />
            )}

            {currentView === 'contact' && (
              <ContactPage />
            )}

            {currentView === 'privacy' && (
              <PrivacyPage />
            )}

            {currentView === 'terms' && (
              <TermsPage />
            )}

            {currentView === 'tool' && activeTool && (
              <ToolDispatcher
                tool={activeTool}
                onNavigate={navigateTo}
                isFavorite={favorites.includes(activeTool.id)}
                onToggleFavorite={handleToggleFavorite}
              />
            )}

            {currentView === '404' && (
              <NotFoundPage
                onNavigate={navigateTo}
                onOpenSearch={() => setIsSearchOpen(true)}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer */}
      <Footer onNavigate={navigateTo} />

      {/* Floating Feedback Action Button */}
      <FloatingFeedbackButton onClick={() => setIsFeedbackOpen(true)} />

      {/* Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectTool={toolId => navigateTo('tool', toolId)}
      />

      {/* Feedback & Suggestion Modal */}
      <FeedbackModal
        isOpen={isFeedbackOpen}
        onClose={() => setIsFeedbackOpen(false)}
        currentToolName={activeTool?.name}
      />
    </div>
  );
}
