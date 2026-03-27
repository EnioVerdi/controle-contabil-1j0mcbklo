import { cn } from '@/lib/utils'
import { TrendingUp, TrendingDown } from 'lucide-react'

interface KpiCardProps {
  title: string
  value: string | React.ReactNode
  target?: string
  trend: number
  trendLabel?: string
  progress: number
  colorClass: string
  progressColorClass: string
}

export function KpiCard({
  title,
  value,
  target,
  trend,
  trendLabel = 'From last week',
  progress,
  colorClass,
  progressColorClass,
}: KpiCardProps) {
  const isPositive = trend > 0
  const TrendIcon = isPositive ? TrendingUp : TrendingDown

  return (
    <div className="bg-white rounded-[24px] p-6 flex justify-between items-center shadow-[0_2px_20px_rgba(0,0,0,0.02)] transition-all hover:shadow-[0_4px_25px_rgba(0,0,0,0.04)]">
      <div className="flex flex-col gap-2 relative z-10">
        <span className="text-sm font-semibold text-muted-foreground">{title}</span>

        <div className="flex items-baseline gap-1 mt-1">
          <span className="text-2xl lg:text-3xl font-bold text-gray-900 tracking-tight">
            {value}
          </span>
          {target && <span className="text-sm font-medium text-gray-400">/{target}</span>}
        </div>

        <div className="flex items-center gap-2 mt-2">
          <div
            className={cn(
              'flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md',
              isPositive ? 'bg-green-100/80 text-green-600' : 'bg-red-100/80 text-red-600',
            )}
          >
            {isPositive ? '+' : ''}
            {trend}%
          </div>
          <span className="text-[11px] font-medium text-gray-400">{trendLabel}</span>
        </div>
      </div>

      <div className="h-[72px] w-10 bg-gray-50 rounded-full flex flex-col justify-end p-1 relative overflow-hidden shrink-0 shadow-inner">
        <div
          className={cn(
            'w-full rounded-full flex flex-col justify-start items-center pt-2 transition-all duration-1000 ease-out',
            progressColorClass,
          )}
          style={{ height: `${progress}%` }}
        >
          <span className="text-[9px] font-bold text-white leading-none tracking-tighter">
            {progress}%
          </span>
        </div>
      </div>
    </div>
  )
}
