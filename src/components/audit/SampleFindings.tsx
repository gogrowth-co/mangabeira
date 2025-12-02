const SampleFindings = () => {
  const findings = [
    {
      color: "aqua",
      colorClass: "border-aqua",
      bgClass: "bg-aqua",
      title: "Wallet Cohort Analysis",
      quote: "\"30% of your 'active' wallets churn after one interaction — inflating retention.\"",
      fix: "Segment paths, improve onboarding, activate silent lurkers."
    },
    {
      color: "purple",
      colorClass: "border-[#9B59B6]",
      bgClass: "bg-[#9B59B6]",
      title: "Discord → Funnel Leak",
      quote: "\"Your highest-intent questions happen 1am–4am UTC — but no replies.\"",
      fix: "Async answers library + timezone coverage."
    },
    {
      color: "gold",
      colorClass: "border-gold",
      bgClass: "bg-gold",
      title: "Token Visibility Gap",
      quote: "\"78% of new users never discover your token page due to Reddit thread structure.\"",
      fix: "Restructure entry points + sentiment touchpoints."
    }
  ];

  return (
    <section className="py-20 lg:py-28 bg-gradient-to-br from-navy to-[#0D3251]">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="font-heading font-bold text-3xl md:text-4xl text-white mb-4">
            Sample Findings From Real Audits
          </h2>
          <p className="font-body-audit text-lg text-white/70">
            Here's the kind of clarity you'll get (real, anonymized insights):
          </p>
        </div>
        
        {/* Findings Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {findings.map((finding, i) => (
            <div key={i} className={`bg-white rounded-xl p-6 border-l-4 ${finding.colorClass} shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300`}>
              <div className="flex items-center gap-2 mb-4">
                <span className={`w-3 h-3 rounded-full ${finding.bgClass}`}></span>
                <span className="font-heading font-semibold text-navy">{finding.title}</span>
              </div>
              <p className="font-body-audit text-charcoal mb-4 italic">
                {finding.quote}
              </p>
              <div className="pt-4 border-t border-gray-100">
                <p className="font-body-audit text-sm text-charcoal/70">
                  <span className={`font-semibold ${i === 0 ? 'text-aqua' : i === 1 ? 'text-[#9B59B6]' : 'text-gold'}`}>→ Fix:</span> {finding.fix}
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
