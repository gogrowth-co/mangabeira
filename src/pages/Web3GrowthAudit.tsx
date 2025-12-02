import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AuditHero from "@/components/audit/AuditHero";
import AuditSystemMap from "@/components/audit/AuditSystemMap";
import FounderRealityCheck from "@/components/audit/FounderRealityCheck";
import SampleFindings from "@/components/audit/SampleFindings";
import HowItWorks from "@/components/audit/HowItWorks";
import WhatsIncluded from "@/components/audit/WhatsIncluded";
import WhyTrustSection from "@/components/audit/WhyTrustSection";
import PricingSection from "@/components/audit/PricingSection";
import GuaranteeSection from "@/components/audit/GuaranteeSection";
import FounderReactions from "@/components/audit/FounderReactions";
import FAQSection from "@/components/audit/FAQSection";
import FinalCTA from "@/components/audit/FinalCTA";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

const Web3GrowthAudit = () => {
  const [showStickyMobile, setShowStickyMobile] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowStickyMobile(window.scrollY > 500);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <Helmet>
        <title>Web3 Growth Audit | Find Your Growth Leaks in 72 Hours | Mangabeira.net</title>
        <meta 
          name="description" 
          content="AI + Human Web3 Growth Audit — Find your top growth leaks in 72 hours. On-chain, Reddit, Discord, and funnel insights delivered via Notion + Loom. Data-backed. Actionable." 
        />
        <meta property="og:title" content="Web3 Growth Audit | Mangabeira.net" />
        <meta property="og:description" content="Find hidden growth leaks in 72 hours. Cross-channel analysis across Reddit, Discord, on-chain, and more." />
        <meta property="og:url" content="https://mangabeira.net/services/web3-growth-audit" />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://mangabeira.net/services/web3-growth-audit" />
      </Helmet>

      <Header />
      
      <main>
        <AuditHero />
        <AuditSystemMap />
        <FounderRealityCheck />
        <SampleFindings />
        <HowItWorks />
        <WhatsIncluded />
        <WhyTrustSection />
        <PricingSection />
        <GuaranteeSection />
        <FounderReactions />
        <FAQSection />
        <FinalCTA />
      </main>

      {/* Sticky Mobile CTA */}
      <div 
        className={`fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 md:hidden z-50 transition-transform duration-300 ${
          showStickyMobile ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        <Button 
          className="w-full bg-gold hover:bg-[#E6A600] text-navy font-heading font-bold py-3 rounded-lg"
          onClick={() => window.scrollTo({ top: document.getElementById('pricing')?.offsetTop || 0, behavior: 'smooth' })}
        >
          Diagnose My Growth Leaks →
        </Button>
      </div>

      <Footer />
    </>
  );
};

export default Web3GrowthAudit;
