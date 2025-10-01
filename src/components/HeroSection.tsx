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
      
      {/* Layered Dark Gradient Overlay with Vignette */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0A0F1A] via-[rgba(10,15,26,0.85)] to-[rgba(10,15,26,0.75)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.18)_100%)]" />
      <div className="absolute inset-0 backdrop-blur-[7px] md:backdrop-blur-[6px]" />
      
      {/* Content - Left-Aligned Layout with Right Headshot */}
      <div className="relative z-10 container mx-auto px-4 py-16 max-w-7xl">
        <div className="flex flex-col lg:flex-row items-center lg:items-start justify-between gap-12 lg:gap-16">
          
          {/* Text Content - Left Aligned with Subtle Scrim */}
          <div className="order-2 lg:order-1 text-center lg:text-left max-w-[720px] lg:bg-[rgba(10,15,26,0.35)] lg:backdrop-blur-[3px] lg:rounded-xl lg:p-5">
            {/* Main Headline - Name - Extra Large and Bold */}
            <h1 
              className="font-accent font-extrabold text-white-pure mb-3 md:mb-4 leading-tight animate-fade-in text-[1.75rem] sm:text-5xl md:text-6xl lg:text-[3.5rem] xl:text-7xl"
              style={{ textShadow: 'var(--text-shadow-hero)' }}
            >
              Gabriel <span className="relative inline-block">Mangabeira<span className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-[rgba(43,179,255,0.4)] to-[rgba(43,179,255,0.2)]"></span></span>
            </h1>
            
            {/* Role - Medium Weight, Off-White */}
            <h2 
              className="font-body font-medium text-[#E5E7EB]/80 mb-4 md:mb-5 animate-fade-in text-base sm:text-lg md:text-xl lg:text-2xl"
              style={{ animationDelay: '0.1s' }}
            >
              Olympian & Growth Marketing Strategist
            </h2>
            
            {/* Tagline - Generous Spacing */}
            <p 
              className="font-body text-white-pure text-sm sm:text-base md:text-lg lg:text-xl mb-5 md:mb-6 leading-relaxed animate-fade-in"
              style={{ textShadow: 'var(--text-shadow-subtle)', animationDelay: '0.2s' }}
            >
              Turning Olympic discipline into measurable digital growth.
            </p>
            
            {/* Credibility Stats - Bold Numbers, Centered Dots */}
            <div className="mb-6 md:mb-7 animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <div className="flex flex-col sm:flex-row items-center lg:items-start lg:justify-start justify-center gap-3 sm:gap-4 text-white-pure/92 text-sm sm:text-base md:text-base">
                <div className="flex items-center gap-2">
                  <Medal size={20} color="#FFB020" strokeWidth={2.5} className="flex-shrink-0 opacity-90" />
                  <span className="font-body"><span className="font-bold">1M+</span> SEO Readers</span>
                </div>
                <span className="hidden sm:inline text-white-pure/40 px-1">•</span>
                <div className="flex items-center gap-2">
                  <Globe size={20} color="#FFB020" strokeWidth={2.5} className="flex-shrink-0 opacity-90" />
                  <span className="font-body"><span className="font-bold">$3.3M+</span> Crowdfunded</span>
                </div>
                <span className="hidden sm:inline text-white-pure/40 px-1">•</span>
                <div className="flex items-center gap-2">
                  <TrendingUp size={20} color="#FFB020" strokeWidth={2.5} className="flex-shrink-0 opacity-90" />
                  <span className="font-body"><span className="font-bold">Millions</span> Managed</span>
                </div>
              </div>
            </div>
            
            {/* Call-to-Action Buttons - Bold and Clickable */}
            <div className="flex flex-col sm:flex-row gap-4 items-center lg:items-start lg:justify-start justify-center animate-fade-in mt-6 md:mt-7" style={{ animationDelay: '0.4s' }}>
              <Button 
                variant="hero" 
                size="hero" 
                className="w-full sm:w-auto px-6 sm:px-7 py-3.5 sm:py-4 font-semibold text-base sm:text-lg bg-gradient-cta text-white shadow-button hover:shadow-button-hover hover:scale-105 transition-all duration-300"
              >
                Start Your Growth Sprint
              </Button>
              <Button 
                variant="hero-outline" 
                size="hero" 
                className="w-full sm:w-auto px-6 sm:px-7 py-3.5 sm:py-4 text-base sm:text-lg bg-transparent border-2 border-white text-white hover:bg-aqua-bright/20 hover:border-aqua-bright hover:scale-105 transition-all duration-300"
              >
                See My Results
              </Button>
            </div>
          </div>

          {/* Profile Photo - Integrated with Dual Ring & Glow */}
          <div className="order-1 lg:order-2 animate-fade-in lg:pr-12 xl:pr-16">
            <div className="relative">
              {/* Soft Outer Glow */}
              <div className="absolute inset-0 rounded-full shadow-[0_12px_24px_rgba(0,0,0,0.35)]"></div>
              {/* Subtle Circular Backdrop */}
              <div className="absolute inset-[-12px] rounded-full bg-[#0B1020]/65 blur-[8px]"></div>
              {/* Profile Image with Dual Ring */}
              <div className="relative w-36 h-36 sm:w-40 sm:h-40 md:w-44 md:h-44 lg:w-60 lg:h-60 xl:w-[260px] xl:h-[260px] rounded-full overflow-hidden flex-shrink-0 ring-2 ring-white/60 ring-offset-0">
                {/* Outer Gradient Ring */}
                <div className="absolute inset-[-5px] rounded-full bg-gradient-to-br from-[#2BB3FF]/70 to-[#1472FF]/70 -z-10"></div>
                <img 
                  src={gabrielAvatar} 
                  alt="Gabriel Mangabeira - Olympian and Growth Marketing Strategist headshot" 
                  className="w-full h-full object-cover object-center brightness-[0.95] contrast-[1.02]"
                  style={{ filter: 'brightness(0.95) contrast(1.02) saturate(0.97)' }}
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