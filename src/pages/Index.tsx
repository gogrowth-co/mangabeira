import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import SocialProofSection from "@/components/SocialProofSection";
import ServicesSection from "@/components/ServicesSection";
import MethodsSection from "@/components/MethodsSection";
import CaseStudiesSection from "@/components/CaseStudiesSection";
import ToolsSection from "@/components/ToolsSection";

const Index = () => {
  return (
    <main className="font-body">
      <HeroSection />
      <AboutSection />
      <SocialProofSection />
      <ServicesSection />
      <MethodsSection />
      <CaseStudiesSection />
      <ToolsSection />
    </main>
  );
};

export default Index;
