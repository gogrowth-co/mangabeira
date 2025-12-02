const GuaranteeSection = () => {
  return (
    <section className="py-16 lg:py-20 bg-white">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-[#10B981]/10 rounded-full mb-6">
            <span className="text-4xl">🛡️</span>
          </div>
          
          <h2 className="font-heading font-bold text-2xl md:text-3xl text-navy mb-4">
            If I don't find at least 3 meaningful, actionable insights…
          </h2>
          
          <p className="font-accent-audit text-xl text-navy italic mb-6">
            "I refund the entire audit fee."
          </p>
          
          <p className="font-body-audit text-lg text-charcoal/70">
            No risk. No excuses. Just clarity.
          </p>
          
          {/* Trust Badges */}
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            {[
              { icon: "✓", text: "72-hour delivery" },
              { icon: "✓", text: "Money-back guarantee" },
              { icon: "✓", text: "Secure payment" }
            ].map((badge, i) => (
              <span key={i} className="flex items-center gap-2 px-4 py-2 bg-light-gray rounded-full text-sm font-body-audit text-charcoal/70">
                <span className="text-[#10B981]">{badge.icon}</span> {badge.text}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default GuaranteeSection;
