import { useLanguage } from './useLanguage';
import en from '@/translations/en.json';
import pt from '@/translations/pt.json';
import es from '@/translations/es.json';

const translations = { en, pt, es };

export const useTranslation = () => {
  const { language } = useLanguage();
  
  const t = (key: string): string => {
    const keys = key.split('.');
    let value: any = translations[language];
    
    for (const k of keys) {
      value = value?.[k];
      if (value === undefined) break;
    }
    
    return value || key;
  };
  
  return { t, language };
};
