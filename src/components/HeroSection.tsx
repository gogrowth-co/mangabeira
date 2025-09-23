import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-swimming.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image - Ensuring Gabriel's head is fully in frame */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: `url(${heroImage})`,
          backgroundPosition: 'center 25%' // Adjusted to show more of Gabriel's head
        }}
      />
      
      {/* Top-to-Bottom Gradient Overlay for Text Readability */}
      <div className="absolute inset-0 bg-gradient-hero" />
      
      {/* Subtle Futuristic Overlay - Abstract Network Lines */}
      <div className="absolute inset-0 opacity-20">
        <svg className="w-full h-full" viewBox="0 0 1920 1080" fill="none">
          <defs>
            <linearGradient id="networkGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{stopColor: 'hsl(var(--aqua-bright))', stopOpacity: 0.3}} />
              <stop offset="100%" style={{stopColor: 'hsl(var(--hero-gold))', stopOpacity: 0.1}} />
            </linearGradient>
          </defs>
          <path d="M0,300 Q480,200 960,250 T1920,200" stroke="url(#networkGradient)" strokeWidth="2" fill="none" />
          <path d="M0,600 Q600,500 1200,550 T1920,500" stroke="url(#networkGradient)" strokeWidth="1.5" fill="none" />
          <circle cx="200" cy="280" r="3" fill="hsl(var(--aqua-bright))" opacity="0.6" />
          <circle cx="800" cy="240" r="2" fill="hsl(var(--hero-gold))" opacity="0.5" />
          <circle cx="1400" cy="190" r="2.5" fill="hsl(var(--aqua-bright))" opacity="0.4" />
        </svg>
      </div>
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 py-20 text-center">
        {/* Main Headline - Bold, Clean Sans-serif */}
        <h1 
          className="font-accent font-bold text-white-pure mb-12 leading-tight"
          style={{ textShadow: 'var(--text-shadow-hero)' }}
        >
          <span className="block text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl">
            From Olympic Pools
          </span>
          <span className="block text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl">
            to Digital Growth
          </span>
        </h1>
        
        {/* Subheadline - Semi-transparent Dark Container with Highlighted Terms */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="bg-navy-deep/45 backdrop-blur-md rounded-xl px-8 py-6 border border-white/15 shadow-lg">
            <p 
              className="font-body font-medium text-white-soft text-base sm:text-lg md:text-xl leading-relaxed"
              style={{ textShadow: 'var(--text-shadow-subtle)' }}
            >
              I apply Olympic-level discipline to{' '}
              <span className="text-accent-orange font-semibold">SEO, Paid Media</span>,{' '}
              <span className="text-accent-blue font-semibold">Web3 & AI strategy</span>, turning data-driven insights into{' '}
              <span className="text-accent-green font-semibold">measurable growth</span>.
            </p>
          </div>
        </div>
        
        {/* Personalization Line */}
        <div className="mb-12">
          <div className="flex items-center justify-center gap-3 text-white-soft/90">
            {/* Optional circular headshot placeholder */}
            <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center">
              <span className="text-sm">GM</span>
            </div>
            <p 
              className="font-body text-sm sm:text-base"
              style={{ textShadow: 'var(--text-shadow-light)' }}
            >
              Gabriel Mangabeira – Olympian & Growth Marketing Strategist
            </p>
          </div>
        </div>
        
        {/* Supporting Points (Badges) - Horizontal Row with Larger Icons */}
        <div className="mb-16 flex justify-center">
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
            {/* Olympic Athlete Badge */}
            <div className="bg-navy-deep/35 backdrop-blur-sm rounded-full px-6 py-3 border border-white/20">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🥇</span>
                <span 
                  className="font-body font-light text-white-pure text-sm sm:text-base"
                  style={{ textShadow: 'var(--text-shadow-light)' }}
                >
                  Olympic Athlete
                </span>
              </div>
            </div>
            
            {/* SEO Readers Badge */}
            <div className="bg-navy-deep/35 backdrop-blur-sm rounded-full px-6 py-3 border border-white/20">
              <div className="flex items-center gap-3">
                <span className="text-2xl">📊</span>
                <span 
                  className="font-body font-light text-white-pure text-sm sm:text-base"
                  style={{ textShadow: 'var(--text-shadow-light)' }}
                >
                  1M+ SEO Readers
                </span>
              </div>
            </div>
            
            {/* Web3 & AI Badge */}
            <div className="bg-navy-deep/35 backdrop-blur-sm rounded-full px-6 py-3 border border-white/20">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🌐</span>
                <span 
                  className="font-body font-light text-white-pure text-sm sm:text-base"
                  style={{ textShadow: 'var(--text-shadow-light)' }}
                >
                  Web3 & AI Strategist
                </span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Call-to-Action Buttons - Generous Spacing */}
        <div className="flex flex-col sm:flex-row gap-6 items-center justify-center max-w-lg mx-auto">
          <Button 
            variant="hero" 
            size="hero" 
            className="w-full sm:w-auto px-10 py-4 font-bold text-lg shadow-button hover:shadow-button-hover transition-all duration-300"
          >
            Work With Me
          </Button>
          <Button 
            variant="hero-outline" 
            size="hero" 
            className="w-full sm:w-auto px-10 py-4 text-lg"
          >
            Explore My Work
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;