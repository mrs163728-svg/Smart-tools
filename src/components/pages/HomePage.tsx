import React, { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { TOOLS, CATEGORIES } from '../../data/tools';
import { ToolCard } from '../tools/ToolCard';
import { ToolIcon } from '../common/IconHelper';
import {
  Search,
  ArrowRight,
  ShieldCheck,
  Zap,
  Globe2,
  Lock,
  Heart,
  History,
  Sparkles,
  Compass,
  Flame,
  ArrowUpRight,
  X,
} from 'lucide-react';

interface HomePageProps {
  onNavigate: (view: string, toolId?: string) => void;
  onOpenSearch: () => void;
  favorites: string[];
  onToggleFavorite: (toolId: string) => void;
  recents: string[];
}

export const HomePage: React.FC<HomePageProps> = ({
  onNavigate,
  onOpenSearch,
  favorites,
  onToggleFavorite,
  recents,
}) => {
  const [heroSearchInput, setHeroSearchInput] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  const popularTools = TOOLS.filter(t => t.popular);
  const favoriteTools = TOOLS.filter(t => favorites.includes(t.id));
  const recentTools = TOOLS.filter(t => recents.includes(t.id));

  // Instant matching tools for hero search suggestions
  const searchSuggestions = useMemo(() => {
    const q = heroSearchInput.trim().toLowerCase();
    if (!q) return [];
    return TOOLS.filter(
      tool =>
        tool.name.toLowerCase().includes(q) ||
        tool.description.toLowerCase().includes(q) ||
        tool.keywords.some(k => k.toLowerCase().includes(q))
    ).slice(0, 6);
  }, [heroSearchInput]);

  // Close suggestions dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleHeroSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchSuggestions.length > 0) {
      onNavigate('tool', searchSuggestions[0].id);
      setIsSearchFocused(false);
    } else if (heroSearchInput.trim()) {
      onNavigate('all-tools', `search:${heroSearchInput.trim()}`);
      setIsSearchFocused(false);
    } else {
      onOpenSearch();
    }
  };

  const scrollToPopular = () => {
    const el = document.getElementById('popular-tools-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Helper to highlight matching text in search suggestions
  const highlightMatch = (text: string, query: string) => {
    if (!query) return text;
    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return (
      <>
        {parts.map((part, i) =>
          part.toLowerCase() === query.toLowerCase() ? (
            <span key={i} className="text-indigo-600 dark:text-indigo-400 font-extrabold bg-indigo-500/10 px-0.5 rounded">
              {part}
            </span>
          ) : (
            part
          )
        )}
      </>
    );
  };

  return (
    <div className="space-y-24 pb-16 overflow-hidden">
      {/* 1. ANIMATED HERO SECTION */}
      <section className="relative pt-12 sm:pt-24 pb-20 px-4 sm:px-6 lg:px-8 text-center">
        {/* Floating animated glowing background orbs */}
        <motion.div
          animate={{
            scale: [1, 1.15, 1],
            x: [0, 20, 0],
            y: [0, -25, 0],
          }}
          transition={{
            duration: 9,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute top-10 left-1/2 -translate-x-1/2 w-[550px] sm:w-[750px] h-[350px] sm:h-[450px] bg-gradient-to-tr from-indigo-600/25 via-purple-600/20 to-pink-500/15 blur-[130px] rounded-full pointer-events-none -z-10"
        />

        {/* Secondary floating particles */}
        <motion.div
          animate={{
            y: [0, 30, 0],
            x: [0, -20, 0],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 11,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute top-40 left-1/4 w-72 h-72 bg-blue-500/15 blur-[100px] rounded-full pointer-events-none -z-10"
        />

        <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8">
          {/* Subtle trust kicker badge with bounce */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-500/30 text-indigo-700 dark:text-indigo-300 text-xs font-semibold shadow-sm backdrop-blur-md"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 animate-pulse" />
            <span>34+ Free Utilities · 100% Client-Side Privacy</span>
          </motion.div>

          {/* Main Heading: "Smart Tools. Smarter Life." */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="space-y-1"
          >
            <h1 className="text-4xl sm:text-7xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.12]">
              Smart Tools.{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 dark:from-indigo-400 dark:via-purple-300 dark:to-pink-400">
                Smarter Life.
              </span>
            </h1>
          </motion.div>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-base sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed"
          >
            Discover powerful free online tools to make your everyday tasks easier. Instant calculators, image compression, PDF merge & split, code formatters, and unit converters.
          </motion.p>

          {/* Animated Interactive Search Bar with instant suggestions */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            ref={searchContainerRef}
            className="pt-2 max-w-2xl mx-auto relative z-30"
          >
            <form onSubmit={handleHeroSearchSubmit} className="relative">
              <div className="relative flex items-center group">
                <Search className="absolute left-4.5 w-5 h-5 text-indigo-500 dark:text-indigo-400 transition-transform group-focus-within:scale-110" />
                <input
                  type="text"
                  value={heroSearchInput}
                  onChange={e => {
                    setHeroSearchInput(e.target.value);
                    setIsSearchFocused(true);
                  }}
                  onFocus={() => setIsSearchFocused(true)}
                  placeholder="Search for any tool... (e.g. Age Calculator, Compress PDF, JSON)"
                  className="w-full bg-white/90 dark:bg-slate-900/90 border border-slate-300 dark:border-slate-700/80 hover:border-indigo-500/80 focus:border-indigo-500 rounded-2xl pl-12 pr-28 py-4 text-sm sm:text-base text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 shadow-xl focus:outline-none focus:ring-4 focus:ring-indigo-500/20 transition-all backdrop-blur-md"
                />
                {heroSearchInput && (
                  <button
                    type="button"
                    onClick={() => {
                      setHeroSearchInput('');
                      setIsSearchFocused(false);
                    }}
                    className="absolute right-24 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  type="submit"
                  className="absolute right-2.5 px-5 py-2.5 text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 rounded-xl transition-all shadow-md shadow-indigo-500/20 cursor-pointer"
                >
                  Search
                </motion.button>
              </div>
            </form>

            {/* Instant Floating Suggestions Dropdown */}
            <AnimatePresence>
              {isSearchFocused && heroSearchInput.trim() && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 4, scale: 0.98 }}
                  transition={{ duration: 0.2 }}
                  className="absolute left-0 right-0 mt-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-xl text-left z-50 divide-y divide-slate-100 dark:divide-slate-800"
                >
                  {searchSuggestions.length > 0 ? (
                    <div>
                      <div className="px-4 py-2 bg-slate-50 dark:bg-slate-950/60 text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center justify-between">
                        <span>Matching Tools ({searchSuggestions.length})</span>
                        <span className="text-[10px] normal-case text-indigo-600 dark:text-indigo-400">Click to open</span>
                      </div>
                      <div className="p-2 space-y-1">
                        {searchSuggestions.map(tool => (
                          <div
                            key={tool.id}
                            onClick={() => {
                              onNavigate('tool', tool.id);
                              setIsSearchFocused(false);
                              setHeroSearchInput('');
                            }}
                            className="group flex items-center justify-between p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors cursor-pointer"
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <div className="w-9 h-9 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                                <ToolIcon name={tool.icon} className="w-5 h-5" />
                              </div>
                              <div className="min-w-0">
                                <div className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate">
                                  {highlightMatch(tool.name, heroSearchInput)}
                                </div>
                                <div className="text-xs text-slate-500 dark:text-slate-400 truncate">
                                  {tool.description}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 pl-3 shrink-0">
                              <span className="text-[10px] font-semibold text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md uppercase">
                                {tool.category}
                              </span>
                              <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="p-6 text-center space-y-2">
                      <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                        No tools found matching &quot;{heroSearchInput}&quot;
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Try searching by category (calculator, image, pdf, dev, converter) or browse all tools.
                      </p>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Two Hero Action Buttons with animations */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="pt-2 flex flex-wrap items-center justify-center gap-4"
          >
            <motion.button
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onNavigate('all-tools')}
              className="px-6 py-3.5 text-sm font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 rounded-xl shadow-lg shadow-indigo-500/25 transition-all flex items-center gap-2 group cursor-pointer"
            >
              <Compass className="w-4 h-4" />
              <span>Explore All Tools</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={scrollToPopular}
              className="px-6 py-3.5 text-sm font-bold text-slate-700 hover:text-slate-900 dark:text-slate-200 dark:hover:text-white bg-white hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl transition-all shadow-sm cursor-pointer flex items-center gap-2"
            >
              <Flame className="w-4 h-4 text-amber-500" />
              <span>Discover Popular Tools</span>
            </motion.button>
          </motion.div>

          {/* Trust badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 dark:text-slate-400"
          >
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
              <span>Zero Server Uploads</span>
            </div>
            <span>·</span>
            <div className="flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
              <span>No Sign Up Required</span>
            </div>
            <span>·</span>
            <div className="flex items-center gap-1.5">
              <Globe2 className="w-4 h-4 text-purple-500 dark:text-purple-400" />
              <span>Unlimited Free Use</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. RECENTLY USED TOOLS (if user has history) */}
      {recentTools.length > 0 && (
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.4 }}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4"
        >
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
              Recently Used Tools
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {recentTools.slice(0, 4).map((tool, idx) => (
              <ToolCard
                key={tool.id}
                tool={tool}
                index={idx}
                onSelect={id => onNavigate('tool', id)}
                isFavorite={favorites.includes(tool.id)}
                onToggleFavorite={onToggleFavorite}
              />
            ))}
          </div>
        </motion.section>
      )}

      {/* 3. FAVORITE TOOLS (if any saved) */}
      {favoriteTools.length > 0 && (
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.4 }}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4"
        >
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
            <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
              Your Favorite Tools ({favoriteTools.length})
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {favoriteTools.map((tool, idx) => (
              <ToolCard
                key={tool.id}
                tool={tool}
                index={idx}
                onSelect={id => onNavigate('tool', id)}
                isFavorite={true}
                onToggleFavorite={onToggleFavorite}
              />
            ))}
          </div>
        </motion.section>
      )}

      {/* 4. TOOL CATEGORIES GRID WITH SCROLL ANIMATIONS */}
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.45 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6"
      >
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
              Browse by Suite
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1">
              Tool Categories
            </h2>
          </div>
          <motion.button
            whileHover={{ x: 3 }}
            onClick={() => onNavigate('categories')}
            className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 flex items-center gap-1 cursor-pointer"
          >
            <span>View All Categories</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </motion.button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {CATEGORIES.map((cat, idx) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: idx * 0.06 }}
              whileHover={{ y: -5, scale: 1.015 }}
              whileTap={{ scale: 0.985 }}
              onClick={() => onNavigate('all-tools', `category:${cat.id}`)}
              className="group p-6 bg-white dark:bg-slate-900/60 hover:bg-slate-50 dark:hover:bg-slate-900/90 border border-slate-200 dark:border-slate-800/80 hover:border-indigo-500/50 rounded-2xl transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/10 cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-indigo-500/10 to-purple-500/10 dark:from-indigo-500/20 dark:to-purple-500/20 border border-indigo-500/20 dark:border-indigo-500/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 group-hover:scale-110 group-hover:rotate-3 transition-transform mb-4 shadow-sm">
                  <ToolIcon name={cat.icon} className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-300 transition-colors">
                  {cat.name}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed line-clamp-2">
                  {cat.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between text-xs">
                <span className="text-slate-500 dark:text-slate-400 font-mono font-medium">
                  {cat.count} Real Tools
                </span>
                <span className="text-indigo-600 dark:text-indigo-400 font-semibold group-hover:translate-x-1 transition-transform flex items-center gap-1">
                  Explore Suite →
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* 5. POPULAR TOOLS SECTION */}
      <motion.section
        id="popular-tools-section"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.45 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 pt-4"
      >
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
              Most Used Worldwide
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1">
              Popular Tools
            </h2>
          </div>
          <motion.button
            whileHover={{ x: 3 }}
            onClick={() => onNavigate('all-tools')}
            className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 flex items-center gap-1 cursor-pointer"
          >
            <span>See All 34 Tools</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </motion.button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {popularTools.map((tool, idx) => (
            <ToolCard
              key={tool.id}
              tool={tool}
              index={idx}
              onSelect={id => onNavigate('tool', id)}
              isFavorite={favorites.includes(tool.id)}
              onToggleFavorite={onToggleFavorite}
            />
          ))}
        </div>
      </motion.section>

      {/* 6. WHY SMART TOOLS WORLD - FEATURE HIGHLIGHTS */}
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.45 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8"
      >
        <div className="p-8 sm:p-12 rounded-3xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 relative overflow-hidden backdrop-blur-md shadow-lg">
          <div className="max-w-3xl space-y-4">
            <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
              Built for Speed & Privacy
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Why Professionals & Students Choose Smart Tools World
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Unlike other platforms that force account creation or upload your private documents to remote cloud servers, Smart Tools World runs our conversion, compression, and calculation algorithms client-side right in your browser.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-8 pt-8 border-t border-slate-100 dark:border-slate-800">
            <motion.div
              whileHover={{ y: -3 }}
              className="space-y-2 p-4 rounded-2xl bg-slate-50/50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-800/80"
            >
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <Lock className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">100% Private & Secure</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Your images, PDFs, passwords, and data stay on your computer. Nothing is transmitted or saved remotely.
              </p>
            </motion.div>

            <motion.div
              whileHover={{ y: -3 }}
              className="space-y-2 p-4 rounded-2xl bg-slate-50/50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-800/80"
            >
              <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                <Zap className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Blazing Fast Latency</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Zero network roundtrips. Tools calculate, compress, format, and generate output in real-time.
              </p>
            </motion.div>

            <motion.div
              whileHover={{ y: -3 }}
              className="space-y-2 p-4 rounded-2xl bg-slate-50/50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-800/80"
            >
              <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                <Globe2 className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Always Free, No Catch</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                No credit cards, no login friction, no paywalls. Free for individuals, teams, and students worldwide.
              </p>
            </motion.div>
          </div>
        </div>
      </motion.section>
    </div>
  );
};
