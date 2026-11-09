import React, { useState } from 'react';
import { base64Encode, base64Decode } from '../../../utils/dev';
import { RotateCcw, Copy, Check, ArrowRightLeft, Upload } from 'lucide-react';

export const Base64Tool: React.FC = () => {
  const [input, setInput] = useState('Smart Tools World — Free online tools.');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [copied, setCopied] = useState(false);

  const output = mode === 'encode' ? base64Encode(input) : base64Decode(input);

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSwap = () => {
    setInput(output);
    setMode(mode === 'encode' ? 'decode' : 'encode');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = ev => {
      const result = ev.target?.result as string;
      // Extract pure base64 part
      const b64 = result.includes(',') ? result.split(',')[1] : result;
      setInput(b64);
      setMode('decode');
    };
    reader.readAsDataURL(file);
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
            Encode to Base64
          </button>
          <button
            onClick={() => setMode('decode')}
            className={`py-2 px-4 text-xs font-semibold rounded-lg transition-colors ${
              mode === 'decode' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Decode from Base64
          </button>
        </div>

        <label className="flex items-center gap-2 text-xs text-indigo-400 hover:text-indigo-300 cursor-pointer px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg">
          <Upload className="w-3.5 h-3.5" />
          <span>Upload File to Base64</span>
          <input type="file" onChange={handleFileUpload} className="hidden" />
        </label>
      </div>

      {/* Input */}
      <div>
        <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
          {mode === 'encode' ? 'Input Plain Text' : 'Input Base64 String'}
        </label>
        <textarea
          rows={5}
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder={mode === 'encode' ? 'Type or paste plain text...' : 'Paste Base64 string here...'}
          className="w-full bg-slate-950 border border-slate-700/80 rounded-2xl p-4 text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:border-indigo-500 font-mono"
        />
      </div>

      {/* Output */}
      <div>
        <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
          {mode === 'encode' ? 'Base64 Encoded Output' : 'Decoded Plain Text Output'}
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
            Swap
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
