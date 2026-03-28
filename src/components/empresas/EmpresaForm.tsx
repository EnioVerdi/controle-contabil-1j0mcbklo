import { useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Empresa } from '@/types/empresa'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { EmpresaFormFields } from './EmpresaFormFields'

const baseSchema = z.object({
  id: z.string().min(1, 'Código é obrigatório'),
  nome: z.string().min(1, 'Nome é obrigatório'),
  atividade: z.string().min(1, 'Atividade é obrigatória'),
  regimeTributario: z.string().optional(),
  responsavel: z.string().min(1, 'Responsável é obrigatório'),
  novoResponsavel: z.string().optional(),
  fechamento: z.string().optional(),
  fiscal: z.boolean(),
  regimeFolha: z.string().optional(),
  contabilizacaoFolha: z.string().optional(),
  depreciacao: z.boolean().default(false),
  extratos: z.boolean().default(false),
  parcelamentos: z.boolean().default(false),
  distribuicaoLucro: z.boolean().default(false),
  receitaFinanceira: z.boolean().default(false),
  periodoVerificado: z.string().optional(),
  ultimaVerificacao: z.string().optional(),
  observacoes: z.string().optional(),
})

interface EmpresaFormProps {
  empresa?: Empresa | null
  empresas: Empresa[]
  onSubmit: (data: Empresa) => void
  onCancel: () => void
}

export function EmpresaForm({ empresa, empresas, onSubmit, onCancel }: EmpresaFormProps) {
  const formSchema = useMemo(() => {
    return baseSchema.refine(
      (data) => {
        if (empresa?.id && data.id === empresa.id) return true
        return !empresas.some((e) => e.id === data.id)
      },
      { message: 'Este código já está em uso', path: ['id'] },
    )
  }, [empresa, empresas])

  const form = useForm<z.infer<typeof baseSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: empresa?.id || '',
      nome: empresa?.nome || '',
      atividade: empresa?.atividade || '',
      regimeTributario: empresa?.regimeTributario || '',
      responsavel: empresa?.responsavel || '',
      novoResponsavel: empresa?.novoResponsavel || '',
      fechamento: empresa?.fechamento || '',
      fiscal: empresa?.fiscal === 'Verificada',
      regimeFolha: empresa?.regimeFolha || '',
      contabilizacaoFolha: empresa?.contabilizacaoFolha || '',
      depreciacao: empresa?.depreciacao || false,
      extratos: empresa?.extratos || false,
      parcelamentos: empresa?.parcelamentos || false,
      distribuicaoLucro: empresa?.distribuicaoLucro || false,
      receitaFinanceira: empresa?.receitaFinanceira || false,
      periodoVerificado: empresa?.periodoVerificado || '',
      ultimaVerificacao: empresa?.ultimaVerificacao || '',
      observacoes: empresa?.observacoes || '',
    },
  })

  const handleSubmit = (values: z.infer<typeof baseSchema>) => {
    onSubmit({
      ...(empresa || {}),
      id: values.id,
      nome: values.nome,
      logo:
        empresa?.logo ||
        `https://img.usecurling.com/i?q=${encodeURIComponent(
          values.atividade || 'business',
        )}&shape=fill&color=blue`,
      responsavel: values.responsavel,
      atividade: values.atividade,
      fechamento: values.fechamento || '',
      fiscal: values.fiscal ? 'Verificada' : 'Pendente',
      ultimaVerificacao: values.ultimaVerificacao || new Date().toLocaleDateString('pt-BR'),
      regimeTributario: values.regimeTributario,
      novoResponsavel: values.novoResponsavel,
      regimeFolha: values.regimeFolha,
      contabilizacaoFolha: values.contabilizacaoFolha,
      depreciacao: values.depreciacao,
      extratos: values.extratos,
      parcelamentos: values.parcelamentos,
      distribuicaoLucro: values.distribuicaoLucro,
      receitaFinanceira: values.receitaFinanceira,
      periodoVerificado: values.periodoVerificado,
      observacoes: values.observacoes,
    } as Empresa)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <EmpresaFormFields form={form} />
        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit">Salvar</Button>
        </div>
      </form>
    </Form>
  )
}
