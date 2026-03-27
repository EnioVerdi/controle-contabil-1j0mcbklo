import { Card, CardContent } from '@/components/ui/card'
import { Info } from 'lucide-react'

export function SystemInfoCard() {
  return (
    <Card className="bg-slate-50/50 border-dashed border-slate-300 shadow-none">
      <CardContent className="p-4 md:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-sm text-slate-500">
        <div className="flex items-center gap-2 text-slate-700">
          <Info className="w-4 h-4" />
          <span className="font-semibold">Informações do Sistema</span>
        </div>
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-8">
          <div className="flex flex-col">
            <span className="text-xs text-slate-400">Criado em</span>
            <span className="font-medium">10/01/2023</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-slate-400">Atualizado em</span>
            <span className="font-medium">15/10/2023</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-slate-400">Por</span>
            <span className="font-medium">Admin System</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
