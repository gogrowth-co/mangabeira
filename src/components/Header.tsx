import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, X, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate, useLocation } from "react-router-dom";

const navItems = [
  { label: "About", href: "#about" },
  { label: "Methods", href: "#methods" },
  { label: "Case Studies", href: "#case-studies" },
  { label: "Tools", href: "#tools" },
  { label: "Publications", href: "#publications" },
  { label: "Contact", href: "#contact" },
];

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isPastHero, setIsPastHero] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsScrolled(scrollY > 40);
      // Reveal header after scrolling past hero (95vh)
      setIsPastHero(scrollY > window.innerHeight * 0.95);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Intersection Observer for active section detection
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

    // Observe all sections
    navItems.forEach((item) => {
      const element = document.querySelector(item.href);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  const handleNavClick = (href: string) => {
    setIsMobileMenuOpen(false);
    
    // If not on home page, navigate to home page with hash
    if (location.pathname !== "/") {
      navigate(`/${href}`);
    } else {
      // If on home page, scroll to section
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  const handleLogoClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      {/* Header */}
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-40 transition-all duration-150",
          isPastHero
            ? "translate-y-0 opacity-100 bg-background/95 backdrop-blur-sm shadow-sm border-b border-border"
            : "-translate-y-full opacity-0 bg-transparent"
        )}
      >
        <div className="max-w-7xl mx-auto px-3 md:px-6 h-14 md:h-16 flex items-center justify-between">
          {/* Logo/Brand */}
          <button
            onClick={handleLogoClick}
            className="font-hero font-semibold text-lg md:text-xl text-foreground hover:text-primary transition-colors"
            aria-label="Scroll to top"
          >
            Gabriel Mangabeira
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-7" aria-label="Main navigation">
            {navItems.map((item) => (
              <button
                key={item.href}
                onClick={() => handleNavClick(item.href)}
                className={cn(
                  "text-sm font-medium transition-all duration-200 relative group",
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

          {/* Desktop CTA */}
          <Button
            size="sm"
            className="hidden md:flex bg-gradient-cta text-white hover:brightness-110 transition-all"
            onClick={() => window.open('https://calendly.com/gabriel-mangabeira/15min', '_blank')}
          >
            Work With Me
            <ArrowRight className="ml-1 h-4 w-4" />
          </Button>

          {/* Mobile Menu */}
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button
                variant="ghost"
                size="icon"
                aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
              >
                {isMobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </Button>
            </SheetTrigger>

            <SheetContent side="right" className="w-full sm:w-80 flex flex-col">
              <nav className="flex flex-col gap-1 mt-8" aria-label="Mobile navigation">
                {navItems.map((item) => (
                  <button
                    key={item.href}
                    onClick={() => handleNavClick(item.href)}
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

              {/* Mobile CTA */}
              <div className="mt-auto pb-6">
                <Button
                  className="w-full bg-gradient-cta text-white hover:brightness-110"
                  onClick={() => window.open('https://calendly.com/gabriel-mangabeira/15min', '_blank')}
                >
                  Work With Me
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
