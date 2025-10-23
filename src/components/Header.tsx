import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, X, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate, useLocation } from "react-router-dom";
import { Locale, t, getPathForLocale } from "@/lib/translations";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface HeaderProps {
  locale: Locale;
}

const Header = ({ locale }: HeaderProps) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isPastHero, setIsPastHero] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { setLocale } = useLanguage();

  const publicationsPath = locale === 'en' ? '/publications' : locale === 'br' ? '/br/artigos' : '/es/articulos';
  
  const navItems = [
    { label: t('header', 'nav_about', locale), href: "#about" },
    { label: t('header', 'nav_methods', locale), href: "#methods" },
    { label: t('header', 'nav_case_studies', locale), href: "#case-studies" },
    { label: t('header', 'nav_tools', locale), href: "#tools" },
    { label: t('header', 'nav_publications', locale), href: publicationsPath, isExternal: true },
    { label: t('header', 'nav_contact', locale), href: "#contact" },
  ];

  // Scroll to top when locale changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
    setIsPastHero(false);
  }, [locale]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsScrolled(scrollY > 40);
      setIsPastHero(scrollY > window.innerHeight * 0.95);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "-20% 0px -70% 0px",
      threshold: 0,
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(`#${entry.target.id}`);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    navItems.forEach((item) => {
      // Only observe hash links (section anchors), not external routes
      if (!item.isExternal) {
        const element = document.querySelector(item.href);
        if (element) observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, [locale]);

  const handleNavClick = (href: string, isExternal?: boolean) => {
    setIsMobileMenuOpen(false);
    
    if (isExternal) {
      navigate(href);
      return;
    }
    
    const isHomePage = location.pathname === '/' || location.pathname === '/br' || location.pathname === '/es';
    
    if (!isHomePage) {
      navigate(getPathForLocale(locale, `/${href}`));
    } else {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  const handleLogoClick = () => {
    const isHomePage = location.pathname === '/' || location.pathname === '/br' || location.pathname === '/es';
    
    if (!isHomePage) {
      navigate(getPathForLocale(locale, '/'));
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleLanguageChange = (newLocale: Locale) => {
    setLocale(newLocale);
  };

  const isHomePage = location.pathname === '/' || location.pathname === '/br' || location.pathname === '/es';

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-40 transition-all duration-150",
          !isHomePage || isPastHero
            ? "translate-y-0 opacity-100 bg-background/95 backdrop-blur-sm shadow-sm border-b border-border"
            : "-translate-y-full opacity-0 bg-transparent"
        )}
      >
        <div className="max-w-7xl mx-auto px-3 md:px-6 h-14 md:h-16 flex items-center justify-between gap-4">
          {/* Logo/Brand */}
          <button
            onClick={handleLogoClick}
            className="font-hero font-semibold text-lg md:text-xl text-foreground hover:text-primary transition-colors shrink-0"
            aria-label={t('header', 'aria_scroll_to_top', locale)}
          >
            {t('header', 'brand_name', locale)}
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-4 xl:gap-6" aria-label="Main navigation">
            {navItems.map((item) => (
              <button
                key={item.href}
                onClick={() => handleNavClick(item.href, item.isExternal)}
                className={cn(
                  "text-sm font-medium transition-all duration-200 relative group whitespace-nowrap",
                  activeSection === item.href
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {item.label}
                <span
                  className={cn(
                    "absolute -bottom-1 left-0 h-0.5 bg-primary transition-all duration-200",
                    activeSection === item.href ? "w-full" : "w-0 group-hover:w-full"
                  )}
                />
              </button>
            ))}
          </nav>

          {/* Language Toggle & CTA - Desktop */}
          <div className="hidden md:flex items-center gap-3">
            {/* Language Dropdown */}
            <Select value={locale} onValueChange={(value: Locale) => handleLanguageChange(value)}>
              <SelectTrigger className="w-[72px] bg-background border-border">
                <SelectValue>
                  {locale === 'en' ? 'EN' : locale === 'br' ? 'BR' : 'ES'}
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="bg-background border-border z-50">
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="br">Português</SelectItem>
                <SelectItem value="es">Español</SelectItem>
              </SelectContent>
            </Select>

            <Button
              size="sm"
              className="bg-gradient-cta text-white hover:brightness-110 transition-all shrink-0"
              onClick={() => window.open('https://calendly.com/gabriel-mangabeira/15min', '_blank')}
            >
              {t('header', 'cta_work_with_me', locale)}
              <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </div>

          {/* Mobile Menu */}
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button
                variant="ghost"
                size="icon"
                aria-label={isMobileMenuOpen ? t('header', 'aria_close_menu', locale) : t('header', 'aria_open_menu', locale)}
              >
                {isMobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </Button>
            </SheetTrigger>

            <SheetContent side="right" className="w-full sm:w-80 flex flex-col">
              {/* Language Dropdown - Mobile */}
              <div className="mt-4 mb-6">
                <Select value={locale} onValueChange={(value: Locale) => handleLanguageChange(value)}>
                  <SelectTrigger className="w-full bg-background border-border">
                    <SelectValue>
                      {locale === 'en' ? 'EN' : locale === 'br' ? 'BR' : 'ES'}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent className="bg-background border-border z-50">
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="br">Português</SelectItem>
                    <SelectItem value="es">Español</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <nav className="flex flex-col gap-1" aria-label="Mobile navigation">
                {navItems.map((item) => (
                  <button
                    key={item.href}
                    onClick={() => handleNavClick(item.href, item.isExternal)}
                    className={cn(
                      "text-left px-4 py-3 rounded-lg text-base font-medium transition-colors",
                      activeSection === item.href
                        ? "bg-primary/10 text-primary"
                        : "text-foreground hover:bg-muted"
                    )}
                  >
                    {item.label}
                  </button>
                ))}
              </nav>

              <div className="mt-auto pb-6">
                <Button
                  className="w-full bg-gradient-cta text-white hover:brightness-110"
                  onClick={() => window.open('https://calendly.com/gabriel-mangabeira/15min', '_blank')}
                >
                  {t('header', 'cta_work_with_me', locale)}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>
    </>
  );
};

export default Header;
