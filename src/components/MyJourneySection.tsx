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

  const renderMilestone = (milestone: Milestone, index: number, isLeft: boolean) => (
    <div
      key={`${milestone.year}-${index}`}
      className={`timeline-card flex items-center gap-8 mb-16 opacity-0 ${
        isLeft ? "md:flex-row" : "md:flex-row-reverse"
      } flex-col`}
    >
      {/* Card */}
      <Card
        className={`${
          isLeft ? "md:ml-auto md:mr-0" : "md:mr-auto md:ml-0"
        } w-full md:w-[calc(50%-2rem)] hover:shadow-lg transition-all duration-300`}
      >
        <CardContent className="p-6">
          <div className="flex items-baseline gap-3 mb-2">
            <span className="text-brand-orange font-bold text-lg">{milestone.year}</span>
            <h3 className="font-bold text-foreground text-lg leading-tight">{milestone.role}</h3>
          </div>
          <p className="text-muted-foreground leading-relaxed">{milestone.description}</p>
        </CardContent>
      </Card>

      {/* Timeline marker */}
      <div className="relative flex-shrink-0 hidden md:block">
        <div className="w-4 h-4 rounded-full bg-brand-orange shadow-[0_0_12px_rgba(255,122,0,0.5)] transition-shadow duration-300 hover:shadow-[0_0_20px_rgba(255,122,0,0.7)]" />
      </div>

      {/* Spacer for other side */}
      <div className="w-[calc(50%-2rem)] hidden md:block" />
    </div>
  );

  return (
    <section ref={sectionRef} className="py-24 bg-background relative">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">My Journey</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            From Olympic lanes to digital growth — a career built on discipline and execution.
          </p>
        </div>

        {/* Timeline container */}
        <div className="relative max-w-5xl mx-auto">
          {/* Vertical line (hidden on mobile) */}
          <div className="absolute left-1/2 top-0 bottom-0 w-[2px] bg-border hidden md:block -translate-x-1/2" />

          {/* Olympic Journey */}
          <div className="mb-12">
            <h3 className="text-2xl font-bold text-foreground mb-8 flex items-center justify-center md:justify-start gap-2">
              <span>🏊</span>
              <span>Olympic Journey</span>
            </h3>
            {olympicJourney.map((milestone, index) =>
              renderMilestone(milestone, index, index % 2 === 0)
            )}
          </div>

          {/* Professional Career Transition */}
          <div>
            <h3 className="text-2xl font-bold text-foreground mb-8 flex items-center justify-center md:justify-start gap-2">
              <span>💼</span>
              <span>Professional Career Transition</span>
            </h3>
            {professionalCareer.map((milestone, index) =>
              renderMilestone(milestone, index + olympicJourney.length, (index + olympicJourney.length) % 2 === 0)
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
