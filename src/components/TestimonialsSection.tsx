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

const TestimonialsSection = () => {
  const testimonials = [
    {
      quote: "Gabriel has been phenomenal over the last 5 years. From PPC to blogging, sales to project management, he excelled in every role. His hunger to learn and grow made him an invaluable teammate — and would make him an asset to any company.",
      name: "Will Russell",
      title: "Founder & CEO",
      company: "Russell Marketing",
      avatar: willAvatar,
      logo: russellLogo,
    },
    {
      quote: "Gabriel is a high-performance professional with a powerful mission: helping social entrepreneurs. His discipline and results-driven mindset make him highly recommended.",
      name: "Lucas Bhering",
      title: "Growth Hacker",
      company: "",
      avatar: lucasAvatar,
      logo: null,
    },
    {
      quote: "A great professional with excellent ideas and strategies. From approach to activation, Gabriel delivers impact.",
      name: "Jonathan Guimarães",
      title: "Marketing Leader",
      company: "",
      avatar: jonathanAvatar,
      logo: null,
    },
    {
      quote: "I worked with Gabriel during Sponsorise.Me's Rio Olympics crowdfunding program. His Olympian mindset and adaptability were crucial for our success across seven countries. A talented, open-minded marketer always seeking growth.",
      name: "Lambert Sechet",
      title: "International Program Manager",
      company: "Sponsorise.Me",
      avatar: lambertAvatar,
      logo: null,
    },
  ];

  return (
    <section className="relative w-full bg-white py-16 md:py-24 overflow-hidden">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Section Header */}
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-hero font-bold text-foreground mb-3">
            What Partners Say
          </h2>
          <p className="text-base md:text-lg text-muted-foreground font-body max-w-3xl mx-auto">
            Trusted by global leaders, entrepreneurs, and innovators.
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
                  <Card className="p-8 h-full flex flex-col justify-between bg-white border border-border hover:border-[#FF8C42]/30 hover:shadow-xl transition-all duration-300">
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
            Want to work together? Let's talk.
          </Button>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
