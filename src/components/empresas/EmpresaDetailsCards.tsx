import { Empresa } from '@/types/empresa'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Building2,
  User,
  ShieldCheck,
  Clock,
  Calendar,
  AlertCircle,
  CheckCircle2,
  XCircle,
  UserPlus,
} from 'lucide-react'

const BooleanStatus = ({ value }: { value?: boolean }) => {
  return value ? (
    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
  ) : (
    <XCircle className="w-5 h-5 text-slate-300" />
  )
}

interface Props {
  empresa: Empresa
  onTransfer: () => void
}

export function EmpresaDetailsCards({ empresa, onTransfer }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <Card className="shadow-sm border-slate-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Building2 className="w-4 h-4 text-blue-500" /> Dados Básicos
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <div className="flex flex-col">
            <span className="text-slate-500 mb-1">Código</span>
            <span className="font-medium text-slate-900">{empresa.id}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-slate-500 mb-1">Nome</span>
            <span className="font-medium text-slate-900">{empresa.nome}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-slate-500 mb-1">Atividade</span>
            <span className="font-medium text-slate-900">{empresa.atividade}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-slate-500 mb-1">Regime Tributário</span>
            <span className="font-medium text-slate-900">
              {empresa.regimeTributario || 'Não informado'}
            </span>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-sm border-slate-200">
        <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <User className="w-4 h-4 text-purple-500" /> Responsabilidade
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 text-xs px-2 text-purple-600 hover:text-purple-700 hover:bg-purple-50"
            onClick={onTransfer}
          >
            <UserPlus className="w-3 h-3 mr-1" /> Transferir
          </Button>
        </CardHeader>
        <CardContent className="space-y-4 text-sm pt-1">
          <div className="flex flex-col">
            <span className="text-slate-500 mb-1">Responsável Atual</span>
            <span className="font-medium text-slate-900">{empresa.responsavel}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-slate-500 mb-1">Novo Responsável</span>
            <span className="font-medium text-slate-900">
              {empresa.novoResponsavel || 'Nenhum'}
            </span>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-sm border-slate-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-500" /> Dados Fiscais
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <div className="flex flex-col">
            <span className="text-slate-500 mb-1">Fechamento</span>
            <span className="font-medium text-slate-900">
              {empresa.fechamento || 'Não informado'}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-slate-500 mb-1">Status Fiscal</span>
            <span className="font-medium text-slate-900">{empresa.fiscal}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-slate-500 mb-1">Regime de Folha</span>
            <span className="font-medium text-slate-900">
              {empresa.regimeFolha || 'Não informado'}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-slate-500 mb-1">Contabilização de Folha</span>
            <span className="font-medium text-slate-900">
              {empresa.contabilizacaoFolha || 'Não informado'}
            </span>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-sm border-slate-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-500" /> Contábeis
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-slate-600 font-medium">Depreciação</span>
            <BooleanStatus value={empresa.depreciacao} />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-600 font-medium">Extratos</span>
            <BooleanStatus value={empresa.extratos} />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-600 font-medium">Parcelamentos</span>
            <BooleanStatus value={empresa.parcelamentos} />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-600 font-medium">Distribuição de Lucro</span>
            <BooleanStatus value={empresa.distribuicaoLucro} />
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-sm border-slate-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Calendar className="w-4 h-4 text-indigo-500" /> Verificação
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <div className="flex flex-col">
            <span className="text-slate-500 mb-1">Período Verificado</span>
            <span className="font-medium text-slate-900">
              {empresa.periodoVerificado || 'Não informado'}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-slate-500 mb-1">Última Verificação</span>
            <span className="font-medium text-slate-900">
              {empresa.ultimaVerificacao || 'Não informado'}
            </span>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-sm border-slate-200 md:col-span-2 lg:col-span-1">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-500" /> Observações
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm">
          <p className="text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100 min-h-[100px]">
            {empresa.observacoes || 'Nenhuma observação registrada.'}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
