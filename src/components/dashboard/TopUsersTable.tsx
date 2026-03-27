import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { cn } from '@/lib/utils'

const initialData = [
  { id: 1, name: 'NexaCorp', paid: 18400, spend: 6100, status: 'Active' },
  { id: 2, name: 'MonoTech', paid: 11200, spend: 3200, status: 'At Risk' },
  { id: 3, name: 'NexaCorp', paid: 18400, spend: 6100, status: 'Active' },
  { id: 4, name: 'MonoTech', paid: 11200, spend: 3200, status: 'At Risk' },
]

export function TopUsersTable() {
  const [period, setPeriod] = useState('Monthly')
  const [data] = useState(initialData)

  return (
    <div className="bg-white rounded-[24px] p-6 shadow-[0_2px_20px_rgba(0,0,0,0.02)] h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-gray-900 text-lg">Top Users</h3>
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

      <div className="flex-1 overflow-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-b-0 hover:bg-transparent">
              <TableHead className="text-xs font-semibold text-gray-900 h-10 px-2 cursor-pointer group">
                <div className="flex items-center gap-1">
                  User Name{' '}
                  <ChevronDown className="w-3 h-3 text-gray-400 group-hover:text-gray-900 transition-colors" />
                </div>
              </TableHead>
              <TableHead className="text-xs font-semibold text-gray-900 h-10 px-2 cursor-pointer group">
                <div className="flex items-center gap-1">
                  Total Paid{' '}
                  <ChevronDown className="w-3 h-3 text-gray-400 group-hover:text-gray-900 transition-colors" />
                </div>
              </TableHead>
              <TableHead className="text-xs font-semibold text-gray-900 h-10 px-2 cursor-pointer group">
                <div className="flex items-center gap-1">
                  Avg Monthly Spend{' '}
                  <ChevronDown className="w-3 h-3 text-gray-400 group-hover:text-gray-900 transition-colors" />
                </div>
              </TableHead>
              <TableHead className="text-xs font-semibold text-gray-900 h-10 px-2 text-right">
                Status
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((row) => (
              <TableRow
                key={row.id}
                className="border-b border-gray-50/50 hover:bg-gray-50/50 transition-colors"
              >
                <TableCell className="font-semibold text-sm text-gray-600 py-4 px-2">
                  {row.name}
                </TableCell>
                <TableCell className="font-bold text-sm text-gray-900 py-4 px-2">
                  ${row.paid.toLocaleString()}
                </TableCell>
                <TableCell className="font-semibold text-sm text-gray-500 py-4 px-2">
                  ${row.spend.toLocaleString()}/mo
                </TableCell>
                <TableCell className="py-4 px-2 text-right">
                  <span
                    className={cn(
                      'inline-flex items-center justify-center px-3 py-1 text-[11px] font-bold rounded-md',
                      row.status === 'Active'
                        ? 'bg-green-50 text-green-500'
                        : 'bg-orange-50 text-orange-400',
                    )}
                  >
                    {row.status}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
