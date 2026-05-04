import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.58.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const INDEXNOW_API_KEY = Deno.env.get('INDEXNOW_API_KEY');
const BASE_URL = 'https://mangabeira.net';

if (!INDEXNOW_API_KEY) {
  throw new Error('INDEXNOW_API_KEY environment variable not set');
}

const KEY_LOCATION = `${BASE_URL}/${INDEXNOW_API_KEY}.txt`;

interface IndexNowRequest {
  slug?: string;
}

interface IndexNowSubmission {
  host: string;
  key: string;
  keyLocation: string;
  urlList: string[];
}

async function requireAdmin(req: Request): Promise<Response | null> {
  const authHeader = req.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return new Response(JSON.stringify({ error: 'Missing authorization' }), {
      status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
  const anonClient = createClient(supabaseUrl, supabaseAnonKey, {
    global: { headers: { Authorization: authHeader } },
  });
  const { data: { user }, error: userError } = await anonClient.auth.getUser();
  if (userError || !user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
  const { data: isAdmin } = await anonClient.rpc('has_role', { _user_id: user.id, _role: 'admin' });
  if (!isAdmin) {
    return new Response(JSON.stringify({ error: 'Forbidden' }), {
      status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
  return null;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const authErr = await requireAdmin(req);
  if (authErr) return authErr;

  try {
    const { slug }: IndexNowRequest = await req.json();

    if (!slug || typeof slug !== 'string') {
      return new Response(
        JSON.stringify({ error: 'slug parameter is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    let urlsToSubmit: string[] = [];

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

      // Fetch page with translations
      const { data: page, error } = await supabase
        .from('pages')
        .select(`
          slug,
          translations:page_translations(language, slug)
        `)
        .eq('slug', slug)
        .eq('status', 'published')
        .single();

      if (error) {
        console.error('Error fetching page:', error);
        throw new Error(`Page not found: ${slug}`);
      }

      // Build URLs for all language variants
      const enSlug = page.slug;
      urlsToSubmit.push(`${BASE_URL}/${enSlug}`);

      const translations = page.translations || [];
      const brTranslation = translations.find((t: any) => t.language === 'br');
      const esTranslation = translations.find((t: any) => t.language === 'es');

      if (brTranslation?.slug) {
        urlsToSubmit.push(`${BASE_URL}/br/${brTranslation.slug}`);
      }
      if (esTranslation?.slug) {
        urlsToSubmit.push(`${BASE_URL}/es/${esTranslation.slug}`);
      }

      console.log(`Generated ${urlsToSubmit.length} URLs for slug: ${slug}`);

    // Submit to IndexNow API
    const submission: IndexNowSubmission = {
      host: 'mangabeira.net',
      key: INDEXNOW_API_KEY,
      keyLocation: KEY_LOCATION,
      urlList: urlsToSubmit,
    };

    console.log('Submitting to IndexNow:', JSON.stringify(submission, null, 2));

    const indexNowResponse = await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify(submission),
    });

    const responseText = await indexNowResponse.text();
    
    // IndexNow returns 200 for success, 202 for accepted
    if (indexNowResponse.ok) {
      console.log('IndexNow submission successful:', {
        status: indexNowResponse.status,
        statusText: indexNowResponse.statusText,
        body: responseText,
        urlCount: urlsToSubmit.length,
      });

      return new Response(
        JSON.stringify({
          success: true,
          status: indexNowResponse.status,
          message: 'URLs submitted to IndexNow successfully',
          urls: urlsToSubmit,
          urlCount: urlsToSubmit.length,
        }),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    } else {
      console.error('IndexNow submission failed:', {
        status: indexNowResponse.status,
        statusText: indexNowResponse.statusText,
        body: responseText,
      });

      return new Response(
        JSON.stringify({
          success: false,
          status: indexNowResponse.status,
          message: `IndexNow API error: ${indexNowResponse.statusText}`,
          details: responseText,
        }),
        {
          status: indexNowResponse.status,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }
  } catch (error) {
    console.error('Error in submit-indexnow function:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
