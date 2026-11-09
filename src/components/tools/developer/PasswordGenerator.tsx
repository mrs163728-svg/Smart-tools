import React, { useState } from 'react';
import { generatePassword, PasswordOptions } from '../../../utils/dev';
import { RotateCcw, Copy, Check, RefreshCw, Key } from 'lucide-react';

export const PasswordGenerator: React.FC = () => {
  const [options, setOptions] = useState<PasswordOptions>({
    length: 16,
    includeUppercase: true,
    includeLowercase: true,
    includeNumbers: true,
    includeSymbols: true,
    excludeAmbiguous: true,
  });

  const [passwordData, setPasswordData] = useState(() => generatePassword(options));
  const [copied, setCopied] = useState(false);

  const handleRegenerate = () => {
    setPasswordData(generatePassword(options));
  };

  const handleOptionChange = (key: keyof PasswordOptions, val: any) => {
    const updated = { ...options, [key]: val };
    setOptions(updated);
    setPasswordData(generatePassword(updated));
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(passwordData.password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const strengthColor =
    passwordData.strength === 'Very Strong'
      ? 'bg-emerald-500'
      : passwordData.strength === 'Strong'
      ? 'bg-blue-500'
      : passwordData.strength === 'Medium'
      ? 'bg-amber-500'
      : 'bg-rose-500';

  return (
    <div className="space-y-8 max-w-2xl mx-auto">
      {/* Generated Password Screen */}
      <div className="p-6 bg-slate-950 border border-slate-700/80 rounded-2xl space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Generated Password
          </span>
          <span className="text-xs font-bold text-slate-300">
            Strength: <strong className="text-indigo-400">{passwordData.strength}</strong>
          </span>
        </div>

        <div className="relative">
          <input
            type="text"
            readOnly
            value={passwordData.password}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3.5 text-base sm:text-lg font-mono text-white tracking-wider pr-24 select-all focus:outline-none"
          />
          <div className="absolute right-2 top-2 flex items-center gap-1.5">
            <button
              onClick={handleRegenerate}
              className="p-2 text-slate-400 hover:text-white bg-slate-800 rounded-lg"
              title="Generate new password"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={handleCopy}
              className="px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg flex items-center gap-1"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
        </div>

        {/* Strength meter bar */}
        <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
          <div
            className={`h-full ${strengthColor} transition-all duration-300`}
            style={{ width: `${passwordData.score}%` }}
          />
        </div>
      </div>

      {/* Configuration Settings */}
      <div className="p-6 bg-slate-950 border border-slate-800 rounded-2xl space-y-6">
        <div>
          <div className="flex items-center justify-between text-xs text-slate-300 font-semibold uppercase tracking-wider mb-2">
            <span>Password Length</span>
            <span className="text-indigo-400 font-mono text-base font-bold">{options.length}</span>
          </div>
          <input
            type="range"
            min="6"
            max="64"
            value={options.length}
            onChange={e => handleOptionChange('length', parseInt(e.target.value))}
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-300">
          <label className="flex items-center gap-2.5 p-3 bg-slate-900 border border-slate-800 rounded-xl cursor-pointer hover:bg-slate-850">
            <input
              type="checkbox"
              checked={options.includeUppercase}
              onChange={e => handleOptionChange('includeUppercase', e.target.checked)}
              className="rounded border-slate-700 text-indigo-600 focus:ring-indigo-500 w-4 h-4 bg-slate-950"
            />
            <span>Uppercase Letters (A-Z)</span>
          </label>

          <label className="flex items-center gap-2.5 p-3 bg-slate-900 border border-slate-800 rounded-xl cursor-pointer hover:bg-slate-850">
            <input
              type="checkbox"
              checked={options.includeLowercase}
              onChange={e => handleOptionChange('includeLowercase', e.target.checked)}
              className="rounded border-slate-700 text-indigo-600 focus:ring-indigo-500 w-4 h-4 bg-slate-950"
            />
            <span>Lowercase Letters (a-z)</span>
          </label>

          <label className="flex items-center gap-2.5 p-3 bg-slate-900 border border-slate-800 rounded-xl cursor-pointer hover:bg-slate-850">
            <input
              type="checkbox"
              checked={options.includeNumbers}
              onChange={e => handleOptionChange('includeNumbers', e.target.checked)}
              className="rounded border-slate-700 text-indigo-600 focus:ring-indigo-500 w-4 h-4 bg-slate-950"
            />
            <span>Numbers (0-9)</span>
          </label>

          <label className="flex items-center gap-2.5 p-3 bg-slate-900 border border-slate-800 rounded-xl cursor-pointer hover:bg-slate-850">
            <input
              type="checkbox"
              checked={options.includeSymbols}
              onChange={e => handleOptionChange('includeSymbols', e.target.checked)}
              className="rounded border-slate-700 text-indigo-600 focus:ring-indigo-500 w-4 h-4 bg-slate-950"
            />
            <span>Symbols (!@#$%^&*)</span>
          </label>

          <label className="flex items-center gap-2.5 p-3 bg-slate-900 border border-slate-800 rounded-xl cursor-pointer hover:bg-slate-850 sm:col-span-2">
            <input
              type="checkbox"
              checked={options.excludeAmbiguous}
              onChange={e => handleOptionChange('excludeAmbiguous', e.target.checked)}
              className="rounded border-slate-700 text-indigo-600 focus:ring-indigo-500 w-4 h-4 bg-slate-950"
            />
            <span>Exclude ambiguous characters (l, 1, I, O, 0)</span>
          </label>
        </div>
      </div>
    </div>
  );
};
