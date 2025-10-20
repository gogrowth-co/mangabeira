import { Button } from "@/components/ui/button";
import { Award, TrendingUp, Globe } from "lucide-react";
import swimmerBg from "@/assets/gabriel-mangabeira-swimmer-butterfly.png";
import gabrielProfile from "@/assets/gabriel-profile.png";

const HeroSection = () => {
  return (
    <section id="top" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image - Butterfly Swimmer */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat" 
        style={{
          backgroundImage: `url(${swimmerBg})`
        }} 
      />
      
      {/* Darker Gradient Overlay for Better Readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-[rgba(11,30,61,0.85)] to-[rgba(0,0,0,0.80)]" />
      
      {/* Content - Centered with Max Width */}
      <div className="relative z-10 max-w-[900px] mx-auto px-6 sm:px-8 py-20 text-center">
        
        {/* Main Headline */}
        <h1 className="text-white mb-4 leading-tight animate-fade-in text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight">
          From Olympic Pools to Digital Growth
        </h1>
        
        {/* Subheadline */}
        <p className="text-white/90 text-xl sm:text-2xl mb-8 animate-fade-in leading-relaxed" style={{ animationDelay: '0.1s' }}>
          Fly past the noise into scalable growth
        </p>
        
        {/* Profile Block */}
        <div className="flex flex-col items-center mb-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          {/* Profile Image - 1.4x larger (140-160px) */}
          <div className="relative w-40 h-40 sm:w-44 sm:h-44 md:w-48 md:h-48 mb-4">
            <img 
              src={gabrielProfile} 
              alt="Gabriel Mangabeira - Olympic Athlete and Growth Marketing Strategist" 
              className="w-full h-full object-cover rounded-full border-2 border-white shadow-[0_10px_30px_rgba(0,0,0,0.3)]"
            />
          </div>
          
          {/* Name and Title */}
          <h2 className="text-white font-bold text-2xl sm:text-3xl mb-1">
            Gabriel Mangabeira
          </h2>
          <p className="text-white/90 text-base sm:text-lg font-medium">
            Olympian & Growth Marketing Strategist
          </p>
        </div>
        
        {/* Proof Line - Frosted Glass Style */}
        <div className="inline-flex flex-wrap items-center justify-center gap-4 sm:gap-6 px-6 py-4 mb-8 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-lg animate-fade-in" style={{ animationDelay: '0.3s', letterSpacing: '0.5px' }}>
          <div className="flex items-center gap-2 text-white text-sm sm:text-base font-medium">
            <Award className="w-5 h-5 text-[#FFD700]" />
            <span>2× Olympian</span>
          </div>
          <div className="hidden sm:block w-px h-4 bg-white/30" />
          <div className="flex items-center gap-2 text-white text-sm sm:text-base font-medium">
            <Globe className="w-5 h-5 text-[#FFD700]" />
            <span>1M+ Global Readers</span>
          </div>
          <div className="hidden sm:block w-px h-4 bg-white/30" />
          <div className="flex items-center gap-2 text-white text-sm sm:text-base font-medium">
            <TrendingUp className="w-5 h-5 text-[#FFD700]" />
            <span>$6M+ Raised</span>
          </div>
        </div>
        
        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-5 items-center justify-center animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <Button 
            size="lg" 
            className="w-full sm:w-auto px-8 py-6 font-bold text-lg bg-[#FF7B00] text-white rounded-lg shadow-lg hover:shadow-[0_8px_30px_rgba(255,123,0,0.4)] hover:-translate-y-0.5 transition-all duration-200"
            onClick={() => document.getElementById('capabilities')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Start Your Growth Sprint
          </Button>
          <Button 
            variant="outline" 
            size="lg" 
            className="w-full sm:w-auto px-8 py-6 text-lg bg-transparent border-2 border-white text-white hover:bg-white/10 hover:-translate-y-0.5 rounded-lg transition-all duration-200 font-semibold"
            onClick={() => document.getElementById('social-proof')?.scrollIntoView({ behavior: 'smooth' })}
          >
            See My Results
          </Button>
        </div>
        
        {/* Scroll Cue */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/60 text-sm animate-bounce">
          ↓ Keep Swimming
        </div>
      </div>
    </section>
  );
};

export default HeroSection;