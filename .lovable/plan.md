

# Updated Plan: MCP Content Server for Claude Code

Incorporates all decisions from your review.

## Step 1: Fix chat-assistant build error (separate commit)

Remove the `import "jsr:@supabase/functions-js/edge-runtime.d.ts"` line from `supabase/functions/chat-assistant/index.ts`. It pulls in `npm:openai` transitively. The function already uses `Deno.serve` which doesn't need this import. One-line deletion, verify build passes.

## Step 2: Create MCP edge function

**File:** `supabase/functions/mcp-content/index.ts`

Uses `mcp-lite@^0.10.0` + Hono over Streamable HTTP. Four tools:

### `list_pages`
- Optional `status` filter (all/published/draft)
- Returns: slug, status, category, languages available

### `get_page`
- Input: slug
- Returns: full page + all translations (content, meta, schema)

### `upsert_page`
- **Defaults to `status: "draft"`** unless explicitly set
- Accepts partial translations array (EN-only is fine)
- **Blocks overwrites on `is_system_page = true`** unless `force_system_page: true`
- `featured_image` accepts URL string only (no upload)
- On publish: triggers sitemap, RSS, IndexNow (reuses sync-notion-content pattern)
- **Request size limit: 200KB** — returns 413 with clear message if exceeded

### `delete_page`
- Blocks system pages
- Triggers sitemap/RSS regeneration

### Auth & Security
- Shared secret via `X-MCP-Secret` header, timing-safe comparison
- `verify_jwt = false` in config.toml
- Request size validation (200KB max)

### Supporting files
- `supabase/functions/mcp-content/deno.json` — import map pinning `mcp-lite` and `hono`
- Update `supabase/config.toml` with `[functions.mcp-content]`

## Step 3: Add `MCP_CONTENT_SECRET` secret

Prompt you to set a secret value via the add_secret tool.

## Step 4: Test with curl

Use the edge function curl tool to test all 4 tools:
1. `upsert_page` — create a draft page with EN translation
2. `list_pages` — verify it appears
3. `get_page` — verify full content
4. `upsert_page` — publish it, confirm sitemap/RSS/IndexNow fire
5. `delete_page` — clean up

## Step 5: Provide Claude Code MCP config

```json
{
  "mcpServers": {
    "mangabeira-content": {
      "type": "streamable-http",
      "url": "https://hetemmltaoirimmoxzku.supabase.co/functions/v1/mcp-content",
      "headers": { "X-MCP-Secret": "YOUR_SECRET" }
    }
  }
}
```

## Out of Scope
- Image uploads (use external upload, pass URL)
- Auto-translation (use existing `translate-content` function separately)

## Technical Notes
- mcp-lite ≥0.10.0 is confirmed Deno-compatible per Supabase docs. If deploy fails, fallback to `@modelcontextprotocol/sdk`.
- Pinned versions in deno.json for reproducibility.
- All DB access via service role key (same as sync-notion-content).

