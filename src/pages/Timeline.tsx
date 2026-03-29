import { useState } from 'react'
import {
  CheckCircle2,
  XCircle,
  Hourglass,
  Check,
  ChevronsUpDown,
  Landmark,
  CalendarCheck,
  FileText,
  Users,
  TrendingDown,
  FileSpreadsheet,
  CreditCard,
  DollarSign,
  PieChart,
  Calculator,
} from 'lucide-react'
import { mockEmpresas } from '@/data/mockEmpresas'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type Status = 'concluido' | 'aberto' | 'nao_iniciado'

const MONTHS = [
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro',
]

const getStatusIcon = (status: Status) => {
  switch (status) {
    case 'concluido':
      return <CheckCircle2 className="w-6 h-6 text-green-600" />
    case 'aberto':
      return <XCircle className="w-6 h-6 text-red-600" />
    case 'nao_iniciado':
      return <Hourglass className="w-6 h-6 text-yellow-600" />
  }
}

const getStatusColor = (status: Status) => {
  switch (status) {
    case 'concluido':
      return 'border-green-200 bg-green-50 hover:border-green-300'
    case 'aberto':
      return 'border-red-200 bg-red-50 hover:border-red-300'
    case 'nao_iniciado':
      return 'border-yellow-200 bg-yellow-50 hover:border-yellow-300'
  }
}

const getStatusLabel = (status: Status) => {
  switch (status) {
    case 'concluido':
      return <span className="text-green-600">Concluído</span>
    case 'aberto':
      return <span className="text-red-600">Aberto</span>
    case 'nao_iniciado':
      return <span className="text-yellow-600">Pendente</span>
  }
}

const nextStatus = (status: Status): Status => {
  if (status === 'nao_iniciado') return 'aberto'
  if (status === 'aberto') return 'concluido'
  return 'nao_iniciado'
}

const InfoCard = ({ title, value, icon: Icon }: { title: string; value: string; icon: any }) => (
  <Card className="shadow-sm border-gray-100 hover:shadow-md transition-shadow">
    <CardContent className="p-4 flex items-start gap-3">
      <div className="p-2 bg-gray-50 rounded-lg text-gray-500">
        <Icon className="w-4 h-4" />
      </div>
      <div>
        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">{title}</p>
        <p className="font-semibold text-gray-900 text-sm mt-0.5">{value}</p>
      </div>
    </CardContent>
  </Card>
)

export default function Timeline() {
  const [selectedEmpresaId, setSelectedEmpresaId] = useState<string>(mockEmpresas[0]?.id || '')
  const [selectedAno, setSelectedAno] = useState<string>('2024')
  const [openCombobox, setOpenCombobox] = useState(false)

  // Mock state for timeline clicks
  const [timelineData, setTimelineData] = useState<Record<string, Status[]>>({})

  const empresa = mockEmpresas.find((e) => e.id === selectedEmpresaId)
  const currentKey = `${selectedEmpresaId}-${selectedAno}`
  const currentMonths = timelineData[currentKey] || Array(12).fill('nao_iniciado')

  const toggleMonth = (index: number) => {
    const newMonths = [...currentMonths]
    newMonths[index] = nextStatus(newMonths[index])
    setTimelineData((prev) => ({
      ...prev,
      [currentKey]: newMonths,
    }))
  }

  const concludedCount = currentMonths.filter((s) => s === 'concluido').length

  const formatBool = (val: boolean | undefined) => {
    if (val === true) return 'Sim'
    if (val === false) return 'Não'
    return 'Não informado'
  }

  return (
    <div className="space-y-6 animate-fade-in max-w-7xl mx-auto pb-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Timeline</h1>
          <p className="text-sm text-gray-500 mt-1">
            Acompanhe a evolução mensal e dados contábeis da empresa
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <Popover open={openCombobox} onOpenChange={setOpenCombobox}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={openCombobox}
                className="w-full sm:w-[300px] justify-between bg-white"
              >
                {empresa ? empresa.nome : 'Buscar empresa...'}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full sm:w-[300px] p-0">
              <Command
                filter={(value, search) => {
                  const emp = mockEmpresas.find((e) => e.id === value)
                  if (!emp) return 0
                  const match =
                    emp.nome.toLowerCase().includes(search.toLowerCase()) || emp.id.includes(search)
                  return match ? 1 : 0
                }}
              >
                <CommandInput placeholder="Buscar por nome ou código..." />
                <CommandList>
                  <CommandEmpty>Nenhuma empresa encontrada.</CommandEmpty>
                  <CommandGroup>
                    {mockEmpresas.map((emp) => (
                      <CommandItem
                        key={emp.id}
                        value={emp.id}
                        onSelect={(currentValue) => {
                          setSelectedEmpresaId(currentValue)
                          setOpenCombobox(false)
                        }}
                      >
                        <Check
                          className={cn(
                            'mr-2 h-4 w-4',
                            selectedEmpresaId === emp.id ? 'opacity-100' : 'opacity-0',
                          )}
                        />
                        <span className="font-mono text-xs text-gray-400 mr-2 w-6">{emp.id}</span>
                        {emp.nome}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>

          <Select value={selectedAno} onValueChange={setSelectedAno}>
            <SelectTrigger className="w-full sm:w-[120px] bg-white">
              <SelectValue placeholder="Ano" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2024">2024</SelectItem>
              <SelectItem value="2025">2025</SelectItem>
              <SelectItem value="2026">2026</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {empresa ? (
        <div className="space-y-6">
          <Card className="bg-white shadow-sm border-gray-100 overflow-hidden">
            <CardHeader className="bg-gray-50/50 border-b border-gray-100 pb-5">
              <CardTitle className="text-lg font-semibold text-gray-800 flex items-center justify-between">
                <span>Timeline Mensal - {selectedAno}</span>
                <span className="text-sm font-normal text-gray-500">
                  {empresa.nome} ({empresa.id})
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-10 pb-10 overflow-x-auto">
              <div className="relative min-w-[800px]">
                <div className="absolute top-[44px] left-[4%] right-[4%] h-[2px] bg-gray-100 -translate-y-1/2 z-0" />
                <div className="grid grid-cols-12 gap-2 relative z-10">
                  {MONTHS.map((month, idx) => {
                    const status = currentMonths[idx]
                    return (
                      <div
                        key={month}
                        className="flex flex-col items-center cursor-pointer group outline-none"
                        onClick={() => toggleMonth(idx)}
                        role="button"
                        tabIndex={0}
                      >
                        <div className="text-sm font-semibold text-gray-500 mb-3 group-hover:text-gray-900 transition-colors">
                          {month.substring(0, 3)}
                        </div>
                        <div
                          className={`w-14 h-14 rounded-full border-2 flex items-center justify-center transition-all duration-300 shadow-sm group-hover:scale-110 group-hover:shadow-md ${getStatusColor(
                            status,
                          )}`}
                        >
                          {getStatusIcon(status)}
                        </div>
                        <div className="mt-3 text-[10px] font-bold uppercase tracking-wider text-center h-8">
                          {getStatusLabel(status)}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </CardContent>
            <CardFooter className="bg-gray-50 border-t border-gray-100 p-5 rounded-b-xl flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                Progresso Anual
              </div>
              <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
                <div className="w-full sm:w-64 h-2.5 bg-gray-200 rounded-full overflow-hidden shrink-0">
                  <div
                    className="h-full bg-green-500 transition-all duration-500 ease-in-out"
                    style={{ width: `${(concludedCount / 12) * 100}%` }}
                  />
                </div>
                <Badge
                  variant="outline"
                  className="bg-white font-bold border-gray-200 shadow-sm shrink-0 px-3 py-1 text-sm"
                >
                  {concludedCount} de 12 meses concluídos
                </Badge>
              </div>
            </CardFooter>
          </Card>

          <div>
            <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 px-1">
              Informações Contábeis
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              <InfoCard
                title="Regime Tributário"
                value={empresa.regimeTributario || 'Não informado'}
                icon={Landmark}
              />
              <InfoCard
                title="Fechamento"
                value={empresa.fechamento || 'Não informado'}
                icon={CalendarCheck}
              />
              <InfoCard title="Fiscal" value={empresa.fiscal} icon={FileText} />
              <InfoCard title="Folha" value={empresa.regimeFolha || 'Não informado'} icon={Users} />
              <InfoCard
                title="Contabilização Folha"
                value={empresa.contabilizacaoFolha || 'Não informado'}
                icon={Calculator}
              />
              <InfoCard
                title="Depreciação"
                value={formatBool(empresa.depreciacao)}
                icon={TrendingDown}
              />
              <InfoCard
                title="Extratos"
                value={formatBool(empresa.extratos)}
                icon={FileSpreadsheet}
              />
              <InfoCard
                title="Parcelamentos"
                value={formatBool(empresa.parcelamentos)}
                icon={CreditCard}
              />
              <InfoCard
                title="Receita Financeira"
                value={formatBool(empresa.receitaFinanceira)}
                icon={DollarSign}
              />
              <InfoCard
                title="Distribuição de Lucro"
                value={formatBool(empresa.distribuicaoLucro)}
                icon={PieChart}
              />
            </div>
          </div>
        </div>
      ) : (
        <Card className="bg-white shadow-sm border-gray-100">
          <CardContent className="flex flex-col items-center justify-center min-h-[400px] text-gray-400">
            <Hourglass className="h-10 w-10 mb-4 opacity-20" />
            <p>Selecione uma empresa para visualizar a timeline e os dados contábeis</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
