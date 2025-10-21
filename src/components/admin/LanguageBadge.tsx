import { Badge } from '@/components/ui/badge';
import { Locale } from '@/lib/translations';

interface LanguageBadgeProps {
  language: Locale;
  hasTranslation: boolean;
  onClick?: () => void;
}

const FLAGS: Record<Locale, string> = {
  en: '🇺🇸',
  br: '🇧🇷',
  es: '🇪🇸',
};

const LABELS: Record<Locale, string> = {
  en: 'EN',
  br: 'BR',
  es: 'ES',
};

export function LanguageBadge({ language, hasTranslation, onClick }: LanguageBadgeProps) {
  return (
    <Badge
      variant={hasTranslation ? 'default' : 'outline'}
      className={`cursor-pointer ${hasTranslation ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-gray-200 text-gray-500'}`}
      onClick={onClick}
    >
      {FLAGS[language]} {LABELS[language]}
    </Badge>
  );
}
