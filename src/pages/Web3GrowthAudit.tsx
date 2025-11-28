import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AuditHero from "@/components/audit/AuditHero";
import ProofSection from "@/components/audit/ProofSection";
import ProcessSection from "@/components/audit/ProcessSection";
import FeaturesGrid from "@/components/audit/FeaturesGrid";
import PricingSection from "@/components/audit/PricingSection";
import FAQSection from "@/components/audit/FAQSection";
import FinalCTA from "@/components/audit/FinalCTA";
import { useLanguage } from "@/contexts/LanguageContext";

const Web3GrowthAudit = () => {
  const { locale } = useLanguage();

  return (
    <>
      <Helmet>
        <title>Web3 Growth Audit | Find Your Growth Leaks in 72 Hours | Mangabeira.net</title>
        <meta 
          name="description" 
          content="AI + Human Web3 Growth Audit — Find your top growth leaks in 72 hours. On-chain, Reddit, and funnel insights delivered via Notion + Loom." 
        />
        <link rel="canonical" href="https://mangabeira.net/web3-growth-audit" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Web3 Growth Audit | Find Your Growth Leaks in 72 Hours" />
        <meta property="og:description" content="AI + Human Web3 Growth Audit — Find your top growth leaks in 72 hours. On-chain, Reddit, and funnel insights delivered via Notion + Loom." />
        <meta property="og:url" content="https://mangabeira.net/web3-growth-audit" />
        <meta property="og:type" content="website" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Web3 Growth Audit | Find Your Growth Leaks in 72 Hours" />
        <meta name="twitter:description" content="AI + Human Web3 Growth Audit — Find your top growth leaks in 72 hours. On-chain, Reddit, and funnel insights delivered via Notion + Loom." />
      </Helmet>

      <Header locale={locale} />
      
      <main>
        <AuditHero />
        <ProofSection />
        <ProcessSection />
        <FeaturesGrid />
        <PricingSection />
        <FAQSection />
        <FinalCTA />
      </main>

      <Footer />
    </>
  );
};

export default Web3GrowthAudit;
