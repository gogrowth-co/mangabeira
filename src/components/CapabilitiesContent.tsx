import { Brain, Link2, BarChart3 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Locale } from "@/lib/translations";

interface CapabilitiesContentProps {
  locale: Locale;
}

const CapabilitiesContent = ({ locale }: CapabilitiesContentProps) => {
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
    <section id="capabilities" className="relative w-full bg-[#FFFFFF] py-8 md:py-9 lg:py-10 overflow-hidden">
      {/* Subtle top separator */}
      <div className="absolute top-0 left-0 right-0 h-[120px] bg-gradient-to-b from-[rgba(10,31,52,0.06)] to-transparent pointer-events-none"></div>
      
      <div className="container mx-auto px-6 md:px-4 max-w-6xl">
        {/* Section Header */}
        <div className="text-center mb-4 md:mb-5 lg:mb-6 animate-fade-in">
          <h2 className="font-bold mb-3 md:mb-1.5 lg:mb-2" style={{ fontSize: 'clamp(32px, 3.5vw, 36px)', lineHeight: '1.2', fontWeight: 800, color: '#1A202C' }}>
            How I Help
          </h2>
          <p className="font-body max-w-3xl mx-auto" style={{ fontSize: '16px', fontWeight: 500, color: '#2D3748' }}>
            Blending AI, Web3, and Performance Marketing to deliver measurable results.
          </p>
        </div>

        {/* 3-Column Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-6 lg:gap-6 mb-6 md:mb-5 lg:mb-6">
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
            onClick={() => window.open('https://calendly.com/gabriel-mangabeira/15min', '_blank')}
          >
            Work With Me
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CapabilitiesContent;
