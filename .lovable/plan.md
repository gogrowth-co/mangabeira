

# Lovable Security Hardening — Response to Pre-Nov 2025 Exposure Concern

This plan addresses the three concerns you raised: project visibility, secret rotation, and exposure auditing. It is scoped to what is actually in this codebase and what we control through Lovable + Lovable Cloud.

## Current state (verified)

- **Publish visibility**: `public` (anyone with the link can view the published site — expected) — but on legacy projects this also historically meant project source/chat could be enumerated via the public API. Setting visibility to `private` requires Business or Enterprise plan.
- **Secrets configured**: `LOVABLE_API_KEY`, `STRIPE_SECRET_KEY`, `NOTION_WEBHOOK_SECRET`, `INDEXNOW_API_KEY`, `MCP_CONTENT_SECRET`, `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_DB_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_PUBLISHABLE_KEY`.
- **RLS**: `pages`, `page_translations`, `user_roles` all have RLS enabled with admin-gated writes via `has_role(auth.uid(), 'admin')`. Public can only `SELECT` published rows. This is correct.
- **Anon key in repo**: hardcoded in `netlify/functions/publications-snapshot.js`, `src/integrations/supabase/client.ts` (auto-generated), and `.env`. Anon keys are designed to be public — only RLS protects data. No action needed on anon keys.

## Plan

### 1. Project privacy (manual — needs your decision)

`publish_visibility: private` is gated to Business/Enterprise. Two paths:
- **A.** Upgrade to Business and I'll flip visibility to `private` via tool.
- **B.** Stay on current plan — accept that the published site (`mangabeira.net`) stays publicly viewable (which is what you want for a marketing site anyway). The legacy concern is about the *Lovable project source/chat being readable*, not the deployed site. Manually verify by opening `https://lovable.dev/projects/0a284096-9804-4f63-a8a0-00f3274dbacd` in incognito — if it loads code, escalate to Lovable support.

I'll ask you which path before doing anything billing-related.

### 2. Rotate sensitive secrets (highest priority)

Rotate in this order, then I update the corresponding Lovable Cloud secret:

| Secret | Where to rotate | Risk if leaked |
|---|---|---|
| `SUPABASE_SERVICE_ROLE_KEY` | Lovable Cloud → Connectors → regenerate service role key | **Critical** — bypasses all RLS |
| `SUPABASE_DB_URL` | Same regeneration as above (contains DB password) | **Critical** — direct Postgres access |
| `STRIPE_SECRET_KEY` | Stripe Dashboard → Developers → API Keys → roll | Charge customers, refund, read PII |
| `NOTION_WEBHOOK_SECRET` | Generate new random string; update Notion webhook config | Forge CMS sync requests |
| `MCP_CONTENT_SECRET` | Generate new random string; update Claude MCP config | Unauthorized CMS writes |
| `INDEXNOW_API_KEY` | Bing Webmaster → regenerate; rename `public/<key>.txt` | Low — submit fake URLs |
| `LOVABLE_API_KEY` | Auto-managed by Lovable Cloud — leave as-is | N/A |

**Anon/publishable Supabase keys: do NOT rotate** — they're public by design and rotating breaks every client. Protection comes from RLS, which I verified is correctly configured.

### 3. Exposure audit (read-only investigation)

I'll run these checks and report findings:

- **Supabase auth + Postgres logs** — query last 48 days for: anomalous `SELECT` on `user_roles`, unexpected `INSERT/UPDATE/DELETE` on `pages` or `page_translations` from non-admin sessions, failed RLS denials on sensitive tables.
- **Edge function logs** — scan `mcp-content`, `sync-notion-content`, `translate-content` invocations for unauthorized auth attempts, secret-mismatch rejections, abnormal call volume.
- **Repo scan** — grep for accidentally committed secrets, hardcoded tokens, or PII in `src/`, `supabase/functions/`, `netlify/`, `public/`. Confirm only the (safe) anon key appears.
- **RLS sanity check** — re-run Supabase linter; verify no table accidentally has RLS off and no policy uses `true` / `qual is null`.

Deliverable: a short report listing any anomalies found with timestamps + IPs + recommended follow-up.

### 4. Defense-in-depth follow-ups (optional, after rotation)

- Tighten `chat-assistant` referer allowlist (currently allows `lovableproject.com` and `lovable.app` — fine for preview, can be removed once on production-only).
- Add a lightweight Supabase audit-log table + trigger on `user_roles` writes so future privilege changes are recorded.
- Consider removing the hardcoded anon key from `netlify/functions/publications-snapshot.js` and reading it from a Netlify env var instead (cosmetic — anon keys are public).

## Order of operations

1. You decide on visibility path (upgrade vs. accept public).
2. You rotate Stripe / Notion / IndexNow / Supabase service role in their respective dashboards.
3. You paste the new values; I update Lovable Cloud secrets via `add_secret`.
4. I generate new `MCP_CONTENT_SECRET` + `NOTION_WEBHOOK_SECRET` random values and update them.
5. I run the exposure audit (logs + repo scan + linter) and deliver the report.
6. Implement any defense-in-depth follow-ups you approve.

## Things I will NOT do

- Rotate or remove anon/publishable Supabase keys (designed public, RLS handles auth).
- Change RLS policies without explicit approval (current ones are correct).
- Touch `src/integrations/supabase/client.ts`, `src/integrations/supabase/types.ts`, or `.env` (auto-generated).
- Make any billing/plan changes without confirmation.

