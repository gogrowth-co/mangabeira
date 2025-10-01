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
      <div className="absolute inset-0 bg-gradient-to-b from-[rgba(10,15,26,0.85)] via-[rgba(10,15,26,0.83)] to-[rgba(10,15,26,0.80)]" />
      
      {/* Content - Centered Layout with Balanced Spacing */}
      <div className="relative z-10 container mx-auto px-6 sm:px-8 lg:px-16 xl:px-20 py-16 max-w-7xl">
        <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-10 xl:gap-12">
          
          {/* Text Content - Left Aligned with Glassmorphism */}
          <div className="order-2 lg:order-1 text-center lg:text-left max-w-[720px] backdrop-blur-md bg-white/10 rounded-2xl border border-white/20 p-8 sm:p-10 lg:p-12 transition-all duration-300 hover:bg-white/15">
            {/* Main Headline - Name */}
            <h1 
              className="text-white mb-4 leading-tight animate-fade-in text-4xl sm:text-5xl md:text-6xl lg:text-7xl"
            >
              <span className="font-accent font-bold">Gabriel</span>{" "}
              <span className="font-accent font-extrabold">Mangabeira</span>
            </h1>
            
            {/* Subtitle */}
            <h2 
              className="font-body font-medium text-white/90 mb-5 animate-fade-in text-lg sm:text-xl md:text-2xl"
              style={{ animationDelay: '0.1s' }}
            >
              Olympian & Growth Marketing Strategist
            </h2>
            
            {/* Tagline */}
            <p 
              className="font-body text-white/95 text-base sm:text-lg md:text-xl mb-6 leading-relaxed animate-fade-in"
              style={{ animationDelay: '0.2s', lineHeight: '1.8' }}
            >
              Turning Olympic discipline into measurable digital growth.
            </p>
            
            {/* Metrics Row - Pill-shaped Glassy Cards */}
            <div className="mb-7 animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <div className="flex flex-col sm:flex-row items-center lg:items-start lg:justify-start justify-center gap-3 text-white text-sm sm:text-base">
                <div className="backdrop-blur-sm bg-white/15 rounded-full px-4 py-2.5 border border-white/30 flex items-center gap-2.5 hover:bg-white/20 transition-all duration-300">
                  <Medal size={20} strokeWidth={2} className="flex-shrink-0 text-[#FFB400]" />
                  <span className="font-body"><span className="font-bold">1M+</span> SEO Readers</span>
                </div>
                <div className="backdrop-blur-sm bg-white/15 rounded-full px-4 py-2.5 border border-white/30 flex items-center gap-2.5 hover:bg-white/20 transition-all duration-300">
                  <Globe size={20} strokeWidth={2} className="flex-shrink-0 text-[#FFB400]" />
                  <span className="font-body"><span className="font-bold">$3.3M+</span> Crowdfunded</span>
                </div>
                <div className="backdrop-blur-sm bg-white/15 rounded-full px-4 py-2.5 border border-white/30 flex items-center gap-2.5 hover:bg-white/20 transition-all duration-300">
                  <TrendingUp size={20} strokeWidth={2} className="flex-shrink-0 text-[#FFB400]" />
                  <span className="font-body"><span className="font-bold">Millions</span> Managed</span>
                </div>
              </div>
            </div>
            
            {/* Call-to-Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-center lg:justify-start animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <Button 
                size="lg"
                className="w-full sm:w-auto px-8 py-6 font-semibold text-lg bg-gradient-to-r from-[#FF8C42] to-[#FFB020] text-white rounded-lg shadow-lg hover:shadow-[0_0_30px_rgba(255,176,32,0.6)] hover:scale-105 transition-all duration-300"
              >
                Start Your Growth Sprint
              </Button>
              <Button 
                variant="outline"
                size="lg"
                className="w-full sm:w-auto px-8 py-6 text-lg bg-white/10 backdrop-blur-sm border-2 border-white/80 text-white hover:bg-white/20 hover:border-white rounded-lg transition-all duration-300"
              >
                See My Results
              </Button>
            </div>
          </div>

          {/* Headshot - Right Side Desktop, Top on Mobile */}
          <div className="order-1 lg:order-2 animate-fade-in">
            <div className="relative w-44 h-44 sm:w-56 sm:h-56 lg:w-72 lg:h-72 rounded-full overflow-hidden ring-[1.5px] ring-[#2196f3] shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
              <img 
                src={gabrielAvatar} 
                alt="Gabriel Mangabeira - Olympian and Growth Marketing Strategist headshot" 
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