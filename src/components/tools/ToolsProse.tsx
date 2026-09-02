import type { FaqEntry } from "@/content/tools-content";

/**
 * Prose and FAQ blocks for the tools pages.
 *
 * The FAQ uses native <details>/<summary> rather than the Radix accordion, matching
 * components/audit/FAQSection.tsx. That choice is deliberate here: the answers are
 * present in the DOM before any JavaScript runs, so crawlers and AI fetchers read
 * the full text, and the same markup is what the prerender emits.
 */

export function ProseSection({
  heading,
  paragraphs,
}: {
  heading: string;
  paragraphs: string[];
}) {
  return (
    <section className="py-16 lg:py-20 bg-background">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-hero font-bold text-3xl md:text-4xl text-primary mb-6">
            {heading}
          </h2>
          <div className="space-y-4">
            {paragraphs.map((p, i) => (
              <p key={i} className="font-body text-lg text-muted-foreground leading-relaxed">
                {p}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function StepsSection({
  heading,
  items,
}: {
  heading: string;
  items: { title: string; text: string }[];
}) {
  return (
    <section className="py-16 lg:py-20 bg-muted/30">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-hero font-bold text-3xl md:text-4xl text-primary mb-10 text-center">
            {heading}
          </h2>
          <ol className="grid gap-6 md:grid-cols-3 list-none p-0">
            {items.map((item, i) => (
              <li
                key={i}
                className="bg-background rounded-xl p-6 border border-border"
              >
                <span className="font-hero font-bold text-[hsl(var(--aqua-bright))] text-sm">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="font-hero font-semibold text-xl text-primary mt-2 mb-3">
                  {item.title}
                </h3>
                <p className="font-body text-muted-foreground">{item.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

export function FaqAccordion({
  heading,
  faqs,
}: {
  heading: string;
  faqs: FaqEntry[];
}) {
  return (
    <section className="py-16 lg:py-20 bg-background">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-hero font-bold text-3xl md:text-4xl text-primary mb-12 text-center">
            {heading}
          </h2>
          <div className="space-y-4">
            {faqs.map((item, i) => (
              <details key={i} className="group bg-muted rounded-xl overflow-hidden">
                <summary className="flex justify-between items-center gap-4 p-6 cursor-pointer font-hero font-semibold text-primary hover:bg-muted/80 transition-colors">
                  {item.q}
                  <span className="text-[hsl(var(--aqua-bright))] transform group-open:rotate-45 transition-transform text-xl shrink-0">
                    +
                  </span>
                </summary>
                <div className="px-6 pb-6">
                  <p className="font-body text-muted-foreground">{item.a}</p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
