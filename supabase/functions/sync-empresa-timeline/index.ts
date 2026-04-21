import 'jsr:@supabase/functions-js/edge-runtime.d.ts'
import { createClient } from 'jsr:@supabase/supabase-js@2'

export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, x-supabase-client-platform, apikey, content-type',
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) throw new Error('Missing Authorization header')

    const supabaseUrl = Deno.env.get('SUPABASE_URL') || ''
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY') || ''
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''

    // 1. Authenticate caller
    const userClient = createClient(supabaseUrl, supabaseKey, {
      global: { headers: { Authorization: authHeader } },
    })
    const { data: { user }, error: userError } = await userClient.auth.getUser()
    if (userError || !user) throw new Error('Not authenticated')

    const body = await req.json().catch(() => ({}))
    const ano = body.ano || new Date().getFullYear()

    const adminClient = createClient(supabaseUrl, serviceRoleKey)

    // Fetch all companies
    const { data: empresas, error: empresasError } = await adminClient.from('empresas').select('id')
    if (empresasError) throw empresasError

    if (!empresas || empresas.length === 0) {
      return new Response(JSON.stringify({ success: true, count: 0 }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const timelineInserts = []
    for (const empresa of empresas) {
      for (let mes = 1; mes <= 12; mes++) {
        timelineInserts.push({
          empresa_id: empresa.id,
          ano,
          mes,
          status: 'nao_iniciado'
        })
      }
    }

    // Batch insert in chunks of 1000 to avoid limits
    const chunkSize = 1000;
    for (let i = 0; i < timelineInserts.length; i += chunkSize) {
      const chunk = timelineInserts.slice(i, i + chunkSize);
      const { error: insertError } = await adminClient
        .from('empresa_timeline')
        .upsert(chunk, { onConflict: 'empresa_id,ano,mes', ignoreDuplicates: true })
      
      if (insertError) throw insertError
    }

    return new Response(JSON.stringify({ success: true, count: timelineInserts.length }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
