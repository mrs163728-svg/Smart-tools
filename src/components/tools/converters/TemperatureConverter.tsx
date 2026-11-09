import React, { useState } from 'react';
import { convertTemperature } from '../../../utils/converters';
import { RotateCcw, Copy, Check, ArrowRightLeft, Thermometer } from 'lucide-react';

export const TemperatureConverter: React.FC = () => {
  const [value, setValue] = useState('25');
  const [fromScale, setFromScale] = useState<'C' | 'F' | 'K' | 'R'>('C');
  const [toScale, setToScale] = useState<'C' | 'F' | 'K' | 'R'>('F');
  const [copied, setCopied] = useState(false);

  const numVal = parseFloat(value) || 0;
  const result = convertTemperature(numVal, fromScale, toScale);

  const handleSwap = () => {
    setFromScale(toScale);
    setToScale(fromScale);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(`${Math.round(result * 100) / 100}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const scaleNames = {
    C: 'Celsius (°C)',
    F: 'Fahrenheit (°F)',
    K: 'Kelvin (K)',
    R: 'Rankine (°R)',
  };

  return (
    <div className="space-y-8 max-w-2xl mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 items-end">
        <div className="sm:col-span-2">
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
            Temperature Value
          </label>
          <input
            type="number"
            value={value}
            onChange={e => setValue(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-base text-slate-100 tabular-nums focus:outline-none focus:border-indigo-500 font-mono"
            placeholder="0"
          />
        </div>

        <div className="sm:col-span-1 flex justify-center">
          <button
            onClick={handleSwap}
            className="p-3 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white rounded-xl mb-0.5"
            title="Swap scales"
          >
            <ArrowRightLeft className="w-5 h-5" />
          </button>
        </div>

        <div className="sm:col-span-2 space-y-2">
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
            Temperature Scales
          </label>
          <div className="grid grid-cols-2 gap-2">
            <select
              value={fromScale}
              onChange={e => setFromScale(e.target.value as any)}
              className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-3 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
            >
              {(['C', 'F', 'K', 'R'] as const).map(s => (
                <option key={s} value={s}>
                  {scaleNames[s]}
                </option>
              ))}
            </select>
            <select
              value={toScale}
              onChange={e => setToScale(e.target.value as any)}
              className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-3 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
            >
              {(['C', 'F', 'K', 'R'] as const).map(s => (
                <option key={s} value={s}>
                  {scaleNames[s]}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Result Display */}
      <div className="p-6 sm:p-8 bg-gradient-to-tr from-indigo-950/40 via-purple-950/30 to-slate-900 border border-indigo-500/30 rounded-2xl space-y-3">
        <div className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">
          Converted Temperature
        </div>
        <div className="flex flex-wrap items-baseline gap-3">
          <span className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight tabular-nums">
            {Math.round(result * 100) / 100}
          </span>
          <span className="text-2xl font-bold text-indigo-300">{scaleNames[toScale]}</span>
        </div>
        <div className="text-xs text-slate-400 pt-2 border-t border-slate-800 flex items-center justify-between">
          <span>
            {value} {scaleNames[fromScale]}
          </span>
          <button
            onClick={handleCopy}
            className="text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copied' : 'Copy Result'}
          </button>
        </div>
      </div>

      {/* All Scales Snapshot */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        {(['C', 'F', 'K', 'R'] as const).map(s => {
          const val = convertTemperature(numVal, fromScale, s);
          return (
            <div key={s} className="bg-slate-950 border border-slate-800 p-3 rounded-xl">
              <span className="text-slate-400 block">{scaleNames[s]}</span>
              <span className="text-sm font-bold text-slate-100 font-mono mt-1 block">
                {Math.round(val * 100) / 100}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
