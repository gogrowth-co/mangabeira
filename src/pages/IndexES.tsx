import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import SocialProofSection from "@/components/SocialProofSection";
import AsSeenOnSection from "@/components/AsSeenOnSection";
import MethodsSection from "@/components/MethodsSection";
import CaseStudiesSection from "@/components/CaseStudiesSection";
import CapabilitiesSection from "@/components/CapabilitiesSection";
import MyJourneySection from "@/components/MyJourneySection";
import ToolsSection from "@/components/ToolsSection";
import PublicationsSection from "@/components/PublicationsSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";
import ChatWithMyAI from "@/components/ChatWithMyAI";
import Header from "@/components/Header";
import SEO from "@/components/SEO";
import SEOHead from "@/components/SEOHead";
import { useLanguage } from "@/contexts/LanguageContext";

const IndexES = () => {
  const { isLoading } = useLanguage();
  const locale = 'es';
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  return (
    <>
      <SEOHead
        title="Gabriel Mangabeira | Olímpico y Estratega de Growth Marketing"
        description="Experto en growth marketing especializado en Web3, DeFi y tokenomics. Ex-líder de growth en Binance."
        canonical="https://mangabeira.net/es"
      />
      <SEO locale={locale} path="/es" />
      <Header locale={locale} />
      <main className="font-body">
        <HeroSection locale={locale} />
        <SocialProofSection locale={locale} />
        <AboutSection locale={locale} />
        <AsSeenOnSection locale={locale} />
        <CaseStudiesSection locale={locale} />
        <CapabilitiesSection locale={locale} />
        <MyJourneySection locale={locale} />
        <MethodsSection locale={locale} />
        <ToolsSection locale={locale} />
        <PublicationsSection locale={locale} />
        <TestimonialsSection locale={locale} />
        <CTASection locale={locale} />
      </main>
      <Footer />
      <ChatWithMyAI />
    </>
  );
};

export default IndexES;
