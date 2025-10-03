import { Zap, Flame, Coins, ShoppingCart } from "lucide-react";
import growthExperimentsImage from "@/assets/growth-experiments-screenshot.png";
import web3RoastImage from "@/assets/web3-roast-screenshot.png";
import tokenHealthImage from "@/assets/token-health-scan-screenshot.png";
import shopifyGraderImage from "@/assets/shopify-grader-screenshot.png";

const ToolsSection = () => {
  const tools = [
    {
      icon: Zap,
      title: "Growth Experiments Framework",
      description: "Track, analyze, and learn from your growth experiments.",
      screenshot: growthExperimentsImage,
      color: "teal",
      iconGradient: "from-teal-500 to-teal-600",
      bgColor: "bg-teal-50",
      hoverGlow: "hover:shadow-teal-500/20"
    },
    {
      icon: Flame,
      title: "Web3 ROAST",
      description: "Actionable CRO insights tailored for crypto projects.",
      screenshot: web3RoastImage,
      color: "orange",
      iconGradient: "from-orange-500 to-orange-600",
      bgColor: "bg-orange-50",
      hoverGlow: "hover:shadow-orange-500/20"
    },
    {
      icon: Coins,
      title: "Token Health Scan",
      description: "Scan crypto projects and uncover critical risks before scaling.",
      screenshot: tokenHealthImage,
      color: "gold",
      iconGradient: "from-yellow-500 to-teal-500",
      bgColor: "bg-yellow-50",
      hoverGlow: "hover:shadow-yellow-500/20"
    },
    {
      icon: ShoppingCart,
      title: "Shopify Grader",
      description: "Benchmark and optimize your e-commerce store for conversions.",
      screenshot: shopifyGraderImage,
      color: "orange",
      iconGradient: "from-orange-500 to-orange-600",
      bgColor: "bg-orange-50",
      hoverGlow: "hover:shadow-orange-500/20"
    }
  ];

  return (
    <section className="py-24 bg-muted/50 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-accent/20" />
        <svg className="absolute top-0 left-0 w-full h-full" viewBox="0 0 400 400" fill="none">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="container mx-auto px-4 relative">
        {/* Section Header */}
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Tools I Built for Marketers & Founders
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Interactive GPTs and graders — designed to make growth insights fast, actionable, and practical.
          </p>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {tools.map((tool, index) => {
            const Icon = tool.icon;

            return (
              <div
                key={tool.title}
                className={`group bg-white rounded-2xl p-8 border border-border/50 shadow-sm hover:shadow-lg ${tool.hoverGlow} transition-all duration-300 hover:-translate-y-1 animate-fade-in`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Icon */}
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${tool.iconGradient} flex items-center justify-center mb-6 transition-all duration-300 group-hover:scale-110`}>
                  <Icon className="w-7 h-7 text-white" />
                </div>

                {/* Content */}
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-foreground mb-3">
                    {tool.title}
                  </h3>
                  <p className="text-muted-foreground text-base leading-relaxed mb-6">
                    {tool.description}
                  </p>
                </div>

                {/* Screenshot */}
                <div className="mb-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-4 overflow-hidden">
                  <img 
                    src={tool.screenshot} 
                    alt={`${tool.title} interface screenshot`}
                    className="w-full h-auto object-cover rounded-md shadow-sm transition-transform duration-300 group-hover:scale-105"
                  />
                </div>

                {/* CTA Button */}
                <button className="w-full px-6 py-3 rounded-xl font-semibold text-base bg-gradient-to-r from-[#FF8C42] to-[#FFB020] text-white transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-orange-500/30">
                  Try It Now →
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ToolsSection;