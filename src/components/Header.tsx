import { Search, Bell, FileText } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { useSearch } from '@/context/SearchContext'

export function Header() {
  const { searchTerm, setSearchTerm } = useSearch()

  return (
    <header className="sticky top-0 z-30 flex h-24 items-center gap-4 bg-transparent px-8">
      <SidebarTrigger className="lg:hidden" />

      <div className="flex flex-1 items-center gap-4">
        <div className="relative w-full max-w-[320px]">
          <Search className="absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Buscar..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-full bg-white pl-11 pr-4 h-12 border-none shadow-[0_2px_15px_rgba(0,0,0,0.02)] text-sm font-medium placeholder:text-gray-400 focus-visible:ring-1 focus-visible:ring-gray-200"
          />
        </div>
      </div>

      <div className="flex items-center gap-5 pl-4">
        <Button
          variant="ghost"
          size="icon"
          className="relative rounded-full hover:bg-white shadow-sm bg-white/50 h-10 w-10 text-gray-500"
        >
          <FileText className="h-5 w-5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="relative rounded-full hover:bg-white shadow-sm bg-white/50 h-10 w-10 text-gray-500"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-red-500 border-2 border-white" />
        </Button>

        <div className="hidden flex-col items-end sm:flex ml-2">
          <span className="text-sm font-bold text-gray-900 leading-none tracking-tight">
            John Andre
          </span>
          <span className="text-[11px] font-semibold text-gray-400 mt-1">Gerente de Negócios</span>
        </div>
        <div className="h-11 w-11 rounded-full overflow-hidden border-2 border-white shadow-md ml-1 shrink-0">
          <img
            src="https://img.usecurling.com/ppl/thumbnail?gender=male&seed=1"
            alt="John Andre"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </header>
  )
}
