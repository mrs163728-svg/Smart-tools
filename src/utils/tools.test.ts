import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateAge, calculatePercentage, calculateBmi, calculateDateDiff } from './calculator';
import { analyzeText, convertCase, reverseText, removeExtraSpaces } from './text';
import { convertLength, convertWeight, convertTemperature, convertDataStorage } from './converters';
import { generatePassword, urlEncode, urlDecode, base64Encode, base64Decode, formatJson } from './dev';

test('calculateAge computes exact age correctly', () => {
  const result = calculateAge('2000-01-01', '2026-01-01');
  assert.ok(result);
  assert.equal(result.years, 26);
  assert.equal(result.months, 0);
  assert.equal(result.days, 0);
  assert.ok(result.totalDays > 9000);
});

test('calculatePercentage handles all modes correctly', () => {
  assert.equal(calculatePercentage('percentOf', 20, 500), 100);
  assert.equal(calculatePercentage('isWhatPercent', 50, 200), 25);
  assert.equal(calculatePercentage('change', 100, 150), 50);
});

test('calculateBmi calculates accurate values and categories', () => {
  // 70kg, 175cm -> BMI = 70 / (1.75^2) = 22.86 -> Normal
  const res = calculateBmi(70, 175, 'metric');
  assert.ok(res);
  assert.equal(res.bmi, 22.9);
  assert.equal(res.category, 'Normal weight');
});

test('calculateDateDiff calculates days correctly', () => {
  const diff = calculateDateDiff('2026-01-01', '2026-01-11');
  assert.ok(diff);
  assert.equal(diff.days, 10);
});

test('analyzeText gives accurate word, char and sentence counts', () => {
  const text = 'Smart Tools World provides free online utilities. Fast and secure!';
  const stats = analyzeText(text);
  assert.equal(stats.words, 10);
  assert.equal(stats.sentences, 2);
  assert.ok(stats.characters > 50);
});

test('convertCase formats correctly', () => {
  const sample = 'smart tools world';
  assert.equal(convertCase(sample, 'uppercase'), 'SMART TOOLS WORLD');
  assert.equal(convertCase(sample, 'titlecase'), 'Smart Tools World');
  assert.equal(convertCase(sample, 'snakecase'), 'smart_tools_world');
  assert.equal(convertCase(sample, 'kebabcase'), 'smart-tools-world');
  assert.equal(convertCase(sample, 'camelcase'), 'smartToolsWorld');
  assert.equal(convertCase(sample, 'pascalcase'), 'SmartToolsWorld');
});

test('reverseText handles characters, words, and eachWord', () => {
  assert.equal(reverseText('hello', 'characters'), 'olleh');
  assert.equal(reverseText('hello world', 'words'), 'world hello');
  assert.equal(reverseText('hello world', 'eachWord'), 'olleh dlrow');
});

test('removeExtraSpaces collapses whitespace', () => {
  const messy = '  Lots    of   spaces   here  ';
  assert.equal(removeExtraSpaces(messy), 'Lots of spaces here');
});

test('convertLength translates between meters, miles, and feet', () => {
  const metersInKm = convertLength(5, 'km', 'm');
  assert.equal(metersInKm, 5000);

  const cmInMeters = convertLength(250, 'cm', 'm');
  assert.equal(cmInMeters, 2.5);
});

test('convertTemperature converts accurately', () => {
  // 0 C = 32 F
  assert.equal(convertTemperature(0, 'C', 'F'), 32);
  // 100 C = 212 F
  assert.equal(convertTemperature(100, 'C', 'F'), 212);
  // 0 C = 273.15 K
  assert.equal(convertTemperature(0, 'C', 'K'), 273.15);
});

test('convertDataStorage converts decimal and binary', () => {
  assert.equal(convertDataStorage(1, 'GB', 'MB', false), 1000);
  assert.equal(convertDataStorage(1, 'GB', 'MB', true), 1024);
});

test('developer utilities password, url, base64, json', () => {
  const pwd = generatePassword({
    length: 16,
    includeUppercase: true,
    includeLowercase: true,
    includeNumbers: true,
    includeSymbols: true,
    excludeAmbiguous: false,
  });
  assert.equal(pwd.password.length, 16);
  assert.ok(pwd.strength === 'Strong' || pwd.strength === 'Very Strong');

  const rawUrl = 'https://smarttools.world/test?name=John Doe&status=active';
  const encoded = urlEncode(rawUrl, 'full');
  assert.ok(encoded.includes('%20'));
  assert.equal(urlDecode(encoded, 'full'), rawUrl);

  const plain = 'Hello Smart Tools World! 🚀';
  const b64 = base64Encode(plain);
  assert.equal(base64Decode(b64), plain);

  const jsonSample = '{"name":"Smart Tools","active":true}';
  const formatted = formatJson(jsonSample, 2);
  assert.equal(formatted.isValid, true);
  assert.ok(formatted.formatted.includes('\n'));
});
