// Proxies the generated llms.txt from Supabase storage with caching.
exports.handler = async function () {
  try {
    const res = await fetch(
      'https://hetemmltaoirimmoxzku.supabase.co/storage/v1/object/public/blog-images/llms.txt'
    );

    if (!res.ok) {
      return { statusCode: 502, body: 'Failed to fetch llms.txt from storage' };
    }

    const txt = await res.text();

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'public, s-maxage=3600, max-age=600',
        'X-Content-Type-Options': 'nosniff',
      },
      body: txt,
    };
  } catch (err) {
    console.error('llms.txt proxy error:', err);
    return { statusCode: 500, body: 'Internal error fetching llms.txt' };
  }
};
