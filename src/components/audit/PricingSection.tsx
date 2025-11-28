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
      buttonClass: "border-2 border-[#0A2540] text-[#0A2540] bg-white hover:bg-[#0A2540] hover:text-white"
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
      buttonClass: "bg-[#FFB800] text-[#0A2540] hover:scale-105 hover:shadow-xl"
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
      buttonClass: "border-2 border-[#0A2540] text-[#0A2540] bg-white hover:bg-[#0A2540] hover:text-white"
    }
  ];

  return (
    <section id="pricing" className="bg-[#F5F7FA] py-20 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-12">
          <h2 
            className="text-3xl font-bold text-[#0A2540] mb-2"
            style={{ fontFamily: "Montserrat, sans-serif" }}
          >
            Simple Pricing
          </h2>
          <p className="text-gray-500" style={{ fontFamily: "Inter, sans-serif" }}>
            Choose Your Depth
          </p>
        </div>

        {/* Pricing cards */}
        <div className="grid md:grid-cols-3 gap-6 items-stretch">
          {tiers.map((tier, index) => (
            <div
              key={index}
              className={`bg-white rounded-xl p-8 shadow-lg transition-all duration-300 flex flex-col ${
                tier.featured ? "scale-105 border-2 border-[#FFB800] shadow-xl" : ""
              }`}
            >
              {/* Badge if featured */}
              {tier.badge && (
                <div className="bg-[#FFB800] text-[#0A2540] text-xs uppercase font-semibold px-3 py-1 rounded-full inline-block w-fit mb-4">
                  {tier.badge}
                </div>
              )}

              {/* Tier name */}
              <h3 
                className="text-2xl font-bold text-[#0A2540] mb-2"
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                {tier.name}
              </h3>

              {/* Price */}
              <div className="text-4xl font-bold text-[#0A2540] mb-4">
                {tier.price}
              </div>

              {/* Ideal for */}
              <p className="text-sm text-gray-600 mb-6 italic" style={{ fontFamily: "Playfair Display, serif" }}>
                Ideal for: {tier.idealFor}
              </p>

              {/* Features */}
              <ul className="space-y-3 mb-8 flex-grow">
                {tier.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start text-sm text-gray-700">
                    <Check className="h-5 w-5 text-[#1FB6FF] mr-2 flex-shrink-0 mt-0.5" />
                    <span style={{ fontFamily: "Inter, sans-serif" }}>{feature}</span>
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
        <div className="bg-white p-6 rounded-xl border border-gray-200 max-w-xl mx-auto mt-12 flex items-start gap-4">
          <Shield className="h-6 w-6 text-[#1FB6FF] flex-shrink-0 mt-1" />
          <p 
            className="text-gray-700 italic leading-relaxed"
            style={{ fontFamily: "Playfair Display, serif" }}
          >
            If I can't identify at least 3 actionable insights, I'll redo the audit free.
          </p>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
