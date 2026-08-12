import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import "@/styles/audit-landing.css";

import boardOverview from "@/assets/audit/eigenlayer-board-overview.png";
import websiteFrame from "@/assets/audit/eigenlayer-website-frame-proof.png";
import sprintProof from "@/assets/audit/zaros-growth-sprint-proof.png";
import sixSurfaceDesktop from "@/assets/audit/six-surface-system-desktop.svg";
import sixSurfaceMobile from "@/assets/audit/six-surface-system-mobile.svg";
import evidenceDesktop from "@/assets/audit/evidence-to-decision-desktop.svg";
import evidenceMobile from "@/assets/audit/evidence-to-decision-mobile.svg";
import deliveryHandoff from "@/assets/audit/delivery-handoff.svg";
import walkthroughPoster from "@/assets/audit/notion-report-walkthrough-poster.jpg";
// Large video files stay on the Lovable CDN instead of the repository.
import walkthroughMp4 from "@/assets/audit/notion-report-walkthrough-30s.mp4.asset.json";
import walkthroughWebm from "@/assets/audit/notion-report-walkthrough-30s.webm.asset.json";

/**
 * Single source of truth for the purchase destinations on this ads landing page.
 * STARTER_CTA is the standalone $97 promo Payment Link limited to 10 completed checkouts.
 * PRO_CTA points at the live service page until a dedicated $397 Payment Link exists.
 */
const STARTER_CTA = "https://buy.stripe.com/6oUbJ0bHO57f7jiaD12ZO05";
const PRO_CTA = "https://mangabeira.net/services/web3-growth-audit";

const AuditLanding = () => {
  // Anchor navigation that respects reduced-motion preferences (ported from prototype script.js).
  useEffect(() => {
    const root = document.getElementById("w3l-root");
    if (!root) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    const onClick = (event: Event) => {
      const link = (event.target as HTMLElement | null)?.closest<HTMLAnchorElement>(
        'a[href^="#"]'
      );
      if (!link || !root.contains(link)) return;
      const hash = link.getAttribute("href");
      if (!hash || hash === "#") return;
      const target = root.querySelector(hash);
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView({ behavior: reduceMotion.matches ? "auto" : "smooth" });
    };

    root.addEventListener("click", onClick);
    return () => root.removeEventListener("click", onClick);
  }, []);

  return (
    <div className="w3l" id="w3l-root">
      <Helmet>
        <title>Web3 Growth Audit | See where your growth system breaks</title>
        <meta
          name="description"
          content="A complete, async diagnosis of where your Web3 growth system breaks across six connected surfaces."
        />
        <meta name="robots" content="noindex, follow" />
        <meta property="og:title" content="See where your Web3 growth system breaks" />
        <meta
          property="og:description"
          content="A complete, async diagnosis across six connected surfaces. Starter $97, Pro $397."
        />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>

      <a className="skip-link" href="#main">
        Skip to main content
      </a>

      <header className="site-header">
        <a className="wordmark" href="#hero" aria-label="Analyst in the Arena, back to top">
          <span className="wordmark-mark" aria-hidden="true">
            A
          </span>
          <span>Analyst in the Arena</span>
        </a>
        <a className="header-link" href="#offers">
          Compare Starter and Pro
        </a>
      </header>

      <main id="main">
        <section className="hero section" id="hero" aria-labelledby="hero-title">
          <div className="hero-copy">
            <p className="eyebrow">Web3 Growth Audit</p>
            <h1 id="hero-title">See where your Web3 growth system breaks.</h1>
            <p className="hero-lede">
              A complete, async diagnosis for post-launch Web3 founders and growth teams. I trace
              the breaks across six connected surfaces.
            </p>
            <p className="hero-bridge">
              <strong>Starter</strong> gives you the diagnosis. <strong>Pro</strong> adds priorities
              and a 30-day action plan.
            </p>
            <p className="hero-delivery">
              <strong>You receive:</strong> the evidence, a complete Miro board, Loom walkthrough,
              private skill package, and Notion operating report.
            </p>
            <div className="hero-actions">
              <a className="button button-primary" href={STARTER_CTA}>
                Get Starter for $97
              </a>
              <a className="text-link" href="#report-preview">
                Inspect the actual report <span aria-hidden="true">↓</span>
              </a>
            </div>
            <ul className="trust-line" aria-label="Offer terms">
              <li>Fully async</li>
              <li>72-hour Starter delivery</li>
              <li>No calls required</li>
            </ul>
          </div>

          <div className="report-window hero-report" aria-label="Sample of the operating report">
            <div className="window-bar" aria-hidden="true">
              <span></span>
              <span></span>
              <span></span>
              <p>Web3 Growth Audit / Operating report</p>
            </div>
            <div
              className="report-scroll"
              tabIndex={0}
              aria-label="Static report preview. Scroll to inspect the real board evidence."
            >
              <article className="report-sheet">
                <p className="report-kicker">Complete six-surface diagnosis</p>
                <h2>Where does the protocol have presence without a system?</h2>
                <div className="finding-callout">
                  <span className="status-marker">Executive diagnosis</span>
                  <p>
                    The audit traces the break between attention, trust, activation, and repeat use.
                  </p>
                </div>
                <div className="mini-surface-map" aria-label="Six audit surfaces">
                  <span>Website</span>
                  <span>dApp</span>
                  <span>Social Media</span>
                  <span>Community</span>
                  <span>SEO + answers</span>
                  <span>PR + Paid Ads</span>
                </div>
                <figure className="hero-proof">
                  <img
                    src={boardOverview.url}
                    width={1440}
                    height={693}
                    alt="Real EigenLayer Miro board organized across Website, dApp, Social Media, Community, SEO, PR, and Paid Ads"
                    fetchPriority="high"
                  />
                  <figcaption>Real Miro evidence, organized as one growth system.</figcaption>
                </figure>
              </article>
            </div>
          </div>
        </section>

        <section
          className="problem section section-narrow"
          id="problem"
          aria-labelledby="problem-title"
        >
          <h2 id="problem-title">
            A protocol can look active while every surface sends users in a different direction.
          </h2>
          <div className="problem-grid">
            <p>
              Traffic, posts, community activity, wallet connects, and PR can all exist without
              forming a growth system. The symptoms show up in charts. The cause usually sits in the
              handoff between surfaces.
            </p>
            <aside className="finding-callout strong-callout">
              <span className="status-marker">The decision</span>
              <p>
                Do not add another channel until the highest-impact break is named, evidenced, and
                assigned an owner.
              </p>
            </aside>
          </div>
        </section>

        <section
          className="report-preview section section-mist"
          id="report-preview"
          aria-labelledby="preview-title"
        >
          <div className="section-heading split-heading">
            <div>
              <p className="eyebrow">Actual report preview</p>
              <h2 id="preview-title">A working reference, not a PDF of loose observations.</h2>
            </div>
            <p>
              Start with the executive diagnosis. Trace each finding to visible evidence. Then use
              the cross-surface synthesis to decide what matters.
            </p>
          </div>

          <div className="report-window full-report">
            <div className="window-bar" aria-hidden="true">
              <span></span>
              <span></span>
              <span></span>
              <p>Web3 Growth Audit / Client workspace</p>
            </div>
            <div className="document-layout">
              <nav className="report-index" aria-label="Report preview contents">
                <p className="index-title">Inside the report</p>
                <ol>
                  <li>
                    <a href="#six-surfaces">Executive diagnosis</a>
                  </li>
                  <li>
                    <a href="#six-surfaces">Six-surface audit</a>
                  </li>
                  <li>
                    <a href="#evidence-to-finding">Evidence standard</a>
                  </li>
                  <li>
                    <a href="#offers">Starter and Pro</a>
                  </li>
                  <li>
                    <a href="#handoff">Handoff</a>
                  </li>
                </ol>
              </nav>
              <article className="report-document">
                <p className="report-kicker">Sample report structure</p>
                <h3>Web3 Growth Audit: the operating report</h3>
                <p className="report-intro">
                  The client version replaces this sample language with protocol-specific evidence,
                  findings, links, and decisions.
                </p>
                <div className="finding-callout">
                  <span className="status-marker">Core question</span>
                  <p>Where does the protocol have presence without a system?</p>
                </div>
                <div className="report-columns">
                  <div>
                    <p className="report-label">Orientation</p>
                    <h4>Read the system, then the surfaces.</h4>
                    <p>
                      The findings matter individually. The highest-impact decision sits in the
                      relationship between them.
                    </p>
                  </div>
                  <div>
                    <p className="report-label">Evidence rule</p>
                    <h4>Every finding stays traceable.</h4>
                    <p>
                      Each conclusion links back to a screenshot, URL, query, campaign sample, or
                      product flow.
                    </p>
                  </div>
                </div>
              </article>
            </div>
          </div>
        </section>

        <section className="surfaces section" id="six-surfaces" aria-labelledby="surfaces-title">
          <div className="section-heading split-heading">
            <div>
              <h2 id="surfaces-title">The audit follows the user journey, not your org chart.</h2>
            </div>
            <p>
              Each surface is reviewed on its own, then tested against the handoffs that turn
              discovery into repeat use.
            </p>
          </div>
          <ol className="surface-list">
            <li>
              <div>
                <h3>Website</h3>
                <p>
                  Narrative, proof, navigation, conversion paths, content structure, and the
                  first-time visitor route.
                </p>
              </div>
            </li>
            <li>
              <div>
                <h3>dApp</h3>
                <p>
                  Wallet connect, onboarding, first meaningful action, error recovery, and return
                  paths.
                </p>
              </div>
            </li>
            <li>
              <div>
                <h3>Social Media</h3>
                <p>
                  Profile promise, narrative consistency, publishing patterns, response quality, and
                  downstream paths.
                </p>
              </div>
            </li>
            <li>
              <div>
                <h3>Community</h3>
                <p>
                  Welcome flow, support structure, activation loops, member intent, and owned
                  reactivation.
                </p>
              </div>
            </li>
            <li>
              <div>
                <h3>SEO and answer visibility</h3>
                <p>
                  Search discovery, indexing, answer extraction, citations, authority, and competitor
                  coverage.
                </p>
              </div>
            </li>
            <li>
              <div>
                <h3>PR and Paid Ads</h3>
                <p>
                  Earned authority, campaign-message fit, landing destinations, attribution, and
                  missing distribution.
                </p>
              </div>
            </li>
          </ol>
          <figure className="method-visual">
            <picture>
              <source media="(max-width: 700px)" srcSet={sixSurfaceMobile.url} />
              <img
                src={sixSurfaceDesktop.url}
                width={1600}
                height={900}
                loading="lazy"
                alt="Method diagram showing the six connected audit surfaces and the user journey from discovery to advocacy"
              />
            </picture>
            <figcaption>
              <span className="report-label">Method diagram</span> This explanatory map shows how the
              audit connects the six surfaces. It is not client evidence.
            </figcaption>
          </figure>
          <p className="system-chain">
            <span>Discovery</span>
            <i aria-hidden="true">→</i>
            <span>Understanding</span>
            <i aria-hidden="true">→</i>
            <span>Trust</span>
            <i aria-hidden="true">→</i>
            <span>First action</span>
            <i aria-hidden="true">→</i>
            <span>Repeat use</span>
            <i aria-hidden="true">→</i>
            <span>Advocacy</span>
          </p>
        </section>

        <section
          className="evidence section section-pool"
          id="evidence-to-finding"
          aria-labelledby="evidence-title"
        >
          <div className="section-heading">
            <p className="eyebrow">Evidence to finding</p>
            <h2 id="evidence-title">Every diagnosis shows its work.</h2>
            <p>
              The audit separates what is visible from what it implies. That keeps each
              recommendation tied to a source instead of opinion.
            </p>
          </div>
          <figure className="method-visual method-visual-pool">
            <picture>
              <source media="(max-width: 700px)" srcSet={evidenceMobile.url} />
              <img
                src={evidenceDesktop.url}
                width={1400}
                height={700}
                loading="lazy"
                alt="Method diagram showing evidence moving through observation, implication, priority, and next move"
              />
            </picture>
            <figcaption>
              <span className="report-label">Method diagram</span> The finding structure keeps facts,
              interpretation, and decisions traceable.
            </figcaption>
          </figure>
          <div className="evidence-flow">
            <figure className="evidence-card tall-evidence">
              <div className="image-stage image-stage-tall">
                <img
                  src={websiteFrame.url}
                  width={205}
                  height={610}
                  loading="lazy"
                  alt="Real EigenLayer Website frame from the Miro audit board"
                />
              </div>
              <figcaption>
                <span className="report-label">Real board capture</span> Website evidence is
                preserved in context for inspection.
              </figcaption>
            </figure>
            <div className="flow-arrow" aria-hidden="true">
              →
            </div>
            <article className="finding-card">
              <span className="status-marker status-gold">Finding format</span>
              <dl>
                <div>
                  <dt>Evidence</dt>
                  <dd>Screenshot, URL, query, campaign sample, or product flow.</dd>
                </div>
                <div>
                  <dt>Observation</dt>
                  <dd>What is directly visible in the source.</dd>
                </div>
                <div>
                  <dt>Implication</dt>
                  <dd>Why the observation matters across the system.</dd>
                </div>
                <div>
                  <dt>Next move</dt>
                  <dd>The smallest useful correction.</dd>
                </div>
                <div>
                  <dt>Confidence</dt>
                  <dd>High, medium, or low, based on the evidence available.</dd>
                </div>
              </dl>
            </article>
          </div>
        </section>

        <section className="miro section" id="miro-proof" aria-labelledby="miro-title">
          <div className="section-heading split-heading">
            <div>
              <p className="eyebrow">Miro board proof</p>
              <h2 id="miro-title">The complete system stays visible on one board.</h2>
            </div>
            <p>
              The board preserves source context across all six surfaces. You can inspect the
              evidence without losing the cross-surface view.
            </p>
          </div>
          <figure className="evidence-card board-card">
            <div className="image-stage board-stage">
              <img
                src={boardOverview.url}
                width={1440}
                height={693}
                loading="lazy"
                alt="Real EigenLayer audit board showing evidence grouped across all six growth surfaces"
              />
            </div>
            <figcaption>
              <span className="report-label">Real Miro capture</span> The EigenLayer reference board
              shows the six-surface structure. It is used here as delivery proof, not as an invented
              client finding.
            </figcaption>
          </figure>
        </section>

        <section
          className="notion section section-dark"
          id="notion-proof"
          aria-labelledby="notion-title"
        >
          <div className="section-heading split-heading light-heading">
            <div>
              <h2 id="notion-title">A guided walkthrough of the actual operating report.</h2>
            </div>
            <p>
              The recording proves the depth and organization of the handoff. It stays on the poster
              until you choose to play it.
            </p>
          </div>
          <figure className="video-frame">
            <video
              controls
              muted
              playsInline
              poster={walkthroughPoster.url}
              preload="none"
              width={1008}
              height={1116}
              aria-label="Cropped walkthrough of the actual Web3 Growth Audit Notion operating report"
            >
              <source src={walkthroughWebm.url} type="video/webm" />
              <source src={walkthroughMp4.url} type="video/mp4" />
              <p>
                Your browser does not support video. The poster and static evidence on this page show
                the report structure.
              </p>
            </video>
            <figcaption>
              30-second cropped report walkthrough. Native controls are available. Playback starts
              only when you press play.
            </figcaption>
          </figure>
        </section>

        <section className="offers section" id="offers" aria-labelledby="offers-title">
          <div className="section-heading centered-heading">
            <p className="eyebrow">Starter versus Pro</p>
            <h2 id="offers-title">Choose diagnosis or diagnosis plus a 30-day sequence.</h2>
            <p>
              Starter is complete on its own. Pro adds the order of operations for teams ready to act
              now.
            </p>
          </div>
          <div className="offer-grid">
            <article className="offer-card">
              <div className="offer-header">
                <p className="offer-name">Starter</p>
                <h3>The complete diagnosis</h3>
                <div className="price">
                  <strong>$97</strong>
                  <span>launch price</span>
                </div>
                <p className="standard-price">
                  Standard price <del>$197</del>
                </p>
                <p>
                  For teams that need to see what is wrong, where it is visible, and what the
                  evidence means.
                </p>
              </div>
              <ul className="check-list">
                <li>Complete six-surface diagnosis</li>
                <li>One complete Miro board</li>
                <li>Loom walkthrough</li>
                <li>Custom private skill package</li>
                <li>Notion operating report</li>
              </ul>
              <p className="offer-answer">
                <strong>Answers:</strong> What is broken?
              </p>
              <a className="button button-secondary" href={STARTER_CTA}>
                Get the complete diagnosis
              </a>
            </article>

            <article className="offer-card offer-pro">
              <div className="offer-flag">For teams ready to execute</div>
              <div className="offer-header">
                <p className="offer-name">Pro</p>
                <h3>The 30-day action layer</h3>
                <div className="price">
                  <strong>$397</strong>
                  <span>launch price</span>
                </div>
                <p className="standard-price">
                  Standard price <del>$497</del>
                </p>
                <p>
                  Everything in Starter, plus a prioritized sequence your team can own and ship.
                </p>
              </div>
              <ul className="check-list">
                <li>Prioritized action plan</li>
                <li>Growth Sprint board</li>
                <li>30-day calendar</li>
                <li>Owners, dependencies, effort, and expected signals</li>
                <li>Clear order of operations</li>
              </ul>
              <p className="offer-answer">
                <strong>Answers:</strong> What do we fix first?
              </p>
              <a className="button button-primary" href={PRO_CTA}>
                Add the 30-day action plan
              </a>
            </article>
          </div>
          <p className="urgency-note">
            <span aria-hidden="true">●</span> Launch pricing is limited to the first ten buyers for
            each offer.
          </p>
        </section>

        <section
          className="skills-package section section-mist"
          id="private-skills"
          aria-labelledby="skills-title"
        >
          <div className="skills-layout">
            <div className="skills-copy">
              <p className="eyebrow">Private skill package</p>
              <h2 id="skills-title">The audit context leaves with your team.</h2>
              <p>
                This is a private repository built from the evidence, decisions, and protocol context
                captured during your audit. It is not a generic prompt pack.
              </p>
              <ul className="boundary-list">
                <li>Private GitHub repository</li>
                <li>Fixed snapshot at delivery</li>
                <li>Cloneable into Claude, ChatGPT, or a compatible agent harness</li>
                <li>No visual templates or future updates included</li>
              </ul>
            </div>
            <div className="repo-window" aria-label="Example structure of the private skill repository">
              <div className="repo-bar">
                <span aria-hidden="true">▦</span> private-client-gtm-skills
              </div>
              <ul>
                <li>
                  <span>folder</span> client-context/
                </li>
                <li className="nested">
                  <span>file</span> protocol-brief.md
                </li>
                <li className="nested">
                  <span>file</span> evidence-index.md
                </li>
                <li className="nested">
                  <span>file</span> audit-decisions.md
                </li>
                <li>
                  <span>folder</span> skills/
                </li>
                <li className="nested">
                  <span>folder</span> narrative-diagnostic/
                </li>
                <li className="nested">
                  <span>folder</span> distribution-scan/
                </li>
                <li>
                  <span>file</span> README.md
                </li>
              </ul>
            </div>
          </div>
        </section>

        <section className="pro-proof section" aria-labelledby="pro-proof-title">
          <div className="section-heading split-heading">
            <div>
              <h2 id="pro-proof-title">The diagnosis becomes a sequence of work.</h2>
            </div>
            <p>
              Research, Ideate, Prioritize, Plan, and Build. Every action connects to an owner,
              dependency, effort level, and expected signal.
            </p>
          </div>
          <figure className="evidence-card board-card">
            <div className="image-stage sprint-stage">
              <img
                src={sprintProof.url}
                width={1440}
                height={360}
                loading="lazy"
                alt="Real Zaros Miro Growth Sprint board organized from Research through Build"
              />
            </div>
            <figcaption>
              <span className="report-label">Real Pro proof</span> The Zaros Growth Sprint capture
              shows how the execution layer organizes work after diagnosis.
            </figcaption>
          </figure>
        </section>

        <section className="faq section section-mist" id="faq" aria-labelledby="faq-title">
          <div className="faq-layout">
            <div className="faq-intro">
              <p className="eyebrow">Frequently asked questions</p>
              <h2 id="faq-title">What to know before you buy.</h2>
              <p>
                The audit is fixed-scope and fully async. These are the questions that affect the
                decision.
              </p>
            </div>
            <div className="faq-list">
              <details>
                <summary>What happens after I buy?</summary>
                <p>
                  You receive an email intake. Once the intake is complete, I review the six
                  surfaces, assemble the Miro evidence, record the Loom, build the private skill
                  package, and deliver the Notion report. Starter targets delivery within 72 hours.
                </p>
              </details>
              <details>
                <summary>What is the difference between Starter and Pro?</summary>
                <p>
                  Starter shows what is broken, where it is visible, and what the evidence means. Pro
                  includes that complete diagnosis, then adds priorities, owners, dependencies,
                  effort, expected signals, a Growth Sprint, and a 30-day execution calendar.
                </p>
              </details>
              <details>
                <summary>Do you need access to private accounts?</summary>
                <p>
                  I begin with public protocol surfaces and the materials you choose to provide. You
                  do not send passwords. If private analytics or campaign evidence would change the
                  diagnosis, the intake identifies the safest useful source.
                </p>
              </details>
              <details>
                <summary>Is this a generic AI report?</summary>
                <p>
                  No. Each finding is tied to visible protocol evidence. AI supports collection and
                  analysis, but Gabriel makes the diagnosis, sets the priorities, and reviews the
                  final handoff. The private skills are built from your audit context, not copied
                  from a prompt library.
                </p>
              </details>
              <details>
                <summary>What is inside the private skill package?</summary>
                <p>
                  You receive a private GitHub repository with the protocol brief, evidence index,
                  audit decisions, and context-built growth skills. It is a fixed snapshot that can
                  be cloned into Claude, ChatGPT, or another compatible agent harness. Future updates
                  are separate work.
                </p>
              </details>
              <details>
                <summary>What if the audit does not surface enough actionable work?</summary>
                <p>
                  For Starter, you can request a full refund within seven days if the audit does not
                  surface at least six actionable insights. For Pro, the same refund window applies
                  if the action plan does not include at least eight prioritized experiments.
                </p>
              </details>
            </div>
          </div>
        </section>

        <section className="final-cta section" id="final-cta" aria-labelledby="final-title">
          <div className="cta-copy">
            <p className="eyebrow">First ten buyers</p>
            <h2 id="final-title">Find the break before you fund another channel.</h2>
            <p>
              Start with the complete diagnosis for <strong>$97</strong>, normally $197. Choose Pro
              for <strong>$397</strong>, normally $497, when you want the 30-day execution sequence
              included.
            </p>
          </div>
          <div className="cta-actions">
            <a className="button button-gold" href={STARTER_CTA}>
              Get Starter for $97
            </a>
            <a className="button button-outline-light" href={PRO_CTA}>
              Choose Pro for $397
            </a>
          </div>
        </section>

        <section className="handoff section" id="handoff" aria-labelledby="handoff-title">
          <div className="handoff-intro">
            <p className="eyebrow">Trust and delivery handoff</p>
            <h2 id="handoff-title">Four deliverables. One operating reference.</h2>
            <p>
              Fixed scope, fixed price, fully async. Starter ships within 72 hours after intake
              completion.
            </p>
          </div>
          <figure className="method-visual handoff-visual">
            <img
              src={deliveryHandoff.url}
              width={1400}
              height={700}
              loading="lazy"
              alt="Delivery handoff from Miro to Loom, a private GitHub repository, and the Notion operating report"
            />
            <figcaption>
              <span className="report-label">Delivery map</span> Each format answers a different
              question while preserving one operating reference.
            </figcaption>
          </figure>
          <ol className="handoff-list">
            <li>
              <h3>Miro</h3>
              <p>The complete visual diagnosis and source evidence.</p>
            </li>
            <li>
              <h3>Loom</h3>
              <p>A guided reading of the evidence and implications.</p>
            </li>
            <li>
              <h3>Private GitHub repository</h3>
              <p>Your fixed, context-built skill package.</p>
            </li>
            <li>
              <h3>Notion report</h3>
              <p>The operating index your team keeps.</p>
            </li>
          </ol>
        </section>
      </main>

      <footer className="site-footer">
        <p>Web3 Growth Audit by Gabriel Mangabeira</p>
        <p>Evidence across six surfaces. No calls required.</p>
      </footer>
    </div>
  );
};

export default AuditLanding;
