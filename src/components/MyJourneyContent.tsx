import { useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import poolOverhead from "@/assets/pool-overhead.png";

interface Milestone {
  year: string;
  role: string;
  description: string;
}

const olympicJourney: Milestone[] = [
  {
    year: "1999",
    role: "Brazilian National Team",
    description: "Selected to represent Brazil internationally.",
  },
  {
    year: "2004",
    role: "Athens Olympic Games",
    description: "Competed as an Olympian on the world stage.",
  },
  {
    year: "2008",
    role: "Beijing Olympic Games",
    description: "Represented Brazil at a second Olympic Games.",
  },
];

const professionalCareer: Milestone[] = [
  {
    year: "2014",
    role: "Coca-Cola (Engagement & Activation)",
    description: "Managed athlete relations and consumer experiences during Rio 2016 build-up.",
  },
  {
    year: "2016",
    role: "Powerade Olympic Ambassador Program",
    description: "Designed and implemented Olympic sponsorship activations.",
  },
  {
    year: "2017",
    role: "Russell Marketing (Growth Manager)",
    description: "Launched 40+ products and crowdfunding campaigns, raising $6M+.",
  },
  {
    year: "2020",
    role: "Neil Patel Digital (SEO Consultant)",
    description: "Scaled NP Brasil to 1M+ monthly pageviews via SEO and content ops.",
  },
  {
    year: "2022",
    role: "Binance LATAM (Growth Marketing Manager)",
    description: "Managed $1M+ media spend, reduced CAC by 20%, and scaled user communities.",
  },
  {
    year: "2023",
    role: "Web3 Growth Consultant",
    description: "Designed GTM strategies, community funnels, and NFT activations for DeFi projects.",
  },
  {
    year: "2025",
    role: "OPAScope (SEO/AEO Manager)",
    description: "Driving AI-powered organic growth with automation and search optimization.",
  },
];

const MyJourneySection = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("milestone-visible");
          }
        });
      },
      { threshold: 0.2 }
    );

    const milestones = sectionRef.current?.querySelectorAll(".milestone-item");
    milestones?.forEach((milestone) => observer.observe(milestone));

    return () => observer.disconnect();
  }, []);

  const allMilestones = [...olympicJourney, ...professionalCareer];

  const renderMilestone = (milestone: Milestone, index: number, isLeft: boolean) => (
    <div
      key={`${milestone.year}-${index}`}
      className={`milestone-item flex items-center gap-6 mb-6 ${
        isLeft ? "md:flex-row" : "md:flex-row-reverse"
      } flex-col opacity-0 translate-y-4 transition-all duration-500`}
    >
      {/* Card */}
      <Card
        className={`${
          isLeft ? "md:ml-auto md:mr-0 slide-from-left" : "md:mr-auto md:ml-0 slide-from-right"
        } w-full md:w-[calc(50%-2.5rem)] ripple-card transition-all duration-500 transform hover:-translate-y-1 border border-border/50`}
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.98)",
          borderRadius: "1.25rem",
          boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
        }}
      >
        <CardContent className="p-5">
          <div className="flex items-start gap-3 mb-3">
            <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-brand-orange/10 flex items-center justify-center">
              <span className="text-brand-orange font-bold text-lg">{milestone.year}</span>
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-foreground text-base leading-tight mb-2">{milestone.role}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{milestone.description}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Timeline marker */}
      <div className="relative flex-shrink-0 z-10">
        <div className="splash-marker w-14 h-14 rounded-full bg-white border-[3px] border-brand-orange shadow-[0_2px_8px_rgba(255,122,0,0.2)] flex items-center justify-center transition-all duration-500">
          <span className="text-brand-orange font-bold text-xs">{milestone.year}</span>
        </div>
      </div>

      {/* Spacer for other side */}
      <div className="w-[calc(50%-2.5rem)] hidden md:block" />
    </div>
  );

  return (
    <section
      ref={sectionRef}
      className="py-8 md:py-9 lg:py-10 relative overflow-hidden bg-[#F7FAFC]"
    >
      {/* Subtle top separator */}
      <div className="absolute top-0 left-0 right-0 h-[120px] bg-gradient-to-b from-[rgba(10,31,52,0.06)] to-transparent pointer-events-none z-10"></div>
      
      {/* Swimming pool lanes background at 2% opacity */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `url(${poolOverhead})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />

      <div className="container mx-auto px-6 md:px-4 relative">
        {/* Header */}
        <div className="text-center mb-4 md:mb-5 lg:mb-6">
          <h2 className="font-bold mb-3 md:mb-1.5 lg:mb-2" style={{ fontSize: 'clamp(32px, 3.5vw, 36px)', lineHeight: '1.2', fontWeight: 800, color: '#1A202C' }}>
            My Journey
          </h2>
          <p className="font-bold max-w-2xl mx-auto mb-2" style={{ fontSize: '18px', fontWeight: 600, color: '#1A202C' }}>
            From Olympic Discipline to Digital Growth Leadership
          </p>
          <p className="font-body max-w-2xl mx-auto" style={{ fontSize: '16px', fontWeight: 500, color: '#2D3748' }}>
            A timeline of milestones shaping my approach to performance and innovation.
          </p>
        </div>

        {/* Timeline container */}
        <div className="relative max-w-5xl mx-auto">

          {/* Olympic Journey */}
          <div className="mb-8 relative">
            {/* Static connecting line for Olympic journey - stops between circles */}
            <div className="absolute left-1/2 -translate-x-1/2 hidden md:block" 
                 style={{ 
                   top: "72px",
                   height: "calc(100% - 144px)",
                   width: "4px",
                   background: "linear-gradient(180deg, #FF7A00 0%, #1a237e 100%)",
                 }} 
            />
            
            <h3 className="text-lg font-bold text-foreground mb-5 flex items-center justify-center gap-2">
              <span className="text-xl">🏊</span>
              <span>Olympic Journey</span>
            </h3>
            {olympicJourney.map((milestone, index) =>
              renderMilestone(milestone, index, index % 2 === 0)
            )}
          </div>

          {/* Professional Career Transition */}
          <div className="mb-8 relative">
            {/* Static connecting line for Professional career - stops between circles */}
            <div className="absolute left-1/2 -translate-x-1/2 hidden md:block" 
                 style={{ 
                   top: "72px",
                   height: "calc(100% - 144px)",
                   width: "4px",
                   background: "linear-gradient(180deg, #FF7A00 0%, #1a237e 100%)",
                 }} 
            />
            
            <h3 className="text-lg font-bold text-foreground mb-5 flex items-center justify-center gap-2">
              <span className="text-xl">💼</span>
              <span>Professional Career Transition</span>
            </h3>
            {professionalCareer.map((milestone, index) =>
              renderMilestone(milestone, index + olympicJourney.length, (index + olympicJourney.length) % 2 === 0)
            )}
          </div>

          {/* CTA */}
          <div className="flex flex-col items-center pt-6">
            <Button 
              asChild
              size="lg"
              className="text-white font-semibold transition-all duration-300 hover:-translate-y-0.5"
              style={{
                background: 'linear-gradient(90deg, #FF8C1A 0%, #FFB347 100%)',
                borderRadius: '6px',
                fontWeight: 600,
                boxShadow: '0 4px 8px rgba(255, 140, 26, 0.2)',
              }}
              onMouseEnter={(e: any) => {
                e.currentTarget.style.boxShadow = '0 6px 12px rgba(255, 140, 26, 0.3)';
              }}
              onMouseLeave={(e: any) => {
                e.currentTarget.style.boxShadow = '0 4px 8px rgba(255, 140, 26, 0.2)';
              }}
            >
              <a href="/about">
                Read my full story →
              </a>
            </Button>
          </div>
        </div>
      </div>

      <style>{`
        .milestone-visible {
          opacity: 1 !important;
          transform: translateY(0) !important;
        }

        /* Splash marker pulse effect */
        .splash-marker {
          animation: splash-pulse 3s ease-in-out infinite;
        }

        @keyframes splash-pulse {
          0%, 100% {
            box-shadow: 0 2px 6px rgba(255,122,61,0.15);
            transform: scale(1);
          }
          50% {
            box-shadow: 0 2px 10px rgba(255,122,61,0.2);
            transform: scale(1.02);
          }
        }

        /* Podium marker animation */
        .podium-marker {
          animation: podium-glow 3s ease-in-out infinite;
        }

        @keyframes podium-glow {
          0%, 100% {
            box-shadow: 0 0 30px rgba(255,122,0,0.5), 0 0 50px rgba(234,179,8,0.3);
          }
          50% {
            box-shadow: 0 0 40px rgba(255,122,0,0.6), 0 0 70px rgba(234,179,8,0.4);
          }
        }

        /* Ripple card hover effect */
        .ripple-card {
          position: relative;
          overflow: hidden;
        }

        .ripple-card::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 0;
          height: 0;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(255,122,0,0.1) 0%, transparent 70%);
          transform: translate(-50%, -50%);
          transition: width 0.6s ease-out, height 0.6s ease-out;
        }

        .ripple-card:hover::before {
          width: 300%;
          height: 300%;
        }

        .slide-from-left {
          transform: translateX(-20px);
        }

        .slide-from-right {
          transform: translateX(20px);
        }

        .milestone-visible .slide-from-left,
        .milestone-visible .slide-from-right {
          transform: translateX(0);
        }
      `}</style>
    </section>
  );
};

export default MyJourneySection;
