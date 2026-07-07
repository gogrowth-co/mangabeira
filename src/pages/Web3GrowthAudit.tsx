import { Helmet } from "react-helmet-async";
import SEOHead from "@/components/SEOHead";
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
import FAQSection, { auditFaqs } from "@/components/audit/FAQSection";
import FinalCTA from "@/components/audit/FinalCTA";
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
      <SEOHead
        title="Web3 Growth Audit — Find Growth Leaks in 72 Hours"
        description="AI + Human Web3 Growth Audit — find your top growth leaks in 72 hours. On-chain, Reddit, Discord & funnel insights delivered via Notion + Loom."
        canonical="https://mangabeira.net/services/web3-growth-audit"
      />
      <Helmet>
        <link rel="alternate" hrefLang="en" href="https://mangabeira.net/services/web3-growth-audit" />
        <link rel="alternate" hrefLang="pt-BR" href="https://mangabeira.net/br/servicos/web3-auditoria-de-growth" />
        <link rel="alternate" hrefLang="es" href="https://mangabeira.net/es/servicios/web3-auditoria-de-growth" />
        <link rel="alternate" hrefLang="x-default" href="https://mangabeira.net/services/web3-growth-audit" />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "FAQPage",
              mainEntity: auditFaqs.map(({ q, a }) => ({
                "@type": "Question",
                name: q,
                acceptedAnswer: { "@type": "Answer", text: a },
              })),
            },
            {
              "@type": "Service",
              name: "Web3 Growth Audit",
              serviceType: "Growth Marketing Audit",
              url: "https://mangabeira.net/services/web3-growth-audit",
              description: "AI + human Web3 growth audit delivered in 72 hours, covering on-chain, social, community, and funnel insights.",
              provider: {
                "@type": "Person",
                name: "Gabriel Mangabeira",
                url: "https://mangabeira.net/about",
              },
              areaServed: "Worldwide",
              offers: [
                { "@type": "Offer", name: "Starter", price: "197", priceCurrency: "USD", url: "https://mangabeira.net/services/web3-growth-audit#pricing" },
                { "@type": "Offer", name: "Pro", price: "497", priceCurrency: "USD", url: "https://mangabeira.net/services/web3-growth-audit#pricing" },
                { "@type": "Offer", name: "Elite", price: "997", priceCurrency: "USD", url: "https://mangabeira.net/services/web3-growth-audit#pricing" },
              ],
            },
          ],
        })}</script>
      </Helmet>

      <Header locale="en" />
      
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
        className={`fixed bottom-0 left-0 right-0 bg-white border-t border-border p-4 md:hidden z-50 transition-transform duration-300 ${
          showStickyMobile ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        <button 
          className="w-full bg-gradient-cta hover:shadow-button-hover text-white font-hero font-bold py-3 rounded-lg transition-all duration-200"
          onClick={() => window.scrollTo({ top: document.getElementById('pricing')?.offsetTop || 0, behavior: 'smooth' })}
        >
          Diagnose My Growth Leaks →
        </button>
      </div>

      <Footer />
    </>
  );
};

export default Web3GrowthAudit;
