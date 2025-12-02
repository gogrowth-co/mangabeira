const FounderRealityCheck = () => {
  const painPoints = [
    { icon: "💬", text: "Reddit chaos" },
    { icon: "🔊", text: "Discord noise" },
    { icon: "📊", text: "Fragmented on-chain data" },
    { icon: "📈", text: "Unstructured dashboards" },
    { icon: "🎯", text: "Gut-based decisions" },
  ];

  return (
    <section className="py-20 lg:py-28 bg-white">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Headline */}
          <h2 className="font-heading font-bold text-3xl md:text-4xl text-navy mb-6">
            If your growth feels chaotic, it's not your fault.
          </h2>
          
          {/* Body */}
          <p className="font-body-audit text-lg text-charcoal mb-8 leading-relaxed">
            Most Web3 teams operate blind because insights are scattered across:
          </p>
          
          {/* Pain Points Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
            {painPoints.map((item, i) => (
              <div key={i} className="flex items-center gap-3 p-4 bg-light-gray rounded-lg hover:shadow-md transition-shadow">
                <span className="text-2xl">{item.icon}</span>
                <span className="font-body-audit text-charcoal">{item.text}</span>
              </div>
            ))}
          </div>
          
          {/* Resolution */}
          <div className="bg-gradient-to-r from-aqua/10 to-transparent p-6 rounded-xl border-l-4 border-aqua">
            <p className="font-body-audit text-lg text-charcoal leading-relaxed">
              This audit pulls everything together into one clear, actionable picture — so you know exactly where momentum is leaking and how to fix it.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FounderRealityCheck;
