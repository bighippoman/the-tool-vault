import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { json } = await req.json()

    if (!json || typeof json !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Invalid JSON input. Please provide a valid JSON string.' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Validate that the input is actually valid JSON
    try {
      JSON.parse(json)
    } catch (parseError) {
      return new Response(
        JSON.stringify({ error: 'Invalid JSON provided. Please fix the JSON first.' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    const openaiApiKey = Deno.env.get('OPENAI_API_KEY')
    if (!openaiApiKey) {
      return new Response(
        JSON.stringify({ error: 'OpenAI API key not configured' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are a JSON analysis expert. Analyze the provided JSON and give a helpful, concise description.

Your response should include:
1. A brief summary of what this JSON represents
2. The main data structure (object, array, nested structure)
3. Key fields and their purposes
4. Potential use cases or context
5. Any notable patterns or interesting aspects

Keep your response informative but concise (2-4 paragraphs max). Use clear, non-technical language when possible.`
          },
          {
            role: 'user',
            content: `Please analyze this JSON:\n\n${json}`
          }
        ],
        temperature: 0.3,
        max_tokens: 1000,
      }),
    })

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`)
    }

    const data = await response.json()
    const description = data.choices[0]?.message?.content?.trim()

    if (!description) {
      return new Response(
        JSON.stringify({ error: 'Failed to generate JSON description' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    return new Response(
      JSON.stringify({ description }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )

  } catch (error) {
    console.error('Describe JSON function error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error while analyzing JSON' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
