import "https://deno.land/std@0.224.0/dotenv/load.ts";
import { assertEquals } from "https://deno.land/std@0.224.0/assert/mod.ts";

const SUPABASE_URL = Deno.env.get("VITE_SUPABASE_URL")!;
const MCP_SECRET = Deno.env.get("MCP_CONTENT_SECRET");

const MCP_URL = `${SUPABASE_URL}/functions/v1/mcp-content`;

async function mcpCall(method: string, params: Record<string, unknown> = {}, id = 1) {
  const res = await fetch(MCP_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json, text/event-stream",
      "X-MCP-Secret": MCP_SECRET || "",
    },
    body: JSON.stringify({ jsonrpc: "2.0", id, method, params }),
  });
  const body = await res.text();
  return { status: res.status, body };
}

async function callTool(name: string, args: Record<string, unknown> = {}) {
  const { status, body } = await mcpCall("tools/call", { name, arguments: args });
  return { status, body, parsed: JSON.parse(body) };
}

const TEST_SLUG = `__mcp-test-${Date.now()}`;

Deno.test("1. Initialize MCP session", async () => {
  const { status, body } = await mcpCall("initialize", {
    protocolVersion: "2025-03-26",
    capabilities: {},
    clientInfo: { name: "test", version: "1.0.0" },
  });
  console.log("Init response:", body);
  assertEquals(status, 200);
});

Deno.test("2. upsert_page - create draft", async () => {
  const { status, parsed } = await callTool("upsert_page", {
    slug: TEST_SLUG,
    category: "test",
    translations: [
      { language: "en", title: "MCP Test Page", content: "<p>Test content</p>", meta_description: "Test" },
    ],
  });
  console.log("Upsert response:", JSON.stringify(parsed, null, 2));
  assertEquals(status, 200);
  const result = JSON.parse(parsed.result?.content?.[0]?.text || "{}");
  assertEquals(result.success, true);
  assertEquals(result.action, "created");
  assertEquals(result.status, "draft");
});

Deno.test("3. list_pages - verify test page appears", async () => {
  const { status, parsed } = await callTool("list_pages", { status: "all" });
  assertEquals(status, 200);
  const pages = JSON.parse(parsed.result?.content?.[0]?.text || "[]");
  const testPage = pages.find((p: any) => p.slug === TEST_SLUG);
  console.log("Found test page:", testPage);
  assertEquals(testPage?.status, "draft");
  assertEquals(testPage?.languages?.includes("en"), true);
});

Deno.test("4. get_page - verify full content", async () => {
  const { status, parsed } = await callTool("get_page", { slug: TEST_SLUG });
  assertEquals(status, 200);
  const page = JSON.parse(parsed.result?.content?.[0]?.text || "{}");
  console.log("Page slug:", page.slug, "translations:", page.translations?.length);
  assertEquals(page.slug, TEST_SLUG);
  assertEquals(page.translations?.[0]?.title, "MCP Test Page");
});

Deno.test("5. upsert_page - publish (triggers sitemap/rss/indexnow)", async () => {
  const { status, parsed } = await callTool("upsert_page", {
    slug: TEST_SLUG,
    category: "test",
    status: "published",
    translations: [
      { language: "en", title: "MCP Test Page Published", content: "<p>Published</p>" },
    ],
  });
  const result = JSON.parse(parsed.result?.content?.[0]?.text || "{}");
  console.log("Publish result:", JSON.stringify(result, null, 2));
  assertEquals(status, 200);
  assertEquals(result.success, true);
  assertEquals(result.action, "updated");
  assertEquals(result.status, "published");
  console.log("Triggers fired:", result.triggers_fired);
});

Deno.test("6. delete_page - cleanup", async () => {
  const { status, parsed } = await callTool("delete_page", { slug: TEST_SLUG });
  const result = JSON.parse(parsed.result?.content?.[0]?.text || "{}");
  console.log("Delete result:", result);
  assertEquals(status, 200);
  assertEquals(result.success, true);
});

Deno.test("7. get_page - verify deleted", async () => {
  const { status, parsed } = await callTool("get_page", { slug: TEST_SLUG });
  assertEquals(status, 200);
  const text = parsed.result?.content?.[0]?.text || "";
  console.log("After delete:", text);
  assertEquals(text.includes("not found"), true);
});
