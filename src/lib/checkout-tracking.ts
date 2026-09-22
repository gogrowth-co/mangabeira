/**
 * Checkout + purchase tracking, using GA4's standard ecommerce events.
 *
 * `begin_checkout` and `purchase` are built-in GA4 events, and `value`,
 * `currency` and `transaction_id` are built-in GA4 parameters. That matters:
 * built-in parameters need no custom dimension or metric registered, revenue
 * lands in the Monetization reports on its own, and `purchase` is a key event
 * in GA4 by default. One sale counts as 1, its dollars roll up as revenue.
 *
 * The flow: the buyer clicks a Stripe Payment Link on the landing page, pays on
 * Stripe, and is redirected back to /audit-payment-success. Stripe does not
 * carry the amount back in that redirect, so the tier and price are stashed in
 * sessionStorage on click and read back on the success page.
 *
 * Known limit: this is browser-side, so a sale is only counted if checkout
 * finishes in the same browser session that started it. Paying on another
 * device, or clearing storage mid-flow, means that purchase is not recorded.
 * The airtight version is a Stripe webhook posting to the GA4 Measurement
 * Protocol server-side, which needs a Stripe API key this project does not have.
 */

const STASH_KEY = "audit_checkout";

type Stash = { tier: string; price: number };

const dataLayer = (): Record<string, unknown>[] | null => {
  if (typeof window === "undefined") return null;
  window.dataLayer = window.dataLayer || [];
  return window.dataLayer;
};

/**
 * Every parameter any lp_ event can send. GTM's dataLayer model *persists*
 * keys between pushes, so without clearing these an event inherits whatever
 * the previous one set — a CTA click would arrive carrying the last scroll
 * depth and section heading. Each push blanks the full set before applying
 * its own params, so every event reports only what actually belongs to it.
 */
const LP_EVENT_PARAM_KEYS = [
  "percent", "tier", "price", "label", "destination", "launch_pricing", "anchor",
  "faq_index", "faq_question", "section_id", "section_index", "section_heading",
  "seconds", "currency",
] as const;

/**
 * Push a custom event to the GTM dataLayer, shared by every landing page that
 * sells the audit. GA4 on this site is loaded *inside* GTM (window.gtag is
 * undefined), so there is no way to send GA4 events straight from code —
 * every event pushed here needs a matching GTM trigger + GA4 event tag to
 * reach GA4. All names share the `lp_` prefix so one regex trigger (`^lp_`)
 * forwards the whole set.
 */
export const trackLP = (
  lpId: string,
  event: string,
  params: Record<string, string | number | boolean> = {}
) => {
  const dl = dataLayer();
  if (!dl) return;
  const cleared: Record<string, undefined> = {};
  LP_EVENT_PARAM_KEYS.forEach((key) => {
    cleared[key] = undefined;
  });
  dl.push({ event, lp_id: lpId, ...cleared, ...params });
};

/** Fired when the buyer leaves for Stripe. */
export const beginCheckout = (tier: string, price: number) => {
  const dl = dataLayer();
  if (!dl) return;

  dl.push({ event: "begin_checkout", value: price, currency: "USD", tier });

  try {
    sessionStorage.setItem(STASH_KEY, JSON.stringify({ tier, price } satisfies Stash));
  } catch {
    // Private mode or storage disabled — the checkout still tracks, only the
    // matching purchase will be missed.
  }
};

/**
 * Fired once on the payment-success page. Returns true if a purchase was
 * reported. The stash is cleared immediately so a page refresh cannot
 * double-count, and transaction_id gives GA4 a second layer of deduplication.
 */
export const reportPurchase = (): boolean => {
  const dl = dataLayer();
  if (!dl) return false;

  let stash: Stash | null = null;
  try {
    stash = JSON.parse(sessionStorage.getItem(STASH_KEY) || "null");
  } catch {
    stash = null;
  }
  if (!stash || typeof stash.price !== "number") return false;

  try {
    sessionStorage.removeItem(STASH_KEY);
  } catch {
    /* ignore */
  }

  const sessionId = new URLSearchParams(window.location.search).get("session_id");

  dl.push({
    event: "purchase",
    transaction_id: sessionId || `lp-${stash.tier}-${Date.now()}`,
    value: stash.price,
    currency: "USD",
    tier: stash.tier,
  });

  return true;
};
