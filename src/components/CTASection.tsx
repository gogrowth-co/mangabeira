import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const CTASection = () => {
  return (
    <section className="py-20 px-6 bg-gradient-to-br from-background via-background to-muted/20">
      <div className="max-w-4xl mx-auto text-center">
        {/* Headline */}
        <h2 className="font-hero text-4xl md:text-5xl font-bold text-foreground mb-6">
          Let's Build the Future Together
        </h2>
        
        {/* Subheadline */}
        <p className="text-muted-foreground text-lg md:text-xl mb-10 max-w-3xl mx-auto">
          I'm always open to collaborations, growth consulting, and new opportunities in Web3 and beyond.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button 
            size="hero"
            variant="hero"
            className="min-w-[200px]"
            onClick={() => window.location.href = "#contact"}
          >
            Work With Me
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          
          <Button 
            size="hero"
            variant="hero-outline"
            className="min-w-[200px]"
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
