import { Medal, TrendingUp, DollarSign, Globe } from "lucide-react";
import { Card } from "@/components/ui/card";
import gabrielProfessional from "@/assets/gabriel-professional.webp";

const AboutSection = () => {
  const authoritySignals = [
    {
      Icon: Medal,
      title: "Olympic Athlete",
      description: "Represented Brazil at the Olympics",
    },
    {
      Icon: TrendingUp,
      title: "1M+ SEO Readers",
      description: "Reached through content with Neil Patel Brasil",
    },
    {
      Icon: DollarSign,
      title: "Multi-Million Campaigns",
      description: "Managed for Binance, Russell Marketing, and others",
    },
    {
      Icon: Globe,
      title: "Fluent in 3 Languages",
      description: "Portuguese, English, Spanish",
    },
  ];

  return (
    <section className="relative w-full bg-background py-16 md:py-24 overflow-hidden">
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
            {/* Headline */}
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-hero font-bold text-foreground leading-tight mb-6 animate-fade-in">
              From chasing{" "}
              <span className="text-gold-olympic">Olympic dreams</span> to helping
              brands grow — my journey is fueled by the same{" "}
              <span className="text-accent-blue">discipline</span>,{" "}
              <span className="text-accent-green">resilience</span>, and love for{" "}
              <span className="text-accent-orange">progress</span>.
            </h2>

            {/* Narrative */}
            <div className="text-lg md:text-xl text-muted-foreground font-body leading-relaxed mb-8 animate-fade-in">
              <p>
                I grew up in the water, chasing hundredths of a second. That pursuit of
                excellence took me to the Olympics, where I learned that discipline,
                resilience, and focus are everything. When I transitioned from the pool to
                the world of digital marketing, I brought those same principles with me —
                only now, instead of chasing gold medals, I help businesses chase
                measurable growth.
              </p>
            </div>

            {/* Authority signals */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in">
              {authoritySignals.map((signal, index) => (
                <Card
                  key={index}
                  className="group p-6 bg-card border border-border hover:border-gold-olympic/30 hover:shadow-lg transition-all duration-300 cursor-pointer hover:scale-105"
                  style={{
                    animationDelay: `${index * 150}ms`,
                  }}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gold-olympic to-gold-orange flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <signal.Icon
                          className="w-6 h-6 text-white"
                          strokeWidth={2}
                        />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-hero font-semibold text-foreground mb-1 group-hover:text-gold-olympic transition-colors">
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