import { BarChart3, Wallet, Eye, GitBranch, TrendingUp, Map } from "lucide-react";

const FeaturesGrid = () => {
  const features = [
    {
      icon: BarChart3,
      title: "Reddit Sentiment & Community Reality Check",
      description: "Know whether your community is actually healthy — or just loud."
    },
    {
      icon: Wallet,
      title: "Wallet Cohort Quality Scan",
      description: "See which wallets are real contributors vs empty noise."
    },
    {
      icon: Eye,
      title: "On-Chain Visibility Score",
      description: "How easily can new holders discover you across Web3 surfaces?"
    },
    {
      icon: GitBranch,
      title: "Cross-Platform Funnel Map",
      description: "Where users drop between Discord → Website → Mint → On-chain actions."
    },
    {
      icon: TrendingUp,
      title: "Token/Engagement Feedback Loop",
      description: "Understand what drives holding, selling, or ignoring your token."
    },
    {
      icon: Map,
      title: "90-Day Growth Plan",
      description: "Clear actions. No theory. No guesswork."
    }
  ];

  return (
    <section className="bg-navy py-20 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <h2 
          className="font-hero text-3xl font-bold text-white text-center mb-12"
        >
          What's Included in Your Audit
        </h2>

        {/* Features grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-xl p-6 border-l-4 border-aqua shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <Icon className="h-8 w-8 text-aqua mb-4" />
                <h3 
                  className="font-hero font-semibold text-navy mb-2"
                >
                  {feature.title}
                </h3>
                <p 
                  className="font-body text-gray-600 text-sm leading-relaxed"
                >
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturesGrid;
