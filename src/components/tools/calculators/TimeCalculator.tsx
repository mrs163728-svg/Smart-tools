import React, { useState } from 'react';
import { calculateTimeDiff } from '../../../utils/calculator';
import { RotateCcw, Copy, Check, Clock } from 'lucide-react';

export const TimeCalculator: React.FC = () => {
  const [startTime, setStartTime] = useState('09:00:00');
  const [endTime, setEndTime] = useState('17:30:00');
  const [copied, setCopied] = useState(false);

  const diff = calculateTimeDiff(startTime, endTime);

  const handleCopy = () => {
    if (!diff) return;
    navigator.clipboard.writeText(diff.formatted);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    setStartTime('00:00:00');
    setEndTime('00:00:00');
  };

  return (
    <div className="space-y-8 max-w-2xl mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
            Start Time (HH:MM:SS)
          </label>
          <input
            type="time"
            step="1"
            value={startTime}
            onChange={e => setStartTime(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-100 focus:outline-none focus:border-indigo-500 tabular-nums font-mono"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
            End Time (HH:MM:SS)
          </label>
          <input
            type="time"
            step="1"
            value={endTime}
            onChange={e => setEndTime(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-100 focus:outline-none focus:border-indigo-500 tabular-nums font-mono"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={handleReset}
          className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-slate-200 bg-slate-800 rounded-lg flex items-center gap-1.5"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset
        </button>
        {diff && (
          <button
            onClick={handleCopy}
            className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg flex items-center gap-1.5"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copied' : 'Copy Duration'}
          </button>
        )}
      </div>

      {diff && (
        <div className="p-6 sm:p-8 bg-slate-950/80 border border-slate-800 rounded-2xl space-y-4">
          <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">
            Elapsed Time Duration
          </span>
          <div className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight tabular-nums font-mono">
            {diff.formatted}
          </div>

          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-800 text-xs">
            <div>
              <span className="text-slate-400">Total Hours:</span>
              <div className="text-base font-bold text-slate-100 tabular-nums">
                {(diff.totalSeconds / 3600).toFixed(2)} hrs
              </div>
            </div>
            <div>
              <span className="text-slate-400">Total Minutes:</span>
              <div className="text-base font-bold text-slate-100 tabular-nums">
                {(diff.totalSeconds / 60).toFixed(1)} mins
              </div>
            </div>
            <div>
              <span className="text-slate-400">Total Seconds:</span>
              <div className="text-base font-bold text-slate-100 tabular-nums">
                {diff.totalSeconds.toLocaleString()} s
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
