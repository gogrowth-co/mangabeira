import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import SocialProofSection from "@/components/SocialProofSection";
import AsSeenOnSection from "@/components/AsSeenOnSection";
import ServicesSection from "@/components/ServicesSection";
import MethodsSection from "@/components/MethodsSection";
import CaseStudiesSection from "@/components/CaseStudiesSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import CapabilitiesSection from "@/components/CapabilitiesSection";
import ToolsSection from "@/components/ToolsSection";

const Index = () => {
  return (
    <main className="font-body">
      <HeroSection />
      <SocialProofSection />
      <AsSeenOnSection />
      <AboutSection />
      <CaseStudiesSection />
      <TestimonialsSection />
      <CapabilitiesSection />
      <ServicesSection />
      <MethodsSection />
      <ToolsSection />
    </main>
  );
};

export default Index;
