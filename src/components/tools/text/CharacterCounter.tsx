import React, { useState } from 'react';
import { analyzeText } from '../../../utils/text';
import { RotateCcw, Copy, Check } from 'lucide-react';

export const CharacterCounter: React.FC = () => {
  const [text, setText] = useState('');
  const [copied, setCopied] = useState(false);

  const stats = analyzeText(text);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Detailed Character Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-xl">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Total Characters</span>
          <div className="text-3xl font-extrabold text-white tabular-nums mt-1">{stats.characters}</div>
        </div>
        <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-xl">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Without Spaces</span>
          <div className="text-3xl font-extrabold text-indigo-400 tabular-nums mt-1">{stats.charactersWithoutSpaces}</div>
        </div>
        <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-xl">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Whitespace</span>
          <div className="text-3xl font-extrabold text-white tabular-nums mt-1">{stats.spaces}</div>
        </div>
        <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-xl">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Digits (0-9)</span>
          <div className="text-3xl font-extrabold text-white tabular-nums mt-1">{stats.digits}</div>
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
          Input Text
        </label>
        <textarea
          rows={8}
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Paste or type text to inspect exact character breakdowns..."
          className="w-full bg-slate-950 border border-slate-700/80 rounded-2xl p-4 text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:border-indigo-500 transition-colors"
        />
      </div>

      <div className="flex items-center justify-between">
        <button
          onClick={() => setText('')}
          className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-slate-200 bg-slate-800 rounded-lg flex items-center gap-1.5"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Clear
        </button>
        {text && (
          <button
            onClick={handleCopy}
            className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg flex items-center gap-1.5"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copied' : 'Copy Text'}
          </button>
        )}
      </div>

      {/* Symbols & Words breakdown */}
      <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
        <div>
          <span className="text-slate-400">Punctuation & Symbols:</span>
          <div className="text-base font-bold text-white tabular-nums mt-0.5">{stats.symbols}</div>
        </div>
        <div>
          <span className="text-slate-400">Total Word Count:</span>
          <div className="text-base font-bold text-white tabular-nums mt-0.5">{stats.words}</div>
        </div>
        <div>
          <span className="text-slate-400">Avg Chars per Word:</span>
          <div className="text-base font-bold text-white tabular-nums mt-0.5">
            {stats.words > 0 ? (stats.charactersWithoutSpaces / stats.words).toFixed(1) : '0'}
          </div>
        </div>
      </div>
    </div>
  );
};
