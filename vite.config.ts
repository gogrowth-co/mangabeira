import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { prerenderPlugin } from "./scripts/prerender";

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
  // Expose .env values to Node-side build plugins via process.env (harmless
  // now that prerender reads only the local content/ store, kept for any
  // future build-time env needs).
  Object.assign(process.env, loadEnv(mode, process.cwd(), ""));

  return {
    server: {
      host: "::",
      port: 8080,
    },
    plugins: [
      react(),
      lpHeroPreloadPlugin(),
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
