import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-swimming.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: `url(${heroImage})`,
          backgroundPosition: 'center 30%' // Focus on swimmer's form
        }}
      />
      
      {/* Dark-to-Transparent Gradient Overlay from Top */}
      <div className="absolute inset-0 bg-gradient-hero" />
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 py-16 text-center">
        {/* Main Headline - Pure White with Strong Drop Shadow */}
        <h1 
          className="font-hero font-bold text-white-pure mb-8 leading-tight"
          style={{ textShadow: 'var(--text-shadow-hero)' }}
        >
          <span className="block text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl">
            From Olympic Pools
          </span>
          <span className="block text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl">
            to Digital Growth
          </span>
        </h1>
        
        {/* Subheadline - Soft White with Medium Weight */}
        <div className="max-w-3xl mx-auto mb-12">
          <p 
            className="font-body font-medium text-white-soft text-lg sm:text-xl md:text-2xl lg:text-3xl leading-relaxed"
            style={{ textShadow: 'var(--text-shadow-subtle)' }}
          >
            Gabriel Mangabeira applies Olympic-level discipline to SEO, Paid Media, Web3 & AI strategy,
            turning data-driven insights into measurable growth.
          </p>
        </div>
        
        {/* Credibility Badges - Horizontal on Desktop, Stacked on Mobile */}
        <div 
          className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-8 mb-16 text-white-pure text-base sm:text-lg lg:text-xl"
          style={{ textShadow: 'var(--text-shadow-light)' }}
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl">🏅</span>
            <span className="font-body font-medium">Olympic Athlete</span>
          </div>
          
          <div className="hidden md:block text-white-soft/70 text-2xl">•</div>
          
          <div className="flex items-center gap-3">
            <span className="text-2xl">📈</span>
            <span className="font-body font-medium">1M+ SEO Readers</span>
          </div>
          
          <div className="hidden md:block text-white-soft/70 text-2xl">•</div>
          
          <div className="flex items-center gap-3">
            <span className="text-2xl">🌐</span>
            <span className="font-body font-medium">Web3 & AI Strategist</span>
          </div>
        </div>
        
        {/* Call-to-Action Buttons - Mobile-First Stacked Layout */}
        <div className="flex flex-col sm:flex-row gap-6 items-center justify-center max-w-lg mx-auto">
          <Button 
            variant="hero" 
            size="hero" 
            className="w-full sm:w-auto px-12"
          >
            Work With Me
          </Button>
          <Button 
            variant="hero-outline" 
            size="hero" 
            className="w-full sm:w-auto px-12"
          >
            Explore My Work
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;