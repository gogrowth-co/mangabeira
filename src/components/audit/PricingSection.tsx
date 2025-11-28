import { Button } from "@/components/ui/button";
import { Check, Shield } from "lucide-react";

const PricingSection = () => {
  const tiers = [
    {
      name: "Starter",
      price: "$197",
      idealFor: "Early teams validating traction",
      features: [
        "Reddit + On-chain snapshot",
        "Top 3 growth leaks identified"
      ],
      cta: "Start Audit →",
      featured: false,
      buttonClass: "border-2 border-navy text-navy bg-white hover:bg-navy hover:text-white"
    },
    {
      name: "Pro",
      price: "$497",
      badge: "Most Popular",
      idealFor: "Teams needing a full diagnosis",
      features: [
        "Full hybrid audit",
        "Notion dashboard",
        "90-day roadmap",
        "Loom walkthrough"
      ],
      cta: "Start Audit →",
      featured: true,
      buttonClass: "bg-gold text-navy hover:scale-105 shadow-button hover:shadow-button-hover"
    },
    {
      name: "Elite",
      price: "$997",
      idealFor: "Funded teams or protocols",
      features: [
        "Everything in Pro",
        "60-min strategy call",
        "Custom AI Agent recommendations"
      ],
      cta: "Start Audit →",
      featured: false,
      buttonClass: "border-2 border-navy text-navy bg-white hover:bg-navy hover:text-white"
    }
  ];

  return (
    <section id="pricing" className="bg-gray-light py-20 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-12">
          <h2 
            className="font-hero text-3xl font-bold text-navy mb-2"
          >
            Simple Pricing
          </h2>
          <p className="font-body text-muted-foreground">
            Choose Your Depth
          </p>
        </div>

        {/* Pricing cards */}
        <div className="grid md:grid-cols-3 gap-6 items-stretch">
          {tiers.map((tier, index) => (
            <div
              key={index}
              className={`bg-white rounded-xl p-8 shadow-lg transition-all duration-300 flex flex-col ${
                tier.featured ? "scale-105 border-2 border-gold shadow-xl" : ""
              }`}
            >
              {/* Badge if featured */}
              {tier.badge && (
                <div className="bg-gold text-navy text-xs uppercase font-semibold px-3 py-1 rounded-full inline-block w-fit mb-4">
                  {tier.badge}
                </div>
              )}

              {/* Tier name */}
              <h3 
                className="font-hero text-2xl font-bold text-navy mb-2"
              >
                {tier.name}
              </h3>

              {/* Price */}
              <div className="text-4xl font-bold text-navy mb-4">
                {tier.price}
              </div>

              {/* Ideal for */}
              <p className="font-accent text-sm text-muted-foreground mb-6 italic">
                Ideal for: {tier.idealFor}
              </p>

              {/* Features */}
              <ul className="space-y-3 mb-8 flex-grow">
                {tier.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start text-sm text-gray-700">
                    <Check className="h-5 w-5 text-aqua mr-2 flex-shrink-0 mt-0.5" />
                    <span className="font-body">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <Button
                className={`w-full rounded-lg font-semibold transition-all duration-300 ${tier.buttonClass}`}
                onClick={() => window.open('https://calendly.com/gabriel-mangabeira/15min', '_blank')}
              >
                {tier.cta}
              </Button>
            </div>
          ))}
        </div>

        {/* Guarantee box */}
        <div className="bg-white p-6 rounded-xl border border-border max-w-xl mx-auto mt-12 flex items-start gap-4">
          <Shield className="h-6 w-6 text-aqua flex-shrink-0 mt-1" />
          <p 
            className="font-accent text-gray-700 italic leading-relaxed"
          >
            If I can't identify at least 3 actionable insights, I'll redo the audit free.
          </p>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
