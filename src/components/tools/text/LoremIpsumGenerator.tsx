import React, { useState } from 'react';
import { generateLoremIpsum } from '../../../utils/text';
import { RotateCcw, Copy, Check, RefreshCw } from 'lucide-react';

export const LoremIpsumGenerator: React.FC = () => {
  const [count, setCount] = useState(3);
  const [type, setType] = useState<'paragraphs' | 'sentences' | 'words'>('paragraphs');
  const [startWithLorem, setStartWithLorem] = useState(true);
  const [output, setOutput] = useState(generateLoremIpsum(3, 'paragraphs', true));
  const [copied, setCopied] = useState(false);

  const handleGenerate = () => {
    setOutput(generateLoremIpsum(count, type, startWithLorem));
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Controls Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-slate-950/80 border border-slate-800 rounded-2xl items-end">
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
            Count ({type})
          </label>
          <input
            type="number"
            min={1}
            max={type === 'words' ? 500 : 50}
            value={count}
            onChange={e => setCount(Math.max(1, parseInt(e.target.value) || 1))}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-100 tabular-nums focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
            Generate By
          </label>
          <select
            value={type}
            onChange={e => setType(e.target.value as any)}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
          >
            <option value="paragraphs">Paragraphs</option>
            <option value="sentences">Sentences</option>
            <option value="words">Words</option>
          </select>
        </div>

        <button
          onClick={handleGenerate}
          className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-2 shadow"
        >
          <RefreshCw className="w-4 h-4" />
          Regenerate Text
        </button>
      </div>

      <div className="flex items-center gap-2 px-1">
        <label className="flex items-center gap-2 text-xs text-slate-400 cursor-pointer">
          <input
            type="checkbox"
            checked={startWithLorem}
            onChange={e => setStartWithLorem(e.target.checked)}
            className="rounded border-slate-700 text-indigo-600 focus:ring-indigo-500 w-4 h-4 bg-slate-900"
          />
          <span>Start with &quot;Lorem ipsum dolor sit amet...&quot;</span>
        </label>
      </div>

      {/* Generated text preview */}
      <div>
        <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
          Generated Placeholder Text
        </label>
        <div className="w-full bg-slate-950/80 border border-slate-800 rounded-2xl p-5 text-sm text-slate-200 leading-relaxed max-h-[360px] overflow-y-auto whitespace-pre-wrap">
          {output}
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex items-center justify-between">
        <span className="text-xs text-slate-400">
          {output.split(/\s+/).filter(Boolean).length} words generated
        </span>
        <button
          onClick={handleCopy}
          className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg flex items-center gap-1.5"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
          {copied ? 'Copied' : 'Copy Lorem Ipsum'}
        </button>
      </div>
    </div>
  );
};
