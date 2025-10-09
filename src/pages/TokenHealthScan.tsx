import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, Code, Rocket, Zap, Video, ExternalLink } from "lucide-react";
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

          {/* Main Content */}
          <section className="prose prose-neutral dark:prose-invert max-w-none">
            <h2 className="text-2xl font-bold">So Many Tabs Open</h2>
            <p className="text-lg text-muted-foreground">
              If you've spent more than five minutes trying to research a token, you know the pain.
            </p>
            <p>
              You open seven tabs. Bounce between charts, contract scanners, GitHub, Twitter.
            </p>
            <p>
              And still end up guessing whether a project is legit, or just dressed-up vaporware.
            </p>
            <p className="font-semibold">Here's the kicker: 98% of tokens fail.</p>
            <p>
              Not because the tech is bad — but because nobody trusts them.
            </p>
            <p>That's the problem I wanted to solve.</p>
            <p>
              So I built <strong>Token Health Scan</strong> — a clean, fast, Web3-native tool to help you DYOR without losing your mind (or your wallet).
            </p>

            <h2 id="what" className="mt-10 scroll-mt-24 text-2xl font-bold">
              What Is Token Health Scan?
            </h2>
            <p>
              Token Health Scan is a <strong>free + pro-tier web app</strong> that lets anyone scan any token by name or address.
            </p>
            <p className="font-semibold">Get a 5-pillar health score:</p>
            <ul>
              <li>Security</li>
              <li>Liquidity</li>
              <li>Tokenomics</li>
              <li>Community</li>
              <li>Development</li>
            </ul>
            <p>Instantly spot red flags and trust signals.</p>
            <p>
              Whether you're a degen, a builder, or someone in-between, this tool gets you signal fast.
            </p>

            <figure className="my-8 overflow-hidden rounded-lg border border-border">
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

            <h2 id="how" className="mt-10 scroll-mt-24 text-2xl font-bold">
              How It Works (In Plain English)
            </h2>
            <p>Here's the full user journey:</p>
            <ol>
              <li>
                <strong>Search</strong> — Type any token name or address
              </li>
              <li>
                <strong>Match</strong> — The tool auto-finds it in the CoinGecko database
              </li>
              <li>
                <strong>Scan Loads</strong> — Crypto trivia runs while it crunches data
              </li>
              <li>
                <strong>Results</strong> — Token dashboard with overview scores and deep dive tabs
              </li>
              <li>
                <strong>Upgrade Prompt</strong> — After 3 scans, you can unlock full access with Pro
              </li>
            </ol>
            <p>
              It's basically a full health checkup, but for tokens — minus the pain of spreadsheets and forums.
            </p>

            <h2 id="tech" className="mt-10 scroll-mt-24 text-2xl font-bold">
              What Powers It
            </h2>
            <p>
              I built the MVP using <strong>Lovable</strong> — an AI product builder that lets you ship without touching a line of code.
            </p>
            <p className="font-semibold">Here's the stack:</p>
            <div className="my-6 grid gap-4 md:grid-cols-2">
              <Card>
                <CardContent className="p-4">
                  <h3 className="mt-0 text-lg font-bold">Frontend</h3>
                  <p className="mb-0 text-sm text-muted-foreground">Lovable</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <h3 className="mt-0 text-lg font-bold">Backend</h3>
                  <p className="mb-0 text-sm text-muted-foreground">Supabase</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <h3 className="mt-0 text-lg font-bold">Payments</h3>
                  <p className="mb-0 text-sm text-muted-foreground">Stripe</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <h3 className="mt-0 text-lg font-bold">APIs</h3>
                  <p className="mb-0 text-sm text-muted-foreground">CoinGecko, GoPlus, GeckoTerminal, GitHub, Apify/X</p>
                </CardContent>
              </Card>
            </div>
            <p>
              A lot of prompts, multiple iterations, and a couple hundred credits later…the first version was live.
            </p>

            <figure className="my-8 overflow-hidden rounded-lg border border-border">
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

            <h2 id="launch" className="mt-10 scroll-mt-24 text-2xl font-bold">
              How I Launched It
            </h2>
            <p>Just tweeting "I built a thing" doesn't work anymore.</p>
            <p>
              So I tried something different: A <strong>mockumentary ad</strong> made with Veo3, styled like The Office but set inside a crypto startup.
            </p>
            <p className="font-semibold">Featuring:</p>
            <ul>
              <li>A clueless intern</li>
              <li>A deadpan founder</li>
              <li>A crypto cat in sunglasses 😎</li>
            </ul>
            <p>
              All powered by AI — no scriptwriters, no camera crew. Just a clear vibe and good storytelling.
            </p>

            <div className="my-8 overflow-hidden rounded-lg border border-border">
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

            <h2 className="mt-10 text-2xl font-bold">What's Next (The Roadmap)</h2>
            <p>I'm just getting started.</p>
            <p className="font-semibold">Here's what we're building next:</p>
            <ul>
              <li>Multi-chain support (starting with Solana + Arbitrum)</li>
              <li>Founder wallet visibility + KYC checks</li>
              <li>Alerts when token scores change</li>
            </ul>
            <p>If you've got feature ideas — I'm all ears.</p>

            <h2 className="mt-10 text-2xl font-bold">Try It + Share Feedback</h2>
            <p>I'm building in public and tweaking based on real usage.</p>
            <div className="my-6 space-y-4">
              <div className="flex items-center gap-2">
                <span className="font-semibold">Try Token Health Scan:</span>
                <a
                  href="https://tokenhealthscan.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-primary hover:underline"
                >
                  tokenhealthscan.com <ExternalLink className="ml-1 h-4 w-4" />
                </a>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold">Follow for updates + scans:</span>
                <a
                  href="https://twitter.com/manga82"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-primary hover:underline"
                >
                  @manga82 on Twitter (X) <ExternalLink className="ml-1 h-4 w-4" />
                </a>
              </div>
            </div>
            <p>
              Got feature requests? Questions? Feedback? Drop a comment or DM me. Let's fix DYOR, together.
            </p>

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
