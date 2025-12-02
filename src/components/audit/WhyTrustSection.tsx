const WhyTrustSection = () => {
  const credentials = [
    "10+ years in growth across Web2 + Web3",
    "Operator experience with Binance, L1 ecosystems & major Web3 startups",
    "Combines qualitative + quantitative insights",
    "Designed for founders, growth leads & community teams",
    "Olympic-level discipline applied to analysis"
  ];

  return (
    <section className="py-20 lg:py-28 bg-light-gray">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-heading font-bold text-3xl md:text-4xl text-navy mb-6 text-center">
            Why Web3 Teams Choose This Over Internal Reviews
          </h2>
          
          {/* Credentials Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
            {credentials.map((item, i) => (
              <div key={i} className="flex items-center gap-3 bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <span className="text-aqua text-lg">✔</span>
                <span className="font-body-audit text-charcoal">{item}</span>
              </div>
            ))}
          </div>
          
          {/* Quote Block */}
          <div className="bg-white rounded-xl p-8 shadow-card border-t-4 border-gold hover:shadow-card-hover transition-shadow">
            <p className="font-accent-audit text-xl text-navy italic mb-4">
              "You're not buying a static report. You're buying pattern recognition sharpened across thousands of Web3 data points."
            </p>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-navy rounded-full flex items-center justify-center text-gold text-xl">
                🏊
              </div>
              <div>
                <p className="font-heading font-semibold text-navy">Gabriel Mangabeira</p>
                <p className="font-body-audit text-sm text-charcoal/60">Former Olympian • Web3 Growth Operator</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyTrustSection;
