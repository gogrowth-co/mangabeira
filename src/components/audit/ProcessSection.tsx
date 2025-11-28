import { Button } from "@/components/ui/button";

const ProcessSection = () => {
  const processSteps = [
    {
      day: "1",
      bgColor: "bg-[#1FB6FF]",
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
      bgColor: "bg-[#FFB800]",
      textColor: "text-[#0A2540]",
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
      bgColor: "bg-[#1FB6FF]",
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
            className="text-3xl font-bold text-[#0A2540] mb-2"
            style={{ fontFamily: "Montserrat, sans-serif" }}
          >
            How It Works
          </h2>
          <p className="text-gray-500" style={{ fontFamily: "Inter, sans-serif" }}>
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
                className="font-bold text-[#0A2540] text-xl mb-4 text-center"
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                {step.title}
              </h3>

              {/* Subtitle if exists */}
              {step.subtitle && (
                <p 
                  className="italic text-gray-600 text-center mb-4"
                  style={{ fontFamily: "Playfair Display, serif" }}
                >
                  {step.subtitle}
                </p>
              )}

              {/* Items list */}
              <ul className="space-y-2 text-gray-600 text-sm" style={{ fontFamily: "Inter, sans-serif" }}>
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
            className="bg-[#FFB800] text-[#0A2540] font-semibold px-8 py-4 rounded-lg hover:scale-105 hover:shadow-xl transition-all duration-300"
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
