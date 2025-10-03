import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import growthFunnelImage from "@/assets/growth-hacking-funnel.png";
import growthLoopImage from "@/assets/user-engagement-cycle.png";
import mediaFrameworkImage from "@/assets/unified-media-strategy.png";

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
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Methods I Use
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Proven frameworks I apply to unlock scalable growth.
          </p>
        </div>

        {/* Method Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          
          {/* Card 1: 5 Stage Growth Hacking Funnel */}
          <Card className="bg-white border border-border/50 shadow-sm hover:shadow-lg transition-all duration-300 rounded-xl">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-foreground mb-2">
                5 Stage Growth Hacking Funnel
              </h3>
              <p className="text-base text-muted-foreground italic mb-6">
                Turning users into loyal customers, step by step.
              </p>
              
              <div className="flex justify-center mb-8 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-6">
                <img 
                  src={growthFunnelImage} 
                  alt="Growth Hacking Funnel showing User Activation, User Retention, User Referral, and Revenue Generation stages"
                  className="w-full max-w-sm h-auto object-contain"
                />
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <span className="font-bold text-foreground">What It Is:</span>
                  <span className="text-muted-foreground"> A structured framework covering Acquisition, Activation, Retention, Referral, and Revenue.</span>
                </div>
                <div>
                  <span className="font-bold text-foreground">How I Apply It:</span>
                  <span className="text-muted-foreground"> I use this funnel to identify friction points and optimize growth at every stage.</span>
                </div>
                <div>
                  <span className="font-bold text-foreground">Example:</span>
                  <span className="text-muted-foreground"> At Neil Patel Brasil, I focused on activation & retention, scaling to 1M+ monthly readers.</span>
                </div>
                <div>
                  <span className="font-bold text-foreground">Outcome:</span>
                  <span className="text-muted-foreground"> Predictable, measurable, and sustainable user growth.</span>
                </div>
              </div>

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
          <Card className="bg-white border border-border/50 shadow-sm hover:shadow-lg transition-all duration-300 rounded-xl">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-foreground mb-2">
                Growth Loops
              </h3>
              <p className="text-base text-muted-foreground italic mb-6">
                Designing systems where growth creates more growth.
              </p>
              
              <div className="flex justify-center mb-8 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-6">
                <img 
                  src={growthLoopImage} 
                  alt="User Engagement Cycle showing Input, Action, and Output in a continuous loop"
                  className="w-full max-w-sm h-auto object-contain"
                />
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <span className="font-bold text-foreground">What It Is:</span>
                  <span className="text-muted-foreground"> A compounding system where every user action (referral, content, engagement) fuels the next.</span>
                </div>
                <div>
                  <span className="font-bold text-foreground">How I Apply It:</span>
                  <span className="text-muted-foreground"> I design loops that reduce CAC and build momentum beyond one-off campaigns.</span>
                </div>
                <div>
                  <span className="font-bold text-foreground">Example:</span>
                  <span className="text-muted-foreground"> At Russell Marketing, crowdfunding referrals created a self-sustaining loop that raised $6M+.</span>
                </div>
                <div>
                  <span className="font-bold text-foreground">Outcome:</span>
                  <span className="text-muted-foreground"> Growth that scales exponentially instead of linearly.</span>
                </div>
              </div>

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
          <Card className="bg-white border border-border/50 shadow-sm hover:shadow-lg transition-all duration-300 rounded-xl">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-foreground mb-2">
                Media Strategy Framework
              </h3>
              <p className="text-base text-muted-foreground italic mb-6">
                Balancing Paid, Earned, and Owned media for sustainable growth.
              </p>
              
              <div className="flex justify-center mb-8 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-6">
                <img 
                  src={mediaFrameworkImage} 
                  alt="Unified Media Strategy Overview showing Paid Media, Earned Media, and Owned Media in a circular Venn diagram"
                  className="w-full max-w-sm h-auto object-contain"
                />
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <span className="font-bold text-foreground">What It Is:</span>
                  <span className="text-muted-foreground"> A classic framework that integrates Paid (ads, sponsorships), Earned (shares, reviews), and Owned (websites, blogs) into a unified strategy.</span>
                </div>
                <div>
                  <span className="font-bold text-foreground">How I Apply It:</span>
                  <span className="text-muted-foreground"> I design campaigns that maximize ROI by aligning paid amplification, organic engagement, and long-term owned assets.</span>
                </div>
                <div>
                  <span className="font-bold text-foreground">Example:</span>
                  <span className="text-muted-foreground"> At Coca-Cola / Powerade Rio 2016, I combined owned content hubs, influencer activation, and paid campaigns to drive engagement around Olympic sponsorships.</span>
                </div>
                <div>
                  <span className="font-bold text-foreground">Outcome:</span>
                  <span className="text-muted-foreground"> Cohesive campaigns that deliver both short-term impact and long-term brand equity.</span>
                </div>
              </div>

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