import React, { useState } from 'react';
import { urlEncode, urlDecode } from '../../../utils/dev';
import { RotateCcw, Copy, Check, ArrowRightLeft } from 'lucide-react';

export const UrlEncoderDecoder: React.FC = () => {
  const [input, setInput] = useState('https://example.com/search?q=smart tools & category=utilities#main');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [componentMode, setComponentMode] = useState<'component' | 'full'>('full');
  const [copied, setCopied] = useState(false);

  const output = mode === 'encode' ? urlEncode(input, componentMode) : urlDecode(input, componentMode);

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSwap = () => {
    setInput(output);
    setMode(mode === 'encode' ? 'decode' : 'encode');
  };

  return (
    <div className="space-y-6">
      {/* Mode selection buttons */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-1.5 bg-slate-950 rounded-xl border border-slate-800">
        <div className="flex gap-2">
          <button
            onClick={() => setMode('encode')}
            className={`py-2 px-4 text-xs font-semibold rounded-lg transition-colors ${
              mode === 'encode' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            URL Encode
          </button>
          <button
            onClick={() => setMode('decode')}
            className={`py-2 px-4 text-xs font-semibold rounded-lg transition-colors ${
              mode === 'decode' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            URL Decode
          </button>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-400 pr-2">
          <span>Scope:</span>
          <button
            onClick={() => setComponentMode(componentMode === 'full' ? 'component' : 'full')}
            className="px-2.5 py-1 bg-slate-900 border border-slate-700 text-slate-200 rounded text-xs"
          >
            {componentMode === 'full' ? 'Full URL (encodeURI)' : 'Query Component (encodeURIComponent)'}
          </button>
        </div>
      </div>

      {/* Input */}
      <div>
        <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
          Input URL or String
        </label>
        <textarea
          rows={5}
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Paste URL or query string here..."
          className="w-full bg-slate-950 border border-slate-700/80 rounded-2xl p-4 text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:border-indigo-500 font-mono"
        />
      </div>

      {/* Output */}
      <div>
        <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
          {mode === 'encode' ? 'Encoded URL Output' : 'Decoded URL Output'}
        </label>
        <div className="w-full bg-slate-950/80 border border-slate-800 rounded-2xl p-4 text-sm text-indigo-300 font-mono min-h-[120px] whitespace-pre-wrap break-all">
          {output || <span className="text-slate-400 font-sans">Result will appear here...</span>}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setInput('')}
            className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-slate-200 bg-slate-800 rounded-lg flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Clear
          </button>
          <button
            onClick={handleSwap}
            className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-900 border border-slate-700 rounded-lg flex items-center gap-1.5"
          >
            <ArrowRightLeft className="w-3.5 h-3.5" />
            Swap Input/Output
          </button>
        </div>

        {output && (
          <button
            onClick={handleCopy}
            className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg flex items-center gap-1.5"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copied' : 'Copy Result'}
          </button>
        )}
      </div>
    </div>
  );
};
