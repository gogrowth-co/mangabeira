import { Brain, Link2, BarChart3, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const CapabilitiesSection = () => {
  const capabilities = [
    {
      Icon: Brain,
      title: "AI-Powered Growth",
      description: "Optimize campaigns in real time, generate high-converting content, and unlock personalization at scale using AI.",
      tools: ["ChatGPT", "MidJourney", "Jasper"],
    },
    {
      Icon: Link2,
      title: "Web3 Community Building",
      description: "Build loyal audiences with tokenized incentives, Discord-native growth, and decentralized engagement tools.",
      tools: ["Binance", "WalletConnect", "Discord"],
    },
    {
      Icon: BarChart3,
      title: "Data-Driven Performance",
      description: "Turn complex data into clear growth insights with advanced attribution, automation, and scalable systems.",
      tools: ["Google Analytics", "Looker Studio", "HubSpot"],
    },
  ];

  return (
    <section className="relative w-full bg-[#FAFAFA] py-16 md:py-24 overflow-hidden">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Section Header */}
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-hero font-bold text-foreground mb-3">
            How I Help You Grow in the New Digital Era
          </h2>
          <p className="text-base md:text-lg text-muted-foreground font-body max-w-3xl mx-auto">
            Blending AI, Web3, and Performance Marketing to deliver measurable results.
          </p>
        </div>

        {/* 3-Column Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {capabilities.map((capability, index) => (
            <Card
              key={index}
              className="group p-8 bg-white border border-border hover:border-[#FF8C42]/30 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 animate-fade-in h-full flex flex-col"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardContent className="p-0 flex flex-col h-full">
                {/* Icon */}
                <div className="mb-6">
                  <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-[#FF8C42]/10 to-[#FFB020]/10 flex items-center justify-center group-hover:from-[#FF8C42]/20 group-hover:to-[#FFB020]/20 transition-colors duration-300">
                    <capability.Icon 
                      className="w-8 h-8 text-[#FF8C42] group-hover:scale-110 transition-transform duration-300" 
                      strokeWidth={1.5}
                    />
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-xl md:text-2xl font-hero font-bold text-foreground mb-3">
                  {capability.title}
                </h3>

                {/* Description */}
                <p className="text-sm md:text-base text-muted-foreground font-body mb-6 flex-grow">
                  {capability.description}
                </p>

                {/* Tool Logos/Badges */}
                <div className="flex flex-wrap gap-2">
                  {capability.tools.map((tool, toolIndex) => (
                    <span
                      key={toolIndex}
                      className="px-3 py-1 text-xs font-medium text-muted-foreground bg-muted rounded-full opacity-60 group-hover:opacity-100 group-hover:text-[#FF8C42] group-hover:bg-[#FF8C42]/10 transition-all duration-300"
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA Button */}
        <div className="text-center animate-fade-in" style={{ animationDelay: "300ms" }}>
          <Button
            size="hero"
            variant="hero"
            className="bg-gradient-to-r from-[#FF8C42] to-[#FFB020] text-white font-hero font-bold shadow-lg hover:shadow-xl hover:from-[#FF8C00] hover:to-[#FF6600] hover:scale-105 active:scale-95 transition-all duration-300"
          >
            See How I Work →
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CapabilitiesSection;
