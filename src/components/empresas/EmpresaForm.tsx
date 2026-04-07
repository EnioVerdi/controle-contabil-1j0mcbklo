import { useState, useEffect } from 'react'
import { Empresa } from '@/types/empresa'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { supabase } from '@/lib/supabase/client'

interface EmpresaFormProps {
  empresa?: Empresa | null
  empresas: Empresa[]
  onSubmit: (data: Empresa) => Promise<void>
  onCancel: () => void
}

const defaultEmpresa: Partial<Empresa> = {
  id: '',
  nome: '',
  responsavel: '',
  atividade: '',
  fiscal: 'Pendente',
  regimeTributario: '',
  fechamento: '',
  observacoes: '',
  depreciacao: false,
  extratos: false,
  parcelamentos: false,
  distribuicaoLucro: false,
  receitaFinanceira: false,
  logo: '',
  ultimaVerificacao: '',
  novoResponsavel: '',
  regimeFolha: '',
  contabilizacaoFolha: '',
  periodoVerificado: '',
}

export function EmpresaForm({ empresa, empresas, onSubmit, onCancel }: EmpresaFormProps) {
  const [formData, setFormData] = useState<Partial<Empresa>>(empresa || defaultEmpresa)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [users, setUsers] = useState<{ id: string; name: string }[]>([])

  const isEditing = !!empresa

  useEffect(() => {
    async function fetchUsers() {
      const { data } = await supabase.from('profiles').select('id, name').order('name')
      if (data) {
        setUsers(data)
      }
    }
    fetchUsers()
  }, [])

  useEffect(() => {
    if (empresa) {
      setFormData(empresa)
    } else {
      setFormData(defaultEmpresa)
    }
  }, [empresa])

  const handleChange = (field: keyof Empresa, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!formData.id || !formData.nome || !formData.responsavel || !formData.atividade) {
      setError('Preencha todos os campos obrigatórios (Código, Nome, Responsável, Atividade).')
      return
    }

    // Usamos o array 'empresas' localmente em vez de requisições HEAD na API para checar duplicidade
    if (!isEditing && empresas.some((emp) => emp.id === formData.id)) {
      setError(`Já existe uma empresa cadastrada com o código ${formData.id}.`)
      return
    }

    try {
      setIsLoading(true)
      await onSubmit(formData as Empresa)
    } catch (err: any) {
      setError(err.message || 'Erro ao salvar empresa.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="id">
            Código <span className="text-red-500">*</span>
          </Label>
          <Input
            id="id"
            value={formData.id}
            onChange={(e) => handleChange('id', e.target.value)}
            disabled={isEditing}
            placeholder="Ex: 1234"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="nome">
            Nome da Empresa <span className="text-red-500">*</span>
          </Label>
          <Input
            id="nome"
            value={formData.nome}
            onChange={(e) => handleChange('nome', e.target.value)}
            placeholder="Razão Social"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="responsavel">
            Responsável <span className="text-red-500">*</span>
          </Label>
          <Select
            value={formData.responsavel || undefined}
            onValueChange={(value) => handleChange('responsavel', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione um responsável" />
            </SelectTrigger>
            <SelectContent>
              {users.map((user) => (
                <SelectItem key={`resp-${user.id}`} value={user.name}>
                  {user.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="atividade">
            Atividade <span className="text-red-500">*</span>
          </Label>
          <Select
            value={formData.atividade || undefined}
            onValueChange={(value) => handleChange('atividade', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione a atividade" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Comercio">Comercio</SelectItem>
              <SelectItem value="Industria">Industria</SelectItem>
              <SelectItem value="Serviço">Serviço</SelectItem>
              <SelectItem value="Incorporadora">Incorporadora</SelectItem>
              <SelectItem value="Construtora">Construtora</SelectItem>
              <SelectItem value="Adm. de Bens">Adm. de Bens</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="regimeTributario">Regime Tributário</Label>
          <Select
            value={formData.regimeTributario || undefined}
            onValueChange={(value) => handleChange('regimeTributario', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione o regime" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Lucro Real Mensal">Lucro Real Mensal</SelectItem>
              <SelectItem value="Lucro Real Trimestral">Lucro Real Trimestral</SelectItem>
              <SelectItem value="Lucro Presumido">Lucro Presumido</SelectItem>
              <SelectItem value="Simples Nacional">Simples Nacional</SelectItem>
              <SelectItem value="Simples Nacional Hibrido">Simples Nacional Hibrido</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="fechamento">Fechamento</Label>
          <Input
            id="fechamento"
            value={formData.fechamento}
            onChange={(e) => handleChange('fechamento', e.target.value)}
            placeholder="Ex: Dia 5"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="fiscal">Status Fiscal</Label>
          <Select value={formData.fiscal} onValueChange={(value) => handleChange('fiscal', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Pendente">Pendente</SelectItem>
              <SelectItem value="Verificada">Verificada</SelectItem>
              <SelectItem value="Em Análise">Em Análise</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2 border-t pt-4">
        <Label>Opções Adicionais</Label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="depreciacao"
              checked={formData.depreciacao}
              onCheckedChange={(c) => handleChange('depreciacao', !!c)}
            />
            <Label htmlFor="depreciacao" className="font-normal cursor-pointer">
              Depreciação
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="extratos"
              checked={formData.extratos}
              onCheckedChange={(c) => handleChange('extratos', !!c)}
            />
            <Label htmlFor="extratos" className="font-normal cursor-pointer">
              Extratos
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="parcelamentos"
              checked={formData.parcelamentos}
              onCheckedChange={(c) => handleChange('parcelamentos', !!c)}
            />
            <Label htmlFor="parcelamentos" className="font-normal cursor-pointer">
              Parcelamentos
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="distribuicaoLucro"
              checked={formData.distribuicaoLucro}
              onCheckedChange={(c) => handleChange('distribuicaoLucro', !!c)}
            />
            <Label htmlFor="distribuicaoLucro" className="font-normal cursor-pointer">
              Distribuição de Lucro
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="receitaFinanceira"
              checked={formData.receitaFinanceira}
              onCheckedChange={(c) => handleChange('receitaFinanceira', !!c)}
            />
            <Label htmlFor="receitaFinanceira" className="font-normal cursor-pointer">
              Receita Financeira
            </Label>
          </div>
        </div>
      </div>

      <div className="space-y-2 border-t pt-4">
        <Label htmlFor="observacoes">Observações</Label>
        <Textarea
          id="observacoes"
          value={formData.observacoes}
          onChange={(e) => handleChange('observacoes', e.target.value)}
          placeholder="Anotações sobre a empresa..."
          rows={3}
        />
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Salvando...' : 'Salvar Empresa'}
        </Button>
      </div>
    </form>
  )
}
