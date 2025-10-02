import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import binanceLogo from "@/assets/binance-logo.png";
import npDigitalLogo from "@/assets/np-digital-logo.png";
import cocaColaLogo from "@/assets/coca-cola-logo.png";

const caseStudies = [
  {
    id: 1,
    title: "Binance – Multi-Million Dollar Campaigns (LATAM)",
    logo: binanceLogo,
    challenge: "Binance needed to expand its presence in the highly competitive LATAM crypto market, navigating regulatory complexity and aggressive competitors.",
    solution: "Designed and executed multi-million-dollar paid media and performance campaigns, adapting messaging to local audiences while ensuring compliance.",
    result: "Generated 100M+ impressions and millions in ad spend managed, driving significant user acquisition across the region.",
    cta: "See Details",
    accent: "border-gold/20 hover:border-gold/40",
    hoverColor: "hover:shadow-gold/10",
    resultNumber: "100M+",
    resultText: "impressions generated"
  },
  {
    id: 2,
    title: "Neil Patel Brasil – SEO at Scale", 
    logo: npDigitalLogo,
    challenge: "Growing SEO presence in Brazil and LATAM required consistent strategy, execution, and scaling high-volume content.",
    solution: "Built and optimized a full-stack SEO/content operation, including keyword research, localized strategy, and scalable workflows.",
    result: "Reached 1M+ monthly readers, making Neil Patel Brasil one of the top marketing blogs in LATAM.",
    cta: "Read More",
    accent: "border-aqua/20 hover:border-aqua/40",
    hoverColor: "hover:shadow-aqua/10",
    resultNumber: "1M+",
    resultText: "monthly readers"
  },
  {
    id: 3,
    title: "Russell Marketing – Crowdfunding Success",
    logo: cocaColaLogo,
    challenge: "Entrepreneurs needed to launch and scale their products on Kickstarter and Indiegogo with global reach.",
    solution: "Developed and executed multi-channel campaigns covering acquisition, activation, and referral growth strategies.",
    result: "Helped raise $6M+ in crowdfunding for product launches.",
    cta: "Explore Work",
    accent: "border-accent-orange/20 hover:border-accent-orange/40", 
    hoverColor: "hover:shadow-accent-orange/10",
    resultNumber: "$6M+",
    resultText: "raised in crowdfunding"
  },
  {
    id: 4,
    title: "Coca-Cola & Powerade – Olympic Campaigns (LATAM)",
    logo: cocaColaLogo,
    challenge: "Activate Coca-Cola and Powerade's sponsorships during the Olympic Games, connecting with passionate LATAM audiences.",
    solution: "Designed and led campaigns that merged Olympic storytelling with brand messaging, driving engagement through digital-first activations.",
    result: "Delivered 50M+ impressions and boosted consumer engagement during the Games.",
    cta: "See Details",
    accent: "border-gold/20 hover:border-gold/40",
    hoverColor: "hover:shadow-gold/10",
    resultNumber: "50M+",
    resultText: "impressions delivered"
  }
];

const CaseStudiesSection = () => {
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
                if (prev[1] < 100000000) {
                  return { ...prev, 1: prev[1] + 5000000 };
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
                if (prev[3] < 6000000) {
                  return { ...prev, 3: prev[3] + 300000 };
                }
                clearInterval(interval3);
                return prev;
              });
            }, 25);
          }, 900);

          setTimeout(() => {
            const interval4 = setInterval(() => {
              setAnimatedNumbers(prev => {
                if (prev[4] < 50000000) {
                  return { ...prev, 4: prev[4] + 2500000 };
                }
                clearInterval(interval4);
                return prev;
              });
            }, 20);
          }, 1100);
        }
      },
      { threshold: 0.3 }
    );

    const section = document.getElementById('case-studies-section');
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
      id="case-studies-section"
      className="py-24 bg-gradient-to-b from-background to-muted/20"
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-hero font-bold text-foreground mb-6">
            Proven Growth in Action
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            From startups to global brands, here's how I've applied growth strategies to deliver measurable results.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {caseStudies.map((study, index) => (
            <Card 
              key={study.id}
              className={`
                h-full flex flex-col
                transition-all duration-500 hover:scale-105 cursor-pointer
                ${study.accent} ${study.hoverColor}
                ${isVisible ? 'animate-fade-in opacity-100' : 'opacity-0'}
                group border-2 hover:shadow-2xl
              `}
              style={{ 
                animationDelay: `${index * 200}ms`,
                animationFillMode: 'forwards'
              }}
            >
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 mx-auto mb-4 rounded-lg bg-background/80 p-3 transition-all duration-300 group-hover:bg-background">
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
                    <h4 className="font-semibold text-primary mb-2">Challenge:</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">{study.challenge}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-primary mb-2">Solution:</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">{study.solution}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-primary mb-2">Result:</h4>
                    <div className="text-center p-4 bg-primary/5 rounded-lg">
                      <div className="text-3xl font-bold text-primary mb-2">
                        {formatNumber(animatedNumbers[study.id], study.id)}
                      </div>
                      <p className="text-xs text-muted-foreground leading-tight">{study.resultText}</p>
                    </div>
                  </div>
                </div>
                
                <Button 
                  variant="outline" 
                  className="w-full mt-6 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300"
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

export default CaseStudiesSection;