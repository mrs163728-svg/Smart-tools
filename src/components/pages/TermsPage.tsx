import React from 'react';
import { FileText, CheckCircle2 } from 'lucide-react';

export const TermsPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10 text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
      <div className="space-y-3">
        <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
          Legal Agreement
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Terms & Conditions
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">Effective Date: 2026-03-01</p>
      </div>

      <div className="space-y-6">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">1. Acceptance of Terms</h2>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
          By accessing and using Smart Tools World, you acknowledge and agree to abide by these Terms and Conditions. If you do not agree with any part of these terms, please discontinue using the service.
        </p>

        <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">2. Free Use License</h2>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
          Smart Tools World grants you a personal, worldwide, royalty-free, non-exclusive license to use all provided tools for personal, academic, and commercial purposes. You are free to process your own documents and assets without restriction.
        </p>

        <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">3. Prohibited Activities</h2>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
          You agree not to attempt to reverse engineer, disrupt, overload, or attack the website infrastructure, or use the service for any unlawful activities or malicious code generation.
        </p>

        <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">4. Disclaimer of Warranties</h2>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
          All utilities and services on Smart Tools World are provided &quot;as is&quot; without warranties of any kind. While we strive for extreme mathematical precision and robust algorithms, we recommend double-checking critical financial or medical calculations independently.
        </p>

        <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">5. Modifications to Service</h2>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
          We reserve the right to add new tools, update features, or make improvements to Smart Tools World at any time without prior notice.
        </p>
      </div>
    </div>
  );
};
