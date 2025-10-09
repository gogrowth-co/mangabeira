import { useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CTASection from "@/components/CTASection";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Clock, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";
import web3AthletesImage from "@/assets/web3-for-athletes.png";

const useSEO = () => {
  useEffect(() => {
    // Set document title
    document.title = "Web3 for Athletes: How to Build a Community, Not Just a Fan Base | Gabriel Mangabeira";
    
    // Set meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Learn how athletes can leverage Web3 to build engaged communities, create sustainable revenue streams, and take control of their digital presence.');
    }

    // Set canonical URL
    const canonicalLink = document.querySelector('link[rel="canonical"]');
    if (canonicalLink) {
      canonicalLink.setAttribute('href', 'https://gabrielmangabeira.com/publications/web3-for-athletes');
    }

    // Open Graph tags
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) {
      ogTitle.setAttribute('content', 'Web3 for Athletes: How to Build a Community, Not Just a Fan Base');
    }

    const ogDescription = document.querySelector('meta[property="og:description"]');
    if (ogDescription) {
      ogDescription.setAttribute('content', 'Learn how athletes can leverage Web3 to build engaged communities, create sustainable revenue streams, and take control of their digital presence.');
    }

    const ogUrl = document.querySelector('meta[property="og:url"]');
    if (ogUrl) {
      ogUrl.setAttribute('content', 'https://gabrielmangabeira.com/publications/web3-for-athletes');
    }

    // Twitter Card tags
    const twitterTitle = document.querySelector('meta[name="twitter:title"]');
    if (twitterTitle) {
      twitterTitle.setAttribute('content', 'Web3 for Athletes: How to Build a Community, Not Just a Fan Base');
    }

    const twitterDescription = document.querySelector('meta[name="twitter:description"]');
    if (twitterDescription) {
      twitterDescription.setAttribute('content', 'Learn how athletes can leverage Web3 to build engaged communities, create sustainable revenue streams, and take control of their digital presence.');
    }

    // JSON-LD Structured Data for Article
    const articleSchema = {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": "Web3 for Athletes: How to Build a Community, Not Just a Fan Base",
      "description": "Learn how athletes can leverage Web3 to build engaged communities, create sustainable revenue streams, and take control of their digital presence.",
      "author": {
        "@type": "Person",
        "name": "Gabriel Mangabeira"
      },
      "datePublished": "2025-01-15",
      "publisher": {
        "@type": "Person",
        "name": "Gabriel Mangabeira"
      }
    };

    const scriptTag = document.createElement('script');
    scriptTag.type = 'application/ld+json';
    scriptTag.text = JSON.stringify(articleSchema);
    document.head.appendChild(scriptTag);

    // Breadcrumb Schema
    const breadcrumbSchema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://gabrielmangabeira.com"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Publications",
          "item": "https://gabrielmangabeira.com/#publications"
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": "Web3 for Athletes",
          "item": "https://gabrielmangabeira.com/publications/web3-for-athletes"
        }
      ]
    };

    const breadcrumbScript = document.createElement('script');
    breadcrumbScript.type = 'application/ld+json';
    breadcrumbScript.text = JSON.stringify(breadcrumbSchema);
    document.head.appendChild(breadcrumbScript);

    return () => {
      document.head.removeChild(scriptTag);
      document.head.removeChild(breadcrumbScript);
    };
  }, []);
};

const Web3ForAthletes = () => {
  useSEO();
  const navigate = useNavigate();

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Article Header */}
      <article className="pt-24 pb-12">
        <div className="max-w-4xl mx-auto px-6">
          {/* Back Button */}
          <Button
            variant="ghost"
            className="mb-8 -ml-4 hover:bg-accent"
            onClick={() => navigate("/#publications")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Publications
          </Button>

          {/* Title */}
          <h1 className="font-hero font-bold text-foreground mb-6" style={{ fontSize: 'clamp(32px, 5vw, 48px)', lineHeight: '1.2' }}>
            Web3 for Athletes: How to Build a Community, Not Just a Fan Base
          </h1>

          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-6 text-muted-foreground mb-8 pb-8 border-b border-border">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span className="text-sm">January 15, 2025</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span className="text-sm">8 min read</span>
            </div>
          </div>

          {/* Featured Image */}
          <div className="mb-12 rounded-lg overflow-hidden">
            <img
              src={web3AthletesImage}
              alt="Web3 for Athletes - Building Communities"
              className="w-full h-auto"
            />
          </div>

          {/* Article Content */}
          <div className="prose prose-lg max-w-none">
            <section id="intro" className="mb-12">
              <p className="text-lg text-foreground/90 leading-relaxed mb-6">
                Fans cheer from the stands. Communities build with you.
              </p>
              <p className="text-lg text-foreground/90 leading-relaxed mb-6">
                As an athlete, your career is built on performance. But what happens when the cheering stops? When the sponsorships dry up? When platforms change their algorithms and your reach plummets overnight?
              </p>
              <p className="text-lg text-foreground/90 leading-relaxed mb-6">
                Traditional fan engagement keeps you trapped in a cycle of dependency - on platforms, on sponsors, on fleeting attention. Web3 offers something different: the tools to build a community that owns their stake in your success.
              </p>
              <p className="text-lg text-foreground/90 leading-relaxed">
                This isn't about chasing crypto trends. It's about sustainable community building that creates real value for both you and your supporters.
              </p>
            </section>

            <section id="fan-vs-community" className="mb-12">
              <h2 className="font-hero font-bold text-foreground mb-6" style={{ fontSize: 'clamp(24px, 3vw, 32px)', lineHeight: '1.3' }}>
                The Fan vs. Community Mindset
              </h2>
              
              <h3 className="font-hero font-semibold text-foreground mb-4 text-xl">
                Traditional Fan Base (Web2)
              </h3>
              <ul className="space-y-3 mb-6 text-foreground/90">
                <li className="flex items-start">
                  <span className="mr-3 text-primary">•</span>
                  <span><strong>One-way relationship:</strong> Athletes broadcast, fans consume</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-3 text-primary">•</span>
                  <span><strong>Platform dependency:</strong> Your reach is controlled by Instagram, TikTok, Twitter algorithms</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-3 text-primary">•</span>
                  <span><strong>Passive engagement:</strong> Likes, comments, shares that generate value for platforms, not you</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-3 text-primary">•</span>
                  <span><strong>Limited monetization:</strong> Sponsorships and ads with middlemen taking massive cuts</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-3 text-primary">•</span>
                  <span><strong>No data ownership:</strong> Platforms own your fan relationships and data</span>
                </li>
              </ul>

              <h3 className="font-hero font-semibold text-foreground mb-4 text-xl">
                Web3 Community
              </h3>
              <ul className="space-y-3 mb-6 text-foreground/90">
                <li className="flex items-start">
                  <span className="mr-3 text-primary">•</span>
                  <span><strong>Two-way ownership:</strong> Community members have a stake in your success</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-3 text-primary">•</span>
                  <span><strong>Direct connection:</strong> No platform can cut you off from your community</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-3 text-primary">•</span>
                  <span><strong>Active participation:</strong> Members contribute, govern, and benefit from community growth</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-3 text-primary">•</span>
                  <span><strong>Multiple revenue streams:</strong> NFTs, tokens, memberships, exclusive access - all direct to you</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-3 text-primary">•</span>
                  <span><strong>Data sovereignty:</strong> You and your community own the data and relationships</span>
                </li>
              </ul>

              <p className="text-lg text-foreground/90 leading-relaxed">
                The shift is from extractive fandom to collaborative community. Your supporters aren't just watching - they're invested.
              </p>
            </section>

            <section id="why-web3" className="mb-12">
              <h2 className="font-hero font-bold text-foreground mb-6" style={{ fontSize: 'clamp(24px, 3vw, 32px)', lineHeight: '1.3' }}>
                Why Web3 Changes Everything for Athletes
              </h2>

              <div className="space-y-8">
                <div>
                  <h3 className="font-hero font-semibold text-foreground mb-3 text-xl">
                    1. True Digital Ownership
                  </h3>
                  <p className="text-foreground/90 leading-relaxed mb-4">
                    NFTs aren't just JPEGs. They're programmable proof of authenticity and ownership. When you create an NFT of a historic game moment, training session, or exclusive content, you're creating a digital asset that:
                  </p>
                  <ul className="space-y-2 text-foreground/90 ml-6">
                    <li className="flex items-start">
                      <span className="mr-3">•</span>
                      <span>Can't be replicated or devalued by screenshots</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-3">•</span>
                      <span>Generates royalties every time it's resold</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-3">•</span>
                      <span>Proves authentic connection to your career</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-3">•</span>
                      <span>Can grant ongoing access and benefits</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-hero font-semibold text-foreground mb-3 text-xl">
                    2. Community-Driven Value Creation
                  </h3>
                  <p className="text-foreground/90 leading-relaxed mb-4">
                    Tokens align incentives. When your community holds tokens tied to your brand or achievements:
                  </p>
                  <ul className="space-y-2 text-foreground/90 ml-6">
                    <li className="flex items-start">
                      <span className="mr-3">•</span>
                      <span>They benefit when you succeed</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-3">•</span>
                      <span>They're incentivized to promote and support you</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-3">•</span>
                      <span>They can participate in decisions about community direction</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-3">•</span>
                      <span>Early supporters are rewarded for their belief in you</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-hero font-semibold text-foreground mb-3 text-xl">
                    3. Disintermediation = Higher Margins
                  </h3>
                  <p className="text-foreground/90 leading-relaxed mb-4">
                    Traditional sponsorship and merchandise deals involve multiple middlemen:
                  </p>
                  <ul className="space-y-2 text-foreground/90 ml-6 mb-4">
                    <li className="flex items-start">
                      <span className="mr-3">•</span>
                      <span>Agencies (15-30% cut)</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-3">•</span>
                      <span>Platforms (30-50% cut)</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-3">•</span>
                      <span>Payment processors (2-5% cut)</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-3">•</span>
                      <span>Retailers (40-60% cut for merchandise)</span>
                    </li>
                  </ul>
                  <p className="text-foreground/90 leading-relaxed">
                    Web3 enables direct fan-to-athlete transactions with minimal fees (typically 2-5% on NFT platforms), meaning you keep 90%+ of revenue.
                  </p>
                </div>

                <div>
                  <h3 className="font-hero font-semibold text-foreground mb-3 text-xl">
                    4. Career Insurance and Longevity
                  </h3>
                  <p className="text-foreground/90 leading-relaxed">
                    Athletic careers are short. Injuries happen. Performance declines. Web3 lets you build equity that outlasts your playing days. Your community and brand can generate value long after you retire, through:
                  </p>
                  <ul className="space-y-2 text-foreground/90 ml-6">
                    <li className="flex items-start">
                      <span className="mr-3">•</span>
                      <span>Ongoing NFT royalties from historic moments</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-3">•</span>
                      <span>Community governance and participation</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-3">•</span>
                      <span>Exclusive access and experiences</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-3">•</span>
                      <span>Digital legacy preservation</span>
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            <section id="framework" className="mb-12">
              <h2 className="font-hero font-bold text-foreground mb-6" style={{ fontSize: 'clamp(24px, 3vw, 32px)', lineHeight: '1.3' }}>
                The 3-Layer Web3 Community Framework
              </h2>

              <div className="space-y-8">
                <div>
                  <h3 className="font-hero font-semibold text-foreground mb-3 text-xl">
                    Layer 1: Foundation - Identity & Access
                  </h3>
                  <p className="text-foreground/90 leading-relaxed mb-4">
                    <strong>Goal:</strong> Establish your Web3 presence and create entry points for community members.
                  </p>
                  <p className="text-foreground/90 leading-relaxed mb-4">
                    <strong>What to build:</strong>
                  </p>
                  <ul className="space-y-2 text-foreground/90 ml-6 mb-4">
                    <li className="flex items-start">
                      <span className="mr-3">•</span>
                      <span><strong>Free membership NFTs:</strong> Entry ticket to your community (no cost, just wallet connection)</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-3">•</span>
                      <span><strong>Digital collectibles:</strong> Affordable NFTs ($10-50) of moments, highlights, or training content</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-3">•</span>
                      <span><strong>Token-gated Discord/community space:</strong> NFT holders get access to exclusive channels</span>
                    </li>
                  </ul>
                  <p className="text-foreground/90 leading-relaxed">
                    <strong>Why it works:</strong> Low barrier to entry builds your community base. These members can be upgraded to higher tiers later.
                  </p>
                </div>

                <div>
                  <h3 className="font-hero font-semibold text-foreground mb-3 text-xl">
                    Layer 2: Engagement - Participation & Benefits
                  </h3>
                  <p className="text-foreground/90 leading-relaxed mb-4">
                    <strong>Goal:</strong> Create ongoing value and reasons for community members to stay active.
                  </p>
                  <p className="text-foreground/90 leading-relaxed mb-4">
                    <strong>What to build:</strong>
                  </p>
                  <ul className="space-y-2 text-foreground/90 ml-6 mb-4">
                    <li className="flex items-start">
                      <span className="mr-3">•</span>
                      <span><strong>Tiered memberships:</strong> Different NFT levels unlock different benefits (VIP events, merchandise, training content)</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-3">•</span>
                      <span><strong>Limited edition drops:</strong> Special NFTs for major milestones (championships, records, career moments)</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-3">•</span>
                      <span><strong>Interactive experiences:</strong> Token-gated live streams, Q&As, training sessions, meet & greets</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-3">•</span>
                      <span><strong>Community governance:</strong> Let NFT holders vote on merchandise designs, charity initiatives, content topics</span>
                    </li>
                  </ul>
                  <p className="text-foreground/90 leading-relaxed">
                    <strong>Why it works:</strong> Active participation creates emotional investment. Members feel like stakeholders, not spectators.
                  </p>
                </div>

                <div>
                  <h3 className="font-hero font-semibold text-foreground mb-3 text-xl">
                    Layer 3: Ownership - Shared Success
                  </h3>
                  <p className="text-foreground/90 leading-relaxed mb-4">
                    <strong>Goal:</strong> Align community incentives with your success.
                  </p>
                  <p className="text-foreground/90 leading-relaxed mb-4">
                    <strong>What to build:</strong>
                  </p>
                  <ul className="space-y-2 text-foreground/90 ml-6 mb-4">
                    <li className="flex items-start">
                      <span className="mr-3">•</span>
                      <span><strong>Revenue-sharing NFTs:</strong> Premium NFTs that receive a percentage of future merchandise or content revenue</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-3">•</span>
                      <span><strong>Social tokens:</strong> Personal tokens that increase in value as your career and community grow</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-3">•</span>
                      <span><strong>Fractional ownership:</strong> Let superfans own a piece of significant assets (game-worn items, historic memorabilia)</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-3">•</span>
                      <span><strong>Creator economy tools:</strong> Enable community members to create and monetize fan content, with you receiving royalties</span>
                    </li>
                  </ul>
                  <p className="text-foreground/90 leading-relaxed">
                    <strong>Why it works:</strong> Financial alignment creates the strongest form of community. Your success is their success.
                  </p>
                </div>
              </div>
            </section>

            <section id="getting-started" className="mb-12">
              <h2 className="font-hero font-bold text-foreground mb-6" style={{ fontSize: 'clamp(24px, 3vw, 32px)', lineHeight: '1.3' }}>
                Getting Started: Your First 90 Days
              </h2>

              <div className="space-y-6">
                <div>
                  <h3 className="font-hero font-semibold text-foreground mb-3 text-xl">
                    Month 1: Learn & Prepare
                  </h3>
                  <ul className="space-y-2 text-foreground/90 ml-6">
                    <li className="flex items-start">
                      <span className="mr-3">•</span>
                      <span>Set up a crypto wallet (MetaMask, Coinbase Wallet, etc.)</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-3">•</span>
                      <span>Research NFT platforms (OpenSea, Zora, Manifold, Base)</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-3">•</span>
                      <span>Study athletes doing it right (see examples below)</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-3">•</span>
                      <span>Audit your existing content and moments that could be NFTs</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-3">•</span>
                      <span>Survey your current fans about interest in Web3 engagement</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-hero font-semibold text-foreground mb-3 text-xl">
                    Month 2: Build & Launch
                  </h3>
                  <ul className="space-y-2 text-foreground/90 ml-6">
                    <li className="flex items-start">
                      <span className="mr-3">•</span>
                      <span>Create your first NFT collection (start small - 100-500 pieces)</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-3">•</span>
                      <span>Set up token-gated community space (Discord, Telegram, or dedicated platform)</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-3">•</span>
                      <span>Announce on existing social channels, educate fans on how to participate</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-3">•</span>
                      <span>Host a virtual launch event for NFT holders</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-3">•</span>
                      <span>Document the process transparently (your journey is content)</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-hero font-semibold text-foreground mb-3 text-xl">
                    Month 3: Engage & Iterate
                  </h3>
                  <ul className="space-y-2 text-foreground/90 ml-6">
                    <li className="flex items-start">
                      <span className="mr-3">•</span>
                      <span>Deliver on promised utilities (exclusive content, events, access)</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-3">•</span>
                      <span>Gather feedback from community on what they value most</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-3">•</span>
                      <span>Plan next collection or utility expansion based on data</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-3">•</span>
                      <span>Experiment with community governance (small decisions first)</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-3">•</span>
                      <span>Measure engagement metrics and revenue compared to traditional channels</span>
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            <section id="conclusion" className="mb-12">
              <h2 className="font-hero font-bold text-foreground mb-6" style={{ fontSize: 'clamp(24px, 3vw, 32px)', lineHeight: '1.3' }}>
                The Opportunity Is Now
              </h2>
              <p className="text-lg text-foreground/90 leading-relaxed mb-6">
                We're in the early innings of athlete-led Web3 communities. The athletes who build now will have first-mover advantage and deeper community relationships when mainstream adoption accelerates.
              </p>
              <p className="text-lg text-foreground/90 leading-relaxed mb-6">
                This isn't about replacing traditional sponsorships or social media. It's about adding a layer of direct community ownership that makes your brand more resilient and your income more diversified.
              </p>
              <p className="text-lg text-foreground/90 leading-relaxed mb-6">
                Start small. Learn as you build. Treat your community like co-owners, because in Web3, they are.
              </p>
              <p className="text-lg text-foreground/90 leading-relaxed">
                The question isn't whether athletes will embrace Web3. It's whether you'll be early or late to the game.
              </p>
            </section>
          </div>
        </div>
      </article>

      <CTASection />
      <Footer />
    </div>
  );
};

export default Web3ForAthletes;