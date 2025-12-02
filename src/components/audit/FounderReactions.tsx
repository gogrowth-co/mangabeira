const FounderReactions = () => {
  const reactions = [
    "We didn't realize we were speaking to the wrong segment.",
    "This explains our retention drop instantly.",
    "Now we know exactly what to fix next.",
    "This is the first time all our channels make sense together."
  ];

  return (
    <section className="py-16 lg:py-20 bg-muted">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="text-center mb-10">
          <p className="font-body text-sm text-muted-foreground uppercase tracking-wide mb-2">
            Not testimonials — just consistent patterns from every audit:
          </p>
          <h2 className="font-hero font-bold text-2xl md:text-3xl text-primary">
            Founder Reactions After the Audit
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {reactions.map((quote, i) => (
            <div key={i} className="bg-card rounded-xl p-6 shadow-sm border-l-4 border-[hsl(var(--aqua-bright))]/30 hover:shadow-md transition-shadow">
              <p className="font-body text-foreground italic">
                "{quote}"
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FounderReactions;
