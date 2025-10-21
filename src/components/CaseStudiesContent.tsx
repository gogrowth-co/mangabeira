import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import binanceLogo from "@/assets/binance-logo.png";
import npDigitalLogo from "@/assets/np-digital-logo.png";
import cocaColaLogo from "@/assets/coca-cola-logo.png";
import russellMarketingLogo from "@/assets/russell-marketing-logo.png";
import { Locale, t } from "@/lib/translations";

interface CaseStudiesContentProps {
  locale: Locale;
}

const getCaseStudies = (locale: Locale) => [
  {
    id: 1,
    title: t('case_studies', 'binance_title', locale),
    logo: binanceLogo,
    challenge: t('case_studies', 'binance_challenge', locale),
    approach: t('case_studies', 'binance_approach', locale),
    impact: t('case_studies', 'binance_impact', locale),
    cta: t('case_studies', 'binance_cta', locale),
    accent: "border-accent-orange/20 hover:border-accent-orange/40",
    hoverColor: "hover:shadow-accent-orange/10",
    resultNumber: t('case_studies', 'binance_result_number', locale),
    resultText: t('case_studies', 'binance_result_text', locale)
  },
  {
    id: 2,
    title: t('case_studies', 'np_title', locale),
    logo: npDigitalLogo,
    challenge: t('case_studies', 'np_challenge', locale),
    approach: t('case_studies', 'np_approach', locale),
    impact: t('case_studies', 'np_impact', locale),
    cta: t('case_studies', 'np_cta', locale),
    accent: "border-accent-orange/20 hover:border-accent-orange/40",
    hoverColor: "hover:shadow-accent-orange/10",
    resultNumber: t('case_studies', 'np_result_number', locale),
    resultText: t('case_studies', 'np_result_text', locale)
  },
  {
    id: 3,
    title: t('case_studies', 'russell_title', locale),
    logo: russellMarketingLogo,
    challenge: t('case_studies', 'russell_challenge', locale),
    approach: t('case_studies', 'russell_approach', locale),
    impact: t('case_studies', 'russell_impact', locale),
    cta: t('case_studies', 'russell_cta', locale),
    accent: "border-accent-orange/20 hover:border-accent-orange/40", 
    hoverColor: "hover:shadow-accent-orange/10",
    resultNumber: t('case_studies', 'russell_result_number', locale),
    resultText: t('case_studies', 'russell_result_text', locale)
  },
  {
    id: 4,
    title: t('case_studies', 'coca_cola_title', locale),
    logo: cocaColaLogo,
    challenge: t('case_studies', 'coca_cola_challenge', locale),
    approach: t('case_studies', 'coca_cola_approach', locale),
    impact: t('case_studies', 'coca_cola_impact', locale),
    cta: t('case_studies', 'coca_cola_cta', locale),
    accent: "border-accent-orange/20 hover:border-accent-orange/40",
    hoverColor: "hover:shadow-accent-orange/10",
    resultNumber: t('case_studies', 'coca_cola_result_number', locale),
    resultText: t('case_studies', 'coca_cola_result_text', locale)
  }
];

const CaseStudiesContent = ({ locale }: CaseStudiesContentProps) => {
  const caseStudies = getCaseStudies(locale);
  const [animatedNumbers, setAnimatedNumbers] = useState({
    1: 0,
    2: 0, 
    3: 0,
    4: 0
  });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
          
          // Animate numbers
          setTimeout(() => {
            const interval1 = setInterval(() => {
              setAnimatedNumbers(prev => {
                if (prev[1] < 7000000) {
                  return { ...prev, 1: prev[1] + 350000 };
                }
                clearInterval(interval1);
                return prev;
              });
            }, 20);
          }, 500);

          setTimeout(() => {
            const interval2 = setInterval(() => {
              setAnimatedNumbers(prev => {
                if (prev[2] < 1000000) {
                  return { ...prev, 2: prev[2] + 50000 };
                }
                clearInterval(interval2);
                return prev;
              });
            }, 20);
          }, 700);

          setTimeout(() => {
            const interval3 = setInterval(() => {
              setAnimatedNumbers(prev => {
                if (prev[3] < 6300000) {
                  return { ...prev, 3: prev[3] + 315000 };
                }
                clearInterval(interval3);
                return prev;
              });
            }, 25);
          }, 900);

          setTimeout(() => {
            const interval4 = setInterval(() => {
              setAnimatedNumbers(prev => {
                if (prev[4] < 10000000) {
                  return { ...prev, 4: prev[4] + 500000 };
                }
                clearInterval(interval4);
                return prev;
              });
            }, 20);
          }, 1100);
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    const section = document.getElementById('case-studies');
    if (section) observer.observe(section);

    return () => observer.disconnect();
  }, [isVisible]);

  const formatNumber = (num: number, caseId: number) => {
    if (caseId === 1) return `${(num / 1000000).toFixed(0)}M+`;
    if (caseId === 2) return `${(num / 1000000).toFixed(1)}M+`;
    if (caseId === 3) return `$${(num / 1000000).toFixed(1)}M+`;
    if (caseId === 4) return `${(num / 1000000).toFixed(0)}M+`;
    return num.toString();
  };

  return (
    <section 
      id="case-studies"
      className="py-8 md:py-9 lg:py-10 bg-[#EFF6FA] relative"
    >
      {/* Subtle top separator */}
      <div className="absolute top-0 left-0 right-0 h-[120px] bg-gradient-to-b from-[rgba(10,31,52,0.06)] to-transparent pointer-events-none"></div>
      
      <div className="container mx-auto px-6 md:px-4">
        <div className="text-center mb-4 md:mb-5 lg:mb-6">
          <h2 className="font-bold mb-3 md:mb-1.5 lg:mb-2" style={{ fontSize: 'clamp(32px, 3.5vw, 36px)', lineHeight: '1.2', fontWeight: 800, color: '#1A202C' }}>
            {t('case_studies', 'section_title', locale)}
          </h2>
          <p className="font-body max-w-3xl mx-auto" style={{ fontSize: '16px', fontWeight: 500, color: '#2D3748' }}>
            {t('case_studies', 'section_subtitle', locale)}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-6 lg:gap-6 max-w-7xl mx-auto">
          {caseStudies.map((study, index) => (
            <Card 
              key={study.id}
              className={`
                h-full flex flex-col
                transition-all duration-500 hover:scale-105 cursor-pointer
                ${study.accent} ${study.hoverColor}
                ${isVisible ? 'animate-fade-in opacity-100' : 'opacity-0'}
                group border border-border
              `}
              style={{ 
                animationDelay: `${index * 200}ms`,
                animationFillMode: 'forwards',
                borderRadius: '18px',
                boxShadow: '0 6px 24px rgba(15, 23, 42, 0.08)'
              }}
            >
              <CardHeader className="text-center pb-4">
                <div className="w-20 h-20 mx-auto mb-4 rounded-lg bg-background/80 p-3 transition-all duration-300 group-hover:bg-background">
                  <img 
                    src={study.logo} 
                    alt={`${study.title} logo`}
                    className="w-full h-full object-contain grayscale group-hover:grayscale-0 transition-all duration-300"
                  />
                </div>
                <CardTitle className="text-xl font-bold text-foreground">
                  {study.title}
                </CardTitle>
              </CardHeader>
              
              <CardContent className="flex-1 flex flex-col">
                <div className="space-y-5 flex-1">
                  <div>
                    <h4 className="font-semibold text-primary mb-2">{t('case_studies', 'label_challenge', locale)}</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">{study.challenge}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-primary mb-2">{t('case_studies', 'label_approach', locale)}</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">{study.approach}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-primary mb-2">{t('case_studies', 'label_impact', locale)}</h4>
                    <div className="text-center p-4 bg-primary/5 rounded-lg">
                      <div className="text-3xl font-bold text-primary mb-2">
                        {formatNumber(animatedNumbers[study.id], study.id)}
                      </div>
                      <p className="text-xs text-muted-foreground leading-tight">{study.resultText}</p>
                    </div>
                  </div>
                </div>
                
                <Button 
                  className="w-full mt-6 text-white transition-all duration-300 hover:-translate-y-0.5"
                  style={{
                    background: 'linear-gradient(90deg, #FF8C1A 0%, #FFB347 100%)',
                    borderRadius: '6px',
                    fontWeight: 600,
                    boxShadow: '0 4px 8px rgba(255, 140, 26, 0.2)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = '0 6px 12px rgba(255, 140, 26, 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = '0 4px 8px rgba(255, 140, 26, 0.2)';
                  }}
                >
                  {study.cta}
                  <ExternalLink className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CaseStudiesContent;
