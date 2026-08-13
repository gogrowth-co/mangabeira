// Generate tailwind.safelist.json from the classes ACTUALLY used in published
// CMS content (Supabase `pages.page_translations.content` stores raw HTML with
// Tailwind classes, rendered at runtime by src/pages/DynamicPage.tsx).
//
// Why: the old tailwind.config.ts safelist used 5 broad regex patterns that
// expanded to ~96k rules / 8 MB of CSS, render-blocking on every page
// (mobile PSI 40, FCP 10.5s on the ad landing page). This script replaces the
// regexes with an explicit allowlist harvested from real content, so purge is
// safe for the ~111 published article routes.
//
// Usage: node scripts/generate-safelist.mjs
//  - Reads VITE_SUPABASE_URL / VITE_SUPABASE_PUBLISHABLE_KEY from .env (same
//    vars the prerender plugin uses).
//  - Fetches ALL pages (published or not, system or not) in every language so
//    drafts that later go live are already covered.
//  - Extracts every token from class="..." attributes, plus classes referenced
//    in <style> blocks, and merges with the committed file (grow-only: a
//    network hiccup or deleted page can never shrink the safelist).
//  - SAFETY: refuses to write if the fetch fails or returns < 10 pages.
//
// Run this and rebuild whenever new CMS content uses classes that look
// unstyled. The committed tailwind.safelist.json is the build input; builds
// never hit the network for this.
import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createClient } from "@supabase/supabase-js";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const OUT = path.join(root, "tailwind.safelist.json");

// Minimal .env loader (no dotenv dep in scripts context).
async function loadEnv() {
  const env = { ...process.env };
  try {
    const raw = await fs.readFile(path.join(root, ".env"), "utf8");
    for (const line of raw.split("\n")) {
      const m = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);
      if (m && !(m[1] in env)) env[m[1]] = m[2].replace(/^["']|["']$/g, "");
    }
  } catch {}
  return env;
}

function extractClasses(html, sink) {
  if (!html) return;
  // class="..." and class='...'
  for (const m of html.matchAll(/class\s*=\s*("([^"]*)"|'([^']*)')/gi)) {
    const val = m[2] ?? m[3] ?? "";
    for (const cls of val.split(/\s+/)) if (cls) sink.add(cls);
  }
  // Classes referenced inside <style> blocks (e.g. .my-4 { ... }) — rare but cheap.
  for (const m of html.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/gi)) {
    for (const s of m[1].matchAll(/\.([A-Za-z0-9_:\\/\[\]().%!#-]+)\s*[,{]/g)) {
      sink.add(s[1].replace(/\\/g, ""));
    }
  }
}

const env = await loadEnv();
const url = env.VITE_SUPABASE_URL || env.SUPABASE_URL;
const key =
  env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  env.SUPABASE_ANON_KEY ||
  env.SUPABASE_PUBLISHABLE_KEY;
if (!url || !key) {
  console.error("[safelist] Missing Supabase env vars; aborting (kept existing file).");
  process.exit(1);
}

const supabase = createClient(url, key);
const { data, error } = await supabase
  .from("pages")
  .select("slug, status, page_translations(language, content)");
if (error || !data || data.length < 10) {
  console.error(
    `[safelist] Fetch failed or suspiciously small (${data?.length ?? 0} pages):`,
    error?.message ?? "no error"
  );
  process.exit(1);
}

const classes = new Set();
let translations = 0;
for (const page of data) {
  for (const tr of page.page_translations || []) {
    extractClasses(tr.content, classes);
    translations++;
  }
}

// Also harvest the article template shipped in public/ (authors copy from it).
try {
  extractClasses(
    await fs.readFile(path.join(root, "public", "blog-article-template.html"), "utf8"),
    classes
  );
} catch {}

// Classes built at RUNTIME, which Tailwind's static scan can never see.
// src/components/audit/SampleFindings.tsx stores `bg-[...]` in a data object and
// renders `finding.color.replace('bg-', 'text-')`, so the text- variants only
// exist once the component runs. Losing them turned the "-> Fix:" labels grey on
// the live service page. Add here if another dynamic className appears.
const RUNTIME_DERIVED = [
  "text-[#9B59B6]",
  "text-[hsl(var(--aqua-bright))]",
  "text-[hsl(var(--gold-olympic))]",
];
for (const c of RUNTIME_DERIVED) classes.add(c);

// Grow-only merge with the committed safelist.
try {
  for (const c of JSON.parse(await fs.readFile(OUT, "utf8"))) classes.add(c);
} catch {}

// Drop tokens Tailwind could never generate (plain words are harmless either
// way, but keep the file reviewable). Keep anything with a dash, colon, slash,
// bracket or dot — covers utilities, variants, arbitrary values and fractions.
const list = [...classes].filter((c) => /[-:[\]/.]/.test(c) || /^(flex|grid|block|inline|hidden|container|italic|underline|uppercase|lowercase|capitalize|truncate|antialiased|relative|absolute|fixed|sticky|static|visible|invisible|grow|shrink|border|rounded|shadow|transition|resize)$/.test(c)).sort();

await fs.writeFile(OUT, JSON.stringify(list, null, 1) + "\n");
console.log(
  `[safelist] Wrote ${list.length} classes from ${data.length} pages / ${translations} translations -> ${path.relative(root, OUT)}`
);
