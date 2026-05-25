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

### Option A — Manual via Lovable dashboard (always works)

1. Open https://lovable.dev/projects/0a284096-9804-4f63-a8a0-00f3274dbacd
2. Cloud → Edge functions
3. Ask Lovable AI in the chat box: *"Pull the latest commit on main from the connected GitHub repo and redeploy the changed edge functions in supabase/functions/."* Confirm with smoke test after.

### Option B — Programmatic via `lovable-mcp` (one-time setup)

Install CSVIVERDEIA's `lovable-mcp` (`npm i -g lovable-mcp`) and auth with a **Lovable.dev refresh token** (NOT a Supabase token). Get the refresh token via this Chrome DevTools console snippet at lovable.dev:

```js
(async()=>{const db=await new Promise(r=>{const req=indexedDB.open('firebaseLocalStorageDb');req.onsuccess=e=>r(e.target.result)});const tx=db.transaction('firebaseLocalStorage','readonly');const items=await new Promise(r=>{const req=tx.objectStore('firebaseLocalStorage').getAll();req.onsuccess=()=>r(req.result)});const t=items.find(i=>i.value?.stsTokenManager)?.value.stsTokenManager;console.log(t.refreshToken);copy(t.refreshToken)})()
```

Then Claude (or any MCP client) can deploy autonomously via `lovable_send_prompt` / `lovable_deploy`.

## Misleading aliases

- `LOVABLE_MCP_KEY` in our `.env` is **NOT** a Lovable.dev API key. It is the `X-MCP-Secret` for our own `mcp-content` Supabase edge function. Same value as `MANGABEIRA_MCP_SECRET`.
- The `mcp-content` MCP server is for content CRUD only (`list_pages`, `get_page`, `upsert_page`, `delete_page`, `upload_image`). It cannot deploy other edge functions.
