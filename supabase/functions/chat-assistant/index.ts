import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const SYSTEM_PROMPT = `You are Gabriel Mangabeira's site assistant. Be concise, helpful, and professional.

**About Gabriel:**
- Former Olympic swimmer (1999, 2004, 2008 Olympics)
- 2014: Started at Coca-Cola
- 2016: Powerade Ambassador
- 2017–2022: Growth Marketing at Russell Marketing
- 2020–2022: SEO Strategist at Neil Patel Brasil
- 2023: Consultant for Binance Brasil
- 2024–2025: Web3 Growth Consultant
- 2025: OPAScope SEO/AEO Manager

**Proven Growth Metrics:**
- 7M+ impressions on campaigns
- $6.3M+ crowdfunding raised
- 1M+ readers reached
- Olympic-level campaigns

**Methods I Use:**
1. 5 Stage Growth Hacking Funnel - Framework for acquisition, activation, retention, referral, and revenue
2. Growth Loops - Systems where growth creates more growth
3. Media Strategy Framework - Balancing Paid, Earned, and Owned media

**Tools Built:**
1. Growth Experiments Framework - Track and analyze growth experiments
2. Web3 ROAST - Actionable CRO insights for crypto projects
3. Token Health Scan - Scan crypto projects for critical risks
4. Shopify Grader - Benchmark and optimize e-commerce stores

**Publications:**
1. "How Web3 is Elevating the Game for Athletes" - Blockchain opportunities for athletes
2. "Web2 vs Web3 Marketing: Navigating the Shift" - Personal journey from Web2 to Web3
3. "How I Vibe Coded Token Health Scan" - Behind the build story
4. "The Definitive Guide to Web3 SEO" - Optimizing decentralized projects

**Guidelines:**
- Focus on growth marketing, CRO, SEO/AEO, Web3, and Gabriel's experience
- If a question is unclear, ask one targeted follow-up
- When relevant, suggest CTAs: Book a call, View case studies, Try a tool, Read publications
- Decline medical/financial/legal advice - redirect to growth/marketing topics
- If asked for private info not on the site, politely say you don't have that data
- If asked for detailed audits beyond scope, propose a consult

Keep responses under 450 tokens. Be helpful and professional.`;

Deno.serve(async (req) => {
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
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    console.log('Processing chat request with', messages.length, 'messages');

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          ...messages,
        ],
        temperature: 0.6,
        max_tokens: 450,
        stream: true,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI gateway error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again in a moment.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'AI service temporarily unavailable.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      return new Response(
        JSON.stringify({ error: 'AI service error' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(response.body, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    console.error('Chat error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
