import { Button } from "@/components/ui/button";

const FinalCTA = () => {
  return (
    <section className="py-20 lg:py-28 bg-gradient-to-br from-navy to-[#0D3251]">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-heading font-bold text-3xl md:text-4xl text-white mb-6">
            Ready to stop guessing and start scaling?
          </h2>
          
          <p className="font-body-audit text-lg text-white/80 mb-10">
            Get a real diagnosis of your Web3 growth engine — backed by data and operator experience.
          </p>
          
          <Button 
            className="bg-gold hover:bg-[#E6A600] text-navy font-heading font-bold text-xl px-12 py-5 rounded-lg shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-200"
            onClick={() => window.open('https://calendly.com/gabriel-mangabeira/15min', '_blank')}
          >
            Start My Audit →
          </Button>
          
          {/* Trust Line */}
          <div className="flex flex-wrap justify-center gap-6 mt-10 text-white/60 text-sm font-body-audit">
            <span>Delivered in 72 hours</span>
            <span>•</span>
            <span>Clear insights</span>
            <span>•</span>
            <span>Zero-risk guarantee</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FinalCTA;
