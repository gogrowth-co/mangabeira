import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const PrivacyPolicy = () => {
  return (
    <>
      <Helmet>
        <title>Privacy Policy | Gabriel Mangabeira</title>
        <meta name="description" content="Read the Privacy Policy for mangabeira.net — learn how we collect, use, and protect your information." />
        <link rel="canonical" href="https://mangabeira.net/privacy-policy" />
        <link rel="alternate" hrefLang="en" href="https://mangabeira.net/privacy-policy" />
        <link rel="alternate" hrefLang="pt-BR" href="https://mangabeira.net/br/politica-de-privacidade" />
        <link rel="alternate" hrefLang="es" href="https://mangabeira.net/es/politica-de-privacidade" />
        <link rel="alternate" hrefLang="x-default" href="https://mangabeira.net/privacy-policy" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Privacy Policy | Gabriel Mangabeira" />
        <meta property="og:description" content="Read the Privacy Policy for mangabeira.net — learn how we collect, use, and protect your information." />
        <meta property="og:url" content="https://mangabeira.net/privacy-policy" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Privacy Policy | Gabriel Mangabeira" />
        <meta name="twitter:description" content="Read the Privacy Policy for mangabeira.net — learn how we collect, use, and protect your information." />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "WebPage",
              url: "https://mangabeira.net/privacy-policy",
              name: "Privacy Policy | Gabriel Mangabeira",
              description: "Read the Privacy Policy for mangabeira.net — learn how we collect, use, and protect your information.",
              inLanguage: "en",
              breadcrumb: {
                "@type": "BreadcrumbList",
                itemListElement: [
                  { "@type": "ListItem", position: 1, name: "Home", item: "https://mangabeira.net/" },
                  { "@type": "ListItem", position: 2, name: "Privacy Policy" },
                ],
              },
            },
          ],
        })}</script>
      </Helmet>
      <Header locale="en" />
      <main className="font-body bg-background">
        <article className="max-w-3xl mx-auto px-6 py-16 md:py-24">
          {/* Header */}
          <header className="mb-12">
            <h1 className="font-hero font-bold text-4xl md:text-5xl text-foreground mb-4">
              Privacy Policy
            </h1>
            <p className="text-muted-foreground italic">
              Last updated: October 2025
            </p>
          </header>

          {/* Introduction */}
          <section className="prose prose-lg max-w-none mb-12">
            <p className="text-lg text-muted-foreground leading-relaxed">
              Welcome to <strong>mangabeira.net</strong>, operated by <strong>Gabriel Mangabeira</strong>.
              <br />
              This Privacy Policy explains how we collect, use, and protect your personal information when you visit this website or interact with our content and services.
            </p>
          </section>

          {/* Section 1 */}
          <section className="mb-10">
            <h2 className="font-hero font-bold text-2xl md:text-3xl text-foreground mb-4">
              1. Information We Collect
            </h2>
            <p className="text-muted-foreground mb-4 leading-relaxed">
              We collect information to improve user experience and analyze how visitors use this site.
            </p>
            
            <h3 className="font-semibold text-xl text-foreground mb-3 mt-6">a. Information You Provide</h3>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-4">
              <li>When you contact us through forms or schedule a call via Calendly.</li>
              <li>When you subscribe to a newsletter or download resources.</li>
              <li>This may include your name, email, company, and any message you choose to share.</li>
            </ul>

            <h3 className="font-semibold text-xl text-foreground mb-3 mt-6">b. Automatically Collected Data</h3>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Analytics data such as pages visited, time on site, and device type.</li>
              <li>Browser information and approximate location (city-level) to understand traffic sources.</li>
              <li>This information is anonymized and collected via <strong>Google Analytics 4</strong> and <strong>Google Tag Manager</strong>.</li>
            </ul>
          </section>

          {/* Section 2 */}
          <section className="mb-10">
            <h2 className="font-hero font-bold text-2xl md:text-3xl text-foreground mb-4">
              2. How We Use Your Information
            </h2>
            <p className="text-muted-foreground mb-4 leading-relaxed">We use collected data to:</p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-4">
              <li>Respond to your inquiries or requests.</li>
              <li>Improve site content and performance.</li>
              <li>Analyze engagement and traffic trends.</li>
              <li>Deliver occasional updates or insights, only if you've opted in.</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed">
              We do <strong>not</strong> sell, rent, or share personal data with third parties for marketing purposes.
            </p>
          </section>

          {/* Section 3 */}
          <section className="mb-10">
            <h2 className="font-hero font-bold text-2xl md:text-3xl text-foreground mb-4">
              3. Cookies & Tracking Technologies
            </h2>
            <p className="text-muted-foreground mb-4 leading-relaxed">This site uses cookies and similar tracking tools to:</p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-4">
              <li>Maintain site functionality.</li>
              <li>Measure performance through analytics tools (Google Analytics, Tag Manager).</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed">
              You can disable cookies in your browser settings at any time.
              <br />
              Disabling cookies may affect certain website features.
            </p>
          </section>

          {/* Section 4 */}
          <section className="mb-10">
            <h2 className="font-hero font-bold text-2xl md:text-3xl text-foreground mb-4">
              4. Embedded Content & Third-Party Services
            </h2>
            <p className="text-muted-foreground mb-4 leading-relaxed">
              Some pages may include embedded content (e.g., Calendly scheduling, Medium articles, YouTube videos).
              <br />
              Embedded content behaves exactly as if the visitor has visited the other website directly.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              These third-party services may collect data about you, use cookies, and monitor interaction according to their own privacy policies.
            </p>
          </section>

          {/* Section 5 */}
          <section className="mb-10">
            <h2 className="font-hero font-bold text-2xl md:text-3xl text-foreground mb-4">
              5. Data Security
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              We implement technical and organizational measures to protect your data from unauthorized access or misuse.
              <br />
              However, no online system is entirely immune to risk. We encourage responsible data sharing and awareness.
            </p>
          </section>

          {/* Section 6 */}
          <section className="mb-10">
            <h2 className="font-hero font-bold text-2xl md:text-3xl text-foreground mb-4">
              6. Data Retention
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              We keep contact form submissions and communications for as long as necessary to respond and maintain a record of professional exchanges.
              <br />
              Analytics data may be stored by Google for up to 26 months, per their standard retention settings.
            </p>
          </section>

          {/* Section 7 */}
          <section className="mb-10">
            <h2 className="font-hero font-bold text-2xl md:text-3xl text-foreground mb-4">
              7. Your Rights
            </h2>
            <p className="text-muted-foreground mb-4 leading-relaxed">
              Depending on your location, you may have rights under data protection laws (e.g., GDPR or LGPD), including:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-4">
              <li>Access to your personal data.</li>
              <li>Request correction or deletion.</li>
              <li>Withdraw consent at any time.</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed">
              To make a request, email <a href="mailto:contact@mangabeira.net" className="text-primary hover:underline">contact@mangabeira.net</a>.
            </p>
          </section>

          {/* Section 8 */}
          <section className="mb-10">
            <h2 className="font-hero font-bold text-2xl md:text-3xl text-foreground mb-4">
              8. International Transfers
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              This website is hosted and managed in Brazil.
              <br />
              Data may be processed in other jurisdictions (e.g., Google's global infrastructure) under equivalent privacy standards.
            </p>
          </section>

          {/* Section 9 */}
          <section className="mb-10">
            <h2 className="font-hero font-bold text-2xl md:text-3xl text-foreground mb-4">
              9. Updates to This Policy
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              We may update this Privacy Policy periodically.
              <br />
              The "Last updated" date reflects the most recent revision.
              <br />
              Major updates will be communicated through the site or via email if you are a subscriber.
            </p>
          </section>

          {/* Section 10 */}
          <section className="mb-10">
            <h2 className="font-hero font-bold text-2xl md:text-3xl text-foreground mb-4">
              10. Contact
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              For privacy-related questions, please contact:
            </p>
            <div className="mt-4 text-muted-foreground">
              <p><strong>Gabriel Mangabeira</strong></p>
              <p>Email: <a href="mailto:contact@mangabeira.net" className="text-primary hover:underline">contact@mangabeira.net</a></p>
              <p>Website: <a href="https://mangabeira.net" className="text-primary hover:underline">https://mangabeira.net</a></p>
            </div>
          </section>

          {/* Copyright */}
          <footer className="mt-16 pt-8 border-t border-border text-center text-sm text-muted-foreground">
            © 2025 Gabriel Mangabeira. All rights reserved.
          </footer>
        </article>
      </main>
      <Footer />
    </>
  );
};

export default PrivacyPolicy;
