import { Button } from "@/components/ui/button";
import { ta } from "@/lib/auditTranslations";

type Locale = 'en' | 'br' | 'es';

interface ProcessSectionProps {
  locale: Locale;
}

const ProcessSection = ({ locale }: ProcessSectionProps) => {
  const processSteps = [
    {
      day: ta('audit.process.step1.day', locale),
      bgColor: "bg-aqua",
      textColor: "text-white",
      title: ta('audit.process.step1.title', locale),
      items: [
        ta('audit.process.step1.item1', locale),
        ta('audit.process.step1.item2', locale),
        ta('audit.process.step1.item3', locale),
        ta('audit.process.step1.item4', locale),
        ta('audit.process.step1.item5', locale)
      ]
    },
    {
      day: ta('audit.process.step2.day', locale),
      bgColor: "bg-gold",
      textColor: "text-navy",
      title: ta('audit.process.step2.title', locale),
      subtitle: ta('audit.process.step2.subtitle', locale),
      items: [
        ta('audit.process.step2.item1', locale),
        ta('audit.process.step2.item2', locale),
        ta('audit.process.step2.item3', locale),
        ta('audit.process.step2.item4', locale),
        ta('audit.process.step2.item5', locale)
      ],
      footer: ta('audit.process.step2.footer', locale)
    },
    {
      day: ta('audit.process.step3.day', locale),
      bgColor: "bg-aqua",
      textColor: "text-white",
      title: ta('audit.process.step3.title', locale),
      items: [
        ta('audit.process.step3.item1', locale),
        ta('audit.process.step3.item2', locale),
        ta('audit.process.step3.item3', locale),
        ta('audit.process.step3.item4', locale)
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
            {ta('audit.process.title', locale)}
          </h2>
          <p className="font-body text-muted-foreground">
            {ta('audit.process.subtitle', locale)}
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
            {ta('audit.process.cta', locale)}
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ProcessSection;
