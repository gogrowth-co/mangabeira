import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CTASection from "@/components/CTASection";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, TrendingUp, Globe, Code, Database, Shield, Users, Link as LinkIcon, Zap, BookOpen, Settings } from "lucide-react";
import heroCover from "@/assets/web3-seo-cover.png";
import authorAvatar from "@/assets/gabriel-profile.png";

const title = "The Definitive Guide to Web3 SEO";
const description = "Practical tactics to make decentralized projects discoverable and trusted across web + on-chain.";

function useSEO() {
  React.useEffect(() => {
    const url = `${window.location.origin}/publications/definitive-guide-web3-seo`;

    document.title = title;

    const ensure = (tagName: string, attrs: Record<string, string>) => {
      let el = document.querySelector<HTMLElement>(
        `${tagName}${attrs.name ? `[name="${attrs.name}"]` : attrs.property ? `[property="${attrs.property}"]` : ""}`,
      );
      if (!el) {
        el = document.createElement(tagName) as HTMLElement;
        Object.entries(attrs).forEach(([k, v]) => el!.setAttribute(k, v));
        document.head.appendChild(el);
      } else {
        Object.entries(attrs).forEach(([k, v]) => el!.setAttribute(k, v));
      }
      return el;
    };

    ensure("meta", { name: "description", content: description });
    ensure("link", { rel: "canonical", href: url });
    ensure("meta", { property: "og:type", content: "article" });
    ensure("meta", { property: "og:title", content: title });
    ensure("meta", { property: "og:description", content: description });
    ensure("meta", { property: "og:url", content: url });
    ensure("meta", { property: "og:image", content: heroCover });
    ensure("meta", { name: "twitter:card", content: "summary_large_image" });
    ensure("meta", { name: "twitter:title", content: title });
    ensure("meta", { name: "twitter:description", content: description });
    ensure("meta", { name: "twitter:image", content: heroCover });

    const articleLd = {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: title,
      image: [heroCover],
      author: { '@type': 'Person', name: 'Gabriel Mangabeira', jobTitle: 'Olympian & Growth Strategist' },
      datePublished: '2025-10-15',
      dateModified: '2025-10-15',
      mainEntityOfPage: url,
      description,
      wordCount: 3500,
      timeRequired: 'PT10M',
    } as const;

    const faqLd = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'What is Web3 SEO?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Web3 SEO expands traditional search optimization to include on-chain signals, wallet-native identity, and community trust indicators, improving discoverability across search engines and crypto-native platforms.',
          },
        },
        {
          '@type': 'Question',
          name: 'Do backlinks still matter in Web3?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes, but quality is redefined: credible publications, developer docs, protocol references, and community wikis outweigh vanity links. On-chain provenance and social proofs also play a role.',
          },
        },
        {
          '@type': 'Question',
          name: 'How do I measure Web3 SEO success?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Track organic traffic, query share on high-intent keywords, documentation engagement, wallet connects, on-chain actions from organic users, and community growth velocity.',
          },
        },
      ],
    } as const;

    const breadcrumbLd = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: `${window.location.origin}/` },
        { '@type': 'ListItem', position: 2, name: 'Publications', item: `${window.location.origin}/#publications` },
        { '@type': 'ListItem', position: 3, name: 'The Definitive Guide to Web3 SEO' },
      ],
    } as const;

    const script1 = document.createElement('script');
    script1.type = 'application/ld+json';
    script1.textContent = JSON.stringify(articleLd);
    document.head.appendChild(script1);

    const script2 = document.createElement('script');
    script2.type = 'application/ld+json';
    script2.textContent = JSON.stringify(faqLd);
    document.head.appendChild(script2);

    const script3 = document.createElement('script');
    script3.type = 'application/ld+json';
    script3.textContent = JSON.stringify(breadcrumbLd);
    document.head.appendChild(script3);

    return () => {
      script1.remove();
      script2.remove();
      script3.remove();
    };
  }, []);
}

export default function Web3SEO() {
  useSEO();

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 120;
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      window.scrollTo({ top: elementPosition - offset, behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      <main>
        <article className="mx-auto w-full max-w-3xl px-4 py-8 md:py-12">
          <header className="mb-8 md:mb-10">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
              {title}
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">{description}</p>

            <div className="mt-6 flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-3">
                <img
                  src={authorAvatar}
                  alt="Gabriel Mangabeira headshot"
                  className="h-12 w-12 rounded-full object-cover ring-2 ring-primary/20"
                  loading="lazy"
                />
                <div className="leading-tight">
                  <div className="font-medium">Gabriel Mangabeira</div>
                  <div className="text-sm text-muted-foreground">Olympian & Growth Strategist</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                  10 min read
                </span>
                <span className="inline-flex items-center rounded-full border border-border bg-muted/40 px-3 py-1 text-xs font-medium text-muted-foreground">
                  Updated Oct 2025
                </span>
              </div>
            </div>

            <figure className="mt-8 overflow-hidden rounded-lg border border-border">
              <img
                src={heroCover}
                alt="Web3 SEO cover showing decentralized search, wallets, and on-chain data"
                loading="lazy"
                className="h-auto w-full object-cover"
              />
            </figure>

            {/* TLDR Section */}
            <Card className="my-8 border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Zap className="h-5 w-5 text-primary" />
                  <h2 className="text-xl font-bold">TL;DR - Jump to What Matters</h2>
                </div>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  <Button variant="outline" className="justify-start h-auto py-3 px-4 hover:bg-primary/10 hover:border-primary transition-all" onClick={() => scrollToSection("why")}> 
                    <BookOpen className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span className="text-left">Why Web3 SEO Matters</span>
                  </Button>
                  <Button variant="outline" className="justify-start h-auto py-3 px-4 hover:bg-primary/10 hover:border-primary transition-all" onClick={() => scrollToSection("principles")}> 
                    <Shield className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span className="text-left">Core Principles</span>
                  </Button>
                  <Button variant="outline" className="justify-start h-auto py-3 px-4 hover:bg-primary/10 hover:border-primary transition-all" onClick={() => scrollToSection("tactics")}> 
                    <TrendingUp className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span className="text-left">Practical Tactics</span>
                  </Button>
                  <Button variant="outline" className="justify-start h-auto py-3 px-4 hover:bg-primary/10 hover:border-primary transition-all" onClick={() => scrollToSection("tools")}> 
                    <Settings className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span className="text-left">Tools & Resources</span>
                  </Button>
                  <Button variant="outline" className="justify-start h-auto py-3 px-4 hover:bg-primary/10 hover:border-primary transition-all" onClick={() => scrollToSection("faq")}> 
                    <Globe className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span className="text-left">FAQs</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </header>

          <section className="prose prose-neutral dark:prose-invert max-w-none">
            <p className="text-lg text-muted-foreground">
              Web3 SEO is about discoverability across two surfaces: traditional search engines and crypto-native ecosystems. That means optimizing for queries, documentation clarity, community trust, and verifiable on-chain signals.
            </p>

            <h2 id="why" className="mt-10 text-2xl font-bold scroll-mt-24">Why Web3 SEO Matters</h2>
            <div className="space-y-6 mt-6">
              <Card className="border-l-4 border-l-primary shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <h3 className="mt-0 text-lg font-bold flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-sm">1</span>
                    Trust, Not Just Traffic
                  </h3>
                  <p className="mt-4">In categories with high asymmetry of information and scams, users evaluate credibility first. Clean documentation, verifiable team credentials, audits, and on-chain transparency are ranking prerequisites.</p>
                </CardContent>
              </Card>
              <Card className="border-l-4 border-l-primary shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <h3 className="mt-0 text-lg font-bold flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-sm">2</span>
                    Multi-Surface Discovery
                  </h3>
                  <p className="mt-4">People discover projects via Google, Github, community forums, Dune dashboards, wallets, and explorers. Your content architecture must map to all discovery surfaces.</p>
                </CardContent>
              </Card>
              <Card className="border-l-4 border-l-primary shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <h3 className="mt-0 text-lg font-bold flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-sm">3</span>
                    From Keywords to Intents
                  </h3>
                  <p className="mt-4">High-intent Web3 queries include protocol comparisons, risks, audits, fees, wallet compatibility, and integration steps. Serve each intent with a dedicated page or section.</p>
                </CardContent>
              </Card>
            </div>

            <h2 id="principles" className="mt-10 text-2xl font-bold scroll-mt-24">Core Principles</h2>
            <div className="space-y-6 mt-6">
              <Card className="border-l-4 border-l-primary shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <h3 className="mt-0 text-lg font-bold flex items-center gap-2"><Shield className="h-4 w-4" /> Transparency by Design</h3>
                  <ul className="mt-4 space-y-2">
                    <li>• Link audits, multisig wallets, and token contracts from your docs and homepage.</li>
                    <li>• Publish changelogs and governance decisions with dates and hashes.</li>
                    <li>• Make team credentials verifiable: real names or on-chain reputations.</li>
                  </ul>
                </CardContent>
              </Card>
              <Card className="border-l-4 border-l-primary shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <h3 className="mt-0 text-lg font-bold flex items-center gap-2"><Users className="h-4 w-4" /> Community Signals Are Ranking Signals</h3>
                  <p className="mt-4">Healthy Discords, active forum threads, and public roadmaps correlate with user trust and engagement—these are indirect ranking factors that drive organic growth.</p>
                </CardContent>
              </Card>
              <Card className="border-l-4 border-l-primary shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <h3 className="mt-0 text-lg font-bold flex items-center gap-2"><Code className="h-4 w-4" /> Developer-First Architecture</h3>
                  <p className="mt-4">If you have an API or SDK, documentation SEO is your growth engine. Structure docs with search-friendly titles, code samples, and versioned URLs.</p>
                </CardContent>
              </Card>
            </div>

            <h2 id="tactics" className="mt-10 text-2xl font-bold scroll-mt-24">Practical Tactics</h2>
            <Tabs defaultValue="research" className="my-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="research">Keyword Research</TabsTrigger>
                <TabsTrigger value="content">Content</TabsTrigger>
                <TabsTrigger value="technical">Technical</TabsTrigger>
              </TabsList>
              <TabsContent value="research" className="mt-4">
                <ul className="space-y-2">
                  <li>🔎 Map query clusters: protocol comparisons, how-tos, fees, risks, audits, wallets.</li>
                  <li>🧭 Include crypto-native surfaces: Github issues, Reddit subs, Farcaster channels.</li>
                  <li>📊 Track share of search on 20–50 priority queries. Update monthly.</li>
                </ul>
              </TabsContent>
              <TabsContent value="content" className="mt-4">
                <ul className="space-y-2">
                  <li>🧱 Create pillar pages (overview) and child pages (deep dives) for each use case.</li>
                  <li>📚 Ship canonical docs: quickstart, concepts, tutorials, reference, changelog.</li>
                  <li>🧩 Add comparison pages: “Your protocol vs X” with honest tradeoffs.</li>
                </ul>
              </TabsContent>
              <TabsContent value="technical" className="mt-4">
                <ul className="space-y-2">
                  <li>⚙️ Clean URL structure, single H1, semantic HTML, and JSON-LD on key pages.</li>
                  <li>🚀 Performance: lazy-load heavy assets, compress images, avoid layout shift.</li>
                  <li>🔐 Security trust: surface audits, bug bounties, and multisig details.</li>
                </ul>
              </TabsContent>
            </Tabs>

            <div className="my-8 rounded-lg border-l-4 border-primary bg-muted/50 p-6">
              <h3 className="mt-0 text-base font-semibold">💡 Pro Tip</h3>
              <p className="mb-0">Turn every support question into an SEO page or docs section. If users ask it, others are searching it.</p>
            </div>

            <h2 id="tools" className="mt-10 text-2xl font-bold scroll-mt-24">Tools & Resources</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <Card className="shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <h3 className="mt-0 text-lg font-bold flex items-center gap-2"><Search className="h-4 w-4" /> Research</h3>
                  <ul className="mt-4 space-y-2">
                    <li>• Search Console, Ahrefs/Semrush, AlsoAsked</li>
                    <li>• Github search, Farcaster/Reddit explorers</li>
                    <li>• Dune dashboards for market insights</li>
                  </ul>
                </CardContent>
              </Card>
              <Card className="shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <h3 className="mt-0 text-lg font-bold flex items-center gap-2"><Database className="h-4 w-4" /> Data & Tracking</h3>
                  <ul className="mt-4 space-y-2">
                    <li>• Analytics: GA4, Plausible</li>
                    <li>• On-chain: dune.xyz, flipside, token explorers</li>
                    <li>• Attribution: UTMs + wallet events</li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            <h2 id="faq" className="mt-10 text-2xl font-bold scroll-mt-24">FAQ</h2>
            <div className="space-y-4 mt-6">
              <Card className="border border-border">
                <CardContent className="p-5">
                  <h3 className="mt-0 font-semibold">Is Web3 SEO just technical SEO for crypto?</h3>
                  <p className="mt-2 text-muted-foreground">No. It includes traditional SEO, but emphasizes credibility, documentation clarity, on-chain transparency, and community trust across multiple discovery surfaces.</p>
                </CardContent>
              </Card>
              <Card className="border border-border">
                <CardContent className="p-5">
                  <h3 className="mt-0 font-semibold">Do I need a docs site to win in Web3 SEO?</h3>
                  <p className="mt-2 text-muted-foreground">If you have an API, SDK, or protocol—yes. Docs often become your highest-intent acquisition channel. Invest in information architecture and examples.</p>
                </CardContent>
              </Card>
              <Card className="border border-border">
                <CardContent className="p-5">
                  <h3 className="mt-0 font-semibold">Should I publish my contract addresses?</h3>
                  <p className="mt-2 text-muted-foreground">Yes, with context. Link to explorers and audits. Make it easy for users to verify they’re interacting with the correct contracts.</p>
                </CardContent>
              </Card>
            </div>
          </section>
        </article>

        <CTASection />
      </main>

      <Footer />
    </div>
  );
}
