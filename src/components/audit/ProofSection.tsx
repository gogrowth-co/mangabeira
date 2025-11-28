import { ta } from "@/lib/auditTranslations";

type Locale = 'en' | 'br' | 'es';

interface ProofSectionProps {
  locale: Locale;
}

const ProofSection = ({ locale }: ProofSectionProps) => {
  const proofCards = [
    {
      title: ta('audit.proof.card1.title', locale),
      context: ta('audit.proof.card1.context', locale),
      result: ta('audit.proof.card1.result', locale)
    },
    {
      title: ta('audit.proof.card2.title', locale),
      context: ta('audit.proof.card2.context', locale),
      result: ta('audit.proof.card2.result', locale)
    },
    {
      title: ta('audit.proof.card3.title', locale),
      context: ta('audit.proof.card3.context', locale),
      result: ta('audit.proof.card3.result', locale)
    }
  ];

  return (
    <section id="proof" className="bg-gray-light py-20 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <h2 
          className="font-hero text-3xl font-bold text-navy text-center"
        >
          {ta('audit.proof.title', locale)}
        </h2>

        {/* Proof cards */}
        <div className="grid md:grid-cols-3 gap-6 mt-12">
          {proofCards.map((card, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-6 border-l-4 border-aqua shadow-[0_4px_20px_rgba(10,37,64,0.08)] hover:shadow-[0_8px_30px_rgba(10,37,64,0.12)] hover:-translate-y-1 transition-all duration-300"
            >
              <h3 className="font-hero font-semibold text-navy mb-1">
                {card.title}
              </h3>
              <p className="text-sm text-muted-foreground mb-3">{card.context}</p>
              <p className="font-body text-gray-700 text-sm leading-relaxed">
                {card.result}
              </p>
            </div>
          ))}
        </div>

        {/* Caption */}
        <p 
          className="font-accent text-center text-muted-foreground text-sm mt-8 italic"
        >
          {ta('audit.proof.caption', locale)}
        </p>
      </div>
    </section>
  );
};

export default ProofSection;
