import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { KpiCard } from '@/components/dashboard/KpiCard'
import { PerformanceSummary } from '@/components/dashboard/PerformanceSummary'
import { TopCategories } from '@/components/dashboard/TopCategories'
import { TopUsersTable } from '@/components/dashboard/TopUsersTable'
import { ExpenseBreakdown } from '@/components/dashboard/ExpenseBreakdown'
import { Loader2 } from 'lucide-react'

export default function Dashboard() {
  const [empresas, setEmpresas] = useState<any[]>([])
  const [timeline, setTimeline] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

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

  // KPIs
  const totalEmpresas = empresas.length
  const tarefasConcluidas = timeline.filter((t) => t.status === 'concluido').length
  const tarefasPendentes = timeline.filter((t) => t.status !== 'concluido').length
  const taxaConclusao =
    timeline.length > 0 ? Math.round((tarefasConcluidas / timeline.length) * 100) : 0

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
    const monthTasks = timeline.filter((t) => t.mes === index + 1)
    const concluido = monthTasks.filter((t) => t.status === 'concluido').length
    const isLoss = concluido < monthTasks.length / 2
    return {
      day: mes,
      value: concluido,
      label: monthTasks.length > 0 ? `${Math.round((concluido / monthTasks.length) * 100)}%` : '',
      type: isLoss ? 'striped-gray' : 'revenue',
      isLoss,
    }
  })

  // Categories (by regime_tributario)
  const regimes = empresas.reduce(
    (acc, emp) => {
      const reg = emp.regime_tributario || 'Não Definido'
      acc[reg] = (acc[reg] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  const categoriesData = Object.entries(regimes)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([name, value]) => ({
      name,
      value,
      percent: Math.round((value / totalEmpresas) * 100),
    }))

  // Top Empresas
  const topEmpresasData = empresas
    .map((emp) => {
      const empTasks = timeline.filter((t) => t.empresa_id === emp.id)
      const concluido = empTasks.filter((t) => t.status === 'concluido').length
      return {
        id: emp.id,
        nome: emp.nome,
        concluidas: concluido,
        pendentes: empTasks.length - concluido,
        progresso: empTasks.length > 0 ? Math.round((concluido / empTasks.length) * 100) : 0,
      }
    })
    .sort((a, b) => b.progresso - a.progresso)
    .slice(0, 5)

  // Breakdown Data
  const breakdownStats = {
    total: timeline.length,
    concluido: tarefasConcluidas,
    pendente: timeline.filter((t) => t.status === 'nao_iniciado').length,
    aberto: timeline.filter((t) => t.status === 'aberto').length,
  }

  return (
    <div className="space-y-6 pb-10 animate-in fade-in duration-500 max-w-[1600px] mx-auto">
      {/* Top KPI Row */}
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          title="Total de Empresas"
          value={totalEmpresas}
          trend={12}
          progress={100}
          colorClass="bg-blue-100"
          progressColorClass="bg-blue-500"
        />
        <KpiCard
          title="Tarefas Concluídas"
          value={tarefasConcluidas}
          target={timeline.length.toString()}
          trend={5}
          progress={taxaConclusao}
          colorClass="bg-green-100"
          progressColorClass="bg-green-500"
        />
        <KpiCard
          title="Tarefas Pendentes"
          value={tarefasPendentes}
          trend={-2}
          progress={100 - taxaConclusao}
          colorClass="bg-yellow-100"
          progressColorClass="bg-yellow-400"
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
