import React, { useState } from 'react';
import { calculateAge, AgeResult } from '../../../utils/calculator';
import { Calendar, RotateCcw, Copy, Check, PartyPopper } from 'lucide-react';

export const AgeCalculator: React.FC = () => {
  const [birthDate, setBirthDate] = useState('2000-01-15');
  const [targetDate, setTargetDate] = useState(new Date().toISOString().split('T')[0]);
  const [copied, setCopied] = useState(false);

  const result: AgeResult | null = calculateAge(birthDate, targetDate);

  const handleReset = () => {
    setBirthDate('');
    setTargetDate(new Date().toISOString().split('T')[0]);
  };

  const handleCopy = () => {
    if (!result) return;
    const text = `Age: ${result.years} years, ${result.months} months, ${result.days} days. Next birthday in ${result.daysUntilNextBirthday} days (${result.nextBirthdayDayOfWeek}).`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
            Date of Birth
          </label>
          <div className="relative">
            <input
              type="date"
              value={birthDate}
              onChange={e => setBirthDate(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-100 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
            />
          </div>
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
            Age as of Date (Today)
          </label>
          <input
            type="date"
            value={targetDate}
            onChange={e => setTargetDate(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-100 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
          />
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-3">
        <button
          onClick={handleReset}
          className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-slate-200 bg-slate-800/80 hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-1.5"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset
        </button>
        {result && (
          <button
            onClick={handleCopy}
            className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors flex items-center gap-1.5"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copied to Clipboard' : 'Copy Age Summary'}
          </button>
        )}
      </div>

      {/* Result Card */}
      {result ? (
        <div className="space-y-6 pt-4 border-t border-slate-800">
          <div className="bg-gradient-to-r from-indigo-900/40 via-purple-900/30 to-slate-900/60 border border-indigo-500/30 rounded-2xl p-6 sm:p-8">
            <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">
              Calculated Age
            </span>
            <div className="mt-2 flex flex-wrap items-baseline gap-3 text-slate-100">
              <span className="text-4xl sm:text-5xl font-extrabold tracking-tight tabular-nums text-white">
                {result.years}
              </span>
              <span className="text-xl font-medium text-slate-300">years</span>
              <span className="text-3xl font-bold tracking-tight tabular-nums text-indigo-300">
                {result.months}
              </span>
              <span className="text-lg font-medium text-slate-300">months</span>
              <span className="text-3xl font-bold tracking-tight tabular-nums text-indigo-300">
                {result.days}
              </span>
              <span className="text-lg font-medium text-slate-300">days</span>
            </div>

            {/* Next Birthday Pill */}
            <div className="mt-6 flex items-center gap-2.5 text-xs text-indigo-200 bg-indigo-950/60 border border-indigo-500/30 px-4 py-2.5 rounded-xl w-fit">
              <PartyPopper className="w-4 h-4 text-amber-400" />
              <span>Next Birthday in</span>
              <strong className="text-white font-bold tabular-nums">
                {result.daysUntilNextBirthday} days
              </strong>
              <span>({result.nextBirthdayDayOfWeek})</span>
            </div>
          </div>

          {/* Time breakdown grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div className="bg-slate-950/60 border border-slate-800 p-4 rounded-xl">
              <div className="text-xs text-slate-400">Total Days Lived</div>
              <div className="text-xl font-bold text-white tabular-nums mt-1">
                {result.totalDays.toLocaleString()}
              </div>
            </div>
            <div className="bg-slate-950/60 border border-slate-800 p-4 rounded-xl">
              <div className="text-xs text-slate-400">Total Hours</div>
              <div className="text-xl font-bold text-white tabular-nums mt-1">
                {result.totalHours.toLocaleString()}
              </div>
            </div>
            <div className="bg-slate-950/60 border border-slate-800 p-4 rounded-xl col-span-2 sm:col-span-1">
              <div className="text-xs text-slate-400">Total Minutes</div>
              <div className="text-xl font-bold text-white tabular-nums mt-1">
                {result.totalMinutes.toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-8 text-xs text-slate-400">
          Please select a valid birth date in the past to calculate your age.
        </div>
      )}
    </div>
  );
};
