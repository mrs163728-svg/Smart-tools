import React from 'react';
import { motion } from 'motion/react';
import { ToolItem } from '../../types';
import { ToolIcon } from '../common/IconHelper';
import { Heart, ArrowUpRight, Sparkles } from 'lucide-react';
import { CATEGORIES } from '../../data/tools';

interface ToolCardProps {
  tool: ToolItem;
  onSelect: (toolId: string) => void;
  isFavorite: boolean;
  onToggleFavorite: (toolId: string) => void;
  index?: number;
}

export const ToolCard: React.FC<ToolCardProps> = ({
  tool,
  onSelect,
  isFavorite,
  onToggleFavorite,
  index = 0,
}) => {
  const category = CATEGORIES.find(c => c.id === tool.category);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onSelect(tool.id);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onSelect(tool.id);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-20px' }}
      transition={{
        duration: 0.35,
        delay: Math.min((index % 8) * 0.05, 0.35),
        ease: [0.25, 0.1, 0.25, 1],
      }}
      whileHover={{ y: -5, scale: 1.015 }}
      whileTap={{ scale: 0.985 }}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role="link"
      tabIndex={0}
      aria-label={`Open ${tool.name} - ${tool.description}`}
      className="group relative bg-white dark:bg-slate-900/70 hover:bg-slate-50 dark:hover:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500/60 dark:hover:border-indigo-500/50 rounded-2xl p-5 sm:p-6 transition-colors duration-300 shadow-sm hover:shadow-2xl hover:shadow-indigo-500/15 flex flex-col justify-between backdrop-blur-md cursor-pointer overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
    >
      {/* Subtle radial glow on hover */}
      <div
        className="absolute -top-24 -right-24 w-48 h-48 bg-gradient-to-br from-indigo-500/15 via-purple-500/10 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        aria-hidden="true"
      />

      <div>
        {/* Top bar with icon and favorite button */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-indigo-500/15 to-purple-500/15 dark:from-indigo-500/25 dark:to-purple-500/25 border border-indigo-500/20 dark:border-indigo-500/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 group-hover:text-indigo-500 group-hover:scale-110 group-hover:rotate-2 transition-all duration-300 shadow-sm">
            <ToolIcon name={tool.icon} className="w-6 h-6" />
          </div>

          <button
            type="button"
            onClick={e => {
              e.stopPropagation();
              onToggleFavorite(tool.id);
            }}
            className={`p-2 rounded-xl transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 cursor-pointer ${
              isFavorite
                ? 'text-rose-500 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/15 border border-rose-200 dark:border-rose-500/30'
                : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/80 border border-transparent'
            }`}
            aria-label={isFavorite ? `Remove ${tool.name} from favorites` : `Add ${tool.name} to favorites`}
            title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Heart className={`w-4 h-4 transition-transform group-hover:scale-105 ${isFavorite ? 'fill-rose-500 dark:fill-rose-400' : ''}`} />
          </button>
        </div>

        {/* Category & Popular pill */}
        <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1.5 flex items-center gap-1.5 uppercase tracking-wider">
          <span>{category?.name || tool.category}</span>
          {tool.popular && (
            <>
              <span aria-hidden="true" className="text-slate-300 dark:text-slate-600">·</span>
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-amber-50 dark:bg-amber-500/15 text-amber-600 dark:text-amber-400 font-bold normal-case text-[10px] border border-amber-200 dark:border-amber-500/30">
                <Sparkles className="w-2.5 h-2.5" />
                Popular
              </span>
            </>
          )}
        </div>

        {/* Tool Name */}
        <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-300 transition-colors tracking-tight line-clamp-1 mb-2">
          {tool.name}
        </h3>

        {/* Tool Description */}
        <p className="text-xs sm:text-[13px] text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-2">
          {tool.description}
        </p>
      </div>

      {/* Card Footer */}
      <div className="mt-6 pt-3.5 border-t border-slate-100 dark:border-slate-800/70 flex items-center justify-between text-xs">
        <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500">
          Instant · Client-side
        </span>
        <div className="inline-flex items-center gap-1.5 font-bold text-indigo-600 dark:text-indigo-400 group-hover:text-indigo-500 dark:group-hover:text-indigo-300 transition-colors">
          <span>Open Tool</span>
          <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
        </div>
      </div>
    </motion.div>
  );
};
