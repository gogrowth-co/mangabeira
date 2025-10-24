import { Locale } from './translations';

export const systemPageRoutes = {
  'about': {
    en: 'about',
    br: 'sobre',
    es: 'acerca-de',
    title: {
      en: 'About Gabriel Mangabeira',
      br: 'Sobre Gabriel Mangabeira',
      es: 'Acerca de Gabriel Mangabeira'
    }
  },
  'privacy-policy': {
    en: 'privacy-policy',
    br: 'politica-de-privacidade',
    es: 'politica-de-privacidad',
    title: {
      en: 'Privacy Policy',
      br: 'Política de Privacidade',
      es: 'Política de Privacidad'
    }
  }
} as const;

export type SystemPageSlug = keyof typeof systemPageRoutes;

export function getSystemPageSlug(baseSlug: string, locale: Locale): string {
  const route = systemPageRoutes[baseSlug as SystemPageSlug];
  return route ? route[locale] : baseSlug;
}

export function getSystemPageTitle(baseSlug: string, locale: Locale): string {
  const route = systemPageRoutes[baseSlug as SystemPageSlug];
  return route ? route.title[locale] : '';
}

export function isSystemPageSlug(slug: string): boolean {
  return Object.keys(systemPageRoutes).includes(slug) || 
    Object.values(systemPageRoutes).some(route => 
      Object.values(route).includes(slug)
    );
}

export function getBaseSlugFromLocalized(localizedSlug: string): string | null {
  for (const [baseSlug, route] of Object.entries(systemPageRoutes)) {
    if (route.en === localizedSlug || route.br === localizedSlug || route.es === localizedSlug) {
      return baseSlug;
    }
  }
  return null;
}
