import { Button } from "@/components/ui/button";
import { Check, Shield } from "lucide-react";
import { ta } from "@/lib/auditTranslations";

type Locale = 'en' | 'br' | 'es';

interface PricingSectionProps {
  locale: Locale;
}

const PricingSection = ({ locale }: PricingSectionProps) => {
  const tiers = [
    {
      name: ta('audit.pricing.tier1.name', locale),
      price: ta('audit.pricing.tier1.price', locale),
      idealFor: ta('audit.pricing.tier1.ideal', locale),
      features: [
        ta('audit.pricing.tier1.feature1', locale),
        ta('audit.pricing.tier1.feature2', locale)
      ],
      cta: ta('audit.pricing.tier1.cta', locale),
      featured: false,
      buttonClass: "border-2 border-navy text-navy bg-white hover:bg-navy hover:text-white"
    },
    {
      name: ta('audit.pricing.tier2.name', locale),
      price: ta('audit.pricing.tier2.price', locale),
      badge: ta('audit.pricing.tier2.badge', locale),
      idealFor: ta('audit.pricing.tier2.ideal', locale),
      features: [
        ta('audit.pricing.tier2.feature1', locale),
        ta('audit.pricing.tier2.feature2', locale),
        ta('audit.pricing.tier2.feature3', locale),
        ta('audit.pricing.tier2.feature4', locale)
      ],
      cta: ta('audit.pricing.tier2.cta', locale),
      featured: true,
      buttonClass: "bg-gold text-navy hover:scale-105 shadow-button hover:shadow-button-hover"
    },
    {
      name: ta('audit.pricing.tier3.name', locale),
      price: ta('audit.pricing.tier3.price', locale),
      idealFor: ta('audit.pricing.tier3.ideal', locale),
      features: [
        ta('audit.pricing.tier3.feature1', locale),
        ta('audit.pricing.tier3.feature2', locale),
        ta('audit.pricing.tier3.feature3', locale)
      ],
      cta: ta('audit.pricing.tier3.cta', locale),
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
            {ta('audit.pricing.title', locale)}
          </h2>
          <p className="font-body text-muted-foreground">
            {ta('audit.pricing.subtitle', locale)}
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
            {ta('audit.pricing.guarantee', locale)}
          </p>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
