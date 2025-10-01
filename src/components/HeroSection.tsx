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
      
      {/* Subtle Dark Overlay for Text Readability */}
      <div className="absolute inset-0 bg-black/65" />
      
      {/* Content - Centered Layout */}
      <div className="relative z-10 container mx-auto px-4 py-16 max-w-7xl">
        <div className="flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-16">
          
          {/* Text Content - Centered */}
          <div className="order-2 lg:order-1 text-center max-w-3xl">
            {/* Main Headline - Name */}
            <h1 
              className="font-accent font-bold text-white-pure mb-4 leading-tight animate-fade-in text-[2rem] sm:text-5xl md:text-6xl lg:text-7xl"
              style={{ textShadow: 'var(--text-shadow-hero)' }}
            >
              Gabriel Mangabeira
            </h1>
            
            {/* Role */}
            <h2 
              className="font-body font-semibold text-white-pure mb-8 animate-fade-in text-xl sm:text-2xl md:text-3xl"
              style={{ textShadow: 'var(--text-shadow-subtle)', animationDelay: '0.1s' }}
            >
              Olympian & Growth Marketing Strategist
            </h2>
            
            {/* Subheadline */}
            <p 
              className="font-body text-white-pure text-lg sm:text-xl md:text-2xl mb-10 leading-relaxed animate-fade-in mx-auto max-w-[700px]"
              style={{ textShadow: 'var(--text-shadow-subtle)', animationDelay: '0.2s' }}
            >
              Helping brands grow with Olympic discipline and measurable results.
            </p>
            
            {/* Credibility Stats - Larger and Bolder */}
            <div className="mb-12 animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 text-white-pure text-base sm:text-lg md:text-xl">
                <div className="flex items-center gap-2.5">
                  <Medal size={24} color="#FFC107" strokeWidth={2.5} className="flex-shrink-0" />
                  <span className="font-body font-bold">1M+ SEO Readers</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Globe size={24} color="#FFC107" strokeWidth={2.5} className="flex-shrink-0" />
                  <span className="font-body font-bold">$3.3M+ Crowdfunded</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <TrendingUp size={24} color="#FFC107" strokeWidth={2.5} className="flex-shrink-0" />
                  <span className="font-body font-bold">Millions Managed</span>
                </div>
              </div>
            </div>
            
            {/* Call-to-Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-center animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <Button 
                variant="hero" 
                size="hero" 
                className="w-full sm:w-auto px-10 py-5 font-bold text-lg sm:text-xl bg-gradient-cta text-white shadow-button hover:shadow-button-hover hover:scale-105 transition-all duration-300"
              >
                Start Your Growth Sprint
              </Button>
              <Button 
                variant="hero-outline" 
                size="hero" 
                className="w-full sm:w-auto px-8 py-4 text-lg sm:text-xl bg-transparent border-2 border-white text-white hover:bg-aqua-bright/20 hover:border-aqua-bright hover:scale-105 transition-all duration-300"
              >
                See My Results
              </Button>
            </div>
          </div>

          {/* Profile Photo - Mobile: Top, Desktop: Right */}
          <div className="order-1 lg:order-2 animate-fade-in">
            <div className="w-48 h-48 sm:w-56 sm:h-56 lg:w-[200px] lg:h-[200px] rounded-full overflow-hidden border-4 border-white/30 shadow-2xl flex-shrink-0">
              <img 
                src={gabrielAvatar} 
                alt="Gabriel Mangabeira - Olympian and Growth Marketing Strategist" 
                className="w-full h-full object-cover object-center"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;