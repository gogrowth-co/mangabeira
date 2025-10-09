import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CTASection from "@/components/CTASection";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Search, TrendingUp, Globe, Code, Database, Shield, Users,
  Link as LinkIcon, Zap, BookOpen, Settings, AlertTriangle,
  CheckCircle2, ArrowRight, ExternalLink, Sparkles, Target,
  Lock, Wallet, FileCode, BarChart3, Rocket, Clock, DollarSign
} from "lucide-react";
import heroCover from "@/assets/web3-seo-cover.png";
import authorAvatar from "@/assets/gabriel-profile.png";

const title = "Web3 SEO in 2025 and Beyond: Your Strategic Guide to Decentralized Discovery";
const description =
  "Comprehensive guide to Web3 SEO covering decentralized search engines, on-chain ranking factors, GEO optimization, and strategic frameworks for blockchain projects.";

function useSEO() {
  React.useEffect(() => {
    const origin = window.location.origin;
    const url = `${origin}/publications/definitive-guide-web3-seo`;
    const absoluteImage = heroCover.startsWith("http") ? heroCover : `${origin}${heroCover}`;

    document.title = title;

    const ensureMetaByName = (name: string, content: string) => {
      let el = document.querySelector<HTMLMetaElement>(`meta[name="${name}"]`);
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute("name", name);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
      return el;
    };

    const ensureMetaByProperty = (property: string, content: string) => {
      let el = document.querySelector<HTMLMetaElement>(`meta[property="${property}"]`);
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute("property", property);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
      return el;
    };

    const ensureLinkRel = (rel: string, href: string) => {
      let el = document.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
      if (!el) {
        el = document.createElement("link");
        el.setAttribute("rel", rel);
        document.head.appendChild(el);
      }
      el.setAttribute("href", href);
      return el;
    };

    // Basic SEO
    ensureMetaByName("description", description);
    ensureLinkRel("canonical", url);

    // Open Graph
    ensureMetaByProperty("og:type", "article");
    ensureMetaByProperty("og:title", title);
    ensureMetaByProperty("og:description", description);
    ensureMetaByProperty("og:url", url);
    ensureMetaByProperty("og:image", absoluteImage);

    // Twitter Cards
    ensureMetaByName("twitter:card", "summary_large_image");
    ensureMetaByName("twitter:title", title);
    ensureMetaByName("twitter:description", description);
    ensureMetaByName("twitter:image", absoluteImage);

    // Structured Data (JSON-LD)
    const articleLd = {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: title,
      image: [absoluteImage],
      author: { "@type": "Person", name: "Gabriel Mangabeira", jobTitle: "Olympian & Growth Strategist" },
      datePublished: "2025-10-09",
      dateModified: "2025-10-09",
      mainEntityOfPage: url,
      description,
      wordCount: 4200,
      timeRequired: "PT10M",
    } as const;

    const faqLd = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "What is Web3 SEO?",
          acceptedAnswer: {
            "@type": "Answer",
            text:
              "Web3 SEO expands traditional optimization to include on-chain signals, wallet-native identity, and community trust, improving discoverability across search engines and crypto-native platforms.",
          },
        },
        {
          "@type": "Question",
          name: "Do backlinks still matter in Web3?",
          acceptedAnswer: {
            "@type": "Answer",
            text:
              "Yes, but quality is redefined: credible publications, developer docs, protocol references, and community wikis outweigh vanity links. On-chain provenance and social proofs also matter.",
          },
        },
        {
          "@type": "Question",
          name: "How do I measure Web3 SEO success?",
          acceptedAnswer: {
            "@type": "Answer",
            text:
              "Track organic traffic, query share on high-intent keywords, documentation engagement, wallet connects, on-chain actions from organic users, and community growth velocity.",
          },
        },
        {
          "@type": "Question",
          name: "What is GEO (Generative Engine Optimization)?",
          acceptedAnswer: {
            "@type": "Answer",
            text:
              "GEO focuses on being cited inside AI answers by using structured data, authoritative sources, and fast, crawlable content for AI systems like GPT, Perplexity, and Claude-Web.",
          },
        },
        {
          "@type": "Question",
          name: "How do on-chain signals impact rankings?",
          acceptedAnswer: {
            "@type": "Answer",
            text:
              "Decentralized platforms consider verifiable on-chain actions like audits, staking, governance, and wallet reputation as trust signals that can influence discovery and ranking.",
          },
        },
      ],
    } as const;

    const breadcrumbLd = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: `${origin}/` },
        { "@type": "ListItem", position: 2, name: "Publications", item: `${origin}/#publications` },
        { "@type": "ListItem", position: 3, name: "Web3 SEO in 2025 and Beyond: Your Strategic Guide to Decentralized Discovery" },
      ],
    } as const;

    const howToLd = {
      "@context": "https://schema.org",
      "@type": "HowTo",
      name: "Web3 SEO Action Plan",
      description: "A 4-stage plan to implement Web3 SEO from pre-launch to enterprise.",
      step: [
        { "@type": "HowToStep", name: "Pre-Launch", text: "Set up documentation, ENS, basic tracking, and initial community." },
        { "@type": "HowToStep", name: "Post-Launch", text: "Ship pillar pages, integrate analytics, and start GEO optimization." },
        { "@type": "HowToStep", name: "Scaling", text: "Expand content clusters, build digital PR, and optimize on-chain signals." },
        { "@type": "HowToStep", name: "Enterprise", text: "Full hybrid strategy with attribution, governance content, and audits." },
      ],
    } as const;

    const scriptNodes: HTMLScriptElement[] = [];
    const addJsonLd = (data: any) => {
      const s = document.createElement("script");
      s.type = "application/ld+json";
      s.textContent = JSON.stringify(data);
      document.head.appendChild(s);
      scriptNodes.push(s);
    };

    addJsonLd(articleLd);
    addJsonLd(faqLd);
    addJsonLd(breadcrumbLd);
    addJsonLd(howToLd);

    return () => {
      scriptNodes.forEach((s) => s.remove());
    };
  }, []);
}

export default function Web3SEO() {
  useSEO();

  const [actionStage, setActionStage] = React.useState<string>(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get("stage") || sessionStorage.getItem("web3seo:stage") || "pre";
  });

  React.useEffect(() => {
    sessionStorage.setItem("web3seo:stage", actionStage);
  }, [actionStage]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 120;
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      window.scrollTo({ top: elementPosition - offset, behavior: "smooth" });
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // no-op
    }
  };

  const robotsTxt = `# robots.txt\nUser-agent: GPTBot\nAllow: /\n\nUser-agent: PerplexityBot\nAllow: /\n\nUser-agent: Claude-Web\nAllow: /`;

  const badSol = `// Bad\ncontract C { }`;
  const goodSol = `// Good\ncontract StablecoinLendingProtocol {\n  string public description = \"Decentralized lending for stablecoins with dynamic interest rates\";\n}`;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      <main>
        <article className="mx-auto w-full max-w-5xl px-4 py-8 md:py-12">
          <header className="mb-8 md:mb-12">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">{title}</h1>
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

            {/* TL;DR */}
            <Card className="my-8 border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10 shadow-lg">
              <CardContent className="p-6">
                <div className="mb-4 flex items-center gap-2">
                  <Zap className="h-5 w-5 text-primary" />
                  <h2 className="text-xl font-bold">TL;DR - Jump to What Matters</h2>
                </div>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  <Button variant="outline" className="h-auto justify-start px-4 py-3 transition-all hover:border-primary hover:bg-primary/10" onClick={() => scrollToSection("paradigm")}>
                    <BookOpen className="mr-2 h-4 w-4 flex-shrink-0" />
                    <span className="text-left">Paradigm Shift</span>
                  </Button>
                  <Button variant="outline" className="h-auto justify-start px-4 py-3 transition-all hover:border-primary hover:bg-primary/10" onClick={() => scrollToSection("ecosystem")}>
                    <Globe className="mr-2 h-4 w-4 flex-shrink-0" />
                    <span className="text-left">Ecosystem</span>
                  </Button>
                  <Button variant="outline" className="h-auto justify-start px-4 py-3 transition-all hover:border-primary hover:bg-primary/10" onClick={() => scrollToSection("onchain")}>
                    <Shield className="mr-2 h-4 w-4 flex-shrink-0" />
                    <span className="text-left">On-Chain Authority</span>
                  </Button>
                  <Button variant="outline" className="h-auto justify-start px-4 py-3 transition-all hover:border-primary hover:bg-primary/10" onClick={() => scrollToSection("framework")}>
                    <Settings className="mr-2 h-4 w-4 flex-shrink-0" />
                    <span className="text-left">Hybrid Framework</span>
                  </Button>
                  <Button variant="outline" className="h-auto justify-start px-4 py-3 transition-all hover:border-primary hover:bg-primary/10" onClick={() => scrollToSection("geo")}>
                    <Search className="mr-2 h-4 w-4 flex-shrink-0" />
                    <span className="text-left">GEO</span>
                  </Button>
                  <Button variant="outline" className="h-auto justify-start px-4 py-3 transition-all hover:border-primary hover:bg-primary/10" onClick={() => scrollToSection("analytics")}>
                    <BarChart3 className="mr-2 h-4 w-4 flex-shrink-0" />
                    <span className="text-left">Analytics Stack</span>
                  </Button>
                  <Button variant="outline" className="h-auto justify-start px-4 py-3 transition-all hover:border-primary hover:bg-primary/10" onClick={() => scrollToSection("stories")}>
                    <Sparkles className="mr-2 h-4 w-4 flex-shrink-0" />
                    <span className="text-left">Success Stories</span>
                  </Button>
                  <Button variant="outline" className="h-auto justify-start px-4 py-3 transition-all hover:border-primary hover:bg-primary/10" onClick={() => scrollToSection("plan")}>
                    <Target className="mr-2 h-4 w-4 flex-shrink-0" />
                    <span className="text-left">Action Plan</span>
                  </Button>
                  <Button variant="outline" className="h-auto justify-start px-4 py-3 transition-all hover:border-primary hover:bg-primary/10" onClick={() => scrollToSection("tools")}>
                    <Settings className="mr-2 h-4 w-4 flex-shrink-0" />
                    <span className="text-left">Tools & Resources</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Critical Shift */}
            <Card className="border border-amber-300/40 bg-amber-100/10">
              <CardContent className="flex items-start gap-3 p-5">
                <AlertTriangle className="mt-0.5 h-5 w-5 text-amber-500" />
                <div>
                  <div className="font-semibold">Critical shift happening now</div>
                  <p className="text-sm text-muted-foreground">A 25% drop in traditional search traffic is predicted by 2026. AI chat answers are rewriting discoverability.</p>
                </div>
              </CardContent>
            </Card>
          </header>

          {/* Paradigm Shift */}
          <section id="paradigm" className="scroll-mt-24">
            <h2 className="text-2xl font-bold">The Paradigm Shift: Web2 vs Web3 Search</h2>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle>Web2 Search</CardTitle>
                  <CardDescription>Centralized discovery</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p>• Google as gatekeeper</p>
                  <p>• Opaque algorithms</p>
                  <p>• Data = their asset</p>
                  <p>• Trust = inferred</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Web3 Search</CardTitle>
                  <CardDescription>Decentralized discovery</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p>• Multiple engines</p>
                  <p>• Transparent ranking</p>
                  <p>• Data = your asset</p>
                  <p>• Trust = verifiable</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Your Strategy</CardTitle>
                  <CardDescription>Hybrid approach</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p>• On-chain + off-chain</p>
                  <p>• Community-driven</p>
                  <p>• AI-optimized</p>
                  <p>• Future-proof</p>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Ecosystem Tabs */}
          <section id="ecosystem" className="mt-12 scroll-mt-24">
            <h2 className="text-2xl font-bold">The New Search Ecosystem</h2>
            <Tabs defaultValue="dse" className="mt-6">
              <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
                <TabsTrigger value="dse">Decentralized Engines</TabsTrigger>
                <TabsTrigger value="dapps">dApp Discovery</TabsTrigger>
                <TabsTrigger value="ai">AI Search</TabsTrigger>
                <TabsTrigger value="social">Social Web3</TabsTrigger>
              </TabsList>
              <TabsContent value="dse" className="mt-6">
                <div className="grid gap-4 md:grid-cols-3">
                  <Card className="transition-shadow hover:shadow-md">
                    <CardHeader>
                      <CardTitle>Presearch</CardTitle>
                      <CardDescription>Community-powered. Token incentives (PRE).</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <a className="inline-flex items-center text-primary hover:underline" href="https://presearch.com" target="_blank" rel="noopener noreferrer">
                        Learn more <ExternalLink className="ml-1 h-4 w-4" />
                      </a>
                    </CardContent>
                  </Card>
                  <Card className="transition-shadow hover:shadow-md">
                    <CardHeader>
                      <CardTitle>Brave Search</CardTitle>
                      <CardDescription>Privacy-first. Independent index.</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <a className="inline-flex items-center text-primary hover:underline" href="https://search.brave.com" target="_blank" rel="noopener noreferrer">
                        Learn more <ExternalLink className="ml-1 h-4 w-4" />
                      </a>
                    </CardContent>
                  </Card>
                  <Card className="transition-shadow hover:shadow-md">
                    <CardHeader>
                      <CardTitle>YaCy (P2P)</CardTitle>
                      <CardDescription>Peer-to-peer, community index.</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <a className="inline-flex items-center text-primary hover:underline" href="https://yacy.net/" target="_blank" rel="noopener noreferrer">
                        Learn more <ExternalLink className="ml-1 h-4 w-4" />
                      </a>
                    </CardContent>
                  </Card>
                </div>
                <div className="mt-6 rounded-md border bg-muted/40 p-4 text-sm">
                  <div className="font-semibold">Reality check</div>
                  <p className="text-muted-foreground">Google still controls the vast majority of search traffic today. Your strategy must be bilingual: optimize for Google now and build for Web3 dominance long-term.</p>
                </div>
              </TabsContent>
              <TabsContent value="dapps" className="mt-6">
                <div className="overflow-x-auto">
                  <Table className="min-w-[720px]">
                    <TableHeader>
                      <TableRow>
                        <TableHead>Metric</TableHead>
                        <TableHead>What It Measures</TableHead>
                        <TableHead>Why It Matters</TableHead>
                        <TableHead>How to Optimize</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">Unique Active Wallets (UAW)</TableCell>
                        <TableCell>Distinct wallets interacting with your dApp</TableCell>
                        <TableCell>User base size & engagement</TableCell>
                        <TableCell>Community campaigns, airdrops, better UX</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Volume</TableCell>
                        <TableCell>USD value of crypto through your contracts</TableCell>
                        <TableCell>Economic activity level</TableCell>
                        <TableCell>Competitive fees, incentive programs</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Balance (TVL)</TableCell>
                        <TableCell>Assets held in your contracts</TableCell>
                        <TableCell>Trust & capital depth</TableCell>
                        <TableCell>Security audits, transparent governance</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Boosting Power</TableCell>
                        <TableCell>Community votes for visibility</TableCell>
                        <TableCell>Grassroots loyalty</TableCell>
                        <TableCell>Foster engaged Discord/Telegram</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
                <div className="mt-4 rounded-md border border-amber-300/40 bg-amber-100/10 p-4 text-sm">
                  <div className="font-semibold">You can't game these metrics</div>
                  <p className="text-muted-foreground">Unlike traditional SEO, platform rankings equal actual product usage. Marketing becomes product management.</p>
                </div>
              </TabsContent>
              <TabsContent value="ai" className="mt-6 space-y-2">
                <p>Generative Engine Optimization (GEO) is about being cited inside AI answers. Structure your content with definitions, tables, and FAQs, and ensure AI crawlers can access your site.</p>
                <Button variant="link" className="px-0" onClick={() => scrollToSection("geo")}>Jump to GEO <ArrowRight className="ml-1 h-4 w-4" /></Button>
              </TabsContent>
              <TabsContent value="social" className="mt-6">
                <p>Discovery increasingly happens via Farcaster, Lens, Discord, Telegram, Github, and community forums. Treat these as first-class surfaces alongside Google.</p>
              </TabsContent>
            </Tabs>
          </section>

          {/* On-Chain Authority */}
          <section id="onchain" className="mt-12 scroll-mt-24">
            <h2 className="text-2xl font-bold">The New Ranking Factors: On-Chain Authority</h2>
            <div className="mt-6 overflow-x-auto">
              <Table className="min-w-[720px]">
                <TableHeader>
                  <TableRow>
                    <TableHead>Factor</TableHead>
                    <TableHead>Web2 (Google)</TableHead>
                    <TableHead>Web3 (Decentralized)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Primary Signal</TableCell>
                    <TableCell>Backlinks, domain authority</TableCell>
                    <TableCell>On-chain validation, token staking</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Trust Proof</TableCell>
                    <TableCell>Media mentions, E-E-A-T</TableCell>
                    <TableCell>Audits, blockchain records</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Content Auth</TableCell>
                    <TableCell>Author bio, credentials</TableCell>
                    <TableCell>Signed on-chain publishing</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Community</TableCell>
                    <TableCell>Social shares (likes)</TableCell>
                    <TableCell>DAO votes, governance participation</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Identity</TableCell>
                    <TableCell>Email, social logins</TableCell>
                    <TableCell>Wallet + verifiable credentials</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>

            <Accordion type="single" collapsible className="mt-6">
              <AccordionItem value="val">
                <AccordionTrigger>On-Chain Validation</AccordionTrigger>
                <AccordionContent>
                  Publishing content via Mirror, Arweave, or IPFS provides immutable proof of authorship. A whitepaper on-chain has verifiable timestamps; a copy on Medium is not.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="rep">
                <AccordionTrigger>Token-Based Reputation</AccordionTrigger>
                <AccordionContent>
                  Staking and governance participation are economic trust signals. Design token utility with reputation in mind to build durable authority.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="wallet">
                <AccordionTrigger>Wallet History as Credit Score</AccordionTrigger>
                <AccordionContent>
                  Wallets with long history, reputable interactions, and blue-chip holdings carry more weight than new wallets. Engage authoritative wallets to amplify ranking signals.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="dao">
                <AccordionTrigger>DAO Participation Signals</AccordionTrigger>
                <AccordionContent>
                  Governance proposals, forum activity, and on-chain votes reflect community credibility and product health—valuable discovery signals.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="meta">
                <AccordionTrigger>Smart Contract Metadata</AccordionTrigger>
                <AccordionContent>
                  Clear names, verified source code, and descriptive metadata function like on-page SEO for contracts—improving discovery in explorers and aggregators.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </section>

          {/* Framework */}
          <section id="framework" className="mt-12 scroll-mt-24">
            <h2 className="text-2xl font-bold">Your Strategic Framework: The Hybrid Approach</h2>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>On-Chain SEO</CardTitle>
                  <CardDescription>Verifiable authority</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p>✓ Smart contract optimization</p>
                  <p>✓ Blockchain domain (.eth)</p>
                  <p>✓ On-chain content publishing</p>
                  <p>✓ Token-gated experiences</p>
                  <p>✓ DAO governance content</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Off-Chain SEO</CardTitle>
                  <CardDescription>Immediate visibility</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p>✓ Traditional keyword research</p>
                  <p>✓ Educational content</p>
                  <p>✓ Crypto media backlinks</p>
                  <p>✓ Community building</p>
                  <p>✓ Technical site optimization</p>
                </CardContent>
              </Card>
            </div>

            <div className="mt-8 grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Smart Contract Optimization</CardTitle>
                  <CardDescription>Names and metadata matter</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border bg-muted/40 p-4">
                    <div className="whitespace-pre-wrap font-mono text-sm">{badSol}</div>
                    <div className="mt-2 whitespace-pre-wrap font-mono text-sm">{goodSol}</div>
                    <div className="mt-3 flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => copyToClipboard(goodSol)}>Copy</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Blockchain Domain Strategy</CardTitle>
                  <CardDescription>Own your namespace</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p>□ Register YourProject.eth</p>
                  <p>□ Add detailed description</p>
                  <p>□ Link verified socials</p>
                  <p>□ Set IPFS content hash</p>
                  <p>□ Configure ENS records</p>
                </CardContent>
              </Card>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle>Mirror.xyz</CardTitle>
                  <CardDescription>Blogging + NFT integration</CardDescription>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Arweave</CardTitle>
                  <CardDescription>Permanent storage</CardDescription>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>IPFS</CardTitle>
                  <CardDescription>Distributed, content-addressed</CardDescription>
                </CardHeader>
              </Card>
            </div>

            <div className="mt-8 grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Engagement Pyramid</CardTitle>
                </CardHeader>
                <CardContent className="space-y-1">
                  <p>Passive Member → Content Share → Active Discussion → DAO Votes</p>
                  <p className="text-sm text-muted-foreground">Invest in community first—on-chain metrics follow.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Web3 Digital PR</CardTitle>
                </CardHeader>
                <CardContent className="space-y-1">
                  <p>□ CoinTelegraph, Decrypt, The Block, Bankless</p>
                  <p>□ Etherscan verification, DeFi Llama, CoinGecko, CMC</p>
                  <p className="text-sm text-muted-foreground">One Etherscan verification &gt; 100 random blog mentions.</p>
                </CardContent>
              </Card>
            </div>

            <div className="mt-8 grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Keyword Strategy</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table className="min-w-[560px]">
                      <TableHeader>
                        <TableRow>
                          <TableHead>Avoid</TableHead>
                          <TableHead>Target Instead</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell>"Cryptocurrency"</TableCell>
                          <TableCell>"Multi-signature hardware wallet security"</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>"NFT"</TableCell>
                          <TableCell>"ERC-721 vs ERC-1155 for gaming NFTs"</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>"DeFi"</TableCell>
                          <TableCell>"Impermanent loss mitigation strategies Uniswap V3"</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>"Blockchain"</TableCell>
                          <TableCell>"Layer 2 rollup comparison for dApp developers"</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Content Strategy: Dual Audience</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-2 md:grid-cols-2">
                  <div>
                    <div className="font-semibold">Beginners</div>
                    <p className="text-sm text-muted-foreground">What is DeFi? How to set up MetaMask. NFT buying guide. Glossary.</p>
                  </div>
                  <div>
                    <div className="font-semibold">Experts</div>
                    <p className="text-sm text-muted-foreground">Protocol architecture deep dives. Tokenomics analysis. Security audit reviews.</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* GEO */}
          <section id="geo" className="mt-12 scroll-mt-24">
            <h2 className="text-2xl font-bold">The AI Revolution: Generative Engine Optimization (GEO)</h2>
            <Card className="mt-6 border border-red-300/40 bg-red-100/10">
              <CardContent className="flex items-start gap-3 p-5">
                <AlertTriangle className="mt-0.5 h-5 w-5 text-red-500" />
                <div>
                  <div className="font-semibold">64% drop in clicks when AI Overviews appear</div>
                  <p className="text-sm text-muted-foreground">Traditional SEO aims for #1. GEO aims to be cited inside the AI answer.</p>
                </div>
              </CardContent>
            </Card>

            <div className="mt-6 grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle>Structured Data</CardTitle>
                  <CardDescription>Schema.org, FAQs, tables, definitions</CardDescription>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Brand Authority</CardTitle>
                  <CardDescription>Verified sources, media mentions</CardDescription>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>AI Crawl Access</CardTitle>
                  <CardDescription>Allow GPTBot, Perplexity, Claude-Web</CardDescription>
                </CardHeader>
              </Card>
            </div>

            <div className="mt-6 rounded-md border bg-muted/40 p-4">
              <div className="flex items-center justify-between gap-2">
                <div className="whitespace-pre-wrap font-mono text-sm">{robotsTxt}</div>
                <Button variant="outline" size="sm" onClick={() => copyToClipboard(robotsTxt)}>Copy</Button>
              </div>
            </div>
          </section>

          {/* Analytics Stack */}
          <section id="analytics" className="mt-12 scroll-mt-24">
            <h2 className="text-2xl font-bold">The Analytics Stack: Measuring What Matters</h2>
            <div className="mt-6 overflow-x-auto">
              <Table className="min-w-[720px]">
                <TableHeader>
                  <TableRow>
                    <TableHead>Category</TableHead>
                    <TableHead>Tools</TableHead>
                    <TableHead>What It Tracks</TableHead>
                    <TableHead>Cost</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">On-Chain Intel</TableCell>
                    <TableCell>Dune, Nansen, The Graph</TableCell>
                    <TableCell>Competitor metrics, wallet behavior, trends</TableCell>
                    <TableCell>$50–500/mo</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Attribution</TableCell>
                    <TableCell>Formo, Spindl, Cookie3</TableCell>
                    <TableCell>Off-chain → on-chain journey</TableCell>
                    <TableCell>$300–3K/mo</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Traditional SEO</TableCell>
                    <TableCell>Ahrefs, Semrush, GSC</TableCell>
                    <TableCell>Keywords, backlinks, rankings</TableCell>
                    <TableCell>$100–500/mo</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Platform Tracking</TableCell>
                    <TableCell>DappRadar, Presearch Analytics</TableCell>
                    <TableCell>dApp store ranking, DSE visibility</TableCell>
                    <TableCell>Free–$200/mo</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
            <div className="mt-4 rounded-md border bg-muted/40 p-4 text-sm">
              <div className="font-semibold">The attribution breakthrough</div>
              <p className="text-muted-foreground">Connect Google Search → Website → Wallet connect → On-chain swap. Finally, marketing spend maps to revenue.</p>
            </div>
          </section>

          {/* Future Horizons */}
          <section id="future" className="mt-12 scroll-mt-24">
            <h2 className="text-2xl font-bold">Future Horizons: 2026 and Beyond</h2>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle>Decentralized Identity (DIDs)</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">Credentials live on-chain and are verifiable by AI systems.</CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Personalized Knowledge Graphs</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">AI builds private graphs from wallet actions and trusted sources.</CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Metaverse Search (Spatial SEO)</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">Discovery extends to 3D and spatial environments connected to wallets.</CardContent>
              </Card>
            </div>
          </section>

          {/* Success Stories */}
          <section id="stories" className="mt-12 scroll-mt-24">
            <h2 className="text-2xl font-bold">Real-World Success Stories</h2>
            <Accordion type="single" collapsible className="mt-6">
              <AccordionItem value="consensys">
                <AccordionTrigger>ConsenSys</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-semibold">Impact:</span> ~50% of leads organic; ~$1.5M revenue influenced.</p>
                    <div className="h-2 w-full rounded bg-muted">
                      <div className="h-2 rounded bg-primary" style={{ width: "50%" }} />
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="notabene">
                <AccordionTrigger>Notabene</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-semibold">Impact:</span> 43x traffic; ~$1.4M revenue influenced.</p>
                    <div className="h-2 w-full rounded bg-muted">
                      <div className="h-2 rounded bg-primary" style={{ width: "80%" }} />
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="atlendis">
                <AccordionTrigger>Atlendis</AccordionTrigger>
                <AccordionContent>
                  <div className="text-sm">Month 0 → 9: shipped docs, built authority content, and scaled organic with community-led strategy.</div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </section>

          {/* Action Plan */}
          <section id="plan" className="mt-12 scroll-mt-24">
            <h2 className="text-2xl font-bold">Your Action Plan</h2>
            <Tabs value={actionStage} onValueChange={setActionStage} className="mt-6">
              <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
                <TabsTrigger value="pre">Pre-Launch</TabsTrigger>
                <TabsTrigger value="post">Post-Launch</TabsTrigger>
                <TabsTrigger value="scale">Scaling</TabsTrigger>
                <TabsTrigger value="ent">Enterprise</TabsTrigger>
              </TabsList>
              <TabsContent value="pre" className="mt-4">
                <ul className="list-disc space-y-2 pl-5 text-sm">
                  <li>Set up documentation (quickstart, concepts, tutorials).</li>
                  <li>Claim ENS and configure records.</li>
                  <li>Enable analytics and basic attribution.</li>
                  <li>Seed your community channels.</li>
                </ul>
              </TabsContent>
              <TabsContent value="post" className="mt-4">
                <ul className="list-disc space-y-2 pl-5 text-sm">
                  <li>Ship pillar pages and comparison pages.</li>
                  <li>Integrate GEO (FAQ, structured data, robots.txt).</li>
                  <li>Publish audits and verifiable on-chain content.</li>
                </ul>
              </TabsContent>
              <TabsContent value="scale" className="mt-4">
                <ul className="list-disc space-y-2 pl-5 text-sm">
                  <li>Expand content clusters; build digital PR.</li>
                  <li>Track wallet connects → on-chain actions.</li>
                  <li>Optimize smart contract metadata.</li>
                </ul>
              </TabsContent>
              <TabsContent value="ent" className="mt-4">
                <ul className="list-disc space-y-2 pl-5 text-sm">
                  <li>Full hybrid strategy across org.</li>
                  <li>Advanced attribution and LTV modeling.</li>
                  <li>Governance content and rigorous audits.</li>
                </ul>
              </TabsContent>
            </Tabs>
          </section>

          {/* Tools & Resources */}
          <section id="tools" className="mt-12 scroll-mt-24">
            <h2 className="text-2xl font-bold">Tools & Resources</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button variant="secondary" size="sm">All</Button>
              <Button variant="outline" size="sm">Free</Button>
              <Button variant="outline" size="sm">Paid</Button>
              <Button variant="outline" size="sm">Analytics</Button>
              <Button variant="outline" size="sm">Content</Button>
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Research</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">Search Console, Ahrefs/Semrush, AlsoAsked, Github search, Farcaster/Reddit explorers, Dune dashboards</CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Data & Tracking</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">GA4/Plausible, Dune/Flipside, token explorers, Presearch Analytics</CardContent>
              </Card>
            </div>
          </section>

          {/* Bottom line + CTA */}
          <section id="bottom" className="mt-12 scroll-mt-24">
            <h2 className="text-2xl font-bold">The Bottom Line: Authority is Verifiable</h2>
            <blockquote className="mt-4 rounded-md border bg-muted/40 p-4 text-muted-foreground">
              "Web3 SEO is not about gaming algorithms. It's about building verifiable authority that machines can trust and communities can validate."
            </blockquote>

            {/* CTA cards */}
            <div className="mt-8 grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle>Run Audit Checklist</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">Docs, audits, ENS, robots, JSON-LD.</CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Implement Quick Wins</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">Pillar pages, FAQs, performance fixes.</CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Build Hybrid Strategy</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">On-chain + off-chain plan with analytics.</CardContent>
              </Card>
            </div>

            <div className="mt-10">
              <CTASection />
            </div>
          </section>
        </article>
      </main>

      <Footer />
    </div>
  );
}
