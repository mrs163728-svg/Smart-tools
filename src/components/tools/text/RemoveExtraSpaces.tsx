import React, { useState } from 'react';
import { removeExtraSpaces } from '../../../utils/text';
import { RotateCcw, Copy, Check, Sparkles } from 'lucide-react';

export const RemoveExtraSpaces: React.FC = () => {
  const [inputText, setInputText] = useState(
    '   This   sample   text    has      unnecessary    multiple     spaces\n\n\nand   unwanted   blank   lines.   '
  );
  const [multipleToSingle, setMultipleToSingle] = useState(true);
  const [trimLines, setTrimLines] = useState(true);
  const [removeEmptyLines, setRemoveEmptyLines] = useState(true);
  const [copied, setCopied] = useState(false);

  const cleanedText = removeExtraSpaces(inputText, {
    multipleSpacesToSingle: multipleToSingle,
    trimLines,
    removeEmptyLines,
  });

  const handleCopy = () => {
    navigator.clipboard.writeText(cleanedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Options toggles */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 bg-slate-950/80 border border-slate-800 rounded-xl">
        <label className="flex items-center gap-2.5 text-xs text-slate-300 cursor-pointer">
          <input
            type="checkbox"
            checked={multipleToSingle}
            onChange={e => setMultipleToSingle(e.target.checked)}
            className="rounded border-slate-700 text-indigo-600 focus:ring-indigo-500 w-4 h-4 bg-slate-900"
          />
          <span>Multiple spaces to single space</span>
        </label>
        <label className="flex items-center gap-2.5 text-xs text-slate-300 cursor-pointer">
          <input
            type="checkbox"
            checked={trimLines}
            onChange={e => setTrimLines(e.target.checked)}
            className="rounded border-slate-700 text-indigo-600 focus:ring-indigo-500 w-4 h-4 bg-slate-900"
          />
          <span>Trim leading & trailing spaces</span>
        </label>
        <label className="flex items-center gap-2.5 text-xs text-slate-300 cursor-pointer">
          <input
            type="checkbox"
            checked={removeEmptyLines}
            onChange={e => setRemoveEmptyLines(e.target.checked)}
            className="rounded border-slate-700 text-indigo-600 focus:ring-indigo-500 w-4 h-4 bg-slate-900"
          />
          <span>Remove empty blank lines</span>
        </label>
      </div>

      {/* Input */}
      <div>
        <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
          Input Raw Text
        </label>
        <textarea
          rows={5}
          value={inputText}
          onChange={e => setInputText(e.target.value)}
          placeholder="Paste text with excessive spaces..."
          className="w-full bg-slate-950 border border-slate-700/80 rounded-2xl p-4 text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:border-indigo-500 transition-colors"
        />
      </div>

      {/* Cleaned Output */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
            Cleaned Text Result
          </label>
          <span className="text-[11px] text-emerald-400">
            {inputText.length - cleanedText.length > 0
              ? `${inputText.length - cleanedText.length} characters eliminated`
              : 'Clean'}
          </span>
        </div>
        <textarea
          rows={5}
          readOnly
          value={cleanedText}
          className="w-full bg-slate-950/80 border border-slate-800 rounded-2xl p-4 text-sm text-indigo-200 focus:outline-none"
        />
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
        {cleanedText && (
          <button
            onClick={handleCopy}
            className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg flex items-center gap-1.5"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copied' : 'Copy Cleaned Text'}
          </button>
        )}
      </div>
    </div>
  );
};
