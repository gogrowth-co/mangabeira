import { Zap, Flame, Coins, ShoppingCart } from "lucide-react";
import growthExperimentsImage from "@/assets/growth-experiments-screenshot.png";
import web3RoastImage from "@/assets/web3-roast-screenshot.png";
import tokenHealthImage from "@/assets/token-health-scan-screenshot.png";
import shopifyGraderImage from "@/assets/shopify-grader-screenshot.png";
import { Locale, t } from "@/lib/translations";

interface ToolsContentProps {
  locale: Locale;
}

const ToolsContent = ({ locale }: ToolsContentProps) => {
  const tools = [
    {
      icon: Zap,
      title: t('tools', 'growth_experiments_title', locale),
      description: t('tools', 'growth_experiments_description', locale),
      screenshot: growthExperimentsImage,
      category: t('tools', 'growth_experiments_category', locale),
      categoryColor: "bg-teal-100 text-teal-700 border-teal-200",
      tags: ["Airtable", "Notion", "Zapier"],
      year: "2024",
      iconGradient: "from-teal-500 to-teal-600",
      hoverGlow: "hover:shadow-teal-500/20",
      url: "https://gmangabeira.notion.site/Growth-Experiments-Framework-Template-2a0e522c9822471eb22aad79a4117753"
    },
    {
      icon: Flame,
      title: t('tools', 'web3_roast_title', locale),
      description: t('tools', 'web3_roast_description', locale),
      screenshot: web3RoastImage,
      category: t('tools', 'web3_roast_category', locale),
      categoryColor: "bg-orange-100 text-orange-700 border-orange-200",
      tags: ["NextJS", "OpenAI", "Tailwind"],
      year: "Beta",
      iconGradient: "from-orange-500 to-orange-600",
      hoverGlow: "hover:shadow-orange-500/20",
      url: "https://web3roast.com"
    },
    {
      icon: Coins,
      title: t('tools', 'token_health_title', locale),
      description: t('tools', 'token_health_description', locale),
      screenshot: tokenHealthImage,
      category: t('tools', 'token_health_category', locale),
      categoryColor: "bg-purple-100 text-purple-700 border-purple-200",
      tags: ["Web3 APIs", "NextJS", "OpenAI"],
      year: "2024",
      iconGradient: "from-yellow-500 to-teal-500",
      hoverGlow: "hover:shadow-yellow-500/20",
      url: "https://tokenhealthscan.com"
    },
    {
      icon: ShoppingCart,
      title: t('tools', 'shopify_grader_title', locale),
      description: t('tools', 'shopify_grader_description', locale),
      screenshot: shopifyGraderImage,
      category: t('tools', 'shopify_grader_category', locale),
      categoryColor: "bg-green-100 text-green-700 border-green-200",
      tags: ["Shopify API", "NextJS", "CRO"],
      year: "2024",
      iconGradient: "from-orange-500 to-orange-600",
      hoverGlow: "hover:shadow-orange-500/20",
      url: "https://gmangabeira.notion.site/Shopify-Performance-Grader-The-Complete-Growth-Checklist-82d1a338b87746898c3329f3f2be81ff?pvs=74"
    }
  ];

  return (
    <section id="tools" className="py-8 md:py-9 lg:py-10 bg-[#FFF7EA] relative overflow-hidden">
      {/* Subtle top separator */}
      <div className="absolute top-0 left-0 right-0 h-[120px] bg-gradient-to-b from-[rgba(10,31,52,0.06)] to-transparent pointer-events-none z-10"></div>
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

      <div className="container mx-auto px-6 md:px-4 relative">
        {/* Section Header */}
        <div className="text-center mb-4 md:mb-5 lg:mb-6 animate-fade-in">
          <h2 className="font-bold mb-3 md:mb-1.5 lg:mb-2" style={{ fontSize: 'clamp(32px, 3.5vw, 36px)', lineHeight: '1.2', fontWeight: 800, color: '#1A202C' }}>
            {t('tools', 'section_title', locale)}
          </h2>
          <p className="font-body max-w-3xl mx-auto" style={{ fontSize: '16px', fontWeight: 500, color: '#2D3748' }}>
            {t('tools', 'section_subtitle', locale)}
          </p>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-6 lg:gap-6 max-w-6xl mx-auto">
          {tools.map((tool, index) => {
            const Icon = tool.icon;

            return (
              <div
                key={tool.title}
                className={`group bg-card p-6 border border-border ${tool.hoverGlow} transition-all duration-300 hover:-translate-y-1 animate-fade-in relative`}
                style={{ 
                  animationDelay: `${index * 100}ms`,
                  borderRadius: '18px',
                  boxShadow: '0 6px 24px rgba(15, 23, 42, 0.08)'
                }}
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

                {/* Screenshot - Max Height 190px */}
                <div className="mb-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-3 overflow-hidden" style={{ maxHeight: '190px' }}>
                  <img 
                    src={tool.screenshot} 
                    alt={`${tool.title} interface screenshot`}
                    className="w-full h-auto max-h-[166px] object-cover object-top rounded-md shadow-sm transition-transform duration-300 group-hover:scale-105"
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
                  <button 
                    className="px-5 py-2 text-sm text-white font-semibold transition-all duration-300 hover:-translate-y-0.5"
                    style={{
                      background: 'linear-gradient(90deg, #FF8C1A 0%, #FFB347 100%)',
                      borderRadius: '6px',
                      fontWeight: 600,
                      boxShadow: '0 4px 8px rgba(255, 140, 26, 0.2)',
                    }}
                    onClick={() => window.open(tool.url, '_blank')}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow = '0 6px 12px rgba(255, 140, 26, 0.3)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow = '0 4px 8px rgba(255, 140, 26, 0.2)';
                    }}
                  >
                    {t('tools', 'cta_try_now', locale)}
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

export default ToolsContent;
