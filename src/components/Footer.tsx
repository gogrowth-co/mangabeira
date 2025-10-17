import { Linkedin, Twitter, Github } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

const Footer = () => {
  const { t } = useTranslation();
  
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
      name: "Medium",
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
            <div>© 2025 Gabriel Mangabeira. {t('footer.copyright')} <a href="https://lovable.dev/?via=gabriel-mangabeira" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">Lovable</a>.</div>
            <div className="mt-1">
              <a 
                href="/privacy-policy" 
                className="text-muted-foreground hover:text-primary transition-colors underline"
              >
                {t('footer.privacyPolicy')}
              </a>
            </div>
            <div className="mt-2 text-xs opacity-75">
              {t('footer.disclaimer')}
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
