import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, Brain, PenTool } from "lucide-react";

const ServicesSection = () => {
  const services = [
    {
      icon: TrendingUp,
      title: "Growth Marketing & SEO",
      description: "AI-powered SEO, Paid Media, and performance strategies that deliver measurable growth.",
      cta: "Start Your Growth Sprint",
      accent: "from-orange-500 to-gold-olympic",
      hoverColor: "hover:border-orange-500/50",
    },
    {
      icon: Brain,
      title: "Web3 & AI Strategy", 
      description: "Helping brands and projects unlock visibility in Web3 and leverage AI for scale.",
      cta: "Book a Strategy Session",
      accent: "from-blue-500 to-purple-600",
      hoverColor: "hover:border-blue-500/50",
    },
    {
      icon: PenTool,
      title: "Content & Thought Leadership",
      description: "Building authority through multilingual content (EN, ES, PT-BR), LinkedIn growth, and storytelling.",
      cta: "Explore My Work",
      accent: "from-green-500 to-teal-600",
      hoverColor: "hover:border-green-500/50",
    },
  ];

  return (
    <section className="py-20 md:py-28 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="font-hero font-bold text-text-primary mb-4" style={{ fontSize: 'clamp(24px, 3.5vw, 36px)', lineHeight: '1.2' }}>
            How I Help
          </h2>
          <p className="text-text-secondary font-body max-w-3xl mx-auto" style={{ fontSize: 'clamp(15px, 1.4vw, 17px)', lineHeight: '1.6' }}>
            Clear engagements for fast outcomes.
          </p>
        </div>

        {/* Services Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {services.map((service, index) => {
            const IconComponent = service.icon;
            return (
              <Card 
                key={index}
                className={`group p-8 h-full border border-border bg-card transition-all duration-300 ${service.hoverColor} hover:-translate-y-1 animate-fade-in`}
                style={{ 
                  animationDelay: `${index * 200}ms`,
                  borderRadius: '18px',
                  boxShadow: '0 6px 24px rgba(15, 23, 42, 0.08)'
                }}
              >
                <CardContent className="p-0 flex flex-col h-full">
                  {/* Icon */}
                  <div className={`w-16 h-16 rounded-lg bg-gradient-to-br ${service.accent} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent className="h-8 w-8 text-white" />
                  </div>

                  {/* Content */}
                  <div className="flex-grow">
                    <h3 className="text-2xl font-hero font-bold text-navy-deep mb-4">
                      {service.title}
                    </h3>
                    <p className="text-muted-foreground font-body leading-relaxed mb-8">
                      {service.description}
                    </p>
                  </div>

                  {/* CTA Button */}
                  <Button 
                    variant="outline" 
                    size="lg"
                    className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 font-hero font-semibold"
                  >
                    {service.cta}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;