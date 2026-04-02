export interface Empresa {
  id: string
  nome: string
  logo?: string
  responsavel: string
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
}
