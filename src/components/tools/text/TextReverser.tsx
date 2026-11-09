import React, { useState } from 'react';
import { reverseText } from '../../../utils/text';
import { RotateCcw, Copy, Check } from 'lucide-react';

export const TextReverser: React.FC = () => {
  const [inputText, setInputText] = useState('Smart Tools World makes daily workflows effortless.');
  const [mode, setMode] = useState<'characters' | 'words' | 'eachWord'>('characters');
  const [copied, setCopied] = useState(false);

  const reversed = reverseText(inputText, mode);

  const handleCopy = () => {
    navigator.clipboard.writeText(reversed);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Mode selection buttons */}
      <div className="flex flex-wrap gap-2 p-1.5 bg-slate-950 rounded-xl border border-slate-800">
        <button
          onClick={() => setMode('characters')}
          className={`flex-1 min-w-[130px] py-2 px-3 text-xs font-semibold rounded-lg transition-colors ${
            mode === 'characters' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Reverse All Characters
        </button>
        <button
          onClick={() => setMode('words')}
          className={`flex-1 min-w-[130px] py-2 px-3 text-xs font-semibold rounded-lg transition-colors ${
            mode === 'words' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Reverse Word Order
        </button>
        <button
          onClick={() => setMode('eachWord')}
          className={`flex-1 min-w-[130px] py-2 px-3 text-xs font-semibold rounded-lg transition-colors ${
            mode === 'eachWord' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Reverse Inside Each Word
        </button>
      </div>

      {/* Input */}
      <div>
        <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
          Input Text
        </label>
        <textarea
          rows={4}
          value={inputText}
          onChange={e => setInputText(e.target.value)}
          placeholder="Enter text to reverse..."
          className="w-full bg-slate-950 border border-slate-700/80 rounded-2xl p-4 text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:border-indigo-500 transition-colors"
        />
      </div>

      {/* Output */}
      <div>
        <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
          Reversed Output
        </label>
        <div className="w-full bg-slate-950/80 border border-slate-800 rounded-2xl p-4 text-sm text-indigo-300 font-mono min-h-[100px] whitespace-pre-wrap break-all">
          {reversed || <span className="text-slate-400 font-sans">Reversed output will appear here...</span>}
        </div>
      </div>

      {/* Action controls */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setInputText('')}
          className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-slate-200 bg-slate-800 rounded-lg flex items-center gap-1.5"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Clear
        </button>
        {reversed && (
          <button
            onClick={handleCopy}
            className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg flex items-center gap-1.5"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copied' : 'Copy Reversed Text'}
          </button>
        )}
      </div>
    </div>
  );
};
