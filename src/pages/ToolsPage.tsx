import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const tools = [
  {
    title: "DeFi Tokenomics Simulator",
    description: "Model your token economy with real-time 5-year projections before you launch.",
    category: "DeFi Tool",
    categoryColor: "text-blue-600 border-blue-300 bg-blue-50",
    icon: "⚙️",
    iconBg: "bg-blue-100",
    tags: ["React", "Recharts", "TypeScript"],
    year: "2026",
    href: "/tools/tokenomics-simulator",
    internal: true,
    previewText: "DeFi Tokenomics Simulator",
    previewSubtitle: "5-Year Token Projections",
  },
  {
    title: "Token Health Scan",
    description: "Scan crypto projects and uncover critical risks before scaling.",
    category: "Crypto Risk Tool",
    categoryColor: "text-purple-600 border-purple-300 bg-purple-50",
    icon: "🔗",
    iconBg: "bg-green-100",
    tags: ["Web3 APIs", "NextJS", "OpenAI"],
    year: "2024",
    href: "https://tokenhealthscan.com",
    internal: false,
    previewText: "Token Health Scan",
  },
  {
    title: "Web3 ROAST",
    description: "Actionable CRO insights tailored for crypto projects.",
    category: "Crypto CRO Tool",
    categoryColor: "text-orange-600 border-orange-300 bg-orange-50",
    icon: "🔥",
    iconBg: "bg-orange-100",
    tags: ["NextJS", "OpenAI", "Tailwind"],
    year: "Beta",
    href: "https://web3roast.com",
    internal: false,
    previewText: "Web3 ROAST",
  },
  {
    title: "Growth Experiments Framework",
    description: "Track, analyze, and learn from your growth experiments.",
    category: "Growth Tool",
    categoryColor: "text-teal-600 border-teal-300 bg-teal-50",
    icon: "⚡",
    iconBg: "bg-teal-100",
    tags: ["Airtable", "Notion", "Zapier"],
    year: "2024",
    href: "https://mangabeira.notion.site",
    internal: false,
    previewText: "Growth Experiments Framework",
  },
  {
    title: "Shopify Grader",
    description: "Benchmark and optimize your e-commerce store for conversions.",
    category: "E-commerce Tool",
    categoryColor: "text-green-600 border-green-300 bg-green-50",
    icon: "🛒",
    iconBg: "bg-orange-100",
    tags: ["Shopify API", "NextJS", "CRO"],
    year: "2024",
    href: "https://shopifygrader.com",
    internal: false,
    previewText: "Shopify Grader",
  },
];

const ToolsPage = () => {
  return (
    <>
      <Helmet>
        <title>Tools — Web3 Growth Tools & Simulators | Mangabeira.net</title>
        <meta name="description" content="Free interactive tools for Web3 founders and growth operators. Token economy simulator, crypto risk scanner, CRO grader, and growth frameworks." />
        <link rel="canonical" href="https://mangabeira.net/tools" />
      </Helmet>

      <Header locale="en" />

      <main className="min-h-screen bg-background pt-24">
        {/* Page Header */}
        <div className="text-center pb-12 px-4">
          <h1 className="font-heading font-bold text-navy-deep" style={{ fontSize: "clamp(32px, 5vw, 48px)", lineHeight: 1.1 }}>
            Tools
          </h1>
          <p className="mt-3 font-body text-charcoal/60 max-w-2xl mx-auto" style={{ fontSize: "18px" }}>
            Interactive calculators, graders, and frameworks built for Web3 growth operators.
          </p>
        </div>

        {/* Tools Grid */}
        <div className="container mx-auto px-4 pb-20 max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {tools.map((tool) => (
              <div
                key={tool.title}
                className="group bg-card border border-border shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
                style={{ borderRadius: "12px" }}
              >
                <div className="p-6">
                  {/* Top row: icon + badge */}
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-10 h-10 rounded-lg ${tool.iconBg} flex items-center justify-center text-xl`}>
                      {tool.icon}
                    </div>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${tool.categoryColor}`}>
                      {tool.category}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h2 className="font-heading font-semibold text-navy-deep mb-1.5" style={{ fontSize: "18px" }}>
                    {tool.title}
                  </h2>
                  <p className="font-body text-charcoal/60 mb-4" style={{ fontSize: "14px", lineHeight: 1.6 }}>
                    {tool.description}
                  </p>

                  {/* Preview */}
                  <div
                    className="aspect-video rounded-lg flex flex-col items-center justify-center mb-4"
                    style={{ backgroundColor: "#0A2540" }}
                  >
                    <span className="font-heading font-bold text-white" style={{ fontSize: "16px" }}>
                      {tool.previewText}
                    </span>
                    {tool.previewSubtitle && (
                      <span className="font-body text-aqua-bright mt-1" style={{ fontSize: "13px" }}>
                        {tool.previewSubtitle}
                      </span>
                    )}
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {tool.tags.map((tag) => (
                      <span key={tag} className="px-2.5 py-0.5 rounded-full font-body text-charcoal/70 bg-muted border border-border" style={{ fontSize: "12px" }}>
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Footer row */}
                  <div className="flex items-center justify-between pt-4 border-t border-border/50">
                    <span className="font-body text-charcoal/40" style={{ fontSize: "12px" }}>{tool.year}</span>
                    {tool.internal ? (
                      <Link
                        to={tool.href}
                        className="inline-flex items-center gap-1 px-4 py-2 rounded-md text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5"
                        style={{ background: "linear-gradient(135deg, #FFB800, #FF9500)", boxShadow: "0 4px 12px hsl(45 100% 50% / 0.3)" }}
                      >
                        Try It Now →
                      </Link>
                    ) : (
                      <a
                        href={tool.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-4 py-2 rounded-md text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5"
                        style={{ background: "linear-gradient(135deg, #FFB800, #FF9500)", boxShadow: "0 4px 12px hsl(45 100% 50% / 0.3)" }}
                      >
                        Try It Now →
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default ToolsPage;
