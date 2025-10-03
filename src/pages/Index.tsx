import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import SocialProofSection from "@/components/SocialProofSection";
import AsSeenOnSection from "@/components/AsSeenOnSection";
import MethodsSection from "@/components/MethodsSection";
import CaseStudiesSection from "@/components/CaseStudiesSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import CapabilitiesSection from "@/components/CapabilitiesSection";
import MyJourneySection from "@/components/MyJourneySection";
import ToolsSection from "@/components/ToolsSection";
import PublicationsSection from "@/components/PublicationsSection";

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
      <MyJourneySection />
      <MethodsSection />
      <ToolsSection />
      <PublicationsSection />
    </main>
  );
};

export default Index;
