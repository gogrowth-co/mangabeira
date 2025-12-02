import { Button } from "@/components/ui/button";

const HowItWorks = () => {
  const steps = [
    {
      day: "Day 1",
      dayNum: "1",
      badgeColor: "bg-aqua/10 text-aqua",
      badgeBg: "bg-aqua",
      title: "Deep Data Scan",
      description: "I analyze every relevant channel:",
      items: [
        "Reddit sentiment & discussion clusters",
        "Discord behaviors & engagement loops",
        "Website & dApp funnel paths",
        "On-chain activity & wallet cohorts",
        "Social footprint, SEO, PR narratives"
      ],
      channels: ["Reddit", "Discord", "Explorer", "GA", "X"],
      bulletColor: "text-aqua",
      arrow: "text-aqua"
    },
    {
      day: "Day 2",
      dayNum: "2",
      badgeColor: "bg-gold/10 text-gold",
      badgeBg: "bg-gold text-navy",
      title: "Insights That Actually Matter",
      description: "You receive a structured breakdown of:",
      items: [
        "What's driving or blocking growth",
        "Where users fall off",
        "What levers work",
        "What patterns are hidden beneath the surface"
      ],
      channels: [],
      bulletColor: "text-gold",
      arrow: "text-gold"
    },
    {
      day: "Day 3",
      dayNum: "3",
      badgeColor: "bg-navy text-white",
      badgeBg: "bg-aqua text-white",
      title: "Your Action Roadmap",
      description: "A clear, prioritized plan:",
      items: [
        "What to fix",
        "Why it matters",
        "How to fix it",
        "What to do first",
        "What NOT to waste time on"
      ],
      channels: [],
      bulletColor: "text-navy",
      arrow: "",
      border: "border-2 border-aqua/20"
    }
  ];

  return (
    <section className="py-20 lg:py-28 bg-light-gray">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-heading font-bold text-3xl md:text-4xl text-navy mb-4">
            How It Works
          </h2>
          <p className="font-body-audit text-lg text-charcoal/70">
            Clear. Visual. 72 hours.
          </p>
        </div>
        
        {/* 3 Steps */}
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {steps.map((step, idx) => (
              <div key={idx} className="relative">
                <div className={`bg-white rounded-xl p-8 shadow-card h-full hover:shadow-card-hover transition-shadow ${step.border || ''}`}>
                  {/* Day Badge */}
                  <div className={`inline-flex items-center gap-2 ${step.badgeColor} px-4 py-2 rounded-full font-heading font-semibold text-sm mb-6`}>
                    <span className={`w-6 h-6 ${step.badgeBg} rounded-full flex items-center justify-center text-xs font-bold`}>{step.dayNum}</span>
                    {step.day}
                  </div>
                  
                  <h3 className="font-heading font-bold text-xl text-navy mb-4">
                    {step.title}
                  </h3>
                  
                  <p className="font-body-audit text-charcoal/80 mb-6">
                    {step.description}
                  </p>
                  
                  <ul className="space-y-3">
                    {step.items.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm font-body-audit text-charcoal/70">
                        <span className={`${step.bulletColor} mt-1`}>•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                  
                  {/* Channel Icons or Priority Tags */}
                  {step.channels.length > 0 ? (
                    <div className="flex gap-3 mt-6 pt-6 border-t border-gray-100">
                      {step.channels.map((ch, i) => (
                        <span key={i} className="w-8 h-8 bg-light-gray rounded-lg flex items-center justify-center text-xs text-charcoal/50">
                          {ch[0]}
                        </span>
                      ))}
                    </div>
                  ) : idx === 2 ? (
                    <div className="flex flex-wrap gap-2 mt-6 pt-6 border-t border-gray-100">
                      {["Immediate", "Week 1", "30 Days", "90 Days"].map((tag, i) => (
                        <span key={i} className={`px-3 py-1 rounded-full text-xs font-heading font-medium ${
                          i === 0 ? 'bg-red-100 text-red-700' :
                          i === 1 ? 'bg-yellow-100 text-yellow-700' :
                          i === 2 ? 'bg-blue-100 text-blue-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <div className="mt-6 pt-6 border-t border-gray-100">
                      <div className="bg-light-gray rounded-lg p-3 text-center">
                        <span className="text-xs text-charcoal/50 font-body-audit">Notion insight card preview</span>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Connector Arrow */}
                {idx < 2 && (
                  <div className={`hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 ${step.arrow} text-2xl`}>
                    →
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        
        {/* CTA */}
        <div className="text-center mt-12">
          <Button 
            className="bg-gold hover:bg-[#E6A600] text-navy font-heading font-bold text-lg px-10 py-4 rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
            onClick={() => window.scrollTo({ top: document.getElementById('pricing')?.offsetTop || 0, behavior: 'smooth' })}
          >
            Get My Audit →
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
