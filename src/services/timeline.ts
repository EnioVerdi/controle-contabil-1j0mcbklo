import { supabase } from '@/lib/supabase/client'
import { EmpresaTimeline, StatusTimeline } from '@/types/timeline'

export const fetchTimeline = async (empresaId: string, ano: number): Promise<EmpresaTimeline[]> => {
  const { data, error } = await supabase
    .from('empresa_timeline')
    .select('*')
    .eq('empresa_id', empresaId)
    .eq('ano', ano)

  if (error) throw error
  return data as EmpresaTimeline[]
}

export const upsertTimelineMonth = async (
  empresaId: string,
  ano: number,
  mes: number,
  status: StatusTimeline,
): Promise<EmpresaTimeline> => {
  const { data, error } = await supabase
    .from('empresa_timeline')
    .upsert(
      {
        empresa_id: empresaId,
        ano,
        mes,
        status,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'empresa_id,ano,mes' },
    )
    .select()
    .single()

  if (error) throw error
  return data as EmpresaTimeline
}
