import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { KpiCard } from '@/components/dashboard/KpiCard'
import { PerformanceSummary } from '@/components/dashboard/PerformanceSummary'
import { TopCategories } from '@/components/dashboard/TopCategories'
import { TopUsersTable } from '@/components/dashboard/TopUsersTable'
import { ExpenseBreakdown } from '@/components/dashboard/ExpenseBreakdown'
import { Loader2 } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export default function Dashboard() {
  const [empresas, setEmpresas] = useState<any[]>([])
  const [timeline, setTimeline] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear())

  useEffect(() => {
    async function loadData() {
      try {
        const [empRes, timeRes] = await Promise.all([
          supabase.from('empresas').select('*'),
          supabase.from('empresa_timeline').select('*'),
        ])
        setEmpresas(empRes.data || [])
        setTimeline(timeRes.data || [])
      } catch (error) {
        console.error('Erro ao carregar dados:', error)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  if (loading) {
    return (
      <div className="flex h-[400px] w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  // Filter timeline by the selected year
  const filteredTimeline = timeline.filter((t) => t.ano === selectedYear)

  // KPIs
  const totalEmpresas = empresas.length
  const tarefasEmAberto = filteredTimeline.filter((t) => t.status === 'aberto').length
  const tarefasConcluidas = filteredTimeline.filter((t) => t.status === 'concluido').length
  const tarefasPendentes = filteredTimeline.filter((t) => t.status === 'nao_iniciado').length
  const totalTarefasPendentesGlobal = timeline.filter((t) => t.status === 'nao_iniciado').length
  const totalTarefasAno = filteredTimeline.length
  const taxaConclusao =
    totalTarefasAno > 0 ? Math.round((tarefasConcluidas / totalTarefasAno) * 100) : 0

  // Chart Data (grouped by month 1-12)
  const mesesStr = [
    'Jan',
    'Fev',
    'Mar',
    'Abr',
    'Mai',
    'Jun',
    'Jul',
    'Ago',
    'Set',
    'Out',
    'Nov',
    'Dez',
  ]
  const chartData = mesesStr.map((mes, index) => {
    const monthTasks = filteredTimeline.filter((t) => t.mes === index + 1)
    const monthTasksGlobal = timeline.filter((t) => t.mes === index + 1)
    const concluido = monthTasks.filter((t) => t.status === 'concluido').length
    const aberto = monthTasks.filter((t) => t.status === 'aberto').length
    const pendente = monthTasksGlobal.filter((t) => t.status === 'nao_iniciado').length
    return {
      day: mes,
      concluido,
      aberto,
      pendente,
      total: concluido + aberto + pendente,
    }
  })

  // Categories (by regime_tributario)
  const targetRegimes = [
    'Lucro Real Mensal',
    'Lucro Real Trimestral',
    'Lucro Presumido',
    'Simples Nacional',
    'Simples Nacional Hibrido',
  ]

  const categoriesData = targetRegimes
    .map((regime) => {
      const value = empresas.filter((emp) => {
        const rt = emp.regime_tributario || ''
        if (regime === 'Simples Nacional Hibrido') {
          return rt === 'Simples Nacional Hibrido' || rt === 'Simples Nacional Híbrido'
        }
        return rt === regime
      }).length

      return {
        name: regime === 'Simples Nacional Hibrido' ? 'Simples Nacional Híbrido' : regime,
        value,
        percent: totalEmpresas > 0 ? Math.round((value / totalEmpresas) * 100) : 0,
      }
    })
    .sort((a, b) => b.value - a.value)

  // Top Empresas
  const topEmpresasData = empresas.map((emp) => {
    const empTasks = filteredTimeline.filter((t) => t.empresa_id === emp.id)
    const concluido = empTasks.filter((t) => t.status === 'concluido').length
    const aberto = empTasks.filter((t) => t.status === 'aberto').length
    const pendente = empTasks.filter((t) => t.status === 'nao_iniciado').length
    const total = empTasks.length
    return {
      id: emp.id,
      nome: emp.nome,
      concluidas: concluido,
      aberto,
      pendentes: pendente,
      progresso: total > 0 ? Math.round((concluido / total) * 100) : 0,
    }
  })

  // Breakdown Data
  const breakdownStats = {
    total: totalTarefasAno,
    concluido: tarefasConcluidas,
    pendente: tarefasPendentes,
    aberto: tarefasEmAberto,
  }

  return (
    <div className="space-y-6 pb-10 animate-in fade-in duration-500 max-w-[1600px] mx-auto">
      {/* Header & Year Filter */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500">
            Acompanhe os indicadores de performance e tarefas.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select
            value={selectedYear.toString()}
            onValueChange={(v) => setSelectedYear(parseInt(v))}
          >
            <SelectTrigger className="w-[120px] bg-white shadow-sm border-gray-200">
              <SelectValue placeholder="Ano" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2026">2026</SelectItem>
              <SelectItem value="2027">2027</SelectItem>
              <SelectItem value="2028">2028</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Top KPI Row */}
      <div className="grid gap-6 grid-cols-1 md:grid-cols-3 xl:grid-cols-5">
        <KpiCard
          title="Total de Empresas"
          value={totalEmpresas}
          trend={12}
          progress={100}
          colorClass="bg-blue-100"
          progressColorClass="bg-blue-500"
        />
        <KpiCard
          title="Tarefas Em Aberto"
          value={tarefasEmAberto}
          trend={-5}
          progress={totalTarefasAno ? Math.round((tarefasEmAberto / totalTarefasAno) * 100) : 0}
          colorClass="bg-orange-100"
          progressColorClass="bg-orange-500"
        />
        <KpiCard
          title="Tarefas Pendentes"
          value={totalTarefasPendentesGlobal}
          trend={-2}
          progress={
            timeline.length ? Math.round((totalTarefasPendentesGlobal / timeline.length) * 100) : 0
          }
          colorClass="bg-yellow-100"
          progressColorClass="bg-yellow-400"
        />
        <KpiCard
          title="Tarefas Concluídas"
          value={tarefasConcluidas}
          trend={5}
          progress={totalTarefasAno ? Math.round((tarefasConcluidas / totalTarefasAno) * 100) : 0}
          colorClass="bg-green-100"
          progressColorClass="bg-green-500"
        />
        <KpiCard
          title="Taxa de Conclusão"
          value={`${taxaConclusao}%`}
          trend={8}
          progress={taxaConclusao}
          colorClass="bg-purple-100"
          progressColorClass="bg-purple-500"
        />
      </div>

      {/* Middle Row: Charts */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <PerformanceSummary chartData={chartData} />
        </div>
        <div className="lg:col-span-1">
          <TopCategories categories={categoriesData} />
        </div>
      </div>

      {/* Bottom Row: Table & Visual Flow */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <TopUsersTable data={topEmpresasData} />
        </div>
        <div className="lg:col-span-1">
          <ExpenseBreakdown stats={breakdownStats} />
        </div>
      </div>
    </div>
  )
}
