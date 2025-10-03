import { useEffect, useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
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
    year: "2017–2022",
    role: "Russell Marketing (Growth Manager)",
    description: "Launched 40+ products and crowdfunding campaigns, raising $6M+.",
  },
  {
    year: "2020–2022",
    role: "Neil Patel Digital (SEO Consultant)",
    description: "Scaled NP Brasil to 1M+ monthly pageviews via SEO and content ops.",
  },
  {
    year: "2022–2023",
    role: "Binance LATAM (Growth Marketing Manager)",
    description: "Managed $1M+ media spend, reduced CAC by 20%, and scaled user communities.",
  },
  {
    year: "2023–2025",
    role: "Web3 Growth Consultant",
    description: "Designed GTM strategies, community funnels, and NFT activations for DeFi projects.",
  },
  {
    year: "2024–Present",
    role: "OPAScope (SEO/AEO Manager)",
    description: "Driving AI-powered organic growth with automation and search optimization.",
  },
];

const MyJourneySection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [trackProgress, setTrackProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current || !trackRef.current) return;

      const sectionRect = sectionRef.current.getBoundingClientRect();
      const sectionTop = sectionRect.top;
      const sectionHeight = sectionRect.height;
      const viewportHeight = window.innerHeight;

      // Calculate progress based on section visibility
      const scrollProgress = Math.max(
        0,
        Math.min(1, (viewportHeight - sectionTop) / (sectionHeight + viewportHeight))
      );

      setTrackProgress(scrollProgress * 100);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Initial check

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
      className={`milestone-item flex items-center gap-6 mb-10 ${
        isLeft ? "md:flex-row" : "md:flex-row-reverse"
      } flex-col opacity-0 translate-y-4 transition-all duration-500`}
    >
      {/* Card */}
      <Card
        className={`${
          isLeft ? "md:ml-auto md:mr-0 slide-from-left" : "md:mr-auto md:ml-0 slide-from-right"
        } w-full md:w-[calc(50%-2.5rem)] ripple-card transition-all duration-500 transform hover:-translate-y-1`}
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.95)",
          borderRadius: "1rem",
          boxShadow: "0 2px 12px rgba(0, 0, 0, 0.06)",
        }}
      >
        <CardContent className="p-4">
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-brand-orange font-bold text-2xl">{milestone.year}</span>
            <h3 className="font-bold text-foreground text-base leading-tight">{milestone.role}</h3>
          </div>
          <p className="text-muted-foreground text-sm leading-snug italic">{milestone.description}</p>
        </CardContent>
      </Card>

      {/* Timeline marker - splash effect */}
      <div className="relative flex-shrink-0 z-10">
        <div className="splash-marker w-16 h-16 rounded-full bg-gradient-to-br from-brand-orange to-brand-orange/80 border-3 border-white shadow-[0_0_15px_rgba(255,122,0,0.4)] flex items-center justify-center transition-all duration-500">
          <span className="text-white font-bold text-sm drop-shadow-md">{milestone.year}</span>
        </div>
      </div>

      {/* Spacer for other side */}
      <div className="w-[calc(50%-2.5rem)] hidden md:block" />
    </div>
  );

  return (
    <section
      ref={sectionRef}
      className="py-16 relative overflow-hidden"
      style={{
        backgroundColor: "#E8F4F8",
      }}
    >
      {/* Swimming pool lanes background */}
      <div
        className="absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage: `url(${poolOverhead})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />

      <div className="container mx-auto px-6 relative">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-3">
            My <span className="text-brand-orange">Journey</span>
          </h2>
          <p className="text-base text-muted-foreground max-w-3xl mx-auto">
            From Olympic lanes to digital growth — a career built on discipline and execution.
          </p>
        </div>

        {/* Timeline container */}
        <div className="relative max-w-5xl mx-auto">
          {/* Animated swim lane line (double line) */}
          <div
            ref={trackRef}
            className="absolute left-1/2 top-0 bottom-0 -translate-x-1/2 overflow-hidden hidden md:block"
            style={{ width: "6px" }}
          >
            {/* Double lane line effect */}
            <div className="absolute inset-0 flex gap-[2px]">
              <div className="flex-1 bg-muted/30" />
              <div className="flex-1 bg-muted/30" />
            </div>
            {/* Animated gradient line */}
            <div
              className="absolute top-0 left-0 right-0 transition-all duration-300 ease-out"
              style={{
                height: `${trackProgress}%`,
                background: "linear-gradient(180deg, #FF7A00 0%, #1a237e 100%)",
                boxShadow: "0 0 10px rgba(255,122,0,0.4), 0 0 20px rgba(255,122,0,0.2)",
              }}
            />
          </div>

          {/* Olympic Journey */}
          <div className="mb-12">
            <h3 className="text-xl font-bold text-foreground mb-8 flex items-center justify-center gap-2">
              <span className="text-2xl">🏊</span>
              <span>Olympic Journey</span>
            </h3>
            {olympicJourney.map((milestone, index) =>
              renderMilestone(milestone, index, index % 2 === 0)
            )}
          </div>

          {/* Professional Career Transition */}
          <div className="mb-12">
            <h3 className="text-xl font-bold text-foreground mb-8 flex items-center justify-center gap-2">
              <span className="text-2xl">💼</span>
              <span>Professional Career Transition</span>
            </h3>
            {professionalCareer.map((milestone, index) =>
              renderMilestone(milestone, index + olympicJourney.length, (index + olympicJourney.length) % 2 === 0)
            )}
          </div>

          {/* Finish Line - Podium Style */}
          <div className="flex flex-col items-center pt-6">
            <div className="relative">
              {/* Podium base */}
              <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-32 h-6 bg-gradient-to-b from-yellow-500/15 to-yellow-600/20 rounded-lg" 
                   style={{ boxShadow: "0 8px 20px rgba(234, 179, 8, 0.15)" }} />
              
              {/* Finish line marker - podium style */}
              <div className="podium-marker w-28 h-28 rounded-full bg-gradient-to-br from-yellow-400 via-brand-orange to-yellow-500 border-6 border-white shadow-[0_0_30px_rgba(255,122,0,0.5)] flex items-center justify-center mb-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
                <div className="text-center relative z-10">
                  <div className="text-white font-bold text-base drop-shadow-md">NOW</div>
                  <div className="text-white text-xs font-semibold drop-shadow-md">2024</div>
                </div>
                {/* Trophy icon effect */}
                <div className="absolute -top-0.5 -right-0.5 text-2xl">🏆</div>
              </div>
            </div>

            <h4 className="text-xl font-bold text-foreground mb-1.5">SEO/AEO Manager – OPAScope</h4>
            <p className="text-muted-foreground text-sm italic mb-6 text-center max-w-md">
              Driving AI-powered organic growth with automation and search optimization.
            </p>

            {/* Footer CTA */}
            <a
              href="/about"
              className="inline-block text-base font-semibold text-foreground hover:text-brand-orange transition-all duration-300 relative group px-5 py-2"
            >
              → Read my full story
              <span className="absolute bottom-1.5 left-5 w-0 h-[2px] bg-brand-orange transition-all duration-300 group-hover:w-[calc(100%-2.5rem)]" />
            </a>
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
          animation: splash-pulse 2.5s ease-in-out infinite;
        }

        @keyframes splash-pulse {
          0%, 100% {
            box-shadow: 0 0 15px rgba(255,122,0,0.4), 0 0 25px rgba(255,122,0,0.2);
            transform: scale(1);
          }
          50% {
            box-shadow: 0 0 20px rgba(255,122,0,0.5), 0 0 35px rgba(255,122,0,0.3);
            transform: scale(1.03);
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
