import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Pencil, Trash2, ShieldCheck, AlertCircle } from 'lucide-react'
import { Empresa } from '@/types/empresa'

interface Props {
  empresa: Empresa
  onEdit: () => void
  onDelete: () => void
}

export function EmpresaDetailsHeader({ empresa, onEdit, onDelete }: Props) {
  const navigate = useNavigate()
  const [imgError, setImgError] = useState(false)
  const isVerified = empresa.fiscal === 'Verificada'

  const initials = empresa.nome
    ? empresa.nome
        .split(' ')
        .filter((n) => n.length > 0)
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : 'EM'

  return (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(-1)}
          className="rounded-full hover:bg-slate-100 shrink-0"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex items-center gap-4">
          {empresa.logo && !imgError ? (
            <img
              src={empresa.logo}
              alt={empresa.nome}
              onError={() => setImgError(true)}
              className="w-12 h-12 rounded-xl object-cover shadow-sm border border-slate-200 bg-white shrink-0"
            />
          ) : (
            <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-slate-100 text-slate-600 font-semibold shadow-sm border border-slate-200 text-lg shrink-0">
              {initials}
            </div>
          )}
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{empresa.nome}</h1>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-sm text-slate-500 font-medium">Cód: {empresa.id}</span>
              <Badge
                variant="secondary"
                className={
                  isVerified
                    ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-transparent'
                    : 'bg-amber-100 text-amber-700 hover:bg-amber-100 border-transparent'
                }
              >
                {isVerified ? (
                  <>
                    <ShieldCheck className="w-3 h-3 mr-1" /> Verificada
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-3 h-3 mr-1" /> Pendente
                  </>
                )}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 w-full md:w-auto mt-4 md:mt-0">
        <Button variant="outline" className="flex-1 md:flex-none" onClick={onEdit}>
          <Pencil className="w-4 h-4 mr-2" /> Editar
        </Button>
        <Button variant="destructive" className="flex-1 md:flex-none" onClick={onDelete}>
          <Trash2 className="w-4 h-4 mr-2" /> Excluir
        </Button>
      </div>
    </div>
  )
}
