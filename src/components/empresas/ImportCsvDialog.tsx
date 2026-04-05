import { useState, useRef } from 'react'
import { Empresa } from '@/types/empresa'
import { useToast } from '@/hooks/use-toast'
import { importEmpresas } from '@/services/empresas'
import { supabase } from '@/lib/supabase/client'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { AlertCircle, UploadCloud } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'

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
  const [preview, setPreview] = useState<Partial<Empresa>[]>([])
  const [duplicates, setDuplicates] = useState<string[]>([])
  const [duplicateAction, setDuplicateAction] = useState<'overwrite' | 'skip'>('skip')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const resetState = () => {
    setFile(null)
    setPreview([])
    setDuplicates([])
    setError(null)
    setDuplicateAction('skip')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) resetState()
    onOpenChange(isOpen)
  }

  const processCsv = (text: string) => {
    try {
      const lines = text.split(/\r?\n/).filter((line) => line.trim())
      if (lines.length < 2) throw new Error('Arquivo CSV está vazio ou sem dados.')

      const delimiter = lines[0].includes(';') ? ';' : ','
      const headers = lines[0]
        .split(delimiter)
        .map((h) => h.trim().toLowerCase().replace(/['"]/g, ''))

      const colMap = {
        id: headers.findIndex((h) => h.includes('código') || h === 'id' || h === 'codigo'),
        nome: headers.findIndex((h) => h.includes('nome')),
        atividade: headers.findIndex((h) => h.includes('atividade')),
        regime: headers.findIndex((h) => h.includes('regime tribut') || h === 'regime'),
        fechamento: headers.findIndex((h) => h.includes('fechamento')),
      }

      if (
        colMap.id === -1 ||
        colMap.nome === -1 ||
        colMap.atividade === -1 ||
        colMap.regime === -1 ||
        colMap.fechamento === -1
      ) {
        throw new Error(
          'Colunas obrigatórias não encontradas. Certifique-se de ter: Código, Nome, Atividade, Regime Tributário, Fechamento.',
        )
      }

      const parsedData: Partial<Empresa>[] = []
      const foundDuplicates: string[] = []

      for (let i = 1; i < lines.length; i++) {
        const cols = lines[i].split(delimiter).map((c) => c.trim().replace(/^['"]|['"]$/g, ''))

        if (cols.length < Math.max(...Object.values(colMap))) continue

        const id = cols[colMap.id]
        const nome = cols[colMap.nome]
        const atividade = cols[colMap.atividade]
        const regimeTributario = cols[colMap.regime]
        const fechamento = cols[colMap.fechamento]

        if (!id || !nome) continue

        parsedData.push({ id, nome, atividade, regimeTributario, fechamento })

        // Usamos array local em vez de requisições HEAD na API para evitar erros "Unexpected end of JSON input"
        if (existingEmpresas.some((e) => e.id === id)) {
          foundDuplicates.push(id)
        }
      }

      if (parsedData.length === 0) {
        throw new Error('Nenhum dado válido encontrado para importar.')
      }

      setPreview(parsedData)
      setDuplicates(foundDuplicates)
    } catch (err: any) {
      setError(err.message || 'Erro ao processar o arquivo CSV.')
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (!selectedFile) return
    setFile(selectedFile)
    setError(null)

    const reader = new FileReader()
    reader.onload = (event) => {
      const text = event.target?.result as string
      processCsv(text)
    }
    reader.onerror = () => setError('Erro ao ler o arquivo.')
    reader.readAsText(selectedFile, 'utf-8')
  }

  const handleImport = async () => {
    if (preview.length === 0) return

    try {
      setIsLoading(true)

      // Validação de autenticação antes de enviar
      const {
        data: { session },
      } = await supabase.auth.getSession()
      if (!session) {
        throw new Error('Usuário não autenticado. Faça login novamente para importar (401).')
      }

      await importEmpresas(preview, duplicateAction)

      toast({
        title: 'Importação Concluída',
        description: `${preview.length} empresas foram processadas com sucesso.`,
      })

      onSuccess()
      handleOpenChange(false)
    } catch (err: any) {
      setError(err.message || 'Erro ao importar dados. Verifique sua permissão ou conexão.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Importar Empresas via CSV</DialogTitle>
          <DialogDescription>
            Faça upload de um arquivo CSV contendo as colunas: Código, Nome, Atividade, Regime
            Tributário, Fechamento.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {!file && (
            <div
              className="border-2 border-dashed rounded-lg p-10 flex flex-col items-center justify-center text-center hover:bg-muted/50 transition-colors cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <UploadCloud className="h-10 w-10 text-muted-foreground mb-4" />
              <p className="text-sm font-medium mb-1">Clique para selecionar um arquivo CSV</p>
              <p className="text-xs text-muted-foreground">ou arraste e solte aqui</p>
              <input
                type="file"
                accept=".csv"
                className="hidden"
                ref={fileInputRef}
                onChange={handleFileChange}
              />
            </div>
          )}

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Erro</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {preview.length > 0 && !error && (
            <div className="space-y-4 animate-fade-in-up">
              {duplicates.length > 0 && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 space-y-4">
                  <div className="flex items-start gap-3 text-amber-800">
                    <AlertCircle className="h-5 w-5 mt-0.5 shrink-0" />
                    <div>
                      <h4 className="font-semibold text-sm">Atenção: Duplicatas Encontradas</h4>
                      <p className="text-sm mt-1">
                        Foram encontrados {duplicates.length} códigos que já existem no sistema.
                        Como deseja prosseguir?
                      </p>
                    </div>
                  </div>
                  <RadioGroup
                    value={duplicateAction}
                    onValueChange={(v: any) => setDuplicateAction(v)}
                    className="flex flex-col gap-3 ml-8"
                  >
                    <div className="flex items-center space-x-3">
                      <RadioGroupItem value="skip" id="skip" />
                      <Label htmlFor="skip" className="text-sm cursor-pointer font-medium">
                        Pular duplicatas (manter dados atuais)
                      </Label>
                    </div>
                    <div className="flex items-center space-x-3">
                      <RadioGroupItem value="overwrite" id="overwrite" />
                      <Label htmlFor="overwrite" className="text-sm cursor-pointer font-medium">
                        Sobrescrever com os dados do arquivo
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
              )}

              <div className="border rounded-lg overflow-hidden">
                <div className="max-h-60 overflow-auto">
                  <Table>
                    <TableHeader className="bg-muted sticky top-0 z-10">
                      <TableRow>
                        <TableHead>Código</TableHead>
                        <TableHead>Nome</TableHead>
                        <TableHead>Atividade</TableHead>
                        <TableHead>Regime</TableHead>
                        <TableHead>Fechamento</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {preview.slice(0, 10).map((row, i) => (
                        <TableRow key={i}>
                          <TableCell className="font-medium">{row.id}</TableCell>
                          <TableCell>{row.nome}</TableCell>
                          <TableCell>{row.atividade}</TableCell>
                          <TableCell>{row.regimeTributario}</TableCell>
                          <TableCell>{row.fechamento}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                {preview.length > 10 && (
                  <div className="bg-muted/50 p-2 text-center text-xs text-muted-foreground border-t">
                    Mostrando 10 de {preview.length} registros...
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={() => handleOpenChange(false)}>
            Cancelar
          </Button>
          <Button
            onClick={handleImport}
            disabled={!file || !!error || preview.length === 0 || isLoading}
            className="gap-2"
          >
            {isLoading ? (
              <div className="h-4 w-4 rounded-full border-2 border-background border-t-transparent animate-spin" />
            ) : (
              <UploadCloud className="h-4 w-4" />
            )}
            Confirmar Importação
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
