import { Search, Bell, FileText } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { useSearch } from '@/context/SearchContext'

export function Header() {
  const { searchTerm, setSearchTerm } = useSearch()

  return (
    <header className="sticky top-0 z-30 flex h-20 items-center gap-4 border-b bg-background/95 px-6 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <SidebarTrigger className="lg:hidden" />

      <div className="flex flex-1 items-center gap-4">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Pesquisar por nome ou código..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl bg-white pl-10 pr-4 h-11 border-none shadow-sm focus-visible:ring-1 focus-visible:ring-primary/20"
          />
        </div>
      </div>

      <div className="flex items-center gap-4 pl-4">
        <Button variant="ghost" size="icon" className="relative rounded-full">
          <FileText className="h-5 w-5 text-muted-foreground" />
        </Button>
        <Button variant="ghost" size="icon" className="relative rounded-full">
          <Bell className="h-5 w-5 text-muted-foreground" />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-background" />
        </Button>

        <div className="hidden md:flex h-8 w-px bg-border mx-2" />

        <div className="flex items-center gap-3">
          <div className="hidden flex-col items-end sm:flex">
            <span className="text-sm font-semibold text-foreground leading-none">John Andre</span>
            <span className="text-xs text-muted-foreground mt-1">Business Manager</span>
          </div>
          <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
            <AvatarImage
              src="https://img.usecurling.com/ppl/thumbnail?gender=male&seed=1"
              alt="John Andre"
            />
            <AvatarFallback>JA</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  )
}
