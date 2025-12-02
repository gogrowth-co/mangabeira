const FAQSection = () => {
  const faqs = [
    {
      q: "Do you need private data?",
      a: "Mostly no. Reddit, Discord, on-chain, SEO & social are public. Dashboards optional."
    },
    {
      q: "How fast is delivery?",
      a: "Within 72 hours."
    },
    {
      q: "Who runs the audit?",
      a: "Me — a former Olympian and Web3 growth operator with 10+ years experience."
    },
    {
      q: "What happens after I pay?",
      a: "You immediately get an intake form + your delivery date."
    },
    {
      q: "Do you accept crypto?",
      a: "Yes — USDC/USDT across major L1s."
    }
  ];

  return (
    <section className="py-20 lg:py-28 bg-background">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-hero font-bold text-3xl md:text-4xl text-primary mb-12 text-center">
            FAQ
          </h2>
          
          <div className="space-y-4">
            {faqs.map((item, i) => (
              <details key={i} className="group bg-muted rounded-xl overflow-hidden">
                <summary className="flex justify-between items-center p-6 cursor-pointer font-hero font-semibold text-primary hover:bg-muted/80 transition-colors">
                  {item.q}
                  <span className="text-[hsl(var(--aqua-bright))] transform group-open:rotate-45 transition-transform text-xl">
                    +
                  </span>
                </summary>
                <div className="px-6 pb-6">
                  <p className="font-body text-muted-foreground">
                    {item.a}
                  </p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
