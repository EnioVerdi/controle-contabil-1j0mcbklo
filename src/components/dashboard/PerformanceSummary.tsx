import { useState } from 'react'
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

export function PerformanceSummary({ chartData = [] }: { chartData?: any[] }) {
  const [period, setPeriod] = useState('Mensal')

  const displayData =
    chartData.length > 0 ? chartData : [{ day: 'Jan', concluido: 0, aberto: 0, pendente: 0 }]

  return (
    <div className="bg-white rounded-[24px] p-6 shadow-[0_2px_20px_rgba(0,0,0,0.02)] h-full flex flex-col">
      <div className="flex justify-between items-center mb-8">
        <h3 className="font-bold text-gray-900 text-lg">Resumo de Desempenho</h3>

        <div className="flex items-center gap-6">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-[110px] h-9 text-xs rounded-xl border-gray-100 bg-gray-50">
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

      <div className="flex-1 w-full min-h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={displayData}
            margin={{ top: 20, right: 0, left: -20, bottom: 0 }}
            barSize={12}
            barGap={2}
          >
            <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#f1f5f9" />
            <XAxis
              dataKey="day"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#94a3b8', fontWeight: 500 }}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#94a3b8', fontWeight: 500 }}
              tickFormatter={(val) => `${val}`}
            />
            <Tooltip
              cursor={{ fill: 'rgba(241, 245, 249, 0.4)' }}
              contentStyle={{
                borderRadius: '12px',
                border: 'none',
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              }}
            />
            <Legend
              verticalAlign="top"
              align="right"
              iconType="circle"
              wrapperStyle={{ fontSize: '12px', fontWeight: 500, paddingBottom: '20px' }}
            />
            <Bar dataKey="concluido" name="Concluídas" fill="#22c55e" radius={[4, 4, 0, 0]} />
            <Bar dataKey="aberto" name="Abertas" fill="#eab308" radius={[4, 4, 0, 0]} />
            <Bar dataKey="pendente" name="Pendentes" fill="#94a3b8" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
