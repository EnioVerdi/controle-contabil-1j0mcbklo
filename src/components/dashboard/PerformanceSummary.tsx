import { useState } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Cell,
  LabelList,
} from 'recharts'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const data = [
  { day: 'Sun', value: 110, label: '10%', type: 'revenue', isLoss: false },
  { day: 'Mon', value: 140, label: '', type: 'striped-blue', isLoss: false },
  { day: 'Tue', value: 95, label: '5%', type: 'revenue', isLoss: false },
  { day: 'Wed', value: 130, label: '-5%', type: 'striped-gray', isLoss: true },
  { day: 'Thu', value: 105, label: '10%', type: 'revenue', isLoss: false },
  { day: 'Fri', value: 155, label: '20%', type: 'revenue', isLoss: false },
  { day: 'Sat', value: 70, label: '-3%', type: 'revenue', isLoss: true },
]

const CustomLabel = (props: any) => {
  const { x, y, width, index } = props
  const entry = data[index]
  if (!entry.label) return null

  const isNegative = entry.isLoss
  const strokeColor = isNegative ? '#fca5a5' : '#86efac'
  const textColor = isNegative ? '#ef4444' : '#22c55e'

  return (
    <g transform={`translate(${x + width / 2},${y - 14})`}>
      <rect
        x="-18"
        y="-10"
        width="36"
        height="20"
        rx="10"
        fill="white"
        stroke={strokeColor}
        strokeWidth="1.5"
      />
      <text x="0" y="3" fill={textColor} fontSize="10" fontWeight="700" textAnchor="middle">
        {entry.label}
      </text>
    </g>
  )
}

export function PerformanceSummary() {
  const [period, setPeriod] = useState('Weekly')

  return (
    <div className="bg-white rounded-[24px] p-6 shadow-[0_2px_20px_rgba(0,0,0,0.02)] h-full flex flex-col">
      {/* SVG Definitions for Bar Patterns */}
      <svg width="0" height="0" className="absolute">
        <defs>
          <pattern
            id="stripe-blue"
            patternUnits="userSpaceOnUse"
            width="8"
            height="8"
            patternTransform="rotate(45)"
          >
            <rect width="8" height="8" fill="#eff6ff" />
            <line x1="0" y1="0" x2="0" y2="8" stroke="#3b82f6" strokeWidth="3" />
          </pattern>
          <pattern
            id="stripe-gray"
            patternUnits="userSpaceOnUse"
            width="8"
            height="8"
            patternTransform="rotate(45)"
          >
            <rect width="8" height="8" fill="#f8fafc" />
            <line x1="0" y1="0" x2="0" y2="8" stroke="#cbd5e1" strokeWidth="3" />
          </pattern>
        </defs>
      </svg>

      <div className="flex justify-between items-center mb-8">
        <h3 className="font-bold text-gray-900 text-lg">Performance Summary</h3>

        <div className="flex items-center gap-6">
          <div className="hidden sm:flex items-center gap-4 text-xs font-medium text-gray-500">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-sm bg-blue-500"></div>Revenue
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-sm bg-gray-200"></div>Expenses
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-8 h-4 rounded-full border border-green-300 flex items-center justify-center text-[8px] text-green-500 font-bold bg-white">
                Profit
              </div>
              <span className="text-red-400">/ Loss</span>
            </div>
          </div>

          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-[110px] h-9 text-xs rounded-xl border-gray-100 bg-gray-50">
              <SelectValue placeholder="Period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Weekly">Weekly</SelectItem>
              <SelectItem value="Monthly">Monthly</SelectItem>
              <SelectItem value="Yearly">Yearly</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex-1 w-full min-h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 20, right: 0, left: -20, bottom: 0 }} barSize={36}>
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
              tickFormatter={(val) => `$${val}`}
            />
            <Bar dataKey="value" radius={[8, 8, 8, 8]}>
              {data.map((entry, index) => {
                let fill = '#3b82f6'
                if (entry.type === 'striped-blue') fill = 'url(#stripe-blue)'
                if (entry.type === 'striped-gray') fill = 'url(#stripe-gray)'
                return <Cell key={`cell-${index}`} fill={fill} />
              })}
              <LabelList content={<CustomLabel />} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
