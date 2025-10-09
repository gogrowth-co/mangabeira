import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CTASection from "@/components/CTASection";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, TrendingUp, Users, Zap, Target, Compass } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import web3AthletesImage from "@/assets/web3-for-athletes.png";
import authorAvatar from "@/assets/gabriel-profile.png";

const title = "Web3 for Athletes: How to Build a Community, Not Just a Fan Base";
const description = "Learn how athletes can leverage Web3 to build engaged communities, create sustainable revenue streams, and take control of their digital presence.";

function useSEO() {
  React.useEffect(() => {
    const url = `${window.location.origin}/publications/web3-for-athletes`;

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
    ensure("meta", { property: "og:image", content: web3AthletesImage });
    ensure("meta", { name: "twitter:card", content: "summary_large_image" });
    ensure("meta", { name: "twitter:title", content: title });
    ensure("meta", { name: "twitter:description", content: description });
    ensure("meta", { name: "twitter:image", content: web3AthletesImage });

    const articleLd = {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: title,
      image: [web3AthletesImage],
      author: { '@type': 'Person', name: 'Gabriel Mangabeira', jobTitle: 'Olympian & Growth Strategist' },
      datePublished: '2025-01-15',
      dateModified: '2025-01-15',
      mainEntityOfPage: url,
      description,
      wordCount: 3200,
      timeRequired: 'PT8M',
    };

    const breadcrumbLd = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: `${window.location.origin}/` },
        { '@type': 'ListItem', position: 2, name: 'Publications', item: `${window.location.origin}/#publications` },
        { '@type': 'ListItem', position: 3, name: 'Web3 for Athletes' },
      ],
    };

    const script1 = document.createElement('script');
    script1.type = 'application/ld+json';
    script1.textContent = JSON.stringify(articleLd);
    document.head.appendChild(script1);

    const script2 = document.createElement('script');
    script2.type = 'application/ld+json';
    script2.textContent = JSON.stringify(breadcrumbLd);
    document.head.appendChild(script2);

    return () => {
      script1.remove();
      script2.remove();
    };
  }, []);
}

export default function Web3ForAthletes() {
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
                  8 min read
                </span>
                <span className="inline-flex items-center rounded-full border border-border bg-muted/40 px-3 py-1 text-xs font-medium text-muted-foreground">
                  Updated Oct 2025
                </span>
              </div>
            </div>

            <figure className="mt-8 overflow-hidden rounded-lg border border-border">
              <img
                src={web3AthletesImage}
                alt="Web3 for Athletes - Building Communities, Not Just Fan Bases"
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
                  <Button
                    variant="outline"
                    className="justify-start h-auto py-3 px-4 hover:bg-primary/10 hover:border-primary transition-all"
                    onClick={() => scrollToSection("fan-vs-community")}
                  >
                    <BookOpen className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span className="text-left">Fan vs Community</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="justify-start h-auto py-3 px-4 hover:bg-primary/10 hover:border-primary transition-all"
                    onClick={() => scrollToSection("why-web3")}
                  >
                    <Target className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span className="text-left">Why Web3 Matters</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="justify-start h-auto py-3 px-4 hover:bg-primary/10 hover:border-primary transition-all"
                    onClick={() => scrollToSection("framework")}
                  >
                    <TrendingUp className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span className="text-left">3-Layer Framework</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="justify-start h-auto py-3 px-4 hover:bg-primary/10 hover:border-primary transition-all"
                    onClick={() => scrollToSection("examples")}
                  >
                    <Users className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span className="text-left">Real Examples</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="justify-start h-auto py-3 px-4 hover:bg-primary/10 hover:border-primary transition-all"
                    onClick={() => scrollToSection("getting-started")}
                  >
                    <Zap className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span className="text-left">Getting Started</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="justify-start h-auto py-3 px-4 hover:bg-primary/10 hover:border-primary transition-all"
                    onClick={() => scrollToSection("faq")}
                  >
                    <Compass className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span className="text-left">FAQs</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </header>

          <section className="prose prose-neutral dark:prose-invert max-w-none">
            <p className="text-lg text-muted-foreground">
              Fans cheer from the stands. Communities build with you.
            </p>
            <p className="text-lg text-muted-foreground">
              As an athlete, your career is built on performance. But what happens when the cheering stops? When the sponsorships dry up? When platforms change their algorithms and your reach plummets overnight?
            </p>
            <p className="text-lg text-muted-foreground">
              Traditional fan engagement keeps you trapped in a cycle of dependency - on platforms, on sponsors, on fleeting attention. Web3 offers something different: the tools to build a community that owns their stake in your success.
            </p>
            <p className="text-lg text-muted-foreground">
              This isn't about chasing crypto trends. It's about sustainable community building that creates real value for both you and your supporters.
            </p>

            <h2 id="fan-vs-community" className="mt-10 text-2xl font-bold scroll-mt-24">The Fan vs. Community Mindset</h2>
            <h3 className="mt-6 text-xl font-semibold">Traditional Fan Base (Web2)</h3>
            <ul className="space-y-2">
              <li><strong>One-way relationship:</strong> Athletes broadcast, fans consume</li>
              <li><strong>Platform dependency:</strong> Your reach is controlled by Instagram, TikTok, Twitter algorithms</li>
              <li><strong>Passive engagement:</strong> Likes, comments, shares that generate value for platforms, not you</li>
              <li><strong>Limited monetization:</strong> Sponsorships and ads with middlemen taking massive cuts</li>
              <li><strong>No data ownership:</strong> Platforms own your fan relationships and data</li>
            </ul>

            <h3 className="mt-6 text-xl font-semibold">Web3 Community</h3>
            <ul className="space-y-2">
              <li><strong>Two-way ownership:</strong> Community members have a stake in your success</li>
              <li><strong>Direct connection:</strong> No platform can cut you off from your community</li>
              <li><strong>Active participation:</strong> Members contribute, govern, and benefit from community growth</li>
              <li><strong>Multiple revenue streams:</strong> NFTs, tokens, memberships, exclusive access - all direct to you</li>
              <li><strong>Data sovereignty:</strong> You and your community own the data and relationships</li>
            </ul>

            <p className="mt-4">
              The shift is from extractive fandom to collaborative community. Your supporters aren't just watching - they're invested.
            </p>

            <h2 id="why-web3" className="mt-10 text-2xl font-bold scroll-mt-24">Why Web3 Changes Everything for Athletes</h2>

            <div className="space-y-6 mt-6">
              <Card className="border-l-4 border-l-primary shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <h3 className="mt-0 text-lg font-bold flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-sm">1</span>
                    True Digital Ownership
                  </h3>
                  <p className="mt-4">
                    NFTs aren't just JPEGs. They're programmable proof of authenticity and ownership. When you create an NFT of a historic game moment, training session, or exclusive content, you're creating a digital asset that:
                  </p>
                  <ul className="mt-4 space-y-2">
                    <li>• Can't be replicated or devalued by screenshots</li>
                    <li>• Generates royalties every time it's resold</li>
                    <li>• Proves authentic connection to your career</li>
                    <li>• Can grant ongoing access and benefits</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-primary shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <h3 className="mt-0 text-lg font-bold flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-sm">2</span>
                    Community-Driven Value Creation
                  </h3>
                  <p className="mt-4">
                    Tokens align incentives. When your community holds tokens tied to your brand or achievements:
                  </p>
                  <ul className="mt-4 space-y-2">
                    <li>• They benefit when you succeed</li>
                    <li>• They're incentivized to promote and support you</li>
                    <li>• They can participate in decisions about community direction</li>
                    <li>• Early supporters are rewarded for their belief in you</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-primary shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <h3 className="mt-0 text-lg font-bold flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-sm">3</span>
                    Disintermediation = Higher Margins
                  </h3>
                  <p className="mt-4">Traditional sponsorship and merchandise deals involve multiple middlemen:</p>
                  <div className="mt-4 overflow-hidden rounded-lg border border-border">
                    <table className="w-full text-sm">
                      <thead className="bg-muted/50 text-left">
                        <tr>
                          <th className="p-3 font-semibold">Middleman</th>
                          <th className="p-3 font-semibold">Cut</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-t border-border">
                          <td className="p-3">Agencies</td>
                          <td className="p-3">15-30%</td>
                        </tr>
                        <tr className="border-t border-border">
                          <td className="p-3">Platforms</td>
                          <td className="p-3">30-50%</td>
                        </tr>
                        <tr className="border-t border-border">
                          <td className="p-3">Payment processors</td>
                          <td className="p-3">2-5%</td>
                        </tr>
                        <tr className="border-t border-border">
                          <td className="p-3">Retailers (merchandise)</td>
                          <td className="p-3">40-60%</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <p className="mt-4">
                    <strong>Web3 enables direct fan-to-athlete transactions with minimal fees (2-5%), meaning you keep 90%+ of revenue.</strong>
                  </p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-primary shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <h3 className="mt-0 text-lg font-bold flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-sm">4</span>
                    Career Insurance and Longevity
                  </h3>
                  <p className="mt-4">
                    Athletic careers are short. Injuries happen. Performance declines. Web3 lets you build equity that outlasts your playing days. Your community and brand can generate value long after you retire, through:
                  </p>
                  <ul className="mt-4 space-y-2">
                    <li>• Ongoing NFT royalties from historic moments</li>
                    <li>• Community governance and participation</li>
                    <li>• Exclusive access and experiences</li>
                    <li>• Digital legacy preservation</li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            <h2 id="framework" className="mt-10 text-2xl font-bold scroll-mt-24">The 3-Layer Web3 Community Framework</h2>

            <div className="space-y-6 mt-6">
              <div>
                <h3 className="text-xl font-semibold">Layer 1: Foundation - Identity & Access</h3>
                <p className="mt-2">
                  <strong>Goal:</strong> Establish your Web3 presence and create entry points for community members.
                </p>
                <p className="mt-2">
                  <strong>What to build:</strong>
                </p>
                <ul className="mt-2">
                  <li><strong>Free membership NFTs:</strong> Entry ticket to your community (no cost, just wallet connection)</li>
                  <li><strong>Digital collectibles:</strong> Affordable NFTs ($10-50) of moments, highlights, or training content</li>
                  <li><strong>Token-gated Discord/community space:</strong> NFT holders get access to exclusive channels</li>
                </ul>
                <p className="mt-2">
                  <strong>Why it works:</strong> Low barrier to entry builds your community base. These members can be upgraded to higher tiers later.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold">Layer 2: Engagement - Participation & Benefits</h3>
                <p className="mt-2">
                  <strong>Goal:</strong> Create ongoing value and reasons for community members to stay active.
                </p>
                <p className="mt-2">
                  <strong>What to build:</strong>
                </p>
                <ul className="mt-2">
                  <li><strong>Tiered memberships:</strong> Different NFT levels unlock different benefits (VIP events, merchandise, training content)</li>
                  <li><strong>Limited edition drops:</strong> Special NFTs for major milestones (championships, records, career moments)</li>
                  <li><strong>Interactive experiences:</strong> Token-gated live streams, Q&As, training sessions, meet & greets</li>
                  <li><strong>Community governance:</strong> Let NFT holders vote on merchandise designs, charity initiatives, content topics</li>
                </ul>
                <p className="mt-2">
                  <strong>Why it works:</strong> Active participation creates emotional investment. Members feel like stakeholders, not spectators.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold">Layer 3: Ownership - Shared Success</h3>
                <p className="mt-2">
                  <strong>Goal:</strong> Align community incentives with your success.
                </p>
                <p className="mt-2">
                  <strong>What to build:</strong>
                </p>
                <ul className="mt-2">
                  <li><strong>Revenue-sharing NFTs:</strong> Premium NFTs that receive a percentage of future merchandise or content revenue</li>
                  <li><strong>Social tokens:</strong> Personal tokens that increase in value as your career and community grow</li>
                  <li><strong>Fractional ownership:</strong> Let superfans own a piece of significant assets (game-worn items, historic memorabilia)</li>
                  <li><strong>Creator economy tools:</strong> Enable community members to create and monetize fan content, with you receiving royalties</li>
                </ul>
                <p className="mt-2">
                  <strong>Why it works:</strong> Financial alignment creates the strongest form of community. Your success is their success.
                </p>
              </div>
            </div>

            <h2 id="examples" className="mt-10 text-2xl font-bold scroll-mt-24">Real Examples: Athletes Winning in Web3</h2>
            
            <div className="space-y-4 mt-6">
              <div className="rounded-lg border border-border bg-card p-5">
                <h4 className="mb-2 font-semibold">Tom Brady - Autograph</h4>
                <p className="text-sm mb-2">
                  NFL legend Tom Brady co-founded Autograph, an NFT platform enabling athletes to create and sell authenticated digital collectibles directly to fans.
                </p>
                <p className="text-sm">
                  <strong>Key insight:</strong> Brady understood early that his legacy value extends beyond his playing career. NFTs let him monetize historic moments perpetually through royalties.
                </p>
              </div>

              <div className="rounded-lg border border-border bg-card p-5">
                <h4 className="mb-2 font-semibold">Naomi Osaka - Modern Muse</h4>
                <p className="text-sm mb-2">
                  Tennis star Naomi Osaka launched her NFT collection with proceeds benefiting her charitable foundation, showcasing Web3's potential for social impact.
                </p>
                <p className="text-sm">
                  <strong>Key insight:</strong> Web3 enables direct fundraising and community governance for causes athletes care about, cutting out traditional charity overhead.
                </p>
              </div>

              <div className="rounded-lg border border-border bg-card p-5">
                <h4 className="mb-2 font-semibold">Spencer Dinwiddie - Tokenized Contract</h4>
                <p className="text-sm mb-2">
                  NBA player Spencer Dinwiddie attempted to tokenize his contract, allowing fans to invest in his future earnings.
                </p>
                <p className="text-sm">
                  <strong>Key insight:</strong> While the NBA blocked this specific implementation, it demonstrated how Web3 could democratize investment in athlete careers.
                </p>
              </div>
            </div>

            <h2 id="getting-started" className="mt-10 text-2xl font-bold scroll-mt-24">Getting Started: Your First 90 Days</h2>

            <div className="space-y-6 mt-6">
              <Card className="border-l-4 border-l-primary shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <h3 className="mt-0 text-lg font-bold">Month 1: Learn & Prepare</h3>
                  <ul className="mt-4 space-y-2">
                    <li>Set up a crypto wallet (MetaMask, Coinbase Wallet, etc.)</li>
                    <li>Research NFT platforms (OpenSea, Zora, Manifold, Base)</li>
                    <li>Study athletes doing it right</li>
                    <li>Audit your existing content and moments that could be NFTs</li>
                    <li>Survey your current fans about interest in Web3 engagement</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-primary shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <h3 className="mt-0 text-lg font-bold">Month 2: Build & Launch</h3>
                  <ul className="mt-4 space-y-2">
                    <li>Create your first NFT collection (start small - 100-500 pieces)</li>
                    <li>Set up token-gated community space (Discord, Telegram, or dedicated platform)</li>
                    <li>Announce on existing social channels, educate fans on how to participate</li>
                    <li>Host a virtual launch event for NFT holders</li>
                    <li>Document the process transparently (your journey is content)</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-primary shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <h3 className="mt-0 text-lg font-bold">Month 3: Engage & Iterate</h3>
                  <ul className="mt-4 space-y-2">
                    <li>Deliver on promised utilities (exclusive content, events, access)</li>
                    <li>Gather feedback from community on what they value most</li>
                    <li>Plan next collection or utility expansion based on data</li>
                    <li>Experiment with community governance (small decisions first)</li>
                    <li>Measure engagement metrics and revenue compared to traditional channels</li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            <h2 id="faq" className="mt-12 text-2xl font-bold scroll-mt-24">Frequently Asked Questions</h2>
            <div className="space-y-4">
              <div className="rounded-lg border border-border bg-card p-5">
                <h4 className="mb-2 font-semibold">How is this different from just posting on social media?</h4>
                <p className="mb-0 text-sm">
                  Social media platforms own your audience and can change algorithms or ban you overnight. Web3 gives you direct ownership of your community relationships. Plus, your community members become stakeholders with real ownership, not just followers.
                </p>
              </div>
              <div className="rounded-lg border border-border bg-card p-5">
                <h4 className="mb-2 font-semibold">Do my fans need to understand crypto to participate?</h4>
                <p className="mb-0 text-sm">
                  No. Modern Web3 platforms abstract away complexity. Fans can participate with credit cards and email addresses. You educate them gradually as they engage more deeply with your community.
                </p>
              </div>
              <div className="rounded-lg border border-border bg-card p-5">
                <h4 className="mb-2 font-semibold">How much does it cost to get started?</h4>
                <p className="mb-0 text-sm">
                  You can start with minimal investment. Many NFT platforms charge only gas fees (a few dollars) to mint. Some platforms like Zora or Base offer gasless minting. The bigger investment is time to understand the space and build authentic community value.
                </p>
              </div>
              <div className="rounded-lg border border-border bg-card p-5">
                <h4 className="mb-2 font-semibold">What if the market crashes or NFTs lose popularity?</h4>
                <p className="mb-0 text-sm">
                  The underlying technology (blockchain, smart contracts, digital ownership) isn't going away. Even if NFT hype cycles fade, the core value proposition—direct community ownership and disintermediation—remains powerful. Build for community value, not speculation.
                </p>
              </div>
            </div>

            <div className="my-12 rounded-lg border-2 border-primary bg-primary/5 p-8 text-center">
              <h3 className="mt-0 text-xl font-semibold">Ready to Build Your Web3 Community?</h3>
              <p className="mb-6 text-lg">Let's discuss how you can leverage Web3 to create lasting value with your fans.</p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button onClick={() => window.open('https://calendly.com/gabriel-mangabeira/15min', '_blank')}>
                  Work With Me
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