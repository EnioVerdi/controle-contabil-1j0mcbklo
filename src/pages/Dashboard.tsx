import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { KpiCard } from '@/components/dashboard/KpiCard'
import { PerformanceSummary } from '@/components/dashboard/PerformanceSummary'
import { TopCategories } from '@/components/dashboard/TopCategories'
import { TopUsersTable } from '@/components/dashboard/TopUsersTable'
import { ExpenseBreakdown } from '@/components/dashboard/ExpenseBreakdown'
import { Loader2 } from 'lucide-react'
import { syncEmpresaTimeline } from '@/services/timeline'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export default function Dashboard() {
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear())

  const loadData = async () => {
    try {
      await syncEmpresaTimeline(selectedYear).catch(console.error)
      const { data: rpcData, error } = await supabase.rpc('get_dashboard_stats' as any, {
        p_ano: selectedYear,
      })
      if (error) throw error
      setStats(rpcData)
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()

    const channel = supabase
      .channel('dashboard_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'empresa_timeline' }, () =>
        loadData(),
      )
      .on('postgres_changes', { event: '*', schema: 'public', table: 'empresas' }, () => loadData())
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [selectedYear])

  if (loading || !stats) {
    return (
      <div className="flex h-[400px] w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  // KPIs
  const totalEmpresas = stats.totalEmpresas || 0
  const tarefasEmAberto = stats.tarefasAnoAberto || 0
  const tarefasConcluidas = stats.tarefasAnoConcluido || 0
  const totalTarefasPendentesGlobal = stats.tarefasGlobalPendente || 0
  const totalTarefasAno = stats.tarefasAnoTotal || 0
  const taxaConclusao =
    totalTarefasAno > 0 ? Math.round((tarefasConcluidas / totalTarefasAno) * 100) : 0

  // Chart Data (grouped by month 1-12)
  const chartData = stats.chartData || []

  // Categories (by regime_tributario)
  const categoriesData = stats.categoriesData || []

  // Top Empresas
  const topEmpresasData = stats.topEmpresasData || []

  // Breakdown Data
  const breakdownStats = {
    total: stats.tarefasGlobalTotal || 0,
    concluido: stats.tarefasGlobalConcluido || 0,
    pendente: stats.tarefasGlobalPendente || 0,
    aberto: stats.tarefasGlobalAberto || 0,
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
            stats.tarefasGlobalTotal > 0
              ? Math.round((totalTarefasPendentesGlobal / stats.tarefasGlobalTotal) * 100)
              : 0
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
