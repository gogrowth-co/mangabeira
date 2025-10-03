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
      category: "Growth Tool",
      categoryColor: "bg-teal-100 text-teal-700 border-teal-200",
      tags: ["Airtable", "Notion", "Zapier"],
      year: "2024",
      iconGradient: "from-teal-500 to-teal-600",
      hoverGlow: "hover:shadow-teal-500/20"
    },
    {
      icon: Flame,
      title: "Web3 ROAST",
      description: "Actionable CRO insights tailored for crypto projects.",
      screenshot: web3RoastImage,
      category: "Crypto CRO Tool",
      categoryColor: "bg-orange-100 text-orange-700 border-orange-200",
      tags: ["NextJS", "OpenAI", "Tailwind"],
      year: "Beta",
      iconGradient: "from-orange-500 to-orange-600",
      hoverGlow: "hover:shadow-orange-500/20"
    },
    {
      icon: Coins,
      title: "Token Health Scan",
      description: "Scan crypto projects and uncover critical risks before scaling.",
      screenshot: tokenHealthImage,
      category: "Crypto Risk Tool",
      categoryColor: "bg-purple-100 text-purple-700 border-purple-200",
      tags: ["Web3 APIs", "NextJS", "OpenAI"],
      year: "2024",
      iconGradient: "from-yellow-500 to-teal-500",
      hoverGlow: "hover:shadow-yellow-500/20"
    },
    {
      icon: ShoppingCart,
      title: "Shopify Grader",
      description: "Benchmark and optimize your e-commerce store for conversions.",
      screenshot: shopifyGraderImage,
      category: "E-commerce Tool",
      categoryColor: "bg-green-100 text-green-700 border-green-200",
      tags: ["Shopify API", "NextJS", "CRO"],
      year: "2024",
      iconGradient: "from-orange-500 to-orange-600",
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
                className={`group bg-white rounded-2xl p-6 border border-border/50 shadow-sm hover:shadow-xl ${tool.hoverGlow} transition-all duration-300 hover:-translate-y-1 animate-fade-in relative`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Category Badge - Top Right */}
                <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold border ${tool.categoryColor}`}>
                  {tool.category}
                </div>

                {/* Icon */}
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${tool.iconGradient} flex items-center justify-center mb-4 transition-all duration-300 group-hover:scale-110`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>

                {/* Title & Description */}
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-foreground mb-2">
                    {tool.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {tool.description}
                  </p>
                </div>

                {/* Screenshot - Reduced Height */}
                <div className="mb-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-3 overflow-hidden">
                  <img 
                    src={tool.screenshot} 
                    alt={`${tool.title} interface screenshot`}
                    className="w-full h-32 object-cover object-top rounded-md shadow-sm transition-transform duration-300 group-hover:scale-105"
                  />
                </div>

                {/* Tech Stack Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {tool.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 text-xs font-medium text-gray-600 bg-gray-100 border border-gray-200 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Footer Row */}
                <div className="flex items-center justify-between pt-4 border-t border-border/50">
                  {/* Metadata */}
                  <span className="text-xs text-muted-foreground font-medium">
                    {tool.year}
                  </span>

                  {/* CTA Button */}
                  <button className="px-5 py-2 rounded-lg font-semibold text-sm bg-gradient-to-r from-[#FF8C42] to-[#FFB020] text-white transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-orange-500/30">
                    Try It Now →
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ToolsSection;