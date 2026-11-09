export interface PasswordOptions {
  length: number;
  includeUppercase: boolean;
  includeLowercase: boolean;
  includeNumbers: boolean;
  includeSymbols: boolean;
  excludeAmbiguous: boolean;
}

export function generatePassword(options: PasswordOptions): { password: string; strength: 'Weak' | 'Medium' | 'Strong' | 'Very Strong'; score: number } {
  let uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
  let numberChars = '0123456789';
  let symbolChars = '!@#$%^&*()_+-=[]{}|;:,.<>?';

  if (options.excludeAmbiguous) {
    uppercaseChars = uppercaseChars.replace(/[IO]/g, '');
    lowercaseChars = lowercaseChars.replace(/[l]/g, '');
    numberChars = numberChars.replace(/[01]/g, '');
    symbolChars = symbolChars.replace(/[|;:,.<>]/g, '');
  }

  let pool = '';
  const guaranteed: string[] = [];

  if (options.includeUppercase) {
    pool += uppercaseChars;
    guaranteed.push(uppercaseChars[Math.floor(Math.random() * uppercaseChars.length)]);
  }
  if (options.includeLowercase) {
    pool += lowercaseChars;
    guaranteed.push(lowercaseChars[Math.floor(Math.random() * lowercaseChars.length)]);
  }
  if (options.includeNumbers) {
    pool += numberChars;
    guaranteed.push(numberChars[Math.floor(Math.random() * numberChars.length)]);
  }
  if (options.includeSymbols) {
    pool += symbolChars;
    guaranteed.push(symbolChars[Math.floor(Math.random() * symbolChars.length)]);
  }

  if (pool.length === 0) {
    pool = lowercaseChars;
    guaranteed.push(lowercaseChars[Math.floor(Math.random() * lowercaseChars.length)]);
  }

  const remainingLength = Math.max(0, options.length - guaranteed.length);
  const resultChars = [...guaranteed];

  // Cryptographically strong random if available
  const randomBytes = new Uint8Array(remainingLength);
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    crypto.getRandomValues(randomBytes);
    for (let i = 0; i < remainingLength; i++) {
      resultChars.push(pool[randomBytes[i] % pool.length]);
    }
  } else {
    for (let i = 0; i < remainingLength; i++) {
      resultChars.push(pool[Math.floor(Math.random() * pool.length)]);
    }
  }

  // Shuffle characters
  for (let i = resultChars.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [resultChars[i], resultChars[j]] = [resultChars[j], resultChars[i]];
  }

  const password = resultChars.join('');

  // Calculate entropy
  const poolSize = pool.length;
  const entropy = Math.round(password.length * Math.log2(poolSize));

  let strength: 'Weak' | 'Medium' | 'Strong' | 'Very Strong' = 'Weak';
  let score = 25;

  if (entropy > 80 && password.length >= 14) {
    strength = 'Very Strong';
    score = 100;
  } else if (entropy >= 60 && password.length >= 10) {
    strength = 'Strong';
    score = 75;
  } else if (entropy >= 40 && password.length >= 8) {
    strength = 'Medium';
    score = 50;
  }

  return { password, strength, score };
}

export function urlEncode(input: string, mode: 'component' | 'full' = 'component'): string {
  if (!input) return '';
  return mode === 'component' ? encodeURIComponent(input) : encodeURI(input);
}

export function urlDecode(input: string, mode: 'component' | 'full' = 'component'): string {
  if (!input) return '';
  try {
    return mode === 'component' ? decodeURIComponent(input) : decodeURI(input);
  } catch (err) {
    return `Error decoding URL: ${(err as Error).message}`;
  }
}

export function base64Encode(text: string): string {
  if (!text) return '';
  try {
    // UTF-8 safe base64 encode
    const utf8Bytes = new TextEncoder().encode(text);
    let binary = '';
    for (let i = 0; i < utf8Bytes.length; i++) {
      binary += String.fromCharCode(utf8Bytes[i]);
    }
    return btoa(binary);
  } catch (err) {
    return `Error encoding to Base64: ${(err as Error).message}`;
  }
}

export function base64Decode(base64: string): string {
  if (!base64) return '';
  try {
    const cleanBase64 = base64.trim().replace(/\s/g, '');
    const binary = atob(cleanBase64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return new TextDecoder().decode(bytes);
  } catch (err) {
    return `Error decoding Base64: ${(err as Error).message}`;
  }
}

export interface JsonFormatResult {
  formatted: string;
  isValid: boolean;
  error?: string;
  sizeBytes: number;
}

export function formatJson(input: string, indent: number | 'minify'): JsonFormatResult {
  if (!input || !input.trim()) {
    return { formatted: '', isValid: true, sizeBytes: 0 };
  }

  try {
    const parsed = JSON.parse(input);
    const formatted = indent === 'minify' ? JSON.stringify(parsed) : JSON.stringify(parsed, null, indent);
    return {
      formatted,
      isValid: true,
      sizeBytes: new Blob([formatted]).size,
    };
  } catch (err) {
    return {
      formatted: input,
      isValid: false,
      error: (err as Error).message,
      sizeBytes: new Blob([input]).size,
    };
  }
}

export function formatHtml(html: string, mode: 'beautify' | 'minify'): string {
  if (!html) return '';

  if (mode === 'minify') {
    return html
      .replace(/<!--[\s\S]*?-->/g, '') // remove comments
      .replace(/\s+/g, ' ') // collapse whitespaces
      .replace(/>\s+</g, '><') // remove spaces between tags
      .trim();
  }

  // Simple clean HTML indent beautifier
  let formatted = '';
  let indent = 0;
  const tab = '  ';

  // Tokenize tags and content
  const tokens = html.replace(/>\s*</g, '><').split(/(<[^>]+>)/g).filter(Boolean);

  const voidTags = new Set([
    'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input',
    'link', 'meta', 'param', 'source', 'track', 'wbr', '!doctype'
  ]);

  for (const token of tokens) {
    if (token.startsWith('</')) {
      // Closing tag
      indent = Math.max(0, indent - 1);
      formatted += tab.repeat(indent) + token.trim() + '\n';
    } else if (token.startsWith('<') && !token.startsWith('<!')) {
      // Opening or self-closing
      const tagNameMatch = token.match(/<([a-zA-Z0-9-]+)/);
      const tagName = tagNameMatch ? tagNameMatch[1].toLowerCase() : '';
      const isSelfClosing = token.endsWith('/>') || voidTags.has(tagName);

      formatted += tab.repeat(indent) + token.trim() + '\n';
      if (!isSelfClosing) {
        indent++;
      }
    } else if (token.startsWith('<!')) {
      // Doctype / comment
      formatted += tab.repeat(indent) + token.trim() + '\n';
    } else {
      // Text node
      const text = token.trim();
      if (text) {
        formatted += tab.repeat(indent) + text + '\n';
      }
    }
  }

  return formatted.trim();
}
