import 'jsr:@supabase/functions-js/edge-runtime.d.ts'
import { createClient } from 'jsr:@supabase/supabase-js@2'

export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, x-supabase-client-platform, apikey, content-type',
}

const ROLES_PERMISSIONS: Record<string, string[]> = {
  admin: ['*'],
  contador: ['create_empresa', 'edit_empresa', 'delete_empresa', 'edit_timeline'],
  gerente: [],
  consultor: [],
  user: [],
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

    const supabaseClient = createClient(supabaseUrl, supabaseKey, {
      global: { headers: { Authorization: authHeader } },
    })

    const {
      data: { user },
      error: userError,
    } = await supabaseClient.auth.getUser()
    if (userError || !user) throw new Error('Not authenticated')

    const { data: profile } = await supabaseClient
      .from('profiles')
      .select('role_id, role')
      .eq('id', user.id)
      .single()

    const role = (profile?.role_id || profile?.role || 'consultor').toLowerCase()

    let action = ''
    try {
      const body = await req.json()
      action = body.action
    } catch (e) {
      throw new Error('Invalid request body')
    }

    const allowedActions = ROLES_PERMISSIONS[role] || []
    const allowed = allowedActions.includes('*') || allowedActions.includes(action)

    if (!allowed) {
      return new Response(JSON.stringify({ allowed: false, error: 'Unauthorized' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    return new Response(JSON.stringify({ allowed, role }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
