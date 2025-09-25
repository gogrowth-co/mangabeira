import { Card, CardContent } from "@/components/ui/card";
import { ShoppingCart, Megaphone, RotateCcw, Users, DollarSign, ArrowRight } from "lucide-react";

const MethodsSection = () => {
  const funnelStages = [
    {
      title: "Acquisition",
      description: "Bring users in",
      icon: ShoppingCart,
      color: "from-yellow-500 to-orange-500",
      bgColor: "bg-yellow-100"
    },
    {
      title: "Activation", 
      description: "Engage them fast",
      icon: Megaphone,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-100"
    },
    {
      title: "Retention",
      description: "Keep them coming back", 
      icon: RotateCcw,
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-100"
    },
    {
      title: "Referral",
      description: "Turn users into advocates",
      icon: Users,
      color: "from-orange-500 to-orange-600", 
      bgColor: "bg-orange-100"
    },
    {
      title: "Revenue",
      description: "Monetize sustainably",
      icon: DollarSign,
      color: "from-gray-700 to-gray-800",
      bgColor: "bg-gray-100"
    }
  ];

  const loopSteps = [
    {
      title: "Input",
      description: "A user (new or returning) enters the loop",
      position: "top"
    },
    {
      title: "Action", 
      description: "User takes action → generates output",
      position: "right"
    },
    {
      title: "Output",
      description: "Output reinvested as new input",
      position: "bottom"
    }
  ];

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
          <Card className="p-8 bg-card border border-border shadow-lg animate-fade-in">
            <CardContent className="p-0">
              <h3 className="text-2xl font-hero font-bold text-navy-deep mb-8 text-center">
                5 Stage Growth Hacking Funnel
              </h3>
              
              <div className="relative">
                {/* Funnel Stages */}
                <div className="space-y-4">
                  {funnelStages.map((stage, index) => {
                    const IconComponent = stage.icon;
                    return (
                      <div 
                        key={index}
                        className="flex items-center space-x-4 animate-fade-in"
                        style={{ animationDelay: `${index * 200}ms` }}
                      >
                        {/* Stage Width Visual */}
                        <div 
                          className={`${stage.bgColor} rounded-lg p-4 flex-1 flex items-center space-x-4 transition-all duration-300 hover:shadow-md`}
                          style={{ width: `${100 - (index * 10)}%` }}
                        >
                          <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${stage.color} flex items-center justify-center`}>
                            <IconComponent className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <h4 className="font-hero font-bold text-navy-deep">{stage.title}</h4>
                            <p className="text-sm text-muted-foreground">{stage.description}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Curved Arrow from Referral back to Acquisition */}
                <div className="absolute -right-8 top-1/2 transform translate-y-8">
                  <svg width="60" height="120" viewBox="0 0 60 120" className="text-primary animate-fade-in" style={{ animationDelay: "1200ms" }}>
                    <path 
                      d="M10,90 Q50,70 50,30 Q50,10 30,10" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      fill="none" 
                      markerEnd="url(#arrowhead)"
                    />
                    <defs>
                      <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
                        <polygon points="0 0, 10 3.5, 0 7" fill="currentColor" />
                      </marker>
                    </defs>
                  </svg>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Right Card: Growth Loop */}
          <Card className="p-8 bg-card border border-border shadow-lg animate-fade-in" style={{ animationDelay: "400ms" }}>
            <CardContent className="p-0">
              <h3 className="text-2xl font-hero font-bold text-navy-deep mb-8 text-center">
                Growth Loop Input
              </h3>
              
              <div className="relative h-80 flex items-center justify-center">
                {/* Central Circle */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                    <RotateCcw className="h-8 w-8 text-white animate-spin-slow" />
                  </div>
                </div>

                {/* Loop Steps */}
                {loopSteps.map((step, index) => {
                  const positions = {
                    top: "top-4 left-1/2 transform -translate-x-1/2",
                    right: "right-4 top-1/2 transform -translate-y-1/2", 
                    bottom: "bottom-4 left-1/2 transform -translate-x-1/2"
                  };

                  return (
                    <div 
                      key={index}
                      className={`absolute ${positions[step.position as keyof typeof positions]} max-w-40 text-center animate-fade-in`}
                      style={{ animationDelay: `${(index + 2) * 300}ms` }}
                    >
                      <div className="bg-background border border-border rounded-lg p-3 shadow-sm">
                        <h4 className="font-hero font-bold text-navy-deep text-sm mb-1">
                          {step.title}
                        </h4>
                        <p className="text-xs text-muted-foreground leading-tight">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  );
                })}

                {/* Circular Arrows */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none animate-fade-in" style={{ animationDelay: "800ms" }}>
                  <circle 
                    cx="50%" 
                    cy="50%" 
                    r="100" 
                    fill="none" 
                    stroke="url(#gradient)" 
                    strokeWidth="3" 
                    strokeDasharray="10,5"
                    className="animate-pulse"
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#3b82f6" />
                      <stop offset="50%" stopColor="#8b5cf6" />
                      <stop offset="100%" stopColor="#06b6d4" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default MethodsSection;