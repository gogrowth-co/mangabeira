const SampleFindings = () => {
  const findings = [
    {
      color: "bg-[hsl(var(--aqua-bright))]",
      category: "Wallet Cohort Analysis",
      insight: "30% of your 'active' wallets churn after one interaction — inflating retention.",
      fix: "Segment paths, improve onboarding, activate silent lurkers."
    },
    {
      color: "bg-[#9B59B6]",
      category: "Discord → Funnel Leak",
      insight: "Your highest-intent questions happen 1am–4am UTC — but no replies.",
      fix: "Async answers library + timezone coverage."
    },
    {
      color: "bg-[hsl(var(--gold-olympic))]",
      category: "Token Visibility Gap",
      insight: "78% of new users never discover your token page due to Reddit thread structure.",
      fix: "Restructure entry points + sentiment touchpoints."
    }
  ];

  return (
    <section id="proof" className="py-20 lg:py-28 bg-gradient-to-br from-[hsl(var(--navy-deep))] to-[#0D3251]">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="font-hero font-bold text-3xl md:text-4xl text-white mb-4">
            Sample Findings From Real Audits
          </h2>
          <p className="font-body text-lg text-white/70">
            Here's the kind of clarity you'll get (real, anonymized insights):
          </p>
        </div>
        
        {/* Findings Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {findings.map((finding, i) => (
            <div key={i} className="bg-card rounded-xl p-6 border-l-4 border-[hsl(var(--aqua-bright))] shadow-lg">
              {/* Tiny Label */}
              <div className="text-xs text-[hsl(var(--aqua-bright))] font-hero font-semibold mb-2">
                ✔ {i === 0 ? 'Reddit' : i === 1 ? 'Discord' : 'Token visibility'}
              </div>
              <div className="flex items-center gap-2 mb-4">
                <span className={`w-3 h-3 rounded-full ${finding.color}`}></span>
                <span className="font-hero font-semibold text-primary">{finding.category}</span>
              </div>
              <p className="font-body text-foreground mb-4 italic">
                "{finding.insight}"
              </p>
              <div className="pt-4 border-t border-border">
                <p className="font-body text-sm text-muted-foreground">
                  <span className={`${finding.color.replace('bg-', 'text-')} font-semibold`}>→ Fix:</span> {finding.fix}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SampleFindings;
