import { Button } from "@/components/ui/button";
import { Medal, TrendingUp, Globe } from "lucide-react";
import heroImage from "@/assets/hero-swimming.jpg";
import gabrielAvatar from "@/assets/gabriel-avatar.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image - Full-screen action shot */}
      <div 
        className="absolute inset-0 bg-cover bg-no-repeat"
        style={{ 
          backgroundImage: `url(${heroImage})`,
          backgroundPosition: '48% center'
        }}
      />
      
      {/* Stronger Dark Overlay for Text Readability */}
      <div className="absolute inset-0 bg-black/70" />
      
      {/* Content - Mobile-first Design */}
      <div className="relative z-10 container mx-auto px-4 py-12 max-w-7xl">
        <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-12">
          
          {/* Profile Photo - Mobile: Top, Desktop: Right */}
          <div className="order-1 lg:order-2 animate-fade-in">
            <div className="w-40 h-40 sm:w-48 sm:h-48 lg:w-64 lg:h-64 rounded-full overflow-hidden border-4 border-white/30 shadow-2xl flex-shrink-0">
              <img 
                src={gabrielAvatar} 
                alt="Gabriel Mangabeira - Olympian and Growth Marketing Strategist" 
                className="w-full h-full object-cover object-center"
              />
            </div>
          </div>
          
          {/* Text Content */}
          <div className="order-2 lg:order-1 text-center lg:text-left max-w-2xl">
            {/* Main Headline - Name */}
            <h1 
              className="font-accent font-bold text-white-pure mb-3 leading-tight animate-fade-in text-4xl sm:text-5xl md:text-6xl lg:text-7xl"
              style={{ textShadow: 'var(--text-shadow-hero)' }}
            >
              Gabriel Mangabeira
            </h1>
            
            {/* Role */}
            <h2 
              className="font-body font-semibold text-white-pure mb-6 animate-fade-in text-xl sm:text-2xl md:text-3xl"
              style={{ textShadow: 'var(--text-shadow-subtle)', animationDelay: '0.1s' }}
            >
              Olympian & Growth Marketing Strategist
            </h2>
            
            {/* Subheadline */}
            <p 
              className="font-body text-white-pure text-base sm:text-lg md:text-xl mb-6 leading-relaxed animate-fade-in"
              style={{ textShadow: 'var(--text-shadow-subtle)', animationDelay: '0.2s' }}
            >
              Helping brands grow with Olympic discipline and measurable results.
            </p>
            
            {/* Credibility Stats */}
            <div className="mb-8 animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-6 text-white-soft/90 text-sm sm:text-base">
                <div className="flex items-center gap-2">
                  <Medal size={18} color="#FFC107" strokeWidth={2} className="flex-shrink-0" />
                  <span className="font-body font-light">1M+ SEO Readers</span>
                </div>
                <div className="flex items-center gap-2">
                  <Globe size={18} color="#FFC107" strokeWidth={2} className="flex-shrink-0" />
                  <span className="font-body font-light">$3.3M Crowdfunded</span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp size={18} color="#FFC107" strokeWidth={2} className="flex-shrink-0" />
                  <span className="font-body font-light">Millions Managed</span>
                </div>
              </div>
            </div>
            
            {/* Call-to-Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-center lg:justify-start animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <Button 
                variant="hero" 
                size="hero" 
                className="w-full sm:w-auto px-8 py-4 font-bold text-base sm:text-lg bg-gradient-cta text-white shadow-button hover:shadow-button-hover hover:scale-105 transition-all duration-300"
              >
                Start Your Growth Sprint
              </Button>
              <Button 
                variant="hero-outline" 
                size="hero" 
                className="w-full sm:w-auto px-6 py-3 text-base sm:text-lg bg-transparent border-2 border-white text-white hover:bg-aqua-bright/20 hover:border-aqua-bright hover:scale-105 transition-all duration-300"
              >
                See My Results
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;