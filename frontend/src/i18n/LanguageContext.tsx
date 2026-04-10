import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { translations, type Language } from './translations';

interface LanguageContextValue {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

function detectLanguage(): Language {
  const stored = localStorage.getItem('language') as Language | null;
  if (stored && translations[stored]) return stored;

  const browserLang = navigator.language.toLowerCase();
  if (browserLang.startsWith('ko')) return 'ko';
  if (browserLang.startsWith('zh')) {
    // Default to Simplified Chinese for zh-CN, zh-TW, zh-HK, zh-SG
    if (browserLang.includes('tw') || browserLang.includes('hk')) return 'zh-TW';
    return 'zh-CN';
  }
  return 'en';
}

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState<Language>(detectLanguage);

  const setLanguage = useCallback((lang: Language) => {
    localStorage.setItem('language', lang);
    setLanguageState(lang);
  }, []);

  const t = useCallback(
    (key: string): string => {
      return translations[language]?.[key] ?? translations.en[key] ?? key;
    },
    [language]
  );

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextValue => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
};
