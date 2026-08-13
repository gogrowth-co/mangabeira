import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { prerenderPlugin } from "./scripts/prerender";
import { mcpPlugin } from "@lovable.dev/mcp-js/stacks/supabase/vite";

// /lp/* mobile LCP fix (2026-08-12): the landing page's LCP element is the
// hero swimmer-butterfly.webp (79 KB), but as a React-imported <img> its
// download only starts after the JS bundle executes (~8.4s LCP on throttled
// mobile). Inject a tiny head script into index.html that preloads the hashed
// asset ONLY on /lp/* paths, so the fetch starts with the HTML instead.
// Route-conditional on purpose: index.html is shared by every route and other
// pages must not pay for this image.
function lpHeroPreloadPlugin() {
  return {
    name: "lp-hero-preload",
    apply: "build" as const,
    transformIndexHtml: {
      order: "post" as const,
      handler(html: string, ctx: { bundle?: Record<string, unknown> }) {
        const asset = Object.keys(ctx.bundle ?? {}).find((k) =>
          /swimmer-butterfly.*\.webp$/.test(k)
        );
        if (!asset) return html;
        const script =
          `<script>if(/^\\/lp(\\/|$)/.test(location.pathname)){` +
          `var l=document.createElement("link");l.rel="preload";l.as="image";` +
          `l.href="/${asset}";l.fetchPriority="high";document.head.appendChild(l);}</script>`;
        return html.replace("</head>", script + "\n  </head>");
      },
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Vite only exposes .env values through import.meta.env by default, not
  // process.env — but prerenderPlugin (scripts/prerender.ts) is a Node-side
  // build plugin that reads process.env.VITE_SUPABASE_URL / SUPABASE_URL etc
  // directly. Without this, those are always undefined at build time, the
  // Supabase fetch silently no-ops, and every publication route skips
  // prerendering (falls back to the homepage shell at origin). Merge the
  // loaded env into process.env so the Node-side plugin can see it.
  Object.assign(process.env, loadEnv(mode, process.cwd(), ""));

  return {
    server: {
      host: "::",
      port: 8080,
    },
    plugins: [
      react(),
      lpHeroPreloadPlugin(),
      mcpPlugin(),
      mode === "development" && componentTagger(),
      mode !== "development" && prerenderPlugin(),
    ].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});
