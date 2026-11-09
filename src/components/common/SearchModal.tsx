import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, X, ArrowRight, Sparkles, Frown } from 'lucide-react';
import { TOOLS, CATEGORIES } from '../../data/tools';
import { ToolItem, ToolCategory } from '../../types';
import { ToolIcon } from './IconHelper';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTool: (toolId: string) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose, onSelectTool }) => {
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ToolCategory | 'all'>('all');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 60);
    } else {
      setQuery('');
      setSelectedCategory('all');
    }
  }, [isOpen]);

  // Global keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredTools: ToolItem[] = TOOLS.filter(tool => {
    const matchesCategory = selectedCategory === 'all' || tool.category === selectedCategory;
    if (!matchesCategory) return false;
    if (!query.trim()) return true;

    const q = query.toLowerCase();
    const inName = tool.name.toLowerCase().includes(q);
    const inDesc = tool.description.toLowerCase().includes(q);
    const inKeywords = tool.keywords.some(k => k.toLowerCase().includes(q));
    const inCat = tool.category.toLowerCase().includes(q);
    return inName || inDesc || inKeywords || inCat;
  });

  const handleSelect = (toolId: string) => {
    onSelectTool(toolId);
    onClose();
  };

  const highlightMatch = (text: string, q: string) => {
    if (!q.trim()) return text;
    const parts = text.split(new RegExp(`(${q.trim()})`, 'gi'));
    return (
      <>
        {parts.map((part, i) =>
          part.toLowerCase() === q.trim().toLowerCase() ? (
            <span key={i} className="text-indigo-600 dark:text-indigo-400 font-extrabold bg-indigo-500/15 px-0.5 rounded">
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
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-slate-950/75 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      aria-label="Search all tools"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: -12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -12 }}
        transition={{ duration: 0.22, ease: 'easeOut' }}
        className="w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh] text-slate-900 dark:text-slate-100"
        onClick={e => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3">
          <Search className="w-5 h-5 text-indigo-500 dark:text-indigo-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search all 34 tools by name, category, or action..."
            className="w-full bg-transparent text-slate-900 dark:text-slate-100 placeholder-slate-400 text-sm sm:text-base focus:outline-none"
            aria-label="Search query"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-md cursor-pointer"
              aria-label="Clear search input"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="px-2 py-1 text-xs text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-lg cursor-pointer"
          >
            ESC
          </button>
        </div>

        {/* Category Filter Tabs */}
        <div className="px-4 py-2.5 bg-slate-50 dark:bg-slate-950/50 border-b border-slate-100 dark:border-slate-800 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            All Categories
          </button>
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800'
              }`}
            >
              {cat.name.replace(' Tools', '')}
            </button>
          ))}
        </div>

        {/* Results List */}
        <div className="overflow-y-auto p-3 space-y-1.5 flex-1">
          {filteredTools.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-12 px-4 space-y-2"
            >
              <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 mx-auto">
                <Frown className="w-6 h-6" />
              </div>
              <p className="text-slate-800 dark:text-slate-200 font-bold text-sm">
                No tools found. Try another keyword.
              </p>
              <p className="text-slate-500 dark:text-slate-400 text-xs">
                Try searching for &quot;age&quot;, &quot;compress&quot;, &quot;currency&quot;, &quot;pdf&quot;, or &quot;json&quot;.
              </p>
            </motion.div>
          ) : (
            filteredTools.map((tool, idx) => (
              <motion.button
                key={tool.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: Math.min(idx * 0.02, 0.2) }}
                whileHover={{ x: 3 }}
                onClick={() => handleSelect(tool.id)}
                className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-all text-left group border border-transparent hover:border-slate-200 dark:hover:border-slate-700/60 cursor-pointer"
              >
                <div className="flex items-center gap-3.5 min-w-0 pr-3">
                  <div className="w-9 h-9 rounded-lg bg-indigo-500/10 dark:bg-indigo-500/20 border border-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0 group-hover:scale-110 transition-transform">
                    <ToolIcon name={tool.icon} className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-300 truncate">
                        {highlightMatch(tool.name, query)}
                      </span>
                      {tool.popular && (
                        <span className="text-[10px] text-amber-600 dark:text-amber-400 font-bold px-1.5 py-0.2 bg-amber-50 dark:bg-amber-500/10 rounded">
                          Popular
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                      {tool.description}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 shrink-0">
                  <span className="text-xs hidden sm:inline font-medium">Open</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </motion.button>
            ))
          )}
        </div>

        {/* Footer tip */}
        <div className="px-4 py-2.5 bg-slate-50 dark:bg-slate-950/70 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span>Shortcut:</span>
            <span className="font-mono bg-slate-200 dark:bg-slate-800 px-1.5 py-0.5 rounded text-slate-700 dark:text-slate-300 font-semibold">/</span>
            <span>or click any tool</span>
          </div>
          <span className="font-medium">{filteredTools.length} tools available</span>
        </div>
      </motion.div>
    </div>
  );
};
