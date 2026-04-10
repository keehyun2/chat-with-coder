import type { Language } from '../i18n/translations';

const API_URL = `${import.meta.env.VITE_SOCKET_URL}/api/translate`;

type CacheKey = `${string}::${Language}`;
const translationCache = new Map<CacheKey, string>();
const pendingRequests = new Map<CacheKey, Promise<string>>();

export async function translateText(text: string, targetLang: Language): Promise<string> {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, targetLang }),
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({ error: 'Translation failed' }));
    throw new Error(data.error || 'Translation failed');
  }

  const data = await response.json() as { translatedText: string };
  return data.translatedText;
}

export function getCachedTranslation(messageId: string, targetLang: Language): string | undefined {
  return translationCache.get(`${messageId}::${targetLang}`);
}

export function setCachedTranslation(messageId: string, targetLang: Language, translatedText: string): void {
  translationCache.set(`${messageId}::${targetLang}`, translatedText);
}

export function clearTranslationCache(): void {
  translationCache.clear();
  pendingRequests.clear();
}

export async function getOrFetchTranslation(
  messageId: string,
  text: string,
  targetLang: Language,
): Promise<string> {
  const cacheKey: CacheKey = `${messageId}::${targetLang}`;

  // Check cache
  const cached = translationCache.get(cacheKey);
  if (cached) return cached;

  // Check pending request (dedup)
  const pending = pendingRequests.get(cacheKey);
  if (pending) return pending;

  // New request
  const promise = translateText(text, targetLang)
    .then((result) => {
      translationCache.set(cacheKey, result);
      pendingRequests.delete(cacheKey);
      return result;
    })
    .catch((err) => {
      pendingRequests.delete(cacheKey);
      throw err;
    });

  pendingRequests.set(cacheKey, promise);
  return promise;
}
