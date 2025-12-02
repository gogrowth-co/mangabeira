const WhyTrustSection = () => {
  const credentials = ["10+ years in growth across Web2 + Web3", "Operator experience with Binance, L1 ecosystems & major Web3 startups", "Combines qualitative + quantitative insights", "Designed for founders, growth leads & community teams", "Olympic-level discipline applied to analysis"];
  return <section className="py-20 lg:py-28 bg-muted">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-hero font-bold text-3xl md:text-4xl text-primary mb-6 text-center">
            Why Web3 Teams Choose This Over Internal Reviews
          </h2>
          
          {/* Credentials Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
            {credentials.map((item, i) => <div key={i} className="flex items-center gap-3 bg-card p-4 rounded-lg shadow-sm">
                <span className="text-[hsl(var(--aqua-bright))] text-lg">✔</span>
                <span className="font-body text-foreground">{item}</span>
              </div>)}
          </div>
          
          {/* Quote Block */}
          <div className="bg-card rounded-xl p-8 shadow-card border-t-4 border-[hsl(var(--gold-olympic))]">
            <p className="font-accent text-xl text-primary italic mb-4">
              "You're not buying a static report. You're buying pattern recognition sharpened across thousands of Web3 data points."
            </p>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-[hsl(var(--gold-olympic))] text-xl">
                🏊
              </div>
              <div>
                <p className="font-hero font-semibold text-primary">Gabriel Mangabeira</p>
                <p className="font-body text-sm text-muted-foreground">2x Olympian • Web3 Growth Operator</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>;
};
export default WhyTrustSection;