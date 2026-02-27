exports.handler = async function () {
  try {
    const res = await fetch(
      'https://hetemmltaoirimmoxzku.supabase.co/storage/v1/object/public/blog-images/sitemap.xml'
    );

    if (!res.ok) {
      return { statusCode: 502, body: 'Failed to fetch sitemap from storage' };
    }

    const xml = await res.text();

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, s-maxage=3600, max-age=600',
        'X-Content-Type-Options': 'nosniff',
      },
      body: xml,
    };
  } catch (err) {
    console.error('Sitemap proxy error:', err);
    return { statusCode: 500, body: 'Internal error fetching sitemap' };
  }
};
