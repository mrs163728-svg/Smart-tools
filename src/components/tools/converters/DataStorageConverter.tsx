import React, { useState } from 'react';
import { convertDataStorage } from '../../../utils/converters';
import { RotateCcw, Copy, Check, ArrowRightLeft } from 'lucide-react';

export const DataStorageConverter: React.FC = () => {
  const [value, setValue] = useState('16');
  const [fromUnit, setFromUnit] = useState('GB');
  const [toUnit, setToUnit] = useState('MB');
  const [isBinary, setIsBinary] = useState(false);
  const [copied, setCopied] = useState(false);

  const numVal = parseFloat(value) || 0;
  const result = convertDataStorage(numVal, fromUnit, toUnit, isBinary);

  const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];

  const handleSwap = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(`${result}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8 max-w-2xl mx-auto">
      {/* Base selection (Decimal 1000 vs Binary 1024) */}
      <div className="flex p-1 bg-slate-950 border border-slate-800 rounded-xl w-fit">
        <button
          onClick={() => setIsBinary(false)}
          className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
            !isBinary ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
          }`}
        >
          Decimal (SI: 1 KB = 1,000 Bytes)
        </button>
        <button
          onClick={() => setIsBinary(true)}
          className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
            isBinary ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
          }`}
        >
          Binary (IEC: 1 KiB = 1,024 Bytes)
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 items-end">
        <div className="sm:col-span-2">
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
            Storage Size
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
              {units.map(u => (
                <option key={u} value={u}>
                  {u}
                </option>
              ))}
            </select>
            <select
              value={toUnit}
              onChange={e => setToUnit(e.target.value)}
              className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-3 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
            >
              {units.map(u => (
                <option key={u} value={u}>
                  {u}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Result Display */}
      <div className="p-6 sm:p-8 bg-gradient-to-tr from-indigo-950/40 via-purple-950/30 to-slate-900 border border-indigo-500/30 rounded-2xl space-y-3">
        <div className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">
          Converted Data Storage
        </div>
        <div className="flex flex-wrap items-baseline gap-3">
          <span className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight tabular-nums">
            {result >= 1000000 ? result.toExponential(4) : result.toLocaleString()}
          </span>
          <span className="text-2xl font-bold text-indigo-300">{toUnit}</span>
        </div>
        <div className="text-xs text-slate-400 pt-2 border-t border-slate-800 flex items-center justify-between">
          <span>
            {value} {fromUnit} ({isBinary ? 'Base-2 / 1024' : 'Base-10 / 1000'})
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

      {/* Snapshot of all sizes */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
        {units.map(u => {
          const val = convertDataStorage(numVal, fromUnit, u, isBinary);
          return (
            <div key={u} className="bg-slate-950 border border-slate-800 p-3 rounded-xl">
              <span className="text-slate-400 block">{u}</span>
              <span className="text-sm font-bold text-slate-100 font-mono mt-1 block truncate">
                {val >= 1000000 ? val.toExponential(2) : val.toLocaleString()}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
