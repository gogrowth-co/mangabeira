import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const AuditHero = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center bg-gradient-to-br from-navy/95 to-navy/85 py-24 px-6">
      <div className="max-w-4xl mx-auto text-center space-y-8 animate-fade-in">
        {/* Eyebrow badge */}
        <div className="animate-fade-in" style={{ animationDelay: "0ms" }}>
          <span className="uppercase text-xs tracking-widest text-aqua font-medium">
            AI + HUMAN WEB3 GROWTH AUDIT
          </span>
        </div>

        {/* H1 headline */}
        <h1 
          className="font-hero text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight animate-fade-in"
          style={{ animationDelay: "100ms" }}
        >
          Find Your Growth Leaks in 72 Hours — With Data You Can Act On Immediately
        </h1>

        {/* Subheadline */}
        <p 
          className="font-body text-xl text-white/80 max-w-2xl mx-auto font-normal mt-6 animate-fade-in"
          style={{ animationDelay: "200ms" }}
        >
          Your Reddit, on-chain, and funnel data — analyzed by AI, interpreted by a strategist with 10+ years in growth.
        </p>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-10 animate-fade-in" style={{ animationDelay: "300ms" }}>
          <Button
            size="lg"
            className="bg-gold text-navy font-semibold px-8 py-4 rounded-lg hover:scale-105 shadow-button hover:shadow-button-hover transition-all duration-300"
            onClick={() => window.scrollTo({ top: document.getElementById('pricing')?.offsetTop || 0, behavior: 'smooth' })}
          >
            Diagnose My Growth Leaks
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <button 
            className="text-aqua underline hover:text-white transition-colors duration-300 font-medium"
            onClick={() => window.scrollTo({ top: document.getElementById('proof')?.offsetTop || 0, behavior: 'smooth' })}
          >
            See a Sample Audit →
          </button>
        </div>

        {/* Trust bar */}
        <div className="mt-16 pt-16 border-t border-white/10 animate-fade-in" style={{ animationDelay: "400ms" }}>
          <p className="text-white/60 text-sm mb-4">Trusted by operators across:</p>
          <p className="text-white/40 tracking-wide text-sm">
            Binance · Neil Patel Digital · L1 Ecosystems · Olympic Programs
          </p>
        </div>
      </div>
    </section>
  );
};

export default AuditHero;
