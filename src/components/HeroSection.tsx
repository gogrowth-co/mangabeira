import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import swimmerBg from "@/assets/gabriel-mangabeira-swimmer-butterfly.png";
import portraitImg from "@/assets/gabriel-profile-blue.jpg";

const HeroSection = () => {
  const [scrollY, setScrollY] = useState(0);
  const [showPhase2, setShowPhase2] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrollY(currentScrollY);
      setShowPhase2(currentScrollY > window.innerHeight * 0.4);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section id="top" className="relative min-h-screen overflow-hidden">
      {/* PHASE 1: Swimmer Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-opacity duration-300"
        style={{
          backgroundImage: `url(${swimmerBg})`,
          opacity: showPhase2 ? 0 : 1
        }}
      />

      {/* Dark gradient overlay for text readability */}
      <div 
        className="absolute inset-0 transition-opacity duration-300"
        style={{
          background: 'linear-gradient(to bottom, rgba(11, 30, 61, 0.8) 0%, rgba(0, 0, 0, 0.7) 100%)',
          opacity: showPhase2 ? 0 : 1
        }}
      />

      {/* Fixed top-left branding - visible in Phase 1 only */}
      <div 
        className="fixed top-8 left-8 sm:top-4 sm:left-4 z-50 transition-opacity duration-300" 
        style={{ opacity: showPhase2 ? 0 : 1 }}
      >
        <h1 className="font-bold text-white text-2xl sm:text-xl tracking-tight">
          GABRIEL MANGABEIRA
        </h1>
        <p className="text-white/90 text-sm font-medium mt-1">
          Olympian & Growth Marketing Strategist
        </p>
      </div>

      {/* Phase 1 Content - Center-right */}
      <div 
        className={cn(
          "absolute right-[10%] md:right-[5%] md:left-[5%] md:max-w-full md:text-center",
          "top-1/2 -translate-y-1/2 max-w-lg z-10",
          "transition-opacity duration-300",
          showPhase2 ? "opacity-0 pointer-events-none" : "opacity-100"
        )}
      >
        <h2 className="text-5xl sm:text-3xl font-bold text-white mb-4 leading-tight">
          From Olympic Pools to Global Growth
        </h2>
        
        <p className="text-xl sm:text-lg text-white/90 mb-8 leading-relaxed">
          Fly into digital growth — guided by an Olympian's discipline.
        </p>
        
        {/* CTAs */}
        <div className="flex gap-4 mb-6 flex-wrap md:justify-center sm:flex-col sm:w-full">
          <Button 
            size="lg"
            className="bg-[#FF7B00] text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg transition-shadow sm:w-full"
            onClick={() => document.getElementById('capabilities')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Start Your Growth Sprint
          </Button>
          
          <Button 
            size="lg"
            variant="outline"
            className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors sm:w-full"
            onClick={() => document.getElementById('social-proof')?.scrollIntoView({ behavior: 'smooth' })}
          >
            See My Results
          </Button>
        </div>
        
        {/* Proof line */}
        <p className="text-sm text-white/70 font-medium">
          1M+ Global SEO Readers · $3.3M+ Raised · Millions Managed
        </p>
      </div>

      {/* Scroll indicator - disappears when Phase 2 activates */}
      <div 
        className={cn(
          "absolute bottom-8 left-1/2 -translate-x-1/2 text-white/60 text-sm font-medium",
          "transition-opacity duration-300 animate-bounce",
          showPhase2 ? "opacity-0" : "opacity-100"
        )}
      >
        ↓ Keep Swimming
      </div>

      {/* PHASE 2: Light Background */}
      <div 
        className="absolute inset-0 bg-[#F7F9FB] transition-opacity duration-300"
        style={{ opacity: showPhase2 ? 1 : 0 }}
      />

      {/* Phase 2 Content - Personal Reveal */}
      <div 
        className={cn(
          "absolute inset-0 flex items-center justify-between px-[10%] md:px-[5%] z-10",
          "md:flex-col md:text-center md:gap-8 md:justify-center",
          "transition-opacity duration-300",
          showPhase2 ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
      >
        {/* Left: Text content */}
        <div className="max-w-xl md:max-w-2xl">
          <h2 className="text-4xl sm:text-3xl font-bold text-[#0B1E3D] mb-4 leading-tight">
            Meet Gabriel Mangabeira
          </h2>
          
          <p className="text-xl sm:text-lg text-[#0B1E3D]/80 mb-6 leading-relaxed">
            Olympian turned Growth Strategist helping Web3, AI & SaaS brands 
            scale with discipline and data.
          </p>
          
          <p className="text-base text-[#0B1E3D]/70 mb-8 leading-relaxed">
            After competing on the world stage, I learned that consistency beats 
            intensity — both in sport and in growth. Now I build systems that help 
            global startups scale with Olympic precision.
          </p>
          
          <Button 
            size="lg"
            className="bg-[#FF7B00] text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg transition-shadow"
            onClick={() => document.getElementById('capabilities')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Book Your Growth Sprint
          </Button>
        </div>
        
        {/* Right: Portrait */}
        <img 
          src={portraitImg}
          alt="Gabriel Mangabeira - Olympic athlete and growth marketing strategist"
          className="w-[20vw] md:w-[50vw] sm:w-[80vw] min-w-[280px] md:min-w-0 rounded-2xl shadow-2xl object-cover"
        />
      </div>
    </section>
  );
};

export default HeroSection;
