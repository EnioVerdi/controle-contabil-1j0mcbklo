import { supabase } from '@/lib/supabase/client'
import { Empresa } from '@/types/empresa'

const mapToEmpresa = (row: any): Empresa => ({
  id: row.id,
  nome: row.nome,
  logo: row.logo,
  responsavel: row.responsavel,
  atividade: row.atividade,
  fechamento: row.fechamento || undefined,
  fiscal: row.fiscal as 'Verificada' | 'Pendente',
  ultimaVerificacao: row.ultima_verificacao || undefined,
  regimeTributario: row.regime_tributario || undefined,
  novoResponsavel: row.novo_responsavel || undefined,
  regimeFolha: row.regime_folha || undefined,
  contabilizacaoFolha: row.contabilizacao_folha || undefined,
  depreciacao: row.depreciacao || false,
  extratos: row.extratos || false,
  parcelamentos: row.parcelamentos || false,
  distribuicaoLucro: row.distribuicao_lucro || false,
  periodoVerificado: row.periodo_verificado || undefined,
  observacoes: row.observacoes || undefined,
})

const mapToDbRow = (empresa: Partial<Empresa>) => {
  const row: any = {}
  if (empresa.id !== undefined) row.id = empresa.id
  if (empresa.nome !== undefined) row.nome = empresa.nome
  if (empresa.logo !== undefined) row.logo = empresa.logo
  if (empresa.responsavel !== undefined) row.responsavel = empresa.responsavel
  if (empresa.atividade !== undefined) row.atividade = empresa.atividade
  if (empresa.fechamento !== undefined) row.fechamento = empresa.fechamento
  if (empresa.fiscal !== undefined) row.fiscal = empresa.fiscal
  if (empresa.ultimaVerificacao !== undefined) row.ultima_verificacao = empresa.ultimaVerificacao
  if (empresa.regimeTributario !== undefined) row.regime_tributario = empresa.regimeTributario
  if (empresa.novoResponsavel !== undefined) row.novo_responsavel = empresa.novoResponsavel
  if (empresa.regimeFolha !== undefined) row.regime_folha = empresa.regimeFolha
  if (empresa.contabilizacaoFolha !== undefined)
    row.contabilizacao_folha = empresa.contabilizacaoFolha
  if (empresa.depreciacao !== undefined) row.depreciacao = empresa.depreciacao
  if (empresa.extratos !== undefined) row.extratos = empresa.extratos
  if (empresa.parcelamentos !== undefined) row.parcelamentos = empresa.parcelamentos
  if (empresa.distribuicaoLucro !== undefined) row.distribuicao_lucro = empresa.distribuicaoLucro
  if (empresa.periodoVerificado !== undefined) row.periodo_verificado = empresa.periodoVerificado
  if (empresa.observacoes !== undefined) row.observacoes = empresa.observacoes
  return row
}

export const fetchEmpresas = async (): Promise<Empresa[]> => {
  const { data, error } = await supabase
    .from('empresas')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return (data || []).map(mapToEmpresa)
}

export const fetchEmpresaById = async (id: string): Promise<Empresa> => {
  const { data, error } = await supabase.from('empresas').select('*').eq('id', id).single()
  if (error) throw error
  return mapToEmpresa(data)
}

export const createEmpresa = async (empresa: Empresa): Promise<Empresa> => {
  const dbRow = mapToDbRow(empresa)
  const { data, error } = await supabase.from('empresas').insert(dbRow).select().single()
  if (error) throw error
  return mapToEmpresa(data)
}

export const updateEmpresa = async (id: string, empresa: Partial<Empresa>): Promise<Empresa> => {
  const dbRow = mapToDbRow(empresa)
  delete dbRow.id // Prevents updating the primary key

  const { data, error } = await supabase
    .from('empresas')
    .update(dbRow)
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return mapToEmpresa(data)
}

export const deleteEmpresa = async (id: string): Promise<void> => {
  const { error } = await supabase.from('empresas').delete().eq('id', id)
  if (error) throw error
}
