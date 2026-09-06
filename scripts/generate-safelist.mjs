// Generate tailwind.safelist.json from the classes ACTUALLY used in published
// CMS content. Source of truth as of the 2026-09-01 "Lovable divorce" cutover
// is the git-tracked content/ tree (content/pages.json + content/<lang>/*.json
// + the content/page_translations.json mirror), rendered at runtime by
// src/pages/DynamicPage.tsx. Supabase is retired; this script no longer reads
// it (rewritten 2026-09-06 after the safelist was found stale since 2026-08-12,
// silently missing every class used in content published after the cutover).
//
// Why safelisting at all: the old tailwind.config.ts safelist used 5 broad
// regex patterns that expanded to ~96k rules / 8 MB of CSS, render-blocking on
// every page (mobile PSI 40, FCP 10.5s on the ad landing page). This script
// replaces the regexes with an explicit allowlist harvested from real content,
// so purge stays safe across every published article route.
//
// Usage: node scripts/generate-safelist.mjs
//  - Reads every translation's `content` field directly from content/<lang>/*.json
//    (falls back to content/page_translations.json for anything not mirrored
//    to a per-file layout, though today those two sources should agree).
//  - Extracts every token from class="..." attributes, plus classes referenced
//    in <style> blocks, and merges with the committed file (grow-only: a
//    deleted or edited page can never shrink the safelist).
//  - SAFETY: refuses to write if fewer than 10 translation files are found.
//
// Run this and rebuild whenever new CMS content uses classes that look
// unstyled. The committed tailwind.safelist.json is the build input; builds
// never hit the network for this.
import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const OUT = path.join(root, "tailwind.safelist.json");
const CONTENT_DIR = path.join(root, "content");

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

async function loadContentFiles() {
  const files = [];
  const langDirs = ["en", "br", "es"];
  for (const lang of langDirs) {
    const dir = path.join(CONTENT_DIR, lang);
    let entries;
    try {
      entries = await fs.readdir(dir);
    } catch {
      continue;
    }
    for (const name of entries) {
      if (!name.endsWith(".json")) continue;
      files.push(path.join(dir, name));
    }
  }
  return files;
}

const classes = new Set();
let translations = 0;

const contentFiles = await loadContentFiles();
for (const file of contentFiles) {
  try {
    const raw = JSON.parse(await fs.readFile(file, "utf8"));
    extractClasses(raw.content, classes);
    translations++;
  } catch (e) {
    console.error(`[safelist] Skipping unreadable file ${path.relative(root, file)}: ${e.message}`);
  }
}

// Also sweep the flat page_translations.json mirror, in case a translation
// exists there that hasn't (yet) been split into a per-language file, or vice
// versa — grow-only, so covering both sources can only help.
try {
  const pt = JSON.parse(await fs.readFile(path.join(CONTENT_DIR, "page_translations.json"), "utf8"));
  for (const rec of pt) {
    if (rec && typeof rec === "object" && rec.content) {
      extractClasses(rec.content, classes);
      translations++;
    }
  }
} catch (e) {
  console.error(`[safelist] Could not read page_translations.json mirror: ${e.message}`);
}

if (translations < 10) {
  console.error(
    `[safelist] Suspiciously small translation count (${translations}); aborting (kept existing file).`
  );
  process.exit(1);
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
  `[safelist] Wrote ${list.length} classes from ${translations} translations (${contentFiles.length} per-language files) -> ${path.relative(root, OUT)}`
);
