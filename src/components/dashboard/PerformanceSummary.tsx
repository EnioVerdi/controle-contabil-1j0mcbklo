import { useState, useEffect } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { supabase } from '@/lib/supabase/client'

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/80 backdrop-blur-md border border-white/50 p-4 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
        <p className="font-semibold text-slate-800 mb-3 border-b border-slate-100 pb-2">{label}</p>
        <div className="flex flex-col gap-2">
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center justify-between gap-6 text-sm">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
                <span className="text-slate-600 font-medium">{entry.name}</span>
              </div>
              <span className="font-bold text-slate-900">{entry.value}</span>
            </div>
          ))}
        </div>
      </div>
    )
  }
  return null
}

export function PerformanceSummary({ chartData = [] }: { chartData?: any[] }) {
  const [period, setPeriod] = useState('Mensal')
  const [data, setData] = useState<any[]>([])

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // 1. Obter o total exato de empresas cadastradas no sistema
        const { count: totalEmpresas, error: countError } = await supabase
          .from('empresas')
          .select('id', { count: 'exact', head: true })

        if (countError) throw countError

        const total = totalEmpresas || 0
        const currentYear = new Date().getFullYear()

        // 2. Obter as tarefas/status da timeline para o ano atual
        const { data: timelineData, error: timelineError } = await supabase
          .from('empresa_timeline')
          .select('mes, status')
          .eq('ano', currentYear)

        if (timelineError) throw timelineError

        const months = [
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

        // 3. Processar os dados garantindo que todas as empresas sejam consideradas
        const processedData = months.map((monthName, index) => {
          const monthNumber = index + 1
          const monthRecords = timelineData?.filter((t) => t.mes === monthNumber) || []

          const concluido = monthRecords.filter((t) => t.status === 'concluido').length
          const aberto = monthRecords.filter((t) => t.status === 'aberto').length
          // Pendentes são o total de empresas menos as que já estão em andamento ou concluídas
          const pendente = Math.max(0, total - concluido - aberto)

          return {
            day: monthName,
            concluido,
            aberto,
            pendente,
          }
        })

        setData(processedData)
      } catch (error) {
        console.error('Erro ao buscar dados de desempenho:', error)
      }
    }

    fetchDashboardData()

    // Configurar realtime para manter o gráfico sempre atualizado
    const channel = supabase
      .channel('timeline_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'empresa_timeline' },
        fetchDashboardData,
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'empresas' },
        fetchDashboardData,
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const displayData =
    data.length > 0
      ? data
      : chartData.length > 0
        ? chartData
        : [{ day: 'Jan', concluido: 0, aberto: 0, pendente: 0 }]

  return (
    <div className="bg-white rounded-[24px] p-6 shadow-[0_2px_20px_rgba(0,0,0,0.02)] h-full flex flex-col">
      <div className="flex justify-between items-center mb-8">
        <h3 className="font-bold text-gray-900 text-lg">Resumo de Desempenho</h3>

        <div className="flex items-center gap-6">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-[110px] h-9 text-xs rounded-xl border-gray-100 bg-gray-50 hover:bg-gray-100 transition-colors">
              <SelectValue placeholder="Período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Semanal">Semanal</SelectItem>
              <SelectItem value="Mensal">Mensal</SelectItem>
              <SelectItem value="Anual">Anual</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex-1 w-full min-h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={displayData}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            barSize={48}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" opacity={0.5} />
            <XAxis
              dataKey="day"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 13, fill: '#64748b', fontWeight: 500 }}
              dy={15}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 13, fill: '#64748b', fontWeight: 500 }}
              dx={-10}
              tickFormatter={(val) => `${val}`}
            />
            <Tooltip cursor={{ fill: 'rgba(241, 245, 249, 0.4)' }} content={<CustomTooltip />} />
            <Legend
              verticalAlign="top"
              align="right"
              iconType="circle"
              wrapperStyle={{
                fontSize: '13px',
                fontWeight: 500,
                paddingBottom: '30px',
                color: '#475569',
              }}
            />
            <Bar dataKey="concluido" name="Concluídas" fill="#34d399" stackId="a" />
            <Bar dataKey="aberto" name="Abertas" fill="#fbbf24" stackId="a" />
            <Bar
              dataKey="pendente"
              name="Pendentes"
              fill="#a78bfa"
              stackId="a"
              radius={[8, 8, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
