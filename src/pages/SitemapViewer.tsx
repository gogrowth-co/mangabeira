import { useEffect, useState } from 'react';
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface SitemapUrl {
  loc: string;
  lastmod: string;
  changefreq: string;
  priority: string;
}

function useSEO() {
  useEffect(() => {
    const origin = window.location.origin;
    const url = `${origin}/sitemap-viewer`;

    document.title = "Sitemap | Gabriel Mangabeira";

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

    ensureMetaByName("description", "Browse all pages on Gabriel Mangabeira's website. View site structure, URLs, and last modified dates.");
    ensureMetaByName("robots", "noindex, follow");
    ensureLinkRel("canonical", url);
  }, []);
}

export default function SitemapViewer() {
  useSEO();

  const [urls, setUrls] = useState<SitemapUrl[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Parse the sitemap.xml
    fetch('/sitemap.xml')
      .then(res => {
        if (!res.ok) throw new Error('Failed to load sitemap');
        return res.text();
      })
      .then(xml => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(xml, 'text/xml');

        // Check for parsing errors
        const parserError = doc.querySelector('parsererror');
        if (parserError) {
          throw new Error('Invalid XML format');
        }

        const urlElements = doc.getElementsByTagName('url');

        const parsedUrls: SitemapUrl[] = [];
        for (let i = 0; i < urlElements.length; i++) {
          const url = urlElements[i];
          parsedUrls.push({
            loc: url.getElementsByTagName('loc')[0]?.textContent || '',
            lastmod: url.getElementsByTagName('lastmod')[0]?.textContent || '',
            changefreq: url.getElementsByTagName('changefreq')[0]?.textContent || '',
            priority: url.getElementsByTagName('priority')[0]?.textContent || ''
          });
        }

        setUrls(parsedUrls);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error loading sitemap:', err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header locale="en" />

      <main className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-4 md:text-4xl">Site Map</h1>

          {loading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading sitemap...</p>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
              <p className="text-red-800">Error loading sitemap: {error}</p>
              <p className="text-sm text-red-600 mt-2">
                Please try <a href="/sitemap.xml" className="underline">viewing the XML directly</a>.
              </p>
            </div>
          ) : (
            <>
              <p className="mb-6 text-muted-foreground">
                This site contains <strong>{urls.length} pages</strong>.
                For the XML version (used by search engines), see{' '}
                <a href="/sitemap.xml" className="text-primary hover:underline">/sitemap.xml</a>
              </p>

              <div className="bg-card rounded-lg shadow-sm border border-border overflow-hidden mb-8">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-border">
                    <thead className="bg-primary text-primary-foreground">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                          URL
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                          Last Modified
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                          Change Freq
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                          Priority
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-card divide-y divide-border">
                      {urls.map((url, idx) => (
                        <tr key={idx} className="hover:bg-muted/50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <a
                              href={url.loc}
                              className="text-primary hover:underline break-all"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {url.loc}
                            </a>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                            {url.lastmod}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                            {url.changefreq}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                            {url.priority}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900 rounded-lg p-6">
                <p className="text-sm text-foreground">
                  <strong>Note:</strong> Search engines like Google and Bing use the XML version at{' '}
                  <a href="/sitemap.xml" className="text-primary hover:underline">/sitemap.xml</a>.
                  This page is a human-friendly viewer of the same data.
                </p>
              </div>
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
