import { Button } from "@/components/ui/button";
import { Medal, TrendingUp, Globe } from "lucide-react";
import olympicPoolBg from "@/assets/olympic-pool-background.png";
import gabrielAvatar from "@/assets/gabriel-avatar.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image - Olympic Pool */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: `url(${olympicPoolBg})`
        }}
      />
      
      {/* Strong Dark Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/65 to-black/70" />
      
      {/* Content - Left-Aligned Layout with Right Headshot */}
      <div className="relative z-10 container mx-auto px-4 py-16 max-w-7xl">
        <div className="flex flex-col lg:flex-row items-center lg:items-start justify-between gap-12 lg:gap-16">
          
          {/* Text Content - Left Aligned */}
          <div className="order-2 lg:order-1 text-center lg:text-left max-w-2xl">
            {/* Main Headline - Name - Extra Large and Bold */}
            <h1 
              className="font-accent font-bold text-white-pure mb-6 leading-tight animate-fade-in text-[2.5rem] sm:text-5xl md:text-6xl lg:text-[3.5rem] xl:text-7xl"
              style={{ textShadow: 'var(--text-shadow-hero)' }}
            >
              Gabriel Mangabeira
            </h1>
            
            {/* Role - Medium Weight, Off-White */}
            <h2 
              className="font-body font-medium text-gray-200 mb-8 animate-fade-in text-lg sm:text-xl md:text-2xl"
              style={{ animationDelay: '0.1s' }}
            >
              Olympian & Growth Marketing Strategist
            </h2>
            
            {/* Tagline - Generous Spacing */}
            <p 
              className="font-body text-white-pure text-base sm:text-lg md:text-xl mb-10 leading-relaxed animate-fade-in"
              style={{ textShadow: 'var(--text-shadow-subtle)', animationDelay: '0.2s' }}
            >
              Turning Olympic discipline into measurable digital growth.
            </p>
            
            {/* Credibility Stats - Bold Numbers, Centered Dots */}
            <div className="mb-12 animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <div className="flex flex-col sm:flex-row items-center lg:items-start lg:justify-start justify-center gap-4 sm:gap-5 text-white-pure text-sm sm:text-base md:text-lg">
                <div className="flex items-center gap-2">
                  <Medal size={22} color="#FFC107" strokeWidth={2.5} className="flex-shrink-0" />
                  <span className="font-body"><span className="font-bold">1M+</span> SEO Readers</span>
                </div>
                <span className="hidden sm:inline text-white-pure/40">•</span>
                <div className="flex items-center gap-2">
                  <Globe size={22} color="#FFC107" strokeWidth={2.5} className="flex-shrink-0" />
                  <span className="font-body"><span className="font-bold">$3.3M+</span> Crowdfunded</span>
                </div>
                <span className="hidden sm:inline text-white-pure/40">•</span>
                <div className="flex items-center gap-2">
                  <TrendingUp size={22} color="#FFC107" strokeWidth={2.5} className="flex-shrink-0" />
                  <span className="font-body"><span className="font-bold">Millions</span> Managed</span>
                </div>
              </div>
            </div>
            
            {/* Call-to-Action Buttons - Bold and Clickable */}
            <div className="flex flex-col sm:flex-row gap-4 items-center lg:items-start lg:justify-start justify-center animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <Button 
                variant="hero" 
                size="hero" 
                className="w-full sm:w-auto px-12 py-6 font-bold text-lg sm:text-xl bg-gradient-cta text-white shadow-button hover:shadow-button-hover hover:scale-105 transition-all duration-300"
              >
                Start Your Growth Sprint
              </Button>
              <Button 
                variant="hero-outline" 
                size="hero" 
                className="w-full sm:w-auto px-10 py-5 text-base sm:text-lg bg-transparent border-2 border-white text-white hover:bg-aqua-bright/20 hover:border-aqua-bright hover:scale-105 transition-all duration-300"
              >
                See My Results
              </Button>
            </div>
          </div>

          {/* Profile Photo - Large Circular with Olympic-Blue Glow */}
          <div className="order-1 lg:order-2 animate-fade-in">
            <div className="relative">
              {/* Olympic-Blue Glowing Ring Effect */}
              <div className="absolute inset-0 rounded-full bg-aqua-bright/40 blur-2xl animate-pulse"></div>
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-aqua-bright/30 to-gold-warm/20 blur-xl"></div>
              {/* Profile Image - Large and Prominent */}
              <div className="relative w-40 h-40 sm:w-44 sm:h-44 md:w-52 md:h-52 lg:w-60 lg:h-60 xl:w-64 xl:h-64 rounded-full overflow-hidden border-4 border-aqua-bright shadow-2xl flex-shrink-0">
                <img 
                  src={gabrielAvatar} 
                  alt="Gabriel Mangabeira - Olympian and Growth Marketing Strategist headshot" 
                  className="w-full h-full object-cover object-center"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;