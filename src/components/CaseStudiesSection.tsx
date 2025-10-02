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
    challenge: "Expanding Binance's presence in the highly competitive LATAM Web3 market.",
    solution: "Led multi-million-dollar paid media and performance campaigns, scaling growth while navigating regulatory challenges.",
    result: "✅ Managed millions in ad spend and drove large-scale user acquisition across LATAM.",
    cta: "See Details",
    accent: "border-gold/20 hover:border-gold/40",
    hoverColor: "hover:shadow-gold/10",
    resultNumber: "Millions",
    resultText: "in ad spend managed"
  },
  {
    id: 2,
    title: "Neil Patel Brasil – SEO at Scale", 
    logo: npDigitalLogo,
    challenge: "Expanding SEO reach in Brazil and LATAM.",
    solution: "Designed and optimized large-scale SEO and content operations.",
    result: "✅ Achieved 1M+ monthly readers and helped establish Neil Patel Brasil as a top regional marketing authority.",
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
    challenge: "Helping entrepreneurs launch and scale their products through crowdfunding.",
    solution: "Managed multi-channel growth campaigns across acquisition, activation, and referral strategies.",
    result: "✅ Generated $6M+ raised in crowdfunding campaigns across diverse industries.",
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
    challenge: "Activating Coca-Cola and Powerade sponsorships during the Olympic Games for the LATAM audience.",
    solution: "Designed and executed marketing strategies that connected sports passion with brand storytelling.",
    result: "✅ Delivered millions of impressions and high engagement across Olympic-themed campaigns in LATAM.",
    cta: "See Details",
    accent: "border-gold/20 hover:border-gold/40",
    hoverColor: "hover:shadow-gold/10",
    resultNumber: "Millions",
    resultText: "of impressions delivered"
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
                if (prev[1] < 100) {
                  return { ...prev, 1: prev[1] + 5 };
                }
                clearInterval(interval1);
                return prev;
              });
            }, 30);
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
                if (prev[4] < 100) {
                  return { ...prev, 4: prev[4] + 5 };
                }
                clearInterval(interval4);
                return prev;
              });
            }, 30);
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
    if (caseId === 1) return "Millions";
    if (caseId === 2) return `${(num / 1000000).toFixed(1)}M+`;
    if (caseId === 3) return `$${(num / 1000000).toFixed(1)}M+`;
    if (caseId === 4) return "Millions";
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
              
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold text-primary mb-2">Challenge:</h4>
                  <p className="text-sm text-muted-foreground">{study.challenge}</p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-primary mb-2">Solution:</h4>
                  <p className="text-sm text-muted-foreground">{study.solution}</p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-primary mb-2">Result:</h4>
                  <div className="text-center p-4 bg-primary/5 rounded-lg">
                    <div className="text-3xl font-bold text-primary mb-1">
                      {formatNumber(animatedNumbers[study.id], study.id)}
                    </div>
                    <p className="text-sm text-muted-foreground">{study.resultText}</p>
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