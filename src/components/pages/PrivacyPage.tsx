import React from 'react';
import { ShieldCheck, Lock, EyeOff, Server } from 'lucide-react';

export const PrivacyPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10 text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
      <div className="space-y-3">
        <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
          Privacy Policy
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Your Privacy Is Guaranteed
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">Last updated: 2026-03-01</p>
      </div>

      <div className="p-6 bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-4 shadow-sm">
        <div className="flex items-center gap-3 text-emerald-600 dark:text-emerald-400 font-bold text-base">
          <ShieldCheck className="w-5 h-5" />
          <span>Core Guarantee: 100% Browser-Side Processing</span>
        </div>
        <p className="text-slate-600 dark:text-slate-300">
          At Smart Tools World, we believe user privacy is a fundamental digital right. Our website is architected so that all files you upload (including images, photos, PDF documents, and text snippets) are processed locally inside your web browser.
        </p>
      </div>

      <div className="space-y-6">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">1. Information We Do NOT Collect</h2>
        <ul className="list-disc pl-5 space-y-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
          <li><strong>Zero File Storage:</strong> Uploaded images and PDFs are never transferred to or saved on any server.</li>
          <li><strong>No Personal Accounts:</strong> We do not require registration, usernames, passwords, phone numbers, or credit cards.</li>
          <li><strong>No Keystroke Tracking:</strong> Text inputs in our calculators, converters, or text tools are analyzed purely in browser memory.</li>
        </ul>

        <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">2. Local Storage Preferences</h2>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
          To provide conveniences such as remembering your favorite tools and light/dark theme preference, we use your device&apos;s standard <code>localStorage</code>. This data never leaves your computer and you can clear it anytime from your browser settings.
        </p>

        <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">3. Third-Party Exchange Rate API</h2>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
          For the Currency Converter tool, our client queries a public exchange rate endpoint (Open Exchange Rates / er-api) to provide up-to-date conversion rates. No personal identifiers or converted amounts are sent with this lookup.
        </p>

        <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">4. Contact Information</h2>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
          If you have questions regarding our privacy practices, you can contact us at{' '}
          <a href="mailto:privacy@smarttoolsworld.com" className="text-indigo-600 dark:text-indigo-400 underline font-medium">
            privacy@smarttoolsworld.com
          </a>.
        </p>
      </div>
    </div>
  );
};
