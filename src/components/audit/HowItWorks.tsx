const HowItWorks = () => {
  return (
    <section className="py-20 lg:py-28 bg-muted">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-hero font-bold text-3xl md:text-4xl text-primary mb-4">
            How It Works
          </h2>
          <p className="font-body text-lg text-muted-foreground">
            Clear. Visual. 72 hours.
          </p>
        </div>
        
        {/* 3 Steps */}
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Step 1 */}
            <div className="relative">
              <div className="bg-card rounded-xl p-8 shadow-card h-full">
                <div className="inline-flex items-center gap-2 bg-[hsl(var(--aqua-bright))]/10 text-[hsl(var(--aqua-bright))] px-4 py-2 rounded-full font-hero font-semibold text-sm mb-6">
                  <span className="w-6 h-6 bg-[hsl(var(--aqua-bright))] text-white rounded-full flex items-center justify-center text-xs">1</span>
                  Day 1
                </div>
                
                <h3 className="font-hero font-bold text-xl text-primary mb-4">
                  Deep Data Scan
                </h3>
                
                <p className="font-body text-muted-foreground mb-6">
                  I analyze every relevant channel:
                </p>
                
                <ul className="space-y-3">
                  {["Reddit sentiment & discussion clusters", "Discord behaviors & engagement loops", "Website & dApp funnel paths", "On-chain activity & wallet cohorts", "Social footprint, SEO, PR narratives"].map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm font-body text-muted-foreground">
                      <span className="text-[hsl(var(--aqua-bright))] mt-1">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
                
                <div className="flex gap-3 mt-6 pt-6 border-t border-border">
                  {["Reddit", "Discord", "Explorer", "GA", "X"].map((ch, i) => (
                    <span key={i} className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center text-xs text-muted-foreground">
                      {ch[0]}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 text-[hsl(var(--aqua-bright))] text-2xl">
                →
              </div>
            </div>
            
            {/* Step 2 */}
            <div className="relative">
              <div className="bg-card rounded-xl p-8 shadow-card h-full">
                <div className="inline-flex items-center gap-2 bg-[hsl(var(--gold-olympic))]/10 text-[hsl(var(--gold-olympic))] px-4 py-2 rounded-full font-hero font-semibold text-sm mb-6">
                  <span className="w-6 h-6 bg-[hsl(var(--gold-olympic))] text-primary rounded-full flex items-center justify-center text-xs font-bold">2</span>
                  Day 2
                </div>
                
                <h3 className="font-hero font-bold text-xl text-primary mb-4">
                  Insights That Actually Matter
                </h3>
                
                <p className="font-body text-muted-foreground mb-6">
                  You receive a structured breakdown of:
                </p>
                
                <ul className="space-y-3">
                  {["What's driving or blocking growth", "Where users fall off", "What levers work", "What patterns are hidden beneath the surface"].map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm font-body text-muted-foreground">
                      <span className="text-[hsl(var(--gold-olympic))] mt-1">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
                
                <div className="mt-6 pt-6 border-t border-border">
                  <div className="bg-muted rounded-lg p-3 text-center">
                    <span className="text-xs text-muted-foreground font-body">Notion insight card preview</span>
                  </div>
                </div>
              </div>
              
              <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 text-[hsl(var(--gold-olympic))] text-2xl">
                →
              </div>
            </div>
            
            {/* Step 3 */}
            <div>
              <div className="bg-card rounded-xl p-8 shadow-card h-full border-2 border-[hsl(var(--aqua-bright))]/20">
                <div className="inline-flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-full font-hero font-semibold text-sm mb-6">
                  <span className="w-6 h-6 bg-[hsl(var(--aqua-bright))] text-white rounded-full flex items-center justify-center text-xs">3</span>
                  Day 3
                </div>
                
                <h3 className="font-hero font-bold text-xl text-primary mb-4">
                  Your Action Roadmap
                </h3>
                
                <p className="font-body text-muted-foreground mb-6">
                  A clear, prioritized plan:
                </p>
                
                <ul className="space-y-3">
                  {["What to fix", "Why it matters", "How to fix it", "What to do first", "What NOT to waste time on"].map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm font-body text-muted-foreground">
                      <span className="text-primary mt-1">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
                
                <div className="flex flex-wrap gap-2 mt-6 pt-6 border-t border-border">
                  {["Immediate", "Week 1", "30 Days", "90 Days"].map((tag, i) => (
                    <span key={i} className={`px-3 py-1 rounded-full text-xs font-hero font-medium ${
                      i === 0 ? 'bg-red-100 text-red-700' :
                      i === 1 ? 'bg-yellow-100 text-yellow-700' :
                      i === 2 ? 'bg-blue-100 text-blue-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* CTA */}
        <div className="text-center mt-12">
          <button 
            className="bg-gradient-cta hover:shadow-button-hover text-white font-hero font-bold text-lg px-10 py-4 rounded-lg transition-all duration-200"
            onClick={() => window.open('https://calendly.com/gabriel-mangabeira/15min', '_blank')}
          >
            Get My Audit →
          </button>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
