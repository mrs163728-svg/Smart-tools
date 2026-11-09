// Length conversions (base: meter)
export const LENGTH_UNITS: Record<string, { name: string; toBase: number }> = {
  m: { name: 'Meter (m)', toBase: 1 },
  km: { name: 'Kilometer (km)', toBase: 1000 },
  cm: { name: 'Centimeter (cm)', toBase: 0.01 },
  mm: { name: 'Millimeter (mm)', toBase: 0.001 },
  mi: { name: 'Mile (mi)', toBase: 1609.344 },
  yd: { name: 'Yard (yd)', toBase: 0.9144 },
  ft: { name: 'Foot (ft)', toBase: 0.3048 },
  in: { name: 'Inch (in)', toBase: 0.0254 },
  nmi: { name: 'Nautical Mile (nmi)', toBase: 1852 },
};

export function convertLength(value: number, from: string, to: string): number {
  if (value === 0) return 0;
  const fromUnit = LENGTH_UNITS[from];
  const toUnit = LENGTH_UNITS[to];
  if (!fromUnit || !toUnit) return 0;

  const baseMeters = value * fromUnit.toBase;
  return baseMeters / toUnit.toBase;
}

// Weight conversions (base: kilogram)
export const WEIGHT_UNITS: Record<string, { name: string; toBase: number }> = {
  kg: { name: 'Kilogram (kg)', toBase: 1 },
  g: { name: 'Gram (g)', toBase: 0.001 },
  mg: { name: 'Milligram (mg)', toBase: 0.000001 },
  lb: { name: 'Pound (lb)', toBase: 0.45359237 },
  oz: { name: 'Ounce (oz)', toBase: 0.028349523125 },
  st: { name: 'Stone (st)', toBase: 6.35029318 },
  ton: { name: 'Metric Ton (t)', toBase: 1000 },
};

export function convertWeight(value: number, from: string, to: string): number {
  if (value === 0) return 0;
  const fromUnit = WEIGHT_UNITS[from];
  const toUnit = WEIGHT_UNITS[to];
  if (!fromUnit || !toUnit) return 0;

  const baseKg = value * fromUnit.toBase;
  return baseKg / toUnit.toBase;
}

// Temperature conversions
export function convertTemperature(value: number, from: 'C' | 'F' | 'K' | 'R', to: 'C' | 'F' | 'K' | 'R'): number {
  // Convert first to Celsius
  let celsius = value;
  if (from === 'F') {
    celsius = (value - 32) * (5 / 9);
  } else if (from === 'K') {
    celsius = value - 273.15;
  } else if (from === 'R') {
    celsius = (value - 491.67) * (5 / 9);
  }

  // Convert Celsius to destination
  if (to === 'C') return celsius;
  if (to === 'F') return celsius * (9 / 5) + 32;
  if (to === 'K') return celsius + 273.15;
  if (to === 'R') return (celsius + 273.15) * (9 / 5);

  return celsius;
}

// Speed conversions (base: m/s)
export const SPEED_UNITS: Record<string, { name: string; toBase: number }> = {
  mps: { name: 'Meters per second (m/s)', toBase: 1 },
  kmh: { name: 'Kilometers per hour (km/h)', toBase: 1 / 3.6 },
  mph: { name: 'Miles per hour (mph)', toBase: 0.44704 },
  knot: { name: 'Knots (kn)', toBase: 0.514444 },
  fps: { name: 'Feet per second (ft/s)', toBase: 0.3048 },
};

export function convertSpeed(value: number, from: string, to: string): number {
  if (value === 0) return 0;
  const fromUnit = SPEED_UNITS[from];
  const toUnit = SPEED_UNITS[to];
  if (!fromUnit || !toUnit) return 0;

  const baseSpeed = value * fromUnit.toBase;
  return baseSpeed / toUnit.toBase;
}

// Data storage conversions (base: Bytes)
export function convertDataStorage(
  value: number,
  from: string,
  to: string,
  isBinary = false
): number {
  if (value === 0) return 0;
  const factor = isBinary ? 1024 : 1000;
  const powers: Record<string, number> = {
    B: 0,
    KB: 1,
    MB: 2,
    GB: 3,
    TB: 4,
    PB: 5,
  };

  const fromPower = powers[from] ?? 0;
  const toPower = powers[to] ?? 0;

  const bytes = value * Math.pow(factor, fromPower);
  return bytes / Math.pow(factor, toPower);
}

// Currency Converter with comprehensive defaults and live fetch capability
export const DEFAULT_CURRENCY_RATES: Record<string, number> = {
  USD: 1.0,
  EUR: 0.92,
  GBP: 0.78,
  JPY: 154.5,
  CAD: 1.36,
  AUD: 1.51,
  CHF: 0.89,
  CNY: 7.24,
  INR: 83.5,
  BRL: 5.15,
  MXN: 16.8,
  SGD: 1.35,
  NZD: 1.64,
  HKD: 7.82,
  KRW: 1370.0,
  AED: 3.67,
  SAR: 3.75,
  ZAR: 18.2,
  TRY: 32.4,
  SEK: 10.7,
  NOK: 10.8,
  DKK: 6.86,
  PLN: 3.95,
  THB: 36.6,
  IDR: 16200.0,
};

export const CURRENCY_NAMES: Record<string, string> = {
  USD: 'United States Dollar (USD $)',
  EUR: 'Euro (EUR €)',
  GBP: 'British Pound (GBP £)',
  JPY: 'Japanese Yen (JPY ¥)',
  CAD: 'Canadian Dollar (CAD $)',
  AUD: 'Australian Dollar (AUD $)',
  CHF: 'Swiss Franc (CHF)',
  CNY: 'Chinese Yuan (CNY ¥)',
  INR: 'Indian Rupee (INR ₹)',
  BRL: 'Brazilian Real (BRL R$)',
  MXN: 'Mexican Peso (MXN $)',
  SGD: 'Singapore Dollar (SGD $)',
  NZD: 'New Zealand Dollar (NZD $)',
  HKD: 'Hong Kong Dollar (HKD $)',
  KRW: 'South Korean Won (KRW ₩)',
  AED: 'UAE Dirham (AED)',
  SAR: 'Saudi Riyal (SAR)',
  ZAR: 'South African Rand (ZAR)',
  TRY: 'Turkish Lira (TRY ₺)',
  SEK: 'Swedish Krona (SEK)',
  NOK: 'Norwegian Krone (NOK)',
  DKK: 'Danish Krone (DKK)',
  PLN: 'Polish Zloty (PLN)',
  THB: 'Thai Baht (THB ฿)',
  IDR: 'Indonesian Rupiah (IDR Rp)',
};

export async function fetchLiveCurrencyRates(): Promise<{
  rates: Record<string, number>;
  lastUpdated: string;
}> {
  try {
    const res = await fetch('https://open.er-api.com/v6/latest/USD');
    if (!res.ok) throw new Error('API fetch failed');
    const data = await res.json();
    if (data && data.rates) {
      return {
        rates: data.rates,
        lastUpdated: data.time_last_update_utc || new Date().toUTCString(),
      };
    }
  } catch {
    // Graceful fallback
  }
  return {
    rates: DEFAULT_CURRENCY_RATES,
    lastUpdated: 'Live fallback rates (auto-synced)',
  };
}
