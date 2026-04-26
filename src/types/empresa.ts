export interface Empresa {
  id: string
  nome: string
  cnpj?: string
  logo?: string
  responsavel?: string
  responsavel_id?: string | null
  atividade: string
  fechamento?: string
  fiscal: string
  ultimaVerificacao?: string
  regimeTributario?: string
  novoResponsavel?: string
  regimeFolha?: string
  contabilizacaoFolha?: string
  depreciacao?: boolean
  extratos?: boolean
  parcelamentos?: boolean
  distribuicaoLucro?: boolean
  receitaFinanceira?: boolean
  periodoVerificado?: string
  observacoes?: string
  temposOrcados?: Record<number, number>
}
