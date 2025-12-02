import { CheckCircle, Mail, Clock, FileText } from "lucide-react";
import { Link } from "react-router-dom";
import { HelmetProvider, Helmet } from "react-helmet-async";

const AuditPaymentSuccess = () => {
  const nextSteps = [
    {
      icon: Mail,
      title: "Check Your Email",
      description: "You'll receive an intake form within 15 minutes. Complete it so I can start your audit.",
    },
    {
      icon: Clock,
      title: "72-Hour Delivery",
      description: "Once you submit the intake form, your audit will be delivered within 72 hours.",
    },
    {
      icon: FileText,
      title: "Notion Report + Loom",
      description: "You'll get a detailed Notion report with actionable insights and a Loom walkthrough.",
    },
  ];

  return (
    <HelmetProvider>
      <Helmet>
        <title>Payment Successful | Web3 Growth Audit</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      
      <div className="min-h-screen bg-gradient-to-br from-[hsl(var(--navy-deep))] to-[#0D3251] flex items-center justify-center px-6 py-20">
        <div className="max-w-2xl mx-auto text-center">
          {/* Success Icon */}
          <div className="inline-flex items-center justify-center w-20 h-20 bg-[#10B981]/20 rounded-full mb-8 animate-pulse">
            <CheckCircle className="w-12 h-12 text-[#10B981]" />
          </div>
          
          {/* Main Message */}
          <h1 className="font-hero font-bold text-3xl md:text-4xl text-white mb-4">
            Payment Successful!
          </h1>
          <p className="font-body text-xl text-white/80 mb-12">
            Thank you for trusting me with your growth audit. Let's find those leaks.
          </p>
          
          {/* Next Steps */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 mb-10 border border-white/10">
            <h2 className="font-hero font-bold text-xl text-white mb-6">
              What Happens Next
            </h2>
            
            <div className="space-y-6">
              {nextSteps.map((step, i) => (
                <div key={i} className="flex items-start gap-4 text-left">
                  <div className="flex-shrink-0 w-10 h-10 bg-[hsl(var(--aqua-bright))]/20 rounded-lg flex items-center justify-center">
                    <step.icon className="w-5 h-5 text-[hsl(var(--aqua-bright))]" />
                  </div>
                  <div>
                    <h3 className="font-hero font-semibold text-white mb-1">
                      {i + 1}. {step.title}
                    </h3>
                    <p className="font-body text-white/70 text-sm">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Guarantee Reminder */}
          <div className="bg-[#10B981]/10 rounded-xl p-6 mb-10 border border-[#10B981]/20">
            <p className="font-body text-[#10B981]">
              <span className="font-semibold">Remember:</span> If I don't find at least 3 meaningful, actionable insights, you get a full refund. No questions asked.
            </p>
          </div>
          
          {/* Back Link */}
          <Link 
            to="/"
            className="inline-flex items-center gap-2 font-hero font-semibold text-white/60 hover:text-white transition-colors"
          >
            ← Back to Homepage
          </Link>
        </div>
      </div>
    </HelmetProvider>
  );
};

export default AuditPaymentSuccess;
