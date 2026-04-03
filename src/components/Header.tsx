import { useEffect, useState } from 'react'
import { Search, Bell, FileText, User } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { useSearch } from '@/context/SearchContext'
import { useAuth } from '@/hooks/use-auth'
import { supabase } from '@/lib/supabase/client'

export function Header() {
  const { searchTerm, setSearchTerm } = useSearch()
  const { user } = useAuth()
  const [profile, setProfile] = useState<{ name: string; role: string } | null>(null)

  useEffect(() => {
    if (user) {
      supabase
        .from('profiles')
        .select('name, role')
        .eq('user_id', user.id)
        .maybeSingle()
        .then(({ data }) => {
          if (data) setProfile(data as any)
        })
    }
  }, [user])

  const userName =
    profile?.name || user?.user_metadata?.name || user?.email?.split('@')[0] || 'Usuário'
  const userRole = profile?.role || user?.user_metadata?.role || 'Usuário'

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
          <span className="text-sm font-bold text-gray-900 leading-none tracking-tight truncate max-w-[150px]">
            {userName}
          </span>
          <span className="text-[11px] font-semibold text-gray-400 mt-1 capitalize">
            {userRole}
          </span>
        </div>
        <div className="h-11 w-11 rounded-full overflow-hidden border-2 border-white shadow-md ml-1 shrink-0 bg-gray-100 flex items-center justify-center">
          {user?.user_metadata?.avatar_url ? (
            <img
              src={user.user_metadata.avatar_url}
              alt={userName}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gray-900 text-white font-bold text-sm">
              {userName.substring(0, 2).toUpperCase()}
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
