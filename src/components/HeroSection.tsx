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
        
        {/* Subheadline - First Person, Approachable */}
        <div className="max-w-3xl mx-auto mb-12">
          <div className="bg-navy-deep/25 backdrop-blur-sm rounded-lg px-6 py-4 border border-white/10">
            <p 
              className="font-body font-medium text-white-soft text-base sm:text-lg md:text-xl leading-loose"
              style={{ textShadow: 'var(--text-shadow-subtle)' }}
            >
              I apply Olympic-level discipline to SEO, Paid Media, Web3 & AI strategy, turning data-driven insights into measurable growth.
            </p>
          </div>
        </div>
        
        {/* Credibility Badges - Pill-shaped Semi-transparent Backdrop */}
        <div className="mb-16 flex justify-center">
          <div className="bg-navy-deep/30 backdrop-blur-sm rounded-full px-8 py-4 border border-white/20">
            <div 
              className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6 text-white-pure text-sm sm:text-base lg:text-lg"
              style={{ textShadow: 'var(--text-shadow-light)' }}
            >
              <div className="flex items-center gap-2">
                <span className="text-xl">🏅</span>
                <span className="font-body font-light">Olympic Athlete</span>
              </div>
              
              <div className="hidden md:block text-white-soft/50 text-lg">•</div>
              
              <div className="flex items-center gap-2">
                <span className="text-xl">📈</span>
                <span className="font-body font-light">1M+ SEO Readers</span>
              </div>
              
              <div className="hidden md:block text-white-soft/50 text-lg">•</div>
              
              <div className="flex items-center gap-2">
                <span className="text-xl">🌐</span>
                <span className="font-body font-light">Web3 & AI Strategist</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Call-to-Action Buttons - Side by Side on Desktop, Stacked on Mobile */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center max-w-lg mx-auto">
          <Button 
            variant="hero" 
            size="hero" 
            className="w-full sm:w-auto px-8 py-4 font-bold"
          >
            Work With Me
          </Button>
          <Button 
            variant="hero-outline" 
            size="hero" 
            className="w-full sm:w-auto px-8 py-4"
          >
            Explore My Work
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;