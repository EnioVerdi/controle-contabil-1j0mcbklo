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

    // 2. Verify caller is Admin
    const adminClient = createClient(supabaseUrl, serviceRoleKey)
    const { data: profile } = await adminClient
      .from('profiles')
      .select('role_id, role')
      .eq('user_id', user.id)
      .maybeSingle()

    const role = (profile?.role_id || profile?.role || '').toLowerCase()
    if (role !== 'admin') {
      throw new Error('Forbidden: Only admins can manage users')
    }

    const { action, userData } = await req.json()

    if (action === 'create') {
      // Create auth user
      const { data: authData, error: authError } = await adminClient.auth.admin.createUser({
        email: userData.email,
        password: userData.password,
        email_confirm: true,
        user_metadata: { name: userData.name, role: userData.role_id }
      })
      if (authError) throw authError

      // Sincroniza dados com a tabela de perfis
      const { error: profileError } = await adminClient.from('profiles').upsert({
        id: authData.user.id,
        user_id: authData.user.id,
        name: userData.name,
        email: userData.email,
        role_id: userData.role_id,
        role: userData.role_id,
        status: userData.status || 'Ativo'
      })
      if (profileError) throw profileError

      return new Response(JSON.stringify({ success: true, user: authData.user }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    if (action === 'update') {
      const { id, email, password, name, role_id, status } = userData
      
      // Procurar o auth.users.id correspondente ao profile.id
      const { data: profileToUpdate } = await adminClient.from('profiles').select('user_id').eq('id', id).single()
      const authId = profileToUpdate?.user_id || id

      const updateData: any = { email, user_metadata: { name, role: role_id } }
      if (password && password.trim() !== '') {
        updateData.password = password
      }

      const { error: authError } = await adminClient.auth.admin.updateUserById(authId, updateData)
      if (authError) throw authError

      const profileUpdate: any = {
        name,
        email,
        role_id,
        role: role_id
      }
      if (status) {
        profileUpdate.status = status
      }

      const { error: profileError } = await adminClient.from('profiles').update(profileUpdate).eq('id', id)
      if (profileError) throw profileError

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    if (action === 'delete') {
      const { id } = userData
      
      const { data: profileToDelete } = await adminClient.from('profiles').select('user_id').eq('id', id).single()
      const authId = profileToDelete?.user_id || id

      const { error: authError } = await adminClient.auth.admin.deleteUser(authId)
      if (authError) throw authError

      await adminClient.from('profiles').delete().eq('id', id)

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    throw new Error('Invalid action')
  } catch (error: any) {
    // Retornar 200 com a propriedade error para o front conseguir extrair a mensagem limpa
    return new Response(JSON.stringify({ error: error.message }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
