import { Linkedin, Twitter, Github } from "lucide-react";
import { t } from "@/lib/translations";
import { useLanguage } from "@/contexts/LanguageContext";
import { getSystemPageSlug } from "@/lib/systemPageRoutes";

const Footer = () => {
  const { locale } = useLanguage();
  
  const getSystemPageUrl = (baseSlug: string) => {
    const localizedSlug = getSystemPageSlug(baseSlug, locale);
    return locale === 'en' ? `/${localizedSlug}` : `/${locale}/${localizedSlug}`;
  };

  const hubUrl = locale === 'br'
    ? '/br/artigos/web3-seo-guia-definitivo'
    : locale === 'es'
    ? '/es/articulos/web3-seo-guia-definitiva'
    : '/publications/definitive-guide-web3-seo';

  const hubLinkText = locale === 'br'
    ? 'Guia Completo de SEO Web3'
    : locale === 'es'
    ? 'Guía Completa de SEO Web3'
    : 'The Definitive Guide to Web3 SEO';

  const socialLinks = [
    {
      name: "LinkedIn",
      icon: Linkedin,
      url: "https://www.linkedin.com/in/mangabeira/",
    },
    {
      name: "Twitter",
      icon: Twitter,
      url: "https://x.com/manga82",
    },
    {
      name: "GitHub",
      icon: Github,
      url: "https://github.com/gmangabeira",
    },
  ];

  return (
    <footer className="bg-muted/30 border-t border-border">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          {/* Copyright and Privacy Policy */}
          <div className="text-sm text-muted-foreground text-center md:text-left max-w-2xl">
            <div>{t('footer', 'copyright_text', locale)} <a href="https://lovable.dev" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{t('footer', 'copyright_lovable', locale)}</a></div>
            <div className="mt-1 flex flex-wrap justify-center md:justify-start items-center gap-x-2 gap-y-1">
              <a
                href={getSystemPageUrl('privacy-policy')}
                className="text-muted-foreground hover:text-primary transition-colors underline"
              >
                {t('footer', 'privacy_policy', locale)}
              </a>
              <span className="text-muted-foreground opacity-50">·</span>
              <a
                href={hubUrl}
                className="text-muted-foreground hover:text-primary transition-colors underline"
              >
                {hubLinkText}
              </a>
            </div>
            <div className="mt-2 text-xs opacity-75">
              {t('footer', 'disclaimer', locale)}
            </div>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-4">
            {socialLinks.map((social) => {
              const Icon = social.icon;
              return (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-background border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-all duration-300 hover:scale-110"
                  aria-label={social.name}
                >
                  <Icon className="h-5 w-5" />
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
