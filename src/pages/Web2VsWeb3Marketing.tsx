import React from "react";
import heroCover from "@/assets/web2-vs-web3-cover.png";
import authorAvatar from "@/assets/gabriel-headshot.webp";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const title = "Web2 vs Web3 Marketing: Why Ownership Beats Attention";
const description=
  "A practical breakdown of the shift from renting attention to building ownership — with examples, principles, and a simple framework.";

function useSEO() {
  React.useEffect(() => {
    const url = `${window.location.origin}/publications/web2-vs-web3-marketing`;

    document.title = title;

    const ensure = (tagName: string, attrs: Record<string, string>) => {
      let el = document.querySelector<HTMLElement>(
        `${tagName}${attrs.name ? `[name=\"${attrs.name}\"]` : attrs.property ? `[property=\"${attrs.property}\"]` : ""}`,
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

    const metas: HTMLElement[] = [];
    metas.push(ensure("meta", { name: "description", content: description }));
    metas.push(ensure("link", { rel: "canonical", href: url }));

    // Open Graph
    metas.push(ensure("meta", { property: "og:type", content: "article" }));
    metas.push(ensure("meta", { property: "og:title", content: title }));
    metas.push(ensure("meta", { property: "og:description", content: description }));
    metas.push(ensure("meta", { property: "og:url", content: url }));
    metas.push(ensure("meta", { property: "og:image", content: heroCover }));

    // Twitter
    metas.push(ensure("meta", { name: "twitter:card", content: "summary_large_image" }));
    metas.push(ensure("meta", { name: "twitter:title", content: title }));
    metas.push(ensure("meta", { name: "twitter:description", content: description }));
    metas.push(ensure("meta", { name: "twitter:image", content: heroCover }));

    // Structured data
    const articleLd = {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: title,
      image: [heroCover],
      author: { '@type': 'Person', name: 'Gabriel Mangabeira' },
      datePublished: '2025-10-01',
      dateModified: '2025-10-01',
      mainEntityOfPage: url,
      description,
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

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(articleLd);
    document.head.appendChild(script);

    const script2 = document.createElement('script');
    script2.type = 'application/ld+json';
    script2.textContent = JSON.stringify(breadcrumbLd);
    document.head.appendChild(script2);

    return () => {
      // Clean up only the JSON-LD scripts we added. Keep common meta tags.
      script.remove();
      script2.remove();
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
            <h1 className="text-base font-semibold">Article</h1>
            <div className="w-40">
              <Progress value={progress} />
            </div>
          </div>
        </div>
      </header>

      <main>
        <article className="mx-auto w-full max-w-3xl px-4 py-8 md:py-12">
          <header className="mb-8 md:mb-10">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              {title}
            </h1>
            <p className="mt-3 max-w-prose text-muted-foreground">{description}</p>

            <div className="mt-5 flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-3">
                <img
                  src={authorAvatar}
                  alt="Gabriel Mangabeira headshot"
                  className="h-10 w-10 rounded-full object-cover"
                  loading="lazy"
                />
                <div className="leading-tight">
                  <div className="text-sm font-medium">Gabriel Mangabeira</div>
                  <div className="text-xs text-muted-foreground">Olympian → Coca-Cola → Neil Patel → Binance</div>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Pill>8 min read</Pill>
                <Pill>Updated Oct 2025</Pill>
              </div>
            </div>

            <figure className="mt-6 overflow-hidden rounded-lg border border-border">
              <img
                src={heroCover}
                alt="Split-screen concept: Web2 ads vs Web3 ownership networks"
                loading="lazy"
                className="h-auto w-full object-cover"
              />
              <figcaption className="sr-only">From renting attention to building ownership.</figcaption>
            </figure>
          </header>

          <section className="prose prose-neutral dark:prose-invert max-w-none">
            <h2>The Fundamental Architecture: Two Different Worlds</h2>
            <p>
              Marketing is evolving from capturing attention to building ownership. Web2 optimized for reach on
              centralized platforms; Web3 optimizes for direct, verifiable relationships with stakeholders.
            </p>

            <Tabs defaultValue="web2" className="mt-4">
              <TabsList>
                <TabsTrigger value="web2">Web2</TabsTrigger>
                <TabsTrigger value="web3">Web3</TabsTrigger>
              </TabsList>
              <TabsContent value="web2">
                <ul>
                  <li>Centralized data — platforms own the relationship.</li>
                  <li>Algorithmic distribution — pay to play.</li>
                  <li>Intermediary-dependent — no direct access.</li>
                  <li>Data extraction model — users are the product.</li>
                </ul>
              </TabsContent>
              <TabsContent value="web3">
                <ul>
                  <li>Decentralized data — users own wallets and identity.</li>
                  <li>Direct relationships — fewer middlemen.</li>
                  <li>Transparent verification — on-chain proof.</li>
                  <li>Value co-creation — users become stakeholders.</li>
                </ul>
              </TabsContent>
            </Tabs>

            <h3 className="mt-8">Key insight</h3>
            <p>
              82% of Web3 marketers report positive ROI from community ownership models, with 2–4x efficiency gains
              versus traditional campaigns.
            </p>

            <h2 className="mt-10">Real Example: Starbucks Odyssey</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-lg border border-border p-4">
                <h4 className="mb-2 text-sm font-semibold">Traditional rewards (Web2)</h4>
                <ul className="list-disc space-y-1 pl-5">
                  <li>Earn stars through purchases</li>
                  <li>Locked in ecosystem</li>
                  <li>No transferability</li>
                  <li>Company controls terms</li>
                </ul>
              </div>
              <div className="rounded-lg border border-border p-4">
                <h4 className="mb-2 text-sm font-semibold">Starbucks Odyssey (Web3)</h4>
                <ul className="list-disc space-y-1 pl-5">
                  <li>Earn NFT "journey stamps"</li>
                  <li>True ownership</li>
                  <li>Tradeable on markets</li>
                  <li>Community-driven value</li>
                </ul>
              </div>
            </div>

            <h2 className="mt-10">The Philosophy Shift: Attention → Ownership</h2>
            <div className="overflow-hidden rounded-lg border border-border">
              <table className="w-full text-sm">
                <thead className="bg-muted/50 text-left">
                  <tr>
                    <th className="p-3">Mindset</th>
                    <th className="p-3">Web2</th>
                    <th className="p-3">Web3</th>
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

            <h2 className="mt-10">5 Core Principles Marketers Must Learn</h2>
            <ol className="list-decimal space-y-3 pl-5">
              <li>Transparency is non-negotiable</li>
              <li>Community is your distribution</li>
              <li>Incentive design beats campaign design</li>
              <li>Data privacy is a feature</li>
              <li>Long‑term thinking wins</li>
            </ol>

            <p className="mt-8">
              This isn’t about replacing loyalty points with tokens. It’s asking: what if customers could own their
              relationship with your brand? When you give people real ownership, they don’t just engage differently — they
              think differently and become true advocates.
            </p>
          </section>
        </article>
      </main>
    </div>
  );
}
