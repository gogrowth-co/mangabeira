import { Button } from "@/components/ui/button";

const ProcessSection = () => {
  const processSteps = [
    {
      day: "1",
      bgColor: "bg-aqua",
      textColor: "text-white",
      title: "AI Scrapes & Scores Your Data",
      items: [
        "Reddit Sentiment Scan",
        "Wallet Cohort Analysis (Dune + Etherscan + DeBank)",
        "Token Discovery & Visibility Score",
        "Funnel Drop-Off Map",
        "Community-to-Holders Correlation"
      ]
    },
    {
      day: "2",
      bgColor: "bg-gold",
      textColor: "text-navy",
      title: "Human Interpretation",
      subtitle: "The part AI cannot do",
      items: [
        "What matters",
        "What's leaking",
        "What's fake traction",
        "What's real",
        "What to fix first"
      ],
      footer: "No AI hallucinations. No generic advice. Actual strategic judgment."
    },
    {
      day: "3",
      bgColor: "bg-aqua",
      textColor: "text-white",
      title: "Your Roadmap Delivered",
      items: [
        "Notion dashboard summarizing findings",
        "Loom walkthrough explaining the 'why'",
        "90-day roadmap with highest-ROI moves",
        "Growth Score across 5 pillars"
      ]
    }
  ];

  return (
    <section className="bg-white py-20 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-12">
          <h2 
            className="font-hero text-3xl font-bold text-navy mb-2"
          >
            How It Works
          </h2>
          <p className="font-body text-muted-foreground">
            Clear. Visual. 72 hours.
          </p>
        </div>

        {/* Process cards */}
        <div className="grid md:grid-cols-3 gap-8">
          {processSteps.map((step, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-8 shadow-[0_4px_20px_rgba(10,37,64,0.08)] hover:shadow-[0_8px_30px_rgba(10,37,64,0.12)] transition-all duration-300"
            >
              {/* Number badge */}
              <div className={`${step.bgColor} ${step.textColor} w-10 h-10 rounded-full flex items-center justify-center font-bold mb-6 mx-auto`}>
                {step.day}
              </div>

              {/* Title */}
              <h3 
                className="font-hero font-bold text-navy text-xl mb-4 text-center"
              >
                {step.title}
              </h3>

              {/* Subtitle if exists */}
              {step.subtitle && (
                <p 
                  className="font-accent italic text-muted-foreground text-center mb-4"
                >
                  {step.subtitle}
                </p>
              )}

              {/* Items list */}
              <ul className="font-body space-y-2 text-gray-600 text-sm">
                {step.items.map((item, itemIndex) => (
                  <li key={itemIndex} className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              {/* Footer if exists */}
              {step.footer && (
                <p className="text-xs text-gray-500 mt-4 pt-4 border-t border-gray-100">
                  {step.footer}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <Button
            size="lg"
            className="bg-gold text-navy font-semibold px-8 py-4 rounded-lg hover:scale-105 shadow-button hover:shadow-button-hover transition-all duration-300"
            onClick={() => window.scrollTo({ top: document.getElementById('pricing')?.offsetTop || 0, behavior: 'smooth' })}
          >
            Get My Audit →
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ProcessSection;
