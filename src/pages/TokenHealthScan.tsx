import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BookOpen, Code, Rocket, Zap, Video, ExternalLink, Shield, Coins, Users, GitBranch, TrendingUp } from "lucide-react";
import tokenHealthHero from "@/assets/token-health-hero.png";
import tokenHealthResults from "@/assets/token-health-results.png";
import tokenHealthBuild from "@/assets/token-health-build.png";
import authorAvatar from "@/assets/gabriel-profile.png";

const title = "How I Launched a Crypto Tool, a Mockumentary Ad, and a Playbook — All with AI";
const description = "From idea to launch: Building Token Health Scan with AI, zero code, and a viral marketing campaign";

function useSEO() {
  React.useEffect(() => {
    const origin = window.location.origin;
    const url = `${origin}/publications/vibe-coded-token-health-scan`;
    const absoluteImage = tokenHealthHero.startsWith("http") ? tokenHealthHero : `${origin}${tokenHealthHero}`;

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

    ensureMetaByName("description", description);
    ensureLinkRel("canonical", url);

    ensureMetaByProperty("og:type", "article");
    ensureMetaByProperty("og:title", title);
    ensureMetaByProperty("og:description", description);
    ensureMetaByProperty("og:url", url);
    ensureMetaByProperty("og:image", absoluteImage);

    ensureMetaByName("twitter:card", "summary_large_image");
    ensureMetaByName("twitter:title", title);
    ensureMetaByName("twitter:description", description);
    ensureMetaByName("twitter:image", absoluteImage);

    const articleLd = {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: title,
      image: [absoluteImage],
      author: { "@type": "Person", name: "Gabriel Mangabeira", jobTitle: "Olympian & Growth Strategist" },
      datePublished: "2025-06-05",
      dateModified: "2025-06-05",
      mainEntityOfPage: url,
      description,
      wordCount: 1200,
      timeRequired: "PT6M",
    } as const;

    const breadcrumbLd = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: `${origin}/` },
        { "@type": "ListItem", position: 2, name: "Publications", item: `${origin}/#publications` },
        { "@type": "ListItem", position: 3, name: title },
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
    addJsonLd(breadcrumbLd);

    return () => {
      scriptNodes.forEach((s) => s.remove());
    };
  }, []);
}

export default function TokenHealthScan() {
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
                  6 min read
                </span>
                <span className="inline-flex items-center rounded-full border border-border bg-muted/40 px-3 py-1 text-xs font-medium text-muted-foreground">
                  Updated Jun 2025
                </span>
              </div>
            </div>

            <figure className="mt-8 overflow-hidden rounded-lg border border-border">
              <img
                src={tokenHealthHero}
                alt="Token Health Scan - Find Hidden Risks Before You Dive In"
                loading="lazy"
                className="h-auto w-full object-cover"
              />
            </figure>

            {/* TLDR Section */}
            <Card className="my-8 border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10 shadow-lg">
              <CardContent className="p-6">
                <div className="mb-4 flex items-center gap-2">
                  <Zap className="h-5 w-5 text-primary" />
                  <h2 className="text-xl font-bold">TL;DR - Jump to What Matters</h2>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <Button
                    variant="outline"
                    className="h-auto justify-start px-4 py-3 transition-all hover:border-primary hover:bg-primary/10"
                    onClick={() => scrollToSection("what")}
                  >
                    <BookOpen className="mr-2 h-4 w-4 flex-shrink-0" />
                    <span className="text-left">What It Is</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-auto justify-start px-4 py-3 transition-all hover:border-primary hover:bg-primary/10"
                    onClick={() => scrollToSection("how")}
                  >
                    <Code className="mr-2 h-4 w-4 flex-shrink-0" />
                    <span className="text-left">How It Works</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-auto justify-start px-4 py-3 transition-all hover:border-primary hover:bg-primary/10"
                    onClick={() => scrollToSection("tech")}
                  >
                    <Rocket className="mr-2 h-4 w-4 flex-shrink-0" />
                    <span className="text-left">Tech Stack</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-auto justify-start px-4 py-3 transition-all hover:border-primary hover:bg-primary/10"
                    onClick={() => scrollToSection("launch")}
                  >
                    <Video className="mr-2 h-4 w-4 flex-shrink-0" />
                    <span className="text-left">The Launch</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </header>

          {/* Intro Section */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold">So Many Tabs Open</h2>
            <div className="mt-6 space-y-4">
              <p className="text-lg text-muted-foreground">
                If you've spent more than five minutes trying to research a token, you know the pain.
              </p>
              <p className="text-muted-foreground">
                You open seven tabs. Bounce between charts, contract scanners, GitHub, Twitter.
              </p>
              <p className="text-muted-foreground">
                And still end up guessing whether a project is legit, or just dressed-up vaporware.
              </p>
              <Card className="border-l-4 border-l-amber-500 bg-amber-50/50 dark:bg-amber-950/20">
                <CardContent className="p-6">
                  <p className="font-semibold text-foreground">Here's the kicker: 98% of tokens fail.</p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Not because the tech is bad — but because nobody trusts them.
                  </p>
                </CardContent>
              </Card>
              <p className="text-muted-foreground">That's the problem I wanted to solve.</p>
              <p className="text-muted-foreground">
                So I built <strong>Token Health Scan</strong> — a clean, fast, Web3-native tool to help you DYOR without losing your mind (or your wallet).
              </p>
            </div>
          </section>

          {/* What Is Token Health Scan */}
          <section id="what" className="scroll-mt-24 mb-12">
            <h2 className="text-2xl font-bold">What Is Token Health Scan?</h2>
            <div className="mt-6 space-y-6">
              <p className="text-muted-foreground">
                Token Health Scan is a <strong>free + pro-tier web app</strong> that lets anyone scan any token by name or address.
              </p>
              
              <Card>
                <CardHeader>
                  <CardTitle>Get a 5-pillar health score:</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
                    <div className="flex items-center gap-2">
                      <Shield className="h-5 w-5 text-primary" />
                      <span className="font-medium">Security</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Coins className="h-5 w-5 text-primary" />
                      <span className="font-medium">Liquidity</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-primary" />
                      <span className="font-medium">Tokenomics</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-primary" />
                      <span className="font-medium">Community</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <GitBranch className="h-5 w-5 text-primary" />
                      <span className="font-medium">Development</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <p className="text-muted-foreground">Instantly spot red flags and trust signals.</p>
              <p className="text-muted-foreground">
                Whether you're a degen, a builder, or someone in-between, this tool gets you signal fast.
              </p>
            </div>

            <figure className="my-8 overflow-hidden rounded-lg border border-border shadow-lg">
              <img
                src={tokenHealthResults}
                alt="Token Health Scan Results Dashboard showing Pendle token analysis"
                loading="lazy"
                className="h-auto w-full object-cover"
              />
              <figcaption className="bg-muted/40 px-4 py-2 text-center text-sm text-muted-foreground">
                The Token Health Scan Report
              </figcaption>
            </figure>
          </section>

          {/* How It Works */}
          <section id="how" className="scroll-mt-24 mb-12">
            <h2 className="text-2xl font-bold">How It Works (In Plain English)</h2>
            <p className="mt-4 text-muted-foreground">Here's the full user journey:</p>
            <div className="mt-6 space-y-4">
              <Card>
                <CardContent className="flex items-start gap-4 p-4">
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 font-bold text-primary">
                    1
                  </div>
                  <div>
                    <h3 className="font-semibold">Search</h3>
                    <p className="text-sm text-muted-foreground">Type any token name or address</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="flex items-start gap-4 p-4">
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 font-bold text-primary">
                    2
                  </div>
                  <div>
                    <h3 className="font-semibold">Match</h3>
                    <p className="text-sm text-muted-foreground">The tool auto-finds it in the CoinGecko database</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="flex items-start gap-4 p-4">
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 font-bold text-primary">
                    3
                  </div>
                  <div>
                    <h3 className="font-semibold">Scan Loads</h3>
                    <p className="text-sm text-muted-foreground">Crypto trivia runs while it crunches data</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="flex items-start gap-4 p-4">
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 font-bold text-primary">
                    4
                  </div>
                  <div>
                    <h3 className="font-semibold">Results</h3>
                    <p className="text-sm text-muted-foreground">Token dashboard with overview scores and deep dive tabs</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="flex items-start gap-4 p-4">
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 font-bold text-primary">
                    5
                  </div>
                  <div>
                    <h3 className="font-semibold">Upgrade Prompt</h3>
                    <p className="text-sm text-muted-foreground">After 3 scans, you can unlock full access with Pro</p>
                  </div>
                </CardContent>
              </Card>
            </div>
            <p className="mt-6 text-muted-foreground">
              It's basically a full health checkup, but for tokens — minus the pain of spreadsheets and forums.
            </p>
          </section>

          {/* Tech Stack */}
          <section id="tech" className="scroll-mt-24 mb-12">
            <h2 className="text-2xl font-bold">What Powers It</h2>
            <div className="mt-6 space-y-6">
              <p className="text-muted-foreground">
                I built the MVP using <strong>Lovable</strong> — an AI product builder that lets you ship without touching a line of code.
              </p>
              <div>
                <h3 className="mb-4 text-lg font-semibold">Here's the stack:</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <Card className="transition-shadow hover:shadow-md">
                    <CardHeader>
                      <CardTitle className="text-base">Frontend</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">Lovable</p>
                    </CardContent>
                  </Card>
                  <Card className="transition-shadow hover:shadow-md">
                    <CardHeader>
                      <CardTitle className="text-base">Backend</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">Supabase</p>
                    </CardContent>
                  </Card>
                  <Card className="transition-shadow hover:shadow-md">
                    <CardHeader>
                      <CardTitle className="text-base">Payments</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">Stripe</p>
                    </CardContent>
                  </Card>
                  <Card className="transition-shadow hover:shadow-md">
                    <CardHeader>
                      <CardTitle className="text-base">APIs</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">CoinGecko, GoPlus, GeckoTerminal, GitHub, Apify/X</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
              <p className="text-muted-foreground">
                A lot of prompts, multiple iterations, and a couple hundred credits later…the first version was live.
              </p>
            </div>

            <figure className="my-8 overflow-hidden rounded-lg border border-border shadow-lg">
              <img
                src={tokenHealthBuild}
                alt="Lovable application building Token Health Scan"
                loading="lazy"
                className="h-auto w-full object-cover"
              />
              <figcaption className="bg-muted/40 px-4 py-2 text-center text-sm text-muted-foreground">
                Walk through the Token Health Scan build process
              </figcaption>
            </figure>
          </section>

          {/* Launch Section */}
          <section id="launch" className="scroll-mt-24 mb-12">
            <h2 className="text-2xl font-bold">How I Launched It</h2>
            <div className="mt-6 space-y-6">
              <p className="text-muted-foreground">Just tweeting "I built a thing" doesn't work anymore.</p>
              <p className="text-muted-foreground">
                So I tried something different: A <strong>mockumentary ad</strong> made with Veo3, styled like The Office but set inside a crypto startup.
              </p>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Featuring:</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-sm text-muted-foreground">• A clueless intern</p>
                  <p className="text-sm text-muted-foreground">• A deadpan founder</p>
                  <p className="text-sm text-muted-foreground">• A crypto cat in sunglasses 😎</p>
                </CardContent>
              </Card>

              <p className="text-muted-foreground">
                All powered by AI — no scriptwriters, no camera crew. Just a clear vibe and good storytelling.
              </p>
            </div>

            <div className="my-8 overflow-hidden rounded-lg border border-border shadow-lg">
              <div className="relative aspect-video">
                <iframe
                  className="h-full w-full"
                  src="https://www.youtube.com/embed/5-GSuM5nrnY"
                  title="Token Health Scan Launch Video"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          </section>

          {/* Roadmap */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold">What's Next (The Roadmap)</h2>
            <div className="mt-6 space-y-4">
              <p className="text-muted-foreground">I'm just getting started.</p>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Here's what we're building next:</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-sm text-muted-foreground">• Multi-chain support (starting with Solana + Arbitrum)</p>
                  <p className="text-sm text-muted-foreground">• Founder wallet visibility + KYC checks</p>
                  <p className="text-sm text-muted-foreground">• Alerts when token scores change</p>
                </CardContent>
              </Card>
              <p className="text-muted-foreground">If you've got feature ideas — I'm all ears.</p>
            </div>
          </section>

          {/* Try It + Share Feedback */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold">Try It + Share Feedback</h2>
            <div className="mt-6 space-y-6">
              <p className="text-muted-foreground">I'm building in public and tweaking based on real usage.</p>
              
              <div className="grid gap-4 md:grid-cols-2">
                <Card className="transition-shadow hover:shadow-md">
                  <CardHeader>
                    <CardTitle className="text-base">Try Token Health Scan</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <a
                      href="https://tokenhealthscan.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-primary hover:underline"
                    >
                      tokenhealthscan.com <ExternalLink className="ml-1 h-4 w-4" />
                    </a>
                  </CardContent>
                </Card>
                <Card className="transition-shadow hover:shadow-md">
                  <CardHeader>
                    <CardTitle className="text-base">Follow for updates + scans</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <a
                      href="https://twitter.com/manga82"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-primary hover:underline"
                    >
                      @manga82 on Twitter (X) <ExternalLink className="ml-1 h-4 w-4" />
                    </a>
                  </CardContent>
                </Card>
              </div>

              <p className="text-muted-foreground">
                Got feature requests? Questions? Feedback? Drop a comment or DM me. Let's fix DYOR, together.
              </p>
            </div>

            <div className="my-12 rounded-lg border-2 border-primary bg-primary/5 p-6 text-center md:p-8">
              <h3 className="mt-0 text-xl font-semibold">Want to Build Your Own AI-Powered Tool?</h3>
              <p className="mb-6 text-base md:text-lg">
                Let's discuss how you can launch products faster using AI and no-code tools.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button onClick={() => window.open("https://calendly.com/gabriel-mangabeira/15min", "_blank")}>
                  Work With Me
                </Button>
                <Button
                  variant="outline"
                  onClick={() => window.open("https://tokenhealthscan.com", "_blank")}
                >
                  Try Token Health Scan
                </Button>
              </div>
            </div>
          </section>
        </article>
      </main>

      <Footer />
    </div>
  );
}
