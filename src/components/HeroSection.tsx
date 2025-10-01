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
          backgroundPosition: 'center center'
        }}
      />
      
      {/* Top-to-Center Dark Gradient Overlay for Text Readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/85 via-black/60 to-black/30" />
      
      {/* Content - Mobile-first Design */}
      <div className="relative z-10 container mx-auto px-4 py-12 text-center max-w-4xl">
        {/* Main Headline - Large, Bold, White Text */}
        <h1 
          className="font-accent font-bold text-white-pure mb-6 leading-tight animate-fade-in"
          style={{ textShadow: 'var(--text-shadow-hero)' }}
        >
          <span className="block text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl">
            From Olympic Pools
          </span>
          <span className="block text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl">
            to Digital Growth
          </span>
        </h1>
        
        {/* Subheadline - Max 2-3 lines */}
        <div className="mb-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <p 
            className="font-body font-medium text-white-pure text-lg sm:text-xl md:text-2xl leading-relaxed max-w-3xl mx-auto"
            style={{ textShadow: 'var(--text-shadow-subtle)' }}
          >
            I use an Olympian's discipline to turn your complex data into measurable, championship-level growth.
          </p>
        </div>
        
        {/* Identity Strip - Avatar and Name Side-Docked */}
        <div className="mb-10 flex items-center justify-center gap-4 animate-fade-in" style={{ animationDelay: '0.4s' }}>
          {/* Circular Avatar */}
          <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white/30 shadow-lg flex-shrink-0">
            <img 
              src={gabrielAvatar} 
              alt="Gabriel Mangabeira" 
              className="w-full h-full object-cover object-center"
            />
          </div>
          
          {/* Identity Text */}
          <p 
            className="font-body text-white-pure text-base sm:text-lg font-medium text-left"
            style={{ textShadow: 'var(--text-shadow-light)' }}
          >
            Gabriel Mangabeira – Olympian & Growth Marketing Strategist
          </p>
        </div>
        
        {/* Badges Section - Rounded Translucent Backdrop */}
        <div className="mb-12 animate-fade-in" style={{ animationDelay: '0.6s' }}>
          <div className="bg-navy-deep/40 backdrop-blur-md rounded-2xl px-6 py-4 border border-white/20 shadow-lg inline-block">
            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 text-white-pure">
              {/* Olympic Athlete */}
              <div className="flex items-center gap-2 animate-fade-in" style={{ animationDelay: '0.8s' }}>
                <Medal 
                  size={20} 
                  color="#FFC107" 
                  strokeWidth={2} 
                  className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" 
                />
                <span 
                  className="font-body font-light text-sm sm:text-base"
                  style={{ textShadow: 'var(--text-shadow-light)' }}
                >
                  Olympic Athlete
                </span>
              </div>
              
              {/* Separator */}
              <div className="hidden sm:block text-white-soft/60 text-lg">|</div>
              
              {/* SEO Readers */}
              <div className="flex items-center gap-2 animate-fade-in" style={{ animationDelay: '0.95s' }}>
                <TrendingUp 
                  size={20} 
                  color="#FFC107" 
                  strokeWidth={2} 
                  className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" 
                />
                <span 
                  className="font-body font-light text-sm sm:text-base"
                  style={{ textShadow: 'var(--text-shadow-light)' }}
                >
                  1M+ SEO Readers
                </span>
              </div>
              
              {/* Separator */}
              <div className="hidden sm:block text-white-soft/60 text-lg">|</div>
              
              {/* Web3 & AI */}
              <div className="flex items-center gap-2 animate-fade-in" style={{ animationDelay: '1.1s' }}>
                <Globe 
                  size={20} 
                  color="#FFC107" 
                  strokeWidth={2} 
                  className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" 
                />
                <span 
                  className="font-body font-light text-sm sm:text-base"
                  style={{ textShadow: 'var(--text-shadow-light)' }}
                >
                  Web3 & AI Strategist
                </span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Call-to-Action Buttons - Centered, Stacked on Mobile */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center max-w-md mx-auto animate-fade-in" style={{ animationDelay: '1.3s' }}>
          <Button 
            variant="hero" 
            size="hero" 
            className="w-full sm:w-auto px-8 py-4 font-bold text-lg bg-gradient-cta text-white shadow-button hover:shadow-button-hover hover:scale-105 transition-all duration-300"
          >
            Start Your Growth Sprint
          </Button>
          <Button 
            variant="hero-outline" 
            size="hero" 
            className="w-full sm:w-auto px-8 py-4 text-lg bg-transparent border-2 border-white text-white hover:bg-aqua-bright/20 hover:border-aqua-bright hover:scale-105 transition-all duration-300"
          >
            See My Results
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;