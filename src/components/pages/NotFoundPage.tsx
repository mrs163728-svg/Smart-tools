import React from 'react';
import { Home, Search, Compass, ArrowRight } from 'lucide-react';

interface NotFoundPageProps {
  onNavigate: (view: string, toolId?: string) => void;
  onOpenSearch: () => void;
}

export const NotFoundPage: React.FC<NotFoundPageProps> = ({ onNavigate, onOpenSearch }) => {
  return (
    <div className="max-w-2xl mx-auto px-4 py-24 text-center space-y-6">
      <div className="inline-block p-4 rounded-3xl bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20 text-indigo-600 dark:text-indigo-400 font-mono text-3xl font-extrabold shadow-sm">
        404
      </div>

      <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
        Page or Tool Not Found
      </h1>

      <p className="text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto leading-relaxed">
        The tool or page you are looking for doesn&apos;t seem to exist or may have been moved. Try searching or browse our tools directory.
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
        <button
          onClick={() => onNavigate('home')}
          className="px-5 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl flex items-center gap-2 shadow cursor-pointer"
        >
          <Home className="w-4 h-4" />
          <span>Back to Home</span>
        </button>

        <button
          onClick={() => onNavigate('all-tools')}
          className="px-5 py-2.5 text-xs font-bold text-slate-700 hover:text-slate-900 dark:text-slate-200 dark:hover:text-white bg-white hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl flex items-center gap-2 cursor-pointer shadow-xs"
        >
          <Compass className="w-4 h-4" />
          <span>Browse All Tools</span>
        </button>

        <button
          onClick={onOpenSearch}
          className="px-5 py-2.5 text-xs font-bold text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white bg-white hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl flex items-center gap-2 cursor-pointer shadow-xs"
        >
          <Search className="w-4 h-4" />
          <span>Search Tools</span>
        </button>
      </div>
    </div>
  );
};
