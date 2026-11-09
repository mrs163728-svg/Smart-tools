export interface AgeResult {
  years: number;
  months: number;
  days: number;
  totalDays: number;
  totalHours: number;
  totalMinutes: number;
  daysUntilNextBirthday: number;
  nextBirthdayDayOfWeek: string;
}

export function calculateAge(birthDateStr: string, targetDateStr?: string): AgeResult | null {
  if (!birthDateStr) return null;
  const birthDate = new Date(birthDateStr);
  const targetDate = targetDateStr ? new Date(targetDateStr) : new Date();

  if (isNaN(birthDate.getTime()) || isNaN(targetDate.getTime())) return null;
  if (birthDate > targetDate) return null;

  let years = targetDate.getFullYear() - birthDate.getFullYear();
  let months = targetDate.getMonth() - birthDate.getMonth();
  let days = targetDate.getDate() - birthDate.getDate();

  if (days < 0) {
    months -= 1;
    const prevMonthLastDay = new Date(targetDate.getFullYear(), targetDate.getMonth(), 0).getDate();
    days += prevMonthLastDay;
  }

  if (months < 0) {
    years -= 1;
    months += 12;
  }

  const diffTime = targetDate.getTime() - birthDate.getTime();
  const totalDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  const totalHours = Math.floor(diffTime / (1000 * 60 * 60));
  const totalMinutes = Math.floor(diffTime / (1000 * 60));

  // Next birthday calculation
  let nextBdayYear = targetDate.getFullYear();
  let nextBday = new Date(nextBdayYear, birthDate.getMonth(), birthDate.getDate());
  if (nextBday < targetDate) {
    nextBdayYear += 1;
    nextBday = new Date(nextBdayYear, birthDate.getMonth(), birthDate.getDate());
  }
  const nextDiff = nextBday.getTime() - targetDate.getTime();
  const daysUntilNextBirthday = Math.max(0, Math.ceil(nextDiff / (1000 * 60 * 60 * 24)));
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const nextBirthdayDayOfWeek = dayNames[nextBday.getDay()];

  return {
    years,
    months,
    days,
    totalDays,
    totalHours,
    totalMinutes,
    daysUntilNextBirthday,
    nextBirthdayDayOfWeek,
  };
}

export function calculatePercentage(type: 'percentOf' | 'isWhatPercent' | 'change', a: number, b: number): number {
  if (type === 'percentOf') {
    // a% of b
    return (a / 100) * b;
  }
  if (type === 'isWhatPercent') {
    // a is what % of b
    if (b === 0) return 0;
    return (a / b) * 100;
  }
  if (type === 'change') {
    // % change from a to b
    if (a === 0) return 0;
    return ((b - a) / Math.abs(a)) * 100;
  }
  return 0;
}

export interface BmiResult {
  bmi: number;
  category: 'Underweight' | 'Normal weight' | 'Overweight' | 'Obese';
  color: string;
  minHealthyWeight: number;
  maxHealthyWeight: number;
  unit: 'metric' | 'imperial';
}

export function calculateBmi(
  weight: number,
  height: number,
  unit: 'metric' | 'imperial'
): BmiResult | null {
  if (weight <= 0 || height <= 0) return null;

  let bmi = 0;
  let minHealthyWeight = 0;
  let maxHealthyWeight = 0;

  if (unit === 'metric') {
    // weight in kg, height in cm
    const heightInMeters = height / 100;
    bmi = weight / (heightInMeters * heightInMeters);
    minHealthyWeight = 18.5 * (heightInMeters * heightInMeters);
    maxHealthyWeight = 24.9 * (heightInMeters * heightInMeters);
  } else {
    // weight in lbs, height in inches
    bmi = (703 * weight) / (height * height);
    minHealthyWeight = (18.5 * (height * height)) / 703;
    maxHealthyWeight = (24.9 * (height * height)) / 703;
  }

  bmi = Math.round(bmi * 10) / 10;
  minHealthyWeight = Math.round(minHealthyWeight * 10) / 10;
  maxHealthyWeight = Math.round(maxHealthyWeight * 10) / 10;

  let category: BmiResult['category'] = 'Normal weight';
  let color = 'text-emerald-500';

  if (bmi < 18.5) {
    category = 'Underweight';
    color = 'text-blue-500';
  } else if (bmi >= 25 && bmi < 30) {
    category = 'Overweight';
    color = 'text-amber-500';
  } else if (bmi >= 30) {
    category = 'Obese';
    color = 'text-rose-500';
  }

  return {
    bmi,
    category,
    color,
    minHealthyWeight,
    maxHealthyWeight,
    unit,
  };
}

export function calculateDateDiff(startDateStr: string, endDateStr: string): {
  days: number;
  weeks: number;
  months: number;
  years: number;
} | null {
  if (!startDateStr || !endDateStr) return null;
  const start = new Date(startDateStr);
  const end = new Date(endDateStr);
  if (isNaN(start.getTime()) || isNaN(end.getTime())) return null;

  const diffMs = Math.abs(end.getTime() - start.getTime());
  const days = Math.round(diffMs / (1000 * 60 * 60 * 24));
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30.4375);
  const years = Math.floor(days / 365.25);

  return { days, weeks, months, years };
}

export function calculateAddSubtractDate(
  baseDateStr: string,
  amount: number,
  unit: 'days' | 'weeks' | 'months' | 'years',
  operation: 'add' | 'subtract'
): string | null {
  if (!baseDateStr) return null;
  const date = new Date(baseDateStr);
  if (isNaN(date.getTime())) return null;

  const multiplier = operation === 'add' ? 1 : -1;
  const delta = amount * multiplier;

  if (unit === 'days') {
    date.setDate(date.getDate() + delta);
  } else if (unit === 'weeks') {
    date.setDate(date.getDate() + delta * 7);
  } else if (unit === 'months') {
    date.setMonth(date.getMonth() + delta);
  } else if (unit === 'years') {
    date.setFullYear(date.getFullYear() + delta);
  }

  return date.toISOString().split('T')[0];
}

export function calculateTimeDiff(time1: string, time2: string): {
  hours: number;
  minutes: number;
  seconds: number;
  totalSeconds: number;
  formatted: string;
} | null {
  if (!time1 || !time2) return null;
  const [h1 = 0, m1 = 0, s1 = 0] = time1.split(':').map(Number);
  const [h2 = 0, m2 = 0, s2 = 0] = time2.split(':').map(Number);

  if ([h1, m1, s1, h2, m2, s2].some(v => isNaN(v))) return null;

  const sec1 = h1 * 3600 + m1 * 60 + s1;
  const sec2 = h2 * 3600 + m2 * 60 + s2;
  const totalSeconds = Math.abs(sec2 - sec1);

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return {
    hours,
    minutes,
    seconds,
    totalSeconds,
    formatted: `${hours}h ${minutes}m ${seconds}s`,
  };
}
