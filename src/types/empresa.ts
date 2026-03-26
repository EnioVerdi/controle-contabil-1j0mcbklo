export interface Empresa {
  id: string
  nome: string
  logo: string
  responsavel: string
  atividade: string
  fechamento: string
  fiscal: 'Regular' | 'Pendente'
  ultimaVerificacao: string
}
