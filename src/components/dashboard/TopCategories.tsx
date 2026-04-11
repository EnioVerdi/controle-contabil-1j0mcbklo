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

export function TopCategories({ categories = [] }: { categories?: any[] }) {
  const defaultCategories = [
    { name: 'Lucro Real Mensal', value: 0, percent: 0 },
    { name: 'Lucro Real Trimestral', value: 0, percent: 0 },
    { name: 'Lucro Presumido', value: 0, percent: 0 },
    { name: 'Simples Nacional', value: 0, percent: 0 },
    { name: 'Simples Nacional Híbrido', value: 0, percent: 0 },
  ]

  const normalize = (str: string) =>
    str
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()

  const items = defaultCategories.map((defaultCat) => {
    const found = categories.find((c) => normalize(c.name) === normalize(defaultCat.name))
    return found || defaultCat
  })

  const bubbleConfigs = [
    {
      size: 'w-[115px] h-[115px]',
      pos: 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
      bg: 'bg-[#22c55e]',
      shadow: 'shadow-[0_8px_16px_rgba(34,197,94,0.3)]',
      z: 'z-50',
    },
    {
      size: 'w-[95px] h-[95px]',
      pos: 'top-0 left-0',
      bg: 'bg-[#3b82f6]',
      shadow: 'shadow-[0_8px_16px_rgba(59,130,246,0.3)]',
      z: 'z-40',
    },
    {
      size: 'w-[85px] h-[85px]',
      pos: 'bottom-0 right-2',
      bg: 'bg-[#eab308]',
      shadow: 'shadow-[0_8px_16px_rgba(234,179,8,0.3)]',
      z: 'z-30',
    },
    {
      size: 'w-[75px] h-[75px]',
      pos: 'top-2 right-0',
      bg: 'bg-[#a855f7]',
      shadow: 'shadow-[0_8px_16px_rgba(168,85,247,0.3)]',
      z: 'z-20',
    },
    {
      size: 'w-[70px] h-[70px]',
      pos: 'bottom-2 left-2',
      bg: 'bg-[#f97316]',
      shadow: 'shadow-[0_8px_16px_rgba(249,115,22,0.3)]',
      z: 'z-10',
    },
  ]

  return (
    <div className="bg-white rounded-[24px] p-6 shadow-[0_2px_20px_rgba(0,0,0,0.02)] h-full flex flex-col">
      <h3 className="font-bold text-gray-900 text-lg mb-6">Regimes Tributários</h3>

      <div className="flex flex-col items-center justify-center gap-6 flex-1">
        {/* Bubbles Visualization */}
        <div className="relative w-[200px] h-[200px] shrink-0 mx-auto">
          {items.map((item, index) => {
            const config = bubbleConfigs[index]
            return (
              <div
                key={index}
                className={cn(
                  'absolute rounded-full flex flex-col items-center justify-center text-white transition-transform hover:scale-105 cursor-pointer border-2 border-white',
                  config.pos,
                  config.size,
                  config.bg,
                  config.shadow,
                  config.z,
                )}
              >
                <span className="text-[9px] font-semibold opacity-90 text-center leading-tight px-2">
                  {item.name}
                </span>
                <span className="text-base font-bold tracking-tight mt-0.5">{item.value}</span>
              </div>
            )
          })}
        </div>

        {/* Legend List */}
        <div className="w-full flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
          {items.map((item, index) => {
            const config = bubbleConfigs[index]
            return (
              <LegendItem
                key={index}
                color={config.bg}
                title={item.name}
                value={`${item.value} (${item.percent}%)`}
                progress={item.percent}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}
