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
        JSON.stringify({ error: 'Invalid input. Please provide a string to fix.' }),
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
            content: `You are a JSON repair specialist. Your job is to fix malformed JSON and return only valid JSON.

Rules:
1. Fix common JSON syntax errors (missing quotes, trailing commas, unescaped characters)
2. Convert XML, CSV, or other formats to JSON when possible
3. Handle JavaScript object notation (unquoted keys, single quotes)
4. Return ONLY the fixed JSON - no explanations or markdown
5. If the input cannot be converted to valid JSON, return an empty object {}
6. Preserve the original data structure and values as much as possible
7. Use proper JSON formatting with double quotes for strings and keys`
          },
          {
            role: 'user',
            content: json
          }
        ],
        temperature: 0.1,
        max_tokens: 4000,
      }),
    })

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`)
    }

    const data = await response.json()
    const fixedJson = data.choices[0]?.message?.content?.trim()

    if (!fixedJson) {
      return new Response(
        JSON.stringify({ error: 'Failed to generate fixed JSON' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Validate that the response is actually valid JSON
    try {
      JSON.parse(fixedJson)
      return new Response(
        JSON.stringify({ fixed_json: fixedJson }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    } catch (parseError) {
      console.error('AI returned invalid JSON:', parseError)
      return new Response(
        JSON.stringify({ error: 'AI was unable to produce valid JSON from the input' }),
        { 
          status: 422, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

  } catch (error) {
    console.error('Fix JSON function error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error while fixing JSON' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
