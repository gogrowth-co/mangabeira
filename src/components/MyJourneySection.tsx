import { useEffect, useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";

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
      className={`milestone-item flex items-center gap-8 mb-16 ${
        isLeft ? "md:flex-row" : "md:flex-row-reverse"
      } flex-col opacity-0 translate-y-8 transition-all duration-700`}
    >
      {/* Card */}
      <Card
        className={`${
          isLeft ? "md:ml-auto md:mr-0 slide-from-left" : "md:mr-auto md:ml-0 slide-from-right"
        } w-full md:w-[calc(50%-3rem)] hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1`}
      >
        <CardContent className="p-6">
          <div className="flex items-baseline gap-3 mb-3">
            <span className="text-brand-orange font-bold text-xl">{milestone.year}</span>
            <h3 className="font-bold text-foreground text-lg leading-tight">{milestone.role}</h3>
          </div>
          <p className="text-muted-foreground leading-relaxed italic">{milestone.description}</p>
        </CardContent>
      </Card>

      {/* Timeline marker */}
      <div className="relative flex-shrink-0 z-10">
        <div className="marker-pulse w-20 h-20 rounded-full bg-gradient-to-br from-brand-orange to-brand-orange/80 border-4 border-white shadow-[0_0_20px_rgba(255,122,0,0.6)] flex items-center justify-center transition-all duration-500">
          <span className="text-white font-bold text-base drop-shadow-lg">{milestone.year}</span>
        </div>
      </div>

      {/* Spacer for other side */}
      <div className="w-[calc(50%-3rem)] hidden md:block" />
    </div>
  );

  return (
    <section
      ref={sectionRef}
      className="py-24 relative overflow-hidden"
      style={{
        background: "linear-gradient(180deg, #FAFAFA 0%, #F5F5F5 100%)",
      }}
    >
      {/* Subtle track texture background */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage:
            "repeating-linear-gradient(90deg, transparent, transparent 50px, #000 50px, #000 52px)",
        }}
      />

      <div className="container mx-auto px-6 relative">
        {/* Header */}
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            My <span className="text-brand-orange">Journey</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            From Olympic lanes to digital growth — a career built on discipline and execution.
          </p>
        </div>

        {/* Timeline container */}
        <div className="relative max-w-5xl mx-auto">
          {/* Animated vertical track line */}
          <div
            ref={trackRef}
            className="absolute left-1/2 top-0 bottom-0 w-1 -translate-x-1/2 overflow-hidden hidden md:block"
          >
            {/* Base track with lane marks */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  "repeating-linear-gradient(0deg, rgba(17,24,39,0.1) 0px, rgba(17,24,39,0.1) 20px, transparent 20px, transparent 40px)",
              }}
            />
            {/* Animated gradient line */}
            <div
              className="absolute top-0 left-0 right-0 transition-all duration-300 ease-out"
              style={{
                height: `${trackProgress}%`,
                background: "linear-gradient(180deg, #FF7A00 0%, #1a237e 100%)",
                boxShadow: "0 0 10px rgba(255,122,0,0.5)",
              }}
            />
          </div>

          {/* Olympic Journey */}
          <div className="mb-20">
            <h3 className="text-2xl font-bold text-foreground mb-12 flex items-center justify-center gap-3">
              <span className="text-3xl">🏊</span>
              <span>Olympic Journey</span>
            </h3>
            {olympicJourney.map((milestone, index) =>
              renderMilestone(milestone, index, index % 2 === 0)
            )}
          </div>

          {/* Professional Career Transition */}
          <div className="mb-20">
            <h3 className="text-2xl font-bold text-foreground mb-12 flex items-center justify-center gap-3">
              <span className="text-3xl">💼</span>
              <span>Professional Career Transition</span>
            </h3>
            {professionalCareer.map((milestone, index) =>
              renderMilestone(milestone, index + olympicJourney.length, (index + olympicJourney.length) % 2 === 0)
            )}
          </div>

          {/* Finish Line */}
          <div className="flex flex-col items-center pt-8">
            <div className="relative">
              {/* Checkered finish line pattern */}
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-48 h-2 bg-gradient-to-r from-transparent via-foreground to-transparent opacity-20" />
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-48 h-2 flex">
                {[...Array(12)].map((_, i) => (
                  <div
                    key={i}
                    className={`flex-1 h-full ${i % 2 === 0 ? "bg-foreground" : "bg-white"} opacity-30`}
                  />
                ))}
              </div>

              {/* Final marker */}
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-brand-orange via-brand-orange to-yellow-500 border-8 border-white shadow-[0_0_40px_rgba(255,122,0,0.8)] flex items-center justify-center animate-pulse mb-6">
                <div className="text-center">
                  <div className="text-white font-bold text-sm drop-shadow-lg">NOW</div>
                  <div className="text-white text-xs font-semibold drop-shadow-lg">2024</div>
                </div>
              </div>
            </div>

            <h4 className="text-2xl font-bold text-foreground mb-2">OPAScope (SEO/AEO Manager)</h4>
            <p className="text-muted-foreground italic mb-8 text-center max-w-md">
              Driving AI-powered organic growth with automation and search optimization.
            </p>

            {/* Footer CTA */}
            <a
              href="/about"
              className="inline-block text-lg font-semibold text-foreground hover:text-brand-orange transition-all duration-300 relative group px-6 py-3"
            >
              → Read my full story
              <span className="absolute bottom-2 left-6 w-0 h-[2px] bg-brand-orange transition-all duration-300 group-hover:w-[calc(100%-3rem)]" />
            </a>
          </div>
        </div>
      </div>

      <style>{`
        .milestone-visible {
          opacity: 1 !important;
          transform: translateY(0) !important;
        }

        .marker-pulse {
          animation: marker-glow 2s ease-in-out infinite;
        }

        @keyframes marker-glow {
          0%, 100% {
            box-shadow: 0 0 20px rgba(255,122,0,0.6), 0 0 40px rgba(255,122,0,0.3);
          }
          50% {
            box-shadow: 0 0 30px rgba(255,122,0,0.8), 0 0 60px rgba(255,122,0,0.5);
          }
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
