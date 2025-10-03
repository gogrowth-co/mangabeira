import { useEffect, useRef } from "react";
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

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-fade-in");
          }
        });
      },
      { threshold: 0.1 }
    );

    const cards = sectionRef.current?.querySelectorAll(".timeline-card");
    cards?.forEach((card) => observer.observe(card));

    return () => observer.disconnect();
  }, []);

  const renderMilestone = (milestone: Milestone, index: number, isLast: boolean) => (
    <div key={`${milestone.year}-${index}`} className="timeline-card flex gap-6 mb-8 opacity-0">
      {/* Timeline marker column */}
      <div className="flex flex-col items-center flex-shrink-0">
        <div className="w-16 h-16 rounded-full bg-brand-orange/10 border-4 border-brand-orange flex items-center justify-center shadow-[0_0_12px_rgba(255,122,0,0.3)] transition-shadow duration-300 hover:shadow-[0_0_20px_rgba(255,122,0,0.5)]">
          <span className="text-brand-orange font-bold text-sm">{milestone.year}</span>
        </div>
        {!isLast && <div className="w-[2px] flex-1 bg-border mt-2" />}
      </div>

      {/* Card */}
      <Card className="flex-1 hover:shadow-lg transition-all duration-300 mb-8">
        <CardContent className="p-6">
          <h3 className="font-bold text-foreground text-lg mb-2">{milestone.role}</h3>
          <p className="text-muted-foreground leading-relaxed">{milestone.description}</p>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <section ref={sectionRef} className="py-24 bg-background">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            My <span className="text-brand-orange">Journey</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            From Olympic lanes to digital growth — a career built on discipline and execution.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Olympic Journey */}
          <div className="mb-16">
            <h3 className="text-2xl font-bold text-foreground mb-8 flex items-center gap-2">
              <span>🏊</span>
              <span>Olympic Journey</span>
            </h3>
            {olympicJourney.map((milestone, index) =>
              renderMilestone(milestone, index, index === olympicJourney.length - 1)
            )}
          </div>

          {/* Professional Career Transition */}
          <div>
            <h3 className="text-2xl font-bold text-foreground mb-8 flex items-center gap-2">
              <span>💼</span>
              <span>Professional Career Transition</span>
            </h3>
            {professionalCareer.map((milestone, index) =>
              renderMilestone(milestone, index, index === professionalCareer.length - 1)
            )}
          </div>
        </div>

        {/* Footer CTA */}
        <div className="text-center mt-16">
          <a
            href="/about"
            className="inline-block text-lg text-foreground hover:text-brand-orange transition-colors duration-300 relative group"
          >
            → Read my full story
            <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-brand-orange transition-all duration-300 group-hover:w-full" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default MyJourneySection;
