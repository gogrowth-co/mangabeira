import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Input validation constants
const MAX_CSV_SIZE = 500000; // 500KB max
const ALLOWED_LANGUAGES = ['br', 'es'];

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // Verify JWT - this function requires authentication
  const authHeader = req.headers.get('authorization');
  if (!authHeader) {
    return new Response(
      JSON.stringify({ error: 'Missing authorization header' }),
      { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  // Verify the user is authenticated and is an admin
  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } }
    });
    
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      console.log('Auth error:', userError?.message);
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if user has admin role
    const { data: hasAdminRole, error: roleError } = await supabase
      .rpc('has_role', { _user_id: user.id, _role: 'admin' });
    
    if (roleError || !hasAdminRole) {
      console.log('Not admin:', user.id);
      return new Response(
        JSON.stringify({ error: 'Forbidden - Admin access required' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Admin user verified:', user.id);
  } catch (authError) {
    console.error('Auth verification error:', authError);
    return new Response(
      JSON.stringify({ error: 'Authentication failed' }),
      { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  try {
    const { csvContent, targetLanguage } = await req.json();
    
    // Validate required fields
    if (!csvContent || typeof csvContent !== 'string') {
      return new Response(
        JSON.stringify({ error: 'csvContent is required and must be a string' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    if (!targetLanguage || typeof targetLanguage !== 'string') {
      return new Response(
        JSON.stringify({ error: 'targetLanguage is required and must be a string' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate CSV size
    if (csvContent.length > MAX_CSV_SIZE) {
      return new Response(
        JSON.stringify({ error: `CSV content exceeds maximum size of ${MAX_CSV_SIZE} bytes` }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate target language
    if (!ALLOWED_LANGUAGES.includes(targetLanguage)) {
      return new Response(
        JSON.stringify({ error: `Invalid target language. Allowed: ${ALLOWED_LANGUAGES.join(', ')}` }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY not configured");
    }

    // Create translation prompt based on target language
    const languageNames: { [key: string]: string } = {
      'br': 'Brazilian Portuguese',
      'es': 'Spanish (neutral/international)'
    };

    const systemPrompt = `You are a professional translator specializing in marketing and technical content. 
Translate the CSV content from English to ${languageNames[targetLanguage] || targetLanguage}.

CRITICAL RULES:
1. Maintain exact CSV structure: section,key,text,context
2. ONLY translate the "text" column - keep section, key, and context in English
3. Preserve all special characters, emojis, and formatting
4. Keep brand names, product names, and URLs unchanged (Binance, Coca-Cola, ChatGPT, etc.)
5. Maintain technical terminology consistency
6. For Brazilian Portuguese: Use "você" form, natural LATAM phrasing, and Brazilian spelling
7. For Spanish: Use neutral Spanish that works across all Spanish-speaking regions
8. Keep numbers and units as-is ($6M+, 1M+, etc.)
9. Preserve HTML entities and special formatting
10. Maintain tone: professional, achievement-focused, direct

Return ONLY the translated CSV with no additional commentary or markdown formatting.`;

    console.log(`Translating to ${targetLanguage}, content size: ${csvContent.length} bytes`);

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Translate this CSV to ${languageNames[targetLanguage]}:\n\n${csvContent}` }
        ],
        temperature: 0.3,
      }),
    });

    if (response.status === 429) {
      return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
        status: 429,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (response.status === 402) {
      return new Response(JSON.stringify({ error: "Payment required. Please add credits to Lovable AI." }), {
        status: 402,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI gateway error:', response.status, errorText);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const translatedContent = data.choices?.[0]?.message?.content;

    if (!translatedContent) {
      throw new Error("No translation returned from AI");
    }

    console.log(`Translation to ${targetLanguage} complete`);

    return new Response(JSON.stringify({ translatedContent }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Translation error:', error);
    return new Response(JSON.stringify({ 
      error: "Translation failed. Please try again." 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
