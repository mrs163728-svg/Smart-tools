import React from 'react';
import { motion } from 'motion/react';
import { Shield, Zap, Globe, ArrowRight, Sparkles } from 'lucide-react';

export const AboutPage: React.FC<{ onNavigate: (view: string) => void }> = ({ onNavigate }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="space-y-3 text-center sm:text-left"
      >
        <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider inline-flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5" />
          Our Mission & Story
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          About Smart Tools World
        </h1>
        <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
          Empowering internet users worldwide with free, lightning-fast, and private digital utilities that run directly inside your web browser.
        </p>
      </motion.div>

      {/* Main Philosophy Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
        className="p-8 sm:p-10 bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-6 shadow-sm backdrop-blur-md"
      >
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
          Built on a Simple Principle: Useful Tools Should Be Free & Private
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          Too many online tools today force you to register an account, bombard you with spam emails, impose artificial paywalls, or secretly transmit your private PDF documents and photos to remote servers.
        </p>
        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          At Smart Tools World, we engineered our platform differently. By utilizing modern web technologies like HTML5 Canvas and client-side JavaScript, all calculations, image processing, and PDF manipulations happen directly on your CPU. Your data never touches a remote database.
        </p>
      </motion.div>

      {/* 3 Pillars */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.35, delay: 0.05 }}
          whileHover={{ y: -4 }}
          className="p-6 bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-3 shadow-xs"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <Shield className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Zero Data Storage</h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            We don’t track, store, or log user data. Everything processed in your browser is wiped from memory as soon as you close the tab.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.35, delay: 0.1 }}
          whileHover={{ y: -4 }}
          className="p-6 bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-3 shadow-xs"
        >
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
            <Zap className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Instant Browser Speed</h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            No uploading delays or server queues. Your local hardware executes transformations in milliseconds.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.35, delay: 0.15 }}
          whileHover={{ y: -4 }}
          className="p-6 bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-3 shadow-xs"
        >
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
            <Globe className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Accessible Worldwide</h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Accessible from any mobile phone, tablet, or desktop computer worldwide with zero fees and no registration required.
          </p>
        </motion.div>
      </div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
        className="p-8 bg-gradient-to-r from-indigo-50 via-purple-50 to-slate-100 dark:from-indigo-950/40 dark:via-purple-950/30 dark:to-slate-900 border border-indigo-200 dark:border-indigo-500/30 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm"
      >
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Ready to streamline your workflow?</h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">Explore all 34 free online tools right now.</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => onNavigate('all-tools')}
          className="px-6 py-3 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-colors flex items-center gap-2 shadow-lg shrink-0 cursor-pointer"
        >
          <span>Explore All Tools</span>
          <ArrowRight className="w-4 h-4" />
        </motion.button>
      </motion.div>
    </div>
  );
};
