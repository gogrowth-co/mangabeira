import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Award, Brain, TrendingUp, Users, ExternalLink } from "lucide-react";
import gabrielSwimming from "@/assets/gabriel-swimming-action.png";
import gabrielProfessional from "@/assets/gabriel-professional-about.png";
import ogImage from "@/assets/gabriel-professional-new.webp";

const title = "About Gabriel Mangabeira | Olympian & Growth Marketing Strategist";
const description = "From Olympic discipline to Web3 growth strategy — discover how Gabriel Mangabeira blends AI, data, and storytelling to help brands grow with precision and focus.";

function useSEO() {
  React.useEffect(() => {
    const origin = window.location.origin;
    const url = `${origin}/about`;
    const absoluteImage = ogImage.startsWith("http") ? ogImage : `${origin}${ogImage}`;

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

    ensureMetaByProperty("og:type", "profile");
    ensureMetaByProperty("og:title", title);
    ensureMetaByProperty("og:description", description);
    ensureMetaByProperty("og:url", url);
    ensureMetaByProperty("og:image", absoluteImage);

    ensureMetaByName("twitter:card", "summary_large_image");
    ensureMetaByName("twitter:title", title);
    ensureMetaByName("twitter:description", description);
    ensureMetaByName("twitter:image", absoluteImage);

    // JSON-LD Structured Data
    const structuredData = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "WebSite",
          "@id": `${origin}/#website`,
          "url": `${origin}/`,
          "name": "Gabriel Mangabeira",
          "inLanguage": "en",
          "publisher": { "@id": `${origin}/#person` }
        },
        {
          "@type": "AboutPage",
          "@id": `${url}/#aboutpage`,
          "url": url,
          "name": title,
          "headline": "About Gabriel Mangabeira",
          "description": description,
          "isPartOf": { "@id": `${origin}/#website` },
          "about": { "@id": `${origin}/#person` },
          "primaryImageOfPage": { "@id": `${origin}/#og-image` },
          "inLanguage": "en",
          "breadcrumb": { "@id": `${url}/#breadcrumb` }
        },
        {
          "@type": "BreadcrumbList",
          "@id": `${url}/#breadcrumb`,
          "itemListElement": [
            {
              "@type": "ListItem",
              "position": 1,
              "name": "Home",
              "item": `${origin}/`
            },
            {
              "@type": "ListItem",
              "position": 2,
              "name": "About"
            }
          ]
        },
        {
          "@type": "ImageObject",
          "@id": `${origin}/#og-image`,
          "url": absoluteImage,
          "width": 1200,
          "height": 630,
          "caption": "Gabriel Mangabeira"
        },
        {
          "@type": "Organization",
          "@id": `${origin}/#org`,
          "name": "Gabriel Mangabeira Growth Marketing",
          "url": `${origin}/`,
          "sameAs": [
            "https://www.linkedin.com/company/gabriel-mangabeira-growth-marketing/"
          ]
        },
        {
          "@type": "Person",
          "@id": `${origin}/#person`,
          "name": "Gabriel Mangabeira",
          "alternateName": ["Manga", "Gabriel Mangabeira OLY"],
          "url": `${origin}/`,
          "image": { "@id": `${origin}/#og-image` },
          "jobTitle": "Growth Marketing Strategist",
          "honorificSuffix": "OLY",
          "nationality": "Brazil",
          "description": "Olympian and Growth Marketing Strategist blending AI, Web3, and data-driven systems to deliver measurable results.",
          "worksFor": { "@id": `${origin}/#org` },
          "affiliation": {
            "@type": "SportsOrganization",
            "name": "Brazil Olympic Team"
          },
          "knowsAbout": [
            "AI-powered growth",
            "Web3 go-to-market",
            "SEO",
            "Paid media",
            "Attribution",
            "Automation",
            "Performance analytics",
            "Content systems"
          ],
          "knowsLanguage": ["en", "pt"],
          "sameAs": [
            "https://pt.wikipedia.org/wiki/Gabriel_Mangabeira",
            "https://www.linkedin.com/in/mangabeira/",
            "https://x.com/gabmangabeira",
            "https://medium.com/@gmangabeira",
            "https://github.com/gmangabeira"
          ]
        }
      ]
    };

    const scriptNode = document.createElement("script");
    scriptNode.type = "application/ld+json";
    scriptNode.textContent = JSON.stringify(structuredData);
    document.head.appendChild(scriptNode);

    return () => {
      scriptNode.remove();
    };
  }, []);
}

export default function About() {
  useSEO();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header locale="en" />

      <main>
        <article className="mx-auto w-full max-w-3xl px-4 py-8 md:py-12">
          {/* Hero */}
          <header className="mb-12 text-center">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">About Me</h1>
            <p className="mt-4 text-lg text-muted-foreground">{description}</p>
          </header>

          {/* From Olympic Lanes to Digital Growth */}
          <section className="mb-12">
            <div className="grid gap-8 md:grid-cols-2 md:items-center">
              <div>
                <h2 className="text-2xl font-bold">From Olympic Lanes to Digital Growth</h2>
                <p className="mt-4 text-muted-foreground">
                  Before I ever built a marketing system, I learned what consistency really means — inside a 25-meter pool.
                </p>
                <p className="mt-4 text-muted-foreground">
                  Representing <strong>Brazil at the Olympics</strong> taught me that the smallest daily habits create the biggest long-term wins.
                </p>
                <p className="mt-4 text-muted-foreground">
                  That same philosophy drives everything I do today — helping teams and founders grow through systems that combine{" "}
                  <strong>discipline, data, and creativity</strong>.
                </p>
                <p className="mt-4 text-muted-foreground">
                  From <strong>Web3 exchanges</strong> to <strong>AI-powered SaaS brands</strong>, I've led strategies that attract millions of users and turn visibility into sustainable growth.
                </p>
              </div>
              <div className="overflow-hidden rounded-lg border border-border">
                <img
                  src={gabrielSwimming}
                  alt="Gabriel Mangabeira competing at the Olympics"
                  className="h-auto w-full object-cover"
                  loading="lazy"
                />
              </div>
            </div>
          </section>

          {/* The Turning Point */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold">The Turning Point</h2>
            <p className="mt-4 text-muted-foreground">
              I didn't trade one arena for another overnight.
            </p>
            <p className="mt-4 text-muted-foreground">
              There was a moment — between coaching sets and campaign dashboards — where I realized that growth, like performance, is predictable when you treat it as a system.
            </p>
            <blockquote className="my-6 rounded-md border-l-4 border-primary bg-muted/40 p-6 italic">
              "Swimming taught me how to push limits; marketing taught me how to measure them."
            </blockquote>
            <p className="mt-4 text-muted-foreground">
              That's when I started designing frameworks for repeatable, measurable growth.
            </p>
          </section>

          {/* My Journey */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold">My Journey</h2>
            <div className="mt-6 space-y-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 font-bold text-primary">
                      2008
                    </div>
                    <div>
                      <h3 className="font-semibold">Olympic Games</h3>
                      <p className="mt-1 text-sm text-muted-foreground">Consistency beats intensity.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 font-bold text-primary">
                      2015
                    </div>
                    <div>
                      <h3 className="font-semibold">Neil Patel Brasil</h3>
                      <p className="mt-1 text-sm text-muted-foreground">SEO is strategy, not shortcuts.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 font-bold text-primary">
                      2019
                    </div>
                    <div>
                      <h3 className="font-semibold">Binance LATAM</h3>
                      <p className="mt-1 text-sm text-muted-foreground">Scale amplifies clarity and chaos — manage both.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 font-bold text-primary">
                      2023
                    </div>
                    <div>
                      <h3 className="font-semibold">Building Web3 frameworks</h3>
                      <p className="mt-1 text-sm text-muted-foreground">Freedom comes from systems that think for you.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Behind the Frameworks */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold">Behind the Frameworks</h2>
            <p className="mt-4 text-muted-foreground">
              I'm not just building funnels — I'm building <strong>foundations</strong>.
            </p>
            <p className="mt-4 text-muted-foreground">
              Every client system follows a rhythm: → <strong>Observe</strong> → <strong>Experiment</strong> → <strong>Measure</strong> → <strong>Scale</strong>
            </p>
            <h3 className="mt-8 text-xl font-semibold">Core Values</h3>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-primary" />
                    Discipline
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">Keep the lane, trust the process.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5 text-primary" />
                    Curiosity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">Always question the obvious.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    Consistency
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">Data over drama.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    Transparency
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">Growth without guesswork.</p>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* In My Own Words */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold">In My Own Words</h2>
            <div className="mt-6 grid gap-8 md:grid-cols-2 md:items-center">
              <div className="overflow-hidden rounded-lg border border-border">
                <img
                  src={gabrielProfessional}
                  alt="Gabriel Mangabeira professional portrait"
                  className="h-auto w-full object-cover"
                  loading="lazy"
                />
              </div>
              <blockquote className="rounded-md border-l-4 border-primary bg-muted/40 p-6">
                <p className="italic">
                  Growth isn't about working harder; it's about designing systems that do the hard work for you.
                </p>
                <p className="mt-4 italic">
                  Every campaign I build is testable, repeatable, and scalable — powered by AI, fueled by data, and driven by human creativity.
                </p>
              </blockquote>
            </div>
          </section>

          {/* What I'm Building */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold">What I'm Building</h2>
            <p className="mt-4 text-muted-foreground">Tools born from solving real problems:</p>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              <Card className="transition-shadow hover:shadow-md">
                <CardHeader>
                  <CardTitle className="text-base">Web3 ROAST</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">CRO audits for crypto projects.</p>
                </CardContent>
              </Card>
              <Card className="transition-shadow hover:shadow-md">
                <CardHeader>
                  <CardTitle className="text-base">Token Health Scan</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">Risk assessment for blockchain ecosystems.</p>
                </CardContent>
              </Card>
              <Card className="transition-shadow hover:shadow-md">
                <CardHeader>
                  <CardTitle className="text-base">Growth Experiments Framework</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">The operating system behind my client work.</p>
                </CardContent>
              </Card>
            </div>
            <p className="mt-6 text-muted-foreground">
              Each one started as a personal experiment — now they power results for others.
            </p>
          </section>

          {/* Beyond Work */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold">Beyond Work</h2>
            <p className="mt-4 text-muted-foreground">When I'm not building growth systems, I'm usually:</p>
            <ul className="mt-4 space-y-2 text-muted-foreground">
              <li>🏊‍♂️ Free-diving or open-water swimming</li>
              <li>✍️ Writing frameworks on Medium</li>
              <li>🤝 Mentoring Web3 founders and creators</li>
            </ul>
            <p className="mt-4 text-muted-foreground">Because systems don't kill creativity — they sustain it.</p>
          </section>

          {/* Let's Collaborate */}
          <section className="mb-12">
            <div className="rounded-lg border-2 border-primary bg-primary/5 p-6 text-center md:p-8">
              <h2 className="mt-0 text-2xl font-semibold">Let's Collaborate</h2>
              <blockquote className="my-4 text-lg italic text-muted-foreground">
                Ready to turn your marketing into a measurable growth system?
              </blockquote>
              <div className="flex flex-wrap justify-center gap-4">
                <Button onClick={() => (window.location.href = "/#how-i-help")}>Work With Me</Button>
                <Button variant="outline" onClick={() => window.open("https://calendly.com/gabriel-mangabeira/15min", "_blank")}>
                  Book a Call
                </Button>
              </div>
            </div>
          </section>

          {/* Follow My Work */}
          <section>
            <h2 className="text-2xl font-bold">Follow My Work</h2>
            <div className="mt-6 flex flex-wrap gap-4">
              <a
                href="https://www.linkedin.com/in/mangabeira/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-primary hover:underline"
              >
                LinkedIn <ExternalLink className="ml-1 h-4 w-4" />
              </a>
              <a
                href="https://medium.com/@gmangabeira"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-primary hover:underline"
              >
                Medium <ExternalLink className="ml-1 h-4 w-4" />
              </a>
              <a
                href="https://github.com/gmangabeira"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-primary hover:underline"
              >
                GitHub <ExternalLink className="ml-1 h-4 w-4" />
              </a>
              <a
                href="https://pt.wikipedia.org/wiki/Gabriel_Mangabeira"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-primary hover:underline"
              >
                Wikipedia <ExternalLink className="ml-1 h-4 w-4" />
              </a>
            </div>
          </section>
        </article>
      </main>

      <Footer />
    </div>
  );
}
