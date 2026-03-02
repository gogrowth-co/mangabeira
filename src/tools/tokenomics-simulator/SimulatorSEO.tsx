import { Helmet } from "react-helmet-async"

interface SimulatorSEOProps {
  lang: "en" | "pt-BR" | "es"
}

const seoData = {
  en: {
    title: "DeFi Tokenomics Simulator — Model Your Token Economy | Mangabeira.net",
    description: "Free interactive tool for Web3 founders. Simulate emission schedules, staking mechanics, and burn rates with real-time 5-year projections. No signup required.",
    canonical: "https://mangabeira.net/tools/tokenomics-simulator",
    locale: "en_US",
    inLanguage: "en",
  },
  "pt-BR": {
    title: "Simulador de Tokenomics DeFi — Modele Sua Economia de Tokens | Mangabeira.net",
    description: "Ferramenta gratuita para founders Web3. Simule cronogramas de emissão, mecânicas de staking e taxas de queima com projeções de 5 anos. Sem cadastro.",
    canonical: "https://mangabeira.net/br/ferramentas/simulador-tokenomics",
    locale: "pt_BR",
    inLanguage: "pt-BR",
  },
  es: {
    title: "Simulador de Tokenomics DeFi — Modela Tu Economía de Tokens | Mangabeira.net",
    description: "Herramienta gratuita para founders Web3. Simula cronogramas de emisión, mecánicas de staking y tasas de quema con proyecciones a 5 años. Sin registro.",
    canonical: "https://mangabeira.net/es/herramientas/simulador-tokenomics",
    locale: "es_ES",
    inLanguage: "es",
  },
}

export default function SimulatorSEO({ lang }: SimulatorSEOProps) {
  const d = seoData[lang]

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "DeFi Tokenomics Simulator",
    url: d.canonical,
    inLanguage: d.inLanguage,
    applicationCategory: "FinanceApplication",
    description: "Interactive tokenomics simulator for Web3 founders.",
    author: {
      "@type": "Person",
      name: "Gabriel Mangabeira",
      url: "https://mangabeira.net",
    },
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  }

  return (
    <Helmet>
      <title>{d.title}</title>
      <meta name="description" content={d.description} />
      <link rel="canonical" href={d.canonical} />
      <meta property="og:title" content={d.title} />
      <meta property="og:description" content={d.description} />
      <meta property="og:url" content={d.canonical} />
      <meta property="og:type" content="website" />
      <meta property="og:locale" content={d.locale} />
      <meta name="twitter:title" content={d.title} />
      <meta name="twitter:description" content={d.description} />
      <link rel="alternate" hrefLang="en" href="https://mangabeira.net/tools/tokenomics-simulator" />
      <link rel="alternate" hrefLang="pt-BR" href="https://mangabeira.net/br/ferramentas/simulador-tokenomics" />
      <link rel="alternate" hrefLang="es" href="https://mangabeira.net/es/herramientas/simulador-tokenomics" />
      <link rel="alternate" hrefLang="x-default" href="https://mangabeira.net/tools/tokenomics-simulator" />
      <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
    </Helmet>
  )
}
