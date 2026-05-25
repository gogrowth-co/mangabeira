# Deploying edge functions to this project

This Supabase project (`hetemmltaoirimmoxzku`) is **managed by Lovable Cloud**.

## Constraint

Personal Supabase access tokens (`sbp_*`) generated at https://supabase.com/dashboard/account/tokens cannot deploy edge functions here. The CLI and the Supabase Management API both return:

```
HTTP 403
{"message":"Your account does not have the necessary privileges to access this endpoint."}
```

This was verified on 2026-05-25 with the canonical "Claude Code" token belonging to `gogrowth2024@gmail.com` / `gogrowth-co's Org`. The mangabeira Supabase project is in a different organization owned by Lovable, not by any of Gabriel's personal Supabase accounts.

GitHub Actions calling `supabase/setup-cli@v1` with a `SUPABASE_ACCESS_TOKEN` secret will hit the same 403. The `.github/workflows/deploy-functions.yml` workflow is therefore a **notification-only** workflow — it tells you a function changed and that a Lovable-side deploy is needed. It does not attempt the broken CLI deploy.

## What actually works

### Option A — One-word chat command in Lovable (canonical path, wired 2026-05-25)

Open https://lovable.dev/projects/0a284096-9804-4f63-a8a0-00f3274dbacd and type **`deploy`** (or `/redeploy-functions`, or `redeploy edge functions`) as a standalone message in the chat.

Lovable AI has been instructed (via project memory) to:
1. Diff `supabase/functions/**` between the currently-deployed state and `main`
2. Call its internal `supabase--deploy_edge_functions` tool with the list of changed function names
3. Smoke-test each one and report pass/fail

That's the entire flow. Single turn, no other input.

Confirmed limitations (verified by Lovable AI 2026-05-25):
- Lovable Cloud has **no** native git-push → edge function auto-deploy
- No webhook, no auto-sync toggle, no Lovable Cloud API to register a GitHub repo against
- GitHub→Lovable sync only pulls source files into the project tree — it does not trigger function deploys
- `supabase--deploy_edge_functions` only runs when Lovable AI is invoked in a chat turn

### Option B — Programmatic via `lovable-mcp` (deferred — not needed while Option A works)

CSVIVERDEIA's `lovable-mcp` would let Claude trigger Lovable AI without Gabriel pasting the chat command. Requires extracting a Firebase refresh token from lovable.dev via Chrome DevTools. Deferred indefinitely — Option A is one word and Just Works.

## Misleading aliases

- `LOVABLE_MCP_KEY` in our `.env` is **NOT** a Lovable.dev API key. It is the `X-MCP-Secret` for our own `mcp-content` Supabase edge function. Same value as `MANGABEIRA_MCP_SECRET`.
- The `mcp-content` MCP server is for content CRUD only (`list_pages`, `get_page`, `upsert_page`, `delete_page`, `upload_image`). It cannot deploy other edge functions.
