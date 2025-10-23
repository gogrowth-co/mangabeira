import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // Referer check to prevent external abuse
  const referer = req.headers.get('referer') || '';
  const allowedDomains = [
    'mangabeira.net',
    'lovableproject.com',
    'localhost'
  ];

  const isAllowedReferer = allowedDomains.some(domain => 
    referer.includes(domain)
  );

  if (!isAllowedReferer && referer !== '') {
    return new Response(
      JSON.stringify({ error: 'Forbidden' }),
      { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  try {
    const { csvContent, targetLanguage } = await req.json();
    
    if (!csvContent || !targetLanguage) {
      throw new Error("csvContent and targetLanguage are required");
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

    console.log(`Translating to ${targetLanguage}...`);

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
        temperature: 0.3, // Lower temperature for more consistent translation
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
      error: error instanceof Error ? error.message : "Translation failed" 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});