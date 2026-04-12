import { useState, useEffect } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { supabase } from '@/lib/supabase/client'

interface EmpresaFormFieldsProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: UseFormReturn<any>
}

export function EmpresaFormFields({ form }: EmpresaFormFieldsProps) {
  const [users, setUsers] = useState<{ id: string; name: string }[]>([])

  useEffect(() => {
    async function fetchUsers() {
      const { data } = await supabase.from('profiles').select('id, name').order('name')
      if (data) {
        setUsers(data)
      }
    }
    fetchUsers()
  }, [])

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="space-y-4 md:col-span-2">
        <h3 className="font-semibold text-lg border-b pb-2 text-foreground">
          1. Informações Básicas
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Código</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="nome"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="atividade"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Atividade</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma atividade" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Comercio">Comercio</SelectItem>
                    <SelectItem value="Industria">Industria</SelectItem>
                    <SelectItem value="Serviço">Serviço</SelectItem>
                    <SelectItem value="Construtora">Construtora</SelectItem>
                    <SelectItem value="Adm. de Bens">Adm. de Bens</SelectItem>
                    <SelectItem value="Entidade">Entidade</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="regimeTributario"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Regime Tributário</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um regime" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Lucro Real Mensal">Lucro Real Mensal</SelectItem>
                    <SelectItem value="Lucro Real Trimestral">Lucro Real Trimestral</SelectItem>
                    <SelectItem value="Lucro Presumido">Lucro Presumido</SelectItem>
                    <SelectItem value="Simples Nacional">Simples Nacional</SelectItem>
                    <SelectItem value="Simples Nacional Hibrido">
                      Simples Nacional Hibrido
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="font-semibold text-lg border-b pb-2 text-foreground">2. Responsabilidade</h3>
        <FormField
          control={form.control}
          name="responsavel_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Responsável Atual</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um responsável" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {users.map((user) => (
                    <SelectItem key={`resp-${user.id}`} value={user.id}>
                      {user.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="novoResponsavel"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Novo Responsável</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um novo responsável" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Nenhum">Nenhum</SelectItem>
                  {users.map((user) => (
                    <SelectItem key={`novo-${user.id}`} value={user.name}>
                      {user.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="space-y-4">
        <h3 className="font-semibold text-lg border-b pb-2 text-foreground">3. Detalhes Fiscais</h3>
        <FormField
          control={form.control}
          name="fechamento"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Fechamento</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="fiscal"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
              <div className="space-y-0.5">
                <FormLabel>Fiscal Regular</FormLabel>
              </div>
              <FormControl>
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="regimeFolha"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Regime de Folha</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="contabilizacaoFolha"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contabilização de Folha</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="space-y-4">
        <h3 className="font-semibold text-lg border-b pb-2 text-foreground">
          4. Informações Contábeis
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="depreciacao"
            render={({ field }) => (
              <FormItem className="flex flex-col items-center justify-between rounded-lg border p-3 shadow-sm gap-2">
                <FormLabel>Depreciação</FormLabel>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="extratos"
            render={({ field }) => (
              <FormItem className="flex flex-col items-center justify-between rounded-lg border p-3 shadow-sm gap-2">
                <FormLabel>Extratos</FormLabel>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="parcelamentos"
            render={({ field }) => (
              <FormItem className="flex flex-col items-center justify-between rounded-lg border p-3 shadow-sm gap-2">
                <FormLabel>Parcelamentos</FormLabel>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="distribuicaoLucro"
            render={({ field }) => (
              <FormItem className="flex flex-col items-center justify-between rounded-lg border p-3 shadow-sm gap-2">
                <FormLabel>Distr. Lucro</FormLabel>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="receitaFinanceira"
            render={({ field }) => (
              <FormItem className="flex flex-col items-center justify-between rounded-lg border p-3 shadow-sm gap-2">
                <FormLabel>Receita Financeira</FormLabel>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="font-semibold text-lg border-b pb-2 text-foreground">5. Verificação</h3>
        <FormField
          control={form.control}
          name="periodoVerificado"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Período Verificado</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="ultimaVerificacao"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Data Últ. Verificação</FormLabel>
              <FormControl>
                <Input {...field} placeholder="DD/MM/YYYY" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="space-y-4 md:col-span-2">
        <h3 className="font-semibold text-lg border-b pb-2 text-foreground">6. Observações</h3>
        <FormField
          control={form.control}
          name="observacoes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Observações Adicionais</FormLabel>
              <FormControl>
                <Textarea className="min-h-[100px]" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  )
}
