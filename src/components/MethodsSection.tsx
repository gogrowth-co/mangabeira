import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import growthFunnelImage from "@/assets/growth-hacking-funnel.png";
import growthLoopImage from "@/assets/user-engagement-cycle.png";
import mediaFrameworkImage from "@/assets/unified-media-strategy.png";

const MethodsSection = () => {
  return (
    <section id="methods" className="py-20 md:py-28 bg-bg-mist relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5">
        <svg className="w-full h-full" viewBox="0 0 1200 800" fill="none">
          <path d="M0,400 Q300,200 600,400 T1200,400" stroke="currentColor" strokeWidth="2"/>
          <path d="M0,600 Q300,400 600,600 T1200,600" stroke="currentColor" strokeWidth="2"/>
        </svg>
      </div>

      <div className="container mx-auto px-4 relative">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="font-hero font-bold text-text-primary mb-4" style={{ fontSize: 'clamp(24px, 3.5vw, 36px)', lineHeight: '1.2' }}>
            Methods I Use
          </h2>
          <p className="text-text-secondary font-body max-w-2xl mx-auto" style={{ fontSize: 'clamp(15px, 1.4vw, 17px)', lineHeight: '1.6' }}>
            Frameworks I use to drive growth.
          </p>
        </div>

        {/* Method Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          
          {/* Card 1: 5 Stage Growth Hacking Funnel */}
          <Card className="bg-card border border-border transition-all duration-300" style={{ borderRadius: '18px', boxShadow: '0 6px 24px rgba(15, 23, 42, 0.08)' }}>
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-foreground mb-2">
                5 Stage Growth Hacking Funnel
              </h3>
              <p className="text-base text-muted-foreground italic mb-6">
                Turning users into loyal customers, step by step.
              </p>
              
              <div className="flex justify-center mb-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-6">
                <img 
                  src={growthFunnelImage} 
                  alt="Growth Hacking Funnel showing User Activation, User Retention, User Referral, and Revenue Generation stages"
                  className="w-full max-w-sm h-auto object-contain"
                />
              </div>

              <p className="text-muted-foreground mb-6">
                Framework for acquisition, activation, retention, referral, and revenue.
              </p>

              <Button 
                onClick={() => document.getElementById('case-studies')?.scrollIntoView({ behavior: 'smooth' })}
                className="w-full bg-gradient-to-r from-[#FF8C42] to-[#FFB020] text-white font-semibold hover:shadow-[0_0_30px_rgba(255,176,32,0.6)] hover:scale-105 transition-all duration-300"
              >
                See this in action
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>

          {/* Card 2: Growth Loops */}
          <Card className="bg-card border border-border transition-all duration-300" style={{ borderRadius: '18px', boxShadow: '0 6px 24px rgba(15, 23, 42, 0.08)' }}>
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-foreground mb-2">
                Growth Loops
              </h3>
              <p className="text-base text-muted-foreground italic mb-6">
                Designing systems where growth creates more growth.
              </p>
              
              <div className="flex justify-center mb-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-6">
                <img 
                  src={growthLoopImage} 
                  alt="User Engagement Cycle showing Input, Action, and Output in a continuous loop"
                  className="w-full max-w-sm h-auto object-contain"
                />
              </div>

              <p className="text-muted-foreground mb-6">
                Each user action compounds into the next, fueling momentum.
              </p>

              <Button 
                onClick={() => document.getElementById('case-studies')?.scrollIntoView({ behavior: 'smooth' })}
                className="w-full bg-gradient-to-r from-[#FF8C42] to-[#FFB020] text-white font-semibold hover:shadow-[0_0_30px_rgba(255,176,32,0.6)] hover:scale-105 transition-all duration-300"
              >
                See this in action
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>

          {/* Card 3: Media Strategy Framework */}
          <Card className="bg-card border border-border transition-all duration-300" style={{ borderRadius: '18px', boxShadow: '0 6px 24px rgba(15, 23, 42, 0.08)' }}>
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-foreground mb-2">
                Media Strategy Framework
              </h3>
              <p className="text-base text-muted-foreground italic mb-6">
                Balancing Paid, Earned, and Owned media for sustainable growth.
              </p>
              
              <div className="flex justify-center mb-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-6">
                <img 
                  src={mediaFrameworkImage} 
                  alt="Unified Media Strategy Overview showing Paid Media, Earned Media, and Owned Media in a circular Venn diagram"
                  className="w-full max-w-sm h-auto object-contain"
                />
              </div>

              <p className="text-muted-foreground mb-6">
                Aligns paid campaigns, organic engagement, and owned assets into one cohesive strategy.
              </p>

              <Button 
                onClick={() => document.getElementById('case-studies')?.scrollIntoView({ behavior: 'smooth' })}
                className="w-full bg-gradient-to-r from-[#FF8C42] to-[#FFB020] text-white font-semibold hover:shadow-[0_0_30px_rgba(255,176,32,0.6)] hover:scale-105 transition-all duration-300"
              >
                See this in action
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default MethodsSection;