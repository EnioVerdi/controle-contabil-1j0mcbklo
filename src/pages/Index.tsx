import { useState, useMemo, useEffect } from 'react'
import { Empresa } from '@/types/empresa'
import { fetchEmpresas, createEmpresa, updateEmpresa, deleteEmpresa } from '@/services/empresas'
import { useSearch } from '@/context/SearchContext'
import { useToast } from '@/hooks/use-toast'
import { usePermissions } from '@/hooks/use-permissions'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
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
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { EmpresasList } from '@/components/empresas/EmpresasList'
import { EmpresaForm } from '@/components/empresas/EmpresaForm'
import { ImportCsvDialog } from '@/components/empresas/ImportCsvDialog'
import { Plus, UploadCloud } from 'lucide-react'

type SortKey = keyof Empresa
type SortConfig = { key: SortKey; direction: 'asc' | 'desc' } | null

export default function Index() {
  const { searchTerm } = useSearch()
  const { toast } = useToast()
  const { can } = usePermissions()

  const [data, setData] = useState<Empresa[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filterResp, setFilterResp] = useState<string>('all')
  const [filterAtiv, setFilterAtiv] = useState<string>('all')
  const [sortConfig, setSortConfig] = useState<SortConfig>(null)

  const [viewData, setViewData] = useState<Empresa | null>(null)
  const [editData, setEditData] = useState<Empresa | null>(null)
  const [deleteData, setDeleteData] = useState<Empresa | null>(null)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isImportOpen, setIsImportOpen] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setIsLoading(true)
      const empresas = await fetchEmpresas()
      setData(empresas)
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar as empresas.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const responsaveis = useMemo(() => Array.from(new Set(data.map((e) => e.responsavel))), [data])
  const atividades = useMemo(() => Array.from(new Set(data.map((e) => e.atividade))), [data])

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
        const valA = a[sortConfig.key] || ''
        const valB = b[sortConfig.key] || ''
        if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1
        if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1
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

  const handleDelete = async () => {
    if (deleteData) {
      try {
        await deleteEmpresa(deleteData.id)
        setData((prev) => prev.filter((e) => e.id !== deleteData.id))
        toast({
          title: 'Empresa excluída',
          description: `${deleteData.nome} foi removida com sucesso.`,
        })
      } catch (error) {
        toast({ title: 'Erro ao excluir', description: 'Ocorreu um erro.', variant: 'destructive' })
      } finally {
        setDeleteData(null)
      }
    }
  }

  const handleFormSubmit = async (empresa: Empresa) => {
    try {
      if (editData) {
        const updated = await updateEmpresa(editData.id, empresa)
        setData((prev) => prev.map((item) => (item.id === editData.id ? updated : item)))
        toast({ title: 'Empresa atualizada', description: 'As informações foram salvas.' })
        setEditData(null)
      } else {
        const created = await createEmpresa(empresa)
        setData((prev) => [created, ...prev])
        toast({
          title: 'Empresa criada',
          description: 'A nova empresa foi adicionada com sucesso.',
        })
        setIsCreateOpen(false)
      }
    } catch (error: any) {
      toast({
        title: 'Erro ao salvar',
        description: error.message || 'Ocorreu um erro inesperado.',
        variant: 'destructive',
      })
    }
  }

  return (
    <div className="space-y-6 pb-10">
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

          {can('create_empresa') && (
            <>
              <Button
                onClick={() => setIsImportOpen(true)}
                variant="outline"
                className="rounded-xl h-10 gap-2 bg-white"
              >
                <UploadCloud className="h-4 w-4" /> Importar CSV
              </Button>
              <Button onClick={() => setIsCreateOpen(true)} className="rounded-xl h-10 gap-2">
                <Plus className="h-4 w-4" /> Adicionar Empresa
              </Button>
            </>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full"></div>
        </div>
      ) : (
        <EmpresasList
          data={filteredAndSortedData}
          onSort={handleSort}
          onView={setViewData}
          onEdit={can('edit_empresa') ? setEditData : undefined}
          onDelete={can('delete_empresa') ? setDeleteData : undefined}
        />
      )}

      {/* View Details Sheet */}
      <Sheet open={!!viewData} onOpenChange={(open) => !open && setViewData(null)}>
        <SheetContent className="sm:max-w-md overflow-y-auto">
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
                  <Label className="text-xs text-muted-foreground mb-1 block">
                    Regime Tributário
                  </Label>
                  <p className="font-medium">{viewData.regimeTributario || '-'}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground mb-1 block">
                    Regime de Folha
                  </Label>
                  <p className="font-medium">{viewData.regimeFolha || '-'}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground mb-1 block">Fechamento</Label>
                  <p className="font-medium">{viewData.fechamento || '-'}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground mb-1 block">Status Fiscal</Label>
                  <Badge
                    variant="outline"
                    className={viewData.fiscal === 'Verificada' ? 'badge-success' : 'badge-warning'}
                  >
                    {viewData.fiscal}
                  </Badge>
                </div>
                <div className="col-span-2">
                  <Label className="text-xs text-muted-foreground mb-1 block">Observações</Label>
                  <p className="font-medium text-sm whitespace-pre-wrap">
                    {viewData.observacoes || '-'}
                  </p>
                </div>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* Form Dialog */}
      <Dialog
        open={!!editData || isCreateOpen}
        onOpenChange={(open) => {
          if (!open) {
            setEditData(null)
            setIsCreateOpen(false)
          }
        }}
      >
        <DialogContent className="sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>{editData ? 'Editar Empresa' : 'Adicionar Empresa'}</DialogTitle>
            <DialogDescription>
              {editData
                ? `Atualize as informações de ${editData.nome}.`
                : 'Preencha os dados para cadastrar uma nova empresa no sistema.'}
            </DialogDescription>
          </DialogHeader>
          <div className="mt-2">
            <EmpresaForm
              empresa={editData}
              empresas={data}
              onSubmit={handleFormSubmit}
              onCancel={() => {
                setEditData(null)
                setIsCreateOpen(false)
              }}
            />
          </div>
        </DialogContent>
      </Dialog>

      <ImportCsvDialog
        open={isImportOpen}
        onOpenChange={setIsImportOpen}
        onSuccess={loadData}
        existingEmpresas={data}
      />

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
