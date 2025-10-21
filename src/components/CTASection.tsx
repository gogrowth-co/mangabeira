import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Locale, t } from "@/lib/translations";

interface CTASectionProps {
  locale: Locale;
}

const CTASection = ({ locale }: CTASectionProps) => {
  return (
    <section id="contact" className="py-20 md:py-28 px-6 bg-bg-ink">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="font-hero font-bold text-white mb-6" style={{ fontSize: 'clamp(24px, 3.5vw, 36px)', lineHeight: '1.2' }}>
          {t('cta', 'section_headline', locale)}
        </h2>

        <p className="text-white/80 font-body mb-10 max-w-3xl mx-auto" style={{ fontSize: 'clamp(15px, 1.4vw, 17px)', lineHeight: '1.6' }}>
          {t('cta', 'section_subheadline', locale)}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button
            size="hero"
            variant="hero"
            className="min-w-[200px]"
            onClick={() => window.open('https://calendly.com/gabriel-mangabeira/15min', '_blank')}
          >
            {t('cta', 'cta_primary', locale)}
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>

          <Button
            size="hero"
            className="min-w-[200px] bg-transparent border-2 border-white/80 text-white hover:bg-white hover:text-[#0a0f1a] hover:border-white rounded-lg transition-all duration-300 font-semibold"
            onClick={() => window.open("https://www.linkedin.com/in/mangabeira/", "_blank")}
          >
            {t('cta', 'cta_secondary', locale)}
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
