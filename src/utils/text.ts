export interface TextStats {
  words: number;
  characters: number;
  charactersWithoutSpaces: number;
  sentences: number;
  paragraphs: number;
  spaces: number;
  digits: number;
  symbols: number;
  readingTimeMinutes: number;
  speakingTimeMinutes: number;
}

export function analyzeText(text: string): TextStats {
  if (!text) {
    return {
      words: 0,
      characters: 0,
      charactersWithoutSpaces: 0,
      sentences: 0,
      paragraphs: 0,
      spaces: 0,
      digits: 0,
      symbols: 0,
      readingTimeMinutes: 0,
      speakingTimeMinutes: 0,
    };
  }

  const characters = text.length;
  const charactersWithoutSpaces = text.replace(/\s/g, '').length;
  const spaces = (text.match(/\s/g) || []).length;
  const digits = (text.match(/\d/g) || []).length;
  const symbols = (text.match(/[^a-zA-Z0-9\s]/g) || []).length;

  const wordsArray = text.trim().split(/\s+/).filter(Boolean);
  const words = wordsArray.length;

  const sentencesArray = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const sentences = sentencesArray.length;

  const paragraphsArray = text.split(/\n+/).filter(p => p.trim().length > 0);
  const paragraphs = paragraphsArray.length;

  // Average reading speed: 200 words per minute. Speaking speed: 130 words per minute.
  const readingTimeMinutes = Math.ceil(words / 200);
  const speakingTimeMinutes = Math.ceil(words / 130);

  return {
    words,
    characters,
    charactersWithoutSpaces,
    sentences,
    paragraphs,
    spaces,
    digits,
    symbols,
    readingTimeMinutes,
    speakingTimeMinutes,
  };
}

export type TextCase =
  | 'uppercase'
  | 'lowercase'
  | 'titlecase'
  | 'sentencecase'
  | 'camelcase'
  | 'pascalcase'
  | 'snakecase'
  | 'kebabcase';

export function convertCase(text: string, toCase: TextCase): string {
  if (!text) return '';

  switch (toCase) {
    case 'uppercase':
      return text.toUpperCase();

    case 'lowercase':
      return text.toLowerCase();

    case 'sentencecase':
      return text
        .toLowerCase()
        .replace(/(^\s*\w|[.!?]\s*\w)/g, c => c.toUpperCase());

    case 'titlecase':
      return text.toLowerCase().replace(/\b(\w)/g, c => c.toUpperCase());

    case 'camelcase': {
      const words = text
        .replace(/[^a-zA-Z0-9\s_-]/g, ' ')
        .split(/[\s_-]+/)
        .filter(Boolean);
      return words
        .map((w, i) => (i === 0 ? w.toLowerCase() : w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()))
        .join('');
    }

    case 'pascalcase': {
      const words = text
        .replace(/[^a-zA-Z0-9\s_-]/g, ' ')
        .split(/[\s_-]+/)
        .filter(Boolean);
      return words
        .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
        .join('');
    }

    case 'snakecase': {
      return text
        .replace(/[^a-zA-Z0-9\s_-]/g, ' ')
        .trim()
        .split(/[\s_-]+/)
        .filter(Boolean)
        .map(w => w.toLowerCase())
        .join('_');
    }

    case 'kebabcase': {
      return text
        .replace(/[^a-zA-Z0-9\s_-]/g, ' ')
        .trim()
        .split(/[\s_-]+/)
        .filter(Boolean)
        .map(w => w.toLowerCase())
        .join('-');
    }

    default:
      return text;
  }
}

export function reverseText(text: string, mode: 'characters' | 'words' | 'eachWord'): string {
  if (!text) return '';

  if (mode === 'characters') {
    return Array.from(text).reverse().join('');
  }

  if (mode === 'words') {
    return text.split(/(\s+)/).reverse().join('');
  }

  if (mode === 'eachWord') {
    return text
      .split(/(\s+)/)
      .map(part => (/\s+/.test(part) ? part : Array.from(part).reverse().join('')))
      .join('');
  }

  return text;
}

export function removeExtraSpaces(
  text: string,
  options: {
    multipleSpacesToSingle?: boolean;
    trimLines?: boolean;
    removeEmptyLines?: boolean;
  } = {}
): string {
  if (!text) return '';
  let result = text;

  if (options.multipleSpacesToSingle !== false) {
    result = result.replace(/[ \t]+/g, ' ');
  }

  if (options.trimLines !== false) {
    result = result
      .split('\n')
      .map(line => line.trim())
      .join('\n');
  }

  if (options.removeEmptyLines) {
    result = result
      .split('\n')
      .filter(line => line.trim().length > 0)
      .join('\n');
  }

  return result.trim();
}

const LOREM_WORDS = [
  'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit',
  'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore',
  'magna', 'aliqua', 'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud',
  'exercitation', 'ullamco', 'laboris', 'nisi', 'aliquip', 'ex', 'ea', 'commodo',
  'consequat', 'duis', 'aute', 'irure', 'in', 'reprehenderit', 'voluptate', 'velit',
  'esse', 'cillum', 'fugiat', 'nulla', 'pariatur', 'excepteur', 'sint', 'occaecat',
  'cupidatat', 'non', 'proident', 'sunt', 'culpa', 'qui', 'officia', 'deserunt',
  'mollit', 'anim', 'id', 'est', 'laborum'
];

export function generateLoremIpsum(count: number, type: 'paragraphs' | 'sentences' | 'words', startWithLorem = true): string {
  const getRandomWord = () => LOREM_WORDS[Math.floor(Math.random() * LOREM_WORDS.length)];

  const generateSentence = (minWords = 6, maxWords = 14) => {
    const len = Math.floor(Math.random() * (maxWords - minWords + 1)) + minWords;
    const words: string[] = [];
    for (let i = 0; i < len; i++) {
      words.push(getRandomWord());
    }
    const sentence = words.join(' ');
    return sentence.charAt(0).toUpperCase() + sentence.slice(1) + '.';
  };

  const generateParagraph = (sentencesCount = 5) => {
    const sentences: string[] = [];
    for (let i = 0; i < sentencesCount; i++) {
      sentences.push(generateSentence());
    }
    return sentences.join(' ');
  };

  if (type === 'words') {
    const words: string[] = [];
    if (startWithLorem && count >= 2) {
      words.push('Lorem', 'ipsum');
      count -= 2;
    }
    for (let i = 0; i < count; i++) {
      words.push(getRandomWord());
    }
    return words.join(' ');
  }

  if (type === 'sentences') {
    const sentences: string[] = [];
    for (let i = 0; i < count; i++) {
      if (i === 0 && startWithLorem) {
        sentences.push('Lorem ipsum dolor sit amet, consectetur adipiscing elit.');
      } else {
        sentences.push(generateSentence());
      }
    }
    return sentences.join(' ');
  }

  // Paragraphs
  const paragraphs: string[] = [];
  for (let i = 0; i < count; i++) {
    if (i === 0 && startWithLorem) {
      paragraphs.push(
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'
      );
    } else {
      paragraphs.push(generateParagraph(4));
    }
  }
  return paragraphs.join('\n\n');
}
