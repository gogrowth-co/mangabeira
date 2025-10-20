import { Button } from "@/components/ui/button";
import { Award, TrendingUp, Globe } from "lucide-react";
import swimmerBg from "@/assets/gabriel-mangabeira-swimmer-butterfly.png";
import gabrielProfile from "@/assets/gabriel-profile.png";

const HeroSection = () => {
  return (
    <section id="top" className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image - Butterfly Swimmer */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat" 
        style={{
          backgroundImage: `url(${swimmerBg})`
        }} 
      />
      
      {/* Darker Gradient Overlay - 85% opacity */}
      <div className="absolute inset-0 bg-gradient-to-b from-[rgba(11,30,61,0.85)] to-[rgba(0,0,0,0.80)]" />
      
      {/* Content - Centered with Max Width */}
      <div className="relative z-10 max-w-[900px] mx-auto px-8 pt-16 sm:pt-20 pb-12 sm:pb-16 text-center">
        
        {/* Main Headline */}
        <h1 className="text-white mb-6 sm:mb-8 leading-tight animate-fade-in text-[32px] sm:text-5xl md:text-6xl font-bold tracking-tight">
          From Olympic Pools to Digital Growth
        </h1>
        
        {/* Subheadline */}
        <p className="text-white text-xl sm:text-2xl mb-8 sm:mb-10 animate-fade-in leading-relaxed font-medium" style={{ animationDelay: '0.1s' }}>
          Fly past the noise into scalable growth
        </p>
        
        {/* Profile Block */}
        <div className="flex flex-col items-center mb-8 sm:mb-10 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          {/* Profile Image - Responsive Size */}
          <div className="relative w-[130px] h-[130px] sm:w-[150px] sm:h-[150px] mb-4">
            <img 
              src={gabrielProfile} 
              alt="Gabriel Mangabeira - Olympic Athlete and Growth Marketing Strategist" 
              className="w-full h-full object-cover rounded-full border-2 border-white shadow-[0_8px_24px_rgba(0,0,0,0.25)]"
            />
          </div>
          
          {/* Name and Title */}
          <h2 className="text-white font-bold text-2xl sm:text-3xl mb-2">
            Gabriel Mangabeira
          </h2>
          <p className="text-white text-base sm:text-lg font-medium">
            Olympian & Growth Marketing Strategist
          </p>
        </div>
        
        {/* Proof Line - Frosted Glass Style - Compact */}
        <div className="inline-flex flex-wrap items-center justify-center gap-y-3 gap-x-5 px-5 py-2.5 mb-8 sm:mb-10 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 shadow-lg animate-fade-in" style={{ animationDelay: '0.3s', letterSpacing: '0.5px' }}>
          <div className="flex items-center gap-2 text-white text-sm sm:text-base font-medium">
            <Award className="w-4 h-4 text-[#FFD700]" />
            <span>2× Olympian</span>
          </div>
          <div className="hidden sm:block w-px h-4 bg-white/30" />
          <div className="flex items-center gap-2 text-white text-sm sm:text-base font-medium">
            <Globe className="w-4 h-4 text-[#FFD700]" />
            <span>1M+ Global Readers</span>
          </div>
          <div className="hidden sm:block w-px h-4 bg-white/30" />
          <div className="flex items-center gap-2 text-white text-sm sm:text-base font-medium">
            <TrendingUp className="w-4 h-4 text-[#FFD700]" />
            <span>$6.3M+ Raised</span>
          </div>
        </div>
        
        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <Button 
            size="lg" 
            className="w-full sm:w-auto px-8 py-4 sm:py-5 font-bold text-lg bg-[#FF7B00] text-white rounded-lg shadow-lg hover:shadow-[0_8px_30px_rgba(255,123,0,0.4)] hover:-translate-y-0.5 transition-all duration-200"
            onClick={() => document.getElementById('capabilities')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Start Your Growth Sprint
          </Button>
          <Button 
            variant="outline" 
            size="lg" 
            className="w-full sm:w-auto px-8 py-4 sm:py-5 text-lg bg-transparent border-2 border-white text-white hover:bg-white/10 hover:-translate-y-0.5 rounded-lg transition-all duration-200 font-semibold"
            onClick={() => document.getElementById('social-proof')?.scrollIntoView({ behavior: 'smooth' })}
          >
            See My Results
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;