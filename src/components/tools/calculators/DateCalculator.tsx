import React, { useState } from 'react';
import { calculateDateDiff, calculateAddSubtractDate } from '../../../utils/calculator';
import { RotateCcw, Copy, Check, CalendarDays } from 'lucide-react';

export const DateCalculator: React.FC = () => {
  const [tab, setTab] = useState<'difference' | 'addSubtract'>('difference');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(
    new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );

  // Add/Subtract state
  const [baseDate, setBaseDate] = useState(new Date().toISOString().split('T')[0]);
  const [amount, setAmount] = useState('14');
  const [unit, setUnit] = useState<'days' | 'weeks' | 'months' | 'years'>('days');
  const [op, setOp] = useState<'add' | 'subtract'>('add');
  const [copied, setCopied] = useState(false);

  const diffResult = calculateDateDiff(startDate, endDate);
  const targetDateResult = calculateAddSubtractDate(baseDate, parseInt(amount) || 0, unit, op);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8 max-w-2xl mx-auto">
      {/* Tab toggle */}
      <div className="flex p-1 bg-slate-950 border border-slate-800 rounded-xl w-fit">
        <button
          onClick={() => setTab('difference')}
          className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
            tab === 'difference' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
          }`}
        >
          Days Between Dates
        </button>
        <button
          onClick={() => setTab('addSubtract')}
          className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
            tab === 'addSubtract' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
          }`}
        >
          Add / Subtract from Date
        </button>
      </div>

      {tab === 'difference' ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={e => setStartDate(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                End Date
              </label>
              <input
                type="date"
                value={endDate}
                onChange={e => setEndDate(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {diffResult && (
            <div className="p-6 bg-slate-950/80 border border-slate-800 rounded-2xl space-y-4">
              <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">
                Total Difference
              </span>
              <div className="flex items-baseline gap-3">
                <span className="text-4xl sm:text-5xl font-extrabold text-white tabular-nums tracking-tight">
                  {diffResult.days.toLocaleString()}
                </span>
                <span className="text-xl font-medium text-slate-300">calendar days</span>
              </div>

              <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-800 text-xs">
                <div>
                  <span className="text-slate-400">Weeks:</span>
                  <div className="text-base font-bold text-slate-100 tabular-nums">
                    {diffResult.weeks}
                  </div>
                </div>
                <div>
                  <span className="text-slate-400">Approx Months:</span>
                  <div className="text-base font-bold text-slate-100 tabular-nums">
                    {diffResult.months}
                  </div>
                </div>
                <div>
                  <span className="text-slate-400">Years:</span>
                  <div className="text-base font-bold text-slate-100 tabular-nums">
                    {diffResult.years}
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleCopy(`${diffResult.days} days between ${startDate} and ${endDate}`)}
                className="mt-4 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg flex items-center gap-1.5"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied' : 'Copy Result'}
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Start Date
              </label>
              <input
                type="date"
                value={baseDate}
                onChange={e => setBaseDate(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Operation
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setOp('add')}
                  className={`py-3 text-xs font-bold rounded-xl border transition-colors ${
                    op === 'add' ? 'bg-indigo-600 text-white border-indigo-500' : 'bg-slate-950 text-slate-400 border-slate-700'
                  }`}
                >
                  + Add
                </button>
                <button
                  onClick={() => setOp('subtract')}
                  className={`py-3 text-xs font-bold rounded-xl border transition-colors ${
                    op === 'subtract' ? 'bg-indigo-600 text-white border-indigo-500' : 'bg-slate-950 text-slate-400 border-slate-700'
                  }`}
                >
                  − Subtract
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Amount
              </label>
              <input
                type="number"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-100 focus:outline-none focus:border-indigo-500 tabular-nums"
                placeholder="10"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Time Unit
              </label>
              <select
                value={unit}
                onChange={e => setUnit(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
              >
                <option value="days">Days</option>
                <option value="weeks">Weeks</option>
                <option value="months">Months</option>
                <option value="years">Years</option>
              </select>
            </div>
          </div>

          {targetDateResult && (
            <div className="p-6 bg-slate-950/80 border border-slate-800 rounded-2xl space-y-3">
              <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">
                Calculated Date
              </span>
              <div className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight tabular-nums">
                {new Date(targetDateResult).toLocaleDateString(undefined, {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </div>
              <button
                onClick={() => handleCopy(targetDateResult)}
                className="mt-4 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg flex items-center gap-1.5"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied' : 'Copy Date'}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
