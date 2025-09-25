import { Search, TrendingUp, User, Store } from "lucide-react";

const ToolsSection = () => {
  const tools = [
    {
      icon: Search,
      title: "SEO GPT",
      description: "Get instant SEO audits & optimization tips.",
      color: "blue",
      accent: "border-blue-500/50 shadow-blue-500/20"
    },
    {
      icon: TrendingUp,
      title: "CRO GPT",
      description: "Uncover friction points in your funnel.",
      color: "teal",
      accent: "border-teal-500/50 shadow-teal-500/20"
    },
    {
      icon: User,
      title: "Personal Brand GPT",
      description: "Build your online presence with clarity.",
      color: "purple",
      accent: "border-purple-500/50 shadow-purple-500/20"
    },
    {
      icon: Store,
      title: "Shopify Grader & Web3ROAST",
      description: "Benchmark your store or Web3 project.",
      color: "orange",
      accent: "border-orange-500/50 shadow-orange-500/20"
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
          <h2 className="text-4xl md:text-5xl font-hero font-bold text-foreground mb-6">
            Tools I Built for Marketers & Founders
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Try my interactive GPTs and graders — designed to make growth insights fast, actionable, and practical.
          </p>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {tools.map((tool, index) => {
            const Icon = tool.icon;
            const colorMap = {
              blue: "text-blue-600 group-hover:text-blue-700",
              teal: "text-teal-600 group-hover:text-teal-700", 
              purple: "text-purple-600 group-hover:text-purple-700",
              orange: "text-orange-600 group-hover:text-orange-700"
            };
            const bgMap = {
              blue: "bg-blue-50 group-hover:bg-blue-100",
              teal: "bg-teal-50 group-hover:bg-teal-100",
              purple: "bg-purple-50 group-hover:bg-purple-100", 
              orange: "bg-orange-50 group-hover:bg-orange-100"
            };
            const buttonMap = {
              blue: "bg-blue-600 hover:bg-blue-700 text-white",
              teal: "bg-teal-600 hover:bg-teal-700 text-white",
              purple: "bg-purple-600 hover:bg-purple-700 text-white",
              orange: "bg-orange-600 hover:bg-orange-700 text-white"
            };

            return (
              <div
                key={tool.title}
                className={`group bg-background rounded-2xl p-8 border border-border shadow-sm hover:shadow-lg hover:${tool.accent} transition-all duration-300 hover:-translate-y-2 animate-fade-in`}
                style={{ animationDelay: `${index * 200}ms` }}
              >
                {/* Icon */}
                <div className={`w-16 h-16 rounded-2xl ${bgMap[tool.color]} flex items-center justify-center mb-6 transition-all duration-300 group-hover:scale-110`}>
                  <Icon className={`w-8 h-8 ${colorMap[tool.color]} transition-colors duration-300`} />
                </div>

                {/* Content */}
                <div className="mb-8">
                  <h3 className="text-2xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors duration-300">
                    {tool.title}
                  </h3>
                  <p className="text-muted-foreground text-lg leading-relaxed">
                    {tool.description}
                  </p>
                </div>

                {/* CTA Button */}
                <button className={`w-full md:w-auto px-8 py-3 rounded-xl font-semibold text-lg ${buttonMap[tool.color]} transition-all duration-300 hover:scale-105 hover:shadow-lg`}>
                  Try It Now
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