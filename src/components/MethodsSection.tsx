import { Card, CardContent } from "@/components/ui/card";
import growthFunnelImage from "@/assets/growth-funnel-diagram.png";
import growthLoopImage from "@/assets/growth-loop-diagram.png";
import mediaFrameworkImage from "@/assets/media-framework-diagram.png";

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
        <div className="text-center mb-10 animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            Methods I Use
          </h2>
          <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
            Proven frameworks I apply to unlock scalable growth.
          </p>
        </div>

        {/* Method Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          
          {/* Card 1: 5 Stage Growth Hacking Funnel */}
          <Card className="bg-white border border-border/50 shadow-sm hover:shadow-md transition-all duration-300 rounded-xl">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-foreground mb-2">
                5 Stage Growth Hacking Funnel
              </h3>
              <p className="text-sm text-muted-foreground mb-6">
                Turning users into loyal customers, step by step.
              </p>
              
              <div className="flex justify-center mb-6">
                <img 
                  src={growthFunnelImage} 
                  alt="5 Stage Growth Hacking Funnel showing Acquisition, Activation, Retention, Referral, and Revenue stages with curved feedback loop"
                  className="w-full max-w-xs h-auto object-contain"
                />
              </div>

              <div className="space-y-3 text-sm">
                <div>
                  <p className="font-semibold text-foreground">What It Is:</p>
                  <p className="text-muted-foreground">A structured framework covering Acquisition, Activation, Retention, Referral, and Revenue.</p>
                </div>
                <div>
                  <p className="font-semibold text-foreground">How I Apply It:</p>
                  <p className="text-muted-foreground">I use this funnel to identify friction points and optimize growth at every stage.</p>
                </div>
                <div>
                  <p className="font-semibold text-foreground">Example:</p>
                  <p className="text-muted-foreground">At Neil Patel Brasil, I focused on activation & retention, scaling to 1M+ monthly readers.</p>
                </div>
                <div>
                  <p className="font-semibold text-foreground">Outcome:</p>
                  <p className="text-muted-foreground">Predictable, measurable, and sustainable user growth.</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Card 2: Growth Loops */}
          <Card className="bg-white border border-border/50 shadow-sm hover:shadow-md transition-all duration-300 rounded-xl">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-foreground mb-2">
                Growth Loops
              </h3>
              <p className="text-sm text-muted-foreground mb-6">
                Designing systems where growth creates more growth.
              </p>
              
              <div className="flex justify-center mb-6">
                <img 
                  src={growthLoopImage} 
                  alt="Growth Loop diagram showing Input, Action, and Output cycle with user engagement flow"
                  className="w-full max-w-xs h-auto object-contain"
                />
              </div>

              <div className="space-y-3 text-sm">
                <div>
                  <p className="font-semibold text-foreground">What It Is:</p>
                  <p className="text-muted-foreground">A compounding system where every user action (referral, content, engagement) fuels the next.</p>
                </div>
                <div>
                  <p className="font-semibold text-foreground">How I Apply It:</p>
                  <p className="text-muted-foreground">I design loops that reduce CAC and build momentum beyond one-off campaigns.</p>
                </div>
                <div>
                  <p className="font-semibold text-foreground">Example:</p>
                  <p className="text-muted-foreground">At Russell Marketing, crowdfunding referrals created a self-sustaining loop that raised $6M+.</p>
                </div>
                <div>
                  <p className="font-semibold text-foreground">Outcome:</p>
                  <p className="text-muted-foreground">Growth that scales exponentially instead of linearly.</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Card 3: Media Strategy Framework */}
          <Card className="bg-white border border-border/50 shadow-sm hover:shadow-md transition-all duration-300 rounded-xl">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-foreground mb-2">
                Media Strategy Framework
              </h3>
              <p className="text-sm text-muted-foreground mb-6">
                Balancing Paid, Earned, and Owned media for sustainable growth.
              </p>
              
              <div className="flex justify-center mb-6">
                <img 
                  src={mediaFrameworkImage} 
                  alt="Media Strategy Framework Venn diagram showing Paid, Earned, and Owned media intersecting with Your Media Strategy at the center"
                  className="w-full max-w-xs h-auto object-contain"
                />
              </div>

              <div className="space-y-3 text-sm">
                <div>
                  <p className="font-semibold text-foreground">What It Is:</p>
                  <p className="text-muted-foreground">A classic framework that integrates Paid (ads, sponsorships), Earned (shares, reviews), and Owned (websites, blogs) into a unified strategy.</p>
                </div>
                <div>
                  <p className="font-semibold text-foreground">How I Apply It:</p>
                  <p className="text-muted-foreground">I design campaigns that maximize ROI by aligning paid amplification, organic engagement, and long-term owned assets.</p>
                </div>
                <div>
                  <p className="font-semibold text-foreground">Example:</p>
                  <p className="text-muted-foreground">At Coca-Cola / Powerade Rio 2016, I combined owned content hubs, influencer activation, and paid campaigns to drive engagement around Olympic sponsorships.</p>
                </div>
                <div>
                  <p className="font-semibold text-foreground">Outcome:</p>
                  <p className="text-muted-foreground">Cohesive campaigns that deliver both short-term impact and long-term brand equity.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default MethodsSection;