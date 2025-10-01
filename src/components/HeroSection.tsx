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
      
      {/* Strong Dark Overlay (75-80%) */}
      <div className="absolute inset-0 bg-gradient-to-b from-[rgba(10,15,26,0.80)] via-[rgba(10,15,26,0.78)] to-[rgba(10,15,26,0.75)]" />
      
      {/* Content - Centered Layout with Balanced Spacing */}
      <div className="relative z-10 container mx-auto px-6 sm:px-8 lg:px-16 xl:px-20 py-20 sm:py-24 lg:py-28 max-w-7xl">
        <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-10 xl:gap-12">
          
          {/* Text Content - Left Aligned */}
          <div className="order-2 lg:order-1 text-center lg:text-left max-w-[720px]">
            {/* Main Headline - Name */}
            <h1 
              className="text-white mb-4 leading-tight animate-fade-in text-4xl sm:text-5xl md:text-6xl lg:text-7xl opacity-0"
              style={{ animation: 'fade-in 0.8s ease-out 0.2s forwards' }}
            >
              <span className="font-accent font-bold">Gabriel</span>{" "}
              <span className="font-accent font-extrabold">Mangabeira</span>
            </h1>
            
            {/* Subtitle */}
            <h2 
              className="font-body font-medium text-white/70 mb-5 opacity-0"
              style={{ animation: 'fade-in 0.8s ease-out 0.4s forwards' }}
            >
              Olympian & Growth Marketing Strategist
            </h2>
            
            {/* Tagline */}
            <p 
              className="font-body text-white/80 text-base sm:text-lg md:text-xl mb-6 leading-relaxed opacity-0"
              style={{ animation: 'fade-in 0.8s ease-out 0.6s forwards' }}
            >
              Turning Olympic discipline into measurable digital growth.
            </p>
            
            {/* Metrics Row */}
            <div className="mb-7 opacity-0" style={{ animation: 'fade-in 0.8s ease-out 0.8s forwards' }}>
              <div className="flex flex-col sm:flex-row items-center lg:items-start lg:justify-start justify-center gap-3 sm:gap-4 text-white text-sm sm:text-base">
                <div className="flex items-center gap-2">
                  <Medal size={18} strokeWidth={2} className="flex-shrink-0 text-[#FFB020]" />
                  <span className="font-body"><span className="font-bold">1M+</span> SEO Readers</span>
                </div>
                <span className="hidden sm:inline text-white/30 px-2">|</span>
                <div className="flex items-center gap-2">
                  <Globe size={18} strokeWidth={2} className="flex-shrink-0 text-[#FFB020]" />
                  <span className="font-body"><span className="font-bold">$3.3M+</span> Crowdfunded</span>
                </div>
                <span className="hidden sm:inline text-white/30 px-2">|</span>
                <div className="flex items-center gap-2">
                  <TrendingUp size={18} strokeWidth={2} className="flex-shrink-0 text-[#FFB020]" />
                  <span className="font-body"><span className="font-bold">Millions</span> Managed</span>
                </div>
              </div>
            </div>
            
            {/* Call-to-Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-center lg:justify-start opacity-0" style={{ animation: 'fade-in 0.8s ease-out 1s forwards' }}>
              <Button 
                size="lg"
                className="w-full sm:w-auto px-8 py-6 font-semibold text-lg bg-gradient-to-r from-[#FF8C42] to-[#FFB020] text-white rounded-lg shadow-lg hover:shadow-[0_0_30px_rgba(255,176,32,0.5)] hover:scale-105 transition-all duration-300"
              >
                Start Your Growth Sprint
              </Button>
              <Button 
                variant="outline"
                size="lg"
                className="w-full sm:w-auto px-8 py-6 text-lg bg-transparent border-2 border-white text-white hover:bg-white hover:text-[#0A0F1A] rounded-lg transition-all duration-300"
              >
                See My Results
              </Button>
            </div>
          </div>

          {/* Headshot - Right Side Desktop, Top on Mobile */}
          <div className="order-1 lg:order-2 opacity-0" style={{ animation: 'fade-in 0.8s ease-out 0.4s forwards' }}>
            <div className="relative w-40 h-40 sm:w-48 sm:h-48 lg:w-64 lg:h-64 rounded-full overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.6)] before:absolute before:inset-0 before:rounded-full before:bg-gradient-to-br before:from-[#FFB020] before:to-[#4A90E2] before:p-[3px] before:-z-10">
              <div className="relative w-full h-full rounded-full overflow-hidden bg-white">
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