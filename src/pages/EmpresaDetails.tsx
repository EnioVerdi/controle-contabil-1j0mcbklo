import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Empresa } from '@/types/empresa'
import { mockEmpresas } from '@/data/mockEmpresas'
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
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Building2 } from 'lucide-react'
import { toast } from 'sonner'
import { EmpresaForm } from '@/components/empresas/EmpresaForm'
import { EmpresaDetailsHeader } from '@/components/empresas/EmpresaDetailsHeader'
import { EmpresaDetailsCards } from '@/components/empresas/EmpresaDetailsCards'
import { SystemInfoCard } from '@/components/empresas/SystemInfoCard'

export default function EmpresaDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [empresa, setEmpresa] = useState<Empresa | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isTransferDialogOpen, setIsTransferDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [newResponsavel, setNewResponsavel] = useState('')

  useEffect(() => {
    const found = mockEmpresas.find((e) => e.id === id)
    if (found) setEmpresa(found)
  }, [id])

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

  const handleEditSubmit = (data: Empresa) => {
    setEmpresa(data)
    setIsEditDialogOpen(false)
    toast.success('Empresa atualizada com sucesso!')
  }

  const handleDelete = () => {
    setIsDeleteDialogOpen(false)
    toast.success('Empresa removida com sucesso!')
    navigate('/')
  }

  const handleTransfer = () => {
    if (newResponsavel.trim()) {
      setEmpresa({ ...empresa, responsavel: newResponsavel.trim(), novoResponsavel: '' })
      setIsTransferDialogOpen(false)
      setNewResponsavel('')
      toast.success('Responsável transferido com sucesso!')
    } else {
      toast.error('Informe o nome do novo responsável.')
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
              empresas={mockEmpresas}
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
              <Input
                id="new-responsavel"
                placeholder="Nome do novo responsável"
                value={newResponsavel}
                onChange={(e) => setNewResponsavel(e.target.value)}
              />
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
