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

const Index = () => {
  return (
    <>
      <Header />
      <main className="font-body">
        <HeroSection />
        <SocialProofSection />
        <AboutSection />
        <AsSeenOnSection />
        <CaseStudiesSection />
        <CapabilitiesSection />
        <MyJourneySection />
        <MethodsSection />
        <ToolsSection />
        <PublicationsSection />
        <TestimonialsSection />
        <CTASection />
      </main>
      <Footer />
      <ChatWithMyAI />
    </>
  );
};

export default Index;
