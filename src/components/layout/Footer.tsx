import React from 'react';
import { Wrench, Shield, Zap, Sparkles, Heart } from 'lucide-react';
import { CATEGORIES } from '../../data/tools';

interface FooterProps {
  onNavigate: (view: string, toolId?: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="mt-20 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Column 1: Brand & Description */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center text-white shadow-md">
                <Wrench className="w-4 h-4" />
              </div>
              <span className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">Smart Tools World</span>
            </div>
            <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-400">
              Smart Tools World provides free, simple, and powerful online tools to make everyday tasks easier.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-400 pt-1">
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              <span>100% Client-Side • Zero Data Stored</span>
            </div>
          </div>

          {/* Column 2: Navigation Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider">Navigation</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onNavigate('home')}
                  className="hover:text-indigo-400 transition-colors"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('all-tools')}
                  className="hover:text-indigo-400 transition-colors"
                >
                  All Tools (34 Utilities)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('categories')}
                  className="hover:text-indigo-400 transition-colors"
                >
                  Categories
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('about')}
                  className="hover:text-indigo-400 transition-colors"
                >
                  About Us
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('contact')}
                  className="hover:text-indigo-400 transition-colors"
                >
                  Contact Us
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Category Highlights */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider">Tool Suites</h4>
            <ul className="space-y-2 text-xs">
              {CATEGORIES.map(cat => (
                <li key={cat.id}>
                  <button
                    onClick={() => onNavigate('all-tools', `category:${cat.id}`)}
                    className="hover:text-indigo-400 transition-colors flex items-center justify-between w-full pr-6"
                  >
                    <span>{cat.name}</span>
                    <span className="text-[11px] font-mono text-slate-400">{cat.count} tools</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Legal & Privacy */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider">Legal & Trust</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onNavigate('privacy')}
                  className="hover:text-indigo-400 transition-colors"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('terms')}
                  className="hover:text-indigo-400 transition-colors"
                >
                  Terms & Conditions
                </button>
              </li>
              <li>
                <span className="text-slate-400 flex items-center gap-1.5 pt-2">
                  <Zap className="w-3.5 h-3.5 text-indigo-400" />
                  No Registration Required
                </span>
              </li>
              <li>
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Heart className="w-3.5 h-3.5 text-rose-400" />
                  Free for Everyone Worldwide
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom divider and copyright */}
        <div className="mt-12 pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-3">
          <p>© 2026 Smart Tools World. All Rights Reserved.</p>
          <div className="flex items-center gap-4">
            <button onClick={() => onNavigate('privacy')} className="hover:text-slate-300">
              Privacy Policy
            </button>
            <span>·</span>
            <button onClick={() => onNavigate('terms')} className="hover:text-slate-300">
              Terms & Conditions
            </button>
            <span>·</span>
            <button onClick={() => onNavigate('contact')} className="hover:text-slate-300">
              Support
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
