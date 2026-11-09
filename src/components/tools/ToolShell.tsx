import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ToolItem } from '../../types';
import { ToolIcon } from '../common/IconHelper';
import { CATEGORIES, TOOLS } from '../../data/tools';
import { ToolCard } from './ToolCard';
import { Heart, Share2, ShieldCheck, ChevronRight, Check, ArrowRight } from 'lucide-react';

interface ToolShellProps {
  tool: ToolItem;
  onNavigate: (view: string, toolId?: string) => void;
  isFavorite: boolean;
  onToggleFavorite: (toolId: string) => void;
  instructions: { step: string; detail: string }[];
  children: React.ReactNode;
}

export const ToolShell: React.FC<ToolShellProps> = ({
  tool,
  onNavigate,
  isFavorite,
  onToggleFavorite,
  instructions,
  children,
}) => {
  const [copied, setCopied] = useState(false);
  const category = CATEGORIES.find(c => c.id === tool.category);

  // Related tools: other tools from same category, excluding current tool
  const relatedTools = TOOLS.filter(t => t.category === tool.category && t.id !== tool.id).slice(0, 3);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -14 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10"
    >
      {/* Breadcrumb Bar */}
      <motion.nav
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400"
        aria-label="Breadcrumb"
      >
        <button
          onClick={() => onNavigate('home')}
          className="hover:text-indigo-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
        >
          Home
        </button>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <button
          onClick={() => onNavigate('all-tools', `category:${tool.category}`)}
          className="hover:text-indigo-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
        >
          {category?.name || tool.category}
        </button>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <span className="text-slate-900 dark:text-slate-200 font-semibold truncate">
          {tool.name}
        </span>
      </motion.nav>

      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-start gap-4">
          <motion.div
            initial={{ scale: 0.8, rotate: -5 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', damping: 15 }}
            className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-tr from-indigo-500/20 via-purple-500/20 to-pink-500/10 dark:from-indigo-600/30 dark:to-purple-600/30 border border-indigo-500/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0 shadow-lg shadow-indigo-500/10"
          >
            <ToolIcon name={tool.icon} className="w-7 h-7 sm:w-8 sm:h-8" />
          </motion.div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
              <span>{category?.name}</span>
              <span aria-hidden="true">·</span>
              <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-medium">
                <ShieldCheck className="w-3.5 h-3.5" />
                100% Client-Side Privacy
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {tool.name}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
              {tool.description}
            </p>
          </div>
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-2.5 self-start md:self-auto shrink-0">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => onToggleFavorite(tool.id)}
            className={`px-3.5 py-2.5 rounded-xl border text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer ${
              isFavorite
                ? 'bg-rose-50 dark:bg-rose-500/15 border-rose-300 dark:border-rose-500/40 text-rose-600 dark:text-rose-300 shadow-sm'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
            aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-rose-500 text-rose-500 dark:fill-rose-400' : ''}`} />
            <span>{isFavorite ? 'Favorited' : 'Favorite'}</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            onClick={handleShare}
            className="px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all flex items-center gap-2 text-xs font-semibold cursor-pointer shadow-xs"
            aria-label="Share tool link"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span className="text-emerald-600 dark:text-emerald-400">Copied!</span>
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4" />
                <span>Share</span>
              </>
            )}
          </motion.button>
        </div>
      </div>

      {/* Main Interactive Tool Body Card */}
      <motion.main
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.1 }}
        className="bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-10 backdrop-blur-md shadow-xl dark:shadow-2xl relative overflow-hidden"
      >
        {children}
      </motion.main>

      {/* Instructions: How to use */}
      {instructions && instructions.length > 0 && (
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.35 }}
          className="bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800/80 rounded-2xl p-6 sm:p-8 space-y-4"
        >
          <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
            How to Use the {tool.name}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-1">
            {instructions.map((ins, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/70 rounded-xl p-4 space-y-1.5 shadow-xs"
              >
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 font-mono text-xs flex items-center justify-center font-bold">
                    {idx + 1}
                  </span>
                  <h3 className="text-xs font-bold text-slate-900 dark:text-slate-200">
                    {ins.step}
                  </h3>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed pl-8">
                  {ins.detail}
                </p>
              </div>
            ))}
          </div>
        </motion.section>
      )}

      {/* Related Tools */}
      {relatedTools.length > 0 && (
        <section className="space-y-4 pt-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                Related {category?.name}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Explore more powerful tools in this category.
              </p>
            </div>
            <button
              onClick={() => onNavigate('all-tools', `category:${tool.category}`)}
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 flex items-center gap-1 cursor-pointer"
            >
              <span>View all {category?.name}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {relatedTools.map((rt, idx) => (
              <ToolCard
                key={rt.id}
                tool={rt}
                index={idx}
                onSelect={id => onNavigate('tool', id)}
                isFavorite={false}
                onToggleFavorite={() => onToggleFavorite(rt.id)}
              />
            ))}
          </div>
        </section>
      )}
    </motion.div>
  );
};
