# Deploying edge functions

This Supabase project (`hetemmltaoirimmoxzku`) is **managed by Lovable Cloud**, not under Gabriel's personal Supabase account.

## What this means

- Personal access tokens (`sbp_*`) from `supabase.com/dashboard/account/tokens` **cannot** deploy functions here — the API returns `403 "Your account does not have the necessary privileges"`.
- The Supabase CLI (`supabase functions deploy`) **cannot** deploy here for the same reason.
- GitHub Actions using `SUPABASE_ACCESS_TOKEN` **cannot** deploy here. Any workflow attempting this will fail.

## How to deploy edge function changes

1. Open the Lovable project at https://lovable.dev/projects/0a284096-9804-4f63-a8a0-00f3274dbacd
2. Go to the **Cloud → Edge functions** tab.
3. Push the updated function code through Lovable's UI (paste the changed file or trigger a redeploy from the connected GitHub repo).

## Function changes currently pending Lovable redeploy

- `supabase/functions/regenerate-snapshot/index.ts` — adds service role key bypass for internal calls from `mcp-content`. Committed in `b804cf9`. Until deployed, `mcp-content`'s snapshot trigger fails silently with 401 and new articles return the homepage snapshot to bots.
