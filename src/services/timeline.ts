import { supabase } from '@/lib/supabase/client'
import { StatusTimeline } from '@/types/timeline'

export async function fetchTimeline(empresaId: string, ano: number) {
  const { data, error } = await supabase
    .from('empresa_timeline')
    .select('*')
    .eq('empresa_id', empresaId)
    .eq('ano', ano)
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

  const { data, error } = await supabase
    .from('empresa_timeline')
    .upsert(
      {
        empresa_id: empresaId,
        ano,
        mes,
        status,
      },
      { onConflict: 'empresa_id,ano,mes' },
    )
    .select()
    .single()

  if (error) throw error
  return data
}
