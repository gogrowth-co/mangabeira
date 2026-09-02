// emit-static-content.mjs — Phase 1 of the Lovable divorce.
//
// Materializes the in-repo content store (`content/`) into `public/` so the
// SPA reads everything from same-origin static JSON instead of Supabase:
//
//   public/content-index/{en,br,es}.json  — article list for the hubs
//   public/content-index/slug-map.json    — base slug -> {en,br,es} localized slugs
//   public/content/{lang}/<slug>.json     — full article (page + translation + alternates)
//   public/media/*                        — article images (referenced as /media/<name>)
//
// Runs via the npm `predev` / `prebuild` hooks. Everything it writes is
// generated output and is gitignored — `content/` stays the source of truth.
import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const CONTENT = path.join(ROOT, "content");
const PUBLIC = path.join(ROOT, "public");
const LOCALES = ["en", "br", "es"];

async function readJson(p) {
  return JSON.parse(await fs.readFile(p, "utf8"));
}

// Featured images were uploaded to the (retiring) Supabase `blog-images`
// bucket; Phase 0 mirrored every file into content/media. Rewrite those URLs
// to the same-origin /media/ copy so nothing references the dead project.
function rewriteFeaturedImage(url) {
  if (!url || !/supabase\.co\/storage\//.test(url)) return url ?? null;
  const name = url.split("/").pop();
  return name ? `https://mangabeira.net/media/${name}` : url;
}

async function loadContent() {
  const pages = await readJson(path.join(CONTENT, "pages.json"));
  const byPageId = new Map(
    pages.map((p) => [
      p.id,
      { ...p, featured_image: rewriteFeaturedImage(p.featured_image), translations: [] },
    ])
  );
  for (const locale of LOCALES) {
    const dir = path.join(CONTENT, locale);
    for (const file of await fs.readdir(dir)) {
      if (!file.endsWith(".json")) continue;
      const tr = await readJson(path.join(dir, file));
      const page = byPageId.get(tr.page_id);
      if (page) page.translations.push(tr);
    }
  }
  return [...byPageId.values()];
}

function lightTranslation(tr) {
  return {
    language: tr.language,
    title: tr.title,
    meta_description: tr.meta_description ?? null,
    slug: tr.slug ?? null,
    featured_image_alt: tr.featured_image_alt ?? null,
  };
}

async function main() {
  const all = await loadContent();
  const published = all.filter((p) => p.status === "published");
  const articles = published.filter((p) => !p.is_system_page);

  // --- content-index/{locale}.json (newest first, like the old Supabase query)
  const indexDir = path.join(PUBLIC, "content-index");
  await fs.rm(indexDir, { recursive: true, force: true });
  await fs.mkdir(indexDir, { recursive: true });

  const indexRows = [...articles]
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .map((p) => ({
      id: p.id,
      slug: p.slug,
      category: p.category,
      status: p.status,
      featured_image: p.featured_image,
      author_name: p.author_name,
      reading_time: p.reading_time,
      tags: p.tags || [],
      view_count: p.view_count ?? 0, // frozen popularity counter
      is_featured: p.is_featured ?? false,
      read_time: p.read_time,
      is_system_page: p.is_system_page,
      created_at: p.created_at,
      updated_at: p.updated_at,
      translations: (p.translations || []).map(lightTranslation),
    }));

  for (const locale of LOCALES) {
    await fs.writeFile(
      path.join(indexDir, `${locale}.json`),
      JSON.stringify(indexRows),
      "utf8"
    );
  }

  // --- content-index/slug-map.json (base slug -> localized slugs)
  const slugMap = {};
  for (const p of published) {
    const locales = { en: p.slug, br: p.slug, es: p.slug };
    for (const tr of p.translations || []) {
      if (LOCALES.includes(tr.language) && tr.slug) locales[tr.language] = tr.slug;
    }
    slugMap[p.slug] = locales;
  }
  await fs.writeFile(
    path.join(indexDir, "slug-map.json"),
    JSON.stringify(slugMap),
    "utf8"
  );

  // --- content/{lang}/<slug>.json (full article documents)
  const contentOut = path.join(PUBLIC, "content");
  await fs.rm(contentOut, { recursive: true, force: true });
  let docCount = 0;
  for (const locale of LOCALES) {
    const dir = path.join(contentOut, locale);
    await fs.mkdir(dir, { recursive: true });
    for (const p of published) {
      const tr = (p.translations || []).find((t) => t.language === locale);
      if (!tr) continue;
      const alternates = {};
      for (const t of p.translations || []) {
        if (LOCALES.includes(t.language)) alternates[t.language] = t.slug || p.slug;
      }
      const { translations: _drop, ...pageRow } = p;
      const doc = { page: pageRow, translation: tr, alternates };
      const json = JSON.stringify(doc);
      const names = new Set([tr.slug || p.slug, p.slug]); // localized + base-slug alias
      for (const name of names) {
        await fs.writeFile(path.join(dir, `${name}.json`), json, "utf8");
        docCount++;
      }
    }
  }

  // --- media
  const mediaSrc = path.join(CONTENT, "media");
  const mediaOut = path.join(PUBLIC, "media");
  await fs.rm(mediaOut, { recursive: true, force: true });
  await fs.cp(mediaSrc, mediaOut, { recursive: true });
  const mediaCount = (await fs.readdir(mediaOut)).length;

  console.log(
    `[emit-static-content] ${indexRows.length} index rows x ${LOCALES.length} locales, ` +
      `${Object.keys(slugMap).length} slug-map entries, ${docCount} article docs, ${mediaCount} media files.`
  );
}

main().catch((e) => {
  console.error("[emit-static-content] failed:", e);
  process.exit(1);
});
