import React, { useState } from 'react';
import { analyzeText } from '../../../utils/text';
import { RotateCcw, Copy, Check, Type } from 'lucide-react';

export const WordCounter: React.FC = () => {
  const [text, setText] = useState(
    'Smart Tools World provides free, fast, and secure client-side online tools for users across the globe. Everything runs right in your browser with zero data storage.'
  );
  const [copied, setCopied] = useState(false);

  const stats = analyzeText(text);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setText('');
  };

  return (
    <div className="space-y-6">
      {/* Real-time Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-xl">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Words</span>
          <div className="text-3xl font-extrabold text-white tabular-nums mt-1">{stats.words}</div>
        </div>
        <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-xl">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Characters</span>
          <div className="text-3xl font-extrabold text-white tabular-nums mt-1">{stats.characters}</div>
        </div>
        <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-xl">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Sentences</span>
          <div className="text-3xl font-extrabold text-white tabular-nums mt-1">{stats.sentences}</div>
        </div>
        <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-xl">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Paragraphs</span>
          <div className="text-3xl font-extrabold text-white tabular-nums mt-1">{stats.paragraphs}</div>
        </div>
      </div>

      {/* Main Textarea */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span>Type or paste your text below:</span>
          <span>{stats.charactersWithoutSpaces} chars (no spaces)</span>
        </div>
        <textarea
          rows={8}
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Start typing or paste your content here to analyze..."
          className="w-full bg-slate-950 border border-slate-700/80 rounded-2xl p-4 text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors leading-relaxed"
        />
      </div>

      {/* Action buttons */}
      <div className="flex items-center justify-between">
        <button
          onClick={handleClear}
          className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-slate-200 bg-slate-800 rounded-lg flex items-center gap-1.5"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Clear Text
        </button>
        <button
          onClick={handleCopy}
          className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg flex items-center gap-1.5"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
          {copied ? 'Copied' : 'Copy Content'}
        </button>
      </div>

      {/* Reading & Speaking time metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
        <div className="p-4 bg-slate-950/60 border border-slate-800/80 rounded-xl flex items-center justify-between text-xs">
          <span className="text-slate-400">Estimated Reading Time:</span>
          <strong className="text-indigo-400 font-semibold">{stats.readingTimeMinutes} min{stats.readingTimeMinutes !== 1 ? 's' : ''}</strong>
        </div>
        <div className="p-4 bg-slate-950/60 border border-slate-800/80 rounded-xl flex items-center justify-between text-xs">
          <span className="text-slate-400">Estimated Speaking Time:</span>
          <strong className="text-indigo-400 font-semibold">{stats.speakingTimeMinutes} min{stats.speakingTimeMinutes !== 1 ? 's' : ''}</strong>
        </div>
      </div>
    </div>
  );
};
