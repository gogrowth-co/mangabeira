import { Quote } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import lambertAvatar from "@/assets/lambert-sechet-avatar.png";
import jonathanAvatar from "@/assets/jonathan-guimaraes-avatar.png";
import lucasAvatar from "@/assets/lucas-bhering-avatar.png";
import willAvatar from "@/assets/will-russell-avatar.png";
import russellLogo from "@/assets/russell-marketing-logo.png";
import { Locale, t } from "@/lib/translations";

interface TestimonialsContentProps {
  locale: Locale;
}

const TestimonialsContent = ({ locale }: TestimonialsContentProps) => {
  const testimonials = [
    {
      quote: t('testimonials', 'will_quote', locale),
      name: t('testimonials', 'will_name', locale),
      title: t('testimonials', 'will_title', locale),
      company: t('testimonials', 'will_company', locale),
      avatar: willAvatar,
      logo: russellLogo,
    },
    {
      quote: t('testimonials', 'lucas_quote', locale),
      name: t('testimonials', 'lucas_name', locale),
      title: t('testimonials', 'lucas_title', locale),
      company: "",
      avatar: lucasAvatar,
      logo: null,
    },
    {
      quote: t('testimonials', 'jonathan_quote', locale),
      name: t('testimonials', 'jonathan_name', locale),
      title: t('testimonials', 'jonathan_title', locale),
      company: "",
      avatar: jonathanAvatar,
      logo: null,
    },
    {
      quote: t('testimonials', 'lambert_quote', locale),
      name: t('testimonials', 'lambert_name', locale),
      title: t('testimonials', 'lambert_title', locale),
      company: t('testimonials', 'lambert_company', locale),
      avatar: lambertAvatar,
      logo: null,
    },
  ];

  return (
    <section className="relative w-full bg-background py-20 md:py-28 overflow-hidden">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Section Header */}
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="font-hero font-bold text-text-primary mb-3" style={{ fontSize: 'clamp(24px, 3.5vw, 36px)', lineHeight: '1.2' }}>
            {t('testimonials', 'section_title', locale)}
          </h2>
          <p className="text-text-secondary font-body max-w-3xl mx-auto" style={{ fontSize: 'clamp(15px, 1.4vw, 17px)', lineHeight: '1.6' }}>
            {t('testimonials', 'section_subtitle', locale)}
          </p>
        </div>

        {/* Testimonials Carousel */}
        <div className="mb-12 max-w-5xl mx-auto">
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent>
              {testimonials.map((testimonial, index) => (
                <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/2">
                  <Card className="p-8 h-full flex flex-col justify-between bg-card border border-border hover:border-accent-primary/30 transition-all duration-300" style={{ borderRadius: '18px', boxShadow: '0 6px 24px rgba(15, 23, 42, 0.08)' }}>
                    <div>
                      <Quote className="w-10 h-10 text-[#FF8C42] mb-4 opacity-50" />
                      <p className="text-base md:text-lg text-foreground font-body italic mb-6 leading-relaxed">
                        "{testimonial.quote}"
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-4 mt-6">
                      <img
                        src={testimonial.avatar}
                        alt={testimonial.name}
                        className="w-14 h-14 rounded-full object-cover grayscale"
                      />
                      <div className="flex-1">
                        <p className="font-semibold text-foreground font-body">
                          {testimonial.name}
                        </p>
                        <p className="text-sm text-muted-foreground font-body">
                          {testimonial.title}
                          {testimonial.company && ` @ ${testimonial.company}`}
                        </p>
                      </div>
                      {testimonial.logo && (
                        <img
                          src={testimonial.logo}
                          alt={testimonial.company}
                          className="w-12 h-12 object-contain grayscale opacity-50"
                        />
                      )}
                    </div>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="flex justify-center gap-2 mt-8">
              <CarouselPrevious className="static translate-y-0 border-[#FF8C42]/30 text-[#FF8C42] hover:bg-[#FF8C42] hover:text-white" />
              <CarouselNext className="static translate-y-0 border-[#FF8C42]/30 text-[#FF8C42] hover:bg-[#FF8C42] hover:text-white" />
            </div>
          </Carousel>
        </div>

        {/* CTA Button */}
        <div className="text-center">
          <Button 
            className="bg-gradient-to-r from-[#FF8C42] to-[#FFB020] text-white hover:shadow-[0_0_20px_rgba(255,176,32,0.5)] hover:scale-105 transition-all duration-300 px-8 py-6 text-lg"
          >
            {t('testimonials', 'cta_work_together', locale)}
          </Button>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsContent;
