import { supabase } from '@/lib/supabase/client'
import { Empresa } from '@/types/empresa'

export async function fetchEmpresas(): Promise<Empresa[]> {
  const { data, error } = await supabase.from('empresas').select('*')
  if (error) throw error
  return data.map(mapEmpresaFromDB)
}

async function validatePermission(action: string) {
  const { data, error } = await supabase.functions.invoke('check-permission', {
    body: { action },
  })
  if (error || !data?.allowed) {
    throw new Error('Você não tem permissão para realizar esta ação.')
  }
}

export async function createEmpresa(empresa: Empresa): Promise<Empresa> {
  await validatePermission('create_empresa')
  const { data, error } = await supabase
    .from('empresas')
    .insert(mapEmpresaToDB(empresa))
    .select()
    .single()
  if (error) throw error
  return mapEmpresaFromDB(data)
}

export async function updateEmpresa(id: string, empresa: Empresa): Promise<Empresa> {
  await validatePermission('edit_empresa')
  const { data, error } = await supabase
    .from('empresas')
    .update(mapEmpresaToDB(empresa))
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return mapEmpresaFromDB(data)
}

export async function deleteEmpresa(id: string): Promise<void> {
  await validatePermission('delete_empresa')
  const { error } = await supabase.from('empresas').delete().eq('id', id)
  if (error) throw error
}

function mapEmpresaFromDB(db: any): Empresa {
  return {
    id: db.id,
    nome: db.nome,
    logo: db.logo || '',
    responsavel: db.responsavel,
    atividade: db.atividade,
    fechamento: db.fechamento || '',
    fiscal: db.fiscal,
    ultimaVerificacao: db.ultima_verificacao || '',
    regimeTributario: db.regime_tributario || '',
    novoResponsavel: db.novo_responsavel || '',
    regimeFolha: db.regime_folha || '',
    contabilizacaoFolha: db.contabilizacao_folha || '',
    depreciacao: db.depreciacao || false,
    extratos: db.extratos || false,
    parcelamentos: db.parcelamentos || false,
    distribuicaoLucro: db.distribuicao_lucro || false,
    receitaFinanceira: db.receita_financeira || false,
    periodoVerificado: db.periodo_verificado || '',
    observacoes: db.observacoes || '',
  }
}

function mapEmpresaToDB(empresa: Empresa): any {
  return {
    id: empresa.id,
    nome: empresa.nome,
    logo: empresa.logo,
    responsavel: empresa.responsavel,
    atividade: empresa.atividade,
    fechamento: empresa.fechamento,
    fiscal: empresa.fiscal,
    ultima_verificacao: empresa.ultimaVerificacao,
    regime_tributario: empresa.regimeTributario,
    novo_responsavel: empresa.novoResponsavel,
    regime_folha: empresa.regimeFolha,
    contabilizacao_folha: empresa.contabilizacaoFolha,
    depreciacao: empresa.depreciacao,
    extratos: empresa.extratos,
    parcelamentos: empresa.parcelamentos,
    distribuicao_lucro: empresa.distribuicaoLucro,
    receita_financeira: empresa.receitaFinanceira,
    periodo_verificado: empresa.periodoVerificado,
    observacoes: empresa.observacoes,
  }
}
