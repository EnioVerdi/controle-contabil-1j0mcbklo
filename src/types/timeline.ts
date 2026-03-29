export type StatusTimeline = 'concluido' | 'aberto' | 'nao_iniciado'

export interface EmpresaTimeline {
  id: string
  empresa_id: string
  ano: number
  mes: number
  status: StatusTimeline
  created_at: string
  updated_at: string
}
