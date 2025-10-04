import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import growthFunnelImage from "@/assets/growth-hacking-funnel.png";
import growthLoopImage from "@/assets/growth-loops.png";
import mediaFrameworkImage from "@/assets/unified-media-strategy.png";

const MethodsSection = () => {
  return (
    <section id="methods" className="py-10 md:py-12 lg:py-14 bg-[#EFF6FA] relative overflow-hidden">
      {/* Subtle top separator */}
      <div className="absolute top-0 left-0 right-0 h-[120px] bg-gradient-to-b from-[rgba(10,31,52,0.06)] to-transparent pointer-events-none"></div>

      <div className="container mx-auto px-4 relative" style={{ maxWidth: '1280px' }}>
        {/* Header */}
        <div className="text-center mb-6 md:mb-5 lg:mb-6 animate-fade-in">
          <h2 className="font-bold mb-2 md:mb-1.5 lg:mb-2" style={{ fontSize: 'clamp(32px, 3.5vw, 36px)', lineHeight: '1.2', fontWeight: 800, color: '#0B1B2B' }}>
            Methods I Use
          </h2>
          <p className="font-body max-w-2xl mx-auto" style={{ fontSize: '16px', fontWeight: 500, color: '#5B6B7C' }}>
            Frameworks I use to drive growth.
          </p>
        </div>

        {/* Method Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-6 lg:gap-6">
          
          {/* Card 1: 5 Stage Growth Hacking Funnel */}
          <Card className="bg-white border transition-all duration-300 hover:-translate-y-0.5 h-full flex flex-col" style={{ 
            borderRadius: '16px', 
            borderColor: '#EAF0F4',
            boxShadow: '0 10px 24px rgba(7,16,28,0.06)' 
          }}>
            <CardContent className="p-6 md:p-7 flex flex-col flex-1">
              <h3 className="font-bold mb-2" style={{ fontSize: 'clamp(22px, 2vw, 24px)', lineHeight: '1.3', color: '#0B1B2B' }}>
                5-Stage Growth Hacking Funnel
              </h3>
              <p className="mb-6" style={{ fontSize: '16px', fontWeight: 500, lineHeight: '1.4', color: '#5B6B7C' }}>
                Turning users into loyal customers, step by step.
              </p>
              
              <div className="flex justify-center mb-6 overflow-hidden" style={{ 
                aspectRatio: '16/12', 
                borderRadius: '16px',
                boxShadow: 'inset 0 2px 8px rgba(7,16,28,0.04)'
              }}>
                <img 
                  src={growthFunnelImage} 
                  alt="5-stage growth funnel: Acquisition, Activation, Retention, Referral, Revenue"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>

              <p className="mb-6 flex-1" style={{ fontSize: 'clamp(15px, 1.3vw, 16px)', fontWeight: 400, lineHeight: '1.6', color: '#5B6B7C' }}>
                Framework for acquisition, activation, retention, referral, and revenue.
              </p>

              <a 
                href="#case-studies"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('case-studies')?.scrollIntoView({ behavior: 'smooth' });
                }}
                aria-label="See Growth Hacking Funnel in action"
                className="inline-flex items-center justify-center font-semibold transition-all duration-300 hover:-translate-y-0.5"
                style={{ 
                  borderRadius: '999px',
                  padding: '12px 18px',
                  background: 'linear-gradient(90deg, #F6A526 0%, #FB7A1D 100%)',
                  color: '#0B1B2B',
                  boxShadow: '0 2px 8px rgba(246,165,38,0.2)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(251,122,29,0.35)';
                  e.currentTarget.style.transform = 'translateY(-0.5px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(246,165,38,0.2)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                See this in action →
              </a>
            </CardContent>
          </Card>

          {/* Card 2: Growth Loops */}
          <Card className="bg-white border transition-all duration-300 hover:-translate-y-0.5 h-full flex flex-col" style={{ 
            borderRadius: '16px', 
            borderColor: '#EAF0F4',
            boxShadow: '0 10px 24px rgba(7,16,28,0.06)' 
          }}>
            <CardContent className="p-6 md:p-7 flex flex-col flex-1">
              <h3 className="font-bold mb-2" style={{ fontSize: 'clamp(22px, 2vw, 24px)', lineHeight: '1.3', color: '#0B1B2B' }}>
                Growth Loops
              </h3>
              <p className="mb-6" style={{ fontSize: '16px', fontWeight: 500, lineHeight: '1.4', color: '#5B6B7C' }}>
                Designing systems where growth compounds.
              </p>
              
              <div className="flex justify-center mb-6 overflow-hidden" style={{ 
                aspectRatio: '16/12', 
                borderRadius: '16px',
                boxShadow: 'inset 0 2px 8px rgba(7,16,28,0.04)'
              }}>
                <img 
                  src={growthLoopImage} 
                  alt="Growth loop: Input → Action → Output, compounding user engagement"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>

              <p className="mb-6 flex-1" style={{ fontSize: 'clamp(15px, 1.3vw, 16px)', fontWeight: 400, lineHeight: '1.6', color: '#5B6B7C' }}>
                Each user action feeds the next, building momentum.
              </p>

              <a 
                href="#case-studies"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('case-studies')?.scrollIntoView({ behavior: 'smooth' });
                }}
                aria-label="See Growth Loops in action"
                className="inline-flex items-center justify-center font-semibold transition-all duration-300 hover:-translate-y-0.5"
                style={{ 
                  borderRadius: '999px',
                  padding: '12px 18px',
                  background: 'linear-gradient(90deg, #F6A526 0%, #FB7A1D 100%)',
                  color: '#0B1B2B',
                  boxShadow: '0 2px 8px rgba(246,165,38,0.2)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(251,122,29,0.35)';
                  e.currentTarget.style.transform = 'translateY(-0.5px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(246,165,38,0.2)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                See this in action →
              </a>
            </CardContent>
          </Card>

          {/* Card 3: Media Strategy Framework */}
          <Card className="bg-white border transition-all duration-300 hover:-translate-y-0.5 h-full flex flex-col" style={{ 
            borderRadius: '16px', 
            borderColor: '#EAF0F4',
            boxShadow: '0 10px 24px rgba(7,16,28,0.06)' 
          }}>
            <CardContent className="p-6 md:p-7 flex flex-col flex-1">
              <h3 className="font-bold mb-2" style={{ fontSize: 'clamp(22px, 2vw, 24px)', lineHeight: '1.3', color: '#0B1B2B' }}>
                Media Strategy Framework
              </h3>
              <p className="mb-6" style={{ fontSize: '16px', fontWeight: 500, lineHeight: '1.4', color: '#5B6B7C' }}>
                Balancing Paid, Owned, and Earned.
              </p>
              
              <div className="flex justify-center mb-6 overflow-hidden" style={{ 
                aspectRatio: '16/12', 
                borderRadius: '16px',
                boxShadow: 'inset 0 2px 8px rgba(7,16,28,0.04)'
              }}>
                <img 
                  src={mediaFrameworkImage} 
                  alt="Unified media strategy: Paid, Owned, Earned segments"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>

              <p className="mb-6 flex-1" style={{ fontSize: 'clamp(15px, 1.3vw, 16px)', fontWeight: 400, lineHeight: '1.6', color: '#5B6B7C' }}>
                Align campaigns, community, and assets in one plan.
              </p>

              <a 
                href="#case-studies"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('case-studies')?.scrollIntoView({ behavior: 'smooth' });
                }}
                aria-label="See Media Strategy Framework in action"
                className="inline-flex items-center justify-center font-semibold transition-all duration-300 hover:-translate-y-0.5"
                style={{ 
                  borderRadius: '999px',
                  padding: '12px 18px',
                  background: 'linear-gradient(90deg, #F6A526 0%, #FB7A1D 100%)',
                  color: '#0B1B2B',
                  boxShadow: '0 2px 8px rgba(246,165,38,0.2)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(251,122,29,0.35)';
                  e.currentTarget.style.transform = 'translateY(-0.5px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(246,165,38,0.2)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                See this in action →
              </a>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default MethodsSection;