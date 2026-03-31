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

      <div className="flex-1 w-full min-h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: -20 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis type="number" dataKey="index" hide domain={[0, 6]} />
            <YAxis
              type="number"
              dataKey="value"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#94a3b8', fontWeight: 500 }}
            />
            <ZAxis type="number" dataKey="value" range={[100, 1000]} />
            <Tooltip
              cursor={{ strokeDasharray: '3 3' }}
              contentStyle={{
                borderRadius: '12px',
                border: 'none',
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                padding: '12px',
              }}
              formatter={(value: number, name: string, props: any) => [value, props.payload.name]}
            />
            <Legend
              verticalAlign="bottom"
              align="center"
              wrapperStyle={{ paddingTop: '20px', fontSize: '12px', fontWeight: 500 }}
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
