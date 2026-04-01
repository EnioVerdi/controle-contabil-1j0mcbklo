import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  Legend,
} from 'recharts'

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899']

const CustomTooltipBubble = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload
    return (
      <div className="bg-white/80 backdrop-blur-md border border-white/50 p-4 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
        <div className="flex items-center gap-3">
          <span className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: data.fill }} />
          <span className="text-slate-600 font-medium">{data.name}:</span>
          <span className="font-bold text-slate-900">{data.value}</span>
        </div>
      </div>
    )
  }
  return null
}

export function RegimesTributariosChart({ data = [] }: { data?: any[] }) {
  const defaultRegimes = [
    { name: 'Lucro Real Mensal', value: 0 },
    { name: 'Lucro Real Trimestral', value: 0 },
    { name: 'Lucro Presumido', value: 0 },
    { name: 'Simples Nacional', value: 0 },
    { name: 'Simples Nacional Híbrido', value: 0 },
  ]

  const chartData = defaultRegimes.map((defaultItem, index) => {
    const existing = data.find((d) => d.name === defaultItem.name)
    return {
      name: defaultItem.name,
      value: existing ? existing.value : 0,
      index: index + 1,
      fill: COLORS[index],
    }
  })

  return (
    <div className="bg-white rounded-[24px] p-6 shadow-[0_2px_20px_rgba(0,0,0,0.02)] h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-bold text-gray-900 text-lg">Regimes Tributários</h3>
      </div>

      <div className="flex-1 w-full min-h-[300px] flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: -20 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" opacity={0.5} />
            <XAxis type="number" dataKey="index" hide domain={[0, 6]} />
            <YAxis
              type="number"
              dataKey="value"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 13, fill: '#64748b', fontWeight: 500 }}
              dx={-10}
            />
            <ZAxis type="number" dataKey="value" range={[150, 1200]} />
            <Tooltip
              cursor={{ strokeDasharray: '3 3', stroke: '#cbd5e1' }}
              content={<CustomTooltipBubble />}
            />
            <Legend
              verticalAlign="bottom"
              align="center"
              iconType="circle"
              wrapperStyle={{
                paddingTop: '20px',
                fontSize: '13px',
                fontWeight: 500,
                color: '#475569',
              }}
            />
            {chartData.map((entry, index) => (
              <Scatter key={entry.name} name={entry.name} data={[entry]} fill={entry.fill}>
                <Cell key={`cell-${index}`} fill={entry.fill} />
              </Scatter>
            ))}
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
