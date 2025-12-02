import { ArrowRight } from "lucide-react";
import binanceLogo from "@/assets/binance-logo.png";
import eigenlayerLogo from "@/assets/eigenlayer-logo.png";
import tokenHealthLogo from "@/assets/token-health-scan-logo.png";

const AuditHero = () => {
  return (
    <section className="min-h-[90vh] bg-gradient-to-br from-[#0A2540] via-[#0A2540]/95 to-[#0D3251] relative overflow-hidden">
      {/* Background Pattern - subtle grid or dots */}
      <div className="absolute inset-0 opacity-5">
        {/* Optional: subtle pattern */}
      </div>
      
      <div className="container mx-auto px-6 lg:px-8 py-20 lg:py-32 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Eyebrow Text */}
          <p className="text-[#1FB6FF] font-hero font-semibold text-sm uppercase tracking-widest mb-6">
            AI + Human Web3 Growth Audit
          </p>

          {/* Main Headline (H1) */}
          <h1 className="font-hero font-bold text-4xl md:text-5xl lg:text-6xl text-white leading-tight mb-6">
            Find Hidden Growth Leaks in 72 Hours — And Get the Exact Actions to Fix Them
          </h1>

          {/* Subheadline */}
          <p className="font-body text-lg md:text-xl text-white/80 mb-8 max-w-3xl mx-auto leading-relaxed">
            Stop guessing why growth feels unpredictable. Get a cross-channel Web3 audit that reveals your blind spots across Reddit, Discord, on-chain, website, and your dApp — analyzed by a growth operator with 10+ years of experience.
          </p>

          {/* Benefit Bullets (2-column grid on desktop) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto mb-10 text-left">
            {[
              "Why sentiment drops",
              "Where users silently churn", 
              "What's blocking activation",
              "What's killing retention",
              "Which decisions actually move the needle"
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 text-white/90">
                <span className="text-[#1FB6FF]">✓</span>
                <span className="font-body">{item}</span>
              </div>
            ))}
          </div>

          {/* Key Value Props (horizontal badges) */}
          <div className="flex flex-wrap justify-center gap-4 mb-10">
            {[
              "Delivered in 72 hours",
              "Clear, actionable insights", 
              "Refunded if <3 findings"
            ].map((item, i) => (
              <span key={i} className="px-4 py-2 bg-white/10 rounded-full text-white/90 text-sm font-medium backdrop-blur-sm border border-white/10">
                👉 {item}
              </span>
            ))}
          </div>

          {/* Primary CTA Button */}
          <button 
            className="bg-[#FFB800] hover:bg-[#E6A600] text-[#0A2540] font-hero font-bold text-lg px-10 py-4 rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
            onClick={() => window.open('https://calendly.com/gabriel-mangabeira/15min', '_blank')}
          >
            Diagnose My Growth Leaks →
          </button>

          {/* Trust Logos Bar (bottom of hero) */}
          <div className="mt-16 pt-8 border-t border-white/10">
            <p className="text-white/50 text-sm font-body mb-6 uppercase tracking-wide">
              Trusted by operators across
            </p>
            <div className="flex flex-wrap justify-center items-center gap-8 opacity-90">
              <img src={binanceLogo} alt="Binance" className="h-6" />
              <img src={eigenlayerLogo} alt="EigenLayer" className="h-8" />
              <span className="text-white/70 font-hero text-sm">L1 Ecosystems</span>
              <img src={tokenHealthLogo} alt="Token Health Scan" className="h-8" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AuditHero;
