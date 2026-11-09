import React, { useState, useEffect } from 'react';
import { TOOLS, CATEGORIES } from '../../data/tools';
import { ToolItem, ToolCategory } from '../../types';
import { ToolCard } from '../tools/ToolCard';
import { Search, X, Filter, Heart, Sparkles } from 'lucide-react';

interface AllToolsPageProps {
  initialFilter?: string;
  onNavigate: (view: string, toolId?: string) => void;
  favorites: string[];
  onToggleFavorite: (toolId: string) => void;
}

export const AllToolsPage: React.FC<AllToolsPageProps> = ({
  initialFilter = '',
  onNavigate,
  favorites,
  onToggleFavorite,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ToolCategory | 'all'>('all');
  const [onlyFavorites, setOnlyFavorites] = useState(false);
  const [sortBy, setSortBy] = useState<'popular' | 'name'>('popular');

  // Handle incoming filters like 'category:calculators' or 'search:pdf'
  useEffect(() => {
    if (initialFilter.startsWith('category:')) {
      const cat = initialFilter.replace('category:', '') as ToolCategory;
      setSelectedCategory(cat);
      setSearchQuery('');
    } else if (initialFilter.startsWith('search:')) {
      const q = initialFilter.replace('search:', '');
      setSearchQuery(q);
      setSelectedCategory('all');
    }
  }, [initialFilter]);

  const filteredTools = TOOLS.filter(tool => {
    if (onlyFavorites && !favorites.includes(tool.id)) return false;
    if (selectedCategory !== 'all' && tool.category !== selectedCategory) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const inName = tool.name.toLowerCase().includes(q);
      const inDesc = tool.description.toLowerCase().includes(q);
      const inKeywords = tool.keywords.some(k => k.toLowerCase().includes(q));
      if (!inName && !inDesc && !inKeywords) return false;
    }

    return true;
  }).sort((a, b) => {
    if (sortBy === 'popular') {
      if (a.popular && !b.popular) return -1;
      if (!a.popular && b.popular) return 1;
    }
    return a.name.localeCompare(b.name);
  });

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setOnlyFavorites(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Header */}
      <div className="space-y-2">
        <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
          Complete Directory
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          All Free Online Tools
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 max-w-2xl">
          Search and browse through all {TOOLS.length} utilities. Fast, privacy-focused, and always free to use without registration.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-4 backdrop-blur-md shadow-sm">
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          {/* Search Input */}
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-indigo-500 dark:text-indigo-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search for any tool..."
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700/80 rounded-xl pl-10 pr-10 py-2.5 text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-indigo-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-3 text-slate-400 hover:text-slate-700 dark:hover:text-white cursor-pointer"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Sort & Favorites Filter */}
          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
            <button
              onClick={() => setOnlyFavorites(!onlyFavorites)}
              className={`px-3 py-2 text-xs font-semibold rounded-xl border transition-colors flex items-center gap-1.5 cursor-pointer ${
                onlyFavorites
                  ? 'bg-rose-50 dark:bg-rose-500/15 border-rose-300 dark:border-rose-500/40 text-rose-600 dark:text-rose-300'
                  : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${onlyFavorites ? 'fill-rose-500 text-rose-500' : ''}`} />
              <span>Favorites ({favorites.length})</span>
            </button>

            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as any)}
              className="bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-300 text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-indigo-500"
            >
              <option value="popular">Sort: Popular First</option>
              <option value="name">Sort: Alphabetical (A-Z)</option>
            </select>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar pt-2 border-t border-slate-100 dark:border-slate-800/60">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl whitespace-nowrap transition-colors cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-indigo-600 text-white shadow'
                : 'bg-slate-100 dark:bg-slate-950 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            All Categories ({TOOLS.length})
          </button>
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-indigo-600 text-white shadow'
                  : 'bg-slate-100 dark:bg-slate-950 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800'
              }`}
            >
              {cat.name} ({cat.count})
            </button>
          ))}
        </div>
      </div>

      {/* Results Count & Active Filters Indicator */}
      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
        <span>
          Showing <strong className="text-slate-900 dark:text-white font-mono">{filteredTools.length}</strong> of{' '}
          {TOOLS.length} tools
        </span>
        {(searchQuery || selectedCategory !== 'all' || onlyFavorites) && (
          <button
            onClick={clearFilters}
            className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 font-semibold cursor-pointer"
          >
            Reset Filters
          </button>
        )}
      </div>

      {/* Tool Cards Grid */}
      {filteredTools.length === 0 ? (
        <div className="text-center py-20 px-4 bg-slate-50 dark:bg-slate-900/30 border border-slate-200 dark:border-slate-800/80 rounded-3xl space-y-3">
          <p className="text-lg font-bold text-slate-800 dark:text-slate-200">
            No tools found. Try another keyword.
          </p>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            We couldn&apos;t find any tools matching your current search criteria.
          </p>
          <button
            onClick={clearFilters}
            className="mt-3 px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl"
          >
            Clear Filters & View All Tools
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredTools.map((tool, idx) => (
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
      )}
    </div>
  );
};
