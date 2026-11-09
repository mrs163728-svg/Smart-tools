import React, { useState } from 'react';
import { Delete, RotateCcw, Copy, Check } from 'lucide-react';

export const ScientificCalculator: React.FC = () => {
  const [display, setDisplay] = useState('0');
  const [expression, setExpression] = useState('');
  const [isRad, setIsRad] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleDigit = (d: string) => {
    if (display === '0' || display === 'Error') {
      setDisplay(d);
    } else {
      setDisplay(display + d);
    }
  };

  const handleOperator = (op: string) => {
    setExpression(expression + display + ' ' + op + ' ');
    setDisplay('0');
  };

  const handleClear = () => {
    setDisplay('0');
    setExpression('');
  };

  const handleDelete = () => {
    if (display.length > 1) {
      setDisplay(display.slice(0, -1));
    } else {
      setDisplay('0');
    }
  };

  const handleDecimal = () => {
    if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  };

  const handleFunction = (fn: string) => {
    const val = parseFloat(display);
    if (isNaN(val)) return;

    let res = 0;
    const toAngle = isRad ? val : (val * Math.PI) / 180;

    switch (fn) {
      case 'sin':
        res = Math.sin(toAngle);
        break;
      case 'cos':
        res = Math.cos(toAngle);
        break;
      case 'tan':
        res = Math.tan(toAngle);
        break;
      case 'sqrt':
        res = val < 0 ? NaN : Math.sqrt(val);
        break;
      case 'sq':
        res = val * val;
        break;
      case 'log':
        res = val <= 0 ? NaN : Math.log10(val);
        break;
      case 'ln':
        res = val <= 0 ? NaN : Math.log(val);
        break;
      case 'inv':
        res = val === 0 ? NaN : 1 / val;
        break;
      case 'pi':
        res = Math.PI;
        break;
      case 'e':
        res = Math.E;
        break;
      case 'neg':
        res = -val;
        break;
      default:
        res = val;
    }

    if (isNaN(res)) {
      setDisplay('Error');
    } else {
      // Round to 8 decimal places if necessary
      setDisplay(String(Math.round(res * 1e8) / 1e8));
    }
  };

  const handleEquals = () => {
    try {
      const fullExp = (expression + display)
        .replace(/×/g, '*')
        .replace(/÷/g, '/');

      // Safely evaluate simple arithmetic string
      // Allow only numbers, operators, parens, decimal
      if (/[^0-9+\-*/().\s]/.test(fullExp)) {
        setDisplay('Error');
        return;
      }

      // eslint-disable-next-line no-new-func
      const result = Function(`'use strict'; return (${fullExp})`)();
      if (typeof result === 'number' && !isNaN(result)) {
        const rounded = Math.round(result * 1e8) / 1e8;
        setDisplay(String(rounded));
        setExpression('');
      } else {
        setDisplay('Error');
      }
    } catch {
      setDisplay('Error');
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(display);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-md mx-auto space-y-6">
      {/* Display Screen */}
      <div className="bg-slate-950 border border-slate-700/80 rounded-2xl p-4 sm:p-5 text-right shadow-inner">
        <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
          <button
            onClick={() => setIsRad(!isRad)}
            className="px-2 py-0.5 rounded bg-slate-800 text-[11px] font-mono hover:text-white"
          >
            {isRad ? 'RAD' : 'DEG'}
          </button>
          <span className="font-mono truncate">{expression}</span>
        </div>
        <div className="text-3xl sm:text-4xl font-extrabold font-mono text-white tracking-wider tabular-nums overflow-x-auto no-scrollbar">
          {display}
        </div>
      </div>

      {/* Copy / Reset Actions */}
      <div className="flex items-center justify-between text-xs">
        <button
          onClick={handleClear}
          className="text-slate-400 hover:text-slate-200 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Clear All (AC)
        </button>
        <button
          onClick={handleCopy}
          className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          {copied ? 'Copied' : 'Copy Result'}
        </button>
      </div>

      {/* Keypad Grid */}
      <div className="grid grid-cols-5 gap-2 text-sm font-semibold">
        {/* Row 1: Advanced Functions */}
        <button onClick={() => handleFunction('sin')} className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200">sin</button>
        <button onClick={() => handleFunction('cos')} className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200">cos</button>
        <button onClick={() => handleFunction('tan')} className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200">tan</button>
        <button onClick={() => handleFunction('pi')} className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200">π</button>
        <button onClick={() => handleFunction('e')} className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200">e</button>

        {/* Row 2: Powers & Logs */}
        <button onClick={() => handleFunction('sqrt')} className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200">√</button>
        <button onClick={() => handleFunction('sq')} className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200">x²</button>
        <button onClick={() => handleFunction('log')} className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200">log</button>
        <button onClick={() => handleFunction('ln')} className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200">ln</button>
        <button onClick={() => handleFunction('inv')} className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200">1/x</button>

        {/* Row 3: 7 8 9 ( ) */}
        <button onClick={() => handleDigit('7')} className="p-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-base">7</button>
        <button onClick={() => handleDigit('8')} className="p-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-base">8</button>
        <button onClick={() => handleDigit('9')} className="p-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-base">9</button>
        <button onClick={handleDelete} className="p-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-rose-400 flex items-center justify-center">
          <Delete className="w-5 h-5" />
        </button>
        <button onClick={() => handleOperator('/')} className="p-3.5 rounded-xl bg-indigo-900/60 hover:bg-indigo-800 text-indigo-300">÷</button>

        {/* Row 4: 4 5 6 * - */}
        <button onClick={() => handleDigit('4')} className="p-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-base">4</button>
        <button onClick={() => handleDigit('5')} className="p-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-base">5</button>
        <button onClick={() => handleDigit('6')} className="p-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-base">6</button>
        <button onClick={() => handleOperator('*')} className="p-3.5 rounded-xl bg-indigo-900/60 hover:bg-indigo-800 text-indigo-300">×</button>
        <button onClick={() => handleOperator('-')} className="p-3.5 rounded-xl bg-indigo-900/60 hover:bg-indigo-800 text-indigo-300">−</button>

        {/* Row 5: 1 2 3 + = */}
        <button onClick={() => handleDigit('1')} className="p-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-base">1</button>
        <button onClick={() => handleDigit('2')} className="p-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-base">2</button>
        <button onClick={() => handleDigit('3')} className="p-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-base">3</button>
        <button onClick={() => handleOperator('+')} className="p-3.5 rounded-xl bg-indigo-900/60 hover:bg-indigo-800 text-indigo-300">+</button>
        <button onClick={() => handleFunction('neg')} className="p-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300">±</button>

        {/* Row 6: 0 . ( ) = */}
        <button onClick={() => handleDigit('0')} className="p-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-base col-span-2">0</button>
        <button onClick={handleDecimal} className="p-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-base">.</button>
        <button onClick={handleEquals} className="p-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-lg col-span-2 shadow-lg shadow-indigo-500/20">
          =
        </button>
      </div>
    </div>
  );
};
