import React, { useState } from 'react';
import { formatHtml } from '../../../utils/dev';
import { RotateCcw, Copy, Check, Download, Eye, Code } from 'lucide-react';

export const HtmlFormatter: React.FC = () => {
  const [input, setInput] = useState(
    `<div class="container"><h1 class="title">Welcome to Smart Tools</h1><p>The fastest free online tools.</p><button onclick="alert('Hello')">Get Started</button></div>`
  );
  const [mode, setMode] = useState<'beautify' | 'minify'>('beautify');
  const [activeTab, setActiveTab] = useState<'code' | 'preview'>('code');
  const [copied, setCopied] = useState(false);

  const formatted = formatHtml(input, mode);

  const handleCopy = () => {
    navigator.clipboard.writeText(formatted);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([formatted], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `index-${Date.now()}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Mode Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-2 bg-slate-950 rounded-xl border border-slate-800">
        <div className="flex gap-2">
          <button
            onClick={() => setMode('beautify')}
            className={`py-1.5 px-3 text-xs font-semibold rounded-lg transition-colors ${
              mode === 'beautify' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Beautify HTML
          </button>
          <button
            onClick={() => setMode('minify')}
            className={`py-1.5 px-3 text-xs font-semibold rounded-lg transition-colors ${
              mode === 'minify' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Minify HTML
          </button>
        </div>

        <div className="flex gap-1 bg-slate-900 p-1 rounded-lg border border-slate-700">
          <button
            onClick={() => setActiveTab('code')}
            className={`px-3 py-1 text-xs font-medium rounded-md flex items-center gap-1.5 ${
              activeTab === 'code' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Code className="w-3.5 h-3.5" /> Code
          </button>
          <button
            onClick={() => setActiveTab('preview')}
            className={`px-3 py-1 text-xs font-medium rounded-md flex items-center gap-1.5 ${
              activeTab === 'preview' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Eye className="w-3.5 h-3.5" /> Live Preview
          </button>
        </div>
      </div>

      {activeTab === 'code' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Input HTML
            </label>
            <textarea
              rows={14}
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Paste raw HTML here..."
              className="w-full bg-slate-950 border border-slate-700/80 rounded-2xl p-4 text-xs font-mono text-slate-100 placeholder-slate-400 focus:outline-none focus:border-indigo-500 leading-relaxed"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              {mode === 'beautify' ? 'Beautified HTML' : 'Minified HTML'}
            </label>
            <textarea
              rows={14}
              readOnly
              value={formatted}
              className="w-full bg-slate-950/80 border border-slate-800 rounded-2xl p-4 text-xs font-mono text-indigo-200 leading-relaxed focus:outline-none"
            />
          </div>
        </div>
      ) : (
        <div className="p-6 bg-white text-slate-900 rounded-2xl min-h-[300px] border border-slate-300 overflow-auto">
          <div dangerouslySetInnerHTML={{ __html: input }} />
        </div>
      )}

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
            disabled={!formatted}
            className="px-4 py-2 text-xs font-semibold text-slate-200 hover:text-white bg-slate-900 border border-slate-700 hover:bg-slate-800 rounded-lg flex items-center gap-1.5 disabled:opacity-40"
          >
            <Download className="w-3.5 h-3.5" />
            Download .html
          </button>
          <button
            onClick={handleCopy}
            disabled={!formatted}
            className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 rounded-lg flex items-center gap-1.5 shadow"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copied' : 'Copy HTML'}
          </button>
        </div>
      </div>
    </div>
  );
};
