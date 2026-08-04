import { auth, defineMcp } from "@lovable.dev/mcp-js";
import listPagesTool from "./tools/list-pages";
import getPageTool from "./tools/get-page";
import searchContentTool from "./tools/search-content";
import upsertPageTool from "./tools/upsert-page";

const projectRef = import.meta.env.VITE_SUPABASE_PROJECT_ID ?? "project-ref-unset";

export default defineMcp({
  name: "mangabeira",
  title: "mangabeira",
  version: "0.1.0",
  instructions:
    "Content tools for mangabeira.net. Use `list_pages` and `search_content` to find articles and system pages, `get_page` to read one page with all its translations (en/br/es), and `upsert_page` to create or update a page (drafts by default). Callers act as their own signed-in account.",
  auth: auth.oauth.issuer({
    issuer: `https://${projectRef}.supabase.co/auth/v1`,
    acceptedAudiences: "authenticated",
  }),
  tools: [listPagesTool, getPageTool, searchContentTool, upsertPageTool],
});
