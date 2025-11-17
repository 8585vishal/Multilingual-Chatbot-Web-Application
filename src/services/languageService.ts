const LANGUAGE_PATTERNS: Record<string, RegExp[]> = {
  en: [/\b(the|is|are|was|were|have|has|will|would|can|could)\b/i],
  hi: [/[\u0900-\u097F]/],
  es: [/\b(el|la|los|las|es|son|está|están|tiene|tienen)\b/i, /[áéíóúñ]/i],
  fr: [/\b(le|la|les|est|sont|être|avoir|dans|pour)\b/i, /[àâéèêëîïôùûüÿæœç]/i],
  ta: [/[\u0B80-\u0BFF]/],
  de: [/\b(der|die|das|ist|sind|haben|wird|können)\b/i, /[äöüß]/i],
};

export const detectLanguage = async (text: string): Promise<string> => {
  const trimmedText = text.trim();
  if (!trimmedText) return 'en';

  for (const [lang, patterns] of Object.entries(LANGUAGE_PATTERNS)) {
    for (const pattern of patterns) {
      if (pattern.test(trimmedText)) {
        return lang;
      }
    }
  }

  return 'en';
};

export const translateText = async (
  text: string,
  targetLanguage: string,
  sourceLanguage?: string
): Promise<{ translatedText: string; detectedLanguage: string }> => {
  const apiKey = import.meta.env.VITE_GOOGLE_TRANSLATE_API_KEY;
  const provider = 'google';

  if (provider === 'google' && apiKey) {
    return translateWithGoogle(text, targetLanguage, sourceLanguage, apiKey);
  } else {
    return translateWithLibre(text, targetLanguage, sourceLanguage);
  }
};

const translateWithGoogle = async (
  text: string,
  targetLanguage: string,
  sourceLanguage: string | undefined,
  apiKey: string
): Promise<{ translatedText: string; detectedLanguage: string }> => {
  const url = new URL('https://translation.googleapis.com/language/translate/v2');
  url.searchParams.append('key', apiKey);
  url.searchParams.append('q', text);
  url.searchParams.append('target', targetLanguage);
  if (sourceLanguage) {
    url.searchParams.append('source', sourceLanguage);
  }

  const response = await fetch(url.toString(), { method: 'POST' });
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error?.message || 'Translation failed');
  }

  return {
    translatedText: data.data.translations[0].translatedText,
    detectedLanguage: data.data.translations[0].detectedSourceLanguage || sourceLanguage || 'en',
  };
};

const translateWithLibre = async (
  text: string,
  targetLanguage: string,
  sourceLanguage?: string
): Promise<{ translatedText: string; detectedLanguage: string }> => {
  const libreUrl = import.meta.env.VITE_LIBRE_TRANSLATE_URL || 'https://libretranslate.com';
  const url = `${libreUrl}/translate`;

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      q: text,
      source: sourceLanguage || 'auto',
      target: targetLanguage,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Translation failed');
  }

  return {
    translatedText: data.translatedText,
    detectedLanguage: data.detectedLanguage?.language || sourceLanguage || 'en',
  };
};

export const LANGUAGE_NAMES: Record<string, string> = {
  en: 'English',
  hi: 'हिन्दी (Hindi)',
  es: 'Español (Spanish)',
  fr: 'Français (French)',
  ta: 'தமிழ் (Tamil)',
  de: 'Deutsch (German)',
};

export const LANGUAGE_FLAGS: Record<string, string> = {
  en: '🇬🇧',
  hi: '🇮🇳',
  es: '🇪🇸',
  fr: '🇫🇷',
  ta: '🇮🇳',
  de: '🇩🇪',
};
