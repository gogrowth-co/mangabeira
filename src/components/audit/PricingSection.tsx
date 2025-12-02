import { Check } from "lucide-react";

const PricingSection = () => {
  const tiers = [
    {
      name: "Starter",
      price: "$197",
      description: "For early teams needing fast clarity.",
      features: [
        "6–8 key insights",
        "Light audit + actions",
        "Delivered in 72 hours",
        "Notion report"
      ],
      cta: "Start Starter Audit",
      highlighted: false,
    },
    {
      name: "Pro",
      price: "$497",
      description: "For teams who want clarity and a plan.",
      features: [
        "Full audit (all channels)",
        "12–20 high-impact insights",
        "90-day roadmap",
        "Loom walkthrough",
        "Priority delivery"
      ],
      cta: "Start Pro Audit",
      highlighted: true,
    },
    {
      name: "Elite",
      price: "$997",
      description: "For funded teams or major launches.",
      features: [
        "Everything in Pro",
        "Deeper cohort & sentiment analysis",
        "Token + narrative + liquidity loop audit",
        "Launch/campaign prep insights",
        "Advanced cross-platform funnel map"
      ],
      cta: "Start Elite Audit",
      highlighted: false,
    },
  ];

  return (
    <section id="pricing" className="py-20 lg:py-28 bg-gradient-to-br from-[hsl(var(--navy-deep))] to-[#0D3251]">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-hero font-bold text-3xl md:text-4xl text-white mb-4">
            Pricing
          </h2>
          <p className="font-body text-lg text-white/70">
            Choose How Deep You Want to Go
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {tiers.map((tier, i) => (
            <div
              key={i}
              className={`bg-white rounded-xl p-8 shadow-lg transform transition-all duration-300 flex flex-col ${
                tier.highlighted ? 'md:-translate-y-4 border-t-4 border-[hsl(var(--gold-olympic))]' : ''
              }`}
            >
              {tier.highlighted && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-[hsl(var(--gold-olympic))] text-primary font-hero font-bold text-sm px-4 py-1 rounded-full">
                    Most Popular
                  </span>
                </div>
              )}
              
              <div className="mb-6 pt-4">
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-hero font-semibold mb-4 ${
                  tier.highlighted 
                    ? 'bg-[hsl(var(--aqua-bright))]/10 text-[hsl(var(--aqua-bright))]' 
                    : 'bg-muted text-muted-foreground'
                }`}>
                  {tier.name}
                </span>
                <div className="flex items-baseline gap-1">
                  <span className="font-hero font-bold text-4xl text-primary">{tier.price}</span>
                </div>
              </div>
              
              <p className="font-body text-muted-foreground mb-6">
                {tier.description}
              </p>
              
              <ul className="space-y-3 mb-8 flex-grow">
                {tier.features.map((feature, j) => (
                  <li key={j} className="flex items-center gap-2 font-body text-foreground">
                    <Check className={`h-5 w-5 flex-shrink-0 ${tier.highlighted ? 'text-[hsl(var(--gold-olympic))]' : 'text-[hsl(var(--aqua-bright))]'}`} />
                    {feature}
                  </li>
                ))}
              </ul>
              
              <button 
                className={`w-full py-3 rounded-lg font-hero font-bold transition-all duration-200 ${
                  tier.highlighted
                    ? 'bg-gradient-cta hover:shadow-button-hover text-white shadow-md'
                    : 'border-2 border-primary text-primary hover:bg-primary hover:text-white'
                }`}
                onClick={() => window.open('https://calendly.com/gabriel-mangabeira/15min', '_blank')}
              >
                {tier.cta}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
