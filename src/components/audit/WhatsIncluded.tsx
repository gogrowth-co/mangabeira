const WhatsIncluded = () => {
  const features = [
    {
      icon: "💬",
      title: "Reddit Sentiment & Community Health Check",
      description: "See what your users actually think — unfiltered."
    },
    {
      icon: "👛",
      title: "Wallet Cohort Quality Scan",
      description: "Identify real participants vs tourists."
    },
    {
      icon: "🔍",
      title: "On-Chain Visibility Score",
      description: "See how discoverable you really are."
    },
    {
      icon: "🔀",
      title: "Cross-Platform Funnel Map",
      description: "Understand how people move Discord → Web → Wallet → Action."
    },
    {
      icon: "🔄",
      title: "Token/Engagement Feedback Loop",
      description: "See how holdings, utility, and communication interact."
    },
    {
      icon: "📋",
      title: "90-Day Growth Plan",
      description: "Clear actions. No guesswork."
    }
  ];

  return (
    <section className="py-20 lg:py-28 bg-white">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-heading font-bold text-3xl md:text-4xl text-navy mb-4">
            What's Included
          </h2>
          <p className="font-body-audit text-lg text-charcoal/70">
            A complete Web3 Growth Audit — delivered via Notion + Loom walkthrough
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {features.map((item, i) => (
            <div 
              key={i} 
              className="bg-light-gray rounded-xl p-6 border-l-4 border-aqua hover:shadow-lg hover:-translate-y-1 transition-all duration-200"
            >
              <span className="text-3xl mb-4 block">{item.icon}</span>
              <h3 className="font-heading font-semibold text-lg text-navy mb-2">
                {item.title}
              </h3>
              <p className="font-body-audit text-charcoal/70 text-sm">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhatsIncluded;
