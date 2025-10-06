import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const CTASection = () => {
  return (
    <section id="contact" className="py-20 md:py-28 px-6 bg-bg-ink">
      <div className="max-w-4xl mx-auto text-center">
        {/* Headline */}
        <h2 className="font-hero font-bold text-white mb-6" style={{ fontSize: 'clamp(24px, 3.5vw, 36px)', lineHeight: '1.2' }}>
          Ready to start?
        </h2>
        
        {/* Subheadline */}
        <p className="text-white/80 font-body mb-10 max-w-3xl mx-auto" style={{ fontSize: 'clamp(15px, 1.4vw, 17px)', lineHeight: '1.6' }}>
          Open to collaborations, growth consulting, and new opportunities in Web3 and beyond.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button 
            size="hero"
            className="min-w-[200px] text-white transition-all duration-300"
            onClick={() => window.location.href = "#contact"}
            style={{
              background: 'linear-gradient(90deg, #FF8C1A 0%, #FFB347 100%)',
              borderRadius: '6px',
              fontWeight: 600
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 6px 12px rgba(255, 140, 26, 0.3)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = 'none';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            Work With Me
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          
          <Button 
            size="hero"
            variant="outline"
            className="min-w-[200px] bg-transparent border-white text-white hover:bg-white hover:text-bg-ink"
            onClick={() => window.open("https://linkedin.com", "_blank")}
          >
            Connect on LinkedIn
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
