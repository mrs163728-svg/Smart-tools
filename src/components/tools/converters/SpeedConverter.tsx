import React, { useState } from 'react';
import { SPEED_UNITS, convertSpeed } from '../../../utils/converters';
import { RotateCcw, Copy, Check, ArrowRightLeft } from 'lucide-react';

export const SpeedConverter: React.FC = () => {
  const [value, setValue] = useState('100');
  const [fromUnit, setFromUnit] = useState('kmh');
  const [toUnit, setToUnit] = useState('mph');
  const [copied, setCopied] = useState(false);

  const numVal = parseFloat(value) || 0;
  const result = convertSpeed(numVal, fromUnit, toUnit);

  const handleSwap = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(`${Math.round(result * 100) / 100}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8 max-w-2xl mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 items-end">
        <div className="sm:col-span-2">
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
            Speed Value
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
            title="Swap units"
          >
            <ArrowRightLeft className="w-5 h-5" />
          </button>
        </div>

        <div className="sm:col-span-2 space-y-2">
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
            Units
          </label>
          <div className="grid grid-cols-2 gap-2">
            <select
              value={fromUnit}
              onChange={e => setFromUnit(e.target.value)}
              className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-3 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
            >
              {Object.entries(SPEED_UNITS).map(([k, v]) => (
                <option key={k} value={k}>
                  {v.name}
                </option>
              ))}
            </select>
            <select
              value={toUnit}
              onChange={e => setToUnit(e.target.value)}
              className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-3 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
            >
              {Object.entries(SPEED_UNITS).map(([k, v]) => (
                <option key={k} value={k}>
                  {v.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Result Display */}
      <div className="p-6 sm:p-8 bg-gradient-to-tr from-indigo-950/40 via-purple-950/30 to-slate-900 border border-indigo-500/30 rounded-2xl space-y-3">
        <div className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">
          Converted Speed
        </div>
        <div className="flex flex-wrap items-baseline gap-3">
          <span className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight tabular-nums">
            {Math.round(result * 100) / 100}
          </span>
          <span className="text-2xl font-bold text-indigo-300">
            {SPEED_UNITS[toUnit]?.name}
          </span>
        </div>
        <div className="text-xs text-slate-400 pt-2 border-t border-slate-800 flex items-center justify-between">
          <span>
            {value} {SPEED_UNITS[fromUnit]?.name}
          </span>
          <button
            onClick={handleCopy}
            className="text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>
      </div>
    </div>
  );
};
