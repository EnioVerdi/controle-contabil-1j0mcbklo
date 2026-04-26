import { useNavigate } from 'react-router-dom'
import { Empresa } from '@/types/empresa'
import { ArrowUpDown, Building2, Eye, Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

function getInitials(name: string) {
  const words = (name || '').trim().split(/\s+/)
  if (words.length === 0) return 'EM'
  if (words.length === 1) return words[0].substring(0, 2).toUpperCase()
  return (words[0][0] + words[1][0]).toUpperCase()
}

const avatarColors = [
  'bg-red-100 text-red-700',
  'bg-blue-100 text-blue-700',
  'bg-green-100 text-green-700',
  'bg-yellow-100 text-yellow-700',
  'bg-purple-100 text-purple-700',
  'bg-pink-100 text-pink-700',
  'bg-indigo-100 text-indigo-700',
  'bg-teal-100 text-teal-700',
  'bg-orange-100 text-orange-700',
  'bg-cyan-100 text-cyan-700',
]

function getColorClass(name: string) {
  let hash = 0
  for (let i = 0; i < (name || '').length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  return avatarColors[Math.abs(hash) % avatarColors.length]
}
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

interface EmpresasListProps {
  data: Empresa[]
  onSort: (key: keyof Empresa) => void
  onView: (empresa: Empresa) => void
  onEdit?: (empresa: Empresa) => void
  onDelete?: (empresa: Empresa) => void
}

export function EmpresasList({ data, onSort, onView, onEdit, onDelete }: EmpresasListProps) {
  const navigate = useNavigate()

  return (
    <div className="card-container overflow-hidden p-0 animate-fade-in-up">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-muted/50 border-b">
            <TableRow className="hover:bg-transparent">
              {[
                { key: 'id', label: 'Código' },
                { key: 'nome', label: 'Nome da Empresa' },
                { key: 'cnpj', label: 'CNPJ' },
                { key: 'responsavel', label: 'Responsável' },
                { key: 'atividade', label: 'Atividade' },
                { key: 'fechamento', label: 'Fechamento' },
                { key: 'fiscal', label: 'Status' },
                { key: 'ultimaVerificacao', label: 'Última Verificação' },
              ].map((col) => (
                <TableHead
                  key={col.key}
                  className="h-14 font-semibold text-foreground cursor-pointer hover:text-primary transition-colors whitespace-nowrap"
                  onClick={() => onSort(col.key as keyof Empresa)}
                >
                  <div className="flex items-center gap-2">
                    {col.label}
                    <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground" />
                  </div>
                </TableHead>
              ))}
              <TableHead className="h-14 font-semibold text-foreground text-right pr-6">
                Ações
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="h-48 text-center">
                  <div className="flex flex-col items-center justify-center text-muted-foreground">
                    <Building2 className="h-12 w-12 mb-3 opacity-20" />
                    <p>Nenhuma empresa encontrada.</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              data.map((empresa) => (
                <TableRow
                  key={empresa.id}
                  className="h-16 group hover:bg-slate-50/50 transition-colors"
                >
                  <TableCell className="font-medium text-muted-foreground">{empresa.id}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {empresa.logo ? (
                        <img
                          src={empresa.logo}
                          alt={empresa.nome}
                          className="h-8 w-8 rounded-lg object-cover shrink-0"
                        />
                      ) : (
                        <div
                          className={cn(
                            'h-8 w-8 rounded-lg flex items-center justify-center text-xs font-bold shrink-0',
                            getColorClass(empresa.nome),
                          )}
                          title={empresa.nome}
                        >
                          {getInitials(empresa.nome)}
                        </div>
                      )}
                      <span className="font-semibold text-foreground">{empresa.nome}</span>
                    </div>
                  </TableCell>
                  <TableCell className="whitespace-nowrap">{empresa.cnpj || '-'}</TableCell>
                  <TableCell>{empresa.responsavel}</TableCell>
                  <TableCell>{empresa.atividade}</TableCell>
                  <TableCell>{empresa.fechamento}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        empresa.fiscal === 'Verificada' ? 'badge-success' : 'badge-warning'
                      }
                    >
                      {empresa.fiscal}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {empresa.ultimaVerificacao}
                  </TableCell>
                  <TableCell className="text-right pr-6 text-[#dba7a7]">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity text-[#cfa3a3]">
                      <Button
                        variant="ghost"
                        size="icon"
                        title="Ver Detalhes"
                        className="h-8 w-8 rounded-lg hover:bg-blue-50 hover:text-blue-600"
                        onClick={() => {
                          onView(empresa)
                          navigate(`/empresas/${empresa.id}`)
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      {onEdit && (
                        <Button
                          variant="ghost"
                          size="icon"
                          title="Editar"
                          className="h-8 w-8 rounded-lg hover:bg-slate-100"
                          onClick={() => onEdit(empresa)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                      )}
                      {onDelete && (
                        <Button
                          variant="ghost"
                          size="icon"
                          title="Excluir"
                          className="h-8 w-8 rounded-lg hover:bg-red-50 hover:text-red-600"
                          onClick={() => onDelete(empresa)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
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
