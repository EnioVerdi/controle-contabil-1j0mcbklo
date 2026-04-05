import { useState, useRef } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useToast } from '@/hooks/use-toast'
import { useAuth } from '@/hooks/use-auth'
import { importEmpresas } from '@/services/empresas'
import { Empresa } from '@/types/empresa'
import { UploadCloud, AlertTriangle, FileText, CheckCircle2 } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

interface ImportCsvDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
  existingEmpresas: Empresa[]
}

export function ImportCsvDialog({
  open,
  onOpenChange,
  onSuccess,
  existingEmpresas,
}: ImportCsvDialogProps) {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<any[]>([])
  const [duplicates, setDuplicates] = useState<any[]>([])
  const [duplicateAction, setDuplicateAction] = useState<'skip' | 'overwrite'>('skip')
  const [isLoading, setIsLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()
  const { user, session } = useAuth()

  const resetState = () => {
    setFile(null)
    setPreview([])
    setDuplicates([])
    setDuplicateAction('skip')
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) resetState()
    onOpenChange(newOpen)
  }

  const parseCSV = (text: string) => {
    const lines = text.split(/\r?\n/).filter((line) => line.trim().length > 0)
    if (lines.length < 2) throw new Error('O arquivo CSV está vazio ou sem dados.')

    const headers = lines[0].split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map((h) =>
      h
        .trim()
        .replace(/^"|"$/g, '')
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, ''),
    )

    const idxId = headers.findIndex((h) => h === 'codigo')
    const idxNome = headers.findIndex((h) => h === 'nome')
    const idxAtividade = headers.findIndex((h) => h === 'atividade')
    const idxRegime = headers.findIndex((h) => h.includes('regime') && h.includes('tributario'))
    const idxFechamento = headers.findIndex((h) => h === 'fechamento')

    if (
      idxId === -1 ||
      idxNome === -1 ||
      idxAtividade === -1 ||
      idxRegime === -1 ||
      idxFechamento === -1
    ) {
      throw new Error(
        'Colunas inválidas. O CSV deve conter: Código, Nome, Atividade, Regime Tributário, Fechamento',
      )
    }

    const result = []
    for (let i = 1; i < lines.length; i++) {
      const columns = lines[i]
        .split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/)
        .map((c) => c.trim().replace(/^"|"$/g, ''))
      if (columns.length < 5) continue

      if (!columns[idxId]) continue

      result.push({
        id: columns[idxId],
        nome: columns[idxNome] || 'Sem Nome',
        atividade: columns[idxAtividade] || 'Não Informada',
        regimeTributario: columns[idxRegime] || '',
        fechamento: columns[idxFechamento] || '',
      })
    }
    return result
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0]
    if (!selected) return
    setFile(selected)

    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string
        const parsed = parseCSV(text)
        setPreview(parsed)

        const existingIds = new Set(existingEmpresas.map((emp) => emp.id))
        const dups = parsed.filter((p) => existingIds.has(p.id))
        setDuplicates(dups)
      } catch (err: any) {
        toast({ title: 'Erro ao ler CSV', description: err.message, variant: 'destructive' })
        resetState()
      }
    }
    reader.readAsText(selected)
  }

  const handleImport = async () => {
    if (!user || !session) {
      toast({
        title: 'Erro de Autenticação',
        description:
          'Você precisa estar logado para realizar a importação. Sua sessão pode ter expirado.',
        variant: 'destructive',
      })
      return
    }

    if (preview.length === 0) return

    setIsLoading(true)
    try {
      await importEmpresas(preview, duplicateAction)
      toast({
        title: 'Importação Concluída',
        description: `${preview.length} empresas processadas com sucesso.`,
      })
      onSuccess()
      handleOpenChange(false)
    } catch (error: any) {
      let errorMessage = error.message || 'Ocorreu um erro inesperado.'

      if (errorMessage.includes('Failed to fetch') || errorMessage.includes('Not Found')) {
        errorMessage =
          'Serviço de validação indisponível (Erro 404). Verifique se as Edge Functions estão ativas e acessíveis.'
      } else if (
        errorMessage.includes('Unauthorized') ||
        errorMessage.includes('permissão') ||
        errorMessage.includes('401') ||
        errorMessage.includes('Acesso Negado')
      ) {
        errorMessage =
          'Você não tem permissão para realizar esta importação. Esta ação é restrita a Administradores.'
      }

      toast({
        title: 'Erro na importação',
        description: errorMessage,
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Importar Empresas via CSV</DialogTitle>
          <DialogDescription>
            Faça upload de um arquivo CSV contendo as colunas:{' '}
            <strong>Código, Nome, Atividade, Regime Tributário, Fechamento</strong>.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {!file ? (
            <div
              className="flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-10 bg-slate-50/50 hover:bg-slate-50 transition-colors cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <UploadCloud className="h-10 w-10 text-muted-foreground mb-4" />
              <p className="text-sm font-medium">Clique para selecionar um arquivo</p>
              <p className="text-xs text-muted-foreground mt-1">Somente arquivos .csv</p>
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 border rounded-xl bg-slate-50">
                <div className="flex items-center gap-3">
                  <FileText className="h-8 w-8 text-blue-600" />
                  <div>
                    <p className="text-sm font-medium">{file.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {preview.length} registros encontrados
                    </p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={resetState}>
                  Trocar Arquivo
                </Button>
              </div>

              {duplicates.length > 0 && (
                <Alert className="bg-amber-50 border-amber-200 text-amber-800">
                  <AlertTriangle className="h-4 w-4 stroke-amber-600" />
                  <AlertTitle className="text-amber-800">
                    Atenção: Duplicatas Encontradas
                  </AlertTitle>
                  <AlertDescription>
                    Encontramos {duplicates.length} código(s) que já existem no sistema. O que
                    deseja fazer?
                    <RadioGroup
                      value={duplicateAction}
                      onValueChange={(val) => setDuplicateAction(val as 'skip' | 'overwrite')}
                      className="mt-3 flex gap-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="skip" id="skip" />
                        <Label htmlFor="skip" className="text-amber-800 cursor-pointer">
                          Pular duplicados
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="overwrite" id="overwrite" />
                        <Label htmlFor="overwrite" className="text-amber-800 cursor-pointer">
                          Sobrescrever existentes
                        </Label>
                      </div>
                    </RadioGroup>
                  </AlertDescription>
                </Alert>
              )}

              <div className="border rounded-xl overflow-hidden">
                <div className="bg-muted px-4 py-2 border-b">
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Prévia dos Dados
                  </h4>
                </div>
                <ScrollArea className="h-[250px]">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[100px]">Código</TableHead>
                        <TableHead>Nome</TableHead>
                        <TableHead>Atividade</TableHead>
                        <TableHead>Regime Trib.</TableHead>
                        <TableHead>Fechamento</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {preview.map((row, i) => (
                        <TableRow key={i}>
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                              {duplicates.some((d) => d.id === row.id) && (
                                <AlertTriangle
                                  className="h-3.5 w-3.5 text-amber-500"
                                  title="Código já existe"
                                />
                              )}
                              {row.id}
                            </div>
                          </TableCell>
                          <TableCell className="truncate max-w-[150px]">{row.nome}</TableCell>
                          <TableCell className="truncate max-w-[150px]">{row.atividade}</TableCell>
                          <TableCell>{row.regimeTributario}</TableCell>
                          <TableCell>{row.fechamento}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </ScrollArea>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => handleOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleImport} disabled={!file || preview.length === 0 || isLoading}>
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin w-4 h-4 border-2 border-current border-t-transparent rounded-full" />
                Importando...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                Confirmar Importação
              </div>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
