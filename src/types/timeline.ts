export type StatusTimeline = 'concluido' | 'aberto' | 'nao_iniciado'

export interface ObservacaoTimeline {
  id: string
  empresa_id: string
  ano: number
  user_id: string
  observacao: string
  created_at: string
  profiles?: {
    name: string
  }
}
