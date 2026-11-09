import React, { useState } from 'react';
import { calculatePercentage } from '../../../utils/calculator';
import { RotateCcw, Copy, Check, Percent } from 'lucide-react';

export const PercentageCalculator: React.FC = () => {
  const [mode, setMode] = useState<'percentOf' | 'isWhatPercent' | 'change'>('percentOf');
  const [valA, setValA] = useState('15');
  const [valB, setValB] = useState('250');
  const [copied, setCopied] = useState(false);

  const numA = parseFloat(valA) || 0;
  const numB = parseFloat(valB) || 0;
  const result = calculatePercentage(mode, numA, numB);

  const handleCopy = () => {
    navigator.clipboard.writeText(String(Math.round(result * 100) / 100));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    setValA('0');
    setValB('0');
  };

  return (
    <div className="space-y-8 max-w-2xl mx-auto">
      {/* Mode selection buttons */}
      <div className="flex flex-wrap gap-2 p-1.5 bg-slate-950 rounded-xl border border-slate-800">
        <button
          onClick={() => setMode('percentOf')}
          className={`flex-1 min-w-[140px] py-2 px-3 text-xs font-semibold rounded-lg transition-colors ${
            mode === 'percentOf'
              ? 'bg-indigo-600 text-white shadow'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          What is X% of Y?
        </button>
        <button
          onClick={() => setMode('isWhatPercent')}
          className={`flex-1 min-w-[140px] py-2 px-3 text-xs font-semibold rounded-lg transition-colors ${
            mode === 'isWhatPercent'
              ? 'bg-indigo-600 text-white shadow'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          X is what % of Y?
        </button>
        <button
          onClick={() => setMode('change')}
          className={`flex-1 min-w-[140px] py-2 px-3 text-xs font-semibold rounded-lg transition-colors ${
            mode === 'change'
              ? 'bg-indigo-600 text-white shadow'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          % Increase / Decrease
        </button>
      </div>

      {/* Inputs according to mode */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 items-center">
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
            {mode === 'percentOf' ? 'Percentage (X %)' : mode === 'isWhatPercent' ? 'Value (X)' : 'Initial Value (X)'}
          </label>
          <div className="relative">
            <input
              type="number"
              value={valA}
              onChange={e => setValA(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-100 focus:outline-none focus:border-indigo-500 tabular-nums"
              placeholder="0"
            />
            {mode === 'percentOf' && (
              <span className="absolute right-4 top-3 text-slate-400 font-bold">%</span>
            )}
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
            {mode === 'percentOf' ? 'Of Total Value (Y)' : mode === 'isWhatPercent' ? 'Total (Y)' : 'Final Value (Y)'}
          </label>
          <input
            type="number"
            value={valB}
            onChange={e => setValB(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-100 focus:outline-none focus:border-indigo-500 tabular-nums"
            placeholder="0"
          />
        </div>
      </div>

      {/* Action controls */}
      <div className="flex items-center gap-3">
        <button
          onClick={handleReset}
          className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-slate-200 bg-slate-800 rounded-lg flex items-center gap-1.5"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset
        </button>
        <button
          onClick={handleCopy}
          className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg flex items-center gap-1.5"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
          {copied ? 'Copied' : 'Copy Result'}
        </button>
      </div>

      {/* Result Display */}
      <div className="p-6 sm:p-8 bg-gradient-to-tr from-indigo-950/40 via-purple-950/30 to-slate-900 border border-indigo-500/30 rounded-2xl">
        <div className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">
          Result
        </div>
        <div className="mt-2 flex items-baseline gap-3">
          <span className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight tabular-nums">
            {Math.round(result * 100) / 100}
          </span>
          {mode !== 'percentOf' && (
            <span className="text-2xl font-bold text-indigo-400">%</span>
          )}
        </div>
        <p className="mt-3 text-xs text-slate-400">
          {mode === 'percentOf' && `${numA}% of ${numB} is equal to ${Math.round(result * 100) / 100}`}
          {mode === 'isWhatPercent' && `${numA} is ${Math.round(result * 100) / 100}% of ${numB}`}
          {mode === 'change' &&
            `Changing from ${numA} to ${numB} represents a ${result >= 0 ? '+' : ''}${Math.round(result * 100) / 100}% ${result >= 0 ? 'increase' : 'decrease'}.`}
        </p>
      </div>
    </div>
  );
};
