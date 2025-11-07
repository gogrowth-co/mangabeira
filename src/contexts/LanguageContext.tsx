import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Locale, initTranslations, getLocaleFromPath, getPathForLocale, getPathForLocaleSync } from '@/lib/translations';

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  isLoading: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [locale, setLocaleState] = useState<Locale>(() => getLocaleFromPath(location.pathname));

  useEffect(() => {
    const loadTranslationsForLocale = async () => {
      setIsLoading(true);
      await initTranslations(locale);
      setIsLoading(false);
    };

    loadTranslationsForLocale();
  }, [locale]);

  useEffect(() => {
    // Update locale when route changes
    const newLocale = getLocaleFromPath(location.pathname);
    if (newLocale !== locale) {
      setLocaleState(newLocale);
    }
  }, [location.pathname]);

  const setLocale = async (newLocale: Locale) => {
    localStorage.setItem('preferred_language', newLocale);
    setLocaleState(newLocale);
    
    // Navigate to the new locale path
    const currentPath = location.pathname + location.search + location.hash;
    const newPath = await getPathForLocale(newLocale, currentPath);
    navigate(newPath);
  };

  return (
    <LanguageContext.Provider value={{ locale, setLocale, isLoading }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

export function detectBrowserLanguage(): Locale {
  const stored = localStorage.getItem('preferred_language');
  if (stored && ['en', 'br', 'es'].includes(stored)) {
    return stored as Locale;
  }
  
  const browserLang = navigator.language.toLowerCase();
  if (browserLang.startsWith('pt')) return 'br';
  if (browserLang.startsWith('es')) return 'es';
  
  return 'en';
}
