import React from "react";
import { Link } from "react-router-dom";
import heroCover from "@/assets/web2-vs-web3-cover.png";
import authorAvatar from "@/assets/gabriel-headshot.webp";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ExternalLink, ArrowLeft } from "lucide-react";

const title = "Web2 vs Web3 Marketing: Why Ownership Beats Attention";
const description =
  "A practical breakdown of the shift from renting attention to building ownership — with examples, principles, and a simple framework.";

function useSEO() {
  React.useEffect(() => {
    const url = `${window.location.origin}/publications/web2-vs-web3-marketing`;

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
      author: { '@type': 'Person', name: 'Gabriel Mangabeira', jobTitle: 'Growth Marketing Manager' },
      datePublished: '2025-10-01',
      dateModified: '2025-10-01',
      mainEntityOfPage: url,
      description,
      wordCount: 2800,
      timeRequired: 'PT8M',
    };

    const faqLd = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'What is the main difference between Web2 and Web3 marketing?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Web2 marketing focuses on capturing attention through centralized platforms where companies own user data. Web3 marketing emphasizes community ownership, where users control their data and become stakeholders through tokens.',
          },
        },
        {
          '@type': 'Question',
          name: 'How can traditional marketers transition to Web3?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Start by experiencing Web3 firsthand: create a wallet, join a DAO, and mint an NFT. Then build on-chain attribution, learn tokenomics basics, and run small experiments with token-gated content.',
          },
        },
        {
          '@type': 'Question',
          name: 'Do I need to abandon Web2 marketing for Web3?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'No. The most effective approach is hybrid: use Web2 for awareness and reach, while implementing Web3 principles for retention and community building. Brands like Nike and Starbucks successfully blend both.',
          },
        },
      ],
    };

    const breadcrumbLd = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: `${window.location.origin}/` },
        { '@type': 'ListItem', position: 2, name: 'Publications', item: `${window.location.origin}/#publications` },
        { '@type': 'ListItem', position: 3, name: 'Web2 vs Web3 Marketing' },
      ],
    };

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

function useScrollProgress() {
  const [progress, setProgress] = React.useState(0);
  React.useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement;
      const scrollTop = doc.scrollTop;
      const height = doc.scrollHeight - doc.clientHeight;
      const value = height > 0 ? Math.min(100, Math.max(0, (scrollTop / height) * 100)) : 0;
      setProgress(value);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return progress;
}

const Pill = ({ children }: { children: React.ReactNode }) => (
  <span className="inline-flex items-center rounded-full border border-border bg-muted/40 px-3 py-1 text-xs font-medium text-muted-foreground">
    {children}
  </span>
);

export default function Web2VsWeb3Marketing() {
  useSEO();
  const progress = useScrollProgress();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto w-full max-w-6xl px-4">
          <div className="flex items-center justify-between py-3">
            <Link to="/#publications" className="flex items-center gap-2 text-sm font-medium hover:text-primary">
              <ArrowLeft className="h-4 w-4" />
              Back to Publications
            </Link>
            <div className="w-40">
              <Progress value={progress} />
            </div>
          </div>
        </div>
      </header>

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
                  className="h-12 w-12 rounded-full object-cover"
                  loading="lazy"
                />
                <div className="leading-tight">
                  <div className="font-medium">Gabriel Mangabeira</div>
                  <div className="text-sm text-muted-foreground">Olympian → Coca-Cola → Neil Patel → Binance</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Pill>8 min read</Pill>
                <Pill>Updated Oct 2025</Pill>
              </div>
            </div>

            <figure className="mt-8 overflow-hidden rounded-lg border border-border">
              <img
                src={heroCover}
                alt="Split-screen concept: Web2 ads vs Web3 ownership networks"
                loading="lazy"
                className="h-auto w-full object-cover"
              />
            </figure>
          </header>

          <section className="prose prose-neutral dark:prose-invert max-w-none">
            <p className="text-lg text-muted-foreground">
              When I transitioned from professional swimming to marketing, I learned that discipline isn't about doing more—it's about doing what matters. In the pool, every stroke counts. In Web2 marketing, every click counted. But in Web3, every relationship counts more than any metric.
            </p>
            <p className="text-lg text-muted-foreground">
              Marketing isn't dying—it's evolving from capturing attention to building ownership. And that changes everything.
            </p>

            <h2 className="mt-10">The Fundamental Architecture: Two Different Worlds</h2>
            <p>
              Marketing is evolving from capturing attention to building ownership. Web2 optimized for reach on
              centralized platforms; Web3 optimizes for direct, verifiable relationships with stakeholders.
            </p>

            <Tabs defaultValue="web2" className="my-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="web2">Web2: Platform Economy</TabsTrigger>
                <TabsTrigger value="web3">Web3: Ownership Economy</TabsTrigger>
              </TabsList>
              <TabsContent value="web2" className="mt-4">
                <ul className="space-y-2">
                  <li>📊 Centralized data — platforms own everything</li>
                  <li>💰 Algorithmic distribution — pay to play</li>
                  <li>🔒 Intermediary-dependent — no direct access</li>
                  <li>📉 Data extraction model — users are the product</li>
                </ul>
              </TabsContent>
              <TabsContent value="web3" className="mt-4">
                <ul className="space-y-2">
                  <li>🔓 Decentralized data — users own wallets and identity</li>
                  <li>🤝 Direct relationships — no middlemen</li>
                  <li>✅ Transparent verification — on-chain proof</li>
                  <li>📈 Value co-creation — users become stakeholders</li>
                </ul>
              </TabsContent>
            </Tabs>

            <p>
              For two decades, marketing meant renting attention on someone else's platform. Facebook owned your audience. Google controlled your visibility. You paid to reach people you couldn't truly own.
            </p>
            <p>
              Web3 flips this. Instead of renting attention, you build relationships with stakeholders. Instead of paying platforms, you reward communities for contribution.
            </p>

            <div className="my-8 rounded-lg border-l-4 border-primary bg-muted/50 p-6">
              <h3 className="mt-0 text-base font-semibold">💡 Key Insight</h3>
              <p className="mb-0">
                82% of Web3 marketers report positive ROI from community ownership models, with 2–4x efficiency gains
                versus traditional campaigns.
              </p>
            </div>

            <h2 className="mt-10">Real Example: Starbucks Odyssey</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-lg border border-border bg-card p-5">
                <h4 className="mb-3 text-sm font-semibold">← Traditional rewards (Web2)</h4>
                <ul className="space-y-1.5 text-sm">
                  <li>• Earn stars through purchases</li>
                  <li>• Locked in ecosystem</li>
                  <li>• No transferability</li>
                  <li>• Company controls terms</li>
                </ul>
              </div>
              <div className="rounded-lg border border-border bg-card p-5">
                <h4 className="mb-3 text-sm font-semibold">→ Starbucks Odyssey (Web3)</h4>
                <ul className="space-y-1.5 text-sm">
                  <li>• Earn NFT "journey stamps"</li>
                  <li>• True ownership</li>
                  <li>• Tradeable on markets</li>
                  <li>• Community-driven value</li>
                </ul>
              </div>
            </div>

            <p className="mt-6">
              The result? Loyalty becomes tangible. Engagement becomes an asset. Customers become advocates because they own a piece of the story.
            </p>
            <p>
              This isn't about replacing loyalty programs with tokens. It's asking: What if customers could own their relationship with your brand?
            </p>

            <h2 className="mt-10">The Philosophy Shift: Attention → Ownership</h2>
            <div className="overflow-hidden rounded-lg border border-border">
              <table className="w-full text-sm">
                <thead className="bg-muted/50 text-left">
                  <tr>
                    <th className="p-3 font-semibold">Mindset</th>
                    <th className="p-3 font-semibold">Web2</th>
                    <th className="p-3 font-semibold">Web3</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-border">
                    <td className="p-3">Goal</td>
                    <td className="p-3">Extract value</td>
                    <td className="p-3">Co-create value</td>
                  </tr>
                  <tr className="border-t border-border">
                    <td className="p-3">User is…</td>
                    <td className="p-3">Customer</td>
                    <td className="p-3">Stakeholder</td>
                  </tr>
                  <tr className="border-t border-border">
                    <td className="p-3">Success =</td>
                    <td className="p-3">Conversion</td>
                    <td className="p-3">Ownership</td>
                  </tr>
                  <tr className="border-t border-border">
                    <td className="p-3">Timeline</td>
                    <td className="p-3">Quarterly</td>
                    <td className="p-3">Long-term</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <blockquote className="my-6 border-l-4 border-primary pl-4 italic">
              Web2 assumption: Attention is scarce, capture and monetize it.
              <br />
              Web3 assumption: Ownership is powerful, distribute and nurture it.
            </blockquote>

            <p>
              When you give people real ownership—not points, but tradeable value—they don't just engage differently. They think differently. They become evangelists, strategists, and builders. Because now, it's their project too.
            </p>

            <h2 className="mt-10">5 Core Principles Marketers Must Learn</h2>

            <div className="space-y-6">
              <div className="rounded-lg border border-border bg-card p-6">
                <h3 className="mt-0 text-lg font-bold">1. Transparency Is Non-Negotiable</h3>
                <p>
                  In Web2, we crafted narratives. In Web3, we prove them. Every claim can be verified on-chain. If you say "70% of tokens go to community," anyone can check the blockchain.
                </p>
                <p className="mb-0 text-sm font-medium text-primary">
                  Action: Practice radical transparency. Share real numbers. Let the community verify your claims.
                </p>
              </div>

              <div className="rounded-lg border border-border bg-card p-6">
                <h3 className="mt-0 text-lg font-bold">2. Community Is Your Distribution</h3>
                <p>
                  The best Web3 projects don't have traditional marketing departments. They have communities that organically promote because they have economic alignment (tokens) and emotional alignment (shared mission).
                </p>
                <div className="my-4 rounded-lg bg-muted/50 p-4 text-center">
                  <p className="mb-0 text-sm font-semibold">
                    📊 Web3 projects with active communities see 4x higher user retention vs. traditional models
                  </p>
                </div>
                <p className="mb-0 text-sm font-medium text-primary">
                  Action: Ask "How can our community market this?" before "How can we market this?"
                </p>
              </div>

              <div className="rounded-lg border border-border bg-card p-6">
                <h3 className="mt-0 text-lg font-bold">3. Incentive Design &gt; Campaign Design</h3>
                <p>
                  Instead of spending $100K on ads, some Web3 projects distribute $100K in tokens to early contributors who create content, report bugs, or participate in governance.
                </p>
                <p>
                  Traditional ads rent attention temporarily. Token incentives create long-term stakeholders.
                </p>
                <p className="mb-0 text-sm font-medium text-primary">
                  Action: Learn basic tokenomics. Reward contribution, not just consumption.
                </p>
              </div>

              <div className="rounded-lg border border-border bg-card p-6">
                <h3 className="mt-0 text-lg font-bold">4. Data Privacy Is a Feature</h3>
                <p>
                  You might only know someone's wallet address, but you know exactly what they've done on-chain: tokens held, protocols used, NFTs collected, DAOs joined.
                </p>
                <p>
                  Behavioral targeting based on on-chain activity is more predictive than demographic targeting.
                </p>
                <p className="mb-0 text-sm font-medium text-primary">
                  Action: Shift from demographic (who they are) to behavioral (what they do on-chain) targeting.
                </p>
              </div>

              <div className="rounded-lg border border-border bg-card p-6">
                <h3 className="mt-0 text-lg font-bold">5. Long-Term Thinking Wins</h3>
                <p>
                  Web2 optimizes for quarters. Web3 optimizes for decades.
                </p>
                <p>
                  You're not building a customer base—you're building an ecosystem that can outlive your company.
                </p>
                <p className="mb-0 text-sm font-medium text-primary">
                  Action: Track community health, holder retention, and network effects—not just acquisition.
                </p>
              </div>
            </div>

            <h2 className="mt-12">The Hybrid Future: Best of Both Worlds</h2>
            <p>The smartest brands don't choose—they blend.</p>

            <div className="my-6 grid gap-6 sm:grid-cols-2">
              <div className="rounded-lg border border-border bg-card p-5">
                <h4 className="mb-3 font-semibold">Use Web2 for:</h4>
                <ul className="space-y-1.5 text-sm">
                  <li>✓ Education &amp; awareness</li>
                  <li>✓ Mainstream reach</li>
                  <li>✓ Paid acquisition</li>
                  <li>✓ Content at scale</li>
                </ul>
              </div>
              <div className="rounded-lg border border-border bg-card p-5">
                <h4 className="mb-3 font-semibold">Use Web3 for:</h4>
                <ul className="space-y-1.5 text-sm">
                  <li>✓ Deep engagement</li>
                  <li>✓ Long-term retention</li>
                  <li>✓ Transparent incentives</li>
                  <li>✓ Network effects</li>
                </ul>
              </div>
            </div>

            <h3>Nike's Approach</h3>
            <p>
              Nike didn't abandon Instagram ads. They added .SWOOSH (their Web3 platform) for superfans. Web2 brings them in. Web3 keeps them invested.
            </p>

            <div className="my-8 rounded-lg border-l-4 border-primary bg-muted/50 p-6">
              <p className="mb-0 text-sm font-semibold">
                Over 1M AI agents expected on blockchain networks by end of 2025—marketing to non-humans is coming faster than you think.
              </p>
            </div>

            <p>
              <strong>The AI Layer:</strong> AI bridges Web2 and Web3, enabling on-chain analytics, churn prediction, fraud detection, and personalization while respecting privacy.
            </p>

            <h2 className="mt-12">What This Means For You</h2>

            <h3>For Marketing Leaders</h3>
            <div className="overflow-hidden rounded-lg border border-border">
              <table className="w-full text-sm">
                <thead className="bg-muted/50 text-left">
                  <tr>
                    <th className="p-3 font-semibold">0-6 Months</th>
                    <th className="p-3 font-semibold">6-12 Months</th>
                    <th className="p-3 font-semibold">12-24 Months</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-border align-top">
                    <td className="p-3">
                      <ul className="list-disc space-y-1 pl-5">
                        <li>Get a wallet</li>
                        <li>Join a DAO</li>
                        <li>Hire/train</li>
                      </ul>
                    </td>
                    <td className="p-3">
                      <ul className="list-disc space-y-1 pl-5">
                        <li>Build on-chain attribution</li>
                        <li>Run 1 experiment</li>
                        <li>Prep for AI agents</li>
                      </ul>
                    </td>
                    <td className="p-3">
                      <ul className="list-disc space-y-1 pl-5">
                        <li>Design ownership model</li>
                        <li>Launch token-gated pilot</li>
                        <li>Implement hybrid metrics</li>
                      </ul>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h3 className="mt-8">For Individual Marketers</h3>
            <p>
              Your existing skills aren't obsolete—they're foundational. Knowing how to craft messages, analyze funnels, and build relationships? That's still 80% of the job.
            </p>

            <h4>Add to your skillset:</h4>
            <ul className="space-y-2">
              <li>□ Basic blockchain literacy (wallets, smart contracts, DAOs)</li>
              <li>□ On-chain analytics (Dune, Nansen, Formo)</li>
              <li>□ Community management 2.0 (Discord, governance)</li>
              <li>□ AI fundamentals (segmentation, prediction, fraud detection)</li>
            </ul>

            <div className="my-8 rounded-lg bg-primary/10 p-6 text-center">
              <p className="mb-0 italic">
                When I made this transition, I felt like a beginner again. That discomfort was the point. The marketers who thrive aren't the ones who resist change—they're the ones who stay curious.
              </p>
            </div>

            <h2 className="mt-12">The Bottom Line</h2>
            <div className="overflow-hidden rounded-lg border border-border">
              <table className="w-full text-sm">
                <tbody>
                  <tr className="border-b border-border">
                    <td className="p-3 font-semibold">Web1 (1990s)</td>
                    <td className="p-3">Information Broadcasting</td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="p-3 font-semibold">Web2 (2000s-2020s)</td>
                    <td className="p-3">Engagement Optimization</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold">Web3 (2020s+)</td>
                    <td className="p-3">Ownership Alignment</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="mt-6">
              The shift from Web2 to Web3 isn't just about technology. It's about rediscovering what marketing should have been all along: creating genuine value for real people.
            </p>

            <h3>What Stays the Same:</h3>
            <ul>
              <li>Know your audience deeply</li>
              <li>Communicate with clarity</li>
              <li>Build trust through consistency</li>
              <li>Create more value than you capture</li>
            </ul>

            <h3>What Must Change:</h3>
            <p>
              You can't optimize for ownership the way you optimized for attention. You can't measure Web3 value with Web2 metrics.
            </p>

            <blockquote className="my-6 border-l-4 border-primary pl-4 text-lg font-medium italic">
              "The future belongs to marketers who respect what worked AND embrace what's emerging."
              <footer className="mt-2 text-sm font-normal not-italic">— Gabriel Mangabeira</footer>
            </blockquote>

            <h2 className="mt-12">Start Here: Your First Steps</h2>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-lg border border-border bg-card p-5">
                <h4 className="mb-2 font-semibold">1. Experience It</h4>
                <ul className="mb-4 space-y-1 text-sm">
                  <li>• Download MetaMask</li>
                  <li>• Join a DAO</li>
                  <li>• Mint a free NFT</li>
                </ul>
                <Button variant="outline" size="sm" className="w-full">
                  Start Now →
                </Button>
              </div>
              <div className="rounded-lg border border-border bg-card p-5">
                <h4 className="mb-2 font-semibold">2. Follow Signal</h4>
                <ul className="mb-4 space-y-1 text-sm">
                  <li>• The Defiant</li>
                  <li>• Bankless</li>
                  <li>• a16z crypto</li>
                </ul>
                <Button variant="outline" size="sm" className="w-full">
                  Subscribe →
                </Button>
              </div>
              <div className="rounded-lg border border-border bg-card p-5">
                <h4 className="mb-2 font-semibold">3. Experiment</h4>
                <ul className="mb-4 space-y-1 text-sm">
                  <li>• Token-gate content</li>
                  <li>• Create comm wallet</li>
                  <li>• Launch small NFT</li>
                </ul>
                <Button variant="outline" size="sm" className="w-full">
                  Try It →
                </Button>
              </div>
            </div>

            <h2 className="mt-12">Frequently Asked Questions</h2>
            <div className="space-y-4">
              <div className="rounded-lg border border-border bg-card p-5">
                <h4 className="mb-2 font-semibold">1. What is the main difference between Web2 and Web3 marketing?</h4>
                <p className="mb-0 text-sm">
                  Web2 marketing focuses on capturing attention through centralized platforms where companies own user data. Web3 marketing emphasizes community ownership, where users control their data and become stakeholders through tokens.
                </p>
              </div>
              <div className="rounded-lg border border-border bg-card p-5">
                <h4 className="mb-2 font-semibold">2. How can traditional marketers transition to Web3?</h4>
                <p className="mb-0 text-sm">
                  Start by experiencing Web3 firsthand: create a wallet, join a DAO, and mint an NFT. Then build on-chain attribution, learn tokenomics basics, and run small experiments with token-gated content.
                </p>
              </div>
              <div className="rounded-lg border border-border bg-card p-5">
                <h4 className="mb-2 font-semibold">3. Do I need to abandon Web2 marketing for Web3?</h4>
                <p className="mb-0 text-sm">
                  No. The most effective approach is hybrid: use Web2 for awareness and reach, while implementing Web3 principles for retention and community building. Brands like Nike and Starbucks successfully blend both.
                </p>
              </div>
            </div>

            <div className="my-12 rounded-lg border-2 border-primary bg-primary/5 p-8 text-center">
              <h3 className="mt-0">Ready to Dive Deeper?</h3>
              <p className="mb-6 text-lg">What's your biggest question about Web3 marketing?</p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button>Drop a Comment</Button>
                <Button variant="outline">
                  Connect on X <ExternalLink className="ml-2 h-4 w-4" />
                </Button>
              </div>
              <p className="mb-0 mt-4 text-sm italic text-muted-foreground">
                Let's figure this out together. That's how Web3 works—in community.
              </p>
            </div>
          </section>
        </article>
      </main>
    </div>
  );
}
