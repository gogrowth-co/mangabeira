import { useState, useEffect } from "react";
import { Medal, TrendingUp, DollarSign, Target } from "lucide-react";
import { Card } from "@/components/ui/card";
import binanceLogo from "@/assets/binance-logo.png";
import cocaColaLogo from "@/assets/coca-cola-logo.png";
import iocLogo from "@/assets/ioc-logo.png";

const SocialProofSection = () => {
  const [countUpValues, setCountUpValues] = useState([0, 0, 0, 0]);

  const logos = [
    { src: iocLogo, alt: "IOC", name: "IOC" },
    { src: cocaColaLogo, alt: "Coca-Cola", name: "Coca-Cola" },
    { src: binanceLogo, alt: "Binance", name: "Binance" },
  ];

  const stats = [
    {
      Icon: Medal,
      number: 2,
      label: "2x Olympian",
      subtitle: "Discipline, focus, and resilience.",
      suffix: "x",
    },
    {
      Icon: DollarSign,
      number: 6000000,
      label: "$6M+ Raised",
      subtitle: "Crowdfunding & DTC launches.",
      suffix: "M+",
    },
    {
      Icon: TrendingUp,
      number: 1000000,
      label: "1M+ SEO Readers",
      subtitle: "Scaled audiences across LATAM.",
      suffix: "M+",
    },
    {
      Icon: Target,
      number: 1000000,
      label: "$1M+ Ad Spend Managed",
      subtitle: "High-performing paid campaigns.",
      suffix: "M+",
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
        
        setCountUpValues(prev => {
          const newValues = [...prev];
          newValues[index] = Math.floor(stat.number * easeOutQuart);
          return newValues;
        });

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

  const formatNumber = (value: number, index: number) => {
    const stat = stats[index];
    if (stat.number === 2) return value; // For "2x Olympian"
    if (stat.number >= 1000000) return "$" + (value / 1000000).toFixed(value >= 1000000 ? 0 : 1);
    if (stat.number >= 1000) return (value / 1000).toFixed(value >= 1000 ? 0 : 1);
    return value.toLocaleString();
  };

  return (
    <section className="relative w-full bg-white py-16 md:py-24 overflow-hidden">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Section Header */}
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-hero font-bold text-foreground mb-3">
            Global Recognition. Olympic Results.
          </h2>
          <p className="text-base md:text-lg text-muted-foreground font-body max-w-3xl mx-auto">
            From Olympic discipline to digital impact — trusted by the IOC, Coca-Cola, and Binance.
          </p>
        </div>

        {/* Logos Section */}
        <div className="mb-16">
          <div className="flex flex-wrap items-center justify-center gap-12 md:gap-16">
            {logos.map((logo, index) => (
              <div
                key={index}
                className="w-32 md:w-40 h-20 flex items-center justify-center opacity-70 hover:opacity-100 transition-opacity duration-300 animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {logo.src ? (
                  <img
                    src={logo.src}
                    alt={logo.alt}
                    className="max-w-full max-h-full object-contain filter grayscale hover:grayscale-0 transition-all duration-300"
                  />
                ) : (
                  <div className="text-2xl md:text-3xl font-hero font-bold text-muted-foreground">
                    {logo.name}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card
              key={index}
              className="group p-6 md:p-8 text-center bg-white border border-border hover:border-gold-olympic/30 hover:shadow-xl transition-all duration-500 animate-fade-in"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <div className="flex flex-col items-center">
                <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-[#FF8C42] to-[#FFB020] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <stat.Icon className="w-7 h-7 md:w-8 md:h-8 text-white" strokeWidth={2} />
                </div>
                <div className="text-2xl md:text-3xl font-hero font-bold text-foreground mb-1">
                  {stat.label.includes("$") ? (
                    <>
                      {formatNumber(countUpValues[index], index)}
                      <span className="text-[#FF8C42]">{stat.suffix}</span>
                    </>
                  ) : stat.label.includes("2x") ? (
                    <>
                      {formatNumber(countUpValues[index], index)}
                      <span className="text-[#FF8C42]">{stat.suffix}</span>
                    </>
                  ) : (
                    <>
                      {formatNumber(countUpValues[index], index)}
                      <span className="text-[#FF8C42]">{stat.suffix}</span>
                    </>
                  )}
                </div>
                <p className="text-sm md:text-base font-body font-semibold text-foreground mb-2">{stat.label}</p>
                <p className="text-xs md:text-sm text-muted-foreground font-body">{stat.subtitle}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SocialProofSection;