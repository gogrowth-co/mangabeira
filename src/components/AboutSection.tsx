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
    <section id="about" className="relative w-full bg-[#F7FAFC] py-8 md:py-9 lg:py-10 overflow-hidden">
      {/* Subtle top separator */}
      <div className="absolute top-0 left-0 right-0 h-[120px] bg-gradient-to-b from-[rgba(10,31,52,0.06)] to-transparent pointer-events-none"></div>
      
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Mobile-first layout: image stacked on top */}
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
          {/* Professional headshot */}
          <div className="w-full lg:w-2/5 flex justify-center lg:justify-start">
            <div className="relative">
              <div className="w-80 h-80 md:w-96 md:h-96 lg:w-[420px] lg:h-[420px] rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-gray-light to-white-soft animate-fade-in">
                <img
                  src={gabrielProfessional}
                  alt="Gabriel Mangabeira - Olympic athlete turned digital strategist"
                  className="w-full h-full object-cover object-center transform transition-transform duration-700 hover:scale-105"
                />
              </div>
              {/* Decorative accent */}
              <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-gradient-cta rounded-full opacity-20 animate-pulse"></div>
            </div>
          </div>

          {/* Content */}
          <div className="w-full lg:w-3/5 text-center lg:text-left">
            {/* Narrative */}
            <div className="text-lg md:text-xl text-muted-foreground font-body leading-relaxed mb-8 animate-fade-in">
              <p className="mb-4">
                From chasing Olympic dreams to driving digital growth — my journey is fueled by the same discipline, resilience, and love for progress.
              </p>
              <p className="mb-4">
                I grew up in the water, chasing hundredths of a second. That pursuit of excellence took me to the Olympics, where I learned that discipline, resilience, and focus are everything.
              </p>
              <p>
                When I transitioned from the pool to the world of digital marketing, I carried those same principles with me — only now, instead of chasing medals, I help businesses chase measurable growth.
              </p>
            </div>

            {/* CTA Button */}
            <div className="mb-8 animate-fade-in">
              <Button 
                size="lg" 
                className="group bg-gradient-to-r from-[#FF8C42] to-[#FFB020] text-white hover:shadow-[0_0_30px_rgba(255,176,32,0.6)] hover:scale-105 transition-all duration-300"
              >
                Read My Full Story
                <span className="ml-2 group-hover:translate-x-1 transition-transform duration-300">→</span>
              </Button>
            </div>

            {/* Authority signals */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-6 lg:gap-6 animate-fade-in">
              {authoritySignals.map((signal, index) => (
                <Card
                  key={index}
                  className="group p-6 bg-card border border-border hover:border-gold-olympic/30 hover:shadow-xl transition-all duration-500 cursor-pointer hover:scale-110 hover:bg-gradient-to-br hover:from-background hover:to-gray-light animate-fade-in"
                  style={{
                    animationDelay: `${index * 100}ms`,
                  }}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gold-olympic to-gold-orange flex items-center justify-center group-hover:scale-125 group-hover:shadow-lg group-hover:shadow-gold-olympic/30 transition-all duration-500">
                        <signal.Icon
                          className="w-6 h-6 text-white"
                          strokeWidth={2}
                        />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-hero font-semibold text-foreground mb-1 group-hover:text-gold-olympic transition-colors duration-300">
                        {signal.title}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {signal.description}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;