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
  { id: 1, name: 'NexaCorp', paid: 18400, spend: 6100, status: 'Ativo' },
  { id: 2, name: 'MonoTech', paid: 11200, spend: 3200, status: 'Em Risco' },
  { id: 3, name: 'NexaCorp', paid: 18400, spend: 6100, status: 'Ativo' },
  { id: 4, name: 'MonoTech', paid: 11200, spend: 3200, status: 'Em Risco' },
]

export function TopUsersTable({ data = [] }: { data?: any[] }) {
  const [period, setPeriod] = useState('Mensal')

  return (
    <div className="bg-white rounded-[24px] p-6 shadow-[0_2px_20px_rgba(0,0,0,0.02)] h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-gray-900 text-lg">Desempenho por Empresa</h3>
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

      <div className="flex-1 overflow-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-b-0 hover:bg-transparent">
              <TableHead className="text-xs font-semibold text-gray-900 h-10 px-2 cursor-pointer group">
                <div className="flex items-center gap-1">
                  Empresa{' '}
                  <ChevronDown className="w-3 h-3 text-gray-400 group-hover:text-gray-900 transition-colors" />
                </div>
              </TableHead>
              <TableHead className="text-xs font-semibold text-gray-900 h-10 px-2 cursor-pointer group">
                <div className="flex items-center gap-1">
                  Concluídas{' '}
                  <ChevronDown className="w-3 h-3 text-gray-400 group-hover:text-gray-900 transition-colors" />
                </div>
              </TableHead>
              <TableHead className="text-xs font-semibold text-gray-900 h-10 px-2 cursor-pointer group">
                <div className="flex items-center gap-1">
                  Pendentes{' '}
                  <ChevronDown className="w-3 h-3 text-gray-400 group-hover:text-gray-900 transition-colors" />
                </div>
              </TableHead>
              <TableHead className="text-xs font-semibold text-gray-900 h-10 px-2 text-right">
                Progresso
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                  Nenhum dado encontrado
                </TableCell>
              </TableRow>
            ) : (
              data.map((row: any) => (
                <TableRow
                  key={row.id}
                  className="border-b border-gray-50/50 hover:bg-gray-50/50 transition-colors"
                >
                  <TableCell className="font-semibold text-sm text-gray-600 py-4 px-2">
                    {row.nome}
                  </TableCell>
                  <TableCell className="font-bold text-sm text-green-600 py-4 px-2">
                    {row.concluidas}
                  </TableCell>
                  <TableCell className="font-semibold text-sm text-orange-500 py-4 px-2">
                    {row.pendentes}
                  </TableCell>
                  <TableCell className="py-4 px-2 text-right">
                    <span
                      className={cn(
                        'inline-flex items-center justify-center px-3 py-1 text-[11px] font-bold rounded-md',
                        row.progresso >= 80
                          ? 'bg-green-50 text-green-500'
                          : row.progresso >= 50
                            ? 'bg-blue-50 text-blue-500'
                            : 'bg-orange-50 text-orange-400',
                      )}
                    >
                      {row.progresso}%
                    </span>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
