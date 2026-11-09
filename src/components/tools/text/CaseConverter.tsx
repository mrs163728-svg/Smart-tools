import React, { useState } from 'react';
import { convertCase, TextCase } from '../../../utils/text';
import { RotateCcw, Copy, Check } from 'lucide-react';

export const CaseConverter: React.FC = () => {
  const [inputText, setInputText] = useState('smart tools world is the best platform for online utilities');
  const [copied, setCopied] = useState<string | null>(null);

  const cases: { id: TextCase; label: string; sample: string }[] = [
    { id: 'uppercase', label: 'UPPERCASE', sample: 'HELLO WORLD' },
    { id: 'lowercase', label: 'lowercase', sample: 'hello world' },
    { id: 'titlecase', label: 'Title Case', sample: 'Hello World' },
    { id: 'sentencecase', label: 'Sentence case', sample: 'Hello world' },
    { id: 'camelcase', label: 'camelCase', sample: 'helloWorld' },
    { id: 'pascalcase', label: 'PascalCase', sample: 'HelloWorld' },
    { id: 'snakecase', label: 'snake_case', sample: 'hello_world' },
    { id: 'kebabcase', label: 'kebab-case', sample: 'hello-world' },
  ];

  const handleApplyCase = (c: TextCase) => {
    const converted = convertCase(inputText, c);
    setInputText(converted);
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Input */}
      <div>
        <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
          Your Text
        </label>
        <textarea
          rows={5}
          value={inputText}
          onChange={e => setInputText(e.target.value)}
          placeholder="Enter text to convert casing..."
          className="w-full bg-slate-950 border border-slate-700/80 rounded-2xl p-4 text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:border-indigo-500 transition-colors"
        />
      </div>

      {/* Case Quick Actions Grid */}
      <div>
        <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
          Click to Transform Text
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {cases.map(c => (
            <button
              key={c.id}
              onClick={() => handleApplyCase(c.id)}
              className="p-3 text-left bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-indigo-500/50 rounded-xl transition-all group"
            >
              <div className="text-xs font-bold text-white group-hover:text-indigo-400">
                {c.label}
              </div>
              <div className="text-[11px] text-slate-400 font-mono truncate mt-0.5">
                {c.sample}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex items-center justify-between pt-2">
        <button
          onClick={() => setInputText('')}
          className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-slate-200 bg-slate-800 rounded-lg flex items-center gap-1.5"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Clear
        </button>
        <button
          onClick={() => handleCopy(inputText, 'main')}
          className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg flex items-center gap-1.5"
        >
          {copied === 'main' ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
          {copied === 'main' ? 'Copied' : 'Copy Converted Text'}
        </button>
      </div>
    </div>
  );
};
