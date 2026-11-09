import React, { useState, useEffect } from 'react';
import {
  DEFAULT_CURRENCY_RATES,
  CURRENCY_NAMES,
  fetchLiveCurrencyRates,
} from '../../../utils/converters';
import { RotateCcw, Copy, Check, ArrowRightLeft, RefreshCw } from 'lucide-react';

export const CurrencyConverter: React.FC = () => {
  const [amount, setAmount] = useState('100');
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('EUR');
  const [rates, setRates] = useState<Record<string, number>>(DEFAULT_CURRENCY_RATES);
  const [lastUpdated, setLastUpdated] = useState<string>('Loading live rates...');
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const loadRates = async () => {
    setIsLoading(true);
    const data = await fetchLiveCurrencyRates();
    setRates(data.rates);
    setLastUpdated(data.lastUpdated);
    setIsLoading(false);
  };

  useEffect(() => {
    loadRates();
  }, []);

  const numAmount = parseFloat(amount) || 0;
  // Rates are based on USD: rate(X) = X per 1 USD
  const fromRate = rates[fromCurrency] || 1;
  const toRate = rates[toCurrency] || 1;
  // Convert fromCurrency to USD then to toCurrency
  const usdVal = numAmount / fromRate;
  const converted = usdVal * toRate;
  const unitRate = (1 / fromRate) * toRate;

  const handleSwap = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(
      `${amount} ${fromCurrency} = ${converted.toFixed(2)} ${toCurrency}`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8 max-w-2xl mx-auto">
      {/* Live sync badge */}
      <div className="flex items-center justify-between text-xs text-slate-400 p-3 bg-slate-950 border border-slate-800 rounded-xl">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          <span>Exchange rates updated: {lastUpdated}</span>
        </div>
        <button
          onClick={loadRates}
          disabled={isLoading}
          className="text-indigo-400 hover:text-white flex items-center gap-1 font-medium"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Input conversion controls */}
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 items-end">
        <div className="sm:col-span-2">
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
            Amount
          </label>
          <input
            type="number"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-base text-slate-100 tabular-nums focus:outline-none focus:border-indigo-500 font-mono"
            placeholder="100"
          />
        </div>

        <div className="sm:col-span-1 flex justify-center">
          <button
            onClick={handleSwap}
            className="p-3 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white rounded-xl mb-0.5"
            title="Swap currencies"
          >
            <ArrowRightLeft className="w-5 h-5" />
          </button>
        </div>

        <div className="sm:col-span-2 space-y-2">
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
            Currencies
          </label>
          <div className="grid grid-cols-2 gap-2">
            <select
              value={fromCurrency}
              onChange={e => setFromCurrency(e.target.value)}
              className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-3 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
            >
              {Object.keys(rates).slice(0, 35).map(c => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <select
              value={toCurrency}
              onChange={e => setToCurrency(e.target.value)}
              className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-3 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
            >
              {Object.keys(rates).slice(0, 35).map(c => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Result Display Card */}
      <div className="p-6 sm:p-8 bg-gradient-to-tr from-indigo-950/40 via-purple-950/30 to-slate-900 border border-indigo-500/30 rounded-2xl space-y-3">
        <div className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">
          Converted Value
        </div>
        <div className="flex flex-wrap items-baseline gap-3">
          <span className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight tabular-nums">
            {converted.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
          <span className="text-2xl font-bold text-indigo-300">{toCurrency}</span>
        </div>
        <div className="text-xs text-slate-400 pt-2 border-t border-slate-800 flex items-center justify-between">
          <span>
            1 {fromCurrency} = {unitRate.toFixed(4)} {toCurrency}
          </span>
          <button
            onClick={handleCopy}
            className="text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>
      </div>
    </div>
  );
};
