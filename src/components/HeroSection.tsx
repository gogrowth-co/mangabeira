import { Button } from "@/components/ui/button";
import { Medal, TrendingUp, Globe } from "lucide-react";
import olympicPoolBg from "@/assets/olympic-pool-background.png";
import gabrielAvatar from "@/assets/gabriel-avatar.jpg";
import { useLanguage } from "@/hooks/useLanguage";

const HeroSection = () => {
  const { language } = useLanguage();

  const translations = {
    en: {
      subtitle: "Olympian & Growth Marketing Strategist",
      tagline: "Turning Olympic discipline into championship-level digital growth.",
      workWithMe: "Work With Me",
      seeResults: "See My Results",
      imgAlt: "Gabriel Mangabeira, Olympic athlete and marketing strategist"
    },
    pt: {
      subtitle: "Atleta Olímpico & Estrategista de Growth Marketing",
      tagline: "Transformando disciplina olímpica em crescimento digital de nível campeão.",
      workWithMe: "Trabalhe Comigo",
      seeResults: "Veja Meus Resultados",
      imgAlt: "Gabriel Mangabeira, atleta olímpico e estrategista de marketing"
    },
    es: {
      subtitle: "Atleta Olímpico & Estratega de Marketing de Crecimiento",
      tagline: "Convirtiendo la disciplina olímpica en crecimiento digital de nivel campeón.",
      workWithMe: "Trabaja Conmigo",
      seeResults: "Ver Mis Resultados",
      imgAlt: "Gabriel Mangabeira, atleta olímpico y estratega de marketing"
    }
  };

  const t = translations[language];

  return <section id="top" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image - Olympic Pool */}
      <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{
      backgroundImage: `url(${olympicPoolBg})`
    }} />
      
      {/* Strong Dark Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-[rgba(10,15,26,0.88)] via-[rgba(10,15,26,0.86)] to-[rgba(10,15,26,0.84)]" />
      
      {/* Content - Centered Layout with Balanced Spacing */}
      <div className="relative z-10 container mx-auto px-6 sm:px-8 lg:px-16 xl:px-20 py-12 sm:py-16 max-w-7xl">
        <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-16 xl:gap-20">
          
          {/* Text Content - Left Aligned */}
          <div className="order-2 lg:order-1 text-center lg:text-left max-w-[720px]">
            {/* Main Headline - Name */}
            <h1 className="text-white mb-4 leading-tight animate-fade-in text-4xl sm:text-5xl md:text-6xl lg:text-7xl tracking-tight">
              <span className="font-accent font-bold">Gabriel</span>{" "}
              <span className="font-accent font-extrabold">Mangabeira</span>
            </h1>
            
            {/* Subtitle */}
            <h2 className="font-body font-semibold text-[#CCCCCC] mb-5 animate-fade-in text-lg sm:text-2xl md:text-3xl leading-snug" style={{
            animationDelay: '0.1s'
          }}>
              {t.subtitle}
            </h2>
            
            {/* Tagline */}
            <p className="font-body text-white/95 text-sm sm:text-lg md:text-xl mb-6 leading-relaxed animate-fade-in font-normal" style={{
            animationDelay: '0.2s',
            lineHeight: '1.7'
          }}>{t.tagline}</p>
            
            {/* Metrics Row - 2-row grid on mobile, single row on desktop */}
            <div className="mb-6 animate-fade-in" style={{
            animationDelay: '0.3s'
          }}>
              <div className="grid grid-cols-2 sm:flex sm:flex-row items-center lg:items-start lg:justify-start justify-center gap-3 sm:gap-4 text-white">
                <div className="flex items-center gap-1.5 sm:gap-2 px-3.5 py-2.5 sm:px-5 sm:py-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/15 transition-all duration-300">
                  <Medal size={18} strokeWidth={2} className="flex-shrink-0 text-[#FFB400] sm:w-6 sm:h-6" />
                  <span className="font-body font-medium whitespace-nowrap text-[11px] sm:text-base"><span className="font-bold">1M+</span> SEO Readers</span>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2 px-3.5 py-2.5 sm:px-5 sm:py-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/15 transition-all duration-300">
                  <Globe size={18} strokeWidth={2} className="flex-shrink-0 text-[#FFB400] sm:w-6 sm:h-6" />
                  <span className="font-body font-medium whitespace-nowrap text-[11px] sm:text-base"><span className="font-bold">$3.3M+</span> Raised</span>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2 px-3.5 py-2.5 sm:px-5 sm:py-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/15 transition-all duration-300 col-span-2 sm:col-span-1 justify-center sm:justify-start">
                  <TrendingUp size={18} strokeWidth={2} className="flex-shrink-0 text-[#FFB400] sm:w-6 sm:h-6" />
                  <span className="font-body font-medium whitespace-nowrap text-[11px] sm:text-base"><span className="font-bold">Millions</span> Managed</span>
                </div>
              </div>
            </div>
            
            {/* Call-to-Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-center lg:justify-start animate-fade-in" style={{
            animationDelay: '0.4s'
          }}>
              <Button 
                size="lg" 
                className="w-full sm:w-auto px-8 py-6 font-semibold text-lg bg-gradient-to-r from-[#FF8C42] to-[#FFB020] text-white rounded-lg shadow-lg hover:shadow-[0_0_30px_rgba(255,176,32,0.6)] hover:scale-105 transition-all duration-300"
                onClick={() => document.getElementById('capabilities')?.scrollIntoView({ behavior: 'smooth' })}
              >
                {t.workWithMe}
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="w-full sm:w-auto px-8 py-6 text-lg bg-transparent border-2 border-white/80 text-white hover:bg-white hover:text-[#0a0f1a] hover:border-white rounded-lg transition-all duration-300 font-semibold"
                onClick={() => document.getElementById('social-proof')?.scrollIntoView({ behavior: 'smooth' })}
              >
                {t.seeResults}
              </Button>
            </div>
          </div>

          {/* Headshot - Right Side Desktop, Top on Mobile */}
          <div className="order-1 lg:order-2 animate-fade-in">
            <div className="relative w-36 h-36 sm:w-52 sm:h-52 lg:w-80 lg:h-80 rounded-full overflow-hidden ring-2 ring-[#FF8C42] shadow-[0_12px_48px_rgba(0,0,0,0.5),_0_0_32px_rgba(255,140,66,0.2)] hover:shadow-[0_16px_64px_rgba(0,0,0,0.6),_0_0_48px_rgba(255,140,66,0.3)] transition-all duration-300">
              <img src={gabrielAvatar} alt={t.imgAlt} className="w-full h-full object-cover object-center" />
            </div>
          </div>
        </div>
      </div>
    </section>;
};
export default HeroSection;