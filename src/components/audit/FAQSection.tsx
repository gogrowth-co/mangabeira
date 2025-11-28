import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ta } from "@/lib/auditTranslations";

type Locale = 'en' | 'br' | 'es';

interface FAQSectionProps {
  locale: Locale;
}

const FAQSection = ({ locale }: FAQSectionProps) => {
  const faqs = [
    {
      question: ta('audit.faq.q1.question', locale),
      answer: ta('audit.faq.q1.answer', locale)
    },
    {
      question: ta('audit.faq.q2.question', locale),
      answer: ta('audit.faq.q2.answer', locale)
    },
    {
      question: ta('audit.faq.q3.question', locale),
      answer: ta('audit.faq.q3.answer', locale)
    },
    {
      question: ta('audit.faq.q4.question', locale),
      answer: ta('audit.faq.q4.answer', locale)
    },
    {
      question: ta('audit.faq.q5.question', locale),
      answer: ta('audit.faq.q5.answer', locale)
    }
  ];

  return (
    <section className="bg-white py-20 px-6">
      <div className="max-w-3xl mx-auto">
        {/* Section header */}
        <h2 
          className="font-hero text-3xl font-bold text-navy text-center mb-12"
        >
          {ta('audit.faq.title', locale)}
        </h2>

        {/* FAQ accordion */}
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger 
                className="font-hero font-semibold text-navy text-left hover:text-aqua transition-colors"
              >
                {faq.question}
              </AccordionTrigger>
              <AccordionContent 
                className="font-body text-muted-foreground leading-relaxed"
              >
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default FAQSection;
