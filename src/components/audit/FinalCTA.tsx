import { Button } from "@/components/ui/button";

const FinalCTA = () => {
  return (
    <section className="bg-navy py-24 px-6 text-center">
      <div className="max-w-4xl mx-auto">
        {/* Headline */}
        <h2 
          className="font-hero text-3xl md:text-4xl font-bold text-white mb-4"
        >
          Ready to Stop Guessing and Start Scaling?
        </h2>

        {/* Subtext */}
        <p 
          className="font-body text-white/80 text-lg max-w-2xl mx-auto leading-relaxed"
        >
          Get a real diagnosis of your Web3 growth engine — backed by data, distilled by a strategist.
        </p>

        {/* CTA button */}
        <Button
          size="lg"
          className="bg-gold text-navy font-bold px-10 py-5 rounded-lg text-lg hover:scale-105 shadow-button hover:shadow-button-hover transition-all duration-300 mt-8"
          onClick={() => window.open('https://calendly.com/gabriel-mangabeira/15min', '_blank')}
        >
          Start My Audit →
        </Button>

        {/* Trust elements */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mt-8 text-white/60 text-sm">
          <span>✓ Delivered in 72 hours</span>
          <span className="hidden sm:inline">•</span>
          <span>✓ 3+ actionable insights guaranteed</span>
          <span className="hidden sm:inline">•</span>
          <span>✓ Secure payment via Stripe or Crypto</span>
        </div>
      </div>
    </section>
  );
};

export default FinalCTA;
