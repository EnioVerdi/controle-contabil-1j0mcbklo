import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase/client'
import { useToast } from '@/hooks/use-toast'

const getSchema = (isEditing: boolean) =>
  z
    .object({
      name: z.string().min(2, 'O nome deve ter pelo menos 2 caracteres'),
      email: z.string().email('Email inválido'),
      password: isEditing ? z.string().optional() : z.string().min(8, 'Mínimo de 8 caracteres'),
      confirmPassword: z.string().optional(),
      role_id: z.string().min(1, 'A role é obrigatória'),
    })
    .refine(
      (data) => {
        if (data.password && data.password !== data.confirmPassword) return false
        return true
      },
      { message: 'As senhas não coincidem', path: ['confirmPassword'] },
    )

type FormData = z.infer<ReturnType<typeof getSchema>>

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  user: any | null
  onSuccess: () => void
}

export function UserFormDialog({ open, onOpenChange, user, onSuccess }: Props) {
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  const isEditing = !!user

  const form = useForm<FormData>({
    resolver: zodResolver(getSchema(isEditing)),
    defaultValues: { name: '', email: '', password: '', confirmPassword: '', role_id: '' },
  })

  useEffect(() => {
    if (open) {
      if (user) {
        form.reset({
          name: user.name || '',
          email: user.email || '',
          role_id: user.role_id || user.role || '',
          password: '',
          confirmPassword: '',
        })
      } else {
        form.reset({ name: '', email: '', password: '', confirmPassword: '', role_id: '' })
      }
    }
  }, [open, user, form])

  const onSubmit = async (values: FormData) => {
    setLoading(true)
    try {
      const action = isEditing ? 'update' : 'create'
      const userData = { ...values, id: user?.id }

      const { data, error } = await supabase.functions.invoke('manage-users', {
        body: { action, userData },
      })

      if (error) throw error
      if (data?.error) throw new Error(data.error)

      toast({
        title: 'Sucesso',
        description: `Usuário ${isEditing ? 'atualizado' : 'criado'} com sucesso!`,
      })
      onSuccess()
      onOpenChange(false)
    } catch (err: any) {
      toast({
        title: 'Erro',
        description: err.message,
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Editar Usuário' : 'Novo Usuário'}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? 'Altere as permissões ou dados do usuário.'
              : 'Cadastre um novo usuário com acesso ao sistema.'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome Completo</FormLabel>
                  <FormControl>
                    <Input placeholder="João da Silva" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="joao@exemplo.com" type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="role_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role (Nível de Acesso)</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um nível" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="admin">Administrador</SelectItem>
                      <SelectItem value="gerente">Gerente</SelectItem>
                      <SelectItem value="contador">Contador</SelectItem>
                      <SelectItem value="consultor">Consultor</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{isEditing ? 'Nova Senha (opcional)' : 'Senha'}</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirmar Senha</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="pt-4 flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Salvando...' : 'Salvar Usuário'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
