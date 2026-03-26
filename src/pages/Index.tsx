import { useState, useMemo } from 'react'
import { Eye, Pencil, Trash2, ArrowUpDown, Building2 } from 'lucide-react'
import { mockEmpresas } from '@/data/mockEmpresas'
import { Empresa } from '@/types/empresa'
import { useSearch } from '@/context/SearchContext'
import { useToast } from '@/hooks/use-toast'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

type SortKey = keyof Empresa
type SortConfig = { key: SortKey; direction: 'asc' | 'desc' } | null

export default function Index() {
  const { searchTerm } = useSearch()
  const { toast } = useToast()

  const [data, setData] = useState<Empresa[]>(mockEmpresas)
  const [filterResp, setFilterResp] = useState<string>('all')
  const [filterAtiv, setFilterAtiv] = useState<string>('all')
  const [sortConfig, setSortConfig] = useState<SortConfig>(null)

  const [viewData, setViewData] = useState<Empresa | null>(null)
  const [editData, setEditData] = useState<Empresa | null>(null)
  const [deleteData, setDeleteData] = useState<Empresa | null>(null)

  const responsaveis = useMemo(
    () => Array.from(new Set(mockEmpresas.map((e) => e.responsavel))),
    [],
  )
  const atividades = useMemo(() => Array.from(new Set(mockEmpresas.map((e) => e.atividade))), [])

  const filteredAndSortedData = useMemo(() => {
    let result = [...data]

    if (searchTerm) {
      const lowerTerm = searchTerm.toLowerCase()
      result = result.filter(
        (e) => e.nome.toLowerCase().includes(lowerTerm) || e.id.toLowerCase().includes(lowerTerm),
      )
    }

    if (filterResp !== 'all') {
      result = result.filter((e) => e.responsavel === filterResp)
    }
    if (filterAtiv !== 'all') {
      result = result.filter((e) => e.atividade === filterAtiv)
    }

    if (sortConfig) {
      result.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1
        if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1
        return 0
      })
    }

    return result
  }, [data, searchTerm, filterResp, filterAtiv, sortConfig])

  const handleSort = (key: SortKey) => {
    setSortConfig((current) => {
      if (current?.key === key) {
        return current.direction === 'asc' ? { key, direction: 'desc' } : null
      }
      return { key, direction: 'asc' }
    })
  }

  const handleDelete = () => {
    if (deleteData) {
      setData((prev) => prev.filter((e) => e.id !== deleteData.id))
      toast({
        title: 'Empresa excluída',
        description: `${deleteData.nome} foi removida com sucesso.`,
      })
      setDeleteData(null)
    }
  }

  const handleEditSave = (e: React.FormEvent) => {
    e.preventDefault()
    if (editData) {
      setData((prev) => prev.map((item) => (item.id === editData.id ? editData : item)))
      toast({ title: 'Empresa atualizada', description: 'As informações foram salvas.' })
      setEditData(null)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-foreground tracking-tight">Listagem de Empresas</h1>

        <div className="flex items-center gap-3">
          <Select value={filterResp} onValueChange={setFilterResp}>
            <SelectTrigger className="w-[180px] bg-white rounded-xl h-10">
              <SelectValue placeholder="Responsável" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os Responsáveis</SelectItem>
              {responsaveis.map((r) => (
                <SelectItem key={r} value={r}>
                  {r}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filterAtiv} onValueChange={setFilterAtiv}>
            <SelectTrigger className="w-[180px] bg-white rounded-xl h-10">
              <SelectValue placeholder="Atividade" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as Atividades</SelectItem>
              {atividades.map((a) => (
                <SelectItem key={a} value={a}>
                  {a}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="card-container overflow-hidden p-0 animate-fade-in-up">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/50 border-b">
              <TableRow className="hover:bg-transparent">
                {[
                  { key: 'id', label: 'Código' },
                  { key: 'nome', label: 'Nome' },
                  { key: 'responsavel', label: 'Responsável' },
                  { key: 'atividade', label: 'Atividade' },
                  { key: 'fechamento', label: 'Fechamento' },
                  { key: 'fiscal', label: 'Fiscal' },
                  { key: 'ultimaVerificacao', label: 'Última Verificação' },
                ].map((col) => (
                  <TableHead
                    key={col.key}
                    className="h-14 font-semibold text-foreground cursor-pointer hover:text-primary transition-colors whitespace-nowrap"
                    onClick={() => handleSort(col.key as SortKey)}
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
              {filteredAndSortedData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="h-48 text-center">
                    <div className="flex flex-col items-center justify-center text-muted-foreground">
                      <Building2 className="h-12 w-12 mb-3 opacity-20" />
                      <p>Nenhuma empresa encontrada.</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredAndSortedData.map((empresa) => (
                  <TableRow
                    key={empresa.id}
                    className="h-16 group hover:bg-slate-50/50 transition-colors"
                  >
                    <TableCell className="font-medium text-muted-foreground">
                      {empresa.id}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <img
                          src={empresa.logo}
                          alt={empresa.nome}
                          className="h-8 w-8 rounded-lg object-cover"
                        />
                        <span className="font-semibold text-foreground">{empresa.nome}</span>
                      </div>
                    </TableCell>
                    <TableCell>{empresa.responsavel}</TableCell>
                    <TableCell>{empresa.atividade}</TableCell>
                    <TableCell>{empresa.fechamento}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={empresa.fiscal === 'Regular' ? 'badge-success' : 'badge-warning'}
                      >
                        {empresa.fiscal}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {empresa.ultimaVerificacao}
                    </TableCell>
                    <TableCell className="text-right pr-6">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-lg hover:bg-blue-50 hover:text-blue-600"
                          onClick={() => setViewData(empresa)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-lg hover:bg-slate-100"
                          onClick={() => setEditData(empresa)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-lg hover:bg-red-50 hover:text-red-600"
                          onClick={() => setDeleteData(empresa)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* View Details Sheet */}
      <Sheet open={!!viewData} onOpenChange={(open) => !open && setViewData(null)}>
        <SheetContent className="sm:max-w-md">
          <SheetHeader className="mb-6">
            <SheetTitle>Detalhes da Empresa</SheetTitle>
            <SheetDescription>Informações completas sobre o registro.</SheetDescription>
          </SheetHeader>
          {viewData && (
            <div className="space-y-6">
              <div className="flex items-center gap-4 border-b pb-6">
                <img src={viewData.logo} alt="" className="h-16 w-16 rounded-xl shadow-sm" />
                <div>
                  <h3 className="text-xl font-bold">{viewData.nome}</h3>
                  <p className="text-sm text-muted-foreground">Código: {viewData.id}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs text-muted-foreground mb-1 block">Responsável</Label>
                  <p className="font-medium">{viewData.responsavel}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground mb-1 block">Atividade</Label>
                  <p className="font-medium">{viewData.atividade}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground mb-1 block">Fechamento</Label>
                  <p className="font-medium">{viewData.fechamento}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground mb-1 block">Status Fiscal</Label>
                  <Badge
                    variant="outline"
                    className={viewData.fiscal === 'Regular' ? 'badge-success' : 'badge-warning'}
                  >
                    {viewData.fiscal}
                  </Badge>
                </div>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* Edit Dialog */}
      <Dialog open={!!editData} onOpenChange={(open) => !open && setEditData(null)}>
        <DialogContent className="sm:max-w-md">
          <form onSubmit={handleEditSave}>
            <DialogHeader>
              <DialogTitle>Editar Empresa</DialogTitle>
              <DialogDescription>Atualize as informações de {editData?.nome}.</DialogDescription>
            </DialogHeader>
            {editData && (
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="nome">Nome da Empresa</Label>
                  <Input
                    id="nome"
                    value={editData.nome}
                    onChange={(e) => setEditData({ ...editData, nome: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="responsavel">Responsável</Label>
                  <Input
                    id="responsavel"
                    value={editData.responsavel}
                    onChange={(e) => setEditData({ ...editData, responsavel: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Status Fiscal</Label>
                  <Select
                    value={editData.fiscal}
                    onValueChange={(v: 'Regular' | 'Pendente') =>
                      setEditData({ ...editData, fiscal: v })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Regular">Regular</SelectItem>
                      <SelectItem value="Pendente">Pendente</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setEditData(null)}>
                Cancelar
              </Button>
              <Button type="submit">Salvar alterações</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Alert */}
      <AlertDialog open={!!deleteData} onOpenChange={(open) => !open && setDeleteData(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Isso excluirá permanentemente os dados da empresa{' '}
              <strong>{deleteData?.nome}</strong>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Excluir Empresa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
