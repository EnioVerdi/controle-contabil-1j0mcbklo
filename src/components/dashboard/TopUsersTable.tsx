import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
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

type SortField = 'nome' | 'concluidas' | 'pendentes' | 'aberto' | 'progresso'

export function TopUsersTable({ data = [] }: { data?: any[] }) {
  const [period, setPeriod] = useState('Mensal')
  const [sortField, setSortField] = useState<SortField>('progresso')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDir('desc')
    }
  }

  const sortedData = [...data].sort((a, b) => {
    const valA = a[sortField]
    const valB = b[sortField]
    if (valA < valB) return sortDir === 'asc' ? -1 : 1
    if (valA > valB) return sortDir === 'asc' ? 1 : -1
    return 0
  })

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) {
      return (
        <ChevronDown className="w-3 h-3 text-gray-300 group-hover:text-gray-400 transition-colors" />
      )
    }
    return sortDir === 'asc' ? (
      <ChevronUp className="w-3 h-3 text-gray-900" />
    ) : (
      <ChevronDown className="w-3 h-3 text-gray-900" />
    )
  }

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
              <TableHead
                className="text-xs font-semibold text-gray-900 h-10 px-2 cursor-pointer group"
                onClick={() => handleSort('nome')}
              >
                <div className="flex items-center gap-1">
                  Empresa <SortIcon field="nome" />
                </div>
              </TableHead>
              <TableHead
                className="text-xs font-semibold text-gray-900 h-10 px-2 cursor-pointer group"
                onClick={() => handleSort('concluidas')}
              >
                <div className="flex items-center gap-1">
                  Concluídas <SortIcon field="concluidas" />
                </div>
              </TableHead>
              <TableHead
                className="text-xs font-semibold text-gray-900 h-10 px-2 cursor-pointer group"
                onClick={() => handleSort('pendentes')}
              >
                <div className="flex items-center gap-1">
                  Pendentes <SortIcon field="pendentes" />
                </div>
              </TableHead>
              <TableHead
                className="text-xs font-semibold text-gray-900 h-10 px-2 cursor-pointer group"
                onClick={() => handleSort('aberto')}
              >
                <div className="flex items-center gap-1">
                  Em Aberto <SortIcon field="aberto" />
                </div>
              </TableHead>
              <TableHead
                className="text-xs font-semibold text-gray-900 h-10 px-2 cursor-pointer group text-right"
                onClick={() => handleSort('progresso')}
              >
                <div className="flex items-center justify-end gap-1">
                  Progresso <SortIcon field="progresso" />
                </div>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                  Nenhum dado encontrado
                </TableCell>
              </TableRow>
            ) : (
              sortedData.map((row: any) => (
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
                  <TableCell className="font-semibold text-sm text-gray-500 py-4 px-2">
                    {row.pendentes}
                  </TableCell>
                  <TableCell className="font-semibold text-sm text-yellow-600 py-4 px-2">
                    {row.aberto}
                  </TableCell>
                  <TableCell className="py-4 px-2 text-right">
                    <span
                      className={cn(
                        'inline-flex items-center justify-center px-3 py-1 text-[11px] font-bold rounded-md',
                        row.progresso >= 80
                          ? 'bg-green-50 text-green-500'
                          : row.progresso >= 50
                            ? 'bg-blue-50 text-blue-500'
                            : 'bg-yellow-50 text-yellow-600',
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
