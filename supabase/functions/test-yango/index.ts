import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7'

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
    const { apiKey, clientId, parkId } = await req.json()

    // Validate required parameters
    if (!apiKey || !clientId || !parkId) {
      return new Response(
        JSON.stringify({
          success: false,
          error: { message: 'Missing required parameters' },
          status: 400
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200 // Keep 200 to handle error in client
        }
      )
    }

    const response = await fetch('https://fleet.api.yango.com/v1/parks/driver-profiles/list', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'X-API-Key': apiKey,
        'X-Client-ID': clientId,
        'Accept-Language': 'en'
      },
      body: JSON.stringify({
        query: {
          park: {
            id: parkId
          }
        }
      })
    });

    const data = await response.json();

    // Return response with original status code and data
    return new Response(
      JSON.stringify({ 
        success: response.ok,
        status: response.status,
        data: response.ok ? data : null,
        error: !response.ok ? data : null
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 // Keep 200 to handle error in client
      }
    );
  } catch (error) {
    console.error('Error in test-yango function:', error);
    return new Response(
      JSON.stringify({ 
        success: false,
        error: { message: error.message || 'Internal server error' },
        status: 500
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 // Keep 200 to handle error in client
      }
    )
  }
})