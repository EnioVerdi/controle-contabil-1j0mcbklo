import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Edit2, Trash2, ShieldAlert } from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

import { supabase } from '@/lib/supabase/client'
import { usePermissions } from '@/hooks/use-permissions'
import { useToast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
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
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'

import { UserFormDialog } from '@/components/users/UserFormDialog'

export default function Usuarios() {
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<any | null>(null)
  const [userToDelete, setUserToDelete] = useState<any | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const { role } = usePermissions()
  const navigate = useNavigate()
  const { toast } = useToast()

  useEffect(() => {
    if (role && role !== 'admin') {
      navigate('/dashboard', { replace: true })
    }
  }, [role, navigate])

  const fetchUsers = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      toast({
        title: 'Erro ao carregar usuários',
        description: error.message,
        variant: 'destructive',
      })
    } else {
      setUsers(data || [])
    }
    setLoading(false)
  }

  useEffect(() => {
    if (role === 'admin') fetchUsers()
  }, [role])

  const handleCreate = () => {
    setEditingUser(null)
    setIsFormOpen(true)
  }

  const handleEdit = (user: any) => {
    setEditingUser(user)
    setIsFormOpen(true)
  }

  const handleDelete = async () => {
    if (!userToDelete) return
    setIsDeleting(true)
    try {
      const { data, error } = await supabase.functions.invoke('manage-users', {
        body: { action: 'delete', userData: { id: userToDelete.id } },
      })

      if (error || data?.error) throw new Error(error?.message || data?.error || 'Erro ao deletar')

      toast({ title: 'Sucesso', description: 'Usuário removido com sucesso.' })
      fetchUsers()
    } catch (err: any) {
      toast({ title: 'Erro', description: err.message, variant: 'destructive' })
    } finally {
      setIsDeleting(false)
      setUserToDelete(null)
    }
  }

  const getRoleBadge = (roleId: string) => {
    const roles: Record<string, { label: string; color: string }> = {
      admin: { label: 'Admin', color: 'bg-red-100 text-red-800 border-red-200' },
      contador: { label: 'Contador', color: 'bg-blue-100 text-blue-800 border-blue-200' },
      gerente: { label: 'Gerente', color: 'bg-purple-100 text-purple-800 border-purple-200' },
      consultor: { label: 'Consultor', color: 'bg-gray-100 text-gray-800 border-gray-200' },
    }
    const current = roles[roleId?.toLowerCase()] || roles['consultor']
    return (
      <Badge variant="outline" className={current.color}>
        {current.label}
      </Badge>
    )
  }

  if (role !== 'admin') return null

  return (
    <div className="mx-auto w-full max-w-6xl p-8 space-y-8 animate-fade-in-up">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Gerenciamento de Usuários
          </h1>
          <p className="text-gray-500 mt-2">
            Administre os acessos e permissões da equipe no sistema.
          </p>
        </div>
        <Button
          onClick={handleCreate}
          className="gap-2 bg-gray-900 hover:bg-black rounded-full px-6"
        >
          <Plus className="h-4 w-4" /> Novo Usuário
        </Button>
      </div>

      <div className="rounded-2xl border border-gray-100 bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
        <Table>
          <TableHeader className="bg-gray-50/50">
            <TableRow>
              <TableHead className="font-bold text-gray-600">Nome</TableHead>
              <TableHead className="font-bold text-gray-600">Email</TableHead>
              <TableHead className="font-bold text-gray-600">Role</TableHead>
              <TableHead className="font-bold text-gray-600">Data de Criação</TableHead>
              <TableHead className="text-right font-bold text-gray-600">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <Skeleton className="h-5 w-32" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-48" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-6 w-20 rounded-full" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-24" />
                  </TableCell>
                  <TableCell className="text-right">
                    <Skeleton className="h-8 w-16 ml-auto" />
                  </TableCell>
                </TableRow>
              ))
            ) : users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-32 text-center text-gray-500">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <ShieldAlert className="h-8 w-8 text-gray-300" />
                    <p>Nenhum usuário encontrado.</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id} className="group hover:bg-gray-50/50 transition-colors">
                  <TableCell className="font-medium text-gray-900">{user.name}</TableCell>
                  <TableCell className="text-gray-500">{user.email}</TableCell>
                  <TableCell>{getRoleBadge(user.role_id || user.role)}</TableCell>
                  <TableCell className="text-gray-500 text-sm">
                    {user.created_at
                      ? format(new Date(user.created_at), 'dd/MM/yyyy', { locale: ptBR })
                      : '-'}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(user)}
                        className="h-8 w-8 text-blue-600 hover:bg-blue-50 hover:text-blue-700"
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setUserToDelete(user)}
                        className="h-8 w-8 text-red-600 hover:bg-red-50 hover:text-red-700"
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

      <UserFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        user={editingUser}
        onSuccess={fetchUsers}
      />

      <AlertDialog open={!!userToDelete} onOpenChange={(open) => !open && setUserToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Usuário?</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja remover <strong>{userToDelete?.name}</strong>? Esta ação não
              poderá ser desfeita e removerá o acesso do usuário ao sistema.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
            >
              {isDeleting ? 'Excluindo...' : 'Sim, excluir'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
