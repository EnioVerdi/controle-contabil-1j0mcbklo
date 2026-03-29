import { useState, useEffect } from 'react'
import { CheckCircle2, XCircle, Hourglass } from 'lucide-react'
import { fetchEmpresas } from '@/services/empresas'
import { Empresa } from '@/types/empresa'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

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

export default function Gestao() {
  const [empresas, setEmpresas] = useState<Empresa[]>([])
  const [selectedEmpresa, setSelectedEmpresa] = useState<string>('')
  const [selectedAno, setSelectedAno] = useState<string>('2024')

  // mock data structure to hold timeline statuses across different company/year selections
  const [timelineData, setTimelineData] = useState<Record<string, Status[]>>({})

  useEffect(() => {
    fetchEmpresas()
      .then((data) => {
        setEmpresas(data)
        if (data.length > 0 && !selectedEmpresa) {
          setSelectedEmpresa(data[0].id)
        }
      })
      .catch((err) => console.error('Erro ao buscar empresas:', err))
  }, [])

  const currentKey = `${selectedEmpresa}-${selectedAno}`
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

  return (
    <div className="space-y-6 animate-fade-in max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Gestão</h1>
          <p className="text-sm text-gray-500 mt-1">
            Acompanhe o progresso mensal e status consolidado das empresas
          </p>
        </div>

        <div className="flex gap-3 w-full sm:w-auto">
          <Select value={selectedEmpresa} onValueChange={setSelectedEmpresa}>
            <SelectTrigger className="w-full sm:w-[250px] bg-white">
              <SelectValue placeholder="Selecione a empresa" />
            </SelectTrigger>
            <SelectContent>
              {empresas.map((emp) => (
                <SelectItem key={emp.id} value={emp.id}>
                  {emp.nome}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedAno} onValueChange={setSelectedAno}>
            <SelectTrigger className="w-full sm:w-[110px] bg-white">
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

      {selectedEmpresa ? (
        <Card className="bg-white shadow-sm border-gray-100 overflow-hidden">
          <CardHeader className="bg-gray-50/50 border-b border-gray-100 pb-5">
            <CardTitle className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              Timeline de Atividades - {selectedAno}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-10 pb-10">
            <div className="relative">
              {/* Horizontal line connecting items */}
              <div className="absolute top-[44px] left-[4%] right-[4%] h-[2px] bg-gray-100 -translate-y-1/2 z-0 hidden lg:block" />

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-12 gap-y-10 gap-x-2 relative z-10">
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
                        className={`w-14 h-14 rounded-full border-2 flex items-center justify-center transition-all duration-300 shadow-sm group-hover:scale-110 group-hover:shadow-md ${getStatusColor(status)}`}
                      >
                        {getStatusIcon(status)}
                      </div>

                      <div className="mt-3 text-[10px] font-bold uppercase tracking-wider">
                        {getStatusLabel(status)}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </CardContent>
          <CardFooter className="bg-gray-50 border-t border-gray-100 p-5 rounded-b-xl flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="text-sm font-medium text-gray-500">Resumo do Ano</div>
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
              <div className="w-full sm:w-48 h-2.5 bg-gray-200 rounded-full overflow-hidden shrink-0">
                <div
                  className="h-full bg-green-500 transition-all duration-500 ease-in-out"
                  style={{ width: `${(concludedCount / 12) * 100}%` }}
                />
              </div>
              <Badge
                variant="outline"
                className="bg-white font-bold border-gray-200 shadow-sm shrink-0"
              >
                {concludedCount} de 12 meses concluídos
              </Badge>
            </div>
          </CardFooter>
        </Card>
      ) : (
        <Card className="bg-white shadow-sm border-gray-100">
          <CardContent className="flex flex-col items-center justify-center min-h-[400px] text-gray-400">
            <Hourglass className="h-10 w-10 mb-4 opacity-20" />
            <p>Selecione uma empresa para visualizar a gestão</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
