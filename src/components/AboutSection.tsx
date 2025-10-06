import { Medal, Zap, TrendingUp, Globe } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import gabrielProfessional from "@/assets/gabriel-professional-new.webp";

const AboutSection = () => {
  const authoritySignals = [
    {
      Icon: Medal,
      title: "2x Olympian",
      description: "Represented Brazil on the world stage.",
    },
    {
      Icon: Zap,
      title: "From Olympic Pools to Digital Growth",
      description: "Applied Olympic discipline to accelerate measurable digital growth.",
    },
    {
      Icon: TrendingUp,
      title: "Marketing Leader",
      description: "Drove growth for global brands including Binance and Coca-Cola.",
    },
    {
      Icon: Globe,
      title: "Global Citizen",
      description: "Campaigns across 3 languages: English, Portuguese, and Spanish.",
    },
  ];

  return (
    <section id="about" className="relative w-full bg-gradient-to-b from-[#F8FAFD] to-[#FFFFFF] py-12 md:py-16 lg:py-20 overflow-hidden">
      {/* Subtle top separator */}
      <div className="absolute top-0 left-0 right-0 h-[120px] bg-gradient-to-b from-[rgba(10,31,52,0.06)] to-transparent pointer-events-none"></div>
      
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Section Header */}
        <div className="text-center mb-8 lg:mb-10">
          <h2 className="font-hero font-bold text-[#0B1B2B] mb-2" style={{ fontSize: 'clamp(28px, 3vw, 36px)' }}>
            My Story
          </h2>
          <p className="text-[#5B6B7C] font-medium text-base md:text-lg max-w-3xl mx-auto">
            From Olympic discipline to digital growth — a journey of focus, performance, and measurable impact.
          </p>
        </div>

        {/* Two-column layout: image left, content right */}
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
          {/* Professional headshot */}
          <div className="w-full lg:w-2/5 flex justify-center lg:justify-start">
            <div className="relative">
              <div className="w-72 h-72 md:w-80 md:h-80 lg:w-[360px] lg:h-[360px] rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-gray-light to-white-soft animate-fade-in">
                <img
                  src={gabrielProfessional}
                  alt="Gabriel Mangabeira - Olympic athlete turned digital strategist"
                  className="w-full h-full object-cover object-center transform transition-transform duration-700 hover:scale-105"
                />
              </div>
              {/* Decorative accent */}
              <div className="absolute -bottom-3 -right-3 w-16 h-16 bg-gradient-to-br from-[#FF8C1A] to-[#FFB347] rounded-full opacity-20 blur-xl"></div>
            </div>
          </div>

          {/* Content */}
          <div className="w-full lg:w-3/5 text-center lg:text-left">
            {/* Narrative */}
            <div className="text-base md:text-lg text-[#4A5568] font-body mb-6 animate-fade-in" style={{ lineHeight: '1.6em', maxWidth: '65ch' }}>
              <p className="mb-4">
                I grew up in the water, chasing hundredths of a second. That pursuit of excellence took me to the Olympics, where I learned that discipline, resilience, and focus are everything.
              </p>
              <p>
                When I transitioned from the pool to the world of digital marketing, I carried those same principles with me — only now, instead of chasing medals, I help businesses chase measurable growth.
              </p>
            </div>

            {/* Authority signals */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 animate-fade-in">
              {authoritySignals.map((signal, index) => (
                <Card
                  key={index}
                  className="group p-4 bg-card border border-border hover:border-gold-olympic/30 hover:shadow-lg transition-all duration-300 cursor-pointer hover:scale-105 hover:bg-gradient-to-br hover:from-background hover:to-gray-light"
                  style={{
                    animationDelay: `${index * 100}ms`,
                  }}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold-olympic to-gold-orange flex items-center justify-center group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-gold-olympic/30 transition-all duration-300">
                        <signal.Icon
                          className="w-5 h-5 text-white"
                          strokeWidth={2}
                        />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-hero font-semibold text-foreground text-sm mb-0.5 group-hover:text-gold-olympic transition-colors duration-300">
                        {signal.title}
                      </h3>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {signal.description}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* CTA Button */}
            <div className="flex justify-center lg:justify-start animate-fade-in">
              <Button 
                size="lg" 
                className="group text-white font-semibold transition-all duration-300 hover:-translate-y-0.5"
                style={{
                  background: 'linear-gradient(90deg, #FF8C1A 0%, #FFB347 100%)',
                  borderRadius: '6px',
                  fontWeight: 600,
                  boxShadow: '0 4px 8px rgba(255, 140, 26, 0.2)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 6px 12px rgba(255, 140, 26, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = '0 4px 8px rgba(255, 140, 26, 0.2)';
                }}
              >
                Read My Full Story
                <span className="ml-2 group-hover:translate-x-1 transition-transform duration-300">→</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;