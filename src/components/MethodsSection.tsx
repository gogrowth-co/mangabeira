import { Card, CardContent } from "@/components/ui/card";
import growthFunnelImage from "@/assets/growth-funnel-diagram.png";
import growthLoopImage from "@/assets/growth-loop-diagram.png";

const MethodsSection = () => {
  return (
    <section className="py-20 bg-background relative overflow-hidden">
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
          <h2 className="text-4xl md:text-5xl font-hero font-bold text-navy-deep mb-4">
            My Methods
          </h2>
          <p className="text-xl text-muted-foreground font-body max-w-3xl mx-auto leading-relaxed">
            Blending data-driven insights with innovative marketing to skyrocket your brand.
          </p>
        </div>

        {/* Two Method Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-7xl mx-auto">
          
          {/* Left Card: Growth Funnel */}
          <Card className="p-8 bg-card border border-border shadow-lg animate-fade-in hover:shadow-xl transition-all duration-300">
            <CardContent className="p-0">
              <h3 className="text-2xl font-hero font-bold text-navy-deep mb-8 text-center">
                5 Stage Growth Hacking Funnel
              </h3>
              
              <div className="flex justify-center">
                <img 
                  src={growthFunnelImage} 
                  alt="5 Stage Growth Hacking Funnel showing Acquisition, Activation, Retention, Referral, and Revenue stages with curved feedback loop"
                  className="w-full max-w-md h-auto object-contain hover:scale-105 transition-transform duration-300"
                />
              </div>
            </CardContent>
          </Card>

          {/* Right Card: Growth Loop */}
          <Card className="p-8 bg-card border border-border shadow-lg animate-fade-in hover:shadow-xl transition-all duration-300" style={{ animationDelay: "400ms" }}>
            <CardContent className="p-0">
              <h3 className="text-2xl font-hero font-bold text-navy-deep mb-8 text-center">
                Growth Loop Input
              </h3>
              
              <div className="flex justify-center">
                <img 
                  src={growthLoopImage} 
                  alt="Growth Loop diagram showing Input, Action, and Output cycle with user engagement flow"
                  className="w-full max-w-md h-auto object-contain hover:scale-105 transition-transform duration-300"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default MethodsSection;