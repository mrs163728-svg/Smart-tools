import React from 'react';
import { motion } from 'motion/react';
import { CATEGORIES, TOOLS } from '../../data/tools';
import { ToolIcon } from '../common/IconHelper';
import { ArrowRight, ArrowUpRight } from 'lucide-react';

interface CategoriesPageProps {
  onNavigate: (view: string, toolId?: string) => void;
}

export const CategoriesPage: React.FC<CategoriesPageProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="space-y-2"
      >
        <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
          Tool Suites
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Explore by Category
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
          Discover all 6 specialized suites designed for developers, designers, students, writers, and everyday productivity.
        </p>
      </motion.div>

      {/* Category Sections */}
      <div className="space-y-12">
        {CATEGORIES.map((category, catIdx) => {
          const categoryTools = TOOLS.filter(t => t.category === category.id);

          return (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.4, delay: catIdx * 0.05 }}
              className="p-6 sm:p-8 bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-6 shadow-sm backdrop-blur-md"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-indigo-500/10 to-purple-500/10 dark:from-indigo-500/20 dark:to-purple-500/20 border border-indigo-500/20 dark:border-indigo-500/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shadow-sm">
                    <ToolIcon name={category.icon} className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                      {category.name}
                    </h2>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                      {category.description}
                    </p>
                  </div>
                </div>

                <motion.button
                  whileHover={{ x: 3 }}
                  onClick={() => onNavigate('all-tools', `category:${category.id}`)}
                  className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 flex items-center gap-1 self-start sm:self-auto cursor-pointer"
                >
                  <span>Filter in Directory</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </motion.button>
              </div>

              {/* Tools List in this category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {categoryTools.map((tool, toolIdx) => (
                  <motion.div
                    key={tool.id}
                    initial={{ opacity: 0, y: 14 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: toolIdx * 0.04 }}
                    whileHover={{ y: -3, scale: 1.015 }}
                    whileTap={{ scale: 0.985 }}
                    onClick={() => onNavigate('tool', tool.id)}
                    className="p-4 bg-slate-50 dark:bg-slate-950/70 hover:bg-slate-100 dark:hover:bg-slate-950 border border-slate-200 dark:border-slate-800/80 hover:border-indigo-500/40 rounded-2xl transition-all cursor-pointer group flex items-start justify-between gap-3 shadow-xs"
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform mt-0.5">
                        <ToolIcon name={tool.icon} className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-300 transition-colors truncate">
                            {tool.name}
                          </h3>
                          {tool.popular && (
                            <span className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold shrink-0">Popular</span>
                          )}
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 mt-1">
                          {tool.description}
                        </p>
                      </div>
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 shrink-0 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
