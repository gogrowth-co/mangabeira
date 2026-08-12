import { CheckCircle, Clock, FileText, ClipboardList } from "lucide-react";
import { Link } from "react-router-dom";
import { HelmetProvider, Helmet } from "react-helmet-async";
import SEOHead from "@/components/SEOHead";
import HubSpotForm from "@/components/HubSpotForm";

const AuditPaymentSuccess = () => {
  const nextSteps = [
    {
      icon: Clock,
      title: "72-Hour Delivery",
      description: "Once you submit the form above, your audit will be delivered within 72 hours.",
    },
    {
      icon: FileText,
      title: "Notion Report + Loom",
      description: "You'll get a detailed Notion report with actionable insights and a Loom walkthrough.",
    },
  ];

  return (
    <HelmetProvider>
      <SEOHead
        title="Payment Successful | Web3 Growth Audit"
        description="Your Web3 Growth Audit payment was successful. Submit your intake form to start the 72-hour delivery."
        canonical="https://mangabeira.net/audit-payment-success"
      />
      <Helmet>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      
      <div className="min-h-screen bg-gradient-to-br from-[hsl(var(--navy-deep))] to-[#0D3251] px-6 py-12 md:py-20">
        <div className="max-w-2xl mx-auto">
          {/* Success Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-[#10B981]/20 rounded-full mb-6">
              <CheckCircle className="w-10 h-10 text-[#10B981]" />
            </div>
            
            <h1 className="font-hero font-bold text-3xl md:text-4xl text-white mb-3">
              Payment Successful!
            </h1>
            <p className="font-body text-lg text-white/80">
              Thank you for trusting me with your growth audit. Let's find those leaks.
            </p>
          </div>
          
          {/*
            Light card, deliberately. HubSpot renders this form inside a
            cross-origin iframe (.hs-form-frame), so no CSS of ours can reach its
            labels — and its theme paints them dark navy, which was invisible on
            the translucent dark card this used to sit on. Putting the form on a
            white surface is the only fix available from our side; the alternative
            is recolouring the form in HubSpot's own editor. Keep this background
            light unless that theme changes.
          */}
          <div className="bg-white rounded-2xl p-6 md:p-8 mb-8 border border-black/5 shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-shrink-0 w-10 h-10 bg-[hsl(var(--navy-deep))] rounded-lg flex items-center justify-center">
                <ClipboardList className="w-5 h-5 text-[hsl(var(--aqua-bright))]" />
              </div>
              <div>
                <h2 className="font-hero font-bold text-xl text-[hsl(var(--navy-deep))]">
                  Complete Your Intake Form
                </h2>
                <p className="font-body text-sm text-slate-600">
                  Fill this out so I can start your audit immediately
                </p>
              </div>
            </div>

            <HubSpotForm 
              portalId="44894585" 
              formId="bb7ca9e0-d5bd-4b9f-96bf-dd66ccf6aec5" 
            />
          </div>
          
          {/* What Happens Next */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 md:p-8 mb-8 border border-white/10">
            <h2 className="font-hero font-bold text-lg text-white mb-5">
              What Happens After You Submit
            </h2>
            
            <div className="space-y-5">
              {nextSteps.map((step, i) => (
                <div key={i} className="flex items-start gap-4">
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
          <div className="bg-[#10B981]/10 rounded-xl p-5 mb-8 border border-[#10B981]/20">
            <p className="font-body text-[#10B981] text-sm">
              <span className="font-semibold">Remember:</span> If I don't find at least 3 meaningful, actionable insights, you get a full refund. No questions asked.
            </p>
          </div>
          
          {/* Back Link */}
          <div className="text-center">
            <Link 
              to="/"
              className="inline-flex items-center gap-2 font-hero font-semibold text-white/60 hover:text-white transition-colors"
            >
              ← Back to Homepage
            </Link>
          </div>
        </div>
      </div>
    </HelmetProvider>
  );
};

export default AuditPaymentSuccess;
