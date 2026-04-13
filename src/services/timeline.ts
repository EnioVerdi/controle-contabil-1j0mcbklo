import { supabase } from '@/lib/supabase/client'
import { StatusTimeline, ObservacaoTimeline } from '@/types/timeline'

export async function fetchTimeline(empresaId: string, ano: number) {
  const { data, error } = await supabase
    .from('empresa_timeline')
    .select('*')
    .eq('empresa_id', empresaId)
    .eq('ano', ano)
  if (error) throw error
  return data
}

export async function fetchObservacoes(
  empresaId: string,
  ano: number,
): Promise<ObservacaoTimeline[]> {
  const { data, error } = await supabase
    .from('empresa_observacoes' as any)
    .select('*, profiles(name)')
    .eq('empresa_id', empresaId)
    .eq('ano', ano)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data as any
}

export async function addObservacao(
  empresaId: string,
  ano: number,
  observacao: string,
): Promise<ObservacaoTimeline> {
  const { data: perm, error: permError } = await supabase.functions.invoke('check-permission', {
    body: { action: 'edit_timeline' },
  })

  if (permError || !perm?.allowed) {
    throw new Error('Você não tem permissão para realizar esta ação.')
  }

  const { data: userData } = await supabase.auth.getUser()
  if (!userData.user) throw new Error('Usuário não autenticado.')

  const { data, error } = await supabase
    .from('empresa_observacoes' as any)
    .insert({
      empresa_id: empresaId,
      ano,
      observacao,
      user_id: userData.user.id,
    })
    .select('*, profiles(name)')
    .single()

  if (error) throw error
  return data as any
}

export async function fetchResumoMensal(ano: number) {
  const { data, error } = await supabase
    .from('empresa_timeline')
    .select('mes')
    .eq('ano', ano)
    .eq('status', 'concluido')

  if (error) throw error
  return data
}

export async function upsertTimelineMonth(
  empresaId: string,
  ano: number,
  mes: number,
  status: StatusTimeline,
) {
  const { data: perm, error: permError } = await supabase.functions.invoke('check-permission', {
    body: { action: 'edit_timeline' },
  })

  if (permError || !perm?.allowed) {
    throw new Error('Você não tem permissão para realizar esta ação.')
  }

  const data_conclusao = status === 'concluido' ? new Date().toISOString() : null

  const { data, error } = await supabase
    .from('empresa_timeline')
    .upsert(
      {
        empresa_id: empresaId,
        ano,
        mes,
        status,
        data_conclusao,
      } as any,
      { onConflict: 'empresa_id,ano,mes' },
    )
    .select()
    .single()

  if (error) throw error
  return data
}
