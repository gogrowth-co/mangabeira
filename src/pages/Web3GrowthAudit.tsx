import { Helmet } from "react-helmet-async";
import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AuditHero from "@/components/audit/AuditHero";
import ProofSection from "@/components/audit/ProofSection";
import ProcessSection from "@/components/audit/ProcessSection";
import FeaturesGrid from "@/components/audit/FeaturesGrid";
import PricingSection from "@/components/audit/PricingSection";
import FAQSection from "@/components/audit/FAQSection";
import FinalCTA from "@/components/audit/FinalCTA";
import { loadAuditTranslations, ta } from "@/lib/auditTranslations";

type Locale = 'en' | 'br' | 'es';

interface Web3GrowthAuditProps {
  locale?: Locale;
}

const Web3GrowthAudit = ({ locale = 'en' }: Web3GrowthAuditProps) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadAuditTranslations(locale).then(() => setIsLoading(false));
  }, [locale]);

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  const getCanonicalUrl = () => {
    if (locale === 'br') return 'https://mangabeira.net/br/servicos/web3-auditoria-de-growth';
    if (locale === 'es') return 'https://mangabeira.net/es/servicios/web3-auditoria-de-growth';
    return 'https://mangabeira.net/services/web3-growth-audit';
  };

  return (
    <>
      <Helmet>
        <title>{ta('audit.meta.title', locale)}</title>
        <meta 
          name="description" 
          content={ta('audit.meta.description', locale)} 
        />
        <link rel="canonical" href={getCanonicalUrl()} />
        
        {/* Open Graph */}
        <meta property="og:title" content={ta('audit.meta.title', locale)} />
        <meta property="og:description" content={ta('audit.meta.description', locale)} />
        <meta property="og:url" content={getCanonicalUrl()} />
        <meta property="og:type" content="website" />
      </Helmet>

      <Header locale={locale} />
      
      <main>
        <AuditHero locale={locale} />
        <ProofSection locale={locale} />
        <ProcessSection locale={locale} />
        <FeaturesGrid locale={locale} />
        <PricingSection locale={locale} />
        <FAQSection locale={locale} />
        <FinalCTA locale={locale} />
      </main>

      <Footer />
    </>
  );
};

export default Web3GrowthAudit;
