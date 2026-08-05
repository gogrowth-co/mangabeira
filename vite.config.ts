import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { prerenderPlugin } from "./scripts/prerender";
import { mcpPlugin } from "@lovable.dev/mcp-js/stacks/supabase/vite";

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
