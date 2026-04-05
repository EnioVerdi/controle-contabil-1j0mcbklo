import 'jsr:@supabase/functions-js/edge-runtime.d.ts'
import { createClient } from 'jsr:@supabase/supabase-js@2'

export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, x-supabase-client-platform, apikey, content-type',
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Não autorizado (401). Token de autenticação ausente.' }),
        {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        },
      )
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL') || ''
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY') || ''

    const supabaseClient = createClient(supabaseUrl, supabaseKey, {
      global: { headers: { Authorization: authHeader } },
    })

    const {
      data: { user },
      error: userError,
    } = await supabaseClient.auth.getUser()
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Não autorizado (401). Usuário inválido ou token expirado.' }),
        {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        },
      )
    }

    let body
    try {
      body = await req.json()
    } catch (e) {
      return new Response(
        JSON.stringify({
          error: 'Requisição inválida (400). O corpo da requisição não é um JSON válido.',
        }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        },
      )
    }

    const { empresas, duplicateAction } = body

    if (!empresas || !Array.isArray(empresas) || empresas.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Requisição inválida (400). Array de empresas ausente ou vazio.' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        },
      )
    }

    // Verify user role
    const { data: profile } = await supabaseClient
      .from('profiles')
      .select('role_id, role')
      .eq('user_id', user.id)
      .maybeSingle()

    const role = (profile?.role_id || profile?.role || '').toLowerCase()
    if (role !== 'admin' && role !== 'contador') {
      return new Response(
        JSON.stringify({ error: 'Proibido (403). Você não tem permissão para importar empresas.' }),
        {
          status: 403,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        },
      )
    }

    const dbRecords = empresas.map((empresa: any) => ({
      id: empresa.id,
      nome: empresa.nome,
      atividade: empresa.atividade,
      regime_tributario: empresa.regimeTributario,
      fechamento: empresa.fechamento || null,
      responsavel: empresa.responsavel || 'A Definir',
      fiscal: 'Pendente',
    }))

    const { error: upsertError } = await supabaseClient.from('empresas').upsert(dbRecords, {
      onConflict: 'id',
      ignoreDuplicates: duplicateAction === 'skip',
    })

    if (upsertError) {
      return new Response(
        JSON.stringify({ error: `Erro ao salvar no banco (500): ${upsertError.message}` }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        },
      )
    }

    return new Response(JSON.stringify({ success: true, count: dbRecords.length }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message || 'Erro interno do servidor.' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
