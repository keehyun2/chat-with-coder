import { useCallback, useEffect, useRef, useState } from 'react';
import type { Language } from '../i18n/translations';
import { clearTranslationCache, getOrFetchTranslation, getCachedTranslation, setCachedTranslation } from '../utils/translationApi';

export function useTranslation(language: Language) {
  const [translatedMessages, setTranslatedMessages] = useState<Map<string, string>>(new Map());
  const [loadingMessages, setLoadingMessages] = useState<Set<string>>(new Set());
  const [errorMessages, setErrorMessages] = useState<Map<string, string>>(new Map());
  const prevLanguageRef = useRef(language);

  // Clear translations when language changes
  useEffect(() => {
    if (prevLanguageRef.current !== language) {
      prevLanguageRef.current = language;
      setTranslatedMessages(new Map());
      setErrorMessages(new Map());
      clearTranslationCache();
    }
  }, [language]);

  const toggleTranslation = useCallback(
    async (messageId: string, text: string, targetLang: Language) => {
      // Toggle off
      if (translatedMessages.has(messageId)) {
        setTranslatedMessages((prev) => {
          const next = new Map(prev);
          next.delete(messageId);
          return next;
        });
        return;
      }

      // Already loading
      if (loadingMessages.has(messageId)) return;

      // Check cache first
      const cached = getCachedTranslation(messageId, targetLang);
      if (cached) {
        setTranslatedMessages((prev) => new Map(prev).set(messageId, cached));
        return;
      }

      // Fetch
      setLoadingMessages((prev) => new Set(prev).add(messageId));
      setErrorMessages((prev) => {
        const next = new Map(prev);
        next.delete(messageId);
        return next;
      });

      try {
        const result = await getOrFetchTranslation(messageId, text, targetLang);
        setCachedTranslation(messageId, targetLang, result);
        setTranslatedMessages((prev) => new Map(prev).set(messageId, result));
      } catch (err) {
        setErrorMessages((prev) =>
          new Map(prev).set(messageId, err instanceof Error ? err.message : 'Translation failed'),
        );
      } finally {
        setLoadingMessages((prev) => {
          const next = new Set(prev);
          next.delete(messageId);
          return next;
        });
      }
    },
    [translatedMessages, loadingMessages],
  );

  const isTranslated = useCallback(
    (messageId: string) => translatedMessages.has(messageId),
    [translatedMessages],
  );

  const isLoading = useCallback(
    (messageId: string) => loadingMessages.has(messageId),
    [loadingMessages],
  );

  const getTranslatedText = useCallback(
    (messageId: string) => translatedMessages.get(messageId),
    [translatedMessages],
  );

  const getError = useCallback(
    (messageId: string) => errorMessages.get(messageId),
    [errorMessages],
  );

  return { toggleTranslation, isTranslated, isLoading, getTranslatedText, getError };
}
