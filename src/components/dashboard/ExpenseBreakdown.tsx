import { ArrowRightLeft } from 'lucide-react'

export function ExpenseBreakdown({
  stats = { total: 0, concluido: 0, pendente: 0, aberto: 0 },
}: {
  stats?: any
}) {
  const percentConcluido = stats.total ? Math.round((stats.concluido / stats.total) * 100) : 0
  const percentPendente = stats.total ? Math.round((stats.pendente / stats.total) * 100) : 0
  const percentAberto = stats.total ? Math.round((stats.aberto / stats.total) * 100) : 0

  return (
    <div className="bg-white rounded-[24px] p-6 shadow-[0_2px_20px_rgba(0,0,0,0.02)] relative h-[380px] flex flex-col">
      <div className="flex justify-between items-center relative z-10 mb-2">
        <h3 className="font-bold text-gray-900 text-lg">Distribuição de Tarefas</h3>
        <button className="h-8 w-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors">
          <ArrowRightLeft className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="relative flex-1 w-full rounded-xl overflow-hidden mt-4 bg-gray-50/30">
        {/* Background SVG for responsive connecting lines */}
        <svg
          className="absolute inset-0 w-full h-full z-0"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="lineGrad1" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#a7f3d0" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#6ee7b7" stopOpacity="0.4" />
            </linearGradient>
            <linearGradient id="lineGrad2" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#cbd5e1" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#94a3b8" stopOpacity="0.4" />
            </linearGradient>
            <linearGradient id="lineGrad3" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#fde047" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#facc15" stopOpacity="0.4" />
            </linearGradient>
          </defs>

          {/* Left to Center paths */}
          <path
            d="M 20 18 C 35 18, 35 50, 50 50"
            stroke="url(#lineGrad1)"
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M 20 50 C 35 50, 35 50, 50 50"
            stroke="url(#lineGrad2)"
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M 20 82 C 35 82, 35 50, 50 50"
            stroke="url(#lineGrad3)"
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
          />

          {/* Center to Right paths */}
          <path
            d="M 50 50 C 65 50, 65 18, 80 18"
            stroke="#86efac"
            strokeWidth="6"
            fill="none"
            strokeLinecap="round"
            opacity="0.6"
          />
          <path
            d="M 50 50 C 65 50, 65 50, 80 50"
            stroke="#cbd5e1"
            strokeWidth="16"
            fill="none"
            strokeLinecap="round"
            opacity="0.4"
          />
          <path
            d="M 50 50 C 65 50, 65 82, 80 82"
            stroke="#fef08a"
            strokeWidth="10"
            fill="none"
            strokeLinecap="round"
            opacity="0.6"
          />
        </svg>

        {/* Left Nodes */}
        <div className="absolute top-[18%] left-[20%] -translate-x-1/2 -translate-y-1/2 flex items-center gap-2 bg-white rounded-full pr-3 pl-1 py-1 shadow-sm border border-gray-100 z-10 min-w-max">
          <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-[10px] font-bold text-green-600">
            {stats.concluido}
          </div>
          <span className="text-[9px] font-bold text-gray-600 whitespace-nowrap">
            Tarefas Concluídas
          </span>
        </div>
        <div className="absolute top-[50%] left-[20%] -translate-x-1/2 -translate-y-1/2 flex items-center gap-2 bg-white rounded-full pr-3 pl-1 py-1 shadow-sm border border-gray-100 z-10 min-w-max">
          <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-500">
            {stats.pendente}
          </div>
          <span className="text-[9px] font-bold text-gray-600 whitespace-nowrap">
            Tarefas Pendentes
          </span>
        </div>
        <div className="absolute top-[82%] left-[20%] -translate-x-1/2 -translate-y-1/2 flex items-center gap-2 bg-white rounded-full pr-3 pl-1 py-1 shadow-sm border border-gray-100 z-10 min-w-max">
          <div className="w-6 h-6 rounded-full bg-yellow-100 flex items-center justify-center text-[10px] font-bold text-yellow-600">
            {stats.aberto}
          </div>
          <span className="text-[9px] font-bold text-gray-600 whitespace-nowrap">
            Tarefas em Aberto
          </span>
        </div>

        {/* Center Node */}
        <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 z-20">
          <div className="w-16 h-16 bg-white rounded-full flex flex-col items-center justify-center shadow-lg border-4 border-gray-50/80">
            <span className="text-[9px] font-semibold text-gray-400 leading-none mb-0.5">
              Total
            </span>
            <span className="text-sm font-bold text-gray-900 leading-none">{stats.total}</span>
          </div>
        </div>

        {/* Right Nodes */}
        <div className="absolute top-[18%] left-[80%] -translate-x-1/2 -translate-y-1/2 z-10">
          <div className="bg-[#22c55e] text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-md">
            {percentConcluido}%
          </div>
        </div>
        <div className="absolute top-[50%] left-[80%] -translate-x-1/2 -translate-y-1/2 z-10">
          <div className="bg-[#94a3b8] text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-md">
            {percentPendente}%
          </div>
        </div>
        <div className="absolute top-[82%] left-[80%] -translate-x-1/2 -translate-y-1/2 z-10">
          <div className="bg-[#eab308] text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-md">
            {percentAberto}%
          </div>
        </div>
      </div>

      <div className="mt-4 text-center z-10 pt-2 border-t border-dashed border-gray-200/60">
        <p className="text-[13px] font-medium text-gray-500">
          Você tem{' '}
          <strong className="text-gray-900 font-bold">
            {stats.pendente + stats.aberto} tarefas
          </strong>{' '}
          pendentes ou abertas neste período.
        </p>
      </div>
    </div>
  )
}
