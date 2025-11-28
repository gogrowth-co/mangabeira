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
          className="text-3xl font-bold text-[#0A2540] text-center mb-12"
          style={{ fontFamily: "Montserrat, sans-serif" }}
        >
          Frequently Asked Questions
        </h2>

        {/* FAQ accordion */}
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger 
                className="font-semibold text-[#0A2540] text-left hover:text-[#1FB6FF] transition-colors"
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                {faq.question}
              </AccordionTrigger>
              <AccordionContent 
                className="text-gray-600 leading-relaxed"
                style={{ fontFamily: "Inter, sans-serif" }}
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
