import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Empresa } from '@/types/empresa'
import { fetchEmpresaById, updateEmpresa, deleteEmpresa } from '@/services/empresas'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
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
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Building2 } from 'lucide-react'
import { toast } from 'sonner'
import { EmpresaForm } from '@/components/empresas/EmpresaForm'
import { EmpresaDetailsHeader } from '@/components/empresas/EmpresaDetailsHeader'
import { EmpresaDetailsCards } from '@/components/empresas/EmpresaDetailsCards'
import { SystemInfoCard } from '@/components/empresas/SystemInfoCard'
import { supabase } from '@/lib/supabase/client'

export default function EmpresaDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [empresa, setEmpresa] = useState<Empresa | null>(null)
  const [loading, setLoading] = useState(true)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isTransferDialogOpen, setIsTransferDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [newResponsavelId, setNewResponsavelId] = useState('')
  const [users, setUsers] = useState<{ id: string; name: string }[]>([])

  useEffect(() => {
    if (id) {
      loadData(id)
    }
    loadUsers()
  }, [id])

  const loadUsers = async () => {
    const { data } = await supabase.from('profiles').select('id, name').order('name')
    if (data) setUsers(data)
  }

  const loadData = async (empresaId: string) => {
    try {
      setLoading(true)
      const data = await fetchEmpresaById(empresaId)
      setEmpresa(data)
    } catch (error) {
      toast.error('Erro ao carregar empresa')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full"></div>
      </div>
    )
  }

  if (!empresa) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
        <Building2 className="w-16 h-16 text-muted-foreground opacity-20" />
        <p className="text-lg text-muted-foreground">Empresa não encontrada.</p>
        <Button variant="outline" onClick={() => navigate(-1)}>
          Voltar
        </Button>
      </div>
    )
  }

  const handleEditSubmit = async (data: Empresa) => {
    try {
      const updated = await updateEmpresa(empresa.id, data)
      setEmpresa(updated)
      setIsEditDialogOpen(false)
      toast.success('Empresa atualizada com sucesso!')
    } catch (error) {
      toast.error('Erro ao atualizar empresa')
    }
  }

  const handleDelete = async () => {
    try {
      await deleteEmpresa(empresa.id)
      setIsDeleteDialogOpen(false)
      toast.success('Empresa removida com sucesso!')
      navigate('/')
    } catch (error) {
      toast.error('Erro ao excluir empresa')
    }
  }

  const handleTransfer = async () => {
    if (newResponsavelId) {
      try {
        const updated = await updateEmpresa(empresa.id, {
          ...empresa,
          responsavel_id: newResponsavelId,
          novoResponsavel: '',
        })
        setEmpresa(updated)
        setIsTransferDialogOpen(false)
        setNewResponsavelId('')
        toast.success('Responsável transferido com sucesso!')
      } catch (error) {
        toast.error('Erro ao transferir responsável')
      }
    } else {
      toast.error('Selecione o novo responsável.')
    }
  }

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8 max-w-7xl animate-fade-in-up space-y-8">
      <EmpresaDetailsHeader
        empresa={empresa}
        onEdit={() => setIsEditDialogOpen(true)}
        onDelete={() => setIsDeleteDialogOpen(true)}
      />

      <EmpresaDetailsCards empresa={empresa} onTransfer={() => setIsTransferDialogOpen(true)} />

      <SystemInfoCard />

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Empresa</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <EmpresaForm
              empresa={empresa}
              empresas={[]}
              onSubmit={handleEditSubmit}
              onCancel={() => setIsEditDialogOpen(false)}
            />
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isTransferDialogOpen} onOpenChange={setIsTransferDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Transferir Responsável</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="new-responsavel">Novo Responsável</Label>
              <Select value={newResponsavelId} onValueChange={setNewResponsavelId}>
                <SelectTrigger id="new-responsavel">
                  <SelectValue placeholder="Selecione o novo responsável" />
                </SelectTrigger>
                <SelectContent>
                  {users.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setIsTransferDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleTransfer}>Confirmar Transferência</Button>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Empresa</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir a empresa <strong>{empresa.nome}</strong>? Esta ação
              não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Sim, Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
