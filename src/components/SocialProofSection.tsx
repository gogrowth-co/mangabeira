import { useState, useEffect } from "react";
import { Medal, TrendingUp, DollarSign, Globe, ChevronLeft, ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import binanceLogo from "@/assets/binance-logo.png";
import cocaColaLogo from "@/assets/coca-cola-logo.png";
import npDigitalLogo from "@/assets/np-digital-logo.png";
import willRussellAvatar from "@/assets/will-russell-avatar.png";
import lambertSechetAvatar from "@/assets/lambert-sechet-avatar.png";
import lucasBheringAvatar from "@/assets/lucas-bhering-avatar.png";

const SocialProofSection = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [countUpValues, setCountUpValues] = useState([0, 0, 0, 0]);

  const logos = [
    { src: binanceLogo, alt: "Binance", name: "Binance" },
    { src: npDigitalLogo, alt: "Neil Patel Digital", name: "Neil Patel Brasil" },
    { src: cocaColaLogo, alt: "Coca-Cola", name: "Coca-Cola" },
    // Placeholder for Russell Marketing and Sponsorise.me
    { src: "", alt: "Russell Marketing", name: "Russell Marketing" },
    { src: "", alt: "Sponsorise.me", name: "Sponsorise.me" },
  ];

  const stats = [
    {
      Icon: Medal,
      number: 1,
      label: "Olympic Finalist",
      suffix: "",
    },
    {
      Icon: TrendingUp,
      number: 1000000,
      label: "Blog Readers",
      suffix: "M+",
    },
    {
      Icon: DollarSign,
      number: 6000000,
      label: "Raised in Crowdfunding",
      suffix: "M+",
    },
    {
      Icon: Globe,
      number: 3,
      label: "Languages (EN, ES, PT-BR)",
      suffix: "",
    },
  ];

  const testimonials = [
    {
      quote: "Gabriel's versatility and growth mindset have been instrumental in our long-term collaboration. His ability to adapt and deliver results across different projects is remarkable.",
      name: "Will Russell",
      role: "Founder",
      company: "Russell Marketing",
      avatar: willRussellAvatar,
    },
    {
      quote: "Working with Gabriel on our Olympic crowdfunding campaign was a game-changer. His strategic approach and understanding of both sports and business made all the difference.",
      name: "Lambert Sechet",
      role: "Olympic Athlete",
      company: "Crowdfunding Success",
      avatar: lambertSechetAvatar,
    },
    {
      quote: "Gabriel traz uma perspectiva única para empreendedores sociais. Sua experiência olímpica combinada com estratégia digital é poderosa.",
      name: "Lucas Bhering",
      role: "Social Entrepreneur",
      company: "Impact Ventures",
      avatar: lucasBheringAvatar,
    },
  ];

  // Count-up animation effect
  useEffect(() => {
    const duration = 2000; // 2 seconds
    const steps = 60;
    const stepDuration = duration / steps;

    const intervals = stats.map((stat, index) => {
      let step = 0;
      return setInterval(() => {
        step++;
        const progress = step / steps;
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        
        if (stat.number === 1) {
          setCountUpValues(prev => {
            const newValues = [...prev];
            newValues[index] = progress >= 1 ? 1 : 0;
            return newValues;
          });
        } else {
          setCountUpValues(prev => {
            const newValues = [...prev];
            newValues[index] = Math.floor(stat.number * easeOutQuart);
            return newValues;
          });
        }

        if (step >= steps) {
          clearInterval(intervals[index]);
          setCountUpValues(prev => {
            const newValues = [...prev];
            newValues[index] = stat.number;
            return newValues;
          });
        }
      }, stepDuration);
    });

    return () => intervals.forEach(clearInterval);
  }, []);

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 7000);

    return () => clearInterval(interval);
  }, []);

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const formatNumber = (value: number, index: number) => {
    const stat = stats[index];
    if (stat.number === 1) return value;
    if (stat.number >= 1000000) return (value / 1000000).toFixed(value >= 1000000 ? 0 : 1);
    if (stat.number >= 1000) return (value / 1000).toFixed(value >= 1000 ? 0 : 1);
    return value.toLocaleString();
  };

  return (
    <section className="relative w-full bg-white py-16 md:py-24 overflow-hidden">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Section Header */}
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-hero font-bold text-foreground mb-4">
            Proven Results & Global Recognition
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground font-body max-w-3xl mx-auto">
            From Olympic pools to global campaigns, trusted by leading brands and communities worldwide.
          </p>
        </div>

        {/* Logos Section */}
        <div className="mb-16">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 items-center justify-items-center">
            {logos.map((logo, index) => (
              <div
                key={index}
                className="w-full max-w-[150px] h-16 flex items-center justify-center opacity-60 hover:opacity-100 transition-opacity duration-300 animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {logo.src ? (
                  <img
                    src={logo.src}
                    alt={logo.alt}
                    className="max-w-full max-h-full object-contain filter grayscale hover:grayscale-0 transition-all duration-300"
                  />
                ) : (
                  <div className="w-full h-full bg-muted rounded-lg flex items-center justify-center text-muted-foreground text-sm font-medium">
                    {logo.name}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => (
            <Card
              key={index}
              className="group p-6 text-center bg-card border border-border hover:border-gold-olympic/30 hover:shadow-xl transition-all duration-500 animate-fade-in"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gold-olympic to-gold-orange flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <stat.Icon className="w-8 h-8 text-white" strokeWidth={2} />
                </div>
                <div className="text-3xl md:text-4xl font-hero font-bold text-foreground mb-2">
                  {formatNumber(countUpValues[index], index)}
                  <span className="text-gold-olympic">{stat.suffix}</span>
                </div>
                <p className="text-sm text-muted-foreground font-body">{stat.label}</p>
              </div>
            </Card>
          ))}
        </div>

        {/* Testimonials Carousel */}
        <div className="relative max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h3 className="text-2xl md:text-3xl font-hero font-bold text-foreground mb-4">
              What Partners Say
            </h3>
          </div>

          <div className="relative overflow-hidden rounded-2xl">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentTestimonial * 100}%)` }}
            >
              {testimonials.map((testimonial, index) => (
                <div key={index} className="w-full flex-shrink-0 px-4">
                  <Card className="p-8 bg-card border border-border text-center">
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 rounded-full overflow-hidden mb-6 shadow-lg">
                        <img
                          src={testimonial.avatar}
                          alt={testimonial.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <blockquote className="text-lg md:text-xl text-muted-foreground font-body italic leading-relaxed mb-6 max-w-2xl">
                        "{testimonial.quote}"
                      </blockquote>
                      <div className="text-center">
                        <div className="font-hero font-semibold text-foreground text-lg">
                          {testimonial.name}
                        </div>
                        <div className="text-muted-foreground font-body">
                          {testimonial.role} • {testimonial.company}
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex justify-center items-center gap-4 mt-8">
            <Button
              variant="outline"
              size="icon"
              onClick={prevTestimonial}
              className="rounded-full border-gold-olympic/30 hover:border-gold-olympic hover:bg-gold-olympic/10"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            
            <div className="flex gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentTestimonial
                      ? "bg-gold-olympic scale-125"
                      : "bg-muted hover:bg-gold-olympic/50"
                  }`}
                />
              ))}
            </div>
            
            <Button
              variant="outline"
              size="icon"
              onClick={nextTestimonial}
              className="rounded-full border-gold-olympic/30 hover:border-gold-olympic hover:bg-gold-olympic/10"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SocialProofSection;