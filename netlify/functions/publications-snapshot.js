// Same-origin fallback proxy to Supabase for publications.
// When client-side blockers (ad-blocker, VPN, firewall) prevent direct fetches
// to *.supabase.co, the frontend can fetch this from the same origin instead.
//
// Cached at the Netlify edge for 5 minutes to reduce load.

const SUPABASE_URL = 'https://hetemmltaoirimmoxzku.supabase.co';
const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhldGVtbWx0YW9pcmltbW94emt1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkzODE5NjEsImV4cCI6MjA3NDk1Nzk2MX0.Jh6v2KAxq6o4LYaqyqtiJna5i9mvmMazs51CZlLGdpI';

exports.handler = async () => {
  try {
    const url =
      `${SUPABASE_URL}/rest/v1/pages` +
      `?select=*,translations:page_translations(*)` +
      `&status=eq.published` +
      `&is_system_page=eq.false` +
      `&order=created_at.desc`;

    const res = await fetch(url, {
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      },
    });

    if (!res.ok) {
      const text = await res.text();
      return {
        statusCode: 502,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'upstream_failed', status: res.status, detail: text.slice(0, 500) }),
      };
    }

    const data = await res.json();

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'public, max-age=300, s-maxage=300, stale-while-revalidate=3600',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify(data),
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'snapshot_failed', message: err.message }),
    };
  }
};
