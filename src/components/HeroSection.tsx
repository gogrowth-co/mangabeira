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
          backgroundPosition: 'center 25%' // Focus on face and arms in safe area
        }}
      />
      
      {/* Gradient Overlay - Navy at bottom fading to transparent at top */}
      <div className="absolute inset-0 bg-gradient-hero" />
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 py-12 text-center">
        {/* Main Headline with Text Shadow */}
        <h1 
          className="font-hero font-bold text-white mb-6 leading-tight"
          style={{ textShadow: 'var(--text-shadow-hero)' }}
        >
          <span className="block text-4xl sm:text-5xl md:text-6xl lg:text-7xl">
            From Olympic Pools
          </span>
          <span className="block text-4xl sm:text-5xl md:text-6xl lg:text-7xl">
            to Digital Growth
          </span>
        </h1>
        
        {/* Subheadline with Subtle Text Shadow */}
        <div className="max-w-2xl mx-auto mb-8">
          <p 
            className="font-body text-gray-200 text-lg sm:text-xl md:text-2xl leading-relaxed"
            style={{ textShadow: 'var(--text-shadow-subtle)' }}
          >
            Gabriel Mangabeira applies Olympic-level discipline to SEO, Paid Media, Web3 & AI strategy,
            turning data-driven insights into measurable growth.
          </p>
        </div>
        
        {/* Credibility Bar with Emojis */}
        <div 
          className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mb-12 text-white text-base sm:text-lg"
          style={{ textShadow: 'var(--text-shadow-subtle)' }}
        >
          <div className="flex items-center gap-2">
            <span className="text-xl">🏅</span>
            <span className="font-body font-medium">Olympic Athlete</span>
          </div>
          <div className="hidden sm:block text-white/50">•</div>
          <div className="flex items-center gap-2">
            <span className="text-xl">📈</span>
            <span className="font-body font-medium">1M+ SEO Readers</span>
          </div>
          <div className="hidden sm:block text-white/50">•</div>
          <div className="flex items-center gap-2">
            <span className="text-xl">🌐</span>
            <span className="font-body font-medium">Web3 & AI Strategist</span>
          </div>
        </div>
        
        {/* Call-to-Action Buttons */}
        <div className="flex flex-col gap-4 items-center justify-center max-w-sm mx-auto">
          <Button 
            variant="hero" 
            size="hero" 
            className="w-full"
          >
            Work With Me
          </Button>
          <Button 
            variant="hero-outline" 
            size="hero" 
            className="w-full"
          >
            Explore My Work
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;