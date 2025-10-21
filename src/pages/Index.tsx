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

const Index = () => {
  const locale = 'en';
  
  return (
    <>
      <SEO locale={locale} path="/" />
      <Header locale={locale} />
      <main className="font-body">
        <HeroSection locale={locale} />
        <SocialProofSection locale={locale} />
        <AboutSection locale={locale} />
        <AsSeenOnSection locale={locale} />
        <CaseStudiesSection />
        <CapabilitiesSection />
        <MyJourneySection />
        <MethodsSection />
        <ToolsSection />
        <PublicationsSection />
        <TestimonialsSection />
        <CTASection locale={locale} />
      </main>
      <Footer />
      <ChatWithMyAI />
    </>
  );
};

export default Index;
