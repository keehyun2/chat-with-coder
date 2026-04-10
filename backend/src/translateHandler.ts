import type { IncomingMessage, ServerResponse } from 'http';

const TRANSLATOR_ENDPOINT = 'https://api.cognitive.microsofttranslator.com/translate';

// Server-side cache: key = text::targetLang, value = translated text + timestamp
const translationCache = new Map<string, { text: string; timestamp: number }>();
const CACHE_MAX = 1000;
const CACHE_TTL = 60 * 60 * 1000; // 1 hour

// Rate limiter: IP → timestamps
const rateLimitMap = new Map<string, number[]>();
const RATE_LIMIT_WINDOW = 10_000; // 10 seconds
const RATE_LIMIT_MAX = 20;

function getCacheKey(text: string, targetLang: string): string {
  return `${text}::${targetLang}`;
}

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const timestamps = rateLimitMap.get(ip)?.filter(t => now - t < RATE_LIMIT_WINDOW) || [];
  if (timestamps.length >= RATE_LIMIT_MAX) return false;
  timestamps.push(now);
  rateLimitMap.set(ip, timestamps);
  return true;
}

function cleanCache(): void {
  if (translationCache.size <= CACHE_MAX) return;
  const now = Date.now();
  for (const [key, entry] of translationCache) {
    if (now - entry.timestamp > CACHE_TTL) {
      translationCache.delete(key);
    }
  }
  // If still over limit, remove oldest entries
  if (translationCache.size > CACHE_MAX) {
    const entries = [...translationCache.entries()].sort((a, b) => a[1].timestamp - b[1].timestamp);
    for (let i = 0; i < entries.length - CACHE_MAX; i++) {
      translationCache.delete(entries[i][0]);
    }
  }
}

function parseBody(req: IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on('data', (chunk: Buffer) => chunks.push(chunk));
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf-8')));
    req.on('error', reject);
  });
}

function sendJson(res: ServerResponse, status: number, data: Record<string, unknown>): void {
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data));
}

export async function handleTranslateRequest(
  req: IncomingMessage,
  res: ServerResponse,
  clientOrigin: string,
): Promise<void> {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', clientOrigin);

  const translatorKey = process.env.AZURE_TRANSLATOR_KEY;
  const translatorRegion = process.env.AZURE_TRANSLATOR_REGION || 'koreacentral';

  if (!translatorKey) {
    sendJson(res, 503, { error: 'Translation service not configured' });
    return;
  }

  if (req.method !== 'POST') {
    sendJson(res, 405, { error: 'Method not allowed' });
    return;
  }

  // Rate limit
  const ip = req.socket.remoteAddress || 'unknown';
  if (!checkRateLimit(ip)) {
    sendJson(res, 429, { error: 'Too many translation requests. Try again later.' });
    return;
  }

  try {
    const body = JSON.parse(await parseBody(req));
    const { text, targetLang } = body;

    if (!text || typeof text !== 'string' || !targetLang || typeof targetLang !== 'string') {
      sendJson(res, 400, { error: 'Invalid request. Required: text (string), targetLang (string)' });
      return;
    }

    if (text.trim().length === 0) {
      sendJson(res, 400, { error: 'Text cannot be empty' });
      return;
    }

    // Check cache
    const cacheKey = getCacheKey(text, targetLang);
    const cached = translationCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      sendJson(res, 200, { translatedText: cached.text });
      return;
    }

    // Call Azure Translator API
    const url = `${TRANSLATOR_ENDPOINT}?api-version=3.0&to=${encodeURIComponent(targetLang)}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Ocp-Apim-Subscription-Key': translatorKey,
        'Ocp-Apim-Subscription-Region': translatorRegion,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify([{ text }]),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Azure Translator API error: ${response.status}`, errorText);

      if (response.status === 429) {
        sendJson(res, 429, { error: 'Translation rate limit exceeded. Try again later.' });
      } else if (response.status === 401 || response.status === 403) {
        sendJson(res, 503, { error: 'Translation service unavailable' });
      } else {
        sendJson(res, 503, { error: 'Translation service error' });
      }
      return;
    }

    const data = await response.json() as Array<{ translations: Array<{ text: string }> }>;
    const translatedText = data?.[0]?.translations?.[0]?.text;

    if (!translatedText) {
      sendJson(res, 503, { error: 'Translation failed: unexpected response' });
      return;
    }

    // Cache the result
    translationCache.set(cacheKey, { text: translatedText, timestamp: Date.now() });
    cleanCache();

    sendJson(res, 200, { translatedText });
  } catch (err) {
    console.error('Translation handler error:', err);
    sendJson(res, 500, { error: 'Internal translation error' });
  }
}
