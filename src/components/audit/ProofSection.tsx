const ProofSection = () => {
  const proofCards = [
    {
      title: "Wallet Cohort Analysis",
      context: "(DeFi protocol)",
      result: "Identified that 42% of 'active' Reddit users were low-value wallets → reallocated spend to 10 high-signal subreddits"
    },
    {
      title: "Discord → Mint Funnel",
      context: "(NFT pre-launch)",
      result: "Found 28% drop-off between 'Join Discord' → 'View Mint Page' → +23% verified mints"
    },
    {
      title: "Token Visibility Gap",
      context: "(L1 ecosystem)",
      result: "Revealed 4× discovery boost potential by optimizing multi-platform listing hygiene"
    }
  ];

  return (
    <section id="proof" className="bg-gray-light py-20 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <h2 
          className="font-hero text-3xl font-bold text-navy text-center"
        >
          Sample Findings From Real Web3 Audits
        </h2>

        {/* Proof cards */}
        <div className="grid md:grid-cols-3 gap-6 mt-12">
          {proofCards.map((card, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-6 border-l-4 border-aqua shadow-[0_4px_20px_rgba(10,37,64,0.08)] hover:shadow-[0_8px_30px_rgba(10,37,64,0.12)] hover:-translate-y-1 transition-all duration-300"
            >
              <h3 className="font-hero font-semibold text-navy mb-1">
                {card.title}
              </h3>
              <p className="text-sm text-muted-foreground mb-3">{card.context}</p>
              <p className="font-body text-gray-700 text-sm leading-relaxed">
                {card.result}
              </p>
            </div>
          ))}
        </div>

        {/* Caption */}
        <p 
          className="font-accent text-center text-muted-foreground text-sm mt-8 italic"
        >
          Each insight came from the same hybrid process you're about to get.
        </p>
      </div>
    </section>
  );
};

export default ProofSection;
