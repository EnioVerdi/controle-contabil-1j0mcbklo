import { cn } from '@/lib/utils'

function LegendItem({
  color,
  title,
  value,
  progress,
}: {
  color: string
  title: string
  value: string
  progress: number
}) {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={cn('w-2 h-2 rounded-full', color)}></div>
          <span className="text-xs font-semibold text-gray-500">{title}</span>
        </div>
      </div>
      <span className="text-sm font-bold text-gray-900 leading-none">{value}</span>
      <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden mt-0.5">
        <div className={cn('h-full rounded-full', color)} style={{ width: `${progress}%` }}></div>
      </div>
    </div>
  )
}

export function TopCategories() {
  return (
    <div className="bg-white rounded-[24px] p-6 shadow-[0_2px_20px_rgba(0,0,0,0.02)] h-full flex flex-col">
      <h3 className="font-bold text-gray-900 text-lg mb-6">Top Performing Categories</h3>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-8 flex-1">
        {/* Bubbles Visualization */}
        <div className="relative w-[180px] h-[180px] shrink-0 mx-auto">
          {/* Green Bubble (Top) */}
          <div className="absolute top-0 right-4 w-[115px] h-[115px] rounded-full bg-[#22c55e] flex flex-col items-center justify-center text-white z-10 shadow-[0_8px_16px_rgba(34,197,94,0.3)] transition-transform hover:scale-105 cursor-pointer">
            <span className="text-[10px] font-semibold opacity-90 text-center leading-tight px-2">
              Enterprise Fee
            </span>
            <span className="text-lg font-bold tracking-tight mt-0.5">$1,250</span>
          </div>

          {/* Blue Bubble (Bottom Left) */}
          <div className="absolute bottom-2 left-0 w-[110px] h-[110px] rounded-full bg-[#3b82f6] flex flex-col items-center justify-center text-white z-20 shadow-[0_8px_16px_rgba(59,130,246,0.3)] transition-transform hover:scale-105 cursor-pointer">
            <span className="text-[9px] font-semibold opacity-90 text-center leading-tight px-4">
              One Time Purchase
            </span>
            <span className="text-base font-bold tracking-tight mt-0.5">$1,120</span>
          </div>

          {/* Yellow Bubble (Bottom Right) */}
          <div className="absolute bottom-1 right-2 w-[75px] h-[75px] rounded-full bg-[#eab308] flex flex-col items-center justify-center text-white z-30 shadow-[0_6px_12px_rgba(234,179,8,0.3)] transition-transform hover:scale-105 cursor-pointer border-2 border-white">
            <span className="text-base font-bold tracking-tight mt-1">$663</span>
            <span className="text-[8px] font-semibold opacity-90 mt-0.5 text-center px-1 leading-[1]">
              Service Fees
            </span>
          </div>
        </div>

        {/* Legend List */}
        <div className="w-full sm:w-auto flex-1 flex flex-col justify-center gap-5">
          <LegendItem
            color="bg-[#22c55e]"
            title="Enterprise Fee"
            value="$1,250 (90%)"
            progress={90}
          />
          <LegendItem
            color="bg-[#3b82f6]"
            title="One Time Purchase"
            value="$1,120 (80%)"
            progress={80}
          />
          <LegendItem color="bg-[#eab308]" title="Service Fees" value="$663 (45%)" progress={45} />
        </div>
      </div>
    </div>
  )
}
