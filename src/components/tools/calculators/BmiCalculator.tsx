import React, { useState } from 'react';
import { calculateBmi, BmiResult } from '../../../utils/calculator';
import { Activity, RotateCcw, Copy, Check } from 'lucide-react';

export const BmiCalculator: React.FC = () => {
  const [unit, setUnit] = useState<'metric' | 'imperial'>('metric');
  const [heightCm, setHeightCm] = useState('175');
  const [weightKg, setWeightKg] = useState('68');
  const [heightFt, setHeightFt] = useState('5');
  const [heightIn, setHeightIn] = useState('9');
  const [weightLbs, setWeightLbs] = useState('150');
  const [copied, setCopied] = useState(false);

  let height = 0;
  let weight = 0;

  if (unit === 'metric') {
    height = parseFloat(heightCm) || 0;
    weight = parseFloat(weightKg) || 0;
  } else {
    height = (parseFloat(heightFt) || 0) * 12 + (parseFloat(heightIn) || 0);
    weight = parseFloat(weightLbs) || 0;
  }

  const result: BmiResult | null = calculateBmi(weight, height, unit);

  const handleCopy = () => {
    if (!result) return;
    const text = `BMI: ${result.bmi} (${result.category}). Recommended healthy weight: ${result.minHealthyWeight} - ${result.maxHealthyWeight} ${unit === 'metric' ? 'kg' : 'lbs'}.`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    if (unit === 'metric') {
      setHeightCm('170');
      setWeightKg('65');
    } else {
      setHeightFt('5');
      setHeightIn('7');
      setWeightLbs('140');
    }
  };

  return (
    <div className="space-y-8 max-w-2xl mx-auto">
      {/* Unit switch */}
      <div className="flex p-1 bg-slate-950 border border-slate-800 rounded-xl w-fit">
        <button
          onClick={() => setUnit('metric')}
          className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
            unit === 'metric' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
          }`}
        >
          Metric (cm / kg)
        </button>
        <button
          onClick={() => setUnit('imperial')}
          className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
            unit === 'imperial' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
          }`}
        >
          Imperial (ft, in / lbs)
        </button>
      </div>

      {/* Input Fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {unit === 'metric' ? (
          <>
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Height (cm)
              </label>
              <input
                type="number"
                value={heightCm}
                onChange={e => setHeightCm(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-100 focus:outline-none focus:border-indigo-500 tabular-nums"
                placeholder="175"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Weight (kg)
              </label>
              <input
                type="number"
                value={weightKg}
                onChange={e => setWeightKg(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-100 focus:outline-none focus:border-indigo-500 tabular-nums"
                placeholder="70"
              />
            </div>
          </>
        ) : (
          <>
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Height
              </label>
              <div className="grid grid-cols-2 gap-2">
                <div className="relative">
                  <input
                    type="number"
                    value={heightFt}
                    onChange={e => setHeightFt(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-100 focus:outline-none focus:border-indigo-500 tabular-nums"
                    placeholder="5"
                  />
                  <span className="absolute right-3 top-3 text-xs text-slate-400">ft</span>
                </div>
                <div className="relative">
                  <input
                    type="number"
                    value={heightIn}
                    onChange={e => setHeightIn(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-100 focus:outline-none focus:border-indigo-500 tabular-nums"
                    placeholder="9"
                  />
                  <span className="absolute right-3 top-3 text-xs text-slate-400">in</span>
                </div>
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Weight (lbs)
              </label>
              <input
                type="number"
                value={weightLbs}
                onChange={e => setWeightLbs(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-100 focus:outline-none focus:border-indigo-500 tabular-nums"
                placeholder="150"
              />
            </div>
          </>
        )}
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-3">
        <button
          onClick={handleReset}
          className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-slate-200 bg-slate-800 rounded-lg flex items-center gap-1.5"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset
        </button>
        {result && (
          <button
            onClick={handleCopy}
            className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg flex items-center gap-1.5"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copied' : 'Copy Summary'}
          </button>
        )}
      </div>

      {/* Result Display */}
      {result && (
        <div className="space-y-6 pt-4 border-t border-slate-800">
          <div className="p-6 sm:p-8 bg-slate-950/80 border border-slate-800 rounded-2xl space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Your Body Mass Index (BMI)
              </span>
              <span className={`text-sm font-bold ${result.color}`}>
                {result.category}
              </span>
            </div>

            <div className="text-5xl font-extrabold text-white tracking-tight tabular-nums">
              {result.bmi}
            </div>

            {/* Visual Gauge Bar */}
            <div className="space-y-2 pt-2">
              <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden flex">
                <div className="h-full bg-blue-500" style={{ width: '18.5%' }} title="Underweight (&lt;18.5)" />
                <div className="h-full bg-emerald-500" style={{ width: '25%' }} title="Normal (18.5 - 24.9)" />
                <div className="h-full bg-amber-500" style={{ width: '20%' }} title="Overweight (25 - 29.9)" />
                <div className="h-full bg-rose-500 flex-1" title="Obese (&gt;=30)" />
              </div>
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>&lt; 18.5 Underweight</span>
                <span>18.5 - 24.9 Normal</span>
                <span>25 - 29.9 Overweight</span>
                <span>&ge; 30 Obese</span>
              </div>
            </div>

            {/* Health target */}
            <div className="pt-3 border-t border-slate-850 flex items-center justify-between text-xs text-slate-300">
              <span>Healthy Weight Range for your height:</span>
              <strong className="text-emerald-400 tabular-nums">
                {result.minHealthyWeight} – {result.maxHealthyWeight} {unit === 'metric' ? 'kg' : 'lbs'}
              </strong>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
