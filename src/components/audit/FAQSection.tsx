import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQSection = () => {
  const faqs = [
    {
      question: "Do you need private data?",
      answer: "No — only public URLs + wallets."
    },
    {
      question: "How fast is delivery?",
      answer: "72 hours after intake form submission."
    },
    {
      question: "Who runs the audit?",
      answer: "AI does the heavy lifting. I personally interpret every signal and build the roadmap."
    },
    {
      question: "Do you accept crypto?",
      answer: "Yes — USDT + ETH via CoinGate (or Stripe for fiat)."
    },
    {
      question: "What happens after I pay?",
      answer: "You'll complete a short intake. Your 3-day window starts immediately."
    }
  ];

  return (
    <section className="bg-white py-20 px-6">
      <div className="max-w-3xl mx-auto">
        {/* Section header */}
        <h2 
          className="font-hero text-3xl font-bold text-navy text-center mb-12"
        >
          Frequently Asked Questions
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
