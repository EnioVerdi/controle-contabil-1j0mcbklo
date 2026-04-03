import { useState, useMemo } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { ChevronLeft, ChevronRight, Search } from 'lucide-react'

interface EmpresaData {
  id: string
  nome: string
  concluidas: number
  aberto: number
  pendentes: number
  progresso: number
}

interface TopUsersTableProps {
  data: EmpresaData[]
}

export function TopUsersTable({ data }: TopUsersTableProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const filteredData = useMemo(() => {
    return data.filter((emp) => {
      const searchLower = searchTerm.toLowerCase()
      return (
        emp.nome.toLowerCase().includes(searchLower) || emp.id.toLowerCase().includes(searchLower)
      )
    })
  }, [data, searchTerm])

  const totalPages = Math.max(1, Math.ceil(filteredData.length / itemsPerPage))

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    return filteredData.slice(startIndex, startIndex + itemsPerPage)
  }, [filteredData, currentPage])

  // Reset page when search changes
  useMemo(() => {
    setCurrentPage(1)
  }, [searchTerm])

  return (
    <div className="bg-white rounded-[24px] p-6 shadow-[0_2px_20px_rgba(0,0,0,0.02)] h-full flex flex-col">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h3 className="font-bold text-gray-900 text-lg">Desempenho por Empresa</h3>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Buscar empresa ou código..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 bg-gray-50 border-gray-100 focus-visible:ring-1"
          />
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-gray-100 hover:bg-transparent">
              <TableHead className="text-gray-500 font-medium h-11">Empresa</TableHead>
              <TableHead className="text-gray-500 font-medium h-11 text-center">
                Concluídas
              </TableHead>
              <TableHead className="text-gray-500 font-medium h-11 text-center">
                Pendentes
              </TableHead>
              <TableHead className="text-gray-500 font-medium h-11 text-center">Aberto</TableHead>
              <TableHead className="text-gray-500 font-medium h-11">Progresso</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.length > 0 ? (
              paginatedData.map((emp) => (
                <TableRow key={emp.id} className="border-gray-50 hover:bg-gray-50/50">
                  <TableCell className="font-medium text-gray-900 py-4">
                    <div className="flex flex-col">
                      <span>{emp.nome}</span>
                      <span className="text-xs text-gray-400 font-normal">Cód: {emp.id}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center text-gray-600 py-4">{emp.concluidas}</TableCell>
                  <TableCell className="text-center text-gray-600 py-4">{emp.pendentes}</TableCell>
                  <TableCell className="text-center text-gray-600 py-4">{emp.aberto}</TableCell>
                  <TableCell className="py-4">
                    <div className="flex items-center gap-3">
                      <Progress value={emp.progresso} className="h-2 w-full bg-gray-100" />
                      <span className="text-sm font-medium text-gray-600 w-9">
                        {emp.progresso}%
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-gray-500">
                  Nenhuma empresa encontrada.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-50">
          <p className="text-sm text-gray-500">
            Mostrando {(currentPage - 1) * itemsPerPage + 1} até{' '}
            {Math.min(currentPage * itemsPerPage, filteredData.length)} de {filteredData.length}{' '}
            registros
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="h-8 w-8 p-0 border-gray-200"
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Anterior</span>
            </Button>
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
                .map((p, i, arr) => (
                  <div key={p} className="flex items-center">
                    {i > 0 && arr[i - 1] !== p - 1 && (
                      <span className="px-2 text-gray-400 text-sm">...</span>
                    )}
                    <Button
                      variant={currentPage === p ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setCurrentPage(p)}
                      className={`h-8 w-8 p-0 ${currentPage === p ? '' : 'border-gray-200'}`}
                    >
                      {p}
                    </Button>
                  </div>
                ))}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="h-8 w-8 p-0 border-gray-200"
            >
              <ChevronRight className="h-4 w-4" />
              <span className="sr-only">Próximo</span>
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
