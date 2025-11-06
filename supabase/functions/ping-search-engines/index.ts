const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const sitemapUrl = 'https://mangabeira.net/sitemap.xml';
    const results = [];

    // Ping Google
    try {
      const googleUrl = `https://www.google.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`;
      const googleResponse = await fetch(googleUrl);
      results.push({
        engine: 'Google',
        status: googleResponse.status,
        success: googleResponse.ok,
      });
      console.log('Pinged Google:', googleResponse.status);
    } catch (error) {
      console.error('Error pinging Google:', error);
      results.push({
        engine: 'Google',
        error: error.message,
        success: false,
      });
    }

    // Ping Bing
    try {
      const bingUrl = `https://www.bing.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`;
      const bingResponse = await fetch(bingUrl);
      results.push({
        engine: 'Bing',
        status: bingResponse.status,
        success: bingResponse.ok,
      });
      console.log('Pinged Bing:', bingResponse.status);
    } catch (error) {
      console.error('Error pinging Bing:', error);
      results.push({
        engine: 'Bing',
        error: error.message,
        success: false,
      });
    }

    return new Response(JSON.stringify({ results }), {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error in ping-search-engines:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
