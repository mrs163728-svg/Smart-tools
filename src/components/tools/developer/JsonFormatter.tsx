import React, { useState } from 'react';
import { formatJson, JsonFormatResult } from '../../../utils/dev';
import { RotateCcw, Copy, Check, Download, Braces, AlertCircle } from 'lucide-react';

export const JsonFormatter: React.FC = () => {
  const [input, setInput] = useState(
    '{"platform":"Smart Tools World","version":2026,"features":["calculators","converters","pdf","image","developer"],"isFree":true,"privacy":"100% Client-Side"}'
  );
  const [indent, setIndent] = useState<number | 'minify'>(2);
  const [copied, setCopied] = useState(false);

  const result: JsonFormatResult = formatJson(input, indent);

  const handleCopy = () => {
    navigator.clipboard.writeText(result.formatted);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([result.formatted], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `data-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-2 bg-slate-950 rounded-xl border border-slate-800">
        <div className="flex gap-2">
          <button
            onClick={() => setIndent(2)}
            className={`py-1.5 px-3 text-xs font-semibold rounded-lg transition-colors ${
              indent === 2 ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            2 Spaces
          </button>
          <button
            onClick={() => setIndent(4)}
            className={`py-1.5 px-3 text-xs font-semibold rounded-lg transition-colors ${
              indent === 4 ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            4 Spaces
          </button>
          <button
            onClick={() => setIndent('minify')}
            className={`py-1.5 px-3 text-xs font-semibold rounded-lg transition-colors ${
              indent === 'minify' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Minify JSON
          </button>
        </div>

        <div className="flex items-center gap-2 text-xs">
          {result.isValid ? (
            <span className="text-emerald-400 flex items-center gap-1 font-semibold">
              <Check className="w-3.5 h-3.5" /> Valid JSON
            </span>
          ) : (
            <span className="text-rose-400 flex items-center gap-1 font-semibold">
              <AlertCircle className="w-3.5 h-3.5" /> Invalid JSON Syntax
            </span>
          )}
        </div>
      </div>

      {/* Side-by-side or stacked Editor */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
            Input Raw JSON
          </label>
          <textarea
            rows={14}
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Paste your JSON here to format or validate..."
            className="w-full bg-slate-950 border border-slate-700/80 rounded-2xl p-4 text-xs font-mono text-slate-100 placeholder-slate-400 focus:outline-none focus:border-indigo-500 leading-relaxed"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
            Formatted Output
          </label>
          <div className="relative">
            <textarea
              rows={14}
              readOnly
              value={result.formatted}
              className={`w-full bg-slate-950/80 border rounded-2xl p-4 text-xs font-mono leading-relaxed focus:outline-none ${
                result.isValid
                  ? 'border-slate-800 text-indigo-200'
                  : 'border-rose-500/50 text-rose-300'
              }`}
            />
            {result.error && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs rounded-xl mt-2 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{result.error}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setInput('')}
          className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-slate-200 bg-slate-800 rounded-lg flex items-center gap-1.5"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Clear
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={handleDownload}
            disabled={!result.isValid || !result.formatted}
            className="px-4 py-2 text-xs font-semibold text-slate-200 hover:text-white bg-slate-900 border border-slate-700 hover:bg-slate-800 rounded-lg flex items-center gap-1.5 disabled:opacity-40"
          >
            <Download className="w-3.5 h-3.5" />
            Download .json
          </button>
          <button
            onClick={handleCopy}
            disabled={!result.isValid || !result.formatted}
            className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 rounded-lg flex items-center gap-1.5 shadow"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copied' : 'Copy Formatted JSON'}
          </button>
        </div>
      </div>
    </div>
  );
};
